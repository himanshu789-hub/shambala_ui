import React from 'react';
import Nav from './Components/Nav/Nav';
import Home from './Components/Home/Home';
import IncoingShipment from '../../Components/IncomingShipment/IncomingShipment';
import { Route } from 'react-router-dom';
import OutgoingShipment from 'Components/OutgoingShipment/OutgoingShipment';
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
					<OutgoingShipment/>
				</Route>
			</React.Fragment>
		);
	}
}
