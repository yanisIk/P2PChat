sendMessage = function(message){
	//Check if message is for a room
	if(message.room){
		check(message.room, String);
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
					 con.close();
					 console.log("Sent message to peerId: "+peerId);
			});
		});
	}

	//Check if private message
	if(!message.room && message.receiver){
		check(message.receiver, String);
		var user = Meteor.users.findOne({"username": message.receiver});
		if(user){
			var peerId = user.peerId;
		}
		if(peerId){
			var conn = peer.connect(peerId);
			conn.on('open', function() {
				// Send messages
				 conn.send(EJSON.stringify(message));
				 con.close();
				 console.log("Sent message to peerId: "+peerId);
			});
		}
		
	}		
}

