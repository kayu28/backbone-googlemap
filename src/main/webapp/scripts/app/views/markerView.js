define(['backbone'], function (Backbone) {
	'use strict';

	var MarkerView = Backbone.View.extend({
		constructor: function (options) {
			// console.log('[views]marker::initialize...');
			var _this = this;
			this.map = options.map;
			Backbone.View.prototype.constructor.apply(this, arguments);
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
				map: this.map,
				position: this.model.getLatLng(),
				title: this.model.get('title'),
				icon: icon
			});
			this.infowindow = new google.maps.InfoWindow();
			this.infowindow.setContent(document.getElementById('infowindow-content'));
			var address = '';
			var address_components = _this.model.get('address_components');
			if (address_components && address_components.length != 0) {
				address = [
					(address_components[0] && address_components[0].short_name || ''),
					(address_components[1] && address_components[1].short_name || ''),
					(address_components[2] && address_components[2].short_name || '')
				].join(' ');
			}
			this.infowindow.setContent('<div><strong>' + _this.model.get('title') + '</strong><br>' + address);

			google.maps.event.addListener(this.marker, 'click', function (e) {
				_this.infowindow.open(this.map, _this.marker);
				this.map.setCenter(e.latLng);
			});
		},
		onDelete:function () {
			console.log('[views]marker::onDelete...  ');
			this.model.destroy();
		},
		onDestroy:function () {
			console.log('[views]marker::onDestroy...  ');
			this.marker.setMap(null);
			this.remove();
		},
		render: function () {
			// console.log('[views]marker::render...  ');
			return this;
		},
	});
	return MarkerView;
});
