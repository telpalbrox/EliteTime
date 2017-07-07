import React, { Component } from 'react';
import { Spin } from 'antd';
import TorrentActions from '../actions/TorrentActions';
import TorrentsStore from '../stores/TorrentsStore';
import TorrentList from './TorrentList';

export default class MainPage extends Component {

  constructor() {
    super();
    this.state = TorrentsStore.getAll();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    TorrentsStore.addChangeListener(this.onChange);
    TorrentActions.getLastTorrents();
  }

  componentWillUnmount() {
    TorrentsStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(TorrentsStore.getAll());
  }

  render() {
    return this.state.isFetching ? <Spin /> : (
      <section>
        <h1 className="et-page-title">Últimos torrents</h1>
        <TorrentList torrents={this.state.torrents} />
      </section>
    );
  }
}
