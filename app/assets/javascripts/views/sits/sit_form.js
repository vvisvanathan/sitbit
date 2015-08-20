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

    this.setDefaultTimes();

    return this;
  },

  setDefaultTimes: function () {
    var t = new Date();
    t.setHours(t.getHours() - (t.getTimezoneOffset()/60));
    defaultDate = t.toISOString().slice(0,16);

    this.$el.find('#start-time').val(defaultDate);
    this.$el.find('#end-time').val(defaultDate);
  },

  submit: function (event) {
    event.preventDefault();
    var attrs = $(event.target).serializeJSON();

    var success = function () {
      this.collection.add(this.model);
      $('.sit-errors').empty();
      Backbone.history.navigate('');
      this.model = new Sitbit.Models.Sit();
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
