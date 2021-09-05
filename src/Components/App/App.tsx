import React from 'react';
import Nav from './Components/Nav/Nav';
import Home from './Components/Home/Home';
import IncoingShipment from '../../Components/IncomingShipment/IncomingShipment';
import { Route, Switch,  useRouteMatch } from 'react-router-dom';
import Invoice from 'Components/Invoice/Invoice';
import MessageModal from 'Components/MessageModal/MessageModal';
import SearchProduct from 'Containers/SearchProduct/SearchProduct';
import Shop from 'Components/Shop/Shop';
import Scheme from 'Components/Scheme/Scheme';
import Salesman from 'Components/Salesman/Salesman';
import Alert from 'Components/Alert/Alert';
import OutgoingGrid from 'Containers/Outgoing/OutgoingGrid';


function MessageRoute() {
	const match = useRouteMatch();
	return <Switch>
		<Route path={match.path + '/pass'} children={({ match }) =>
			<MessageModal IsSuccess={true} ShouldDisplay={true} />} />
		<Route path={match.path + '/fail'} children={({ match }) =>
			<MessageModal IsSuccess={false} ShouldDisplay={true} />} />
	</Switch>
}
export default class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Alert/>
				<Nav />
				<Route path='/' exact>
					<Home />
				</Route>
				<Route path='/incoming'>
					<IncoingShipment />
				</Route>
				<Route path='/outgoing' render={(params)=><OutgoingGrid {...params}/>}/>
		
				<Route path='/invoice'>
					<Invoice />
				</Route>
				<Route path="/message" >
					<MessageRoute />
				</Route>
				<Route path="/productsearch">
					<SearchProduct />
				</Route>
				<Route path="/shop">
					<Shop />
				</Route>
				<Route path="/scheme">
					<Scheme />
				</Route>
				<Route path="/salesman">
					<Salesman />
				</Route>
				
				
			</React.Fragment>
		);
	}
	componentDidMount() {
		const LoadingElementId = "loading";
		document.getElementById("loading")?.classList.add("fadeOut");
		setTimeout(function () {
			document.getElementById(LoadingElementId)?.remove();
		}, 2000)
	}
}