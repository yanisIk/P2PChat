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