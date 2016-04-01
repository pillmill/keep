var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'backbone_modal', 'jqueryui'], function($, _, Backbone, Marionette) {
  var ShareSettingsModal, _ref;
  ShareSettingsModal = (function(_super) {
    __extends(ShareSettingsModal, _super);

    function ShareSettingsModal() {
      this.toggle_form_public = __bind(this.toggle_form_public, this);
      this.toggle_public = __bind(this.toggle_public, this);
      this.remove_share = __bind(this.remove_share, this);
      this.add_share = __bind(this.add_share, this);
      _ref = ShareSettingsModal.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ShareSettingsModal.prototype.template = _.template($('#sharing-settings').html());

    ShareSettingsModal.prototype.cancelEl = '.btn-primary';

    ShareSettingsModal.prototype.shared_user = _.template('<tr data-user=\'<%= user %>\'>\n    <td><%= user %></td>\n    <td><%= perm %></td>\n    <td style=\'text-align:center\'>\n        <a href=\'#\' class=\'btn-delete\'>\n            <i class=\'fa fa-trash\'></i>\n        </a>\n    </td>\n</tr>');

    ShareSettingsModal.prototype.initialize = function(options) {
      return this.repo = options.repo;
    };

    ShareSettingsModal.prototype.beforeSubmit = function() {
      return false;
    };

    ShareSettingsModal.prototype.onAfterRender = function(modal) {
      $('#add-share', modal).click(this.add_share);
      $('#sharing-user').autocomplete({
        appendTo: '#sharing_user_list',
        minLength: 2,
        source: this.autocomplete_source,
        autoFocus: true,
        focus: function(event, ui) {
          var li;
          $('.ui-state-selected').removeClass('ui-state-selected');
          li = $('.ui-state-focus', event.currentTarget).parent();
          return li.addClass('ui-state-selected');
        }
      });
      $('.btn-delete', modal).click(this.remove_share);
      $('#sharing_toggle').change(this.toggle_public);
      $('#form_access_toggle').change(this.toggle_form_public);
      return this;
    };

    ShareSettingsModal.prototype.add_share = function(event) {
      var perms, user,
        _this = this;
      user = $('#sharing-user').val();
      perms = $('#sharing-perms').val();
      this.repo.share({
        data: {
          user: user,
          perms: perms
        },
        success: function(response) {
          $('#shared-users-list').append(_this.shared_user({
            user: user,
            perm: perms
          }));
          return $('.btn-delete').click(_this.remove_share);
        }
      });
      return this;
    };

    ShareSettingsModal.prototype.autocomplete_source = function(request, response) {
      $.ajax({
        url: "/api/autocomplete/accounts",
        data: {
          q: request.term
        },
        success: function(matches) {
          var name, results;
          matches = JSON.parse(matches);
          results = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = matches.length; _i < _len; _i++) {
              name = matches[_i];
              _results.push({
                label: name,
                value: name
              });
            }
            return _results;
          })();
          return response(results);
        }
      });
      return this;
    };

    ShareSettingsModal.prototype.remove_share = function(event) {
      var user, user_row;
      user_row = $(event.currentTarget).parent().parent();
      user = user_row.data('user');
      $.ajax({
        type: "DELETE",
        url: "/repo/user_share/" + this.repo.id + "/?username=" + user,
        data: "username=" + user,
        success: function() {
          return user_row.remove();
        }
      });
      return this;
    };

    ShareSettingsModal.prototype.toggle_public = function(event) {
      var _this = this;
      $.post("/repo/share/" + this.repo.id + "/", {}, function(response) {
        if (response.success) {
          $(event.currentTarget).attr('checked', response["public"]);
          if (response["public"]) {
            return $('#privacy > div').html('<i class=\'fa fa-unlock\'></i>');
          } else {
            return $('#privacy > div').html('<i class=\'fa fa-lock\'></i>');
          }
        }
      });
      return this;
    };

    ShareSettingsModal.prototype.toggle_form_public = function(event) {
      var _this = this;
      $.post("/repo/form_share/" + this.repo.id + "/", {}, function(response) {
        if (response.success) {
          return $(event.currentTarget).attr('checked', response["public"]);
        }
      });
      return this;
    };

    return ShareSettingsModal;

  })(Backbone.Modal);
  return ShareSettingsModal;
});
