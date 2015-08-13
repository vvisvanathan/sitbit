Sitbit.Models.User = Backbone.Model.extend({
  urlRoot: '/api/users',

  parse: function (response) {
    if (response.sits) {
      this.sits().set(response.sits);
      delete response.sits;
    }

    return response;
  },

  sits: function () {
    if (!this._sits) {
      this._sits = new Sitbit.Collections.Sits([], { user: this });
    }

    return this._sits;
  }
});
