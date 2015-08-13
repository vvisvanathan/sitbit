window.Sitbit = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var users = new Sitbit.Collections.Users();

    var router = new Sitbit.Routers.UserRouter({
      $navEl: $('#navbar'),
      $rootEl: $('#content'),
      collection: users
    });

    var nav = new Sitbit.Views.NavShow({
      router: router,
      collection: users
    });
    $('#navbar').html(nav.render().$el);

    Backbone.history.start();
  }
};

$(document).ready(function(){
  // Sitbit.initialize();
});
