import React, { Component } from 'react';
import request from 'request';
import TorrentActions from '../actions/TorrentActions.js';
import TorrentStore from '../stores/TorrentStore.js';
import TorrentPlayer from './TorrentPlayer';
import LoadingSpinner from './LoadingSpinner';

export default class TorrentPage extends Component {
	constructor() {
		super();
		this.state = TorrentStore.getTorrent();
		this.onChange = this.onChange.bind(this);
		this.goBack = this.goBack.bind(this);
		this.downloadTorrent = this.downloadTorrent.bind(this);
		this.playInVlc = this.playInVlc.bind(this);
		this.loadingStreamSpinner = this.loadingStreamSpinner.bind(this);
		this.renderTorrent = this.renderTorrent.bind(this);
	}

	componentDidMount() {
		TorrentStore.addChangeListener(this.onChange);
		TorrentActions.getTorrent(this.props.params.id);
	}

	componentWillUnmount() {
		TorrentActions.cleanTorrent();
		TorrentStore.removeChangeListener(this.onChange);
	}

	loadingStreamSpinner() {
		if(this.state.loadingStream) {
			return (<LoadingSpinner message="Cargando stream (esto puede llevar unos minutos" />);
		}
	}

	renderTorrent() {
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<button type="button" style={{float: 'left'}} className="btn btn-default back-button" onClick={this.goBack}>Atrás</button>
						<button type="button" style={{float: 'right'}} className="btn btn-default back-button" onClick={this.downloadTorrent}>Descargar .torrent</button>
						{ this.state.streamUrl ? <button type="button" style={{float: 'right'}} className="btn btn-default back-button" onClick={this.playInVlc}>Reproducir en VLC</button> : '' }
					</div>
				</div>
				<div className="row" style={{textAlign: 'right'}}>
					<div className="col-md-12">
						{ this.state.streamUrl ? <strong>Stream disponible en: {this.state.streamUrl}</strong> : '' }
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
				{this.loadingStreamSpinner()}
				<TorrentPlayer streamUrl={this.state.streamUrl} />
			</div>
		);
	}

	render() {
		return ( this.state.isFetching ? <LoadingSpinner message="Cargando torrent" /> : this.renderTorrent() );
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
		this.props.history.goBack();
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

	playInVlc() {
		TorrentActions.openVideoVlc(this.state.streamUrl);
	}
}
