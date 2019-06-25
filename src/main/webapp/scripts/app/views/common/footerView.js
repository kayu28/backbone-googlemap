define([
	'backbone',
	'app/models/searchCriteria',
	'hbs!app/templates/footer'
], function (Backbone, SearchCriteria, hbsView) {
	'use strict';
	console.log('[views]footer::loading...');

	var FooterView = Backbone.View.extend({
		model: SearchCriteria,
		events: {
			"click button#searchBtn": "search",
			"click #customerBtn": "changeCustomerMode",
			"click #meetingAreaBtn": "changeMeetingAreaMode",
			"click #doctorBtn": "changeDoctorMode"
		},
		initialize: function (options) {
			console.log('[views]footer::initialize...');
			this.eventBus = options.eventBus;
			this.render();
		},
		search: function () {
			console.log('[views]footer::initialize...');
			this.eventBus.trigger('search', $("#searchCriteria").val());
		},
		changeCustomerMode: function () {
			console.log('[views]footer::changeCustomerMode...');
			this.model.changeCustomerMode();
		},
		changeMeetingAreaMode: function () {
			console.log('[views]footer::changeMeetingAreaMode...');
			this.model.changeMeetingAreaMode();
		},
		changeDoctorMode: function () {
			console.log('[views]footer::changeDoctorMode...');
			this.model.changeDoctorMode();
		},
		render: function () {
			console.log('[views]footer::render...');
			this.$el.html(hbsView(this.model.toJSON()));
			return this;
		},
	});
	return FooterView;
});
