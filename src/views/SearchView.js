'use strict';
let Backbone = require('backbone');
let Handlebars = require('handlebars');
let $ = require('jquery');
let EliteTorrent = require('../lib/EliteTorrent');
let TorrentItemView = require('./TorrentItemView');
module.exports = Backbone.View.extend({
	el: '#elite-time',
	template: Handlebars.compile($('#search-view-template').html()),
	initialize() {
		this.page = 1;
		this.total = 0;
		this.searchQuery = '';
		this.render();
	},
	render() {
		this.$el.html(this.template({
			torrents: this.torrents,
			page: this.page
		}));
		this.$searchQuery = this.$('#search-query');
		this.$searchQuery.val(this.searchQuery);
		return this;
	},
	renderTorrents() {
		this.$torrents = this.$('.last-torrents-list-container');
		for(let torrent of this.torrents) {
			let torrentView = new TorrentItemView(torrent);
			this.$torrents.append(torrentView.render().el);
		}
	},
	searchHandler() {
		this.searchQuery = this.$searchQuery.val();
		this.page = 1;
		if(!this.searchQuery) {
			return false;
		}
		EliteTorrent.search(this.searchQuery, this.page).then(response => {
			this.torrents = response.torrents;
			this.total = response.total;
			this.render();
			this.renderTorrents();
			this.getPaginationElements();
			this.tooglePagination();
		}).catch(err => {
			console.error(err);
		});
		return false;
	},
	getPaginationElements() {
		this.$next = this.$('#next');
		this.$prev = this.$('#prev');
	},
	tooglePagination() {
		this.$next.addClass('disabled');
		this.$prev.addClass('disabled');
		setTimeout(() => {
			if(this.page > 1) {
				this.$prev.removeClass('disabled');
			}
			if(this.total / 48 > this.page) {
				console.log('activo o desactivo?');
				this.$next.removeClass('disabled');
			}
		}, 2500);
	},
	nextPage(event) {
		event.preventDefault();
		if(this.$next.hasClass('disabled')) {
			return;
		}
		this.$prev.removeClass('disabled');
		this.page++;
		EliteTorrent.search(this.searchQuery, this.page).then(response => {
			this.torrents = response.torrents;
			this.total = response.total;
			this.render();
			this.renderTorrents();
			this.getPaginationElements();
			this.tooglePagination();
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}).catch(err => {
			console.error(err);
		});
	},
	prevPage(event) {
		event.preventDefault();
		if(this.$prev.hasClass('disabled')) {
			return;
		}
		this.page--;
		EliteTorrent.search(this.searchQuery, this.page).then(response => {
			this.torrents = response.torrents;
			this.total = response.total;
			this.render();
			this.renderTorrents();
			this.getPaginationElements();
			this.tooglePagination();
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}).catch(err => {
			console.error(err);
		});
	},
	events: {
		'submit #search-form': 'searchHandler',
		'click #next' : 'nextPage',
		'click #prev': 'prevPage'
	}
});
