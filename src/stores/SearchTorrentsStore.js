import { EventEmitter } from 'events';
import AppConstants from '../constants/AppConstants.js';
import Config from '../constants/Config.js';
import AppDispatcher from '../dispatcher/AppDispatcher.js';

let CHANGE_EVENT = 'change';
let torrents = {
    torrents: [],
    query: '',
    isFetching: false,
    error: false,
    searchDisabled: false,
    page: 0,
    total: 0
};

let TorrentStore = Object.assign({}, EventEmitter.prototype, {
    getAll() {
        return torrents;
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
        case AppConstants.SEARCH_TORRENTS:
            torrents = Object.assign({}, torrents, {
                isFetching: true
            });
            TorrentStore.emitChange();
            break;
        case AppConstants.RECEIVED_SEARCH_TORRENTS:
            torrents = Object.assign({}, torrents, {
                error: false,
                isFetching: false,
                searchDisabled: true,
                torrents: action.torrents,
                page: action.page,
                query: action.query,
                total: action.total
            });
            TorrentStore.emitChange();
            break;
        case AppConstants.ERROR_SEARCH_TORRENTS:
            torrents = Object.assign({}, torrents, {
                error: true,
                isFetching: false
            });
            TorrentStore.emitChange();
            break;
        case AppConstants.API_TIMEOUT:
            torrents = Object.assign({}, torrents, {
                searchDisabled: false
            });
            TorrentStore.emitChange();
            break;
        default:
        // nothing
    }
});

export default TorrentStore;
