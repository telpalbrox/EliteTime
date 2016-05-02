"use strict";
let axios = require("axios");
let cheerio = require("cheerio");
let url = require("../config").newpct;

module.exports = {
	search(query) {
		return new Promise((resolve, reject) => {
			let queryUrl = url + '/buscar-descargas/';
			var data = new FormData();
			data.append('q', query);
			fetch(queryUrl, {
				method: "POST",
				body: data
			}).then(res => res.text()).then(response => {
				let $ = cheerio.load(response);
				const searchResults = $('#categoryTable').find('tbody tr a');
				let downloads = [];
				for(let i = 0; i < searchResults.length; i++) {
					let result = {};
					let $item = $(searchResults[i]);
					result.id = i;
					result.url = $item[0].attribs.href;
					result.name = $item.text().trim();
					downloads.push(result);
				}
				resolve({
					torrents: downloads,
					total: downloads.length
				});
			}).catch(err => {
				reject(err);
			});
		});
	},
	getTorrent(url) {
		return axios.get(url).then((response) => {
			let $ = cheerio.load(response.data);
			let torrent = {};
			const $ficha = $('#right_ficha');
			torrent.title = `${$ficha.find('h2.title a').text().trim()} ${$ficha.find('h3.subtitle').text().trim()}`;
			torrent.image = $('#left_ficha').find('.img-ficha').attr('src');
			torrent.description = $ficha.find('.sinopsis').text();
			torrent.category = 'Desconocida';
			const id = $('.external-url').attr('href').split('torrents/')[1].split('.torrent')[0];
			torrent.url = `http://www.newpct.com/torrents/${id}.torrent`;
			return torrent;
		});
	},
	getLastDownloads() {
		return axios.get(url).then((response) => {
			let $ = cheerio.load(response.data);
			let lastDownloads = $('.contentCategoryIndex .categoriesContentBody ul li a');
			let downloads = [];
			for (let i = 0; i < lastDownloads.length; i++) {
				let download = {};
				let $item = $(lastDownloads[i]);
				download.name = $item.find('[itemprop=name]').text();
				download.url = $item.attr('href');
				download.id = i;
				download.image = $item.find('[itemprop=image]').attr('src');
				download.category = $item.find('[itemprop=genre]').text();
				downloads.push(download);
			}
			return downloads;
		});
	}
};
