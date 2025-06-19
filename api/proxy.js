javascript
Kopyala
Düzenle
// api/proxy.js (serverless function)
export default async function handler(req, res) {
  const targetURL = 'https://wooizmir-pro.cdn.ampproject.org/c/s/wooizmir.pro/amp?ver=1/';
  
  const response = await fetch(targetURL);
  const html = await response.text();

  // Basit filtre (gerekirse body içine custom kod ekleyebilirsin)
  const cleaned = html
    .replace(/<script[^>]>[\s\S]?<\/script>/gi, '') // dış scriptleri çıkar
    .replace(/<meta[^>]+>/gi, '') // bazı meta'ları çıkar

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(cleaned);
}
