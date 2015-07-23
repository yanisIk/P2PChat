Template.user.helpers({

    username    : function() {
        return Session.get('userName');
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