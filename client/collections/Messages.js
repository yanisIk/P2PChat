Messages = new Meteor.Collection(null);

//Delete room messages when the room is deleted
Rooms.find().observe({
	removed: function(room){
		Messages.remove({"room": room.name});
	}
});