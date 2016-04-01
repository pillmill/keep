var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'backbone_modal', 'jqueryui'], function($, _, Backbone, Marionette) {
  var DataDetailsModal, _ref;
  DataDetailsModal = (function(_super) {
    __extends(DataDetailsModal, _super);

    function DataDetailsModal() {
      _ref = DataDetailsModal.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DataDetailsModal.prototype.template = _.template($('#data-detail-template').html());

    DataDetailsModal.prototype.cancelEl = '.btn-primary';

    DataDetailsModal.prototype.data_templates = {
      'text': _.template('<%= data %>'),
      'geopoint': _.template('<img src="http://maps.googleapis.com/maps/api/staticmap?\
                                        center=<%= data.coordinates[1] %>,<%= data.coordinates[0] %>\
                                        &zoom=13\
                                        &size=300x100\
                                        &maptype=roadmap\
                                        &markers=color:red%7C<%= data.coordinates[1] %>,<%= data.coordinates[0] %>\
                                        &sensor=false">'),
      'photo': _.template('<img style="max-width:300px;" src="<%= data %>" >')
    };

    DataDetailsModal.prototype.initialize = function(options) {
      this.model = options.model;
      this.fields = options.fields;
      this.repo = options.repo;
      return this.linked = options.linked;
    };

    DataDetailsModal.prototype.onAfterRender = function(modal) {
      document.data_id = this.model.attributes.id;
      document.data_detail = this.model.attributes.data;
      $('#edit_data_btn', modal).click(this.editData);
      $('#delete_data_btn', modal).click(this.deleteData);
      return this;
    };

    DataDetailsModal.prototype.editData = function(event) {
      var key, new_location, _i, _len, _ref1;
      new_location = '/' + document.repo_owner + '/' + document.repo.name + '/webform/?data_id=' + document.data_id;
      _ref1 = _.keys(document.data_detail);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        new_location += '&' + key + '=';
        new_location += document.data_detail[key];
      }
      window.location = new_location;
      return this;
    };

    DataDetailsModal.prototype.deleteData = function(event) {
      var the_url;
      the_url = '/api/v1/data/' + document.repo.id + '/?data_id=' + document.data_id;
      $.ajax({
        url: the_url,
        type: 'DELETE',
        headers: {
          'X-CSRFToken': $.cookie('csrftoken')
        }
      }).done(function() {
        return location.reload();
      });
      return this;
    };

    DataDetailsModal.prototype.serializeData = function() {
      var attributes, data, field, filter, tdata, _i, _len, _ref1, _ref2;
      attributes = {};
      filter = null;
      _ref1 = this.fields;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        field = _ref1[_i];
        tdata = {
          data: this.model.attributes.data[field.name]
        };
        if ((_ref2 = field.type) === 'geopoint' || _ref2 === 'photo') {
          if (tdata['data']) {
            attributes[field.name] = this.data_templates[field.type](tdata);
          } else {
            attributes[field.name] = this.data_templates['text'](tdata);
          }
        } else {
          attributes[field.name] = this.data_templates['text'](tdata);
        }
        if (field.name === 'id') {
          filter = attributes[field.name];
        }
      }
      data = {
        attributes: attributes,
        is_tracker: this.repo.get('is_tracker'),
        linked: this.linked.models,
        filter: filter
      };
      return data;
    };

    return DataDetailsModal;

  })(Backbone.Modal);
  return DataDetailsModal;
});
