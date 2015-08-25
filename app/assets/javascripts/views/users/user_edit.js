Sitbit.Views.UserForm = Backbone.View.extend({
  template: JST['users/edit'],

  events: {
    'submit form' : 'submit'
  },

  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
  },

  render: function () {
    this.$el.html(this.template({
      user: this.model
    }));
  },

  submit: function (event) {
    event.preventDefault();
    var attrs = $(event.target).serializeJSON();

    var success = function () {
      this.collection.add(this.model);
      window.history.back();
    }.bind(this);

    var errors = function (model, response) {
      $('.settings-errors').empty();
      response.responseJSON.forEach(function (el) {
        var $li = $('<li>');
        $li.text(el);
        $('.settings-errors').append($li);
      });
    };

    this.model.save(attrs, {
      wait: true,
      success: success,
      error: errors
    });
  }
});
