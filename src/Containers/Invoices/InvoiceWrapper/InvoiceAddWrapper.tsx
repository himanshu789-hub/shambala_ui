import React, { ReactNode } from 'react';
import InvoiceAdd from '../InvoiceAdd/InvoiceAdd';
import { RouteComponentProps } from 'react-router-dom';
import MediatorSubject from 'Utilities/MediatorSubject';
import ProductService from 'Services/ProductService';
import IProductService from 'Contracts/services/IProductService';
import Action from 'Components/Action/Action';
import { ShopInvoice,Product } from 'Types/DTO';
interface IInvoiceAddWrapperProps extends RouteComponentProps {}
type InvoiceAddWrapperState = {
	Mediator: MediatorSubject;
	ShopSubscriber: ShopSubscriber[];
	Products: Product[];
};
type ShopSubscriber = {
	SubscriptionId: number;
	ShopInvcoice: ShopInvoice;
};
export default class InvoiceAddWrapper extends React.Component<IInvoiceAddWrapperProps, InvoiceAddWrapperState> {
	_productService: IProductService;
	constructor(props: IInvoiceAddWrapperProps) {
		super(props);
		this.state = {
			Mediator: new MediatorSubject([]),
			ShopSubscriber: [],
			Products: [],
		};
		this._productService = new ProductService();
	}
	AddASubscriber = () => {
		const NewSubscriber: ShopInvoice = { Invoices: [], SchemeId: -1, ShopId: -1 };
		this.setState(({ ShopSubscriber }) => {
			return { ShopSubscriber: [...ShopSubscriber, { ShopInvcoice: NewSubscriber, SubscriptionId: Math.random() }] };
		});
	};
	HandleDelete = (SubscriptionId: number) => {
		const {Mediator} = this.state;
		Mediator.Unsubscribe(SubscriptionId);
		this.setState(({ ShopSubscriber }) => {
			return { ShopSubscriber: ShopSubscriber.filter(e => e.SubscriptionId != SubscriptionId) };
		});
	};
	HandeShopInvoice = (SubscriptionId: number, ShopInvoice: ShopInvoice) => {
		this.setState(({ ShopSubscriber }) => {
			return {
				ShopSubscriber: ShopSubscriber.map(e => {
					if (e.SubscriptionId == SubscriptionId) return { ...e, ShopInvcoice: ShopInvoice };
					return e;
				}),
			};
		});
	};
	GetCaretSizeByProductId = (productId: number):number => {
		const { Products } = this.state;
		return Products.find(e=>e.Id==productId)?.CaretSize??0;
	};
	HandleProcess = () => {};
	render() {
		const { Mediator } = this.state;
		return (
			<div className='invoices'>
				<div className='d-flex flex-column'>
					{this.state.ShopSubscriber.map(e => (
						<InvoiceAdd
							SubscriptionId={e.SubscriptionId}
							Mediator={Mediator}
							key={e.SubscriptionId}
							HandleDelete={this.HandleDelete}
							ProvideShopInvoiceInfo={this.HandeShopInvoice}
							GetCaretSizeByProductId={this.GetCaretSizeByProductId}
						/>
					))}
				</div>
				<Action handleAdd={this.AddASubscriber} handleProcess={this.HandleProcess} />
			</div>
		);
	}
	componentDidMount() {
		this._productService
			.GetProductWithoutLimit()
			.then(res => this.setState({ Mediator: new MediatorSubject(res.data), Products: res.data }));
	}
}
