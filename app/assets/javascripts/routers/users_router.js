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
    var user = this.users.getOrFetch(Sitbit.CURRENT_USER.id);
    var userDashView = new Sitbit.Views.UserDash({
      model: user
    });

    this._swapView(userDashView);
  },

  userIndex: function () {
    alert('userIndex');
  },

  userShow: function () {
    alert('userShow');
  },

  userEdit: function () {
    alert('userEdit');
  },

  _swapView: function (newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.$el);
    newView.render();
  }
});
