define(['require'], function(require) {
  return require(['app/dashboard/views'], function(DashboardView) {
    return document.dashboardApp = new DashboardView();
  });
});
