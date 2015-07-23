Template.user.helpers({

    username    : function() {
        return Session.get('userName');
    },
    privateReceiver: function() {
        return Session.get('privateReceiver');
    }

});


Template.user.events = {

    'click .send-message' : function(e, tmpl) {

        e.preventDefault();

        if( $('.message').val() === '' ) {
            
            return false;
        
        }

        message = {
            user            : Meteor.user().username,
            receiver        : Session.get('privateReceiver'), 
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
                receiver        : Session.get('privateReceiver'), 
                content         : $('.message').val(),
                creation_date   : new Date()
            };

            message._id = Messages.insert(message);
            sendMessage(message);

            $('.message').val('');

        }

    }
}