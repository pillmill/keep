var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/collections/repo'], function($, _, Backbone, Marionette, RepoCollection) {
  var RepoCollectionView, RepoItemView, _ref, _ref1;
  RepoItemView = (function(_super) {
    __extends(RepoItemView, _super);

    function RepoItemView() {
      _ref = RepoItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RepoItemView.prototype.tagName = 'tr';

    RepoItemView.prototype.template = _.template('<td class=\'privacy\'>\n    <i class="<%= privacy_icon %>"></i>\n</td>\n<td class=\'add-data\'>\n    <a href=\'<%= webform_uri %>\' class=\'btn btn-small\'>\n        <i class=\'fa fa-pencil\'></i> Add Data\n    </a>\n</td>\n<td>\n    <a href=\'<%= uri %>\'>\n        <%= name %>\n        <div class=\'meta-data\'>\n            <% if( study ){ %>\n                <div class=\'study\'><i class=\'fa fa-briefcase\'></i>&nbsp;<%= study %></div>\n            <% } %>\n            <% if( description.length > 0 ) { %>\n                <div class=\'help-block\'><%= description %></div>\n            <% } %>\n        </div>\n    </a>\n</td>\n<td class=\'submission-count\'>\n    <%= submissions %>&nbsp;<i class=\'fa fa-file-alt\'></i>\n</td>');

    RepoItemView.prototype.onRender = function() {
      $(this.el).draggable({
        helper: 'clone',
        opacity: 0.7
      });
      $(this.el).data('repo', this.model.id);
      if (this.model.get('is_public')) {
        $(this.el).addClass('public');
      } else {
        $(this.el).addClass('private');
      }
      if ((this.model.get('org') != null) || this.model.get('user') !== parseInt(document.user_id)) {
        $(this.el).addClass('shared');
      }
      return this;
    };

    return RepoItemView;

  })(Backbone.Marionette.ItemView);
  RepoCollectionView = (function(_super) {
    __extends(RepoCollectionView, _super);

    function RepoCollectionView() {
      _ref1 = RepoCollectionView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    RepoCollectionView.prototype.el = $('#repo_list > tbody');

    RepoCollectionView.prototype.itemView = RepoItemView;

    RepoCollectionView.prototype.collection = new RepoCollection;

    RepoCollectionView.prototype.filter = function(filter) {
      if (filter === 'all') {
        $('tr', this.el).fadeIn('fast');
      } else {
        $('tr', this.el).each(function() {
          if ($(this).hasClass(filter)) {
            return $(this).fadeIn('fast');
          } else {
            return $(this).fadeOut('fast');
          }
        });
      }
      this.current_filter = filter;
      return this;
    };

    RepoCollectionView.prototype.refresh = function(study) {
      var fetch_options;
      fetch_options = {
        success: this.render,
        reset: true
      };
      if (study != null) {
        fetch_options['data'] = {
          study: study
        };
      }
      this.collection.fetch(fetch_options);
      return this;
    };

    return RepoCollectionView;

  })(Backbone.Marionette.CollectionView);
  return RepoCollectionView;
});
