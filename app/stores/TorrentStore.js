import { EventEmitter } from 'events';
import os from 'os';
import peerflix from 'peerflix';
import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';
const torrentDefaults = {
  torrent: {},
  streamUrl: '',
  isFetching: false,
  error: false,
  engine: null,
  loadingStream: false,
  playerError: false
};
let torrent = Object.assign({}, torrentDefaults);

const TorrentStore = Object.assign({}, EventEmitter.prototype, {
  getTorrent() {
    return torrent;
  },
  emitChange() {
    this.emit(CHANGE_EVENT);
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
        playerError: false,
        engine: peerflix(action.torrent.magnet || action.torrent.file, {
          tmp: os.tmpdir(),
          uploads: 1
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
    case AppConstants.CLEAN_ALL:
    case AppConstants.CLEAN_TORRENT:
      if (torrent.engine) {
        torrent.engine.destroy();
      }
      torrent = Object.assign({}, torrentDefaults);
      TorrentStore.emitChange();
      break;
    case AppConstants.OPEN_VIDEO_VLC:
      if (document.getElementById('torrent-video')) {
        document.getElementById('torrent-video').pause();
      }
      TorrentStore.emitChange();
      break;
    case AppConstants.TORRENT_PLAYER_ERROR:
      torrent = Object.assign({}, { playerError: true });
      TorrentStore.emitChange();
      break;
    default:
      // nothing
  }
});

export default TorrentStore;
