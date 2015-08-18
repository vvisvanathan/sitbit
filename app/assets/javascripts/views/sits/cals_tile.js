Sitbit.Views.CalsTile = Backbone.View.extend ({
  template: JST['users/sits/calories/calories_tile'],
  className: 'cals-tile-content',

  initialize: function (options) {
    // TODO: After adding sit, success callback to rerender

    this.user = options.user;
    // this.listenTo(this.collection, 'add remove', this.render);
    this.listenTo(this.user, 'sync', this.render);
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
          "offset": -10,
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
              "fill": {"value": "darkgray"}
            },
            "hover": {
              "fill": {"value": "maroon"}
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
              "y": {"value": 5},
              "y2": {"value": $("#cals-tile").height() - 80}
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
    var output = [];

    // TODO: fix resting metabolic rate!! Also, include sleep

    for (var i = 0; i < 24; i++) {
      var lastBar = -(this.user.escape('rmr'));

      if (output[i-1]) { lastBar += output[i-1].y; }
      if (i > cutoff) { lastBar = 0; }
      output.push({ "x": i, "y": lastBar });
    }

    sitData.forEach(function (sitdata) {

      var s = parseInt(sitdata.start);
      var sf = sitdata.start - s;
      var e = parseInt(sitdata.end);
      var ef = sitdata.end - s;

      for (var j = s; j <= e; j++) {
        var prevBar = output[j].y;
        if (output[j-1]) { prevBar = output[j-1].y; }
        output[j].y = prevBar + (sitdata.sit_rate * (j+1));
      }

      for (var i = e+1; i <= cutoff; i++) {
        output[i].y += output[e].y;
      }
    }.bind(output));

    return output;
  },

  grabSitsToday: function () {
    // TODO: sort sits before returning
    // TODO: this method needs a lot of tuning up to include sleep and fractions
    // debugger;

    var output = [];
    var nd = new Date(Date.now());
    var ndd = (new Date(Date.now())).setHours(0,0,0,0);

    this.collection.models.forEach(function (sit) {
      var sd = new Date(sit.attributes.start_time);
      var ed = new Date(sit.attributes.end_time);
      var sdd = new Date(sit.attributes.start_time).setHours(0,0,0,0);
      var edd = new Date(sit.attributes.end_time).setHours(0,0,0,0);

      if ( sdd === ndd || edd === ndd ) {

        

        output.push({
          "is_sleep" : sit.attributes.is_sleep,
          "sit_rate" : sit.attributes.cal_stats.sit_rate,
          "hourlys" : sit.attributes.hourly_split
        });
      }
    });

    return output;
  }

});
