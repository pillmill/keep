var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'underscore', 'backbone', 'leaflet', 'app/webform/models', 'app/webform/constraints', 'app/webform/modals/language'], function($, _, Backbone, L, xFormModel, XFormConstraintChecker, LanguageSelectModal) {
  var xFormView, _ref;
  xFormView = (function(_super) {
    var _groupOperations, _performCalcluate;

    __extends(xFormView, _super);

    function xFormView() {
      _ref = xFormView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    xFormView.prototype.el = $('#webform');

    xFormView.prototype.model = new xFormModel();

    xFormView.prototype.events = {
      'click #submit_btn': 'submit',
      'click #form_sidebar > li': 'switch_question',
      'click #next_btn': 'next_question',
      'click #prev_btn': 'prev_question',
      'click #language-select-btn': 'language_select'
    };

    xFormView.prototype.language_select = function(event) {
      this.modalView = new LanguageSelectModal({
        current: this.current_language,
        view: this
      });
      $('.modal').html(this.modalView.render().el);
      this.modalView.onAfterRender($('.modal'));
      return this;
    };

    xFormView.prototype.initialize = function() {
      this.form_id = $('#form_id').html();
      this.user = $('#user').html();
      this.currentQuestionIndex = 0;
      this.numberOfQuestions = document.flat_fields.length;
      this.change_language(this.get_default_language());
      this.repopulateForm();
      this.show_first_question();
      return this;
    };

    xFormView.prototype.show_first_question = function() {
      var first_question;
      first_question = document.flat_fields[0];
      this.toggle_question(first_question, false);
      return this._display_form_buttons(0);
    };

    xFormView.prototype.change_language = function(language) {
      var choice, index, question, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      this.current_language = language;
      _ref1 = document.flat_fields;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        question = _ref1[_i];
        $('label[for="' + question.name + '"]').html(this.get_label(question));
        if (question.type.indexOf('select') > -1) {
          if (question.bind && question.bind.appearance && question.bind.appearance === 'dropdown') {
            _ref2 = question.choices;
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              choice = _ref2[_j];
              $("option[value='" + choice.name + "']").html(this.get_label(choice));
            }
          } else {
            index = 0;
            _ref3 = question.choices;
            for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
              choice = _ref3[_k];
              $("label[for='" + question.name + "-" + index + "']").html(this.get_label(choice));
              index++;
            }
          }
        }
      }
      return this;
    };

    xFormView.prototype.first_key = function(dict) {
      return _.keys(dict)[0];
    };

    xFormView.prototype.get_default_language = function() {
      var first_field, second_field;
      first_field = document.flat_fields[0];
      second_field = document.flat_fields[1];
      if (!this.get_translations(first_field)) {
        return this.get_translations(second_field);
      } else {
        return this.get_translations(first_field);
      }
    };

    xFormView.prototype.get_translations = function(field) {
      if (field == null) {
        return;
      }
      if (field.type === 'group') {
        if (typeof field.children[0].label === 'object') {
          if (field.children[0].label['English'] != null) {
            return 'English';
          }
          return this.first_key(field.children[0].label);
        } else {
          return field.children[0].label;
        }
      }
      if (field.type !== 'group' && (field.label != null)) {
        if (typeof field.label === 'object') {
          if (field.label['English'] != null) {
            return 'English';
          }
          return this.first_key(field.label);
        } else {
          return null;
        }
      }
    };

    xFormView.prototype.get_label = function(dictionary) {
      var label;
      if (dictionary.label == null) {
        return '';
      }
      label = dictionary.label;
      if (typeof label === 'string') {
        return label;
      }
      if (label[this.current_language]) {
        return label[this.current_language];
      } else {
        return label[this.first_key(label)];
      }
    };

    xFormView.prototype.submit = function() {
      return $(".form").submit();
    };

    xFormView.prototype.queryStringToJSON = function(url) {
      var key, pair_strings, qs, result, str, value, _i, _len, _ref1;
      if (url === '') {
        return {};
      }
      qs = url || location.search;
      if (qs[0] === '?') {
        qs = qs.slice(1);
      }
      pair_strings = qs.split('&');
      result = {};
      for (_i = 0, _len = pair_strings.length; _i < _len; _i++) {
        str = pair_strings[_i];
        _ref1 = str.split('='), key = _ref1[0], value = _ref1[1];
        result[key] = decodeURIComponent(value) || '';
      }
      return result;
    };

    xFormView.prototype.replaceAll = function(find, replace, str) {
      return str.replace(new RegExp(find, 'g'), replace);
    };

    xFormView.prototype.repop_multiple = function(newstring, object) {
      var andindex, cont, index, value;
      cont = newstring;
      while (true) {
        index = cont.indexOf(object.name);
        if (index === -1) {
          break;
        }
        cont = cont.substring(index, cont.length);
        andindex = cont.indexOf("&");
        value = cont.substring(object.name.length + 1, andindex);
        cont = cont.substring(object.name.length + 1, cont.length);
        $('input[value="' + value + '"]').prop('checked', true);
      }
      return this;
    };

    xFormView.prototype.repopulateForm = function() {
      var i, j, obj, obj2, result, _i, _j, _ref1, _ref2;
      result = this.queryStringToJSON(null);
      for (i = _i = 0, _ref1 = document.flat_fields.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        obj = document.flat_fields[i];
        if (obj.type === "group") {
          for (j = _j = 0, _ref2 = obj.children.length - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; j = 0 <= _ref2 ? ++_j : --_j) {
            obj2 = obj.children[j];
            if (obj2.type === 'select all that apply') {
              this.repop_multiple(location.search, obj2);
            } else if (obj2.type === "select one") {
              $('input[value="' + result[obj2.name] + '"]').prop('checked', true);
            } else {
              $('#' + obj2.name).val(result[obj2.name]);
            }
          }
        } else {
          if (obj.type === 'select all that apply') {
            this.repop_multiple(location.search, obj);
          } else if (obj.type === "select one") {
            $('input[value="' + result[obj.name] + '"]').prop('checked', true);
          } else {
            $('#' + obj.name).val(result[obj.name]);
          }
        }
      }
      return this;
    };

    _performCalcluate = function(equation) {
      var begin, end, evaluation, i, operation, parenCount, side1, side2;
      evaluation = void 0;
      i = void 0;
      begin = void 0;
      end = void 0;
      side1 = void 0;
      side2 = void 0;
      operation = void 0;
      parenCount = void 0;
      parenCount = 0;
      i = 0;
      while (i < equation.length) {
        if (equation[i] === "(") {
          if (parenCount === 0) {
            begin = i;
          }
          parenCount++;
        } else if (equation[i] === ")") {
          parenCount--;
          if (parenCount === 0) {
            end = i;
            equation = equation.replace(equation.substring(begin, end + 1), _performCalcluate(equation.substring(begin + 1, end)));
          }
        }
        i++;
      }
      side1 = equation.slice(0, equation.indexOf(" "));
      operation = equation.slice(side1.length + 1, equation.lastIndexOf(" "));
      side2 = equation.slice(equation.lastIndexOf(" ") + 1);
      if (side1.slice(0, 2) === "${") {
        side1 = $("#" + side1.slice(2, -1)).val();
      }
      if (side2.slice(0, 2) === "${") {
        side2 = $("#" + side2.slice(2, -1)).val();
      }
      if (operation === "-") {
        return side1 - side2;
      } else if (operation === "+") {
        return side1 + side2;
      } else if (operation === "*") {
        return side1 * side2;
      } else if (operation === "div") {
        return side1 / side2;
      } else {

      }
    };

    _groupOperations = function(question, forward) {
      var current_tree, element, grid_row, idx, index, question_change, question_info, table_name, _i, _j, _len, _len1, _ref1, _ref2;
      if (this.input_fields[question].control) {
        if (this.input_fields[question].control.appearance === "field-list") {
          current_tree = this.input_fields[question].tree;
          $('#' + this.input_fields[question].name + '_field').fadeIn(1).addClass('active');
          question++;
          question_info = this.input_fields[question];
          while (question_info.tree === current_tree) {
            question_change = $('#' + question_info.name + "_field");
            question_change.fadeIn(1).addClass('active');
            $('.active input').focus();
            question++;
            question_info = this.input_fields[question];
          }
        } else if (this.input_fields[question].control.appearance === "grid-list" && !($('#' + this.input_fields[question].name + '_field').hasClass('grid-list'))) {
          current_tree = this.input_fields[question].tree;
          table_name = this.input_fields[question].name + '_table';
          $('#' + this.input_fields[question].name + '_field').fadeIn(1).append($('<table id="' + table_name + '" class="grid-list"></div>')).addClass('active grid-list');
          question++;
          question_info = this.input_fields[question];
          grid_row = 0;
          $('#' + table_name).append('<tr id="' + table_name + '-' + grid_row + '" class="grid-list-row"></td>');
          $('#' + table_name + '-' + grid_row).append('<td />');
          _ref1 = question_info.options;
          for (idx = _i = 0, _len = _ref1.length; _i < _len; idx = ++_i) {
            element = _ref1[idx];
            $('#' + table_name + '-' + grid_row).append('<td id="' + table_name + '-' + grid_row + '-' + idx + '" class="grid-list-cell">' + element.label + '</td>');
          }
          while (question_info.tree === current_tree) {
            grid_row += 1;
            $('#' + question_info.name + "_field").remove();
            question_change = question_info.name + '_field';
            $('#' + table_name + ' tbody').append('<tr id ="' + question_change + '" data-key="' + question_info.name + '" class="active grid-list-row">');
            $('#' + question_change).append('<td class="grid-list-cell grid-list-label">\
                            <label class="control-label" for="' + question_info.name + '"> ' + question_info.title + '</label></td>');
            _ref2 = question_info.options;
            for (index = _j = 0, _len1 = _ref2.length; _j < _len1; index = ++_j) {
              element = _ref2[index];
              $('#' + question_change).append('<td class="grid-list-cell">\
                              <input value="' + element.label + '" type="radio" name="' + question_info.name + '" id="' + question_info.name + '-' + index + '">\
                            </td>');
            }
            $('.active input').focus();
            question++;
            question_info = this.input_fields[question];
          }
        } else if ($('#' + this.input_fields[question].name + '_field').hasClass('grid-list')) {
          question_change = '#' + this.input_fields[question].name + "_field";
          $(question_change).fadeIn(1).addClass('active');
          $(question_change + ' tr').each(function() {
            return $(this).fadeIn(1).addClass('active');
          });
        }
      } else {
        while (this.input_fields[question].bind && this.input_fields[question].bind.group_start) {
          if (forward) {
            if (question < this.input_fields.length) {
              question++;
            }
          } else {
            if (question > 0) {
              question++;
            }
          }
        }
        question_change = $('#' + $($('.control-group').eq(question)[0]).data('key') + "_field");
        question_change.fadeIn(1).addClass('active');
      }
      return this;
    };

    xFormView.prototype._display_form_buttons = function(question_index) {
      if (question_index >= this.numberOfQuestions - 1) {
        $('#prev_btn').show();
        $('#submit_btn').show();
        $('#next_btn').hide();
      } else if (question_index === 0) {
        $('#prev_btn').hide();
        $('#submit_btn').hide();
        $('#next_btn').show();
      } else {
        $('#prev_btn').show();
        $('#next_btn').show();
        $('#submit_btn').hide();
      }
      if (document.getElementById('detail_data_id') !== null) {
        $('#submit_btn').show();
      }
      return this;
    };

    xFormView.prototype.passes_question_constraints = function() {
      var question, _ref1;
      question = document.flat_fields[this.currentQuestionIndex];
      if (((_ref1 = question.bind) != null ? _ref1.required : void 0) === "yes") {
        if (this.get_question_value(question).length === 0) {
          alert("Answer is required.");
          return false;
        }
      }
      if (!XFormConstraintChecker.passesConstraint(question, this.get_question_value(question))) {
        alert("Answer doesn't pass constraint: " + question.info.bind.constraint);
        return false;
      }
      return true;
    };

    xFormView.prototype.get_question_value = function(question) {
      var answer_json, answers;
      answers = $(".form").serialize();
      answer_json = this.queryStringToJSON(answers);
      if (answer_json[question.name] != null) {
        return answer_json[question.name];
      } else {
        return "";
      }
    };

    xFormView.prototype.show_question = function(question) {
      return this.toggle_question(question, false);
    };

    xFormView.prototype.hide_question = function(question) {
      return this.toggle_question(question, true);
    };

    xFormView.prototype.toggle_question = function(question, hide) {
      var child, _i, _len, _ref1;
      if (!question) {
        return false;
      }
      if (hide) {
        $('#' + question.name + '_field').hide();
      } else {
        $('#' + question.name + '_field').show();
      }
      if (question.type === 'group') {
        _ref1 = question.children;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          child = _ref1[_i];
          this.toggle_question(child, hide);
        }
      }
      return true;
    };

    xFormView.prototype.get_group_for_question = function(question, fields, group) {
      var field, thegroup, _i, _len;
      if (fields == null) {
        fields = document.flat_fields;
      }
      if (group == null) {
        group = null;
      }
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        if (field.type === 'group') {
          thegroup = this.get_group_for_question(question, field.children, field);
          if (thegroup) {
            return thegroup;
          }
        } else if (field.name === question.name && group) {
          return group;
        }
      }
      return null;
    };

    xFormView.prototype.switch_question = function(next_index, advancing) {
      var current_question, group, next_question, _ref1, _ref2;
      current_question = document.flat_fields[this.currentQuestionIndex];
      next_question = document.flat_fields[next_index];
      if (next_index === 0) {
        this.hide_question(current_question);
        this.show_question(next_question);
        this.currentQuestionIndex = 0;
        this.update_progress_bar(0);
        this._display_form_buttons(0);
        return;
      }
      if (next_index >= this.numberOfQuestions) {
        if (!this.passes_question_constraints()) {
          return;
        }
        this.currentQuestionIndex = this.numberOfQuestions;
        this.update_progress_bar(next_index);
        this._display_form_buttons(next_index);
        return;
      }
      if (advancing) {
        if (!this.passes_question_constraints()) {
          return;
        }
        if (current_question.type === 'group') {
          next_index = next_index + current_question.children.length;
          next_question = document.flat_fields[next_index];
          if (next_index >= this.numberOfQuestions) {
            this.update_progress_bar(next_index);
            this._display_form_buttons(next_index);
            return;
          }
        }
      } else {
        group = this.get_group_for_question(next_question);
        if (group) {
          next_index = next_index - group.children.length;
          next_question = document.flat_fields[next_index];
        }
      }
      if ((((_ref1 = next_question.bind) != null ? _ref1.calculate : void 0) != null) || !XFormConstraintChecker.isRelevant(next_question, this.queryStringToJSON($(".form").serialize()))) {
        if (((_ref2 = next_question.bind) != null ? _ref2.calculate : void 0) != null) {
          $("#" + next_question.name).val(_performCalcluate(next_question.bind.calculate));
        }
        if (advancing) {
          if (next_index < this.numberOfQuestions) {
            next_index += 1;
          }
        } else {
          if (next_index > 0) {
            next_index -= 1;
          }
        }
        this.switch_question(next_index, advancing);
        return;
      }
      this.hide_question(current_question);
      this.show_question(next_question);
      this.currentQuestionIndex = next_index;
      this.update_progress_bar(next_index);
      this._display_form_buttons(this.currentQuestionIndex);
      return this;
    };

    xFormView.prototype.update_progress_bar = function(next_index) {
      var new_width_percentage;
      new_width_percentage = ((next_index / this.numberOfQuestions) * 100).toString();
      return this.$('.progress-bar').width("" + new_width_percentage + "%");
    };

    xFormView.prototype.next_question = function() {
      this.switch_question(this.currentQuestionIndex + 1, true);
      return this;
    };

    xFormView.prototype.prev_question = function() {
      this.switch_question(this.currentQuestionIndex - 1, false);
      return this;
    };

    return xFormView;

  })(Backbone.View);
  return xFormView;
});
