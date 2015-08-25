Sitbit.Views.UserLog = Backbone.View.extend({
  template: JST['users/log'],

  events: {
    'click .delete-sit' : 'deleteSit'
  },

  initialize: function () {
    this.userSits = this.model.sits();
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.userSits, 'add remove', this.render);
  },

  render: function () {
    $('.page-title').text('Log');

    this.$el.html(this.template({
      user: this.model,
      sits: this.userSits
    }));
  },

  deleteSit: function (event) {
    event.preventDefault();
    var sit = this.userSits.get(event.currentTarget.dataset.id);
    sit.destroy();
  }
});
