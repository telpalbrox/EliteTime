import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.updateSearchValue = this.updateSearchValue.bind(this);
    this.state = {
      searchValue: ''
    };
  }

  search(event) {
    event.preventDefault();
    this.props.search(this.state.searchValue);
  }

  updateSearchValue(event) {
    this.setState({ searchValue: event.target.value });
  }

  render() {
    return (
      <div className="row">
        <form id="search-form" onSubmit={this.search}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search" name="srch-term" id="search-query" value={this.state.searchValue} onChange={this.updateSearchValue} />
            <div className="input-group-btn">
              <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search" /></button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

SearchInput.defaultProps = {
  query: ''
};

SearchInput.propTypes = {
  search: PropTypes.func.isRequired
};
