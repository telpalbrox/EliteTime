import React, { Component } from 'react';
import SearchTorrentStore from '../stores/SearchTorrentsStore';
import TorrentActions from '../actions/TorrentActions';
import TorrentList from './TorrentList';
import SearchInput from './SearchInput';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';

export default class SearchPage extends Component {
    constructor() {
        super();
        this.state = SearchTorrentStore.getAll();
        this.searchTorrents = this.searchTorrents.bind(this);
        this.onChange = this.onChange.bind(this);
		this.renderPagination = this.renderPagination.bind(this);
    }

    componentDidMount() {
        SearchTorrentStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        SearchTorrentStore.removeChangeListener(this.onChange);
    }
	
	renderPagination() {
		if(this.state.torrents && this.state.torrents.length == this.state.total) {
			return;
		}
		if(this.state.torrents && this.state.torrents.length) {
			return (
				<Pagination page={this.state.page} total={this.state.total} query={this.state.query}
							changePage={TorrentActions.searchTorrent} searchDisabled={this.state.searchDisabled}/>
			);
		}
	}

    render() {
        return (
            <section>
                <h1>Búsqueda</h1>
                <SearchInput search={this.searchTorrents} query={this.state.query} />
                <TorrentList torrents={this.state.torrents} history={this.props.history} />
				{(() => {
					if(this.state.isFetching) {
						return <LoadingSpinner message="Cargando resultados" />
					}
					if(this.state.query !== null && this.state.torrents && !this.state.torrents.length) {
						return <span>No hay resultados</span>
					}
				})()}
                { this.renderPagination() }
            </section>
        );
    }

    onChange() {
        this.setState(SearchTorrentStore.getAll());
    }

    searchTorrents(query) {
        if(!query) {
            return;
        }
        TorrentActions.searchTorrent(query, 1);
    }
};
