const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/analytics.js'), 'utf8');
const cookieName = '__Host-kurashi-analytics-preference';
const disableKey = 'ga-disable-G-28D2LPB1XC';

function loadPage(options = {}) {
  const jar = options.jar || new Map();
  const listeners = new Map();
  const scripts = [];
  const notices = [];
  const writes = [];
  const timers = [];
  const location = new URL(options.url || 'https://kurashi-partner-ku.com/');
  let sandbox;
  const document = {
    readyState: options.loading ? 'loading' : 'complete',
    visibilityState: 'visible',
    head: { appendChild(element) {
      assert.equal(sandbox.window[disableKey], false, 'must be enabled before loading gtag');
      scripts.push(element);
    } },
    body: { appendChild(element) { notices.push(element); } },
    createElement(tag) {
      return {tag,style:{},attributes:{},setAttribute(k,v){this.attributes[k]=v;},remove(){this.removed=true;}};
    },
    addEventListener(name, callback) {
      listeners.set('document:' + name, callback);
    }
  };
  Object.defineProperty(document, 'cookie', {
    get() {
      if (options.throwRead) throw new Error('Cookie unavailable');
      return [...jar].map(([k,v]) => k + '=' + v).join('; ');
    },
    set(value) {
      writes.push(value);
      if (options.throwWrite) throw new Error('Cookie write denied');
      if (!options.blockWrite) {
        const [pair] = value.split(';');
        const index = pair.indexOf('=');
        jar.set(pair.slice(0,index),pair.slice(index+1));
      }
    }
  });
  const window = {
    location,
    dataLayer: [],
    addEventListener(name, callback) { listeners.set('window:' + name, callback); },
    localStorage: {setItem(){if(options.blockStorage) throw new Error('Storage denied');}},
    setTimeout(callback, delay){timers.push({callback,delay});}
  };
  if (options.externalOptOut) window[disableKey] = true;
  const history = {
    state: {preserve:'existing'},
    replaceState(state, title, value) {
      assert.deepEqual(state, {preserve:'existing'});
      const next = new URL(value, location);
      location.href = next.href;
    }
  };
  sandbox = { window, document, history, URL, Date };
  const context = vm.createContext(sandbox);
  vm.runInContext(source, context);
  return {window,jar,document,scripts,notices,writes,timers,listeners,context,location,
    runAgain(){vm.runInContext(source,context);},
    fire(name,event={}){listeners.get(name)?.(event);}};
}

