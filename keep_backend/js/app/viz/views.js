var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/models/data', 'app/models/repo', 'app/collections/repo', 'app/viz/modals/sharing', 'app/viz/raw_view', 'app/viz/map_view', 'app/viz/chart_view', 'app/viz/filters_view'], function($, _, Backbone, Marionette, DataModel, RepoModel, RepoCollection, ShareSettingsModal, DataRawView, DataMapView, DataChartView, DataFiltersView) {
  var DataSettingsView, DataVizApp, VizActions, VizChrome, VizContainer, VizTabs, _ref, _ref1, _ref2, _ref3, _ref4;
  DataSettingsView = (function(_super) {
    __extends(DataSettingsView, _super);

    function DataSettingsView() {
      _ref = DataSettingsView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DataSettingsView.prototype.el = '#settings-viz';

    return DataSettingsView;

  })(Backbone.Marionette.View);
  VizActions = (function(_super) {
    __extends(VizActions, _super);

    function VizActions() {
      _ref1 = VizActions.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    VizActions.prototype.el = '#viz-actions';

    VizActions.prototype.events = {
      'click #share-btn': 'sharing_settings'
    };

    VizActions.prototype.initialize = function(options) {
      return this.options = options;
    };

    VizActions.prototype.sharing_settings = function(event) {
      this.modalView = new ShareSettingsModal(this.options);
      $('.modal').html(this.modalView.render().el);
      return this.modalView.onAfterRender($('.modal'));
    };

    return VizActions;

  })(Backbone.Marionette.View);
  VizTabs = (function(_super) {
    __extends(VizTabs, _super);

    function VizTabs() {
      _ref2 = VizTabs.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    VizTabs.prototype.el = '#viz-options';

    VizTabs.prototype.events = {
      'click li': 'switch_event'
    };

    VizTabs.prototype.switch_event = function(event) {
      var target;
      event.preventDefault();
      target = $(event.currentTarget);
      if (this.selected().data('type') === target.data('type')) {
        return;
      }
      if (target.hasClass('disabled')) {
        return;
      }
      this.selected().removeClass('active');
      target.addClass('active');
      return this.trigger('switch:' + target.data('type'));
    };

    VizTabs.prototype.selected = function() {
      return this.$('li.active');
    };

    return VizTabs;

  })(Backbone.Marionette.View);
  VizChrome = (function(_super) {
    __extends(VizChrome, _super);

    function VizChrome() {
      _ref3 = VizChrome.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    VizChrome.prototype.el = '#viz-chrome';

    VizChrome.prototype.initialize = function(options) {
      this.vizActions = new VizActions(options);
      this.vizTabs = new VizTabs(options);
      return this.attachView(this.vizTabs);
    };

    return VizChrome;

  })(Backbone.Marionette.Region);
  VizContainer = (function(_super) {
    __extends(VizContainer, _super);

    function VizContainer() {
      _ref4 = VizContainer.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    VizContainer.prototype.el = '#viz-container';

    VizContainer.prototype.initialize = function(options) {
      var current_route, initial_view;
      this.rawView = new DataRawView(options);
      this.mapView = new DataMapView(options);
      this.chartView = new DataChartView(options);
      this.filtersView = new DataFiltersView(options);
      this.settingsView = new DataSettingsView(options);
      this.views = {
        raw: this.rawView,
        map: this.mapView,
        line: this.chartView,
        filters: this.filtersView,
        settings: this.settingsView
      };
      current_route = Backbone.history.getFragment();
      initial_view = this.views[current_route];
      initial_view || (initial_view = this.rawView);
      this.show(initial_view);
      this.currentView.$el.show();
      return this;
    };

    VizContainer.prototype.switch_view = function(view) {
      this.currentView.$el.hide();
      this.show(this.views[view], {
        preventClose: true
      });
      this.currentView.$el.show();
      return Backbone.history.navigate(view);
    };

    return VizContainer;

  })(Backbone.Marionette.Region);
  DataVizApp = new Backbone.Marionette.Application;
  DataVizApp.addInitializer(function(options) {
    var views, vizChrome, vizContainer;
    this.repo = new RepoModel(document.repo);
    this.linked = new RepoCollection(document.linked_repos);
    options = {
      repo: this.repo,
      linked: this.linked,
      fields: this.repo.fields(),
      visualizations: document.visualizations
    };
    vizChrome = new VizChrome(options);
    vizContainer = new VizContainer(options);
    DataVizApp.addRegions({
      chrome: vizChrome,
      viz: vizContainer
    });
    views = ['raw', 'map', 'line', 'filters', 'settings'];
    _.each(views, function(view) {
      return vizChrome.currentView.on("switch:" + view, function() {
        return vizContainer.switch_view(view);
      });
    });
    return this;
  });
  return DataVizApp;
});
