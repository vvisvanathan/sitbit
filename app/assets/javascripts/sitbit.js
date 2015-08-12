window.Sitbit = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new Sitbit.Routers.UserRouter({
      $navEl: $('#navbar'),
      $rootEl: $('#content'),
      users: new Sitbit.Collections.Users()
    });

    Backbone.history.start();
  }
};

$(document).ready(function(){
  // Sitbit.initialize();
});
