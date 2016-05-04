import React, { Component } from 'react';

export default class TorrentPlayer extends Component {
	render() {
		let { streamUrl } = this.props;
		let createVideoElement = function() {
			if(!streamUrl) {
				return (<span/>);
			}
			return (
				<video id="torrent-video" src={streamUrl} controls autoPlay />
			);
		};
		return (
			<div className="col-md-12" id="player">
				{ createVideoElement() }
			</div>
		);
	}
};

TorrentPlayer.propTypes = {
	streamUrl: React.PropTypes.string
};
