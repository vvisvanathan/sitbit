Sitbit.Models.User = Backbone.Model.extend({
  urlRoot: '/api/users',

  parse: function (response) {
    if (response.sits) {
      this.sits().reset(response.sits, { parse: true });
      delete response.sits;
    }

    return response;
  },

  sits: function () {
    if (!this._sits) {
      this._sits = new Sitbit.Collections.Sits([], { user: this });
    }

    return this._sits;
  },

  isCurrentUser: function () {
    return this.get('id') === Sitbit.CURRENT_USER.id;
  }
});
