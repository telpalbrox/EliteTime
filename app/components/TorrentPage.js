import React, { Component } from 'react';
import request from 'request';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Spin, Button, Col, Row } from 'antd';
import TorrentActions from '../actions/TorrentActions';
import TorrentStore from '../stores/TorrentStore';
import TorrentPlayer from './TorrentPlayer';
import LoadingSpinner from './LoadingSpinner';
import { History } from '../interfaces';

const fs = require('fs');
const dialog = require('electron').remote.dialog;

class TorrentPage extends Component {
  static onPlayerError() {
    TorrentActions.torrentPlayerError();
  }

  constructor() {
    super();
    this.state = TorrentStore.getTorrent();
    this.onChange = this.onChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.downloadTorrent = this.downloadTorrent.bind(this);
    this.playInVlc = this.playInVlc.bind(this);
    this.loadingStreamSpinner = this.loadingStreamSpinner.bind(this);
    this.renderTorrent = this.renderTorrent.bind(this);
  }

  componentDidMount() {
    TorrentStore.addChangeListener(this.onChange);
    TorrentActions.getTorrent(this.props.match.params.id);
  }

  componentWillUnmount() {
    TorrentActions.cleanTorrent();
    TorrentStore.removeChangeListener(this.onChange);
  }

  loadingStreamSpinner() {
    if (this.state.loadingStream) {
      return (<LoadingSpinner message="Cargando stream (esto puede llevar unos minutos)" />);
    }
  }

  renderTorrent() {
    return (
      <div>
        <Row>
          <Col span={24}>
            <Button icon="left" onClick={this.goBack}>Atrás</Button>
            <Button icon="download" onClick={this.downloadTorrent}>Descargar .torrent</Button>
            { this.state.streamUrl ? <Button onClick={this.playInVlc}>Reproducir en VLC</Button> : '' }
            { this.state.streamUrl ? <strong>Stream disponible en: {this.state.streamUrl}</strong> : '' }
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <img src={this.state.torrent.image} alt="" />
            <p>{ this.state.torrent.title }</p>
            <p>{ this.state.torrent.size }</p>
            <p>{ this.state.torrent.category }</p>
            <p>{ this.state.torrent.description }</p>
          </Col>
          <Col span={18}>
            {this.loadingStreamSpinner()}
            {this.state.playerError
              ?
              <div>Formato de video no compatible
                <Button
                  onClick={this.playInVlc}
                >
                  Reproducir en VLC
                </Button>
              </div>
              : <TorrentPlayer streamUrl={this.state.streamUrl} onError={TorrentPage.onPlayerError} />}
          </Col>
        </Row>
      </div>
    );
  }

  onChange() {
    const newState = TorrentStore.getTorrent();
    if (newState.engine && newState.loadingStream === true) {
      newState.engine.server.on('listening', () => {
        TorrentActions.streamReady(`http://127.0.0.1:${newState.engine.server.address().port}/`);
      });
    }
    this.setState(newState);
  }

  goBack() {
    this.props.history.goBack();
  }

  downloadTorrent() {
    dialog.showSaveDialog({ title: 'Descargar .torrent', filters: [{ name: 'Torrent', extensions: ['torrent'] }] }, (filePath) => {
      const writeStream = fs.createWriteStream(filePath);
      request(this.state.torrent.url).pipe(writeStream);
      writeStream.on('error', (error) => {
        console.error(error);
      });
    });
  }

  playInVlc() {
    TorrentActions.openVideoVlc(this.state.streamUrl);
  }

  render() {
    return (this.state.isFetching ? <Spin /> : this.renderTorrent());
  }
}

TorrentPage.propTypes = {
  history: History.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};

export default withRouter(TorrentPage);
