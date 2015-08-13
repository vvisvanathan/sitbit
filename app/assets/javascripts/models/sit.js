Sitbit.Models.Sit = Backbone.Model.extend({
  urlRoot: 'api/sits'

  // parse: function (response) {
  //   if (response.interval) {
  //     this.interval = response.interval;
  //     delete response.interval;
  //   }
  //
  //   if (response.cal_stats) {
  //     this.cal_stats = response.cal_stats;
  //     delete response.cal_stats;
  //   }
  //
  //   if (response.steps_avoided) {
  //     this.steps_avoided = response.steps_avoided;
  //     delete response.sits;
  //   }
  //
  //   return response;
  // },

});
