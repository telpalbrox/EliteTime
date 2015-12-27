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
            console.error(error);
            AppDispatcher.dispatch({
                type: AppConstants.ERROR_FETCH_TORRENT,
                error
            });
        });
    },
    cleanTorrent() {
        AppDispatcher.dispatch({
            type: AppConstants.CLEAN_TORRENT
        });
    },
    streamReady(url) {
        AppDispatcher.dispatch({
            type: AppConstants.TORRENT_STREAM_READY,
            url
        });
    },
    searchTorrent(query, page) {
        AppDispatcher.dispatch({
            type: AppConstants.SEARCH_TORRENTS,
            query,
            page
        });
        return EliteTorrent.search(query, page).then(response => {
            AppDispatcher.dispatch({
                type: AppConstants.RECEIVED_SEARCH_TORRENTS,
                query,
                page,
                torrents: response.torrents,
                total: response.total
            });
        }).catch(error => {
            console.error(error);
            AppDispatcher.dispatch({
                type: AppConstants.ERROR_SEARCH_TORRENTS,
                error,
                page
            });
        });
    }
};

export default TorrentActions;
