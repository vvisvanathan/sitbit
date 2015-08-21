Sitbit.Models.User = Backbone.Model.extend({
  urlRoot: '/api/users',

  parse: function (response) {
    if (response.sits) {
      this.sits().reset(response.sits, { parse: true });
      delete response.sits;
    }

    if (response.followings) {
      this.followings().reset(response.followings, { parse: true });
      delete response.followings;
    }

    return response;
  },

  sits: function () {
    if (!this._sits) {
      this._sits = new Sitbit.Collections.Sits([], { user: this });
    }

    return this._sits;
  },

  followings: function () {
    if (!this._followings) {
      this._followings = new Sitbit.Collections.Follows([], { user: this });
    }

    return this._followings;
  },

  isCurrentUser: function () {
    return this.get('id') === Sitbit.CURRENT_USER.id;
  }
});
