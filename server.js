var defaultPort = 3000;
var io = require('socket.io')(process.env.PORT || defaultPort);
var shortid = require('shortid');
var playerCount = 0;

console.log("\nServer Started - Port: " + defaultPort);
console.log("---------------------------")

io.on('connection', function(socket){
    var thisClientId = shortid.generate();
    console.log("\n\n***Connection Created: " +  thisClientId + " | Connected to: " + socket.id + "***");

    //Broadcasts to all connected clients
    socket.broadcast.emit('spawn', {id: thisClientId});
    playerCount++;
    console.log("\nPlayer Count: " + playerCount);

    for (i = 0; i < playerCount; i++){
        socket.emit('spawn');
        console.log('\nSpawning Client ID: ' + thisClientId + "\n");
    }

    socket.on('move', function(data){
        //Triggers from client Emit()
        data.id = thisClientId;
        process.stdout.write( JSON.stringify(data) + " | ");
        //Relay "move" to all connected clients (not the orignating client however)
        socket.broadcast.emit('move', data);
    });

    socket.on('disconnect', function(){
        console.log("\n\nClient: " + thisClientId + " is Disconnecting.");
        playerCount--;
    });
});