Meteor.methods({

	"createRoom" : function(room){
		check(room.name, String);
		check(room.password, String);
		
		if(!this.userId){
			throw new Meteor.Error(403, "You must login first");
		}
		room = cleanRoom(room);
		validateRoom(room);
		var username = Meteor.users.findOne(this.userId).username;
		var extraFields = {
			creationDate: new Date(),
			numberOfUsers: 0,
			owner: username
		}
		room = _.extend(room, extraFields)
		createRoom(room);
	},
	"deleteRoom" : function(room){
		check(room.name, String);
		check(room.password, String);
		if(!this.userId){
			throw new Meteor.Error(403, "You must login first");
		}
		var room = Rooms.findOne({"name": room.name});
		if(!room){
			throw new Meteor.Error(500,"Cannot delete room : Room not found");
		}
		var username = Meteor.users.findOne(this.userId).username;
		if(room.owner !== username){
			throw new Meteor.Error(403, "Cannot delete room : Only the owner can delete a room");
		}
		deleteRoom(room);
	},
	"joinRoom" : function(room){
		check(room.name, String);
		check(room.password, String);
		if(!this.userId){
			throw new Meteor.Error(403, "Cannot join room : Unauthorized");
		}
		var realRoom = Rooms.findOne({"name": room.name});
		if(!room){
			throw new Meteor.Error(500, "Cannot join room : Room not found");
		}
		var username = Meteor.users.findOne(this.userId).username;
		if(RoomUsers.find({"username": username}).count() > 0){
			throw new Meteor.Error(500, "Cannot join room : You are already in the room");
		}
		if(room.password !== realRoom.password){
			throw new Meteor.Error(403, "Cannot join room, bad room password");
		}
		joinRoom(username, room.name);
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