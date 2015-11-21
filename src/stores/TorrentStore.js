import { EventEmitter } from 'events';
import AppConstants from '../constants/AppConstants.js';
import Config from '../constants/Config.js';
import AppDispatcher from '../dispatcher/AppDispatcher.js';

let CHANGE_EVENT = 'change';
let torrent = {
    torrent: {},
    isFetching: false,
    error: false
};

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
                torrent: action.torrent
            });
            TorrentStore.emitChange();
            break;
        case AppConstants.ERROR_FETCH_TORRENT:
            torrent = Object.assign({}, torrent, {
                error: true
            });
            TorrentStore.emitChange();
            break;
        default:
            // nothing
    }
});

export default TorrentStore;
