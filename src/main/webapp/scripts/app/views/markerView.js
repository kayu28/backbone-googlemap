define(['backbone'], function (Backbone) {
	'use strict';

	var MarkerView = Backbone.View.extend({
		constructor: function (options) {
			console.log('[views]marker::initialize...');
			this.map_obj = options.map_obj;
			Backbone.View.prototype.constructor.apply(this, arguments);
			_.bindAll(this, 'render');
			this.listenTo(this.model, "destroy", this.onDestroy);
		},
		openInfoWindow: function (event) {
			console.log('[views]marker::openInfoWindow...');
			this.infoWindow = this.$el.html(this.getContent());
			this.infoWindow[0].style['padding-bottom'] = '10px';
			this.infoWindow[0].style['width'] = '90%';
			this.infoWindow[0].index = 1;
			this.map_obj.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
			this.map_obj.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.infoWindow[0]);
		},
		onDelete: function () {
			console.log('[views]marker::onDelete...');
			this.model.destroy();
		},
		onDestroy: function () {
			console.log('[views]marker::onDestroy...');
			this.marker.setMap(null);
			this.remove();
		},
		render: function () {
			console.log('[views]marker::render...');
			var _this = this;

			if (!this.icon) {
				throw new Error('icon must be defined in view');
			}

			if (typeof this.getContent != 'function') {
				throw new Error('getContent function must be defined in view');
			}

			this.marker = new google.maps.Marker({
				map: this.map_obj,
				position: this.model.getLatLng(),
				title: this.model.get('name'),
				icon: this.icon
			});

			google.maps.event.addListener(this.marker, 'click', function (e) {
				_this.openInfoWindow(e);
			});

			return this;
		},
	});
	return MarkerView;
});
