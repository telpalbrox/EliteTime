import { EventEmitter } from 'events';
import _ from 'lodash';
import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

const torrentsDefaults = {
  torrents: [],
  query: null,
  isFetching: false,
  error: false,
  searchDisabled: false,
  page: 0,
  total: 0
};
let torrents = Object.assign({}, torrentsDefaults);

const TorrentStore = Object.assign({}, EventEmitter.prototype, {
  getAll() {
    return torrents;
  },
  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  getTorrent(id) {
    return _.find(torrents.torrents, (torrent) => id === torrent.id);
  },

    /**
     * @param {function} callback
     */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

    /**
     * @param {function} callback
     */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(action => {
  switch (action.type) {
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
    case AppConstants.CLEAN_ALL:
      torrents = Object.assign({}, torrentsDefaults);
      break;
    default:
        // nothing
  }
});

export default TorrentStore;
