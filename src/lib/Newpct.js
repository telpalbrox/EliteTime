"use strict";
let axios = require("axios");
let cheerio = require("cheerio");
let url = require("../config").newpct;
const vm = require('vm');
const _ = require('lodash');

function runNewpctScript(code) {
	const fake$ = () => {
		return {
			ready: _.noop,
			load: _.noop,
			scroll: _.noop
		};
	};
	const sandbox = vm.createContext({
		$: fake$,
		document: Object.create(null),
		window: Object.create(null),
		setInterval: _.noop
	});
	vm.runInNewContext(code, sandbox, { filename: 'newpctscript.js' });
	return sandbox;
}

async function getTVShowEpisodeTorrentUrl(tvShowUrl, season, episode, page = 1) {
	const response = await axios.get(`${tvShowUrl}/pg/${page}`);
	const $ = cheerio.load(response.data);
	const $episodeList = $('.buscar-list li');
	if (!$episodeList.length) {
		return null;
	}
	const $result = $episodeList.filter((index, episodeElement) => {
		const $episode = $(episodeElement);
		return $episode.find('h2').text().includes(`Temporada ${season} Capitulo ${episode}`);
	});
	if ($result.length) {
		return $result.eq(0).find('a').eq(0).attr('href');
	}
	return getTVShowEpisodeTorrentUrl(tvShowUrl, season, episode, ++page);
}

module.exports = {
	async search(query, page) {
		let queryUrl = url + '/index.php';
		const response = await axios.get(queryUrl, {
			params: {
				page: 'buscar',
				q: query,
				pg: page
			}
		});
		const $ = cheerio.load(response.data);
			const $searchResults = $('.buscar-list li');
			const torrents = [];
			const ids = [];
			for (let i = 0; i < $searchResults.length; i++) {
				const $element = $searchResults.eq(i);
				const torrent = {};
				torrent.url = $element.find('a').eq(0).attr('href');
				if (torrent.url.includes('series')) {
					torrent.name = $element.find('h2 strong').text();
					const category = $element.find('h2 span:last-of-type').text();
					torrent.category = category.replace(/\[/gi, '').replace(/\]/gi, '').trim();
					const titleWords = torrent.name.split(' ');
					const season = titleWords[titleWords.indexOf('Temporada') + 1];
					const episode = titleWords[titleWords.indexOf('Capitulo') + 1];
					torrent.url = await getTVShowEpisodeTorrentUrl(torrent.url, season, episode);
					if (!torrent.url) {
						continue;
					}
				} else {
					torrent.name = $element.find('h2').text();
				}
				const id = torrent.url.replace(url, '');
				if (ids.includes(id)) {
					continue;
				}
				ids.push(id);
				torrent.id = encodeURIComponent(id);
				torrent.image = $element.find('img').attr('src');
				torrents.push(torrent);
			}
			const total = parseInt($('.page-box h3 strong').text().match(/\((.*?)\)/gi)[0].replace(/\(/gi, '').replace(/\)/gi, '').trim());
			return {
				torrents,
				total
			};
	},
	getTorrent(id) {
		return axios.get(`${url}${decodeURIComponent(id)}`).then((response) => {
			let $ = cheerio.load(response.data);
			let torrent = {};
			torrent.title = $('.page-box h1 strong').text().trim();
			torrent.image = $('.entry-left img').eq(0).attr('src');
			torrent.description = $('.descripcion_top').text();
			torrent.category = $('.page-box h1').text().match(/\[(.*?)\]/gi)[0].replace(/\[/gi, '').replace(/\]/gi, '');
			torrent.url = $('.f2-tab2 a').attr('href');
			return torrent;
		});
	},
	getLastDownloads() {
		return axios.get(url).then((response) => {
			let $ = cheerio.load(response.data);
			const script = $('script[src="http://www.newpct1.com/pct1/library/content/template/js/custom.js"]').next();
			const scriptVariables = runNewpctScript(script.html());
			const downloadProperties = ['id', 'url', 'image', 'name', 'category', 'cta'];
			const arrays = ['arrayMODPC', 'arrayMODEC', 'arrayMODOP', 'arrayMODSE', 'arrayMODx264', 'arrayMODSH', 'arrayMODSVO', 'arrayMODPH', 'arrayMODP3D', 'arrayMODPL', 'arrayMODV'];
			const downloads = [];

			arrays.forEach((array) => {
				scriptVariables[array].forEach((rawDownload) => {
					const download = {};
					rawDownload.forEach((property, index) => {
						download[downloadProperties[index]] = property.trim();
					});
					download.id = encodeURIComponent(download.url.replace(url, ''));
					downloads.push(download);
				});
			});

			return downloads;
		});
	}
};
