import React, { Component, ReactPropTypes } from 'react';

export default class Pagination extends Component {
    constructor() {
        super();
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        // this.isNextButtonDisabled = this.isNextButtonDisabled.bind(this);
        // this.isPrevButtonDisabled = this.isPrevButtonDisabled.bind(this);
    }

    render() {
        return (
            <div>
                <nav className="row">
                    <ul className="pagination">
                        <li id="prev" className={ this.isPrevButtonEnabled() ? '' : 'disabled' }>
                            <a href="#" onClick={this.prevPage}>Página anterior</a>
                        </li>
                        <li id="next" className={ this.isNextButtonEnabled() ? '' : 'disabled' }>
                            <a href="#" onClick={this.nextPage}>Página siguiente</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }

    nextPage(event) {
        event.preventDefault();
        if(this.isNextButtonEnabled()) {
            let { query, page } = this.props;
            this.props.changePage(query, page + 1);
            this.goTop();
        }
    }

    prevPage(event) {
        event.preventDefault();
        if(this.isPrevButtonEnabled()) {
            let { query, page } = this.props;
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

    goTop() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}

Pagination.propTypes = {
	page: React.PropTypes.number.isRequired,
	total: React.PropTypes.number.isRequired,
	query: React.PropTypes.string,
	changePage: React.PropTypes.func.isRequired,
	searchDisabled: React.PropTypes.bool.isRequired
};
