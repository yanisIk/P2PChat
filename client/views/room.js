
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

Template.room.rendered = function() {

    
}

Template.room.events = {

    'click .send-message' : function(e, tmpl) {

        e.preventDefault();

        if( $('.message').val() === '' ) {
            
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