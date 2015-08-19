Sitbit.Views.IntsTile = Backbone.View.extend ({
  template: JST['users/sits/intervals/intervals_tile'],
  className: 'intervals-tile-content',

  initialize: function (options) {
    this.user = options.user;
    this.sitsToday = options.sitsToday;
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
      vg.parse.spec(spec, function(chart) { chart({el:"#vis-igt"}).update(); });
    }
    var content = this.vegaJson();
    parse(content);
  },

  vegaJson: function () {
    var graphSpecs = {
      "width": $("#ints-tile").width() - 50,
      "height": $("#ints-tile").height() - 100,
      "padding": {"top": 30, "left": 30, "bottom": 30, "right": 30},
      "data": [
        {
          "name": "table",
          "values": [12, 23, 47, 6, 52, 19],
          "transform": [{"type": "pie", "field": "data"}]
        }
      ],
      "scales": [
        {
          "name": "r",
          "type": "sqrt",
          "domain": {"data": "table", "field": "data"},
          "range": [20, 100]
        }
      ],
      "marks": [
        {
          "type": "arc",
          "from": {"data": "table"},
          "properties": {
            "enter": {
              "x": {"field": {"group": "width"}, "mult": 0.5},
              "y": {"field": {"group": "height"}, "mult": 0.5},
              "startAngle": {"field": "layout_start"},
              "endAngle": {"field": "layout_end"},
              "innerRadius": {"value": 20},
              "outerRadius": {"scale": "r", "field": "data"},
              "stroke": {"value": "#fff"}
            },
            "update": {
              "fill": {"value": "#ccc"}
            },
            "hover": {
              "fill": {"value": "pink"}
            }
          }
        },
        {
          "type": "text",
          "from": {"data": "table"},
          "properties": {
            "enter": {
              "x": {"field": {"group": "width"}, "mult": 0.5},
              "y": {"field": {"group": "height"}, "mult": 0.5},
              "radius": {"scale": "r", "field": "data", "offset": 8},
              "theta": {"field": "layout_mid"},
              "fill": {"value": "#000"},
              "align": {"value": "center"},
              "baseline": {"value": "middle"},
              "text": {"field": "data"}
            }
          }
        }
      ]
    };
    return graphSpecs;
  }
});
