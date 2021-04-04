import Add from '../../Containers/IncomingShipment/Add/Add';
import React from 'react';
import { useRouteMatch, Route } from 'react-router';

const IncomingShipment = React.memo(function IncomingShipment() {
	const math = useRouteMatch();
	return (
		<div className='incoming-shipment'>
			<Route path={math.path + '/add'}>
				<Add />
			</Route>
			<Route path={math.path + '/search'}>
		         
			</Route>
		</div>
	);
});
export default IncomingShipment;
