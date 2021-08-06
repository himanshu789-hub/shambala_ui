import { RouteConfigElement, RouteConfig } from './Types/route';
import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';
import IncomingShipment from './Containers/IncomingShipment/IncomingShipment';
import IncomngSearch from './Containers/IncomingShipment/Containers/Search/Search';
import IncomngAdd from './Containers/IncomingShipment/Containers/Add/Add';

//define route left
export const routeComponent: RouteConfig = [
	{
		component: IncomingShipment,
		uniqueId: 'Incoming_Shipment',
		path: '/incoming',
		exact: false,
		routes: [
			{
				component: IncomngAdd,
				uniqueId: 'Incoming_Shipment_Add',
				path: '/incoming/add',
			},
			{
				component: IncomngSearch,
				uniqueId: 'Incoming_Shipment_Search',
				path: '/incoming/search',
			},
		],
	},
];

const RouteWithSubRoutes = function RouteWithSubRoutes(props: { route: RouteConfigElement }) {
	console.log('Rendering Route', props.route.uniqueId);
	return (
		<Route
			path={props.route.path}
			exact={props.route.exact}
			render={() => <props.route.component key={props.route.uniqueId} routes={props.route.routes} />}
		/>
	);
};

interface IRenderRoutesProps {
	routes: RouteConfig;
}
export const RenderRoutes = class RenderRoutes extends React.Component<IRenderRoutesProps, {}> {
	shouldComponentUpdate(nextProps: IRenderRoutesProps, nextState: {}) {
		return this.props.routes != nextProps.routes;
	}
	render() {
		const props = this.props;

		return (
			<Switch>
				{props.routes.map((route, index) => (
					<RouteWithSubRoutes key={index} route={route} />
				))}
			</Switch>
		);
	}
};
