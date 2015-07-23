Template.user.helpers({

    username    : function() {
        return Meteor.user().username;
    },
    privateReceiver: function() {
        return Session.get('privateReceiver');
    }

});

Template.user.onRendered(function(){

    var self = this;
    var privateReceiver = Session.get("privateReceiver");
    //Reactively set messages in this template to read
    self.autorun(function(){
        if(Messages.find({"user": privateReceiver, "receiver": Meteor.user().username, "isRead": false}).count() > 0){
            Messages.update({"user": privateReceiver, "receiver": Meteor.user().username, "isRead": false}, {$set: {"isRead": true}});
        }
    });

});

Template.user.events = {

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

            if( $('.message').val() === '' ) {      
                return false;
            }
            if($('.message').val().length > 200){
                sAlert.warning("Your message must be under 200 characters");
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

        }

    }
}