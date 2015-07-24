sendMessage = function(message){
	
	validateMessage(message);

	//Check if message is for a room
	if(message.room && !message.receiver){
		message.type = "ROOM_MESSAGE";
		var usersInRoom = RoomUsers.find({"room": message.room}).fetch();
		var peerIds = [];
		_.each(usersInRoom, function(userInRoom){
			if(userInRoom !== Meteor.user().username){
				var user = Meteor.users.findOne({"username": userInRoom.username});
				if(user){
					var peerId = user.peerId;
					if(peerId) peerIds.push(peerId);
				}
			}
		});
		_.each(peerIds, function(peerId){
			var conn = peer.connect(peerId);
			conn.on('open', function() {
					// Send messages
					 conn.send(EJSON.stringify(message));
					 console.log("Sent message to peerId: "+peerId);
			});
		});
	}

	//Check if private message
	else if(!message.room && message.receiver){
		message.type = "PRIVATE_MESSAGE";
		var user = Meteor.users.findOne({"username": message.receiver});
		var peerId;
		if(user)  peerId = user.peerId;
		if(peerId){
			var conn = peer.connect(peerId);
			conn.on('open', function() {
				// Send messages
				 conn.send(EJSON.stringify(message));
				 console.log("Sent message to peerId: "+peerId);
			});
		}
	}

	Messages.insert(message);		
}

//Message receiver
initPeerMessageListener = function(){
	peer.on('connection', Meteor.bindEnvironment(function(conn) { 
	console.log("Received entering connection");
	// Receive messages
	conn.on('data', function(data) {
		console.log("Received entering data: "+data);
		data = EJSON.parse(data);
		
		if(data.type == "PRIVATE_MESSAGE" || data.type == "ROOM_MESSAGE"){
			var message = data;
			validateMessage(message);
			message.isRead = false;
			Messages.insert(message);
			alertNewMessage(message);
		}		
		});
	}));
}


var alertNewMessage = function(message){
	//Check if private message
	if(message.type == "PRIVATE_MESSAGE"){
		Notifications.insert({type: message.type, username: message.user, message: message.content});
	}
	//Check if message is for a room
	else if(message.type == "ROOM_MESSAGE"){	
		Notifications.insert({type: message.type, username: message.user, room: message.room, message: message.content});
	}
}
