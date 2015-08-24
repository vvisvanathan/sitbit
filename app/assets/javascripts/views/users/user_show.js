Sitbit.Views.UserShow = Backbone.CompositeView.extend({
  template: JST['users/show'],
  userTemplate: JST['users/info'],
  className: 'dashboard',


  initialize: function () {
    this.sits = this.model.sits();
    this.sitsToday = this.sits.sitsToday();

    this.listenTo(this.model, 'sync', this.render);
    // TODO: MAYBE add one more listener that updates the data based on interval required
    this.listenTo(this.model, 'sync', this.renderTileGraphs);
    this.addTileSubviews();
    this.listenTo(this.sits, 'add remove', this.renderTileGraphs);
  },

  render: function () {
    // Render navbar title:
    var pageTitle = this.model.escape('username');
    if (this.model.isCurrentUser()) {
      pageTitle = 'My Dashboard';
    }
    $('.page-title').text(pageTitle);

    var contents = this.template({
      user: this.model,
      users: this.collection
    });

    this.$el.html(contents);
    this.attachSubviews();
    return this;
  },

  addTileSubviews: function () {
    var context = {
      sitsToday: this.sitsToday,
      user: this.model
    };

    if (this.model.isCurrentUser()) { this.addSitForm(); }
    this.addCalsTileView(context);
    this.addIntsTileView(context);
    this.addStepsTileView(context);
  },

  renderTileGraphs: function () {
    this.sitsToday = this.sits.sitsToday();

    this.calsView.updateGraph(this.sitsToday);
    this.intsView.updateGraph(this.sitsToday);
    this.stepsView.updateGraph(this.sitsToday);
  },

  addCalsTileView: function (context) {
    this.calsView = new Sitbit.Views.CalsTile(context);
    this.addSubview('.calories-tile', this.calsView);
  },

  addIntsTileView: function (context) {
    this.intsView = new Sitbit.Views.IntsTile(context);
    this.addSubview('.intervals-tile', this.intsView);
  },

  addStepsTileView: function (context) {
    this.stepsView = new Sitbit.Views.StepsTile(context);
    this.addSubview('.steps-tile', this.stepsView);
  },

  addSitForm: function () {
    $('.users-tile').empty();
    var formView = new Sitbit.Views.SitForm({
      collection: this.sits
    });
    this.addSubview('.users-tile', formView);
  }

});
