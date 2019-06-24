define([
	'backbone',
	'app/collections/locationCollection',
	'app/views/userMarkerView',
	'app/views/markerCollectionView'
], function (Backbone, LocationCollection, UserMarkerView, MarkerCollectionView) {
	'use strict';
	console.log('[views]map::loading...');

	var MapView = Backbone.View.extend({
		events: {
			"click #menu-icon": "list"
		},
		list: function () {
			console.log('[views]map::list...');
			this.eventBus.trigger('list');
		},
		initialize: function (options) {
			this.eventBus = options.eventBus;
			_.bindAll(this, 'render', 'search', 'initMap', 'activate');
			this.eventBus.on('search', this.search, this);
			this.render();
		},
		render: function () {
			this.activate();
			return this;
		},
		activate: function () {
			var options = {
				"enableHighAccuracy": false,
				"timeout": 8000,
				"maximumAge": 2000,
			};
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(this.initMap, this.geolocationFail, options);
				//				navigator.geolocation.watchPosition(this.watchSuccess, this.watchError, options);
			} else {
				alert("Your browser does not support the Geolocation API");
			}
		},
		initMap: function (position) {
			var _this = this;
			var data = position.coords;
			var lat = data.latitude;
			var lng = data.longitude;
			var latlng = new google.maps.LatLng(lat, lng);
			var mapOptions = {
				zoom: 14,
				center: latlng,
				gestureHandling: 'greedy',
				mapTypeControl: false,
				fullscreenControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				clickableIcons: false
			};

			var map = new google.maps.Map(this.el, mapOptions);
			this.map = map;

			var userMarker = new UserMarkerView({
				latlng: latlng,
				map: map,
				accuracy: data.accuracy
			});
			userMarker.render();

			google.maps.event.addListener(this.map, 'dragend', function () {
				console.log('[views]nearbysearch::dragend...');
				console.log('zoom level:' + _this.map.getZoom());
				if (_this.map.getZoom() >= 14) _this.search();
			});

			var menuControlDiv = document.getElementById('menu');
			var $controlUI = $(menuControlDiv).children('img');
			$controlUI.attr("src","images/menu.png");
			menuControlDiv.index = 1;
			this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(menuControlDiv);

		},
		search: function (event, searchCriteria) {
			console.log('[views]nearbysearch::search...');
			var _this = this;
			var pos = this.map.getCenter();
			var latlng = new google.maps.LatLng(pos.lat(), pos.lng());
			var service = new google.maps.places.PlacesService(this.map);
			var parameters = {
				location: latlng,
				keyword: searchCriteria,
				type: 'cafe',
				bounds: this.map.getBounds(),
				// rankBy: google.maps.places.RankBy.DISTANCE
			};
			service.nearbySearch(parameters,
				function (results, status, pagination) {
					if (status !== 'OK') return;
					console.log(results.length);
					console.log(JSON.stringify(results, null, "\t"));
					var locationList = new LocationCollection(results);
					if (_this.markerCollectionView) {
						_this.markerCollectionView.trigger('reset', locationList, _this.map);
					} else {
						_this.markerCollectionView = new MarkerCollectionView({
							collection: locationList,
							map: _this.map,
							eventBus : _this.eventBus,
							el: $("#markerList"),
						});
					}
					_this.markerCollectionView.render();
				});
		},
		geolocationFail: function (error) {
			// TODO
		},
	});
	return MapView;
});
