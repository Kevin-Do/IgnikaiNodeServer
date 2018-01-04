//Packages and Setup
var defaultPort = 3000;
var io = require('socket.io')(process.env.PORT || defaultPort);
var shortid = require('shortid');

//Player Management
var players = [];

//---Server Start---
console.log("\n---------------------------")
console.log("Server Started - Port: " + defaultPort);
console.log("---------------------------")

io.on('connection', function(socket){

    //Generate GUID for newly connected player
    var thisPlayerId = shortid.generate();
    // socket.emit('register', {id: thisPlayerId});

    console.log("\n\n~ Connection Created - Player " +  thisPlayerId + " | Connected to socket: " + socket.id + " ~");

    //Broadcast spawn action for newly connected player to all connected clients
    socket.broadcast.emit('spawn', {id: thisPlayerId});

    //Add to server-side player management
    players.push(thisPlayerId);

    //Add existing players to newly connected player's session
    players.forEach(function(playerID){
        if(playerID == thisPlayerId){
            return;
        }
        console.log("\nAdding Player " + playerID + " to Player " + thisPlayerId + "'s game.");
        socket.emit('spawn', {id: playerID});
    });

    //Handle movement
    socket.on('move', function(data){

        //Tag id of moving player (newly connected player)
        data.id = thisPlayerId;

        //Uncomment for data logging (warning: very heavy)
        //console.log(data);

        //Relay "move" to all connected clients (not this orignating client however)
        socket.broadcast.emit('move', data);
    });

    socket.on('disconnect', function(){
        console.log("\n\n~ Player " + thisPlayerId + " is Disconnecting. ~");

        //Remove from player management
        var playerIndex = players.indexOf(thisPlayerId);
        players.splice(playerIndex, 1);

        //Broadcast disconnect action to all other clients
        socket.broadcast.emit('disconnected', {id: thisPlayerId});
        console.log("Updated player list: " + players);
    });
});