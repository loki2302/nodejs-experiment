module.exports = function(KoaRouter, indexHtmlRoute) {
  var router = new KoaRouter();
  indexHtmlRoute(router);
  return router.middleware();
};
