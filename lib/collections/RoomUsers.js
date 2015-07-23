RoomUsers = new Mongo.Collection("roomUsers");
if(Meteor.isServer){
	RoomUsers._ensureIndex({"room": 1});
	RoomUsers._ensureIndex({"username": 1});
}
