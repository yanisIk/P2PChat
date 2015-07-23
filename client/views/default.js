Template.layout.helpers({

    numberOfUsers    : function() {
        return Meteor.users.find({}).count();
    }, 
    isNotMe : function(username){
    	if(username !== Meteor.user().username) return true;
    },
    users : function(){
    	return Meteor.users.find({});
    }

});