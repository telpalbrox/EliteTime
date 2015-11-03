'use strict';
let axios = require('axios');
let peerflix = require('peerflix');
let os = require('os');
let EliteTorrent = require('./lib/EliteTorrent.js');
let engine, torrentListContainer, loadingContainer, playerContainer, paginationContainer;
let page = 0;
let nextPage, prevPage, searchQuery;

document.body.onload = function() {
	torrentListContainer = document.querySelector('#torrent-list-container');
	let torrentSearchForm = document.querySelector('#search-torrent');
	let torrentTitleInput = document.querySelector('#torrent-form-title');
	loadingContainer = document.querySelector('#loading');
	loadingContainer.style.display = 'none';
	playerContainer = document.querySelector('#player');
	paginationContainer = document.querySelector('#pagination-container');
	nextPage = document.querySelector('#next-page');
	prevPage = document.querySelector('#prev-page');
	nextPage.addEventListener('click', nextPageHandler);
	prevPage.addEventListener('click', prevPageHandler);
	torrentSearchForm.addEventListener('submit', (event) => {
		event.preventDefault();
		if(!torrentTitleInput.value) {
			createLastDownloads();
			return false;
		}
		paginationContainer.style.display = 'block';
		searchQuery = torrentTitleInput.value;
		page = 1;
		prevPage.disabled = true;
		EliteTorrent.search(torrentTitleInput.value, page).then((downloads => {
			tooglePagination();
			createTorrentResults(downloads);
		}));
		return false;
	});

	createLastDownloads();
};

function createTorrentResults(downloads) {
	torrentListContainer.removeChild(document.querySelector('#torrent-list'));
	if(!downloads.length) {
		let notResultsElement = document.createElement('h1');
		notResultsElement.appendChild(document.createTextNode('No hay resultados'));
		notResultsElement.id = 'torrent-list';
		return torrentListContainer.appendChild(notResultsElement);
	}
	torrentListContainer.appendChild(createTorrentList(downloads));
}

function createLastDownloads() {
	page = 0;
	paginationContainer.style.display = 'none';
	let torrentListElement = document.querySelector('#torrent-list');
	if(torrentListElement) {
		torrentListContainer.removeChild(torrentListElement);
	}
	EliteTorrent.getLastDownloads().then(downloads => {
		torrentListContainer.appendChild(createTorrentList(downloads));
	}).catch(err => {
		console.error(err);
	});
}

function createTorrentList(torrents) {
	let torrentList = document.createElement('ul');
	torrentList.id = 'torrent-list';
	for (let torrent of torrents) {
		torrentList.appendChild(createTorrentListItem(torrent));
	}
	return torrentList;
}

function createTorrentListItem(torrent) {
	let torrentElement = document.createElement('li');
	let link = document.createElement('a');
	link.setAttribute('href', '#');
	link.innerHTML = torrent.name;
	link.addEventListener('click', torrentClickHandler(torrent.id));
	torrentElement.appendChild(link);
	return torrentElement;
}

function torrentClickHandler(id) {
	return function torrentClick() {
		loadingContainer.style.display = 'block';
		EliteTorrent.getTorrent(id).then(torrent => {
			if(engine) {
				engine.destroy();
			}
			if(playerContainer.childNodes[0]) {
				playerContainer.removeChild(playerContainer.childNodes[0]);
			}

			engine = peerflix(torrent.magnet, {
				tmp: os.tmpdir()
			});

			engine.server.on('listening', function () {
				loadingContainer.style.display = 'none';
				if (engine) {
					console.log('http://127.0.0.1:' + engine.server.address().port + '/');
					var video = document.createElement('video');
					video.id = 'torrent-video';
					video.src = 'http://127.0.0.1:' + engine.server.address().port;
					video.autoPlay = true;
					video.controls = true;
					document.querySelector('#player').appendChild(video);
				}
			});
		}).catch(err => {
			console.error(err);
		});
	};
}

function nextPageHandler() {
	tooglePagination();
	prevPage.disabled = false;
	page++;
	EliteTorrent.search(searchQuery, page).then((downloads => {
		createTorrentResults(downloads);
	}));
	console.log(page);
}

function prevPageHandler() {
	tooglePagination();
	if(page < 1) {
		prevPage.disabled = true;
		return;
	}
	page--;
	EliteTorrent.search(searchQuery, page).then((downloads => {
		createTorrentResults(downloads);
	}));
	console.log(page);
}

function tooglePagination() {
	prevPage.disabled = true;
	nextPage.disabled = true;
	setTimeout(() => {
		prevPage.disabled = page < 1;
		nextPage.disabled = false;
	}, 2500);
}
