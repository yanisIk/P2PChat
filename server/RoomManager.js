Meteor.methods({

	"createRoom" : function(roomName, password){
		check(roomName, String);
		check(password, String);
		
		if(!this.userId){
			throw new Meteor.Error(403, "Unauthorized");
		}
		if(roomName.length < 3){
			throw new Meteor.Error(500, "Cannot create room : room name must be at least 3 characters");
		}
		if(Rooms.find({"name": roomName}).count() > 0){
			throw new Meteor.Error(500, "Cannot create room : already exists");
		}
		var username = Meteor.users.findOne(this.userId).username;
		var room = {
			name: roomName,
			password: password,
			creationDate: Date.now(),
			numberOfUsers: 0,
			owner: username
		}
		createRoom(room);
	},
	"deleteRoom" : function(roomName, password){
		check(roomName, String);
		check(password, String);
		if(!this.userId){
			throw new Meteor.Error(403, "Unauthorized");
		}
		var room = Rooms.findOne({"name": roomName});
		if(!room){
			throw new Meteor.Error(500,"Cannot delete room : Room not found");
		}
		var username = Meteor.users.findOne(this.userId).username;
		if(room.owner !== username){
			throw new Meteor.Error(403, "Cannot delete room : Only the owner can delete a room");
		}
		deleteRoom(room);
	},
	"joinRoom" : function(roomName, password){
		check(roomName, String);
		if(!this.userId){
			throw new Meteor.Error(403, "Cannot join room : Unauthorized");
		}
		var room = Rooms.findOne({"name": roomName});
		if(!room){
			throw new Meteor.Error(500, "Cannot join room : Room not found");
		}
		var username = Meteor.users.findOne(this.userId).username;
		if(RoomUsers.find({"username": username}).count() > 0){
			throw new Meteor.Error(500, "Cannot join room : You are already in the room");
		}
		if(room.password !== password){
			throw new Meteor.Error(403, "Cannot join room, bad room password");
		}
		joinRoom(username, roomName);
	},
	"leaveRoom" : function(roomName){
		check(roomName, String);
		if(!this.userId){
			throw new Meteor.Error(403, "Unauthorized");
		}
		if(Rooms.find({"name": roomName}).count() == 0){
			throw new Meteor.Error(500, "Cannot leave room : not found");
		}
		var username = Meteor.users.findOne(this.userId).username;
		if(RoomUsers.find({"room": roomName, "username": username}).count() == 0){
			throw new Meteor.Error(500 ,"Cannot leave room, you are not in it");
		}
		leaveRoom(username, roomName);
	}
});




Meteor.publish("rooms", function(){
	if(!this.userId){
		throw new Meteor.Error(403, "Unauthorized");
	}
	return Rooms.find({});
});

Meteor.publish("roomUsers", function(roomName){
	if(!this.userId){
		throw new Meteor.Error(403, "Unauthorized");
	}
	var username = Meteor.users.findOne(this.userId).username;
	if(RoomUsers.find({"room": roomName, "username": username}).count() == 0){
		throw new Meteor.Error(403, "You are not in this room");
	}
	return RoomUsers.find({"room": roomName});
});

joinRoom = function(username, roomName){
	var roomUser = {room: roomName, username: username, creationDate: new Date()};
	RoomUsers.insert(roomUser);
	Rooms.update({"name": roomName}, {$inc: {"numberOfUsers": 1}});
	console.log("User "+username+" joined room: "+roomName);
}

leaveRoom = function(username, roomName){
	if(roomName){
		var roomUser = {room: roomName, username: username};
		RoomUsers.remove(roomUser);
		Rooms.update({"name": roomName}, {$inc: {"numberOfUsers": -1}});
		console.log("User "+username+" left room: "+roomName);
	}
	//Leaving all rooms
	else{
		var roomUsers = RoomUsers.find({"username": username}).fetch();
		_.each(roomUsers, function(roomUser){
			Rooms.update({"name": roomUser.room}, {$inc: {"numberOfUsers": -1}});
			RoomUsers.remove({"username": roomUser.username});
			console.log("User "+roomUser.username+" left room: "+roomUser.room);
		});
	}
}


createRoom = function(room){
	Rooms.insert(room);
	//joinRoom(room.owner, room.name);
	console.log("User "+room.owner+" created room: "+room.name);
}

deleteRoom = function(room){
	Rooms.remove({"name": room.name});
	RoomUsers.remove({"room": room.name});
	console.log("User "+room.owner+" deleted room: "+room.name);
}