Sitbit.Views.UserShow = Backbone.CompositeView.extend({
  template: JST['users/show'],
  className: 'dashboard',

  initialize: function () {
    this.sits = this.model.sits();
    this.listenTo(this.model, 'sync', this.render);
    this.addTileSubviews();
  },

  render: function () {
    var pageTitle = this.model.escape('username');
    if (this.model.isCurrentUser()) {
      pageTitle = 'My Dashboard';
    }
    $('.page-title').text(pageTitle);

    var contents = this.template({
      user: this.model,
    });
    this.$el.html(contents);

    // TODO: might be double rendering. Experiment with leaving this out
    // or changing "addSubview()" method calls in add__TilesView methods
    this.attachSubviews();

    return this;
  },

  addTileSubviews: function () {
    var context = {
      collection: this.sits,
      user: this.model
    };

    this.addIntsTileView(context);
    this.addCalsTileView(context);
    this.addStepsTileView(context);
  },

  addIntsTileView: function (context) {
    var subview = new Sitbit.Views.IntsTile(context);
    this.addSubview('.intervals-tile', subview);
  },

  addCalsTileView: function (context) {
    this.calsView = new Sitbit.Views.CalsTile(context);
    this.addSubview('.calories-tile', this.calsView);
  },

  addStepsTileView: function (context) {
    var subview = new Sitbit.Views.StepsTile(context);
    this.addSubview('.steps-tile', subview);
  },

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
