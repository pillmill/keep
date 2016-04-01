var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/collections/viz'], function($, _, Backbone, Marionette, VizCollection) {
  var VizCollectionView, VizItemView, _ref, _ref1;
  VizItemView = (function(_super) {
    __extends(VizItemView, _super);

    function VizItemView() {
      _ref = VizItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    VizItemView.prototype.tagName = 'div';

    VizItemView.prototype.template = _.template('<svg id=\'viz-<%= id %>\'></svg>\n<a href=\'#\' data-id=\'<%= id %>\' class=\'btn btn-small btn-delete\'>\n    <i class=\'fa fa-trash\'></i>\n    Delete\n</a>&nbsp;');

    return VizItemView;

  })(Backbone.Marionette.ItemView);
  VizCollectionView = (function(_super) {
    __extends(VizCollectionView, _super);

    function VizCollectionView() {
      _ref1 = VizCollectionView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    VizCollectionView.prototype.el = $('#analytics-viz-list');

    VizCollectionView.prototype.itemView = VizItemView;

    VizCollectionView.prototype.collection = new VizCollection;

    VizCollectionView.prototype.buildItemView = function(item, ItemViewType, itemViewOptions) {
      var options;
      options = _.extend({
        model: item
      }, itemViewOptions, {
        className: 'eight columns'
      });
      return new ItemViewType(options);
    };

    return VizCollectionView;

  })(Backbone.Marionette.CollectionView);
  return VizCollectionView;
});
