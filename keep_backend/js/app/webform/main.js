define(['require'], function(require) {
  return require(['app/webform/views'], function(xFormView) {
    var app;
    return app = new xFormView();
  });
});
