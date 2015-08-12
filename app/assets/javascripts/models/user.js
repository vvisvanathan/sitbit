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
  },

  _isMe: function () {
    return Sitbit.CURRENT_USER && Sitbit.CURRENT_USER.id === this.get("user_id");
  }
});
