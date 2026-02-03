const fs=require('fs');
const http=require('http');

const server=http.createServer((req,res)=>{
    if(req.url==='/data' && req.method==='GET'){
        fs.readFile('data.json','utf-8',(err,data)=>{
            if(err){
                res.writeHead(500,{'Content-Type':'application/json'});
                res.end(JSON.stringify({error:'Failed to read data'}));
            } else {
                res.writeHead(200,{'Content-Type':'application/json'});
                res.end(data);
            }
        });
    }
    else if(req.url==='/data' && req.method==='POST'){
        let body='';
        req.on('data',chunk=>{
            body+=chunk.toString();
        });
        req.on('end',()=>{
            fs.readFile('data.json','utf-8',(err,data)=>{
                if(err){
                    res.writeHead(500,{'Content-Type':'application/json'});
                    res.end(JSON.stringify({error:'Failed to read data'}));
                } else {
                    const existingData=JSON.parse(data);
                    const newData=JSON.parse(body);// new data from request
                    existingData.push(newData);
                    fs.writeFile('data.json',JSON.stringify(existingData,null,2),(err)=>{
                        if(err){
                            res.writeHead(500,{'Content-Type':'application/json'});
                            res.end(JSON.stringify({error:'Failed to write data'}));
                        } else {
                            res.writeHead(201,{'Content-Type':'application/json'});
                            res.end(JSON.stringify(newData));
                        }
                    });
                }
            });
        });
    }
    else {
        res.writeHead(404,{'Content-Type':'application/json'});
        res.end(JSON.stringify({error:'Not Found'}));
    }   
});

const PORT=3000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});