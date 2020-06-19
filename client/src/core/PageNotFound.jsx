import React from 'react';
import { withRouter } from 'react-router-dom';

const pageNotFound = () => (
	<div
		className="text-center d-flex"
		style={{ height: '25vh', justifyContent: 'center', alignItems: 'center' }}
	>
		<h1>Sorry, this page doesn't exist</h1>
	</div>
);

export default withRouter(pageNotFound);
