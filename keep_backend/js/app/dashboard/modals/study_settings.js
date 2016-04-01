var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'backbone_modal', 'jqueryui', 'jquery_cookie'], function($, _, Backbone, Marionette) {
  var StudySettingsModal, _ref;
  StudySettingsModal = (function(_super) {
    __extends(StudySettingsModal, _super);

    function StudySettingsModal() {
      this.onRender = __bind(this.onRender, this);
      this.delete_event = __bind(this.delete_event, this);
      _ref = StudySettingsModal.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    StudySettingsModal.prototype.template = _.template($('#study-settings-template').html());

    StudySettingsModal.prototype.cancelEl = '.btn-primary';

    StudySettingsModal.prototype.initialize = function(options) {
      this.collection = options.collection;
      return this.study = options.study;
    };

    StudySettingsModal.prototype.delete_event = function(event) {
      this.collection.remove(this.study);
      this.study.destroy();
      return this.close();
    };

    StudySettingsModal.prototype.onRender = function() {
      $('.study-name', this.el).html(this.study.get('name'));
      return $('.study-delete', this.el).click(this.delete_event);
    };

    return StudySettingsModal;

  })(Backbone.Modal);
  return StudySettingsModal;
});
