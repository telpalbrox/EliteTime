// @flow
import React, { Component } from 'react';
import { Row } from 'antd';
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

    return (<Row type="flex" className="et-torrent-list">{list}</Row>);
  }
}

export default withRouter(TorrentList);
