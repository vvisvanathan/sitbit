Sitbit.Views.UserShow = Backbone.CompositeView.extend({
  template: JST['users/show'],
  className: 'dashboard',

  initialize: function () {
    this.sits = this.model.sits();
    this.listenTo(this.model, 'sync', this.render);
  },

  render: function () {
    var contents = this.template({
      user: this.model,
    });
    this.$el.html(contents);
    return this;
  }

});
