define(['backbone'], function (Backbone) {
	'use strict';
	console.log('[Model]Location::loading...');
	var Location = Backbone.Model.extend({
		constructor: function () {
			_.bindAll(this, 'getLatLng');
			this.defaults = _.extend({}, {
				name: "",
				place_id: "",
				lat: 0,
				lng: 0,
				location: null,
				title: "",
				address_components: []
			}, this.defaults);
			Backbone.Model.prototype.constructor.apply(this, arguments);
		},
		getLatLng: function () {
			return new google.maps.LatLng(this.get("lat"), this.get("lng"));
		}
	});
	return Location;
});
