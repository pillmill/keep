// Generated by CoffeeScript 1.6.1

$(function() {
  return $.getJSON('/api/v1/data/', {
    'user': $('#user').html()
  }, function(data) {
    var datum, feed_tmpl, info, label, _i, _len, _ref, _results;
    console.log(moment().format());
    $('#submissions_feed').html('');
    if (data.length === 0) {
      return $('#submissions_feed').html('<div style="color:#AAA;">No submissions yet =[</div>');
    } else {
      feed_tmpl = _.template($('#submission_feed_tmpl').html());
      _ref = data.objects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        datum = _ref[_i];
        label = 'Submission from ';
        if (datum.uuid) {
          label += 'mobile device';
        } else {
          label += 'web';
        }
        info = {
          label: label,
          time: moment.utc(datum.timestamp).fromNow(),
          link: ("/api/v1/data/" + datum.repo_id + "?user=") + $('#user').html(),
          survey_name: datum.survey_label ? datum.survey_label : datum.repo
        };
        _results.push($('#submissions_feed').append(feed_tmpl(info)));
      }
      return _results;
    }
  });
});