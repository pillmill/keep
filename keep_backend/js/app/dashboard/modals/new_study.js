var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/models/study', 'backbone_modal', 'jqueryui', 'jquery_cookie'], function($, _, Backbone, Marionette, StudyModel) {
  var NewStudyModal, _ref;
  NewStudyModal = (function(_super) {
    __extends(NewStudyModal, _super);

    function NewStudyModal() {
      _ref = NewStudyModal.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewStudyModal.prototype.template = _.template($('#new-study-template').html());

    NewStudyModal.prototype.submitEl = '.btn-primary';

    NewStudyModal.prototype.cancelEl = '.btn-cancel';

    NewStudyModal.prototype.clean = function() {
      var values;
      values = {
        name: $('#study-name').val().replace(/^\s+|\s+$/g, ""),
        description: $('#study-description').val().replace(/^\s+|\s+$/g, ""),
        tracker: $('#study-tracker').is(':checked')
      };
      return values;
    };

    NewStudyModal.prototype.beforeSubmit = function() {
      this.cleaned_data = this.clean();
      if (this.cleaned_data['name'].length === 0) {
        $('.error', $('#study-name').parent()).html('Please used a valid study name');
        return false;
      }
    };

    NewStudyModal.prototype.submit = function() {
      var study,
        _this = this;
      study = new StudyModel();
      return study.save(this.cleaned_data, {
        success: function(model, response, options) {
          model.set({
            id: response.id
          });
          return _this.collection.add(model);
        }
      });
    };

    return NewStudyModal;

  })(Backbone.Modal);
  return NewStudyModal;
});
