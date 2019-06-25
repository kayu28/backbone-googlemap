define(['backbone', 'app/models/location'], function (Backbone, Location) {
	'use strict';
	console.log('[collections]location::loading...');

	var LocationList = Backbone.Collection.extend({
		constructor: function (places, opt_options) {
			console.log('[collections]location::initialize...');
			var options = _.defaults({}, opt_options, {
				model: Location
			});
			options.model || (options.model = Location);
			var ary = [];
			places.forEach(function(val,index,ar){
				var place = {
					title: val.name,
					place_id: val.place_id,
					location: val.geometry.location,
					lat: val.geometry.location.lat(),
					lng: val.geometry.location.lng(),
					address_components: val.address_components,
					// TODO array
					type: ''
				};
				ary.push(place);
			});
			Backbone.Collection.prototype.constructor.call(this, ary, options);
		}
	});

	return LocationList;
});
