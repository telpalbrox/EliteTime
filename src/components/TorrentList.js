import React, { Component } from 'react';
import TorrentItemList from './TorrentItemList';

export default class TorrentList extends Component {
	render() {
		let { torrents, history } = this.props;

		if(!torrents) {
			torrents = [];
		}

		let list = torrents.map(torrent => {
			return (<TorrentItemList key={torrent.id} torrent={torrent} history={history} />);
		});

		return (<div>{list}</div>);
	}
};

TorrentItemList.propTypes = {
	torrents: React.PropTypes.array,
	history: React.PropTypes.object.isRequired
};
