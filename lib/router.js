Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
});

Router.map(function() {
    
    this.route('home', {
        path            : '/',
        template        : 'home',
        redirectOnLogin : true
    });

    this.route('loginRedirectRoute', {
        action          : function() {
            Router.go('/rooms');
        }
    });

    this.route('room', {
        path            : '/room/:name',
        template        : 'room',
        loginRequired   : 'home',
        data            : function() {
            var roomMessages    = Messages.find({ room : this.params.name }, {sort : {creation_date : 'desc'}});
            return {
                messages    : roomMessages,
            }
        }, 
        action          : function() {

            // Set the Session
            Session.set('roomId', this.params.name);

            Meteor.subscribe('roomUsers', this.params.name);
            //Update unread messages status
            Messages.update({"room": this.params.name}, {$set: {"isRead": true}});
            // Render the view
            this.render();
        },
        onStop          : function() {

            // Leave room
            Meteor.call("leaveRoom", Session.get("roomId"), function (error, result) { 
                if(error){
                    sAlert.warning("Error :"+error.reason);
                }
            });
            Session.set('roomId', null);
        }
    });

    this.route('rooms', {
        path            : '/rooms',
        template        : 'roomList',
        loginRequired   : 'home',
        action          : function() {
            var username = Meteor.user().username;
            Session.set('userName', username);
            this.render();
        },
        data            : function() { 
            var roomsList = Rooms.find({}, {sort : {creation_date : 'desc'}});
            return {
                rooms : roomsList
            }
        } 
    });

    this.route('user', {
        path            : '/user/:username',
        template        : 'user',
        loginRequired   : 'home',
        data            : function() {
            var messages    = Messages.find({$or: [{"user": this.params.username, "receiver": Meteor.user().username},{"receiver": this.params.username, "user": Meteor.user().username}]}, {sort : {creation_date : 'desc'}});
            return {
                messages    : messages,
            }
        }, 
        action          : function() {

            // Set the Session
            Session.set('privateReceiver', this.params.username);
            //Update unread messages status
            Messages.update({"receiver": Meteor.user().username, "user": this.params.username}, {$set: {"isRead": true}});

            // Render the view
            this.render();
        },
        onStop          : function() {

            Session.set('privateReceiver', null);
        }
    });

});

requireLogin = function() { 
  if (! Meteor.user()) {
   // If user is not logged in render landingpage
   this.render('home'); 
 } else {
   //if user is logged in render whatever route was requested
   this.next(); 
 }
}

Router.onBeforeAction(requireLogin, {only: ['users', 'user', 'rooms', 'room']});