import { CallStatus } from 'Components/Loader/Loader';
import IOutgoingService from 'Contracts/Services/IOutgoingShipmentService';
import React from 'react';
import OutgoingService from 'Services/OutgoingShipmentService';
import { OutgoingShipmentDetails, Shop, ShopInvoice } from 'Types/DTO';
import { RouteComponentProps } from 'react-router-dom';
import ShopSelector from './Containers/ShopSelector/ShopSelector';
import InvoiceScheme from './Containers/InvoiceScheme/InvoiceScheme';
import ShipmentList from 'Components/ShipmentList/ShipmentList';
import { IShipmentElement, Product } from 'Types/Types';
import IProductService from 'Contracts/Services/IProductService';
import ProductService from 'Services/ProductService';

interface IInvoiceProps extends RouteComponentProps {}
type InvoicesState = {
	APIStatus: number;
	ShopInvoice: ShopInvoice;
	Products: Product[];
};
export default class Invoice extends React.Component<IInvoiceProps, InvoicesState> {
	_productService:IProductService;
	constructor(props: IInvoiceProps) {
		super(props);
		this.state = {
			APIStatus: CallStatus.EMPTY,
			ShopInvoice: { SchemeId: -1, Shipments: [], ShopId: -1 },
			Products: [],
		};
		this._productService = new ProductService();
	}
	handleSelection = (name: string, value: any) => {
		switch (name) {
			case 'ShopId':
				this.setState(({ ShopInvoice }) => {
					return { ShopInvoice: { ...ShopInvoice, ShopId: value } };
				});
				break;
			case 'SchemeId':
				this.setState(({ ShopInvoice }) => {
					return { ShopInvoice: { ...ShopInvoice, SchemeId: value } };
				});
				break;
			default:
				break;
		}
	};
	IsAllValid = (): boolean => {
		let IsAllValid = true;
		if (this.state.ShopInvoice.SchemeId == -1 || this.state.ShopInvoice.ShopId == -1 || !this.state.ShopInvoice.Shipments.length)
			IsAllValid = false;
		return IsAllValid;
	};
	handleSubmit=(shipments:IShipmentElement[])=>{
		this.setState(({ShopInvoice})=>{return {ShopInvoice:{...ShopInvoice,Shipments:shipments}}});
	}
	render() {
		const {
			ShopInvoice: { ShopId, SchemeId },Products
		} = this.state;
		return (
			<div>
				<ShopSelector handleSelection={this.handleSelection} />
				<InvoiceScheme handleSchemeSelection={this.handleSelection} ShopId={this.state.ShopInvoice.ShopId} />
				{ShopId != -1 && SchemeId != -1 && <ShipmentList Products={Products} ShouldLimitQuantity={false} handleSubmit={this.handleSubmit}/>}
			</div>
		);
	}
}
