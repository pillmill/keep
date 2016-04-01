var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['backbone', 'jquery_cookie'], function(Backbone) {
  var RepoModel, _ref;
  return RepoModel = (function(_super) {
    __extends(RepoModel, _super);

    function RepoModel() {
      _ref = RepoModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RepoModel.prototype.url = '/api/v1/repos/';

    RepoModel.prototype._detect_fields = function(root, fields) {
      var field, _i, _len, _ref1, _ref2, _ref3, _results;
      _results = [];
      for (_i = 0, _len = root.length; _i < _len; _i++) {
        field = root[_i];
        if ((_ref1 = field.type) === 'group') {
          this._detect_fields(field.children, fields);
        }
        if (((_ref2 = field.type) !== 'note') && ((_ref3 = field.type) !== 'group')) {
          _results.push(fields.push(field));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    RepoModel.prototype.fields = function() {
      var fields;
      fields = [];
      this._detect_fields(this.get('children'), fields);
      return fields;
    };

    RepoModel.prototype.share = function(options) {
      var share_url;
      share_url = "/repo/user_share/" + this.id + "/";
      return $.post(share_url, {
        username: options.data.user,
        permissions: options.data.perms
      }, function(response) {
        if (response === 'success' && (options.success != null)) {
          return options.success(response);
        } else if (options.failure != null) {
          return options.failure(response);
        }
      });
    };

    RepoModel.prototype.toJSON = function() {
      var attrs;
      attrs = _(this.attributes).clone();
      if ((attrs.description != null) && attrs.description.length > 0) {
        attrs.description = attrs.description.slice(0, 43) + '...';
      }
      if (this.get('user') !== document.user_id) {
        attrs.privacy_icon = 'fa fa-group';
      } else if (this.get('is_tracker')) {
        attrs.privacy_icon = 'fa fa-list';
      } else if (this.get('is_public')) {
        attrs.privacy_icon = 'fa fa-unlock';
      } else {
        attrs.privacy_icon = 'fa fa-lock';
      }
      return attrs;
    };

    RepoModel.prototype.sync = function(method, model, options) {
      var _ref1;
      options || (options = {});
      if ((_ref1 = method.toLowerCase()) === 'patch' || _ref1 === 'update' || _ref1 === 'delete') {
        options.url = "" + this.url + model.id + "/";
        options.headers = {
          'X-CSRFToken': $.cookie('csrftoken')
        };
      } else {
        options.url = this.url;
      }
      return Backbone.sync(method, model, options);
    };

    return RepoModel;

  })(Backbone.Model);
});
