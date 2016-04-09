import { EventEmitter } from 'events';
import os from 'os'
import peerflix from 'peerflix';
import AppConstants from '../constants/AppConstants.js';
import Config from '../constants/Config.js';
import AppDispatcher from '../dispatcher/AppDispatcher.js';

let CHANGE_EVENT = 'change';
let torrentDefaults = {
	torrent: {},
	streamUrl: '',
	isFetching: false,
	error: false,
	engine: null,
	loadingStream: false
};
let torrent = Object.assign({}, torrentDefaults);

let TorrentStore = Object.assign({}, EventEmitter.prototype, {
    getTorrent() {
        return torrent;
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(action => {
    switch(action.type) {
        case AppConstants.FETCH_TORRENT:
            torrent = Object.assign({}, torrent, {
                isFetching: true
            });
            TorrentStore.emitChange();
            break;
        case AppConstants.RECEIVED_TORRENT:
            torrent = Object.assign({}, torrent, {
                error: false,
                isFetching: false,
                torrent: action.torrent,
				loadingStream: true,
				engine: peerflix(action.torrent.magnet, {
					tmp: os.tmpdir()
				})
            });
            TorrentStore.emitChange();
            break;
        case AppConstants.ERROR_FETCH_TORRENT:
            torrent = Object.assign({}, torrent, {
                error: true,
				isFetching: false
            });
            TorrentStore.emitChange();
            break;
		case AppConstants.TORRENT_STREAM_READY:
			torrent = Object.assign({}, torrent, {
				loadingStream: false,
				streamUrl: action.url
			});
			TorrentStore.emitChange();
			break;
		case AppConstants.CLEAN_TORRENT:
			if(torrent.engine) {
				torrent.engine.destroy();
			}
			torrent = Object.assign({}, torrentDefaults);
			TorrentStore.emitChange();
			break;
        default:
            // nothing
    }
});

export default TorrentStore;
