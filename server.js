var defaultPort = 3000;
var io = require('socket.io')(process.env.PORT || defaultPort);
var shortid = require('shortid');
var playerCount = 0;

console.log("Server Started - Port: " + defaultPort);

io.on('connection', function(socket){
    var thisClientId = shortid.generate();
    console.log("\n" + "Client: " +  thisClientId + "| Connected to: " + socket.id);

    //Broadcasts to all connected clients
    socket.broadcast.emit('spawn');
    playerCount++;

    for (i = 0; i < playerCount; i++){
        socket.emit('spawn');
        console.log('\nSpawning: ' + thisClientId);
    }

    socket.on('move', function(data){
        //Triggers from client Emit()
        data.id = thisClientId;
        console.log("Client Moved - Data: " + JSON.stringify(data));
        //Relay "move" to all connected clients (not the orignating client however)
        socket.broadcast.emit('move', data);
    });

    socket.on('disconnect', function(){
        console.log("\n" + "Client: " + socket.id + " Disconnecting.");
        playerCount--;
    })
});