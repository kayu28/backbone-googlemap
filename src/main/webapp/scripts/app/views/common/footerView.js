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
			"click #customerBtn": "changeCustomerMode",
			"click #meetingAreaBtn": "changeMeetingAreaMode",
			"click #doctorBtn": "changeDoctorMode"
		},
		initialize: function (options) {
			console.log('[views]footer::initialize...');
			this.render();
			this.eventBus = options.eventBus;
			this.initSearchCriteria();
		},
		initSearchCriteria: function () {
			this.eventBus.trigger('initSearchCriteria', this.model);
		},
		changeCustomerMode: function () {
			console.log('[views]footer::changeCustomerMode...');
			this.model.changeCustomerMode();
			this.initSearchCriteria();
		},
		changeMeetingAreaMode: function () {
			console.log('[views]footer::changeMeetingAreaMode...');
			this.model.changeMeetingAreaMode();
			this.initSearchCriteria();
		},
		changeDoctorMode: function () {
			console.log('[views]footer::changeDoctorMode...');
			this.model.changeDoctorMode();
			this.initSearchCriteria();
		},
		render: function () {
			console.log('[views]footer::render...');
			this.$el.html(hbsView(this.model.toJSON()));
			return this;
		},
	});
	return FooterView;
});
