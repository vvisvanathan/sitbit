Sitbit.Collections.Sits = Backbone.Collection.extend({
  url: '/api/sits',
  model: Sitbit.Models.Sit,

  sitsToday: function(date) {
    this._sitsToday = [];
    if (date === undefined) { date = new Date(); }
    var ndd = date.setHours(0,0,0,0);

    this.each(function (sit) {
      var sdd = new Date(sit.get('start_time')).setHours(0,0,0,0);
      var edd = new Date(sit.get('end_time')).setHours(0,0,0,0);

      if ( sdd === ndd || edd === ndd ) {
        this._sitsToday.push(sit.get("hourly_split"));
      }
    }.bind(this));

    // Change controls header:
    if (ndd === new Date().setHours(0,0,0,0)) {
      $('.controls-date').text('Today');
    } else {
      $('.controls-date').text(date.toDateString());
    }

    return this._sitsToday;
  },
});
