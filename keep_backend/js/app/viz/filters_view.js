var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'app/collections/views/table'], function($, _, Backbone, Marionette, DataTableView) {
  var AppliedFilterView, AppliedFiltersView, DataFiltersView, EmptyAppliedFilters, EmptySavedFilters, Filter, FilterControls, FilterSet, FilterSets, FilteredDataView, Filters, SavedFilterView, SavedFiltersView, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
  DataFiltersView = (function(_super) {
    __extends(DataFiltersView, _super);

    function DataFiltersView() {
      _ref = DataFiltersView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DataFiltersView.prototype.el = '#filters-viz';

    DataFiltersView.prototype.template = '#filters-layout-tmpl';

    DataFiltersView.prototype.regions = {
      'filter_controls': '.Filters-filterControls',
      'applied_filters': '.Filters-appliedFilters',
      'saved_filters': '.Filters-savedFilters',
      'filtered_data': '.Filters-filteredData'
    };

    DataFiltersView.prototype.initialize = function(options) {
      var column_names, le_saved_filters;
      this.le_filtered_data = new FilteredDataView(options);
      le_saved_filters = document.saved_filters;
      this.saved_filtersets = new FilterSets(le_saved_filters, {
        parse: true
      });
      this.saved_filters_view = new SavedFiltersView({
        collection: this.saved_filtersets
      });
      this.current_filter_set = new FilterSet();
      this.current_filters_view = new AppliedFiltersView({
        collection: this.current_filter_set
      });
      column_names = _.map(options.fields, function(field) {
        return field.name;
      });
      return this.filter_input = new FilterControls({
        columns: column_names
      });
    };

    DataFiltersView.prototype.onShow = function() {
      this.applied_filters.show(this.current_filters_view);
      this.filtered_data.show(this.le_filtered_data);
      this.filter_controls.show(this.filter_input);
      return this.saved_filters.show(this.saved_filters_view);
    };

    DataFiltersView.prototype.onRender = function() {
      this.listenTo(this.current_filters_view, 'filters:refresh_data', this._refresh_data);
      this.listenTo(this.current_filters_view, 'filters:save', this._save_filterset);
      this.listenTo(this.filter_input, 'filters:create', this._add_filter);
      this.listenTo(this.filter_input, 'filters:reset', this._reset_filterset);
      this.listenTo(this.saved_filters_view, 'filters:apply', this._apply_filterset);
      return this._refresh_data('');
    };

    DataFiltersView.prototype._reset_filterset = function() {
      return this._apply_filterset(new FilterSet());
    };

    DataFiltersView.prototype._apply_filterset = function(filterset) {
      this.current_filter_set = filterset;
      this.stopListening(this.current_filters_view);
      this.current_filters_view = new AppliedFiltersView({
        collection: this.current_filter_set
      });
      this.listenTo(this.current_filters_view, 'filters:refresh_data', this._refresh_data);
      this.listenTo(this.current_filters_view, 'filters:save', this._save_filterset);
      this.applied_filters.show(this.current_filters_view);
      return this._refresh_data();
    };

    DataFiltersView.prototype._save_filterset = function(filterset) {
      var fs;
      if (filterset.isNew()) {
        this.saved_filtersets.add(filterset);
      } else {
        fs = this.saved_filtersets.get(filterset.get('id'));
        fs.set(filterset.attributes);
        this.saved_filters_view.render();
      }
      return filterset.save();
    };

    DataFiltersView.prototype._add_filter = function(new_filter) {
      this.current_filters_view.collection.add(new_filter);
      return this._refresh_data();
    };

    DataFiltersView.prototype._refresh_data = function(url) {
      url || (url = this.current_filters_view.collection.url_params());
      this.le_filtered_data.filter_data(url);
      return this.$('.js-download').attr('href', this.le_filtered_data.url + '&format=csv');
    };

    return DataFiltersView;

  })(Backbone.Marionette.Layout);
  FilterControls = (function(_super) {
    __extends(FilterControls, _super);

    function FilterControls() {
      _ref1 = FilterControls.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FilterControls.prototype.template = '#filter-controls-tmpl';

    FilterControls.prototype.events = {
      'click .js-add': 'create_filter',
      'click .js-reset': 'reset'
    };

    FilterControls.prototype.reset = function() {
      return this.trigger('filters:reset');
    };

    FilterControls.prototype.create_filter = function(event) {
      var new_filter, params;
      params = {
        column_name: ($('.columnName')).val(),
        filter_type: ($('.filterType')).val(),
        filter_value: ($('.filterValue')).val()
      };
      new_filter = new Filter(params);
      if (!new_filter.isValid()) {
        return this;
      }
      this.$('.filterValue').val('');
      return this.trigger('filters:create', new_filter);
    };

    FilterControls.prototype.set_columns = function(columns) {
      var les_options;
      les_options = _.map(columns, function(column_name) {
        return "<option value='" + column_name + "'>" + column_name + "</option>";
      });
      return this.$('.columnName').html(les_options.join(''));
    };

    FilterControls.prototype.onRender = function() {
      return this.set_columns(this.options.columns);
    };

    return FilterControls;

  })(Backbone.Marionette.ItemView);
  FilteredDataView = (function(_super) {
    __extends(FilteredDataView, _super);

    function FilteredDataView() {
      _ref2 = FilteredDataView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    FilteredDataView.prototype.initialize = function(options) {
      FilteredDataView.__super__.initialize.call(this, options);
      this.base_url = this.collection.url;
      return this.on('filters:refresh_data', this.filter_data, this);
    };

    FilteredDataView.prototype.url = function() {
      return this.collection.url;
    };

    FilteredDataView.prototype.filter_data = function(url_params) {
      this.collection.url = this.base_url + url_params;
      return this.collection.fetch({
        reset: true
      });
    };

    return FilteredDataView;

  })(DataTableView);
  Filter = (function(_super) {
    __extends(Filter, _super);

    function Filter() {
      _ref3 = Filter.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Filter.prototype.defaults = {
      column_name: '',
      filter_type: '',
      filter_value: ''
    };

    Filter.prototype.parse = function(response) {
      var c_name, f_type, f_value, filter_type, str, value_regex, __, _ref4;
      filter_type = /data__([\d|\w]+)__(gt|gte|lt|lte)/;
      value_regex = /\=([\d|\w]*)/;
      str = response;
      if (!_.isEmpty(str.match(filter_type))) {
        _ref4 = str.match(filter_type)[0].split('__'), __ = _ref4[0], c_name = _ref4[1], f_type = _ref4[2];
      } else {
        f_type = 'eq';
        c_name = str.match(/data__([\d|\w]*)/)[0].split('__')[1];
      }
      f_value = str.match(value_regex)[0].slice(1);
      return {
        column_name: c_name,
        filter_type: f_type,
        filter_value: f_value
      };
    };

    Filter.prototype.validate = function(attrs) {
      var error, errors, _i, _len;
      errors = [];
      if (attrs['filter_value'] === '') {
        errors.push("Error: Filter value cannot be blank!");
      }
      if (!_.isEmpty(errors)) {
        for (_i = 0, _len = errors.length; _i < _len; _i++) {
          error = errors[_i];
          console.log(error);
        }
        return errors;
      }
    };

    return Filter;

  })(Backbone.Model);
  Filters = (function(_super) {
    __extends(Filters, _super);

    function Filters() {
      _ref4 = Filters.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    Filters.prototype.model = Filter;

    Filters.prototype.url = function() {
      return "/api/v1/filters/?repo=" + this.options.repo_id;
    };

    Filters.prototype.url_params = function() {
      var f, query_string, _i, _len, _ref5;
      query_string = "?";
      _ref5 = this.models;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        f = _ref5[_i];
        query_string += "&data__" + (f.get('column_name'));
        if (f.get('filter_type') === 'eq') {
          query_string += "=";
        }
        if (f.get('filter_type') !== 'eq') {
          query_string += "__" + (f.get('filter_type')) + "=";
        }
        query_string += "" + (f.get('filter_value'));
      }
      return query_string;
    };

    return Filters;

  })(Backbone.Collection);
  FilterSet = (function(_super) {
    __extends(FilterSet, _super);

    function FilterSet() {
      _ref5 = FilterSet.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    FilterSet.prototype.defaults = {
      user: '',
      repo: '',
      name: '',
      querystring: ''
    };

    FilterSet.prototype.urlRoot = '/api/v1/filters/';

    FilterSet.prototype.toJSON = function() {
      var results;
      results = {
        user: "" + this.get('user'),
        repo: "" + this.get('repo'),
        name: "" + this.get('name'),
        querystring: "" + this.get('filters').url_params()
      };
      if (this.get('id')) {
        results.id = "" + this.get('id');
      }
      return results;
    };

    FilterSet.prototype.parse = function(response) {
      var filter_regex, matches;
      filter_regex = /data__([\d|\w]*)=([\d|\w]*)/g;
      matches = response.querystring.match(filter_regex);
      if (!_.isEmpty(matches)) {
        response['filters'] = new Filters(matches, {
          parse: true
        });
      }
      return response;
    };

    FilterSet.prototype.initialize = function() {
      this.set('user', "" + document.resource_ids.user_id);
      this.set('repo', "" + document.resource_ids.repo_id);
      if (!this.get('filters')) {
        return this.set('filters', new Filters([]));
      }
    };

    return FilterSet;

  })(Backbone.Model);
  FilterSets = (function(_super) {
    __extends(FilterSets, _super);

    function FilterSets() {
      _ref6 = FilterSets.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    FilterSets.prototype.model = FilterSet;

    return FilterSets;

  })(Backbone.Collection);
  AppliedFilterView = (function(_super) {
    __extends(AppliedFilterView, _super);

    function AppliedFilterView() {
      _ref7 = AppliedFilterView.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    AppliedFilterView.prototype.template = '#filter-template';

    AppliedFilterView.prototype.remove_filter = function() {
      return this.trigger('filters:remove', this.model);
    };

    AppliedFilterView.prototype.events = {
      'click .js-remove': 'remove_filter'
    };

    AppliedFilterView.prototype.initialize = function() {
      return this.listenTo(this.model, 'destroy', this.remove_filter);
    };

    return AppliedFilterView;

  })(Backbone.Marionette.ItemView);
  EmptyAppliedFilters = (function(_super) {
    __extends(EmptyAppliedFilters, _super);

    function EmptyAppliedFilters() {
      _ref8 = EmptyAppliedFilters.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    EmptyAppliedFilters.prototype.template = '#empty-filterset-tmpl';

    return EmptyAppliedFilters;

  })(Backbone.Marionette.ItemView);
  AppliedFiltersView = (function(_super) {
    __extends(AppliedFiltersView, _super);

    function AppliedFiltersView() {
      _ref9 = AppliedFiltersView.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    AppliedFiltersView.prototype.template = '#filter-set-tmpl';

    AppliedFiltersView.prototype.emptyView = EmptyAppliedFilters;

    AppliedFiltersView.prototype.itemView = AppliedFilterView;

    AppliedFiltersView.prototype.itemViewContainer = '.activeFilters';

    AppliedFiltersView.prototype.events = {
      'click .js-save': 'save_filterset'
    };

    AppliedFiltersView.prototype.itemEvents = {
      'filters:remove': 'remove_filter'
    };

    AppliedFiltersView.prototype.initialize = function() {
      this.filter_set = arguments[0].collection;
      return this.collection = this.filter_set.get('filters').clone();
    };

    AppliedFiltersView.prototype.remove_filter = function(__, ___, filter_model) {
      this.collection.remove(filter_model);
      return this.trigger('filters:refresh_data', this.collection.url_params());
    };

    AppliedFiltersView.prototype.onRender = function() {
      return this.$('.Filters-fsNameField').val(this.filter_set.get('name'));
    };

    AppliedFiltersView.prototype.save_filterset = function() {
      this.filter_set.set('name', this.$('.Filters-fsNameField').val());
      this.filter_set.set('filters', this.collection);
      return this.trigger('filters:save', this.filter_set);
    };

    AppliedFiltersView.prototype.serializeData = function() {
      return {
        filterset_id: this.filter_set.get('id')
      };
    };

    AppliedFiltersView.prototype.templateHelpers = {
      persist_label: function() {
        if (this.filterset_id) {
          return "Update";
        }
        return "Save";
      }
    };

    return AppliedFiltersView;

  })(Backbone.Marionette.CompositeView);
  SavedFilterView = (function(_super) {
    __extends(SavedFilterView, _super);

    function SavedFilterView() {
      _ref10 = SavedFilterView.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    SavedFilterView.prototype.template = '#saved-filter-tmpl';

    SavedFilterView.prototype.events = {
      'click .js-apply': '_apply_filter',
      'click .js-delete': '_delete_filter'
    };

    SavedFilterView.prototype._apply_filter = function(event) {
      return this.trigger('filters:apply', this.model);
    };

    SavedFilterView.prototype._delete_filter = function() {
      return this.trigger('filters:delete', this.model);
    };

    return SavedFilterView;

  })(Backbone.Marionette.ItemView);
  EmptySavedFilters = (function(_super) {
    __extends(EmptySavedFilters, _super);

    function EmptySavedFilters() {
      _ref11 = EmptySavedFilters.__super__.constructor.apply(this, arguments);
      return _ref11;
    }

    EmptySavedFilters.prototype.template = '#empty-saved-filters-tmpl';

    return EmptySavedFilters;

  })(Backbone.Marionette.ItemView);
  SavedFiltersView = (function(_super) {
    __extends(SavedFiltersView, _super);

    function SavedFiltersView() {
      _ref12 = SavedFiltersView.__super__.constructor.apply(this, arguments);
      return _ref12;
    }

    SavedFiltersView.prototype.template = '#saved-filters-tmpl';

    SavedFiltersView.prototype.emptyView = EmptySavedFilters;

    SavedFiltersView.prototype.itemView = SavedFilterView;

    SavedFiltersView.prototype.itemViewContainer = '.Filters-savedFilters';

    SavedFiltersView.prototype.itemEvents = {
      'filters:apply': '_apply_filter',
      'filters:delete': '_delete_filter'
    };

    SavedFiltersView.prototype._apply_filter = function(__, ___, filter_set) {
      return this.trigger('filters:apply', filter_set);
    };

    SavedFiltersView.prototype._delete_filter = function(__, ___, filter_set) {
      this.collection.remove(filter_set);
      return filter_set.destroy();
    };

    return SavedFiltersView;

  })(Backbone.Marionette.CompositeView);
  return DataFiltersView;
});
