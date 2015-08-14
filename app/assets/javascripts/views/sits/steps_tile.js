Sitbit.Views.StepsTile = Backbone.View.extend ({
  template: JST['users/sits/steps/steps_tile'],
  className: 'steps-tile-content',

  initialize: function () {
    this.listenTo(this.collection, 'sync add remove', this.render);
  },

  render: function () {
    this.$el.html(this.template({ sits: this.collection }));
    return this;
  }
});
