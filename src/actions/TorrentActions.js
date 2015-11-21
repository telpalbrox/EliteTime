import EliteTorrent from '../lib/EliteTorrent';
import Config from '../constants/Config.js';
import AppDispatcher from '../dispatcher/AppDispatcher.js';
import AppConstants from '../constants/AppConstants.js';

let TorrentActions = {
    getLastTorrents() {
        AppDispatcher.dispatch({
            type: AppConstants.FETCH_LAST_TORRENTS
        });
        return EliteTorrent.getLastDownloads()
            .then(torrents => {
                AppDispatcher.dispatch({
                    type: AppConstants.RECEIVED_LAST_TORRENTS,
                    torrents
                });
            })
            .catch(error => {
                console.error(error);
                AppDispatcher.dispatch({
                    type: AppConstants.ERROR_FETCH_LAST_TORRENTS,
                    error
                });
            });
    },
	getTorrent(id) {
		AppDispatcher.dispatch({
			type: AppConstants.FETCH_TORRENT
		});
		return EliteTorrent.getTorrent(id).then(torrent => {
			AppDispatcher.dispatch({
				type: AppConstants.RECEIVED_TORRENT,
				torrent
			});
		}).catch(error => {
			AppDispatcher.dispatch({
				type: AppConstants.ERROR_FETCH_TORRENT,
				error
			});
		});
	},
	searchTorrent(query, page) {
		AppDispatcher.dispatch({
			type: AppConstants.SEARCH_TORRENTS,
			query
		});
		return EliteTorrent.search(query, page).then(response => {
			AppDispatcher.dispatch({
				type: AppConstants.RECEIVED_SEARCH_TORRENTS,
				query,
				page,
				torrents: response.torrents
			});
		}).catch(error => {
			AppDispatcher.dispatch({
				type: AppConstants.ERROR_SEARCH_TORRENTS,
				error
			});
		});
	}
};

export default TorrentActions;
