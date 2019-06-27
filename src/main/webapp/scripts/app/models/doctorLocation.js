define([
	'backbone',
	'app/models/location'
], function (Backbone, Location) {
	'use strict';
	console.log('[Model]doctorLocation::loading...');
	var DoctorLocation = Location.extend({
		constructor: function () {
			// _.bindAll(this);
			Location.prototype.constructor.apply(this, arguments);
		},
	});
	return DoctorLocation;
});
