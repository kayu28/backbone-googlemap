define([
	'backbone',
	'app/views/markerView'
], function (Backbone, MarkerView) {
	'use strict';

	var UserMarkerView = MarkerView.extend({
		constructor: function (options) {
			console.log('[views]userMarker::initialize...');
			var _this = this;
			this.options = options;
			this.map_obj = options.map_obj;
			Backbone.View.prototype.constructor.apply(this, arguments);
			_.bindAll(this, 'render');

			this.userMarker = new google.maps.Marker({
				position: this.options.latlng,
				map: this.map_obj,
				icon: {
					path: google.maps.SymbolPath.CIRCLE,
					fillColor: "blue",
					fillOpacity: 1.0,
					strokeColor: "blue",
					strokeOpacity: 1.0,
					strokeWeight: 0,
					scale: 10
				},
			});
			var circle = new google.maps.Circle({
				center: this.options.latlng,
				radius: this.options.accuracy,
				map: this.map_obj,
				fillColor: '#FF6600',
				fillOpacity: 0.3,
				strokeColor: '#FFF',
				strokeOpacity: 0
			});
			// this.map.fitBounds(circle.getBounds());
		},
		render: function () {
			console.log('[views]userMarker::render...  ');
			return this;
		},
	});
	return UserMarkerView;
});
