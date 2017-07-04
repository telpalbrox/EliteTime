import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Pagination extends Component {
  static goTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  constructor() {
    super();
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
  }

  nextPage(event) {
    event.preventDefault();
    if (this.isNextButtonEnabled()) {
      const { query, page } = this.props;
      this.props.changePage(query, page + 1);
      Pagination.goTop();
    }
  }

  prevPage(event) {
    event.preventDefault();
    if (this.isPrevButtonEnabled()) {
      const { query, page } = this.props;
      this.props.changePage(query, page - 1);
      this.goTop();
    }
  }

  isPrevButtonEnabled() {
    return (this.props.page > 1) && !this.props.searchDisabled;
  }

  isNextButtonEnabled() {
    return ((this.props.page * 48) < this.props.total) && !this.props.searchDisabled;
  }

  render() {
    return (
      <div>
        <nav className="row">
          <ul className="pagination">
            <li id="prev" className={this.isPrevButtonEnabled() ? '' : 'disabled'}>
              <button onClick={this.prevPage}>Página anterior</button>
            </li>
            <li id="next" className={this.isNextButtonEnabled() ? '' : 'disabled'}>
              <button onClick={this.nextPage}>Página siguiente</button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  changePage: PropTypes.func.isRequired,
  searchDisabled: PropTypes.bool.isRequired
};
