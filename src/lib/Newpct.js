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

module.exports = {
	search(query, page) {
		let queryUrl = url + '/index.php';
		return axios.get(queryUrl, {
			params: {
				page: 'buscar',
				q: query,
				pg: page
			}
		}).then((response) => {
			const $ = cheerio.load(response.data);
			const $searchResults = $('.buscar-list li');
			const torrents = [];
			const ids = [];
			$searchResults.each((index, element) => {
				const $element = $(element);
				const torrent = {};
				torrent.name = $element.find('h2 strong').text();
				torrent.url = $element.find('a').eq(0).attr('href');
				const category = $element.find('h2 span:last-of-type').text();
				torrent.category = category.replace(/\[/gi, '').replace(/\]/gi, '').trim();
				if (torrent.url.includes('series')) {
					const urlParts = torrent.url.split('/');
					const tvShowName = urlParts[urlParts.length - 2];
					const titleWords = torrent.name.split(' ');
					const season = titleWords[titleWords.indexOf('Temporada') + 1];
					const episode = titleWords[titleWords.indexOf('Capitulo') + 1];
					const categorySlug = torrent.category.replace(/\s/gi, '-').replace(/\./gi, '-').toLowerCase();
					torrent.url = `${url}${$element.find('h2').text().includes('Español Castellano') ? 'descargar-serie' : 'descargar-serievo'}/${tvShowName}/capitulo-${season}${episode}/${categorySlug}/`
				}
				const id = torrent.url.replace(url, '');
				if (ids.includes(id)) {
					return;
				}
				ids.push(id);
				torrent.id = encodeURIComponent(id);
				torrent.image = $element.find('img').attr('src');
				torrents.push(torrent);
			});
			const total = parseInt($('.page-box h3 strong').text().match(/\((.*?)\)/gi)[0].replace(/\(/gi, '').replace(/\)/gi, '').trim());
			return {
				torrents,
				total
			};
		});
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
