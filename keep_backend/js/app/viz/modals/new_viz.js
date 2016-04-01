var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/models/viz', 'backbone_modal', 'jqueryui', 'jquery_cookie'], function($, _, Backbone, Marionette, VizModel) {
  var NewVizModal, _ref;
  NewVizModal = (function(_super) {
    __extends(NewVizModal, _super);

    function NewVizModal() {
      _ref = NewVizModal.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewVizModal.prototype.template = _.template($('#new-viz-template').html());

    NewVizModal.prototype.submitEl = '.btn-primary';

    NewVizModal.prototype.cancelEl = '.btn-cancel';

    NewVizModal.prototype.initialize = function(options) {
      this.fields = options.fields;
      this.repo = options.repo;
      this.success_callback = options.success != null ? options.success : null;
      return this.error_callback = options.error != null ? options.error : null;
    };

    NewVizModal.prototype.serializeData = function() {
      return {
        fields: this.fields
      };
    };

    NewVizModal.prototype.submit = function() {
      var data, name, new_viz, xaxis, yaxis;
      name = $('#viz-name', this.el).val();
      xaxis = $('#xaxis', this.el).val();
      yaxis = $('#yaxis', this.el).val();
      data = {
        name: name,
        repo: this.repo.id,
        x_axis: "data." + xaxis,
        y_axis: "data." + yaxis
      };
      new_viz = new VizModel();
      new_viz.save(data, {
        success: this.success_callback
      });
      return this;
    };

    return NewVizModal;

  })(Backbone.Modal);
  return NewVizModal;
});
