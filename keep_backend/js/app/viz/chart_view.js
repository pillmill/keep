var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/collections/data', 'app/collections/viz', 'app/collections/views/viz', 'app/viz/modals/new_viz', 'd3', 'nvd3'], function($, _, Backbone, Marionette, DataCollection, VizCollection, VizCollectionView, NewVizModal, d3, nvd3) {
  var ChartItemView, DataChartView, _ref, _ref1;
  ChartItemView = (function(_super) {
    __extends(ChartItemView, _super);

    function ChartItemView() {
      _ref = ChartItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ChartItemView.prototype.template = _.template('n/a');

    return ChartItemView;

  })(Backbone.Marionette.ItemView);
  DataChartView = (function(_super) {
    __extends(DataChartView, _super);

    function DataChartView() {
      this._on_new_viz = __bind(this._on_new_viz, this);
      _ref1 = DataChartView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    DataChartView.prototype.el = '#analytics-viz';

    DataChartView.prototype.itemView = ChartItemView;

    DataChartView.prototype.events = {
      'click .create-new a': 'create_new_viz_event',
      'click a.btn-delete': 'delete_viz_event'
    };

    DataChartView.prototype._on_new_viz = function(model, response, options) {
      model.set({
        id: response.id
      });
      this.viz_view.collection.add(model);
      this.render();
      return this;
    };

    DataChartView.prototype.initialize = function(options) {
      this.repo = options.repo;
      this.fields = options.fields;
      this.viz_view = new VizCollectionView(options);
      this.viz_view.collection.reset(options.visualizations);
      this.render();
      $(window).resize(this.resize);
      return this;
    };

    DataChartView.prototype.onShow = function() {
      return $(window).trigger('resize');
    };

    DataChartView.prototype.create_new_viz_event = function(event) {
      var options;
      options = {
        repo: this.repo,
        fields: this.fields,
        success: this._on_new_viz
      };
      this.modalView = new NewVizModal(options);
      $('.modal').html(this.modalView.render().el);
      return this;
    };

    DataChartView.prototype.delete_viz_event = function(event) {
      var viz, viz_id;
      viz_id = $(event.currentTarget).data('id');
      viz = this.viz_view.collection.get(viz_id);
      if (viz != null) {
        this.viz_view.collection.remove(viz);
        viz.destroy({
          id: viz.id
        });
      }
      return this;
    };

    DataChartView.prototype.render = function() {
      var viz, _i, _len, _ref2;
      _ref2 = this.viz_view.collection.models;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        viz = _ref2[_i];
        this.graph(viz);
      }
      return this;
    };

    DataChartView.prototype.graph = function(viz) {
      return viz.sample(function(data) {
        var viz_id,
          _this = this;
        viz_id = "#viz-" + (viz.get('id'));
        return nv.addGraph(function() {
          var chart, chart_data, height, width;
          width = 600;
          height = 200;
          chart = nv.models.lineChart().options({
            height: height,
            showXAxis: true,
            showYAxis: true,
            transitionDuration: 250
          });
          chart.xAxis.axisLabel(viz.get('x_axis'));
          chart.yAxis.axisLabel(viz.get('y_axis'));
          chart_data = {
            values: data,
            key: viz.get('name'),
            color: '#F00'
          };
          d3.select(viz_id).attr('height', height).datum([chart_data]).call(chart);
          nv.utils.windowResize(chart.update);
          return chart;
        });
      });
    };

    DataChartView;

    return DataChartView;

  })(Backbone.Marionette.View);
  return DataChartView;
});
