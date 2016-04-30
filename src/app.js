'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import MainPage from './components/MainPage.js';
import TorrentPage from './components/TorrentPage';
import SearchPage from './components/SearchPage';
import SettingsPage from './components/SettingsPage';

// set default provider
if(!localStorage.getItem('provider')) {
	localStorage.setItem('provider', 'EliteTorrent');
}

ReactDOM.render(
	<Router>
		<Route path="/" component={MainPage}/>
		<Route path="/torrent/:id" component={TorrentPage}/>
		<Route path="/search(/:query)" component={SearchPage}/>
		<Route path="/settings" component={SettingsPage}/>
	</Router>,
	document.querySelector('#elite-time')
);
