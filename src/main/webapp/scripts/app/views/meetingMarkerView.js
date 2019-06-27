define([
	'backbone',
	'app/views/markerView'
], function (Backbone, MarkerView) {
	'use strict';

	var MeetingMarkerView = MarkerView.extend({
		constructor: function (options) {
			console.log('[views]meetingMarker::initialize...');
			var _this = this;
			this.options = options;
			this.model = options.model;
			// this.map = options.map;
			MarkerView.prototype.constructor.apply(this, arguments);
			_.bindAll(this, 'render');
			this.listenTo(this.model, "destroy", this.onDestroy);

			var svg = [
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="25px" height="25px">',
				'<path d="M37 7h-28v27c0 2.2 1.8 4 4 4h20c2.2 0 4-1.8 4-4v-5c6.076 0 11-4.925 11-11s-4.924-11-11-11zm0 17v-12c3.314 0 6 2.686 6 6 0 3.313-2.686 6-6 6zm-35 16v2.301c0 1.896 2.069 2.699 4.6 2.699h36.8c2.53 0 4.6-.803 4.6-2.699v-2.301h-46z"/>',
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
	});
	return MeetingMarkerView;
});
