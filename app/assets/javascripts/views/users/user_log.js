Sitbit.Views.UserLog = Backbone.View.extend({
  template: JST['users/log'],

  events: {
    'submit form' : 'submit'
  },

  initialize: function () {
    this.userSits = this.model.sits();
    this.listenTo(this.model, 'sync', this.render);
  },

  render: function () {
    $('.page-title').text('Log');

    this.$el.html(this.template({
      user: this.model,
      sits: this.userSits
    }));
  }
});
