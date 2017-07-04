import { EventEmitter } from 'events';
import _ from 'lodash';
import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

const torrentsDefaults = {
  torrents: [],
  isFetching: false,
  error: false
};
let torrents = Object.assign({}, torrentsDefaults);

const TorrentsStore = Object.assign({}, EventEmitter.prototype, {
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
