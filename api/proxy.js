// api/proxy.js (serverless function)
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const targetURL = 'https://wooizmir-pro.cdn.ampproject.org/c/s/wooizmir.pro/amp?ver=1/';
    
    const response = await fetch(targetURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProxyBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Target site unavailable',
        status: response.status 
      });
    }
    
    const html = await response.text();
    
    // Improved filtering
    const cleaned = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<meta[^>]*>/gi, '') // Remove meta tags
      .replace(/<link[^>]*>/gi, '') // Remove link tags
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .trim();
    
    // Set headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    
    res.status(200).send(cleaned);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
