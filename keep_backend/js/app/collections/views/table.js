var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/collections/data', 'app/viz/modals/data_details'], function($, _, Backbone, Marionette, DataCollection, DataDetailsModal) {
  var DataTableView, EmptyTableView, TableRowView, _ref, _ref1, _ref2;
  EmptyTableView = (function(_super) {
    __extends(EmptyTableView, _super);

    function EmptyTableView() {
      _ref = EmptyTableView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    EmptyTableView.prototype.tagName = 'tr';

    EmptyTableView.prototype.template = _.template('<td>There is no data for this table!</td>');

    return EmptyTableView;

  })(Backbone.Marionette.ItemView);
  TableRowView = (function(_super) {
    __extends(TableRowView, _super);

    function TableRowView() {
      this.clicked = __bind(this.clicked, this);
      this.template = __bind(this.template, this);
      _ref1 = TableRowView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    TableRowView.prototype.tagName = 'tr';

    TableRowView.prototype.events = {
      'click': 'clicked'
    };

    TableRowView.prototype.data_templates = {
      'text': _.template('<td><%= data %></td>'),
      'geopoint': _.template('<td><%= data.coordinates[1] %>, <%= data.coordinates[0] %></td>'),
      'photo': _.template('<td><a href="<%= data %>" target="blank">Click to view photo</a></td>'),
      'forms': _.template($('#DT-linked-form-tpl').html())
    };

    TableRowView.prototype.initialize = function(options) {
      this.fields = options.fields;
      this.repo = options.repo;
      return this.linked = options.linked;
    };

    TableRowView.prototype.linked_form_css = function(status) {
      if (status === 'empty') {
        return 'linkedForm--empty';
      } else if (status === 'complete') {
        return 'linkedForm--complete';
      } else {
        return 'linkedForm--incomplete';
      }
    };

    TableRowView.prototype.serializeData = function() {
      var data,
        _this = this;
      data = this.model.attributes;
      data.form_css = function(form_status) {
        return _this.linked_form_css(form_status);
      };
      return data;
    };

    TableRowView.prototype.template = function(model) {
      var field, tdata, templ, _i, _len, _ref2, _ref3;
      templ = [];
      if (this.repo.attributes.is_tracker) {
        templ.push(this.data_templates['forms']({
          model: model
        }));
      }
      _ref2 = this.fields;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        field = _ref2[_i];
        tdata = {
          data: model.data[field.name]
        };
        if ((_ref3 = field.type) === 'geopoint' || _ref3 === 'photo') {
          if (tdata['data']) {
            templ.push(this.data_templates[field.type](tdata));
          } else {
            templ.push(this.data_templates['text'](tdata));
          }
        } else {
          templ.push(this.data_templates['text'](tdata));
        }
      }
      templ.push('<td>&nbsp;</td>');
      return templ.join('');
    };

    TableRowView.prototype.clicked = function(event) {
      var modalView, options;
      if (event.target === 'a') {
        event.stopPropagation();
      }
      options = {
        repo: this.repo,
        model: this.model,
        linked: this.linked,
        fields: this.fields
      };
      modalView = new DataDetailsModal(options);
      ($('.modal')).html(modalView.render().el);
      modalView.onAfterRender($('.modal'));
      return true;
    };

    return TableRowView;

  })(Backbone.Marionette.ItemView);
  DataTableView = (function(_super) {
    __extends(DataTableView, _super);

    function DataTableView() {
      this.onRender = __bind(this.onRender, this);
      _ref2 = DataTableView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    DataTableView.prototype.itemView = TableRowView;

    DataTableView.prototype.emptyView = EmptyTableView;

    DataTableView.prototype.template = '#DataTable-template';

    DataTableView.prototype.itemViewContainer = '.DataTable-table tbody';

    DataTableView.prototype.header_template = _.template('<tr>\n<% if(repo.attributes.is_tracker) { %>\n    <th>Linked Forms</th>\n<% }; %>\n<% _.each( fields, function( item ) { %>\n    <th class="js-sort" data-field=\'<%= item.name %>\'>\n        <%= item.name %><i class=\'fa fa-sort DataTable-sortIcon\'></i>\n    </th>\n<% }); %>\n    <th>&nbsp;</th>\n</tr>');

    DataTableView.prototype.events = {
      'click .js-sort': 'sort_table'
    };

    DataTableView.prototype.sort_table = function() {
      var column, field, parents, sort_icon, sort_order;
      if (this.$(event.target).is('i')) {
        column = this.$(event.target.parentElement);
      } else {
        column = this.$(event.target);
      }
      field = column.data('field');
      sort_order = column.data('order') || 'none';
      sort_icon = $('i', column);
      if (sort_order === 'none') {
        sort_order = 'desc';
        sort_icon.removeClass('fa fa-sort icon-sort-up').addClass('fa fa-sort-down');
      } else if (sort_order === 'desc') {
        sort_order = 'asc';
        sort_icon.removeClass('fa fa-sort-down').addClass('fa fa-sort-up');
      } else if (sort_order === 'asc') {
        sort_order = null;
        sort_icon.removeClass('fa fa-sort-up').addClass('fa fa-sort');
      }
      column.data('order', sort_order);
      parents = this.$(event.target).parents();
      if (_.contains(parents, this.$('.DataTable-table')[0])) {
        this.$('.DataTable-fixedHeader thead').empty().append(this.$('.DataTable-table thead').html());
      } else {
        this.$('.DataTable-table thead').empty().append(this.$('.DataTable-fixedHeader thead').html());
      }
      return this.collection.sort_fetch({
        field: field,
        order: sort_order
      });
    };

    DataTableView.prototype.onRender = function() {
      var _this = this;
      this.$('.DataTable-table thead').append(this.header_template({
        fields: this.fields,
        repo: this.repo
      }));
      this.$('.DataTable-fixedHeader thead').append(this.header_template({
        fields: this.fields,
        repo: this.repo
      }));
      this.$('.DataTable').scroll({
        view: this
      }, function(event) {
        return _this.detect_pagination(event);
      });
      return this.$('.DataTable').scroll({
        view: this
      }, function(event) {
        return _this.detect_scroll(event);
      });
    };

    DataTableView.prototype.show_loading = function() {
      return this.$el.addClass('u-fade50');
    };

    DataTableView.prototype.hide_loading = function() {
      return this.$el.removeClass('u-fade50');
    };

    DataTableView.prototype.initialize = function(options) {
      this.fields = options.fields;
      this.repo = options.repo;
      this.linked = options.linked;
      this.collection = new DataCollection(options);
      this.listenTo(this.collection, 'request', this.show_loading);
      this.listenTo(this.collection, 'sync', this.hide_loading);
      return this;
    };

    DataTableView.prototype.detect_scroll = function(event) {
      var fixed_header, header_row, scrollLeft, scrollTop;
      header_row = this.$('.DataTable-table thead');
      fixed_header = this.$('.DataTable-fixedHeader');
      this.$('.DataTable-fixedHead thead').empty().append(header_row.html());
      scrollTop = this.$('.DataTable').scrollTop();
      if (scrollTop > 0) {
        fixed_header.css('position', 'fixed').css('top', this._calculate_dist_from_top('.DataTable'));
        scrollLeft = this.$('.DataTable').scrollLeft();
        fixed_header.css('left', "-" + scrollLeft + "px");
        fixed_header.show();
      } else {
        fixed_header.hide();
      }
      return this;
    };

    DataTableView.prototype._calculate_dist_from_top = function(elem) {
      var elementOffset, scrollTop;
      scrollTop = $(window).scrollTop();
      elementOffset = this.$(elem).offset().top;
      return elementOffset - scrollTop;
    };

    DataTableView.prototype.detect_pagination = function(event) {
      var scroll_distance, scroll_height, table_height, view_height,
        _this = this;
      if (this.page_loading) {
        return;
      }
      if (this.$el.is(':hidden')) {
        return;
      }
      view_height = this.$('.DataTable').height();
      table_height = this.$('.DataTable-table').height();
      scroll_height = this.$(event.currentTarget).scrollTop();
      scroll_distance = scroll_height + view_height;
      if (scroll_distance >= table_height) {
        this.page_loading = true;
        this.collection.next({
          success: function() {
            return _this.page_loading = false;
          }
        });
      }
      return this;
    };

    DataTableView.prototype.buildItemView = function(item, ItemViewType, itemViewOptions) {
      var options;
      options = _.extend({
        model: item,
        fields: this.fields,
        repo: this.repo,
        linked: this.linked
      }, itemViewOptions);
      return new ItemViewType(options);
    };

    return DataTableView;

  })(Backbone.Marionette.CompositeView);
  return DataTableView;
});
