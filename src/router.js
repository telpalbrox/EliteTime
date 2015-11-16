'use strict';
let LastTorrentsView = require('./views/LastTorrentsView');
let TorrentView = require('./views/TorrentView');
let EliteTorrent = require('./lib/EliteTorrent');
let SearchView = require('./views/SearchView');
module.exports = Backbone.Router.extend({
	routes: {
		'': 'index',
		'torrent/:id': 'torrent',
		'search': 'search'
	},
	index() {
		EliteTorrent.getLastDownloads().then((torrents) => {
			new LastTorrentsView({
				el: '#elite-time',
				torrents: torrents
			});
		});
	},
	torrent(id) {
		EliteTorrent.getTorrent(id).then((torrent) => {
			new TorrentView({
				el: '#elite-time',
				torrent: torrent
			});
		});
	},
	search() {
		new SearchView({
			el: '#elite-time'
		});
	}
});
