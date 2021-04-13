import { CallStatus } from 'Components/Loader/Loader';
import React from 'react';
import { ShopInvoice } from 'Types/DTO';
import { RouteComponentProps } from 'react-router-dom';
import ShopSelector from './Containers/ShopSelector/ShopSelector';
import InvoiceScheme from './Containers/InvoiceScheme/InvoiceScheme';
import ShipmentList from 'Components/ShipmentList/ShipmentList';
import { IShipmentElement, Product } from 'Types/Types';
import IProductService from 'Contracts/Services/IProductService';
import ProductService from 'Services/ProductService';
import RowsWrapper from './Containers/ItemsWrapper/RowsWrapper';
import MediatorSubject from 'Utilities/MediatorSubject';

interface IInvoiceProps extends RouteComponentProps {
	Mediator: MediatorSubject;
	SubscriptionId: number;
}
type InvoicesState = {
	APIStatus: number;
	ShopInvoice: ShopInvoice;
	Products: Product[];
};
export default class Invoice extends React.Component<IInvoiceProps, InvoicesState> {
	_productService: IProductService;
	constructor(props: IInvoiceProps) {
		super(props);
		this.state = {
			APIStatus: CallStatus.EMPTY,
			ShopInvoice: { SchemeId: undefined, Shipments: [], ShopId: undefined },
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
	handleSubmit = (shipments: IShipmentElement[]) => {
		this.setState(({ ShopInvoice }) => {
			return { ShopInvoice: { ...ShopInvoice, Shipments: shipments } };
		});
	};
	render() {
		const {
			ShopInvoice: { ShopId, SchemeId },
			Products,
		} = this.state;
		const { Mediator, SubscriptionId } = this.props;
		return (
			<div className='card'>
				<div className='card-head'>
					<ShopSelector handleSelection={this.handleSelection} />
				</div>
				<div className='card-body'>
					{ShopId && <InvoiceScheme handleSchemeSelection={this.handleSelection} ShopId={this.state.ShopInvoice.ShopId} />}
					{ShopId && SchemeId && <RowsWrapper mediator={Mediator} subscriptionId={SubscriptionId} />}
				</div>
			</div>
		);
	}
	componentDidMount() {
		this._productService.GetAll().then(res => this.setState({ Products: res.data }));
	}
}
