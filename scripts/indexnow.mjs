// Tell Bing, Yandex and other IndexNow engines about every URL in the live sitemap.
// Run after a deploy: node scripts/indexnow.mjs
const KEY = '28ff85867a9d45a4b7d20a9b7b50a96c';
const HOST = 'brvzulu.com';

const xml = await (await fetch(`https://${HOST}/sitemap-0.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs, HTTP ${res.status}`);
