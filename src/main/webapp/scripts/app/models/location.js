define(['backbone'], function (Backbone) {
	'use strict';
	console.log('[model]location::loading...');
	var Location = Backbone.Model.extend({
		constructor: function () {
			console.log('[model]location::initialize...');
			_.bindAll(this, 'getLatLng');
			this.defaults = _.extend({}, {
				name: "",
				place_id: "",
				lat: 0,
				lng: 0
			}, this.defaults);
			Backbone.Model.prototype.constructor.apply(this, arguments);
		},
		getLatLng: function () {
			return new google.maps.LatLng(this.get("lat"), this.get("lng"));
		}
	});
	return Location;
});