test('ordinary visitors initialize the existing measurement ID once', () => {
  const p=loadPage();
  assert.equal(p.window[disableKey],false);
  assert.equal(p.scripts.length,1);
  assert.equal(p.scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=G-28D2LPB1XC');
  assert.equal(p.window.dataLayer.length,2);
  assert.deepEqual(Array.from(p.window.dataLayer[1]),['config','G-28D2LPB1XC']);
  assert.equal(p.notices.length,0);
  p.runAgain(); assert.equal(p.scripts.length,1);
});

test('first off navigation suppresses tag load, config and all future event calls', () => {
  const p=loadPage({url:'https://kurashi-partner-ku.com/?analytics=off'});
  assert.equal(p.window[disableKey],true);
  assert.equal(p.scripts.length,0);
  assert.equal(p.jar.get(cookieName),'off');
  for(const event of ['page_view','scroll','click','outbound_click','generate_lead','purchase','custom']) {
    p.window.gtag('event',event);
  }
  assert.equal(p.window.dataLayer.length,0);
  assert.equal(p.location.search,'');
  assert.match(p.notices[0].textContent,/除外されました/);
});

test('cookie is persistent, secure, host-only and shared across all paths', () => {
  const p=loadPage({url:'https://kurashi-partner-ku.com/?analytics=off'});
  const cookie=p.writes[0];
  assert.match(cookie,/Path=\//);
  assert.match(cookie,/Max-Age=31536000/);
  assert.match(cookie,/Expires=/);
  assert.match(cookie,/SameSite=Lax; Secure/);
  assert.doesNotMatch(cookie,/Domain=/i);
  p.jar.set('_ga','existing-client-cookie');
  for(const url of ['https://kurashi-partner-ku.com/','https://kurashi-partner-ku.com/security/','https://kurashi-partner-ku.com/security/tokyo/setagaya/']) {
    const next=loadPage({url,jar:p.jar});
    assert.equal(next.window[disableKey],true);
    assert.equal(next.scripts.length,0);
    assert.equal(next.jar.get('_ga'),'existing-client-cookie');
  }
});

test('only analytics parameters are removed, preserving raw query encoding and hash', () => {
  const p=loadPage({url:'https://kurashi-partner-ku.com/security/camera/?q=a%20b&analytics=off&tag=x&tag=y&plus=%2B&empty=#details'});
  assert.equal(p.location.href,'https://kurashi-partner-ku.com/security/camera/?q=a%20b&tag=x&tag=y&plus=%2B&empty=#details');
});

test('encoded analytics key and conflicting values cannot defeat off', () => {
  const p=loadPage({url:'https://kurashi-partner-ku.com/?analytics=on&%61nalytics=off&x=1#keep'});
  assert.equal(p.window[disableKey],true);
  assert.equal(p.location.href,'https://kurashi-partner-ku.com/?x=1#keep');
});

test('on verifies persistence before resuming GA4 and cleans page_location first', () => {
  const jar=new Map([[cookieName,'off']]);
  const p=loadPage({jar,url:'https://kurashi-partner-ku.com/?analytics=on&keep=1#media'});
  assert.equal(p.jar.get(cookieName),'on');
  assert.equal(p.window[disableKey],false);
  assert.equal(p.scripts.length,1);
  assert.match(p.notices[0].textContent,/除外設定を解除しました/);
  assert.equal(p.location.href,'https://kurashi-partner-ku.com/?keep=1#media');
  p.window.gtag('event','click');
  assert.equal(p.window.dataLayer.length,3);
  const next=loadPage({jar});
  assert.equal(next.scripts.length,1);
});

for (const mode of ['blockWrite','throwWrite','throwRead']) {
  test(mode + ' fails closed, reports failure, and never reports success', () => {
    const p=loadPage({url:'https://kurashi-partner-ku.com/?analytics=off',[mode]:true});
    assert.equal(p.window[disableKey],true);
    assert.equal(p.scripts.length,0);
    assert.match(p.notices[0].textContent,/保存できませんでした/);
    assert.doesNotMatch(p.notices[0].textContent,/除外されました/);
    p.fire('window:focus');
    assert.equal(p.scripts.length,0);
  });
}

test('failed opt-in keeps the old opt-out and does not claim success', () => {
  const p=loadPage({jar:new Map([[cookieName,'off']]),url:'https://kurashi-partner-ku.com/?analytics=on',blockWrite:true});
  assert.equal(p.window[disableKey],true);
  assert.equal(p.scripts.length,0);
  assert.match(p.notices[0].textContent,/保存できませんでした/);
});

test('open tabs synchronize off/on without reloading gtag or replaying excluded events', () => {
  const jar=new Map();
  const p=loadPage({jar});
  loadPage({jar,url:'https://kurashi-partner-ku.com/?analytics=off'});
  p.fire('window:storage',{key:'kurashi:analytics-preference'});
  assert.equal(p.window[disableKey],true);
  p.window.gtag('event','excluded_click');
  assert.equal(p.window.dataLayer.length,2);
  loadPage({jar,url:'https://kurashi-partner-ku.com/?analytics=on'});
  p.fire('window:focus');
  assert.equal(p.window[disableKey],false);
  assert.equal(p.scripts.length,1);
  p.window.gtag('event','resumed_click');
  assert.equal(p.window.dataLayer.length,3);
});

test('a previously excluded tab can start after opt-in from another tab', () => {
  const jar=new Map([[cookieName,'off']]);
  const p=loadPage({jar});
  assert.equal(p.scripts.length,0);
  loadPage({jar,url:'https://kurashi-partner-ku.com/?analytics=on'});
  p.fire('window:pageshow');
  assert.equal(p.scripts.length,1);
});

test('localStorage failure does not invalidate the authoritative cookie', () => {
  const p=loadPage({url:'https://kurashi-partner-ku.com/?analytics=off',blockStorage:true});
  assert.equal(p.jar.get(cookieName),'off');
  assert.equal(p.window[disableKey],true);
  assert.match(p.notices[0].textContent,/除外されました/);
});

test('existing external disable flag is never overridden', () => {
  const p=loadPage({url:'https://kurashi-partner-ku.com/?analytics=on',externalOptOut:true});
  assert.equal(p.window[disableKey],true);
  assert.equal(p.scripts.length,0);
});

test('notification waits for the body, is accessible and dismisses itself', () => {
  const p=loadPage({url:'https://kurashi-partner-ku.com/?analytics=off',loading:true});
  assert.equal(p.notices.length,0);
  p.fire('document:DOMContentLoaded');
  assert.equal(p.notices[0].attributes.role,'status');
  assert.equal(p.notices[0].attributes['aria-live'],'polite');
  assert.equal(p.timers[0].delay,6000);
  p.timers[0].callback();
  assert.equal(p.notices[0].removed,true);
});

test('unknown operations do not change URLs, cookies or regular tracking', () => {
  const p=loadPage({url:'https://kurashi-partner-ku.com/?analytics=unknown&x=1'});
  assert.equal(p.scripts.length,1);
  assert.equal(p.writes.length,0);
  assert.equal(p.location.search,'?analytics=unknown&x=1');
});

function pages(dir) {
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name==='tests') return [];
    const file=path.join(dir,entry.name);
    return entry.isDirectory()?pages(file):entry.name.endsWith('.html')?[file]:[];
  });
}
test('all production HTML pages load the synchronous bootstrap exactly once first', () => {
  const htmlPages=pages(root);
  assert.ok(htmlPages.length >= 10);
  for(const file of htmlPages) {
    const html=fs.readFileSync(file,'utf8');
    const tags=Array.from(html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g));
    const ga=tags.filter(m=>/assets\/analytics\.js\?v=20261013-1$/.test(m[1]));
    assert.equal(ga.length,1,file);
    assert.equal(tags[0][0],ga[0][0],file + ' GA4 bootstrap is first');
    assert.doesNotMatch(ga[0][0],/\b(async|defer)\b/,file);
    assert.ok(html.indexOf(ga[0][0])<html.indexOf('</head>'));
    assert.equal(path.resolve(path.dirname(file),ga[0][1].split('?')[0]),path.join(root,'assets','analytics.js'));
  }
});
