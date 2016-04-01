var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['backbone', 'app/models/study'], function(Backbone, StudyModel) {
  var StudyCollection, _ref;
  StudyCollection = (function(_super) {
    __extends(StudyCollection, _super);

    function StudyCollection() {
      _ref = StudyCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    StudyCollection.prototype.model = StudyModel;

    StudyCollection.prototype.url = '/api/v1/studies/';

    StudyCollection.prototype.parse = function(response) {
      return response.objects;
    };

    return StudyCollection;

  })(Backbone.Collection);
  return StudyCollection;
});
