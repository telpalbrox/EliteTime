'use strict';
let Backbone = require('backbone');
let Handlebars = require('handlebars');
let $ = require('jquery');
let TorrentView = require('./TorrentItemView');
module.exports = Backbone.View.extend({
	template: Handlebars.compile($('#last-torrents-template').html()),
	initialize(options) {
		this.torrents = options.torrents;
		this.render();
	},
	render() {
		this.$el.html(this.template(this.torrents));
		this.renderTorrents();
		return this;
	},
	renderTorrents() {
		if(!this.$torrents) {
			this.$torrents = this.$('.last-torrents-list-container');
		}
		for(let torrent of this.torrents) {
			let torrentView = new TorrentView(torrent);
			this.$torrents.append(torrentView.render().el);
		}
	}
});
