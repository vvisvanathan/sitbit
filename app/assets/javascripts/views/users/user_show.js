Sitbit.Views.UserShow = Backbone.CompositeView.extend({
  template: JST['users/show'],
  className: 'dashboard',

  initialize: function () {
    this.sits = this.model.sits();
    this.sitsToday = this.sits.sitsToday();

    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model, 'sync', this.renderTileGraphs);
    this.addTileSubviews();
    this.listenTo(this.sits, 'add remove', this.renderTileGraphs);
  },

  render: function () {
    // Render navbar title:
    var pageTitle = this.model.escape('username');
    if (this.model.isCurrentUser()) { pageTitle = 'My Dashboard'; }
    $('.page-title').text(pageTitle);

    var contents = this.template({
      user: this.model,
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

    this.addCalsTileView(context);
    this.addIntsTileView(context);
    this.addStepsTileView(context);
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

  renderTileGraphs: function () {
    this.sitsToday = this.sits.sitsToday();

    this.calsView.updateGraph(this.sitsToday);
    this.intsView.updateGraph(this.sitsToday);
    this.stepsView.updateGraph(this.sitsToday);
  }
  // addFriendsView: function () {
  //   var subview = new Sitbit.Views.FriendsTile({ collection: this.friends });
  //   this.addSubview('.steps-tile', subview);
  // },
  //
  // addProfileToolsView: function () {
  // pass in this.calsView
  //   var subview = new Sitbit.Views.ProfileToolsTile({ collection: this.sits, calsView: this.calsView });
  //   this.addSubview('.steps-tile', subview);
  // }
});
