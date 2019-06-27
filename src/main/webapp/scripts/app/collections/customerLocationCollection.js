define([
	'backbone',
	'app/models/customerLocation'
], function (Backbone, CustomerLocation) {
	'use strict';
	console.log('[collections]customerLocations::loading...');

	var CustomerLocationList = Backbone.Collection.extend({
		url: env.CONTEXT_PATH + "api/customer",
		constructor: function(opt_models, opt_options) {
			console.log('[collections]customerLocations::initialize...');
			var options = _.defaults({}, opt_options, {
				model: CustomerLocation,
			});
			options.model || (options.model = CustomerLocation);
			Backbone.Collection.prototype.constructor.call(this, opt_models, options);
		}
	});

	return CustomerLocationList;

});
