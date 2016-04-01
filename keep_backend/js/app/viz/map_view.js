var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'marionette', 'leaflet', 'app/collections/data', 'leaflet_cluster', 'leaflet_heatmap'], function($, _, Backbone, Marionette, L, DataCollection) {
  var DataMapView, MarkerItemView, mapIcon, _ref, _ref1;
  mapIcon = L.icon({
    iconUrl: '//keep-static.s3.amazonaws.com/img/leaflet/marker-icon.png',
    iconRetinaUrl: '//keep-static.s3.amazonaws.com/img/leaflet/marker-icon@2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '//keep-static.s3.amazonaws.com/img/leaflet/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [15, 41]
  });
  MarkerItemView = (function(_super) {
    __extends(MarkerItemView, _super);

    function MarkerItemView() {
      this.template = __bind(this.template, this);
      _ref = MarkerItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MarkerItemView.prototype.initialize = function(options) {
      return this.fields = options.fields;
    };

    MarkerItemView.prototype.template = function(model) {
      var data, templ;
      data = {
        fields: this.fields,
        model: model
      };
      templ = _.template('<% _.each( fields, function( field ) { if( field.type != \'geopoint\' ) { %>\n    <div><%= field.name %>: <%= model.data[ field.name ] %></div>\n<% }}); %><td>&nbsp;</td>');
      return templ(data);
    };

    return MarkerItemView;

  })(Backbone.Marionette.ItemView);
  DataMapView = (function(_super) {
    __extends(DataMapView, _super);

    function DataMapView() {
      this.refresh_viewport = __bind(this.refresh_viewport, this);
      this.onShow = __bind(this.onShow, this);
      this._resize_map = __bind(this._resize_map, this);
      _ref1 = DataMapView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    DataMapView.prototype.el = '#map-viz';

    DataMapView.prototype.itemView = MarkerItemView;

    DataMapView.prototype._detect_headers = function(fields) {
      var field, _i, _len, _results;
      this.map_headers = [];
      this.selected_header = null;
      _results = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        if (field.type === 'geopoint') {
          _results.push(this.selected_header || (this.selected_header = field));
        }
      }
      return _results;
    };

    DataMapView.prototype._add_to_layers = function(datum, geopoint) {
      var fields, key, marker, value;
      fields = (function() {
        var _ref2, _results;
        _ref2 = datum.get('data');
        _results = [];
        for (key in _ref2) {
          value = _ref2[key];
          _results.push("<div><strong>" + key + ":</strong> " + value + "</div>");
        }
        return _results;
      })();
      marker = L.marker([geopoint.lat, geopoint.lng], {
        icon: mapIcon
      });
      marker.bindPopup(fields.join(''));
      this.markers.addLayer(marker);
      this.clusters.addLayer(marker);
      return this.heatmap.addDataPoint({
        'lon': geopoint.lng,
        'lat': geopoint.lat,
        'value': 1
      });
    };

    DataMapView.prototype._geopoint = function(datum) {
      var geopoint, lat, lng, _ref2, _ref3;
      if (((_ref2 = this.selected_header) != null ? _ref2.name : void 0) == null) {
        return null;
      }
      geopoint = datum.get('data')[this.selected_header.name];
      if (geopoint == null) {
        return null;
      }
      _ref3 = [geopoint.coordinates[1], geopoint.coordinates[0]], lat = _ref3[0], lng = _ref3[1];
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      if (isNaN(lat) || isNaN(lng)) {
        return null;
      }
      while (lat > 90) {
        lat = lat - 180;
      }
      while (lat < -90) {
        lat = lat + 180;
      }
      while (lng > 180) {
        lng = lng - 360;
      }
      while (lng < -180) {
        lng = lng + 360;
      }
      return {
        lat: lat,
        lng: lng
      };
    };

    DataMapView.prototype.render = function() {
      var datum, geopoint, _i, _len, _ref2, _results;
      _ref2 = this.collection.models;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        datum = _ref2[_i];
        geopoint = this._geopoint(datum);
        if (geopoint == null) {
          continue;
        }
        _results.push(this._add_to_layers(datum, geopoint));
      }
      return _results;
    };

    DataMapView.prototype._resize_map = function() {
      $('#map').css({
        'height': (this.$el.parent().height() - 20) + 'px'
      });
      if (this.map != null) {
        return this.map.invalidateSize(false);
      }
    };

    DataMapView.prototype.initialize = function(options) {
      var layers,
        _this = this;
      this._resize_map();
      $(window).resize(this._resize_map);
      this.fields = options.fields;
      this.collection = new DataCollection(options);
      this._detect_headers(this.fields);
      this.map = L.map('map').setView([0, 0], 5);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.map);
      this.heatmap = L.TileLayer.heatMap({
        radius: 24,
        opacity: 0.8
      });
      this.markers = new L.layerGroup();
      this.clusters = new L.MarkerClusterGroup();
      this.connections = new L.layerGroup();
      layers = {
        'Clusters': this.clusters,
        'Connections': this.connections,
        'Heatmap': this.heatmap,
        'Markers': this.markers
      };
      this.map.addLayer(this.markers);
      this.controls = L.control.layers(null, layers, {
        collapsed: false
      });
      this.controls.addTo(this.map);
      this.data_offset = 0;
      this.map.on('moveend', this.refresh_viewport);
      this.collection.on('reset', function() {
        _this.markers.clearLayers();
        return _this.clusters.clearLayers();
      });
      return this;
    };

    DataMapView.prototype.appendHtml = function(collectionView, itemView, index) {
      var point;
      if (collectionView.selected_header == null) {
        return;
      }
      point = this._geopoint(itemView.model);
      if (point == null) {
        return;
      }
      return this._add_to_layers(itemView.model, point);
    };

    DataMapView.prototype.buildItemView = function(item, ItemViewType, itemViewOptions) {
      var options;
      options = _.extend({
        model: item,
        fields: this.fields
      }, itemViewOptions);
      return new ItemViewType(options);
    };

    DataMapView.prototype.onShow = function() {
      return this.map._onResize();
    };

    DataMapView.prototype.get_next_page = function() {
      var _this = this;
      this.data_offset = this.data_offset + 1;
      return this.collection.fetch({
        reset: false,
        data: {
          geofield: this.selected_header.name,
          bbox: this.bounds.toBBoxString(),
          offset: this.data_offset
        },
        success: function(collection, response, options) {
          if (response.meta.pages > _this.data_offset) {
            return _this.get_next_page();
          }
        }
      });
    };

    DataMapView.prototype.refresh_viewport = function(event) {
      var _this = this;
      if (this.selected_header == null) {
        return;
      }
      this.data_offset = 0;
      this.bounds = event.target.getBounds();
      return this.collection.fetch({
        reset: true,
        data: {
          geofield: this.selected_header.name,
          bbox: this.bounds.toBBoxString()
        },
        success: function(collection, response, options) {
          if (response.meta.pages > 0) {
            return _this.get_next_page();
          }
        }
      });
    };

    return DataMapView;

  })(Backbone.Marionette.CollectionView);
  return DataMapView;
});
