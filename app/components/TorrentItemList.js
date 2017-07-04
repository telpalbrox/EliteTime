// @flow
import React, { Component } from 'react';
import { Torrent, History } from '../interfaces';

export default class TorrentItemList extends Component {
  props: {
    torrent: Torrent,
    history: History
  };

  onClick() {
    this.props.history.push(`/torrent/${this.props.torrent.id}`);
  }

  render() {
    const torrentItemStyles = {};
    if (this.props.torrent.image) {
      torrentItemStyles.backgroundImage = `url(${this.props.torrent.image})`;
    } else {
      torrentItemStyles.backgroundColor = 'black';
    }

    return (
      <div tabIndex={0} role="button" onClick={this.onClick.bind(this)} className="torrent-item col-xs-4" style={torrentItemStyles}>
        <p>{ this.props.torrent.name }</p>
        <p>{ this.props.torrent.category }</p>
      </div>
    );
  }
}
