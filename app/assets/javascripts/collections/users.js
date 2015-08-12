Sitbit.Collections.Users = Backbone.Collection.extend({
  url: '/api/users',
  model: Sitbit.Models.User,

  getOrFetch: function (id) {
    var userMaybe = this.get(id);

    if (!userMaybe) {
      userMaybe = new Sitbit.Models.User({ id: id });
      this.add(userMaybe);
      userMaybe.fetch({
        error: function () {
          this.remove(userMaybe);
        }.bind(this)
      });
    } else {
      userMaybe.fetch();
    }

    return userMaybe;
  },

  // TODO: might not need this... but just in case:
  getOrFetchSit: function (userId, sitId) {
    var userMaybe = this.get(userId);
    var list;
    if (userMaybe) {
      list = userMaybe.lists().getOrFetch(sitId);
    } else {
      list = new Sitbit.Models.Sit( { id: sitId });
      list.fetch();
    }

    return list;
  }

});
