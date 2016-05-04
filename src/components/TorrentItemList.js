import React, { Component, ReactPropTypes } from 'react';

export default class TorrentItemList extends Component {
	render() {
		let torrentItemStyles = {};
		if(this.props.torrent.image) {
			torrentItemStyles.backgroundImage = `url(${this.props.torrent.image})`;
		} else {
			torrentItemStyles.backgroundColor = 'black';
		}

		return(
			<div onClick={this.onClick.bind(this)} className="torrent-item col-xs-4" style={torrentItemStyles}>
				<p>{ this.props.torrent.name }</p>
				<p>{ this.props.torrent.category }</p>
			</div>
		);
	}

	onClick() {
		this.props.history.pushState(null, `/torrent/${this.props.torrent.id}`);
	}
}

TorrentItemList.propTypes = {
	torrent: React.PropTypes.object.isRequired,
	history: React.PropTypes.object.isRequired
};
