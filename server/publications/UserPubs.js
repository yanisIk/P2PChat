Meteor.publish("onlineUsers", function(){
	if(!this.userId){
		throw new Meteor.Error(403, "Unauthorized");	
	}
	return Meteor.users.find({"status.online": true}, {fields: {"username":1, "peerId": 1, "status.online": 1, "status.lastLogin.date": 1}});
});