define(['require'], function(require) {
  return require(['app/viz/views', 'jquery', 'jqueryui'], function(DataVizApp, $) {
    Backbone.history.start();
    DataVizApp.start();
    $('#share_username').autocomplete({
      appendTo: '#autofill_list',
      minLength: 1,
      source: function(request, response) {
        return $.ajax({
          url: "/api/v1/user/",
          data: {
            username__icontains: $('#share_username').val(),
            format: 'json'
          },
          success: function(query) {
            return response($.map(query.objects, function(item) {
              return {
                label: item.username,
                value: item.username
              };
            }));
          }
        });
      }
    });
    return $('#move_username').autocomplete({
      appendTo: '#move_autofill_list',
      minLength: 1,
      source: function(request, response) {
        return $.ajax({
          url: "/api/v1/user/",
          data: {
            username__icontains: $('#move_username').val(),
            format: 'json'
          },
          success: function(query) {
            return response($.map(query.objects, function(item) {
              return {
                label: item.username,
                value: item.username
              };
            }));
          }
        });
      }
    });
  });
});
