Sitbit.Views.SitForm = Backbone.View.extend({
  template: JST['users/sits/form'],

  events: {
    'submit form' : 'submit'
  },

  initialize: function () {
    this.model = new Sitbit.Models.Sit();
  },

  render: function () {
    this.$el.html(this.template({
      sit: this.model,
      sits: this.collection
    }));
    return this;
  },

  submit: function (event) {
    event.preventDefault();
    var attrs = $(event.target).serializeJSON();

    var success = function () {
      this.collection.add(this.model);
      $('.sit-errors').empty();
      Backbone.history.navigate('');
    }.bind(this);

    var errors = function (model, response) {
      $('.sit-errors').empty();
      var $firstError = $('<p>');
      $firstError.text(response.responseJSON[0]);
      $('.sit-errors').append($firstError);
    }.bind(this);

    this.model.save(attrs, {
      success: success,
      error: errors,
      wait: true,
    });
  }
});
