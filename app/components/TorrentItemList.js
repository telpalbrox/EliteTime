// @flow
import React, { Component } from 'react';
import { Col, Card } from 'antd';
import { Link } from 'react-router-dom';
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
    return (
      <Col xs={12} sm={6} md={4} onClick={this.onClick.bind(this)} className="et-torrent-list-item">
        <Link to={`/torrent/${this.props.torrent.id}`}>
          <Card className="et-torrent-list-item-card">
            <div className="et-torrent-list-item-image">
              <img alt={this.props.torrent.name} width="100%" src={this.props.torrent.image} />
            </div>
            <div className="et-torrent-list-item-card-body">
              <h3>{ this.props.torrent.name }</h3>
              <p>{ this.props.torrent.category }</p>
            </div>
          </Card>
        </Link>
      </Col>
    );
  }
}
