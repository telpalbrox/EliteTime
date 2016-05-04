import React, { Component } from 'react';

export default class SearchInput extends Component {
    constructor() {
        super();
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.refs.search.value = this.props.query || '';
    }

    render() {
        return (
            <div className="row">
                <form id="search-form" onSubmit={this.search}>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search" name="srch-term" id="search-query" value={this.query} ref="search"/>
                        <div className="input-group-btn">
                            <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"/></button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    search(event) {
        event.preventDefault();
        this.props.search(this.refs.search.value);
    }
};

SearchInput.propTypes = {
	search: React.PropTypes.func.isRequired,
	query: React.PropTypes.string
};
