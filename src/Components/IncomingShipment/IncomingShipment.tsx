import Add from '../../Containers/IncomingShipment/Add/Add';
import React from 'react';
import { useRouteMatch, Route, RouteComponentProps } from 'react-router';

const IncomingShipment = React.memo(function IncomingShipment() {
	const math = useRouteMatch();
	return (
		<div className='incoming-shipment'>
			<Route path={math.path + '/add'} children={(props:RouteComponentProps)=><Add {...props}/>}/>
		</div>
	);
});
export default IncomingShipment;
