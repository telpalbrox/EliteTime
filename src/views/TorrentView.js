'use strict';
let os = require('os');
let Backbone = require('backbone');
let Handlebars = require('handlebars');
let $ = require('jquery');
let peerflix = require('peerflix');
let LastTorrentsView = require('./LastTorrentsView');
module.exports = Backbone.View.extend({
	el: '#elite-time',
	template: Handlebars.compile($('#torrent-view-template').html()),
	initialize(options) {
		this.torrent = options.torrent;
		if(global.engine) {
			engine.destroy();
		}
		global.engine = peerflix(this.torrent.magnet, {
			tmp: os.tmpdir()
		});
		global.engine.server.on('listening', () => {
			if (global.engine) {
				console.log('http://127.0.0.1:' + engine.server.address().port + '/');
				this.renderVideo(engine.server.address().port);
			}
		});
		this.render();
	},
	render() {
		this.$el.html(this.template(this.torrent));
		return this;
	},
	renderVideo(port) {
		var video = document.createElement('video');
		video.id = 'torrent-video';
		video.src = 'http://127.0.0.1:' + port;
		video.autoPlay = true;
		video.controls = true;
		this.$('#player').append(video);
	}
});
