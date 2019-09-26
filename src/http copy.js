const http = require('http');
const fs = require('fs')
const server = http.createServer((request,response)=>{
    fs.writeFile(__dirname+'/header01.json',JSON.stringify(request.headers),
    error=>{
        console.log('http儲存')
    })
    response.writeHead(200,{
        'Content-Type':'text/html'
    })
    response.end(`<div>Hello<br><br>
    <h1>${request.url}</h1></div>
    `)
})
server.listen(3000);