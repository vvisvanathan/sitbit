Sitbit.Routers.UserRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$navEl = options.$navEl;
    this.$rootEl = options.$rootEl;
    this.users = options.users;
  },

  routes: {
    '' : 'userDash',
    'users' : 'userIndex',
    'users/:id' : 'userShow',
    'users/:id/edit' : 'userEdit',
  },

  userDash: function () {
    
  },

  userIndex: function () {

  },

  userShow: function () {

  },

  userEdit: function () {

  }
});
