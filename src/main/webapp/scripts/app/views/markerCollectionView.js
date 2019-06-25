define([
	'backbone',
	'app/views/meetingMarkerView',
	'hbs!app/templates/markerCollection'
], function (Backbone, MeetingMarkerView, hbsView) {
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
			_.bindAll(this, 'addItemView', 'reset');
			this.map || (this.map = this.options.map);
			this.bounds = new google.maps.LatLngBounds();

			this.listenTo(this.collection, "add", this.addItemView);
			this.on('reset', this.reset, this);
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
			this.$el.html(hbsView({ locationList: this.collection.toJSON() }));
			document.getElementById("myNav").style.width = "100%";
		},
		showDetail: function (event) {
			console.log('[views]markerList::showDetail...');
			document.getElementById("myNav").style.width = "0%";
			var id = $(event.currentTarget).attr("id");
			var item = this.collection.filter(function (model) {
				return model.get('place_id') === id;
			});
			this.map.panTo(item[0].getLatLng());
		},
		reset: function (newCollection, map) {
			console.log('[views]markerList::reset...');
			_.each(_.clone(this.collection.models), function (model) {
				model.destroy();
			});
			this.collection.reset();
			this.collection = newCollection;
			this.map = map;
		},
		addItemView: function (item) {
			console.log('[views]markerList::addItemView...');
			var markerView = new MeetingMarkerView({
				model: item,
				map: this.map
			});
			markerView.render();
			// this.bounds.extend(item.get('location'));
		},
		render: function () {
			console.log('[views]markerList::render...');
			this.collection.each(this.addItemView);
			console.log(this.collection.toJSON());
			// this.map.fitBounds(this.bounds);
			this.$el.html(hbsView({}));

			return this;
		},
	});
	return MarkerCollectionView;
});
