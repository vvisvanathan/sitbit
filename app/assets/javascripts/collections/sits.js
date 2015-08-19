Sitbit.Collections.Sits = Backbone.Collection.extend({
  url: '/api/sits',
  model: Sitbit.Models.Sit,

  // getOrFetch: function (id) {
  //   var sitMaybe = this.get(id);
  //
  //   if (!sitMaybe) {
  //     sitMaybe = new Sitbit.Models.Sit({ id: id });
  //     this.add(sitMaybe);
  //     sitMaybe.fetch({
  //       error: function () {
  //         this.remove(sitMaybe);
  //       }.bind(this)
  //     });
  //   } else {
  //     sitMaybe.fetch();
  //   }
  //
  //   return sitMaybe;
  // },

  // fetch: function () {
  //   this.fetch({
  //     success: function () {
  //       this.updateSitsToday();
  //     }.bind(this)
  //   });
  // },

  sitsToday: function() {
    this._sitsToday = [];
    var ndd = new Date(Date.now()).setHours(0,0,0,0);

    this.each(function (sit) {
      var sdd = new Date(sit.get('start_time')).setHours(0,0,0,0);
      var edd = new Date(sit.get('end_time')).setHours(0,0,0,0);

      if (sit.get("hourly_split") === undefined) {
  debugger;
}
      if ( sdd === ndd || edd === ndd ) {
        this._sitsToday.push(sit.get("hourly_split"));
      }
    }.bind(this));

    return this._sitsToday;
  },
});
