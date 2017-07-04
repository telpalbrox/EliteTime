import React, { Component } from 'react';
import TorrentActions from '../actions/TorrentActions';
import TorrentsStore from '../stores/TorrentsStore';
import TorrentList from './TorrentList';
import LoadingSpinner from './LoadingSpinner';

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
    return this.state.isFetching ? <LoadingSpinner /> : (
      <section>
        <h1>Últimos torrents</h1>
        <TorrentList torrents={this.state.torrents} />
      </section>
    );
  }
}
