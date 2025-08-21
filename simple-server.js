const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;
const hostname = '0.0.0.0';

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html for root
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(pathname).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/plain';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
            return;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});