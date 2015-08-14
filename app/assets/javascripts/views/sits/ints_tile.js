Sitbit.Views.IntsTile = Backbone.View.extend ({
  template: JST['users/sits/intervals/intervals_tile'],
  className: 'intervals-tile-content',

  initialize: function () {
    this.listenTo(this.collection, 'add remove', this.render);
  },

  render: function () {
    this.$el.html(this.template({ sits: this.collection }));
    return this;
  }
});
