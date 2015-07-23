Rooms = new Mongo.Collection("rooms");
if(Meteor.isServer){
	Rooms._ensureIndex({"name": 1});
}
