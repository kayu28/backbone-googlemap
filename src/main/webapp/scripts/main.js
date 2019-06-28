require.config({
	baseUrl: 'scripts',
	paths: {
		'jquery': '../libs/jquery/dist/jquery.min',
		'underscore': '../libs/underscore/underscore',
		'backbone': '../libs/backbone/backbone',
		"bootstrap": "../libs/bootstrap/dist/js/bootstrap.min",
		'hbs': 'require-handlebars-plugin/hbs',
		'google': 'https://maps.googleapis.com/maps/api/js?key=' + api_key + '&libraries=places&language=jp&region=jp',
		'app': 'app'
	},
	shim: {
		'jquery': {
			exports: '$'
		},
		'bootstrap': {
			deps: ['jquery']
		},
		'underscore': {
			exports: '_'
		},
		'hbs/handlebars': {
			exports: 'Handlebars'
		},
	},
	// require-handlebars-plugin固有の設定を追加
	hbs: {
		helperPathCallback: function (name) {
			return '/templates/helpers/' + name;
		}
	}
});
require(['backbone', 'app/env', 'app/views/appView', 'bootstrap', 'google'],
	function (Backbone, Env, AppView) {
		Backbone.history.start();
		var appView = new AppView({});
	});
