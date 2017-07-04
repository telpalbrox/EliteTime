// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TorrentItemList from './TorrentItemList';
import { Torrent, History } from '../interfaces';

class TorrentList extends Component {
  props: {
    torrents: Array<Torrent>,
    history: History
  };

  static defaultProps = {
    torrents: []
  };

  render() {
    const { torrents, history } = this.props;

    const list = torrents.map(torrent => (
      <TorrentItemList key={torrent.id} torrent={torrent} history={history} />
    ));

    return (<div>{list}</div>);
  }
}

export default withRouter(TorrentList);
