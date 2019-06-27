define(['backbone'], function (Backbone) {
	'use strict';

	var MarkerView = Backbone.View.extend({
		constructor: function (options) {
			// console.log('[views]marker::initialize...');
			var _this = this;
			this.map_obj = options.map_obj;
			Backbone.View.prototype.constructor.apply(this, arguments);
			_.bindAll(this, 'render');
			this.listenTo(this.model, "destroy", this.onDestroy);
		},
		openInfoWindow: function (event) {
			this.map_obj.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
			this.map_obj.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.infoWindow);
		},
		onDelete: function () {
			console.log('[views]marker::onDelete...  ');
			this.model.destroy();
		},
		onDestroy: function () {
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
