var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['underscore', 'backbone', 'app/models/viz'], function(_, Backbone, VizModel) {
  var VizCollection, _ref;
  VizCollection = (function(_super) {
    __extends(VizCollection, _super);

    function VizCollection() {
      _ref = VizCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    VizCollection.prototype.model = VizModel;

    VizCollection.prototype.parse = function(response) {
      return response.objects;
    };

    return VizCollection;

  })(Backbone.Collection);
  return VizCollection;
});
