require.config({
  baseUrl: 'scripts',
  paths: {
    'jquery': '../bower_components/jquery/jquery',
  },
  shim: {
    'jquery': {
      deps: [],
      exports: '$'
    }
  }
});

require(['jquery'], function($){
  $('body').addClass('hi');
})
