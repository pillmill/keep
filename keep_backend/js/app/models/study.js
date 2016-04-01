var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['backbone', 'jquery_cookie'], function(Backbone) {
  var StudyModel, _ref;
  return StudyModel = (function(_super) {
    __extends(StudyModel, _super);

    function StudyModel() {
      _ref = StudyModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    StudyModel.prototype.initialize = function() {
      return this.url = '/api/v1/studies/';
    };

    StudyModel.prototype.sync = function(method, model, options) {
      var _ref1, _ref2;
      options = options || {};
      if ((_ref1 = method.toLowerCase()) === 'create') {
        options.headers = {
          'X-CSRFToken': $.cookie('csrftoken')
        };
      } else if ((_ref2 = method.toLowerCase()) === 'update' || _ref2 === 'delete') {
        options.url = "" + this.url + model.id + "/";
        options.headers = {
          'X-CSRFToken': $.cookie('csrftoken')
        };
      } else {
        options.url = this.url;
      }
      return Backbone.sync(method, model, options);
    };

    return StudyModel;

  })(Backbone.Model);
});
