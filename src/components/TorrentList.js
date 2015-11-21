import React, { Component } from 'react';
import TorrentItemList from './TorrentItemList';

export default class extends Component {
	static propTypes = {
		torrents: React.PropTypes.array.isRequired
	};

	render() {
		let { torrents } = this.props;

		if(!torrents) {
			torrents = [];
		}

		let list = torrents.map(torrent => {
			return (<TorrentItemList key={torrent.id} torrent={torrent} />);
		});

		return (<div>{list}</div>);
	}
};
