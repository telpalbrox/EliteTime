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
	index: function() {
		EliteTorrent.getLastDownloads().then((torrents) => {
			new LastTorrentsView({
				el: '#elite-time',
				torrents: torrents
			});
		});
	},
	torrent: function(id) {
		EliteTorrent.getTorrent(id).then((torrent) => {
			new TorrentView({
				el: '#elite-time',
				torrent: torrent
			});
		});
	},
	search: function() {
		console.log('search');
		new SearchView({
			el: '#elite-time'
		});
	}
});
