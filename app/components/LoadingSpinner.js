import React from 'react';
import PropTypes from 'prop-types';

function LoadingSpinner(props) {
  return (
    <div>{props.message || 'Cargando...'} <i className="glyphicon glyphicon-hourglass loading" /></div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string
};

LoadingSpinner.defaultProps = {
  message: 'Cargando...'
};

export default LoadingSpinner;
