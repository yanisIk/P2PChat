
Template.room.helpers({

    username    : function() {
        return Meteor.user().username;
    }, 
    roomusers   : function() {
       return RoomUsers.find({ room : Session.get('roomId') }, { sort : { creationDate : 'asc' }});
    },
    isNotMe : function(username){
        if(username !== Meteor.user().username) return true;
    }

});

Template.room.onRendered(function() {

    var self = this;
    var roomName = Session.get("roomId");
    //Reactively set messages in this template to read
    self.autorun(function(){
        if(Messages.find({"room": roomName, "isRead": false}).count() > 0){
            Messages.update({"room": roomName, "isRead": false}, {$set: {"isRead": true}});
        }
    });
    
});

Template.room.events = {

    'click .send-message' : function(e, tmpl) {

        e.preventDefault();

        message = {
            user            : Meteor.user().username,
            room            : Session.get('roomId'), 
            content         : $('.message').val().trim(),
            creation_date   : new Date()
        };

        try{
            sendMessage(message);
        }
        catch(e){
            sAlert.error(e.reason);
            return false;
        }

        $('.message').val('');

    },

    'keyup .message' : function(e, tmpl) {

        if( e.keyCode === 13 ) {

            message = {
                user            : Meteor.user().username,
                room            : Session.get('roomId'), 
                content         : $('.message').val().trim(),
                creation_date   : new Date()
            };

            try{
                sendMessage(message);
            }
            catch(e){
                sAlert.error(e.reason);
                return false;
            }

            $('.message').val('');

        }

    }
}