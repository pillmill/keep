// Generated by CoffeeScript 1.6.2
var DataCollection, DataModel, DataView, FormModel, _ref, _ref1, _ref2, _ref3,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

DataModel = (function(_super) {
  __extends(DataModel, _super);

  function DataModel() {
    _ref = DataModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DataModel.prototype.defaults = {
    data: []
  };

  return DataModel;

})(Backbone.Model);

FormModel = (function(_super) {
  __extends(FormModel, _super);

  function FormModel() {
    _ref1 = FormModel.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  FormModel.prototype.initialize = function() {
    this.form_id = $('#form_id').html();
    this.user = $('#user').html();
    return this.url = "/api/v1/repos/" + this.form_id + "/?format=json&user=" + this.user;
  };

  return FormModel;

})(Backbone.Model);

DataCollection = (function(_super) {
  __extends(DataCollection, _super);

  function DataCollection() {
    _ref2 = DataCollection.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  DataCollection.prototype.model = DataModel;

  DataCollection.prototype.initialize = function() {
    this.form_id = $('#form_id').html();
    return this.url = "/api/v1/data/" + this.form_id + "/?format=json";
  };

  DataCollection.prototype.comparator = function(data) {
    return data.get('timestamp');
  };

  return DataCollection;

})(Backbone.Collection);

DataView = (function(_super) {
  __extends(DataView, _super);

  function DataView() {
    this.auto_step = __bind(this.auto_step, this);    _ref3 = DataView.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  DataView.prototype.el = $('#viz');

  DataView.prototype.events = {
    "click #yaxis_options input": "change_y_axis",
    "click #chart_options a.btn": "switch_viz",
    "change #sharing_toggle": "toggle_public",
    "change #fps": "update_fps",
    "change #playtime": "update_playtime",
    "click #time_step a.btn": "time_step",
    "click #auto_step a.btn": "auto_step",
    "click #time_static a.btn": "time_static",
    "click #pause a.btn": "pause_playback"
  };

  DataView.prototype.data = new DataCollection();

  DataView.prototype.form = new FormModel();

  DataView.prototype.raw_headers = ['uuid'];

  DataView.prototype.map_headers = null;

  DataView.prototype.map_enabled = false;

  DataView.prototype.map = null;

  DataView.prototype.step_clicked = false;

  DataView.prototype.step_current = 0;

  DataView.prototype.num_steps = 0;

  DataView.prototype.quantum = 0;

  DataView.prototype.min_time = 0;

  DataView.prototype.max_time = 0;

  DataView.prototype.lower_bound = 0;

  DataView.prototype.upper_bound = 0;

  DataView.prototype.is_paused = false;

  fpsbox.innerHTML = fps.value;

  playtimebox.innerHTML = playtime.value;

  DataView.prototype.current_constrained_layer = null;

  DataView.prototype.yaxis = null;

  DataView.prototype.chart_fields = [];

  DataView.prototype.width = 750;

  DataView.prototype.height = 250;

  DataView.prototype.initialize = function() {
    this.listenTo(this.form, 'sync', this.render);
    this.form.fetch();
    this.data = document.initial_data;
    return this;
  };

  DataView.prototype.toggle_public = function(event) {
    var _this = this;

    $.post("/repo/share/" + this.form.form_id + "/", {}, function(response) {
      if (response.success) {
        $(event.currentTarget).attr('checked', response["public"]);
        if (response["public"]) {
          return $('#privacy').html('<img src=\'/static/img/public_repo.png\'>&nbsp;PUBLIC');
        } else {
          return $('#privacy').html('<img src=\'/static/img/private_repo.png\'>&nbsp;PRIVATE');
        }
      }
    });
    return this;
  };

  DataView.prototype.switch_viz = function(event) {
    var viz_type;

    viz_type = $(event.currentTarget).data('type');
    if (viz_type === 'map' && !this.map_enabled) {
      return;
    } else if (viz_type === 'line' && this.chart_fields.length === 0) {
      return;
    }
    $('.active').removeClass('active');
    $(event.currentTarget).addClass('active');
    return $('.viz-active').fadeOut('fast', function() {
      var _this = this;

      $(this).removeClass('viz-active');
      return $('#' + viz_type + '_viz').fadeIn('fast', function() {
        if (viz_type === 'map') {
          return document.vizApp.map.invalidateSize(false);
        }
      }).addClass('viz-active');
    });
  };

  DataView.prototype.auto_step = function(event) {
    var auto,
      _this = this;

    auto = function() {
      if (!_this.is_paused) {
        return _this.time_step();
      }
    };
    return setInterval(auto, 1000 / fps.value);
  };

  DataView.prototype.pause_playback = function(event) {
    if (this.is_paused) {
      pause_btn.innerHTML = "Pause";
      return this.is_paused = false;
    } else {
      pause_btn.innerHTML = "Resume";
      return this.is_paused = true;
    }
  };

  DataView.prototype.time_static = function(event) {
    var length;

    this.step_clicked = true;
    length = this.data.models.length;
    this.min_time = Date.parse(this.data.models[0].get('timestamp'));
    this.max_time = Date.parse(this.data.models[length - 1].get('timestamp'));
    if (start_date.value !== "") {
      this.min_time = Date.parse(start_date.value);
    }
    if (end_date.value !== "") {
      this.max_time = Date.parse(end_date.value);
    }
    this.lower_bound = this.min_time;
    this.upper_bound = this.max_time;
    return this.renderMap();
  };

  DataView.prototype.update_fps = function() {
    return fpsbox.innerHTML = fps.value;
  };

  DataView.prototype.update_playtime = function() {
    return playtimebox.innerHTML = playtime.value;
  };

  DataView.prototype.time_step = function(event) {
    var length;

    if (this.step_clicked === false) {
      length = this.data.models.length;
      this.step_clicked = true;
      this.min_time = Date.parse(this.data.models[0].get('timestamp'));
      this.max_time = Date.parse(this.data.models[length - 1].get('timestamp'));
      if (start_date.value !== "") {
        alert(start_date.value);
        this.min_time = Date.parse(start_date.value);
      }
      if (end_date.value !== "") {
        alert("bye");
        this.max_time = Date.parse(end_date.value);
      }
      this.num_steps = fps.value * playtime.value;
      alert(this.num_steps);
      this.quantum = Math.floor((this.max_time - this.min_time) / this.num_steps);
      this.lower_bound = this.min_time;
      this.upper_bound = this.min_time + this.quantum;
    }
    this.step_current += 1;
    if (this.step_current <= this.num_steps) {
      this.renderMap();
      current_time.innerHTML = new Date(this.lower_bound);
    }
    this.lower_bound += this.quantum;
    return this.upper_bound += this.quantum;
  };

  DataView.prototype.change_y_axis = function(event) {
    $('#yaxis_options input').attr('checked', false);
    $(event.target).attr('checked', true);
    this.yaxis = event.target.value;
    return this.renderCharts();
  };

  DataView.prototype.render = function() {
    var field, _i, _len, _ref4, _ref5, _ref6, _ref7;

    if (!this.form.attributes.children || !this.data) {
      return;
    }
    _ref4 = this.form.attributes.children;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      field = _ref4[_i];
      if ((_ref5 = field.type) !== 'note') {
        this.raw_headers.push(field.name);
      }
      if ((_ref6 = field.type) === 'decimal' || _ref6 === 'int' || _ref6 === 'integer') {
        this.chart_fields.push(field.name);
        if (!this.yaxis) {
          this.yaxis = field.name;
        }
      }
      if ((_ref7 = field.type) === 'geopoint') {
        $('#map_btn').removeClass('disabled');
        this.map_enabled = true;
        this.map_headers = field.name;
      }
    }
    this.renderRaw();
    if (this.data.models.length > 0) {
      if (this.map_enabled) {
        this.renderMap();
      } else {
        $('#map').hide();
      }
      if (this.chart_fields.length) {
        this.renderCharts();
      } else {
        $('#line_btn').addClass('disabled');
      }
    } else {
      $('#line_btn').addClass('disabled');
      $('#map_btn').addClass('disabled');
    }
    return this;
  };

  DataView.prototype.renderRaw = function() {
    var datum, headers, html, key, value, _i, _j, _k, _len, _len1, _len2, _ref4, _ref5, _ref6;

    $('#raw').html('');
    html = '<table id="raw_table" class="table table-striped table-bordered">';
    html += '<thead><tr>';
    headers = '';
    _ref4 = this.raw_headers;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      key = _ref4[_i];
      html += "<th>" + key + "</th>";
    }
    html += '</tr></thead>';
    html += '<tbody>';
    _ref5 = this.data.models;
    for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
      datum = _ref5[_j];
      html += '<tr>';
      _ref6 = this.raw_headers;
      for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
        key = _ref6[_k];
        value = datum.get('data')[key];
        if (value) {
          html += "<td>" + value + "</td>";
        } else {
          html += "<td>N/A</td>";
        }
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    $('#raw').html(html);
    $('#raw_table').dataTable({
      'sDom': "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
      'sPaginationType': 'bootstrap'
    });
    $.extend($.fn.dataTableExt.oStdClasses, {
      "sWrapper": "dataTables_wrapper form-inline"
    });
    return this;
  };

  DataView.prototype.renderCharts = function() {
    var end, line, max, min, model, option, parseDate, start, value, x, xAxis, y, yAxis, yaxis_tmpl, _i, _j, _len, _len1, _ref4, _ref5,
      _this = this;

    d3.select('svg').remove();
    $('#yaxis_options').html('');
    yaxis_tmpl = _.template($('#yaxis_tmpl').html());
    _ref4 = this.chart_fields;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      option = _ref4[_i];
      $('#yaxis_options').append(yaxis_tmpl({
        label: option,
        value: option,
        checked: this.yaxis === option ? 'checked' : ''
      }));
    }
    parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S').parse;
    start = parseDate(this.data.models[0].get('timestamp'));
    end = parseDate(this.data.models[this.data.length - 1].get('timestamp'));
    min = null;
    max = null;
    _ref5 = this.data.models;
    for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
      model = _ref5[_j];
      value = parseFloat(model.get('data')[this.yaxis]);
      if (!min || value < min) {
        min = value;
      }
      if (!max || value > max) {
        max = value;
      }
    }
    x = d3.time.scale().domain([start, end]).range([0, 800]);
    y = d3.scale.linear().domain([min, max]).range([200, 0]);
    xAxis = d3.svg.axis().scale(x).orient('bottom');
    yAxis = d3.svg.axis().scale(y).orient('left');
    line = d3.svg.line().x(function(d) {
      return x(parseDate(d.get('timestamp')));
    }).y(function(d) {
      return y(parseFloat(d.get('data')[_this.yaxis]));
    });
    this.svg = d3.select('#line').append('svg').attr('width', this.width).attr('height', this.height).append('g').attr('transform', 'translate( 32, 16 )');
    this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate( 0, 200 )').call(xAxis);
    this.svg.append("g").attr("class", "y axis").call(yAxis);
    this.svg.append('path').datum(this.data.models).attr('class', 'line').attr('d', line);
    return this;
  };

  DataView.prototype.renderMap = function() {
    var center, constrainedMarker, controls, datum, geopoint, heatmapData, html, key, layers, marker, myIcon, timestamp, value, _i, _j, _len, _len1, _ref4, _ref5, _ref6;

    this.heatmap = L.TileLayer.heatMap({
      radius: 80,
      opacity: 0.8,
      gradient: {
        0.45: "rgb(0,0,255)",
        0.55: "rgb(0,255,255)",
        0.65: "rgb(0,255,0)",
        0.95: "yellow",
        1.0: "rgb(255,0,0)"
      }
    });
    center = [0, 0];
    _ref4 = this.data.models;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      datum = _ref4[_i];
      geopoint = datum.get('data')[this.map_headers].split(' ');
      center[0] += parseFloat(geopoint[0]);
      center[1] += parseFloat(geopoint[1]);
    }
    center[0] = center[0] / this.data.models.length;
    center[1] = center[1] / this.data.models.length;
    if (this.step_clicked === false) {
      this.map = L.map('map').setView(center, 10);
    }
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);
    myIcon = L.icon({
      iconUrl: '/static/img/leaflet/marker-icon.png',
      iconRetinaUrl: '/static/img/leaflet/marker-icon@2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: '/static/img/leaflet/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [15, 41]
    });
    heatmapData = [];
    this.markers = [];
    this.constrained_markers = [];
    this.marker_layer = new L.MarkerClusterGroup();
    _ref5 = this.data.models;
    for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
      datum = _ref5[_j];
      geopoint = datum.get('data')[this.map_headers].split(' ');
      timestamp = Date.parse(datum.get('timestamp'));
      marker = L.marker([geopoint[0], geopoint[1]], {
        icon: myIcon
      });
      html = '';
      _ref6 = datum.get('data');
      for (key in _ref6) {
        value = _ref6[key];
        html += "<div><strong>" + key + ":</strong> " + value + "</div>";
      }
      marker.bindPopup(html);
      this.marker_layer.addLayer(marker);
      constrainedMarker = L.marker([geopoint[0], geopoint[1]], {
        icon: myIcon
      });
      if (this.lower_bound <= timestamp && timestamp <= this.upper_bound) {
        this.constrained_markers.push(constrainedMarker);
      }
      heatmapData.push({
        lat: geopoint[0],
        lon: geopoint[1],
        value: 1
      });
    }
    this.constrained_layer = L.layerGroup(this.constrained_markers);
    this.heatmap.addData(heatmapData);
    if (!this.step_clicked) {
      this.map.addLayer(this.heatmap);
      this.map.addLayer(this.marker_layer);
    }
    if (this.step_clicked) {
      this.map.removeLayer(this.current_constrained_layer);
    }
    this.map.addLayer(this.constrained_layer);
    this.current_constrained_layer = this.constrained_layer;
    layers = {
      'Markers': this.marker_layer,
      'Heatmap': this.heatmap,
      'Constrained': this.constrained_layer
    };
    controls = L.control.layers(null, layers, {
      collapsed: false
    });
    if (!this.step_clicked) {
      return controls.addTo(this.map);
    }
  };

  return DataView;

})(Backbone.View);
