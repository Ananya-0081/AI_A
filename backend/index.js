const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {

    // ✅ ROOT ROUTE (important for browser testing)
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server is running 🚀' }));
    }

    // GET data
    else if (req.url === '/data' && req.method === 'GET') {
        fs.readFile('data.json', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read data' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    }

    // POST data
    else if (req.url === '/data' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            fs.readFile('data.json', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to read data' }));
                } else {
                    const existingData = JSON.parse(data);
                    const newData = JSON.parse(body);

                    existingData.push(newData);

                    fs.writeFile(
                        'data.json',
                        JSON.stringify(existingData, null, 2),
                        (err) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Failed to write data' }));
                            } else {
                                res.writeHead(201, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(newData));
                            }
                        }
                    );
                }
            });
        });
    }

    // 404 fallback
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// ✅ IMPORTANT FIX FOR RENDER
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
