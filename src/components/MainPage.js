import React, { Component } from 'react';
import TorrentActions from '../actions/TorrentActions.js';
import TorrentsStore from '../stores/TorrentsStore.js';
import TorrentList from './TorrentList';
import LoadingSpinner from './LoadingSpinner';

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
		return this.state.isFetching ? <LoadingSpinner /> : (
			<section>
				<h1>Últimos torrents</h1>
				<TorrentList torrents={this.state.torrents} history={this.props.history} />
			</section>
		);
	}

	onChange() {
		this.setState(TorrentsStore.getAll());
	}
}
