Sitbit.Views.CalsTile = Backbone.View.extend ({
  template: JST['users/sits/calories/calories_tile'],
  className: 'cals-tile-content',

  initialize: function (options) {
    // TODO: After adding sit, success callback to rerender graph only
    this.user = options.user;
    this.listenTo(this.user, 'sync', this.vegaParse);
  },

  render: function () {
    this.$el.html(this.template({ sits: this.collection }));
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
    var hourNow = (new Date(Date.now())).getHours() + 1;

    var graphSpecs = {
      "width": $("#cals-tile").width() - 60,
      "height": $("#cals-tile").height() - 75,
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
        {
          "type": "x",
          "scale": "x",
          "values": [0, 12, 23],
          "offset": -5,
          "properties": {
            "labels": {
              "fill": {"value": "gray"},
              "fontSize": {"value": 12}
            },
            "ticks": {
              "strokeWidth": {"value": 0}
            },
            "axis": {
              "strokeWidth": {"value": 0}
            }
          }
        },
        {
          "type": "y",
          "scale": "y",
          "ticks": 3,
          "grid": true,
          "properties": {
            "labels": {
              "fill": {"value": "gray"},
              "fontSize": {"value": 12}
              //figure out "text"
            },
            "ticks": {
              "strokeWidth": {"value": 0}
            },
            "axis": {
              "strokeWidth": {"value": 0}
            }
          }
        }
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
              "fill": {"data": "table", "field": "c"}
            },
            "hover": {
              "fill": {"data": "table", "field": "hc"}
            }
          }
        },
        {
          "type": "rect",
          "from": {"data": "table"},
          "properties": {
            "enter": {
              "x": {"scale": "x", "value": hourNow},
              "width": {"value": 2},
              "y": {"value": 0},
              "y2": {"value": $("#cals-tile").height() - 75}
            },
            "update": {
              "fill": {"value": "red"}
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
    var sitData = this.grabSitsToday();
    var cutoff = new Date(Date.now()).getHours();
    var user_rmr = this.user.escape('rmr');
    var output = new Array(24);

    for (var i = 0; i < 24; i++) {
      var bar = 0;
      if (i <= cutoff) { bar = (i+1) * user_rmr; }
      output[i] = {
        "x": i,
        "y": -bar,
        "c": "lightgray",
        "hc": "lightblue"
      };
    }

    sitData.forEach(function (sitdatum) {
      sitdatum.forEach(function (hourly) {
        if (hourly.date.day === new Date(Date.now()).getDate()) {
          var idx = parseInt(hourly.h_start);
          var frac = hourly.h_end - hourly.h_start;
          output[idx].y += (hourly.scr * frac);

          hourly.is_sleep ? output[idx].c = "darkgray" : output[idx].c = "gray";
          if (output[idx].y > 0) { output[idx].hc = "lightgreen"; }
        }
      }.bind(output));
    }.bind(output));

    return output;
  },

  grabSitsToday: function () {
    var output = [];
    var ndd = new Date(Date.now()).setHours(0,0,0,0);

    this.collection.models.forEach(function (sit) {
      var sdd = new Date(sit.attributes.start_time).setHours(0,0,0,0);
      var edd = new Date(sit.attributes.end_time).setHours(0,0,0,0);

      if ( sdd === ndd || edd === ndd ) {
        output.push(sit.attributes.hourly_split);
      }
    });

    return output;
  }

});
