const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const trackHandler = require('./api/track.js');
const statsHandler = require('./api/stats.js');
let ttsHandler;
try {
  ttsHandler = require('./api/tts.js');
} catch (e) {
  ttsHandler = (req, res) => res.status(503).json({ error: 'ws module not installed locally' });
}

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Set default CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Enhance res with status and json helpers for serverless functions
  res.status = function(code) {
    res.statusCode = code;
    return this;
  };
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  };
  res.send = function(data) {
    res.end(data);
  };

  req.query = parsedUrl.query;

  // API 라우팅
  if (pathname === '/api/track') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { req.body = body ? JSON.parse(body) : {}; } catch(e) { req.body = {}; }
      trackHandler(req, res);
    });
    return;
  }

  if (pathname === '/api/stats') {
    statsHandler(req, res);
    return;
  }

  if (pathname === '/api/tts') {
    ttsHandler(req, res);
    return;
  }

  // /admin -> admin.html
  if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin.html';
  }

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('Local Server running on http://localhost:' + PORT);
});