define([
	'backbone',
	'app/models/location'
], function (Backbone, Location) {
	'use strict';
	console.log('[Model]MeetingLocation::loading...');
	var MeetingLocation = Location.extend({
		constructor: function () {
			console.log('[Model]MeetingLocation::initialize...');
			// _.bindAll(this);
			Location.prototype.constructor.apply(this, arguments);
		},
	});
	return MeetingLocation;
});
