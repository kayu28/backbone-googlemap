define([
	'backbone',
	'app/views/meetingMarkerView',
	'app/views/customerMarkerView',
	'app/views/doctorMarkerView',
	'hbs!app/templates/markerCollection'
], function (
	Backbone,
	MeetingMarkerView,
	CustomerMarkerView,
	DoctorMarkerView,
	hbsView) {
		'use strict';

		var MarkerCollectionView = Backbone.View.extend({
			events: {
				"click button#searchBtn": "search",
				"click #closeNav": "closeNav",
				"click .detail": "showDetail"
			},
			constructor: function (options) {
				console.log('[views]markerList::initialize...');
				Backbone.View.prototype.constructor.apply(this, arguments);
				this.options = options;
				this.eventBus = options.eventBus;
				_.bindAll(
					this,
					'addMeetingMarkerView',
					'addCustomerMarkerView',
					'addDoctorMarkerView',
					'resetCollectionView',
				);

				this.map_obj || (this.map_obj = this.options.map_obj);
				this.bounds = new google.maps.LatLngBounds();
				this.meetingCollection = this.options.meetingCollection;
				this.customerCollection = this.options.customerCollection;
				this.doctorCollection = this.options.doctorCollection;
				this.locationList = [];

				// this.listenTo(this.meetingCollection, "add", this.addMeetingMarkerView);
				// this.meetingCollection.on("add", this.addMeetingMarkerView, this);
				this.on('resetCollectionView', this.resetCollectionView, this);

				this.eventBus.on('list', this.openNav, this);
			},
			search: function () {
				console.log('[views]markerList::search...');
				this.eventBus.trigger('searchList', $('#searchCriteria').val());
				document.getElementById("myNav").style.width = "0%";
			},
			closeNav: function () {
				console.log('[views]markerList::closeNav...');
				document.getElementById("myNav").style.width = "0%";
			},
			openNav: function () {
				console.log('[views]markerList::openNav...');
				this.$el.html(hbsView({ locationList: this.attributesList }));
				document.getElementById("myNav").style.width = "100%";
			},
			showDetail: function (event) {
				console.log('[views]markerList::showDetail...');
				document.getElementById("myNav").style.width = "0%";
				var id = $(event.currentTarget).attr("id");
				var item = this.locationList.filter(function (model) {
					return model.get('place_id') === id;
				});
				this.map_obj.panTo(item[0].getLatLng());
			},
			resetCollectionView: function (params) {
				console.log('[views]markerList::resetCollectionView...');
				if (this.meetingCollection) {
					_.each(_.clone(this.meetingCollection.models), function (model) {
						// TODO meetingCollection only...
						model.destroy();
					});
					this.meetingCollection.reset();
				}
				if (this.customerCollection) {
					_.each(_.clone(this.customerCollection.models), function (model) {
						model.destroy();
					});
					this.customerCollection.reset();
				}
				if (this.doctorCollection) {
					_.each(_.clone(this.doctorCollection.models), function (model) {
						model.destroy();
					});
					this.doctorCollection.reset();
				}
				this.meetingCollection = params.meetingLocationCollection;
				this.customerCollection = params.customerLocationCollection;
				this.doctorCollection = params.doctorLocationCollection;
				this.map_obj = params.map_obj;
			},
			addMeetingMarkerView: function (item) {
				console.log('[views]markerList::addMeetingMarkerView...');
				console.log(item.toJSON());
				var markerView = new MeetingMarkerView({
					model: item,
					map_obj: this.map_obj
				});
				markerView.render();
				// this.bounds.extend(item.get('location'));
			},
			addCustomerMarkerView: function (item) {
				console.log('[views]markerList::addCustomerMarkerView...');
				console.log(item.toJSON());
				var markerView = new CustomerMarkerView({
					model: item,
					map_obj: this.map_obj
				});
				markerView.render();
			},
			addDoctorMarkerView: function (item) {
				console.log('[views]markerList::addDoctorMarkerView...');
				console.log(item.toJSON());
				var markerView = new DoctorMarkerView({
					model: item,
					map_obj: this.map_obj
				});
				markerView.render();
			},
			sort: function () {
				console.log('[views]markerList::sort...');
				var _this = this;
				_this.locationList.length = 0
				if (this.meetingCollection) {
					this.meetingCollection.each(function (lacation) {
						_this.locationList.push(lacation);
					});
				}
				if (this.customerCollection) {
					this.customerCollection.each(function (lacation) {
						_this.locationList.push(lacation);
					});
				}
				if (this.doctorCollection) {
					this.doctorCollection.each(function (lacation) {
						_this.locationList.push(lacation);
					});
				}

				var center = this.map_obj.getCenter();
				_this.locationList.sort(function (a, b) {
					return a.getDistance(center) - b.getDistance(center);
				});
				this.attributesList = _this.locationList.map(function (a) { return a.attributes; });
			},
			render: function () {
				console.log('[views]markerList::render...');
				if (this.meetingCollection) this.meetingCollection.each(this.addMeetingMarkerView);
				if (this.customerCollection) this.customerCollection.each(this.addCustomerMarkerView);
				if (this.doctorCollection) this.doctorCollection.each(this.addDoctorMarkerView);
				this.sort();

				// this.map.fitBounds(this.bounds);
				this.$el.html(hbsView({}));

				return this;
			},
		});
		return MarkerCollectionView;
	});
