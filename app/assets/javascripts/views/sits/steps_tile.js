Sitbit.Views.StepsTile = Backbone.View.extend ({
  template: JST['users/sits/steps/steps_tile'],
  className: 'steps-tile-content',

  initialize: function (options) {
    this.user = options.user;
    this.sitsToday = options.sitsToday;
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
      vg.parse.spec(spec, function(chart) { chart({el:"#vis-sgt"}).update(); });
    }
    var content = this.vegaJson();
    parse(content);
  },

  vegaJson: function () {
    this.hourNow = (new Date(Date.now())).getHours();
    var hourHeight = 0;
    if (new Date(this.viewDate).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
      hourHeight = $("#cals-tile").height() - 75;
    }
    var data = this.parseStepsData();

    var graphSpecs = {
      "width": $("#steps-tile").width() - 50,
      "height": $("#steps-tile").height() - 100,
      "padding": {"top": 30, "left": 30, "bottom": 30, "right": 30},
      "data": [
        {
          "name": "table",
          "values": this.parseStepsData()
        }
      ],
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "range": "width",
          "zero": false,
          "domain": {"data": "table", "field": "x"}
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "nice": true,
          "domain": {"data": "table", "field": "y"}
        }
      ],
      "axes": [
        {"type": "x", "scale": "x", "ticks": 20},
        {"type": "y", "scale": "y"}
      ],
      "marks": [
        {
          "type": "area",
          "from": {"data": "table"},
          "properties": {
            "enter": {
              "interpolate": {"value": "monotone"},
              "x": {"scale": "x", "field": "x"},
              "y": {"scale": "y", "field": "y"},
              "y2": {"scale": "y", "value": 0},
              "fill": {"value": "steelblue"}
            },
            "update": {
              "fillOpacity": {"value": 1}
            },
            "hover": {
              "fillOpacity": {"value": 0.5}
            }
          }
        }
      ]
    };
    return graphSpecs;
  },

  parseStepsData: function () {
    var sitData = this.sitsToday;
    var cutoff = new Date(Date.now()).getHours();
    var user_rmr = this.user.escape('rmr');
    var output = new Array(24);
    for (var i = 0; i < output.length; i++) { output[i] = {"x": i, "y": 0}; }

    sitData.forEach(function (sitdatum) {
      sitdatum.forEach(function (hourly) {
        if (hourly.date.day === new Date(Date.now()).getDate()) {
          var idx = parseInt(hourly.h_start);
          var frac = hourly.h_end - hourly.h_start;
          output[idx].y = (hourly.step_rate * frac);
        }
      }.bind(output));
    }.bind(output));

    return output;
  }
});
