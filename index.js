const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

http.createServer((req, res) => {
  let rel = (req.url || '/').split('?')[0];
  if (rel === '/') rel = '/index.html';
  try {
    rel = decodeURIComponent(rel);
  } catch (e) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }
  if (rel.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  const filePath = path.join(__dirname, rel);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': types[ext] || 'text/plain'});
    res.end(data);
  });
}).listen(PORT, () => console.log(`Aphex rodando na porta ${PORT}`));
