import React, { Component } from 'react';
import TorrentActions from '../actions/TorrentActions';

export default class SettingsPage extends Component {

  constructor() {
    super();
    let provider = window.localStorage.getItem('provider');
    if (!provider) {
      provider = 'EliteTorrent';
      window.localStorage.setItem('provider', provider);
    }
    this.state = {
      provider
    };
    this.data = [
      { PROVIDER: 'EliteTorrent' },
      { PROVIDER: 'Newpct' }
    ];
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      provider: e.currentTarget.value
    });
    window.localStorage.setItem('provider', e.currentTarget.value);
    TorrentActions.cleanAll();
  }

  render() {
    const inputs = this.data.map((result) => (
      <div className="radio" key={result.PROVIDER}>
        <label htmlFor="provider">
          <input
            type="radio"
            name="provider"
            value={result.PROVIDER}
            checked={this.state.provider === result.PROVIDER}
            onChange={this.onChange}
            id="provider"
          />
          {result.PROVIDER}
        </label>
      </div>
    ));

    return (
      <section>
        <h1>Ajustes</h1>
        <h4>Selecciona un proveedor</h4>
        <div className="row">
          { inputs }
        </div>
      </section>
    );
  }
}
