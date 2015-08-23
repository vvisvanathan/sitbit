Sitbit.Views.NavShow = Backbone.View.extend({
  template: JST['nav/nav'],
  tagName: "nav",
  className: "navbar navbar-default",

  events: {
    'input [name=query]' : 'searchIt',
    'keydown' : 'keydownHandler',
    'click .result-row' : 'searchClear',
    'blur .searchbar' : 'searchClear'
  },

  initialize: function (options) {
    this.router = options.router;
  },

  render: function () {
    var content = this.template({

    });
    this.$el.html(content);
    return this;
  },

  searchIt: function (event) {
    event.preventDefault();
    var query = $('.searchbar').val();
    if (query.length < 1) {
      $('.search-results').empty();
      return;
    }

    var userResults = new Sitbit.Collections.Users();
    userResults.fetch({
      data: { 'query': query },
      processData: true,
      success: function () {
        this.renderResults(userResults);
      }.bind(this)
    });
  },

  keydownHandler: function (event) {
    var code = event.keyCode || e.which;
    if (code === 13) {
      event.preventDefault();
    }
    if (code === 27) {
      $('.searchbar').blur();
    }
  },

  renderResults: function (results) {
    var searchResultsUL = $('.search-results');
    searchResultsUL.empty();

    for (var i = 0; i < results.length; i++) {
      var model = results.at(i);
      var resultRow = $('<a>');
      resultRow.attr("href", "#users/" + model.escape('id'));
      resultRow.html("<li class='result-row'>" + "<strong>" +
                      model.escape('username') + "</strong> " +
                      model.escape('fname') + " " +
                      model.escape('lname') +
                      "</li>");
      searchResultsUL.append(resultRow);
    }
  },

  searchClear: function () {
    setTimeout(function () {
      $('.search-results').empty();
      $('.searchbar').val('');
    }, 100);
  }
});
