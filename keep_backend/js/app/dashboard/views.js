var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/collections/views/repo', 'app/collections/views/study', 'app/models/repo', 'app/dashboard/modals/new_repo', 'app/dashboard/modals/new_study', 'app/dashboard/modals/study_settings', 'backbone_modal', 'jqueryui', 'jquery_cookie'], function($, _, Backbone, Marionette, RepoCollectionView, StudyCollectionView, RepoModel, NewRepoModal, NewStudyModal, StudySettingsModal) {
  var DashboardView, _ref;
  DashboardView = (function(_super) {
    __extends(DashboardView, _super);

    function DashboardView() {
      this.refresh_repos_event = __bind(this.refresh_repos_event, this);
      this.file_drop = __bind(this.file_drop, this);
      this._drop_on_study = __bind(this._drop_on_study, this);
      this._apply_draggable = __bind(this._apply_draggable, this);
      _ref = DashboardView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DashboardView.prototype.el = $('#dashboard');

    DashboardView.prototype.filter = 'all';

    DashboardView.prototype.repo_list = $('#repo_list > tbody');

    DashboardView.prototype.study_list = $('#study_list');

    DashboardView.prototype.events = {
      "click #studies .create-new a": "new_study_event",
      "click .study-settings a": "study_settings_event",
      "click #filters li a": "filter_repos_event",
      "click #studies ul li a": "refresh_repos_event",
      "click #repos #refresh-repos": "refresh_repos_event"
    };

    DashboardView.prototype._apply_draggable = function() {
      $('li', '#study_list').droppable({
        hoverClass: 'drop-hover',
        drop: this._drop_on_study
      });
      return this;
    };

    DashboardView.prototype._drop_on_study = function(event, ui) {
      var repo, repo_id, study_id,
        _this = this;
      study_id = $('a', event.target).data('study');
      if (study_id == null) {
        study_id = null;
      }
      repo = new RepoModel();
      repo_id = $(ui.draggable).data('repo');
      repo.save({
        id: repo_id,
        study: study_id
      }, {
        patch: true,
        success: function(response, textStatus, jqXhr) {
          if ((_this.study_view.selected() != null) && _this.study_view.selected() !== study_id) {
            return _this.repo_view.collection.remove({
              id: repo_id
            });
          }
        }
      });
      return this;
    };

    DashboardView.prototype.file_dragleave = function(event) {
      this.drag_overlay_timer = setTimeout(function() {
        event.stopPropagation();
        return $('#file-drop-overlay').hide();
      }, 300);
      return this;
    };

    DashboardView.prototype.file_dragover = function(event) {
      clearTimeout(this.drag_overlay_timer);
      event.stopPropagation();
      event.preventDefault();
      $('#file-drop-overlay').show();
      return this;
    };

    DashboardView.prototype.file_drop = function(event) {
      var options;
      if (event.originalEvent.dataTransfer == null) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      options = {
        files: event.originalEvent.dataTransfer.files,
        studies: this.study_view.collection,
        success: function(data) {
          if (data.success) {
            return $('#refresh-repos').trigger('click');
          } else {
            return console.log(data);
          }
        },
        error: function(data) {
          return console.log(data);
        }
      };
      this.modalView = new NewRepoModal(options);
      $('.modal').html(this.modalView.render().el);
      $('#file-drop-overlay').hide();
      return this;
    };

    DashboardView.prototype.filter_repos_event = function(event) {
      $('.selected', '#filters').removeClass('selected');
      $(event.currentTarget).parent().addClass('selected');
      return this.repo_view.filter($(event.currentTarget).data('filter'));
    };

    DashboardView.prototype.new_study_event = function(event) {
      this.modalView = new NewStudyModal({
        collection: this.study_view.collection
      });
      $('.modal').html(this.modalView.render().el);
      return $('#study-name').focus();
    };

    DashboardView.prototype.study_settings_event = function(event) {
      var options, study;
      event.stopImmediatePropagation();
      study = this.study_view.collection.findWhere({
        id: $(event.currentTarget).data('study')
      });
      options = {
        study: study,
        collection: this.study_view.collection,
        tracker: this.repo_view.collection.where({
          study: study.get('name')
        })
      };
      this.modalView = new StudySettingsModal(options);
      return $('.modal').html(this.modalView.render().el);
    };

    DashboardView.prototype.initialize = function() {
      this.repo_view = new RepoCollectionView;
      this.repo_view.collection.reset(document.repo_list);
      this.study_view = new StudyCollectionView;
      this.study_view.on('render', this._apply_draggable);
      this.study_view.collection.reset(document.study_list);
      this.study_view.on('after:item:added', this.refresh_repos_event);
      this.study_view.on('item:removed', this.refresh_repos_event);
      $(window).bind('dragover', this.file_dragover);
      $(window).bind('drop', this.file_drop);
      $('#file-drop-overlay').bind('dragleave', this.file_dragleave);
      $('li', '#studies').droppable({
        hoverClass: 'drop-hover',
        drop: this._drop_on_study
      });
      return this;
    };

    DashboardView.prototype.refresh_repos_event = function(event) {
      var study_el, study_id, study_name;
      if ((event.currentTarget != null) && $(event.currentTarget).attr('id') === 'refresh-repos') {
        study_el = $('#studies .selected > a');
        study_id = $(study_el).data('study');
        study_name = $(study_el).html();
      } else if (event.currentTarget != null) {
        study_el = event.currentTarget;
        study_id = $(study_el).data('study');
        study_name = $(study_el).html();
      } else {
        study_el = event.el;
        study_id = event.model.id;
        study_name = event.model.get('name');
        if (event.isClosed) {
          study_id = null;
          study_name = 'All Diaries';
        }
      }
      $('#study_name').html(study_name);
      $('#studies .selected').removeClass('selected');
      $(study_el).parent().addClass('selected');
      this.repo_view.refresh(study_id);
      return this;
    };

    return DashboardView;

  })(Backbone.View);
  return DashboardView;
});
