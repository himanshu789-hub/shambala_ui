import { Route, Switch, useRouteMatch } from 'react-router';
import OutgoingShipmentAdd from '../../Containers/OutgoingShipment/Containers/Add/Add';
import OutgoingShipmentSearch from 'Containers/OutgoingShipment/Containers/Search/Search';

export default function OutgoingShipment() {
	const match = useRouteMatch();
	return (
		<div className='outgoing'>
			<Switch>
				<Route path={match.path + '/add'}>
					<OutgoingShipmentAdd />
				</Route>
				<Route path={match.path+'/search'}>
					<OutgoingShipmentSearch/>
				</Route>
			</Switch>
		</div>
	);
}
