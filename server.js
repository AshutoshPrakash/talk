var net = require('net');
var http = require("http");
var url = require("url");
var path = require("path");
var ws = require("nodejs-websocket")
var list = [];
var sockets = [];

var server = ws.createServer(function (socket) {

    socket.on("text", function (str2) {
        var str = JSON.parse(str2);
        if(str.myname!=undefined){
            console.log("New User :"+str.myname);
            sockets.push(socket);
            list.push(str.myname);
            for (var j in sockets) { 
                console.log("sending list to :"+ list[j]);
                sockets[j].sendText(JSON.stringify({list:list}));
            }
        }
        else{
            var j = list.indexOf(str.to);
            console.log("MSG to :"+j);
            if(j>=0)sockets[j].sendText(str2);
        }
    })
    socket.on("close", function (code, reason) {
        var j = sockets.indexOf(socket);
        if(j>=0){
            sockets.splice(j,1);
            console.log("user left :"+list[j]);
            list.splice(j,1)
        }
    });
    socket.on("error",function (code ,reason){
        var j = sockets.indexOf(socket);
        if(j>=0){
            sockets.splice(j,1);
            console.log("user left :"+list[j]);
            list.splice(j,1)
        }
    });
}).listen(8001);
