const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const pages=['security/index.html','security/tokyo/index.html','security/camera/index.html','security/tokyo/setagaya/index.html','security/tokyo/taito/index.html','security/tokyo/katsushika/index.html','security/tokyo/adachi/index.html','security/tokyo/ota/index.html','security/tokyo/nerima/index.html'];
for(const rel of pages){const html=read(rel);assert.ok(html.includes('canonical'),rel+' canonical');assert.ok(!html.includes('noindex,follow'),rel+' must remain indexable on parent');assert.ok(html.includes('security.css'),rel+' shared CSS');assert.ok(html.includes('security-data.js'),rel+' data source');assert.ok(html.includes('security.js'),rel+' shared UI');}
for(const asset of ['assets/security/home-security-hero.png','assets/security/security-entrance.png','assets/security/security-garden.png','assets/security/camera-forms.png'])assert.ok(fs.existsSync(path.join(root,asset)),asset);
const data=read('assets/security/security-data.js');for(const city of ['setagaya','taito','katsushika','adachi','ota','nerima'])assert.ok(data.includes(city+":"),city);
const sandbox={window:{}};vm.runInNewContext(data,sandbox,{filename:'security-data.js'});const portal=sandbox.window.SecurityPortal;
const representativeCalculations=[
  ['setagaya',19980,19900], ['setagaya',15999,15900], ['setagaya',49800,40000],
  ['taito',49800,37000], ['katsushika',49800,24000],
  ['adachi',49800,36500], ['adachi',100000,40000],
  ['ota',49800,30000], ['nerima',49800,30000]
];
for(const [city,amount,expected] of representativeCalculations)assert.equal(portal.grant(amount,city),expected,`${city}: ${amount}円`);
assert.equal(19980-portal.grant(19980,'setagaya'),80,'世田谷区: 19,980円の自己負担');
assert.equal(15999-portal.grant(15999,'setagaya'),99,'世田谷区: 15,999円の自己負担');
assert.equal(portal.municipalities.setagaya.roundingUnit,100,'世田谷区の端数処理');
const ui=read('assets/security/security.js');
for(const product of ['Tapo_C530WS','Tapo_C320WS','T817001_1200x1200'])assert.ok(ui.includes(product),product+' official image');
for(const phrase of ['s-grant-summary','s-setagaya-rounding','m.selectorLabel','m.slug === \'setagaya\''])assert.ok(ui.includes(phrase),phrase+' resident-friendly grant presentation');
for(const [city,label] of Object.entries({setagaya:'全額補助・最大4万円',taito:'4分の3補助・最大6万円',katsushika:'半額補助・最大5万円',adachi:'約3分の2補助・最大4万円',ota:'4分の3補助・最大3万円',nerima:'4分の3補助・最大3万円'}))assert.equal(portal.municipalities[city].selectorLabel,label,`${city} selector label`);
const staticSeo={setagaya:['世田谷区の','全額補助','最大4万円まで','Tapo C530WS','Eufy SoloCam S340','世田谷区での補助後価格イメージ'],taito:['台東区の','4分の3補助','最大6万円まで','Tapo C530WS','Eufy SoloCam S340','台東区での補助後価格イメージ'],katsushika:['葛飾区の','半額補助','最大5万円まで','Tapo C530WS','Eufy SoloCam S340','葛飾区での補助後価格イメージ'],adachi:['足立区の','約3分の2補助','最大4万円まで','Tapo C530WS','Eufy SoloCam S340','足立区での補助後価格イメージ'],ota:['大田区の','4分の3補助','最大3万円まで','Tapo C530WS','Eufy SoloCam S340','大田区での補助後価格イメージ'],nerima:['練馬区の','4分の3補助','最大3万円まで','Tapo C530WS','Eufy SoloCam S340','練馬区での補助後価格イメージ']};
for(const [slug,phrases] of Object.entries(staticSeo)){const html=read(`security/tokyo/${slug}/index.html`);for(const phrase of phrases)assert.ok(html.includes(phrase),`${slug} static SEO: ${phrase}`);}
const staticSimulations={adachi:['−3万6,500円','1万3,300円'],ota:['−3万円','1万9,800円']};
for(const [slug,phrases] of Object.entries(staticSimulations)){const html=read(`security/tokyo/${slug}/index.html`);for(const phrase of phrases)assert.ok(html.includes(phrase),`${slug} static simulation: ${phrase}`);}
const cameraHtml=read('security/camera/index.html');for(const phrase of ['<h1>','Tapo C530WS','Tapo C320WS','Eufy SoloCam S340'])assert.ok(cameraHtml.includes(phrase),'camera static SEO: '+phrase);
assert.ok(read('index.html').includes('href="security/"'),'parent homepage entrypoint');
const map=read('sitemap.xml');for(const rel of pages)assert.ok(map.includes('https://kurashi-partner-ku.com/'+rel.replace('index.html','')),rel+' sitemap');
console.log('PASS: parent security portal routes, assets, entrypoint, data, canonical URLs, and sitemap are present.');
