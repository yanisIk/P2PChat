Notifications = new Meteor.Collection(null);

Notifications.before.insert(function(userId, doc){
	doc.createdAt = new Date();
	doc.read = false;
});

Notifications.find().observe({
	added: function(notification){
		var path = getNotificationPath(notification);
		var text = getNotificationMessage(notification);
		if(path == "#"){
			sAlert.info(text);
		}
		else{
			sAlert.info("<a href="+path+">"+text+"</a>", {html:true});
		}
	}
});

RoomUsers.find().observe({
	added: function(roomUser){
		if(roomUser.username !== Meteor.user().username){
			Notifications.insert({type: "USER_JOINED_ROOM", username: roomUser.username, room: roomUser.room});
		}		
	},
	removed: function(roomUser){
		if(roomUser.username !== Meteor.user().username){
			Notifications.insert({type: "USER_LEFT_ROOM", username: roomUser.username, room: roomUser.room});
		}		
	}
});

Meteor.users.find().observe({
	added: function(user){
		if(user.username !== Meteor.user().username){
			Notifications.insert({type: "USER_CONNECTED", username: user.username});
		}		
	},
	removed: function(user){
		if(user.username !== Meteor.user().username){
			Notifications.insert({type: "USER_DISCONNECTED", username: user.username});
		}		
	}
});

getNotificationMessage = function(notification){
	if(notification.type == "PRIVATE_MESSAGE")
		return "New private message from "+notification.username+" : "+notification.message;	
	if(notification.type == "ROOM_MESSAGE")
		return "New room message in "+notification.room+" from "+notification.username+" : "+notification.message;	
	if(notification.type == "USER_JOINED_ROOM")
		return notification.username+" joined room "+notification.room;	
	if(notification.type == "USER_LEFT_ROOM")
		return notification.username+" left room "+notification.room;
	if(notification.type == "USER_CONNECTED")
		return notification.username+" connected";	
	if(notification.type == "USER_DISCONNECTED")
		return notification.username+" disconnected";	
}

getNotificationPath = function(notification) {
    if(notification.type == "PRIVATE_MESSAGE"){
      return Router.routes.user.path({username: notification.username});
    }
    else if(notification.type == "ROOM_MESSAGE"){
      return Router.routes.room.path({name: notification.room});
    }
    else{
      return "#";
    }
}