define([
	'backbone',
	'app/collections/meetingLocationCollection',
	'app/collections/customerLocationCollection',
	'app/collections/doctorLocationCollection',
	'app/views/userMarkerView',
	'app/views/markerCollectionView'
], function (
	Backbone,
	MeetingLocationCollection,
	CustomerLocationCollection,
	DoctorLocationCollection,
	UserMarkerView,
	MarkerCollectionView) {
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

				var map_obj = new google.maps.Map(this.el, mapOptions);
				this.map_obj = map_obj;
				this.autocomplete();

				var userMarker = new UserMarkerView({
					latlng: latlng,
					map_obj: map_obj,
					accuracy: data.accuracy
				});
				userMarker.render();

				google.maps.event.addListener(this.map_obj, 'dragend', function () {
					console.log('[views]nearbysearch::dragend...');
					console.log('zoom level:' + _this.map_obj.getZoom());
					if (_this.map_obj.getZoom() >= 14) _this.search();
				});

				var menuControlDiv = document.getElementById('menu');
				var $controlUI = $(menuControlDiv).children('img');
				$controlUI.attr("src", "images/menu.png");
				menuControlDiv.index = 1;
				this.map_obj.controls[google.maps.ControlPosition.TOP_RIGHT].push(menuControlDiv);

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
				this.searchCriteria = searchCriteria || this.searchCriteria;
				var pos = this.map_obj.getCenter();
				var latlng = new google.maps.LatLng(pos.lat(), pos.lng());
				var customerLocationDfd, doctorLocationDfd, meetingLocationDfd;
				this.customerLocationCollection = null;
				this.doctorLocationCollection = null;
				this.meetingLocationCollection = null;

				if (this.searchCriteria.get('customerMode')) {
					console.log('customerMode');
					this.customerLocationCollection = new CustomerLocationCollection();
					customerLocationDfd = this.customerLocationCollection.fetch();
				}
				if (this.searchCriteria.get('doctorMode')) {
					console.log('doctorMode');
					// TODO
					this.doctorLocationCollection = new DoctorLocationCollection();
					doctorLocationDfd = this.doctorLocationCollection.fetch();
				}
				if (this.searchCriteria.get('meetingAreaMode')) {
					console.log('meetingAreaMode');

					this.meetingLocationCollection = new MeetingLocationCollection([], {
						map_obj: this.map_obj
					});
					meetingLocationDfd = this.meetingLocationCollection.fetch(this.searchCriteria);
				}

				$.when(customerLocationDfd, doctorLocationDfd, meetingLocationDfd)
					.done(function (data, textStatus, jqXHR) {
						console.log('done:' + data);
						if (_this.markerCollectionView) {
							_this.markerCollectionView.trigger('resetMeetingLocation', _this.meetingLocationCollection, _this.map_obj);
							_this.markerCollectionView.trigger('resetCustomerLocation', _this.customerLocationCollection, _this.map_obj);
						} else {
							_this.markerCollectionView = new MarkerCollectionView({
								meetingCollection: _this.meetingLocationCollection,
								customerCollection: _this.customerLocationCollection,
								map_obj: _this.map_obj,
								eventBus: _this.eventBus,
								el: $("#markerList"),
							});
						}
						_this.markerCollectionView.render();
					})
					.fail(function (data, textStatus, jqXHR) {
						console.log('fail:' + data);
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
				autocomplete.bindTo('bounds', _this.map_obj);
				autocomplete.setFields(['address_components', 'geometry', 'icon',
					'name']);
				autocomplete.addListener('place_changed', function () {
					console.log('[views]map::place_changed...');
					var place = autocomplete.getPlace();
					if (place.geometry.viewport == undefined) {
						_this.map_obj.setCenter(place.geometry.location);
						_this.map_obj.setZoom(12);
					} else {
						_this.map_obj.fitBounds(place.geometry.viewport);
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
