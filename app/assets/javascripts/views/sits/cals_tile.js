Sitbit.Views.CalsTile = Backbone.View.extend ({
  template: JST['users/sits/calories/calories_tile'],
  className: 'cals-tile-content',

  initialize: function () {
    this.listenTo(this.collection, 'sync add remove', this.render);
  },

  render: function () {
    this.$el.html(this.template({ sits: this.collection }));
    this.vegaParse();
    return this;
  },

  vegaParse: function () {
    function parse(spec) {
      vg.parse.spec(spec, function(chart) { chart({el:"#vis-cgt"}).update(); });
    }

    var content = this.vegaJson();
    parse(content);
  },

  vegaJson: function () {

    var graphSpecs = {
      "width": $("#cals-tile").width() - 50,
      "height": $("#cals-tile").height() - 80,
      // "padding": {"top": 30, "left": 30, "bottom": 30, "right": 30},
      "data": [
        {
          "name": "table",
          "values": this.parseCalsData()
        }
      ],
      "scales": [
        {
          "name": "x",
          "type": "ordinal",
          "range": "width",
          "domain": {"data": "table", "field": "x"}
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "domain": {"data": "table", "field": "y"},
          "nice": true
        }
      ],
      "axes": [
        {"type": "x", "scale": "x", "values": [0, 12, 23]},
        {"type": "y", "scale": "y"}
      ],
      "marks": [
        {
          "type": "rect",
          "from": {"data": "table"},
          "properties": {
            "enter": {
              "x": {"scale": "x", "field": "x"},
              "width": {"scale": "x", "band": true, "offset": -1},
              "y": {"scale": "y", "field": "y"},
              "y2": {"scale": "y", "value": 0}
            },
            "update": {
              "fill": {"value": "darkgray"}
            },
            "hover": {
              "fill": {"value": "maroon"}
            }
          }
        }
      ]
    };

    return graphSpecs;
  },

  parseCalsData: function () {
    var sitsToday = this.grabSitsToday();
    var output = [];

    debugger;

    for (var i = 0; i < 24; i++) {
      output.push({ "x": i, "y": i*10 });
    }

    return output;

  },

  grabSitsToday: function () {
    var output = [];
    var nd = (new Date(Date.now())).setHours(0,0,0,0);

    this.collection.models.forEach(function (sit) {
      var sd = new Date(sit.attributes.start_time).setHours(0,0,0,0);
      var ed = new Date(sit.attributes.end_time).setHours(0,0,0,0);

      if ( sd === nd || ed === nd) {
        output.push(sit);
      }
    });

    return output;
  }

});
