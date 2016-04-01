var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['backbone', 'app/models/repo'], function(Backbone, RepoModel) {
  var RepoCollection, _ref;
  return RepoCollection = (function(_super) {
    __extends(RepoCollection, _super);

    function RepoCollection() {
      _ref = RepoCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RepoCollection.prototype.model = RepoModel;

    RepoCollection.prototype.url = '/api/v1/repos/';

    RepoCollection.prototype.parse = function(response) {
      return response.objects;
    };

    return RepoCollection;

  })(Backbone.Collection);
});
