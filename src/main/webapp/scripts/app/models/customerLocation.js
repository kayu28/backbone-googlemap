define([
	'backbone',
	'app/models/location'
], function (Backbone, Location) {
	'use strict';
	console.log('[Model]customerLocation::loading...');
	var CustomerLocation = Location.extend({
		constructor: function () {
			Location.prototype.constructor.apply(this, arguments);
			// _.bindAll(this);
		},
	});
	return CustomerLocation;
});
