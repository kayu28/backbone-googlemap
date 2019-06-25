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
			this.eventBus.on('searchList', this.searchList, this);
			this.eventBus.on('initSearchCriteria', this.initSearchCriteria, this);
			this.render();
		},
		initSearchCriteria: function (searchCriteria) {
			console.log(searchCriteria);
			this.searchCriteria = searchCriteria;
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
			this.autocomplete();

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
			$controlUI.attr("src", "images/menu.png");
			menuControlDiv.index = 1;
			this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(menuControlDiv);

		},
		searchList: function (searchText) {
			console.log('[views]map::searchList...');
			this.searchCriteria.set({
				text: searchText
			});
			this.search();
		},
		search: function (searchCriteria) {
			console.log('[views]map::search...');
			var _this = this;
			this.searchCriteria = searchCriteria  || this.searchCriteria;
			// this.searchCriteria = searchCriteria;
			var pos = this.map.getCenter();
			var latlng = new google.maps.LatLng(pos.lat(), pos.lng());
			var service = new google.maps.places.PlacesService(this.map);
			var parameters = {
				location: latlng,
				keyword: _this.searchCriteria.get('text'),
				type: 'cafe',
				bounds: this.map.getBounds(),
				// rankBy: google.maps.places.RankBy.DISTANCE
			};
			service.nearbySearch(parameters,
				function (results, status, pagination) {
					// if (status === 'ZERO_RESULT'){
					// }
					console.log(JSON.stringify(results, null, "\t"));
					var locationList = new LocationCollection(results);
					if (_this.markerCollectionView) {
						_this.markerCollectionView.trigger('reset', locationList, _this.map);
					} else {
						_this.markerCollectionView = new MarkerCollectionView({
							collection: locationList,
							map: _this.map,
							eventBus: _this.eventBus,
							el: $("#markerList"),
						});
					}
					_this.markerCollectionView.render();
				});
		},
		autocomplete: function () {
			var _this = this;
			var inputText = document.getElementById('autocomplete');
			var autocompleteOptions = {
				// bounds : bounds, // 範囲優先検索
				componentRestrictions: {
					country: 'jp'
				}
			};
			var autocomplete = new google.maps.places.Autocomplete(
				inputText, autocompleteOptions);
			autocomplete.bindTo('bounds', _this.map);
			autocomplete.setFields(['address_components', 'geometry', 'icon',
				'name']);
			autocomplete.addListener('place_changed', function () {
				console.log('[views]map::place_changed...');
				var place = autocomplete.getPlace();
				if (place.geometry.viewport == undefined) {
					_this.map.setCenter(place.geometry.location);
					_this.map.setZoom(12);
				} else {
					_this.map.fitBounds(place.geometry.viewport);
				}
				_this.search();
			});
		},
		geolocationFail: function (error) {
			// TODO
		},
	});
	return MapView;
});
