import React from 'react';
import ShipmentList from 'Components/ShipmentList/ShipmentList';
import IProductService from 'Contracts/services/IProductService';
import ProductService from 'Services/ProductService';
import { Product } from 'Types/Product';
import { Route, Switch, useRouteMatch } from 'react-router';

type OutgoingShipmentAddProps = {};
type OutgoingShipmentAddState = {
	Products: Product[];
};
class OutgoingShipmentAdd extends React.Component<OutgoingShipmentAddProps, OutgoingShipmentAddState> {
	_productService: IProductService;
	constructor(props: OutgoingShipmentAddProps) {
		super(props);
		this._productService = new ProductService();
		this.state={
			Products:[]
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit() {
		console.log('Outgoing Shipment Post');
	}
	render() {
		return (
			<div className='outgoing-add'>
				<ShipmentList Products={this.state.Products} handleSubmit={this.handleSubmit} ShouldLimitQuantity={true}/>
			</div>
		);
	}
	componentDidMount() {
		this._productService.GetProductWithLimit().then(res => {
			this.setState({ Products: res.data });
		});
	}
}

export default function OutgoingShipment() {
	const match = useRouteMatch();
	return (
		<div className='outgoing'>
			<Switch>
				<Route path={match.path + '/add'}>
					<OutgoingShipmentAdd />
				</Route>
			</Switch>
		</div>
	);
}
