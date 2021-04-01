import React, { ChangeEvent, SyntheticEvent } from 'react';
import { Product } from 'Types/Product';
import { IShipmentElement } from 'Types/ShipmentElement';
import ShipmentList from 'Components/ShipmentList/ShipmentList';
import ProductService from 'Services/ProductService';
import IProductService from 'Contracts/services/IProductService';

type IIncomingAddProps = {};
type IIncomingAddState = {
	Products: Array<Product>;
};

export default class IncomingAdd extends React.Component<IIncomingAddProps, IIncomingAddState> {
	_productService: IProductService;
	constructor(props: IIncomingAddProps) {
		super(props);
		this.state = {
			Products: [],
		};
		this._productService = new ProductService();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {
		const element = document.getElementsByClassName('is-invalid');
		if (element.length > 0) {
			console.log('Invalid Form');
		} else {
			console.log('Valid Form');
		}
	}

	render() {
		const { Products } = this.state;
		return (
			<div className="incmoming-add">
				<ShipmentList Products={Products} handleSubmit={this.handleSubmit} />
			</div>
		);
	}

	componentDidMount() {
		this._productService.GetAll().then(res => {
			if (res.data.length > 0) {
				this.setState({ Products: res.data ?? [] });
			}
		});
	}
}