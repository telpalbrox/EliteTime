'use strict';
let Backbone = require('backbone');
let Handlebars = require('handlebars');
let $ = require('jquery');
let LastTorrentsView = require('./LastTorrentsView');
let EliteTorrent = require('../lib/EliteTorrent');
module.exports = Backbone.View.extend({
	el: '#elite-time',
	template: Handlebars.compile($('#app-template').html()),
	initialize() {
		this.render();

	},
	render() {
		this.$el.html(this.template());
		return this;
	}
});
