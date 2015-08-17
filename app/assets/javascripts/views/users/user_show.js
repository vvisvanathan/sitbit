Sitbit.Views.UserShow = Backbone.CompositeView.extend({
  template: JST['users/show'],
  className: 'dashboard',

  initialize: function () {
    this.sits = this.model.sits();

    this.listenTo(this.model, 'sync', this.render);
    // TODO: check this pattern with a TA
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

    this.attachSubviews();

    return this;
  },

  addTileSubviews: function () {
    this.addIntsTileView();
    this.addCalsTileView();
    this.addStepsTileView();
  },

  addIntsTileView: function () {
    var subview = new Sitbit.Views.IntsTile({ collection: this.sits });
    this.addSubview('.intervals-tile', subview);
  },

  addCalsTileView: function () {
    var subview = new Sitbit.Views.CalsTile({
      collection: this.sits,
      user: this.model
    });
    this.addSubview('.calories-tile', subview);
  },

  addStepsTileView: function () {
    var subview = new Sitbit.Views.StepsTile({ collection: this.sits });
    this.addSubview('.steps-tile', subview);
  },

  // addFriendsView: function () {
  //   var subview = new Sitbit.Views.FriendsTile({ collection: this.friends });
  //   this.addSubview('.steps-tile', subview);
  // },
  //
  // addProfileToolsView: function () {
  //   var subview = new Sitbit.Views.ProfileToolsTile({ collection: this.sits });
  //   this.addSubview('.steps-tile', subview);
  // }
});
