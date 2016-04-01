var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['backbone', 'jquery_cookie'], function(Backbone) {
  var VizModel, _ref;
  VizModel = (function(_super) {
    __extends(VizModel, _super);

    function VizModel() {
      this.sync = __bind(this.sync, this);
      _ref = VizModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    VizModel.prototype.url = '/api/v1/viz/';

    VizModel.prototype.sample_url = '/api/v1/data/';

    VizModel.prototype.sample_data = null;

    VizModel.prototype.sample = function(callback) {
      var data, sample_url,
        _this = this;
      if (this.sample_data) {
        callback(this.sample_data);
      } else {
        sample_url = "/api/v1/data/" + (this.get('repo')) + "/sample";
        data = {
          x: this.get('x_axis'),
          y: this.get('y_axis')
        };
        $.getJSON(sample_url, data, function(data) {
          _this.sample_data = data;
          return callback(data);
        });
      }
      return this;
    };

    VizModel.prototype.sync = function(method, model, options) {
      var _ref1, _ref2;
      options = options || {};
      options.url = "" + this.url + (this.get('repo')) + "/";
      if ((_ref1 = method.toLowerCase()) === 'create' || _ref1 === 'delete' || _ref1 === 'patch' || _ref1 === 'update') {
        options.headers = {
          'X-CSRFToken': $.cookie('csrftoken')
        };
      }
      if ((_ref2 = method.toLowerCase()) === 'delete') {
        options.url += "" + options.id + "/";
      }
      return Backbone.sync(method, model, options);
    };

    return VizModel;

  })(Backbone.Model);
  return VizModel;
});
