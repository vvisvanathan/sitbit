Sitbit.Views.UsersIndex = Backbone.CompositeView.extend({
  template: JST['users/index'],

  initialize: function () {
    this.listenTo(this.collection, 'remove sync', this.render);
  },

  render: function () {
    debugger;
    this.$el.html(this.template({ users: this.collection }));

    return this;
  },
});
