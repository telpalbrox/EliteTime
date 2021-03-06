"use strict";
let axios = require("axios");
let cheerio = require("cheerio");
let url = require("../config").url;

module.exports = {
	getLastDownloads() {
		return new Promise((resolve, reject) => {
			axios.get(url).then(response => {
				let $ = cheerio.load(response.data);
				let lastDownloads = $('.miniboxs.miniboxs-ficha li');
				let downloads = [];
				for (let i = 0; i < lastDownloads.length; i++) {
					let download = {};
					let $item = $(lastDownloads[i]);
					let relativeUrl = $item.find('a')[0].attribs.href;
					download.name = $item.find('a.nombre').text();
					download.url = url + relativeUrl;
					download.id = relativeUrl.split('/')[2];
					download.image = url + '/' + $item.find('img')[0].attribs.src;
					download.category = $item.find('span.categoria').text();
					downloads.push(download);
				}
				resolve(downloads);
			}).catch(err => {
				reject(err);
			});
		});
	},
	getTorrent(id) {
		return new Promise((resolve, reject) => {
			axios.get(url + '/torrent/' + id + '/').then(response => {
				let $ = cheerio.load(response.data);
				let $boxCard = $('#box-ficha');
				let torrent = {};
				torrent.title = $boxCard.find('h2').text();
				torrent.image = url + '/' + $boxCard.find('img.imagen_ficha').attr('src');
				torrent.description = $boxCard.find('.descrip').eq(1).text();
				torrent.size = $boxCard.find('dt').filter((index, element) => $(element).text() === 'Tamaño').next().text();
				torrent.category = $boxCard.find('dt').filter((index, element) => $(element).text() === 'Categoria').next().text();
				let torrentUrls = $('a.enlace_torrent');
				torrent.url = url + torrentUrls.get(1).attribs.href;
				torrent.magnet = torrentUrls.get(2).attribs.href;
				resolve(torrent);
			}).catch(err => {
				reject(err);
			});
		});
	},
	search(query, page) {
		return new Promise((resolve, reject) => {
			let queryUrl = url + '/resultados/' + query;
			if (page) {
				queryUrl += '/pag:' + page;
			}
			axios.get(queryUrl).then(response => {
				let $ = cheerio.load(response.data);
				let searchResults = $('.miniboxs.miniboxs-ficha li');
				let totalAux = $('.box-seccion .nav h3').text().split('(total ')[1];
				let total = parseInt(totalAux.slice(0, totalAux.length - 1));
				let downloads = [];
				for (let i = 0; i < searchResults.length; i++) {
					let result = {};
					let $item = $(searchResults[i]);
					let relativeUrl = $item.find('a')[0].attribs.href;
					result.name = $item.find('a.nombre').text();
					result.url = url + relativeUrl;
					result.id = relativeUrl.split('/')[2];
					result.image = url + '/' + $item.find('img')[0].attribs.src;
					result.category = $item.find('span.categoria').text();
					downloads.push(result);
				}
				resolve({
					torrents: downloads,
					total: total
				});
			}).catch(err => {
				reject(err);
			});
		});
	}
};
