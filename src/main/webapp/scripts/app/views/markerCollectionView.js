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
				_.bindAll(this, 'addMeetingMarkerView', 'addCustomerMarkerView', 'resetMeetingLocation');

				this.map_obj || (this.map_obj = this.options.map_obj);
				this.bounds = new google.maps.LatLngBounds();
				this.meetingCollection = this.options.meetingCollection;
				this.customerCollection = this.options.customerCollection;
				this.locationList = [];

				// this.listenTo(this.meetingCollection, "add", this.addMeetingMarkerView);
				this.meetingCollection.on("add", this.addMeetingMarkerView, this);
				this.on('resetMeetingLocation', this.resetMeetingLocation, this);
				this.on('resetCustomerLocation', this.resetCustomerLocation, this);

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
				// TODO sort
				// イチイチここで詰め替えしたくない
				var _this = this;
				this.meetingCollection.each(function (lacation) {
					_this.locationList.push(lacation);
				});
				this.$el.html(hbsView({ locationList: this.meetingCollection.toJSON() }));
				document.getElementById("myNav").style.width = "100%";
			},
			showDetail: function (event) {
				console.log('[views]markerList::showDetail...');
				document.getElementById("myNav").style.width = "0%";
				var id = $(event.currentTarget).attr("id");
				var item = this.meetingCollection.filter(function (model) {
					return model.get('place_id') === id;
				});
				this.map_obj.panTo(item[0].getLatLng());
			},
			resetMeetingLocation: function (newCollection, map_obj) {
				console.log('[views]markerList::resetMeetingLocation...');
				if (this.meetingCollection) {
					_.each(_.clone(this.meetingCollection.models), function (model) {
						// TODO meetingCollection only...
						model.destroy();
					});
					this.meetingCollection.reset();
				}
				this.meetingCollection = newCollection;
				this.map_obj = map_obj;
			},
			resetCustomerLocation: function (newCollection, map_obj) {
				console.log('[views]markerList::resetCustomerLocation...');
				if (this.customerCollection) {
					_.each(_.clone(this.customerCollection.models), function (model) {
						model.destroy();
					});
					this.customerCollection.reset();
				}
				this.customerCollection = newCollection;
				this.map_obj = map_obj;
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
			render: function () {
				console.log('[views]markerList::render...');
				if (this.meetingCollection) this.meetingCollection.each(this.addMeetingMarkerView);
				if (this.customerCollection) this.customerCollection.each(this.addCustomerMarkerView);
				// this.map.fitBounds(this.bounds);
				this.$el.html(hbsView({}));

				return this;
			},
		});
		return MarkerCollectionView;
	});
