import { Route, RouteComponentProps, Switch, useRouteMatch } from 'react-router';
import OutgoingShipmentAdd from '../../Containers/OutgoingShipment/Add/Add';
import OutgoingShipmentSearch from 'Containers/OutgoingShipment/Search/Search';
import OutgoingShipmentReturn from 'Containers/OutgoingShipment/Return/Return';

export default function OutgoingShipment() {
	const match = useRouteMatch();
	return (
		<div className='outgoing'>
			<Switch>
				<Route path={match.path + '/add'} children={(props)=><OutgoingShipmentAdd {...props}/>}/>
				<Route path={match.path + '/search'}>
					<OutgoingShipmentSearch />
				</Route>
				<Route path={match.path + '/return/:id'} component={(props: RouteComponentProps<{ id: string }>) => <OutgoingShipmentReturn {...props} />} />
			</Switch>
		</div>
	);
}
