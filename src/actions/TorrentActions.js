import EliteTorrent from '../lib/EliteTorrent';
import Newpct from '../lib/Newpct';
import AppDispatcher from '../dispatcher/AppDispatcher.js';
import AppConstants from '../constants/AppConstants.js';
import SearchTorrentsStore from '../stores/SearchTorrentsStore';
import TorrentsStore from '../stores/TorrentsStore';
const request = require('request');
const os = require('os');
const fs = require('fs');
import { exec } from 'child_process';

const PROVIDERS = {
	EliteTorrent,
	Newpct
};

function getProvider() {
	return PROVIDERS[window.localStorage.getItem('provider')];
}

function getProviderName() {
	return window.localStorage.getItem('provider');
}

let TorrentActions = {
    getLastTorrents() {
        AppDispatcher.dispatch({
            type: AppConstants.FETCH_LAST_TORRENTS
        });
        return getProvider().getLastDownloads()
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
		const cachedTorrent = SearchTorrentsStore.getTorrent(id) || TorrentsStore.getTorrent(id);
		if(getProviderName() === 'Newpct' && cachedTorrent) {
			return Newpct.getTorrent(cachedTorrent.url).then(torrent => {
				const filePath = `${os.tmpdir()}/tmp.torrent`;
				const writeStream = fs.createWriteStream(filePath);
				request(torrent.url).pipe(writeStream);
				writeStream.on('close', () => {
					fs.readFile(filePath, (err, data) => {
						if(err) {
							console.error(error);
							return AppDispatcher.dispatch({
								type: AppConstants.ERROR_FETCH_TORRENT,
								error
							});
						}
						torrent.file = data;
						AppDispatcher.dispatch({
							type: AppConstants.RECEIVED_TORRENT,
							torrent
						});
					});
				});
				writeStream.on('error', (error) => {
					console.error(error);
					return AppDispatcher.dispatch({
						type: AppConstants.ERROR_FETCH_TORRENT,
						error
					});
				});
			});
		}
        return getProvider().getTorrent(id).then(torrent => {
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
        return getProvider().search(query, page).then(response => {
            AppDispatcher.dispatch({
                type: AppConstants.RECEIVED_SEARCH_TORRENTS,
                query,
                page,
                torrents: response.torrents,
                total: response.total
            });
            setTimeout(() => AppDispatcher.dispatch({
                type: AppConstants.API_TIMEOUT
            }), 2000);
        }).catch(error => {
            console.error(error);
            AppDispatcher.dispatch({
                type: AppConstants.ERROR_SEARCH_TORRENTS,
                error,
                page
            });
        });
    },
	cleanAll() {
		AppDispatcher.dispatch({
			type: AppConstants.CLEAN_ALL
		});
	},
	openVideoVlc(streamUrl) {
		if(!streamUrl) {
			return;
		}

		let command = '';
		switch(process.platform) {
			case 'darwin':
				command = '/Applications/VLC.app/Contents/MacOS/VLC';
				break;
			case 'linux':
				command = 'vlc';
				break;
            case 'win32':
				if(fs.existsSync("C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe")) {
					command = `"C:\\Program Files\\VideoLAN\\VLC\\vlc"`;
				} else if(fs.existsSync("C:\\Program Files\\VideoLAN\\VLC\\vlc.exe")) {
					command = `"C:\\Program Files\\VideoLAN\\VLC\\vlc"`;
				} else {
					return console.error('VLC not found in your Windows installation');
				}
                break;
			default:
				return console.error('Cannot open VLC: Operative System not supported');
		}

		exec(`${command} "${streamUrl}"`, (err) => {
			if(err) {
				console.error(err);
			}
		});

		AppDispatcher.dispatch({
			type: AppConstants.OPEN_VIDEO_VLC
		});
	}
};

export default TorrentActions;
