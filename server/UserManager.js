

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


Meteor.methods({
	"setPeerId": function(peerId){
		check(peerId, String);
		if(!this.userId){
			throw new Meteor.Error(403, "You must login first");
		}
		Meteor.users.update({"_id": this.userId}, {$set: {"peerId": peerId}});
		var username = Meteor.users.findOne(this.userId).username;
		console.log("User "+username+" logged in with peerid: "+peerId);
	}
});


Meteor.publish("onlineUsers", function(){
	if(!this.userId){
		throw new Meteor.Error(403, "Unauthorized");	
	}
	return Meteor.users.find({"status.online": true}, {fields: {"username":1, "peerId": 1, "status.online": 1, "status.lastLogin.date": 1}});
});