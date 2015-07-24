UserStatus.events.on("connectionLogin", function(fields) { 
	

});

UserStatus.events.on("connectionIdle", function(fields) { 
	//remove it from rooms
	var username = Meteor.users.findOne(fields.userId).username;
	leaveRoom(username);
	console.log("User "+username+" is idle");
});

UserStatus.events.on("connectionLogout", function(fields) { 
	//remove it from rooms
	var username = Meteor.users.findOne(fields.userId).username;
	leaveRoom(username);
	console.log("User "+username+" logged out");
});
