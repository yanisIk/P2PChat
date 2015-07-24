validateRoom = function(room){
	var errorMessage;
	if(room.name.length < 3){
		errorMessage = "Cannot create room : Room name must have at least 3 characters";
        throw new Meteor.Error(500, errorMessage);
    }
    if(room.name.length > 20){
    	errorMessage = "Cannot create room : Room name must have a maximum of 20 characters"
        throw new Meteor.Error(500, errorMessage);
    }
    if(/^[a-zA-Z0-9- ]*$/.test(room.name) == false) {
        errorMessage = "Cannot create room : room name must not contains special characters";
        throw new Meteor.Error(500, errorMessage);
    }
    if(Rooms.find({"name": room.name}).count() > 0){
		errorMessage = "Cannot create room : already exists";
        throw new Meteor.Error(500, errorMessage);
	}

    if(room.password.length != 0 && room.password.length < 3){
        errorMessage = "Password must be minimum 3 characters (or no password)";
        throw new Meteor.Error(500, errorMessage);
    }
    if(room.password.length > 20){
        errorMessage = "Password must be maximum 20 characters";
        throw new Meteor.Error(500, errorMessage);
    }
}

cleanRoom = function(room){
	//Remove spaces
	room.name = room.name.replace(/\s+/g, '');
	return room;
}

validateMessage = function(message){
	check(message.content, String);
	check(message.user, String);
	if(message.room) check(message.room, String);
	if(message.receiver) check(message.receiver, String);
    if(message.content.length === 0 || message.content === ''){
        throw new Meteor.Error(500, "Invalid message: Empty");
    }
    if(message.content.length > 200){
        throw new Meteor.Error(500, "Your message must be under 200 characters");
    }
}