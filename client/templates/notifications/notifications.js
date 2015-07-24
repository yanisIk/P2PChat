Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({}, {limit:5});
  },
  notificationCount: function(){
  	return Notifications.find({read: false}).count();
  },
  notificationMessage: function(notification){
    return getNotificationMessage(notification);
  }
});

Template.notifications.events({
  'click .dropdown-toggle': function() {
    Notifications.update({}, {$set: {read: true}});
  }
})


Template.notificationItem.helpers({
  notificationPath: function() {
    return getNotificationPath(this);   
  }
})

Template.notificationItem.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
})