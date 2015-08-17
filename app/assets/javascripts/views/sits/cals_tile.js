Sitbit.Views.CalsTile = Backbone.View.extend ({
  template: JST['users/sits/calories/calories_tile'],
  className: 'cals-tile-content',

  initialize: function (options) {
    this.user = options.user;
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
        {
          "type": "x",
          "scale": "x",
          "values": [0, 12, 23],
          "properties": {
            "labels": {
              "fill": {"value": "gray"},
              "fontSize": {"value": 14}
              //figure out "text"
            },
            "ticks": {
              "strokeWidth": {"value": 0}
            },
            "axis": {
              "strokeWidth": {"value": 0}
            }
          }
        },
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
    var sitData = this.grabSitsToday();
    var output = [];
    var cutoff = new Date(Date.now()).getHours();

    // TODO: fix resting metabolic rate!! Also, include sleep

    for (var i = 0; i < 24; i++) {
      var lastBar = -233;

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

    var output = [];
    var nd = (new Date(Date.now())).setHours(0,0,0,0);

    this.collection.models.forEach(function (sit) {
      var sd = new Date(sit.attributes.start_time);
      var ed = new Date(sit.attributes.end_time);
      var sdd = new Date(sit.attributes.start_time).setHours(0,0,0,0);
      var edd = new Date(sit.attributes.end_time).setHours(0,0,0,0);

      if ( sdd === nd || edd === nd ) {

        var st = 0;
        var et = 23;
        if (sdd < nd) { st = 0; } else {
          st = sd.getHours() + (sd.getMinutes()/60);
        }
        if (edd > nd) { et = 23; } else {
          et = ed.getHours() + (ed.getMinutes()/60);
        }

        output.push({
          "start" : st,
          "end" : et,
          "sit_rate" : sit.attributes.cal_stats.sit_rate
        });
      }
    });

    return output;
  }

});
