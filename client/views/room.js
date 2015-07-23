
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

        if( $('.message').val() === '' ) {
            return false;
        }
        if($('.message').val().length > 200){
            sAlert.warning("Your message must be under 200 characters");
            return false;
        }

        message = {
            user            : Meteor.user().username,
            room            : Session.get('roomId'), 
            content         : $('.message').val(),
            creation_date   : new Date()
        };

        message._id = Messages.insert(message);
        sendMessage(message);

        $('.message').val('');

    },

    'keyup .message' : function(e, tmpl) {

        if( e.keyCode === 13 ) {

            if( $('.message').val() === '' ) {      
                return false;
            }
            if($('.message').val().length > 200){
                sAlert.warning("Your message must be under 200 characters");
                return false;
            }

            message = {
                user            : Meteor.user().username,
                room            : Session.get('roomId'), 
                content         : $('.message').val(),
                creation_date   : new Date()
            };

            message._id = Messages.insert(message);
            sendMessage(message);

            $('.message').val('');

        }

    }
}