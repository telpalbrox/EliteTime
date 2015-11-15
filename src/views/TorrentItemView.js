'use strict';
let Backbone = require('backbone');
let Handlebars = require('handlebars');
let $ = require('jquery');
let LastTorrentsView = require('./LastTorrentsView');
module.exports = Backbone.View.extend({
	template: Handlebars.compile($('#torrent-template').html()),
	initialize(torrent) {
		this.torrent = torrent;
		this.render();
	},
	render() {
		this.$el.html(this.template(this.torrent));
		return this;
	},
	clickHandler() {
		global.router.navigate(`torrent/${this.torrent.id}`, {trigger: true});
	},
	events: {
		'click .torrent-item': 'clickHandler'
	}
});
