Sitbit.Views.StepsTile = Backbone.View.extend ({
  template: JST['users/sits/steps/steps_tile'],
  className: 'steps-tile-content',

  initialize: function (options) {
    // TODO: After adding sit, success callback to rerender graph only
    this.user = options.user;
    this.listenTo(this.collection, 'sync add remove', this.vegaParse);
  },

  render: function () {
    this.$el.html(this.template({ sits: this.collection }));
    return this;
  },

  vegaParse: function () {
    function parse(spec) {
      vg.parse.spec(spec, function(chart) { chart({el:"#vis-sgt"}).update(); });
    }

    var content = this.vegaJson();
    parse(content);
  },

  vegaJson: function () {
    var graphSpecs = {
      "width": $("#steps-tile").width() - 50,
      "height": $("#steps-tile").height() - 100,
      "padding": {"top": 30, "left": 30, "bottom": 30, "right": 30},
      "data": [
        {
          "name": "table",
          "values": [
            {"x": 1,  "y": 28}, {"x": 2,  "y": 55},
            {"x": 3,  "y": 43}, {"x": 4,  "y": 91},
            {"x": 5,  "y": 81}, {"x": 6,  "y": 53},
            {"x": 7,  "y": 19}, {"x": 8,  "y": 87},
            {"x": 9,  "y": 52}, {"x": 10, "y": 48},
            {"x": 11, "y": 24}, {"x": 12, "y": 49},
            {"x": 13, "y": 87}, {"x": 14, "y": 66},
            {"x": 15, "y": 17}, {"x": 16, "y": 27},
            {"x": 17, "y": 68}, {"x": 18, "y": 16},
            {"x": 19, "y": 49}, {"x": 20, "y": 15}
          ]
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
    var sitData = this.grabSitsToday();
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
