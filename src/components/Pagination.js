import React, { Component, ReactPropTypes } from 'react';
import { Link } from 'react-router';

export default class extends Component {
    static propTypes = {
        page: React.PropTypes.number.isRequired,
        total: React.PropTypes.number.isRequired,
        query: React.PropTypes.string,
        changePage: React.PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }

    render() {
        return (
            <div>
                <nav className="row">
                    <ul className="pagination">
                        <li id="prev" className={ this.props.page > 1 ? '' : 'disabled' }>
                            <a href="#" onClick={this.prevPage}>Página anterior</a>
                        </li>
                        <li id="next" className={ this.props.page * 48 < this.props.total ? '' : 'disabled' }>
                            <a href="#" onClick={this.nextPage}>Página siguiente</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }

    nextPage(event) {
        event.preventDefault();
        let { query, page } = this.props;
        this.props.changePage(query, page + 1);
    }

    prevPage(event) {

    }
}
