const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const pages=['security/index.html','security/tokyo/index.html','security/camera/index.html','security/tokyo/setagaya/index.html','security/tokyo/taito/index.html','security/tokyo/katsushika/index.html','security/tokyo/adachi/index.html','security/tokyo/ota/index.html','security/tokyo/nerima/index.html'];
for(const rel of pages){const html=read(rel);assert.ok(html.includes('canonical'),rel+' canonical');assert.ok(!html.includes('noindex,follow'),rel+' must remain indexable on parent');assert.ok(html.includes('security.css'),rel+' shared CSS');assert.ok(html.includes('security-data.js'),rel+' data source');assert.ok(html.includes('security.js'),rel+' shared UI');}
for(const asset of ['assets/security/home-security-hero.png','assets/security/security-entrance.png','assets/security/security-garden.png','assets/security/camera-forms.png'])assert.ok(fs.existsSync(path.join(root,asset)),asset);
const data=read('assets/security/security-data.js');for(const city of ['setagaya','taito','katsushika','adachi','ota','nerima'])assert.ok(data.includes(city+":"),city);
const ui=read('assets/security/security.js');
for(const product of ['Tapo_C530WS','Tapo_C320WS','T817001_1200x1200'])assert.ok(ui.includes(product),product+' official image');
for(const phrase of ['s-grant-summary','対象経費の全額','対象経費の4分の3','対象経費の3分の2','対象経費の2分の1'])assert.ok(ui.includes(phrase),phrase+' resident-friendly grant presentation');
assert.ok(read('index.html').includes('href="security/"'),'parent homepage entrypoint');
const map=read('sitemap.xml');for(const rel of pages)assert.ok(map.includes('https://kurashi-partner-ku.com/'+rel.replace('index.html','')),rel+' sitemap');
console.log('PASS: parent security portal routes, assets, entrypoint, data, canonical URLs, and sitemap are present.');
