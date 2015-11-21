import React, { Component } from 'react';
import TorrentActions from '../actions/TorrentActions.js';
import TorrentsStore from '../stores/TorrentsStore.js';
import TorrentList from './TorrentList';

export default class MainPage extends Component {

	constructor() {
		super();
		this.state = TorrentsStore.getAll();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		TorrentsStore.addChangeListener(this.onChange);
		TorrentActions.getLastTorrents();
	}

	componentWillUnmount() {
		TorrentsStore.removeChangeListener(this.onChange);
	}

	render() {

		return (
			<section>
				<h1>Main Page</h1>
				Fetching: { this.state.isFetching.toString() }
				<TorrentList torrents={this.state.torrents} />
			</section>
		);
	}

	onChange() {
		this.setState(TorrentsStore.getAll());
	}
}
