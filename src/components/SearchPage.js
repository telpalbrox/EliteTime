import React, { Component } from 'react';
import SearchTorrentStore from '../stores/SearchTorrentsStore';
import TorrentActions from '../actions/TorrentActions';
import TorrentList from './TorrentList';
import SearchInput from './SearchInput';
import Pagination from './Pagination';

export default class extends Component {
    constructor() {
        super();
        this.state = SearchTorrentStore.getAll();
        this.searchTorrents = this.searchTorrents.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        SearchTorrentStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        SearchTorrentStore.removeChangeListener(this.onChange);
    }

    render() {
        const pagination = () => {
            if(this.state.torrents && this.state.torrents.length) {
                return (
                    <Pagination page={this.state.page} total={this.state.total} query={this.state.query}
                                changePage={TorrentActions.searchTorrent} searchDisabled={this.state.searchDisabled}/>
                );
            }
        };
        return (
            <section>
                <h1>Search Page</h1>
                Fetching: { this.state.isFetching.toString() }
                <SearchInput search={this.searchTorrents} query={this.state.query} />
                <TorrentList torrents={this.state.torrents} />
                { pagination() }
            </section>
        );
    }

    onChange() {
        this.setState(SearchTorrentStore.getAll());
    }

    searchTorrents(query) {
        TorrentActions.searchTorrent(query, 1);
    }
};
