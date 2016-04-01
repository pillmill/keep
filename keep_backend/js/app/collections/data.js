var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['underscore', 'backbone', 'app/models/data'], function(_, Backbone, DataModel) {
  var DataCollection, _ref;
  DataCollection = (function(_super) {
    __extends(DataCollection, _super);

    function DataCollection() {
      _ref = DataCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DataCollection.prototype.model = DataModel;

    DataCollection.prototype.initialize = function(options) {
	window.alert("phil app collections");
      this.column_names = _.map(options.fields, function(field) {
        return field.label;
      });
      this.url = "/api/v1/data/" + options.repo.id + "/";
      return this.meta = {
        offset: 0
      };
    };

    DataCollection.prototype.comparator = function(data) {
      return data.get('timestamp');
    };

    DataCollection.prototype.next = function(options) {
      var data;
      data = {};
      data.offset = this.meta.offset + 1;
      if ((this.meta.pages != null) && data.offset > this.meta.pages) {
        return;
      }
      if (this.sort_data != null) {
        data.sort = this.sort_data.sort;
        data.sort_type = this.sort_data.sort_type;
      }
      options = _.extend({
        data: data,
        add: true,
        remove: false
      }, options);
      return this.fetch(options);
    };

    DataCollection.prototype.parse = function(response) {
      if (response.meta != null) {
        this.meta = response.meta;
      }
      return response.data;
    };

    DataCollection.prototype.sort_fetch = function(options) {
      this.sort_data = {
        sort: options.field,
        sort_type: options.order
      };
      return this.fetch({
        data: this.sort_data,
        reset: true
      });
    };

    DataCollection.prototype.stats = function(options) {
      var stats_url;
      return stats_url = "{@url}stats/";
    };

    return DataCollection;

  })(Backbone.Collection);
  return DataCollection;
});
