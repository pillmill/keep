var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/collections/study'], function($, _, Backbone, Marionette, StudyCollection) {
  var StudyCollectionView, StudyItemView, _ref, _ref1;
  StudyItemView = (function(_super) {
    __extends(StudyItemView, _super);

    function StudyItemView() {
      _ref = StudyItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    StudyItemView.prototype.tagName = 'li';

    StudyItemView.prototype.template = _.template('<div class=\'study-settings\'>\n    <a href=\'#\' data-name=\'<%= name %>\' data-study=\'<%= id %>\'><i class=\'fa fa-cog\'></i></a>\n</div>\n<a href=\'#\' data-study=\'<%= id %>\'><%= name %></a>');

    return StudyItemView;

  })(Backbone.Marionette.ItemView);
  StudyCollectionView = (function(_super) {
    __extends(StudyCollectionView, _super);

    function StudyCollectionView() {
      _ref1 = StudyCollectionView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    StudyCollectionView.prototype.el = '#study_list';

    StudyCollectionView.prototype.itemView = StudyItemView;

    StudyCollectionView.prototype.collection = new StudyCollection;

    StudyCollectionView.prototype.selected = function() {
      return $('li.selected > a', this.el).data('study');
    };

    return StudyCollectionView;

  })(Backbone.Marionette.CollectionView);
  return StudyCollectionView;
});
