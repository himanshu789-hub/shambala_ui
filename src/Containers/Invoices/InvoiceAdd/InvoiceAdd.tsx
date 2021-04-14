import React from 'react';
import { CallStatus } from 'Components/Loader/Loader';
import ShopSelector from './Containers/ShopSelector/ShopSelector';
import InvoiceScheme from './Containers/InvoiceScheme/InvoiceScheme';
import IProductService from 'Contracts/Services/IProductService';
import ProductService from 'Services/ProductService';
import RowsWrapper from './Containers/RowsWrapper/RowsWrapper';
import MediatorSubject from 'Utilities/MediatorSubject';
import { ShopInvoice, SoldItem } from '../../../Types/DTO';


interface IInvoiceProps {
	Mediator: MediatorSubject;
	SubscriptionId: number;
	HandleDelete: (SubscriptionId: number) => void;
	ProvideShopInvoiceInfo: (subscriptionId: number, ShopInvoice: ShopInvoice) => void;
}
type InvoicesState = {
	APIStatus: number;
	ShopInvoice: ShopInvoice;
};
export default class InvoiceAdd extends React.Component<IInvoiceProps, InvoicesState> {
	_productService: IProductService;
	constructor(props: IInvoiceProps) {
		super(props);
		this.state = {
			APIStatus: CallStatus.EMPTY,
			ShopInvoice: { SchemeId: undefined, Invoices: [], ShopId: undefined },
		};
		this._productService = new ProductService();
	}
	handleSelection = (name: string, value: any) => {
		const { ProvideShopInvoiceInfo, SubscriptionId } = this.props;
		switch (name) {
			case 'ShopId':
				this.setState(
					({ ShopInvoice }) => {
						return { ShopInvoice: { ...ShopInvoice, ShopId: value } };
					},
					() => ProvideShopInvoiceInfo(SubscriptionId, this.state.ShopInvoice),
				);
				break;
			case 'SchemeId':
				this.setState(
					({ ShopInvoice }) => {
						return { ShopInvoice: { ...ShopInvoice, SchemeId: value } };
					},
					() => ProvideShopInvoiceInfo(SubscriptionId, this.state.ShopInvoice),
				);
				break;
			default:
				break;
		}
	};
	HandleInvoiceItemAdded=(Invoices: SoldItem[])=> {
		const { ProvideShopInvoiceInfo, SubscriptionId } = this.props;
		const { ShopInvoice } = this.state;
		this.setState(({ ShopInvoice }) => {
			return { ShopInvoice: { ...ShopInvoice, Invoices: Invoices } };
		});
		ProvideShopInvoiceInfo(SubscriptionId, { ...ShopInvoice, Invoices: Invoices });
	}
	render() {
		const {
			ShopInvoice: { ShopId, SchemeId },
		} = this.state;
		const { Mediator, SubscriptionId, HandleDelete } = this.props;
		return (
			<div className='card'>
				<div className='card-head d-flex justify-content-between'>
					<ShopSelector handleSelection={this.handleSelection} />
					<button className='btn btn-danger'>
						<i className='fa fa-times' onClick={() => HandleDelete(SubscriptionId)}></i>
					</button>
				</div>
				<div className='card-body'>
					{ShopId && <InvoiceScheme handleSchemeSelection={this.handleSelection} ShopId={this.state.ShopInvoice.ShopId} />}
					{ShopId && SchemeId && (
						<RowsWrapper mediator={Mediator} subscriptionId={SubscriptionId} ProvideShopItemToHOC={this.HandleInvoiceItemAdded} />
					)}
				</div>
			</div>
		);
	}
	componentDidMount() {}
}
