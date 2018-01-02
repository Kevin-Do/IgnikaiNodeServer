var defaultPort = 3000;
var io = require('socket.io')(process.env.PORT || defaultPort);
var playerCount = 0;

console.log("Server Started - Port: " + defaultPort);

io.on('connection', function(socket){
    console.log("\n" + "Client Connected to: " + socket.id);

    //Broadcasts to all connected clients
    socket.broadcast.emit('spawn');
    playerCount++;

    for (i = 0; i < playerCount; i++){
        socket.emit('spawn');
        console.log(socket.id + ' Spawning.');
    }

    socket.on('move', function(data){
        //Triggers from client Emit()
        console.log("Client Moved - Data: " + data);
    });

    socket.on('disconnect', function(){
        playerCount--;
        console.log("/n" + "Client: " + socket.id + " Disconnecting.")
    })
});