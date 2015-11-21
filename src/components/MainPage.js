import React, { Component } from 'react';
import TorrentActions from '../actions/TorrentActions.js';
import TorrentsStore from '../stores/TorrentsStore.js';
import TorrentItemList from './TorrentItemList';

export default class MainPage extends Component {

	constructor() {
		super();
		this.state = TorrentsStore.getAll();
	}

	componentDidMount() {
		TorrentsStore.addChangeListener(this.onChange.bind(this));
		TorrentActions.getLastTorrents();
	}

	componentWillUnmount() {
		TorrentsStore.removeChangeListener(this.onChange.bind(this));
	}

	render() {
		let torrents = this.state.torrents.map(torrent => {
			return (<TorrentItemList key={torrent.id} torrent={torrent} />);
		});

		return (
			<section>
				<h1>Main Page</h1>
				Fetching: { this.state.isFetching.toString() }
				<ul>
					{ torrents }
				</ul>
			</section>
		);
	}

	onChange() {
		this.setState(TorrentsStore.getAll());
	}
}
