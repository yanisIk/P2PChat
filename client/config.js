Meteor.startup(function () {

    sAlert.config({
        effect: '',
        position: 'bottom-right',
        timeout: 6000,
        html: false,
        onRouteClose: true,
        stack: true,
        offset: 0
    });

});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});