define([
	'backbone',
	'app/models/searchCriteria',
	'app/views/common/headerView',
	'app/views/mapView',
	'app/views/common/footerView'
], function (Backbone, SearchCriteria, HeaderView, MapView, FooterView) {
	'use strict';
	console.log('[views]app::loading...');

	var AppView = Backbone.View.extend({
		initialize: function () {
			console.log('[views]app::initialize...*** start');
			this.eventBus = _.extend({}, Backbone.Events);
			this.headerView = new HeaderView({
				el: $("#header"),
				eventBus : this.eventBus
			});
			this.mapView = new MapView({
				el: $("#googleMapBox"),
				eventBus : this.eventBus
			});
			var searchCriteria = new SearchCriteria();
			this.footerView = new FooterView({
				el: $("#footer"),
				model: searchCriteria,
				eventBus : this.eventBus
			});
			console.log('[views]app::initialize...*** end');
		},
	});
	return AppView;
});
