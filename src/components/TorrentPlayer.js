import React, { Component } from 'react';

export default class extends Component {
	static propTypes = {
		streamUrl: React.PropTypes.string
	};

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
