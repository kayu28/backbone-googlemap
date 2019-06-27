define(['backbone', 'app/models/doctorLocation'], function (Backbone, DoctorLocation) {
	'use strict';
	console.log('[collections]doctorLocations::loading...');

	var DoctorLocationList = Backbone.Collection.extend({
		model: DoctorLocation,
		url: env.CONTEXT_PATH + "rest/doctor"
	});

	return DoctorLocationList;

});
