var http = require("http");
var server = http.createServer(function(req,res) {
    res.write("Hello World!!");
    res.end();
});
 
var io = require('socket.io')(server);
 
var postArray = [];
 
// クライアント接続時
io.on('connection', function(socket) {
    console.log("client connected!!")
 
    // クライアント切断時
    socket.on('disconnect', function() {
        console.log("client disconnected!!")
    });
 
    // クライアント投稿時
    socket.on("post", function(obj){
        postArray.push(obj);
        // クライアントに最新のデータを送る
        io.emit("addedPost", JSON.stringify(postArray));
    });
});
 
server.listen(8080);
