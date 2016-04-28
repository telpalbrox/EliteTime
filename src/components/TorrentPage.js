import React, { Component } from 'react';
import { History } from 'react-router'
import reactMixin from 'react-mixin';
import request from 'request';
import TorrentActions from '../actions/TorrentActions.js';
import TorrentStore from '../stores/TorrentStore.js';
import TorrentPlayer from './TorrentPlayer';

@reactMixin.decorate(History)
export default class extends Component {

	constructor() {
		super();
		this.state = TorrentStore.getTorrent();
		this.onChange = this.onChange.bind(this);
		this.goBack = this.goBack.bind(this);
		this.downloadTorrent = this.downloadTorrent.bind(this);
	}

	componentDidMount() {
		TorrentStore.addChangeListener(this.onChange);
		TorrentActions.getTorrent(this.props.params.id);
	}

	componentWillUnmount() {
		TorrentActions.cleanTorrent();
		TorrentStore.removeChangeListener(this.onChange);
	}

	render() {
		const loadingSpinner = () => {
			if(this.state.loadingStream) {
				return ( <p>Cargando stream (esto puede llevar unos minutos) <i className="glyphicon glyphicon-hourglass loading" /></p>);
			}
		};
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<button type="button" style={{float: 'left'}} className="btn btn-default back-button" onClick={this.goBack}>Atrás</button>
						<button type="button" style={{float: 'right'}} className="btn btn-default back-button" onClick={this.downloadTorrent}>Descargar torrent</button>
					</div>
				</div>
				<div className="row">
					<div className="col-md-3">
						<img src={this.state.torrent.image} alt="" className="img-thumbnail"/>
					</div>
					<div className="col-md-9">
						<p>{ this.state.torrent.title }</p>
						<p>{ this.state.torrent.description }</p>
						<p>{ this.state.torrent.size }</p>
						<p>{ this.state.torrent.category }</p>
					</div>
				</div>
				{loadingSpinner()}
				<TorrentPlayer streamUrl={this.state.streamUrl} />
			</div>
		);
	}

	onChange() {
		let newState = TorrentStore.getTorrent();
		if (newState.engine && newState.loadingStream === true) {
			newState.engine.server.on('listening', () => {
				TorrentActions.streamReady(`http://127.0.0.1:${newState.engine.server.address().port}/`);
			});
		}
		this.setState(newState);
	}

	goBack() {
		this.history.goBack();
	}

	downloadTorrent() {
		const fs = require('fs');
		const dialog = require('electron').remote.dialog;
		dialog.showSaveDialog({ title: 'Descargar .torrent', filters: [{ name: 'Torrent', extensions: ['torrent'] }] }, (filePath) => {
			console.log(filePath);
			const writeStream = fs.createWriteStream(filePath);
			request(this.state.torrent.url).pipe(writeStream);
			writeStream.on('error', (error) => {
				console.error(error);
			});
		});
	}
}
