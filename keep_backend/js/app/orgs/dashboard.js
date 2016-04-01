$(function() {
  $('#add_member').autocomplete({
    appendTo: '#user_search_list',
    minLength: 2,
    source: function(request, response) {
      return $.ajax({
        url: "/api/v1/user",
        data: {
          format: 'json',
          username__icontains: request.term
        },
        success: function(data) {
          return response($.map(data.objects, function(item) {
            return {
              label: item.username,
              value: item.username
            };
          }));
        }
      });
    },
    select: function(event, ui) {
      var csrftoken, member_name;
      $('#add_member').prop('disabled', true);
      member_name = ui.item.value;
      csrftoken = $.cookie('csrftoken');
      $.ajax({
        url: "member/add/" + member_name + "/",
        type: 'POST',
        beforeSend: function(xhr, settings) {
          return xhr.setRequestHeader('X-CSRFToken', csrftoken);
        },
        success: function(data) {
          var member_tpl;
          if (!data.success) {
            return;
          }
          member_tpl = _.template($('#member_tmpl').html());
          return $('#member_list').append(member_tpl({
            'member_name': member_name
          }));
        }
      });
      $('#add_member').prop('disabled', false).val('');
      return false;
    }
  });
  $('#add-user-btn').click(function() {
    return $('#add_member').show();
  });
  return this;
});
