'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import MainPage from './components/MainPage.js';
import TorrentPage from './components/TorrentPage';
import SearchPage from './components/SearchPage';
import SettingsPage from './components/SettingsPage';
import Footer from './components/Footer';

// set default provider
if (!localStorage.getItem('provider')) {
	localStorage.setItem('provider', 'EliteTorrent');
}

ReactDOM.render(
	<div>
		<Router>
			<div className="row">
				<Route exact path="/" component={MainPage} />
				<Route path="/torrent/:id" component={TorrentPage} />
				<Route path="/search/:query?" component={SearchPage} />
				<Route path="/settings" component={SettingsPage} />
			</div>
		</Router>
		<Footer />
	</div>, document.querySelector('#elite-time')
);
