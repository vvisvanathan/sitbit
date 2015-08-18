Sitbit.Routers.UserRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$navEl = options.$navEl;
    this.$rootEl = options.$rootEl;
    this.users = options.collection;
  },

  routes: {
    '' : 'userDash',
    'users' : 'userIndex',
    'users/:id' : 'userShow',
    'users/:id/edit' : 'userEdit'
  },

  userDash: function () {
    var user = this.users.getOrFetch(Sitbit.CURRENT_USER.id);
    var userShowView = new Sitbit.Views.UserShow({
      model: user,
      collection: this.users
    });

    this._swapView(userShowView);
  },

  userIndex: function () {
    this.users.fetch();
    var usersIndexView = new Sitbit.Views.UsersIndex({
      collection: this.users
    });
    this._swapView(usersIndexView);
  },

  userShow: function (id) {
    var user = this.users.getOrFetch(id);
    var userShowView = new Sitbit.Views.UserShow({
      model: user,
      collection: this.users
    });

    this._swapView(userShowView);
  },

  userEdit: function (id) {
    alert('Edit not yet implemented!');
    // var user = this.users.getOrFetch(id);
    // var userEditView = new Sitbit.Views.UserEdit({
    //   model: user,
    //   collection: this.users
    // });
    //
    // this._swapView(userEditView);
  },

  _swapView: function (newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.$el);
    newView.render();
  }
});
