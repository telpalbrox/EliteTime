import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TorrentItemList from './TorrentItemList';

class TorrentList extends Component {
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
	torrents: PropTypes.array,
	history: PropTypes.object.isRequired
};

export default withRouter(TorrentList);