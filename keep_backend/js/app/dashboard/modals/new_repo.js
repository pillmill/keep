var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'backbone_modal', 'jqueryui', 'jquery_cookie'], function($, _, Backbone, Marionette) {
  var NewDiaryModal, _ref;
  NewDiaryModal = (function(_super) {
    __extends(NewDiaryModal, _super);

    function NewDiaryModal() {
      _ref = NewDiaryModal.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewDiaryModal.prototype.template = _.template($('#file-dropped-template').html());

    NewDiaryModal.prototype.submitEl = '.btn-primary';

    NewDiaryModal.prototype.cancelEl = '.btn-cancel';

    NewDiaryModal.prototype._detect_file_type = function() {
      if (this.file.type === 'text/csv') {
        this.file_type = 'CSV';
      } else if (this.file.type === 'text/xml') {
        this.file_type = 'XForm';
      } else if (this.file.type === 'application/vnd.ms-excel') {
        this.file_type = 'Excel';
      } else {
        this.file_type = 'unknown';
      }
      return this;
    };

    NewDiaryModal.prototype.initialize = function(options) {
      this.studies = options.studies;
      this.file = options.files[0];
      this._detect_file_type();
      this.success_callback = options.success != null ? options.success : null;
      this.error_callback = options.error != null ? options.error : null;
      return this;
    };

    NewDiaryModal.prototype.serializeData = function() {
      var data;
      data = {
        file: this.file,
        studies: this.studies.models,
        repo_name: this.file.name.slice(0, +(this.file.name.length - 5) + 1 || 9e9)
      };
      return data;
    };

    NewDiaryModal.prototype.submit = function() {
      var data;
      data = new FormData();
      data.append('repo_file', this.file);
      data.append('user', document.user);
      data.append('tracker', $('input[name="tracker"]', this.el).is(':checked'));
      if ($('select', this.el).val() != null) {
        data.append('study', $('select', this.el).val());
      }
      return $.ajax({
        url: '/api/v1/repos/',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        headers: {
          'X-CSRFToken': $.cookie('csrftoken')
        },
        type: 'POST',
        success: this.success_callback,
        error: this.error_callback
      });
    };

    return NewDiaryModal;

  })(Backbone.Modal);
  return NewDiaryModal;
});
