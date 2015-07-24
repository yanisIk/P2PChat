//Connect to peerjs broker
var key = Meteor.settings.public.peerjs_public_key;
if(!key){
	throw new Meteor.Error("INVALID PEERJS KEY IN METEOR SETTINGS");
}
peer = new Peer({key: key});
initPeerMessageListener();


//When user logs in, he registers its peerId to the server
Accounts.onLogin(function(){
		
	if(peer.id){
		initClient(peer.id);
	}
	else{
		peer.on('open', function(id) {
  			initClient(id);
		});
	}

});

var initClient = function(peerId){
	//Register the id
	Meteor.call("setPeerId", peerId);
	Meteor.subscribe("rooms");
	Meteor.subscribe("onlineUsers");
}
