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