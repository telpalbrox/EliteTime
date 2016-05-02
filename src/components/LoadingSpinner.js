import React from 'react';
export default function(props) {
	return (
		<div>{props.message || 'Cargando...'}  <i className="glyphicon glyphicon-hourglass loading" /></div>
	);
}
