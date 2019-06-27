define([
	'backbone',
	'app/views/markerView'
], function (Backbone, MarkerView) {
	'use strict';

	var CustomerMarkerView = MarkerView.extend({
		constructor: function (options) {
			console.log('[views]customerMarker::initialize...');
			var _this = this;
			this.options = options;
			// this.map = options.map;
			MarkerView.prototype.constructor.apply(this, arguments);
			_.bindAll(this, 'render');

			var svg = [
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="25px" height="25px">',
				'<path d="M22 10h-3c-2.82 0-5 1.719-5 4.587v12.413c0 2 3 2 3 0v-12h1v32c0 1.233.768 2 2 2 1.235 0 2-.767 2-2v-37zm13 15l-4.017-10.357c-.349-2.321-2.693-4.643-5.368-4.643h-2.615v23.783c.5.002 1 .075 1 .217v13c0 1.04.917 2 2 2 1.086 0 2-.961 2-2v-13h3.869c.362 0 1.044-.654 1.044-1 0-.08.029-.931 0-1l-5.909-16.237-.034-.167c0-.237.199-.429.447-.429.211 0 .388.141.435.329l4.017 10.504c.267.601 1.365 1 2.087 1 .965 0 1.065-1.895 1.044-2z"/>',
				'</svg>'].join('\n');
			var icon = {
				url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svg)
			};

			this.marker = new google.maps.Marker({
				map: this.map_obj,
				position: this.model.getLatLng(),
				title: this.model.get('name'),
				icon: icon
			});

			var infoWindow = document.createElement('div');
			var infoWindowText = document.createElement('div');
			infoWindowText.id = 'infoWindowText';
			infoWindowText.innerHTML = this.model.get('name');
			infoWindow.appendChild(infoWindowText);
			infoWindow.index = 1;
			infoWindow.style['padding-bottom'] = '10px';
			infoWindow.style['width'] = '90%';
			this.infoWindow = infoWindow;

			google.maps.event.addListener(this.marker, 'click', function (e) {
				_this.openInfoWindow(e);
			});
		},
		render: function () {
			console.log('[views]customerMarker::render...  ');
			return this;
		},
	});
	return CustomerMarkerView;
});
