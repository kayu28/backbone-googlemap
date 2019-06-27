define([
	'backbone',
	'app/views/markerView'
], function (Backbone, MarkerView) {
	'use strict';

	var DoctorMarkerView = MarkerView.extend({
		constructor: function (options) {
			console.log('[views]doctorMarker::initialize...');
			var _this = this;
			this.options = options;
			MarkerView.prototype.constructor.apply(this, arguments);
			_.bindAll(this, 'render');

			var svg = [
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="25px" height="25px">',
				'<path d="M42.924 13h-4.924v-5.226c0-3.736-2.948-6.774-6.694-6.774h-12.611c-3.748 0-6.695 3.038-6.695 6.774v5.226h-4.925c-3.356 0-6.075 2.591-6.075 5.937v23.007c0 3.345 2.719 6.056 6.075 6.056h35.849c3.355 0 6.076-2.711 6.076-6.057v-23.006c0-3.346-2.721-5.937-6.076-5.937zm-26.924-5.226c0-1.399 1.292-2.774 2.695-2.774h12.611c1.399 0 2.694 1.375 2.694 2.774v5.226h-18v-5.226zm20 27.226h-7v7h-8v-7h-7v-8h7v-7h8v7h7v8z"/>',
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

			this.createInfoWindow();
			google.maps.event.addListener(this.marker, 'click', function (e) {
				_this.openInfoWindow(e);
			});
		},
		render: function () {
			console.log('[views]doctorMarker::render...  ');
			return this;
		},
	});
	return DoctorMarkerView;
});
