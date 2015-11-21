import React, { Component } from 'react';
import TorrentActions from '../actions/TorrentActions.js';
import TorrentStore from '../stores/TorrentStore.js';

export default class TorrentPage extends Component {

	constructor() {
		super();
		this.state = TorrentStore.getTorrent();
	}

	componentDidMount() {
		TorrentStore.addChangeListener(this.onChange.bind(this));
		TorrentActions.getTorrent(this.props.params.id);
	}

	componentWillUnmount() {
		TorrentStore.removeChangeListener(this.onChange.bind(this));
	}

	render() {
		return (
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
		);
	}

	onChange() {
		this.setState(TorrentStore.getTorrent());
		console.log(this.state);
	}
}
