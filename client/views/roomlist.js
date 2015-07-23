
Template.roomList.helpers({

    numberOfUsers    : function(roomName) {
        return Rooms.findOne({"name": roomName}).numberOfUsers;
    }, 
    amOwner          : function(owner){
        if(Meteor.user().username == owner){
            return true;
        }
        return false;
    }

});


Template.roomList.events = {

    'click .create-room' : function(e, tmpl) {

        e.preventDefault();

        var name = $('.room-name').val()
        var password = $('.room-password').val();

        Meteor.call("createRoom", name, password, function(result, error){
        	if(error){
        		sAlert.warning(error.reason);
        	}
        });

    },

    'click #joinRoomBtn' : function(e, tmpl) {

        e.preventDefault();
        var name = e.target.name;
        var password = $("#password"+name).val();

        Meteor.call("joinRoom", name, password, function(error, result){
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
    },
    'click #deleteRoomBtn' : function(e, tmpl) {

        e.preventDefault();
        var name = e.target.name;
        var password = $("#password"+name).val();

        Meteor.call("deleteRoom", name, password, function(error, result){
            if(error){
                sAlert.error(error.reason); 
            }
        });
        


    }

}