import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TorrentPlayer extends Component {
	render() {
		let { streamUrl } = this.props;
		let createVideoElement = () => {
			if(!streamUrl) {
				return (<span/>);
			}
			return (
				<video id="torrent-video" onError={this.props.onError} src={streamUrl} controls autoPlay />
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
	streamUrl: PropTypes.string.isRequired,
	onError: PropTypes.func.isRequired
};
