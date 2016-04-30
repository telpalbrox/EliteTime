import { EventEmitter } from 'events';
import _ from 'lodash';
import AppConstants from '../constants/AppConstants.js';
import AppDispatcher from '../dispatcher/AppDispatcher.js';

let CHANGE_EVENT = 'change';

let torrentsDefaults = {
	torrents: [],
	isFetching: false,
	error: false
};
let torrents = Object.assign({}, torrentsDefaults);

let TorrentsStore = Object.assign({}, EventEmitter.prototype, {
    getAll() {
        return torrents;
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

	getTorrent(id) {
		return _.find(torrents.torrents, (torrent) => {
			return id == torrent.id;
		});
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
        case AppConstants.FETCH_LAST_TORRENTS:
            torrents = Object.assign({}, torrents, {
                isFetching: true
            });
            TorrentsStore.emitChange();
            break;
        case AppConstants.RECEIVED_LAST_TORRENTS:
            torrents = Object.assign({}, torrents, {
                error: false,
                isFetching: false,
                torrents: action.torrents
            });
            TorrentsStore.emitChange();
            break;
        case AppConstants.ERROR_FETCH_LAST_TORRENTS:
            torrents = Object.assign({}, torrents, {
                error: true,
				isFetching: false
            });
            TorrentsStore.emitChange();
            break;
		case AppConstants.CLEAN_ALL:
			torrents = Object.assign({}, torrentsDefaults);
			TorrentsStore.emitChange();
			break;
        default:
            // nothing
    }
});

export default TorrentsStore;
