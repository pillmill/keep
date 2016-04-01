var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'backbone_modal', 'jqueryui', 'jquery_cookie'], function($, _, Backbone, Marionette) {
  var LanguageSelectModal, _ref;
  LanguageSelectModal = (function(_super) {
    __extends(LanguageSelectModal, _super);

    function LanguageSelectModal() {
      _ref = LanguageSelectModal.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LanguageSelectModal.prototype.template = _.template($('#language-select').html());

    LanguageSelectModal.prototype.submitEl = '.btn-primary';

    LanguageSelectModal.prototype.cancelEl = '.btn-cancel';

    LanguageSelectModal.prototype.initialize = function(options) {
      this.current_language = options.current;
      return this.callbackobject = options.view;
    };

    LanguageSelectModal.prototype.onAfterRender = function(modal) {
      return $('input[value=' + this.current_language + ']', modal).prop('checked', true);
    };

    LanguageSelectModal.prototype.submit = function() {
      var language;
      language = $('input[name=language]:checked', this.el).val();
      this.callbackobject.change_language(language);
      return this;
    };

    return LanguageSelectModal;

  })(Backbone.Modal);
  return LanguageSelectModal;
});
