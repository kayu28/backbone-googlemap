define([
	'backbone',
	'app/models/meetingLocation'
], function (Backbone, MeetingLocation) {
	'use strict';
	console.log('[collections]meetingLocation::loading...');

	var MeetingLocationList = Backbone.Collection.extend({
		parse: function(data) {
			return data.models;
		},
		constructor: function (models, options) {
			console.log('[collections]meetingLocation::initialize...');
			// var options = _.defaults({}, options, {
			// 	model: MeetingLocation
			// });
			this.options = options;
			this.map_obj = this.options.map_obj;
//			options.model || (options.model = MeetingLocation);
			// Backbone.Collection.prototype.constructor.call(this, options);
			Backbone.Collection.prototype.constructor.call(this);
		},
		fetch: function (searchCriteria) {
			console.log('[collections]meetingLocation::fetch...');
			var _this = this;
			var pos = this.map_obj.getCenter();
			var latlng = new google.maps.LatLng(pos.lat(), pos.lng());
			var service = new google.maps.places.PlacesService(this.map_obj);
			var parameters = {
				location: latlng,
				keyword: searchCriteria.get('text'),
				type: 'cafe',
				bounds: this.map_obj.getBounds(),
				// rankBy: google.maps.places.RankBy.DISTANCE
			};

			var deferred = new $.Deferred();

			service.nearbySearch(parameters,
				function (results, status, pagination) {
					console.log(JSON.stringify(results, null, "\t"));
					results.forEach(function (val, index, ar) {
						var place = new MeetingLocation({
							name: val.name,
							place_id: val.place_id,
							lat: val.geometry.location.lat(),
							lng: val.geometry.location.lng(),
						});
						_this.add(place);
					});
					deferred.resolve();
				});
			return deferred.promise();
		}
	});

	return MeetingLocationList;
});
