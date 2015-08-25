Sitbit.Views.CalsTile = Backbone.View.extend ({
  template: JST['users/sits/calories/calories_tile'],
  className: 'cals-tile-content',

  initialize: function (options) {
    this.user = options.user;
    this.sitsToday = options.userShow.sitsToday;
    this.viewDate = options.userShow.viewDate;
    this.listenTo(this.user, 'sync', this.vegaParse);
  },

  render: function () {
    this.$el.html(this.template({ sits: this.collection }));
    return this;
  },

  updateGraph: function (sitData) {
    this.sitsToday = sitData;
    this.vegaParse();
  },

  // VEGA:

  vegaParse: function () {
    function parse(spec) {
      vg.parse.spec(spec, function(chart) { chart({el:"#vis-cgt"}).update(); });
    }

    var content = this.vegaJson();
    parse(content);
  },

  vegaJson: function () {
    this.hourNow = (new Date(Date.now())).getHours();
    if (new Date(this.viewDate).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
      var hourHeight = $("#cals-tile").height() - 75;
    } else {
      var hourHeight = 0;
    }
    var data = this.parseCalsDiffs();

    var graphSpecs = {
      "width": $("#cals-tile").width() - 60,
      "height": $("#cals-tile").height() - 75,
      // "padding": {"top": 30, "left": 30, "bottom": 30, "right": 30},
      "data": [
        {
          "name": "table",
          "values": data[0]
        },
        {
          "name": "integral",
          "values": data[1]
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
          "domain": this.graphDomain,
          "nice": true
        }
      ],
      "axes": [
        {
          "type": "x",
          "scale": "x",
          "values": [0, 6, 12, 18, 23],
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
              "width": {"scale": "x", "band": true},
              "y": {"value": 0},
              "y2": {"value": $("#cals-tile").height() - 75},
              "fill": {"data": "table", "field": "zc"},
              "fillOpacity": {"value": 0.1}
            }
          }
        },
        {
          "type": "area",
          "from": {"data": "integral"},
          "properties": {
            "enter": {
              "interpolate": {"value": "basis"},
              "x": {"scale": "x", "field": "x"},
              "y": {"scale": "y", "field": "t"},
              "y2": {"scale": "y", "value": 0}
            },
            "update": {
              "fill": {
                "r": {"value": 220},
                "g": {"value": 220},
                "b": {"value": 220}
              },
              "fillOpacity": {"value": 0.75}
            },
            "hover": {
              "fill": {
                "r": {"value": 190},
                "g": {"value": 190},
                "b": {"value": 190}
              },
              "fillOpacity": {"value": 0.95}
            }
          }
        },
        {
          "type": "rect",
          "from": {"data": "table"},
          "properties": {
            "enter": {
              "x": {"scale": "x", "value": this.hourNow},
              "width": {"scale": "x", "band": true, "offset": -1},
              "y": {"value": 0},
              "y2": {"value": hourHeight}
            },
            "update": {
              "fillOpacity": {"value": 0.01},
              "fill": {"value": "red"},
            },
            "hover": {
              "fillOpacity": {"value": 0.1},
              "fill": {"value": "maroon"}
            }
          }
        },
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
              "fill": {"data": "table", "field": "c"},
              "fillOpacity": {"value": 0.7}
            },
            "hover": {
              "fill": {"data": "table", "field": "hc"},
              "fillOpacity": {"value": 1.0}
            }
          }
        }
      ]
    };
    return graphSpecs;
  },

  parseCalsDiffs: function () {
    var sitData = this.sitsToday;
    var cutoff = 23;
    if (new Date(this.viewDate).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
      cutoff = (new Date(Date.now())).getHours();
    }
    this.output = new Array(24);
    var integral = new Array(cutoff + 1);
    var user_rmr = this.user.escape('rmr');
    var minDomain = -200;
    var maxDomain = 200;

    for (var i = 0; i < 24; i++) {
      var bar = -user_rmr;
      if (i > cutoff) { bar = 0; }
      this.output[i] = {
        "x": i,
        "y": bar,
        "t": 0,
        "c": "gray",
        "hc": "lightblue",
        "zc": "transparent"
      };

      if (lastBar > maxDomain) { maxDomain = (Math.round(lastBar/100)*100 + 100); }
      if (lastBar < minDomain) { minDomain = (Math.round(lastBar/100)*100 - 100); }
    }

    sitData.forEach(function (sitdatum) {
      sitdatum.forEach(function (hourly) {
        var isToday = (hourly.date.day === new Date(this.viewDate).getDate());
        var isHappened = (hourly.h_end <= cutoff);
        if (isToday && isHappened) {
          var idx = parseInt(hourly.h_start);
          var frac = hourly.h_end - hourly.h_start;
          this.output[idx].y += hourly.scr * frac;

          // Ugly conditionals for color assignment:
          if (this.output[idx].y > 0) { this.output[idx].hc = "lightgreen"; }
          if (hourly.is_sleep) {
            this.output[idx].c = "black";
            this.output[idx].zc = "steelblue";
          } else {
            this.output[idx].c = "gray";
            this.output[idx].zc = "green";
          }
        }
      }.bind(this));
    }.bind(this));

    var lastBar = 0;
    for (var z = 0; z <= cutoff; z++) {
      if (z > 0) { lastBar += this.output[z - 1].y; }
      integral[z] = { "x": z, "t": lastBar };

      if ( integral[z].t > maxDomain) { maxDomain = (Math.round(integral[z].t/100)*100 + 100); }
      if ( integral[z].t < minDomain) { minDomain = (Math.round(integral[z].t/100)*100 - 100); }
    }

    this.graphDomain = [minDomain, maxDomain];
    return [this.output, integral];
  }
});
