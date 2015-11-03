"use strict";
let axios = require("axios");
let cheerio = require("cheerio");
let url = require("../config.js").url;

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
					download.image = url + $item.find('img')[0].attribs.src;
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
				torrent.description = $boxCard.find('.descrip').get(1).children[0].data;
				torrent.size = $boxCard.find('dd').get(3).children[0].data;
				torrent.category = $boxCard.find('dd').get(1).children[0].data;
				let torrentUrls = $('a.enlace_torrent.degradado1');
				torrent.url = url + torrentUrls.get(0).attribs.href;
				torrent.magnet = torrentUrls.get(1).attribs.href;
				resolve(torrent);
			}).catch(err => {
				reject(err);
			});
		});
	},
	search(query, page) {
		return new Promise((resolve, reject) => {
			let queryUrl = url + '/busqueda/' + query;
			if (page) {
				queryUrl += '/pag:' + page;
			}
			axios.get(queryUrl).then(response => {
				let $ = cheerio.load(response.data);
				let searchResults = $('.miniboxs.miniboxs-ficha li');
				let downloads = [];
				for (let i = 0; i < searchResults.length; i++) {
					let result = {};
					let $item = $(searchResults[i]);
					let relativeUrl = $item.find('a')[0].attribs.href;
					result.name = $item.find('a.nombre').text();
					result.url = url + relativeUrl;
					result.id = relativeUrl.split('/')[2];
					result.image = url + $item.find('img')[0].attribs.src;
					result.category = $item.find('span.categoria').text();
					downloads.push(result);
				}
				resolve(downloads);
			}).catch(err => {
				reject(err);
			});
		});
	}
};
