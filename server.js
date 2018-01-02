var defaultPort = 3000;
var io = require('socket.io')(process.env.PORT || defaultPort);

console.log("Server Started: ");

io.on('connection', function(socket){
    console.log("Client Connected: " + socket);

    socket.on('Move', function(data){
        //Triggers from client Emit()
        console.log("Client Moved: " + data);
    });
});