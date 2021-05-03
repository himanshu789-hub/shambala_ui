import React from 'react';
import Nav from './Components/Nav/Nav';
import Home from './Components/Home/Home';
import IncoingShipment from '../../Components/IncomingShipment/IncomingShipment';
import { Route, Switch, RouteComponentProps, useRouteMatch } from 'react-router-dom';
import OutgoingShipment from 'Components/OutgoingShipment/OutgoingShipment';
import Invoice from 'Components/Invoice/Invoice';
import MessageModal from 'Components/MessageModal/MessageModal';


function MessageRoute() {
	const match = useRouteMatch();
	return <Switch>
		<Route path={match.path + '/pass'} children={({ match }) =>
			<MessageModal IsSuccess={true} ShouldDisplay={true}  />} />
		<Route path={match.path + '/fail'} children={({ match }) =>
			<MessageModal IsSuccess={false} ShouldDisplay={true} />} />
	</Switch>
}
export default class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Nav />
				<Route path='/' exact>
					<Home />
				</Route>
				<Route path='/incoming'>
					<IncoingShipment />
				</Route>
				<Route path='/outgoing'>
					<OutgoingShipment />
				</Route>
				<Route path='/invoice'>
					<Invoice />
				</Route>
				<Route path="/message" >
					<MessageRoute />
				</Route>

			</React.Fragment>
		);
	}
}