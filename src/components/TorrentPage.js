import React, { Component } from 'react';
import TorrentActions from '../actions/TorrentActions.js';
import TorrentStore from '../stores/TorrentStore.js';
import TorrentPlayer from './TorrentPlayer';

export default class extends Component {

	constructor() {
		super();
		this.state = TorrentStore.getTorrent();
		this.onChange = this.onChange.bind(this);
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
		return (
			<div>
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
				<p>Loading torrent stream {this.state.loadingStream.toString()}</p>
				<p>Loading torrent info {this.state.isFetching.toString()}</p>
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
}
