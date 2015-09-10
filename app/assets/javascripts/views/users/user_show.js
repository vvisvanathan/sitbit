Sitbit.Views.UserShow = Backbone.CompositeView.extend({
  template: JST['users/show'],
  userTemplate: JST['users/info'],
  className: 'dashboard',

  events: {
    'click .date-toggle-left' : 'dateToggleLeft',
    'click .date-toggle-right' : 'dateToggleRight',
    'click .controls-date-link' : 'dateReset'
  },

  initialize: function (options) {
    this.collection.fetch();
    this.viewDate = options.viewDate;
    this.sits = this.model.sits();
    this.sitsToday = this.sits.sitsToday(this.viewDate);

    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.model, 'sync', this.render);
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
      user: this.model,
      userShow: this
    };

    if (this.model.isCurrentUser()) { this.addSitForm(); }
    this.addCalsTileView(context);
    this.addStepsTileView(context);
    // this.addIntsTileView(context);
  },

  renderTileGraphs: function () {
    this.sitsToday = this.sits.sitsToday(this.viewDate);

    this.calsView.updateGraph(this.viewDate, this.sitsToday);
    this.stepsView.updateGraph(this.viewDate, this.sitsToday);
    // this.intsView.updateGraph(this.viewDate, this.sitsToday);
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
    this.addSubview('.form-tile', formView);
  },

  dateToggleLeft: function (event) {
    event.preventDefault();
    this.viewDate.setDate(this.viewDate.getDate() - 1);
    var tdate = new Date(this.viewDate);

    if (tdate.setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
      $('.controls-date').text('Today');
    } else {
      $('.controls-date').text(this.viewDate.toDateString());
    }

    this.renderTileGraphs();
  },

  dateToggleRight: function (event) {
    event.preventDefault();
    this.viewDate.setDate(this.viewDate.getDate() + 1);
    var tdate = new Date(this.viewDate);

    if (tdate.setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
      $('.controls-date').text('Today');
    } else {
      $('.controls-date').text(this.viewDate.toDateString());
    }

    this.renderTileGraphs();
  },

  dateReset: function (event) {
    event.preventDefault();
    this.viewDate = new Date();

    this.renderTileGraphs();
    $('.controls-date').text('Today');
  }

});
