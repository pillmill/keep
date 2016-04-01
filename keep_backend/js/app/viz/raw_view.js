var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/collections/views/table'], function($, _, Backbone, Marionette, DataTableView) {
  var DataRawView, _ref;
  DataRawView = (function(_super) {
    __extends(DataRawView, _super);

    function DataRawView() {
      this.onRender = __bind(this.onRender, this);
      _ref = DataRawView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DataRawView.prototype.el = '#raw-viz';

    DataRawView.prototype.onRender = function() {
      this.$('.DataTable').addClass('DataTable--fitContainer');
      return DataRawView.__super__.onRender.apply(this, arguments);
    };

    DataRawView.prototype.initialize = function(options) {
      DataRawView.__super__.initialize.call(this, options);
      return this.collection.reset(document.initial_data);
    };

    return DataRawView;

  })(DataTableView);
  return DataRawView;
});
