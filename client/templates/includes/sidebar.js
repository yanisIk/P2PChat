Template.sidebar.helpers({

    numberOfUsers    : function() {
        return Meteor.users.find({}).count()-1;
    }, 
    isNotMe : function(username){
    	if(username !== Meteor.user().username) return true;
    },
    users : function(){
    	return Meteor.users.find({});
    },
    numberOfUnreadMessages : function(username){
    	return Messages.find({"user": username, "receiver": Meteor.user().username, "isRead":false}).count();
    }

});