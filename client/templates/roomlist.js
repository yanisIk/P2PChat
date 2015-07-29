
Template.roomList.helpers({

    numberOfUsers    : function(roomName) {
        return Rooms.findOne({"name": roomName}).numberOfUsers;
    }, 
    amOwner          : function(owner){
        if(Meteor.user().username == owner){
            return true;
        }
        return false;
    },
    numberOfUnreadMessages : function(roomName){
        return Messages.find({"room": roomName, "isRead": false}).count();
    }

});


Template.roomList.events = {

    'click .create-room' : function(e, tmpl) {

        e.preventDefault();

        var name = $('.room-name').val();
        var password = $('.room-password').val();
        var room = {name: name, password: password};

        try{
            Meteor.call("createRoom", room, function(error, result){
                if(error){
                    sAlert.error(error.reason);
                }
                else{
                    Meteor.call("joinRoom", room, function(error, result){
                        if(error){
                            if(error.reason == "You are already in the room"){
                                Router.go("room", {name: name});
                            }
                            else{
                                sAlert.error(error.reason);
                            }
                        }
                        else{
                            Router.go("room", {name: name});
                        }
                    });
                }
            });
        }
        catch(e){
            //Don't show client side method exceptions
        }

    },

    'click #joinRoomBtn' : function(e, tmpl) {

        e.preventDefault();
        var name = e.target.name;
        var password = $("#password"+name).val();
        var room = {name: name, password: password};
        try{
            Meteor.call("joinRoom", room, function(error, result){
                if(error){
                    if(error.reason == "You are already in the room"){
                        Router.go("room", {name: name});
                    }
                    else{
                        sAlert.error(error.reason);
                    }
                }
                else{
                    Router.go("room", {name: name});
                }
            });
        }
        catch(e){
            //Don't show client side method exceptions
        }
        
    },
    'click #deleteRoomBtn' : function(e, tmpl) {

        e.preventDefault();
        var name = e.target.name;
        var password = $("#password"+name).val();
        var room = {name: name, password: password};

        try{
            Meteor.call("deleteRoom", room, function(error, result){
            if(error){
                sAlert.error(error.reason); 
            }
            });
        }
        catch(e){
            //Don't show client side method exceptions
        }
        
    }

}