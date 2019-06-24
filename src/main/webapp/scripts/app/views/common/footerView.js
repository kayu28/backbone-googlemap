define(['backbone', 'hbs!app/templates/footer'], function (Backbone, hbsView) {
	'use strict';
	console.log('[views]footer::loading...');

	var FooterView = Backbone.View.extend({
		events: {
			"click button#searchBtn": "search"
		},
		initialize: function (options) {
			this.eventBus = options.eventBus;
			this.render();
		},
		search: function () {
			this.eventBus.trigger('search', $("#searchCriteria").val());
		},
		render: function () {
			this.$el.html(hbsView({}));
			return this;
		},
	});
	return FooterView;
});
