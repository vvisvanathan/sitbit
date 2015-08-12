Sitbit.Collections.Sits = Backbone.Collection.extend({
  url: '/api/sits',
  model: Sitbit.Models.Sit,

  getOrFetch: function (id) {
    var sitMaybe = this.get(id);

    if (!sitMaybe) {
      sitMaybe = new Sitbit.Models.Sit({ id: id });
      this.add(sitMaybe);
      sitMaybe.fetch({
        error: function () {
          this.remove(sitMaybe);
        }.bind(this)
      });
    } else {
      sitMaybe.fetch();
    }

    return sitMaybe;
  },

});
