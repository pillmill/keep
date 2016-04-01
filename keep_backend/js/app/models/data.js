var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['backbone'], function(Backbone) {
  var DataModel, _ref;
  DataModel = (function(_super) {
    __extends(DataModel, _super);

    function DataModel() {
      _ref = DataModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DataModel.prototype.defaults = {
      data: []
    };

    DataModel.prototype.geopoint = function(field) {
      var geojson, point;
      point = {
        lat: null,
        lng: null
      };
      geojson = this.get('data')[field.name];
      if (geojson == null) {
        return null;
      }
      return {
        lng: geojson.coordinates[0],
        lat: geojson.coordinates[1]
      };
    };

    return DataModel;

  })(Backbone.Model);
  return DataModel;
});
