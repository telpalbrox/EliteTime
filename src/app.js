'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import MainPage from './components/MainPage.js';
import TorrentPage from './components/TorrentPage';

ReactDOM.render(
	<Router>
		<Route path="/" component={MainPage}/>
		<Route path="/torrent/:id" component={TorrentPage}/>
	</Router>,
	document.querySelector('#elite-time')
);
