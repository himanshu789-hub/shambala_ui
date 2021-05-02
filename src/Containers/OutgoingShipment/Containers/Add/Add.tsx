import React from 'react';
import ShipmentList from 'Containers/ShipmentList/ShipmentList';
import IProductService from 'Contracts/services/IProductService';
import ProductService from 'Services/ProductService';
import { Product } from 'Types/Types';

type OutgoingShipmentAddProps = {};
type OutgoingShipmentAddState = {
	Products: Product[];
};
export default class OutgoingShipmentAdd extends React.Component<OutgoingShipmentAddProps, OutgoingShipmentAddState> {
	_productService: IProductService;
	constructor(props: OutgoingShipmentAddProps) {
		super(props);
		this._productService = new ProductService();
		this.state = {
			Products: [],
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit() {
		console.log('Outgoing Shipment Post');
	}
	render() {
		return (
			<div className='outgoing-add'>
			    <h5 className="app-head">Add Outgoing Shipment</h5>
				<ShipmentList Products={this.state.Products} handleSubmit={this.handleSubmit} ShouldLimitQuantity={true} />
			</div>
		);
	}
	componentDidMount() {
		this._productService.GetProductWithLimit().then(res => {
			this.setState({ Products: res.data });
		});
	}
}
