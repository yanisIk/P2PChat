//Connect to peerjs broker
var key = Meteor.settings.public.peerjs_public_key;
if(!key){
	console.log("ERROR : invalid PEERJS key");
}
peer = new Peer({key: key});

peer.on('connection', Meteor.bindEnvironment(function(conn) { 
	console.log("Received entering connection");
	// Receive messages
	conn.on('data', function(data) {
		console.log("Received entering data: "+data);
		//TODO : Validate...
		var message = EJSON.parse(data);
		Messages.insert(message);
		if(message.receiver){
			sAlert.info('New private message from '+message.user+" : "+message.content);
		}
		else{
  			sAlert.info('New message in room '+message.room+' from '+message.user+' : '+message.content);
		}
		
	});
}));

Accounts.onLogin(function(){
		
	if(peer.id){
		//Register the id
			Meteor.call("setPeerId", peer.id);
			Meteor.subscribe("rooms");
			Meteor.subscribe("onlineUsers");
	}
	else{
		peer.on('open', function(id) {
  			//Register the id
  			Meteor.call("setPeerId", id);
  			Meteor.subscribe("rooms");
  			Meteor.subscribe("onlineUsers");
		});
	}

});

