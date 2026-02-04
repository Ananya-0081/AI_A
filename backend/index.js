const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {

    // normalize URL (IMPORTANT)
    const url = req.url.split("?")[0];

    // ROOT
    if (url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Server is running 🚀" }));
    }

    // GET data
    if (url === "/data" && req.method === "GET") {
        return fs.readFile("data.json", "utf-8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to read data" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(data);
            }
        });
    }

    // POST data
    if (url === "/data" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            fs.readFile("data.json", "utf-8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "Failed to read data" }));
                }

                const existing = JSON.parse(data);
                const incoming = JSON.parse(body);
                existing.push(incoming);

                fs.writeFile("data.json", JSON.stringify(existing, null, 2), err => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Failed to write data" }));
                    } else {
                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(incoming));
                    }
                });
            });
        });
        return;
    }

    // 404
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port", PORT));
