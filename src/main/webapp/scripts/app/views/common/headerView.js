define(['backbone', 'hbs!app/templates/header'], function (Backbone, hbsView) {
	'use strict';
	console.log('[views]header::loading...');

	var HeaderView = Backbone.View.extend({
		initialize: function (options) {
			this.eventBus = options.eventBus;
			this.render();
		},
		render: function () {
			this.$el.html(hbsView({}));
			return this;
		},
	});
	return HeaderView;
});
