import React, { ReactNode } from 'react';
import InvoiceAdd from '../InvoiceAdd/InvoiceAdd';
import { RouteComponentProps } from 'react-router-dom';
import MediatorSubject from 'Utilities/MediatorSubject';
import ProductService from 'Services/ProductService';
import IProductService from 'Contracts/services/IProductService';
import Action from 'Components/Action/Action';
import { ShopInvoice, Product, SoldItem } from 'Types/DTO';
import { InvoiceContext } from './Context';
import Observer from 'Utilities/Observer';
import Loader, { ApiStatusInfo, CallStatus } from 'Components/Loader/Loader';
interface IInvoiceAddWrapperProps extends RouteComponentProps { }


type InvoiceAddWrapperState = {
	Mediator: MediatorSubject;
	ShopSubscribers: ShopSubscriber[];
	Products: Product[];
	InvoiceMappedObserver: Map<number, Observer[]>;
	ApiStatus: ApiStatusInfo;
};
type ShopSubscriber = {
	SubscriptionId: number;
	ShopInvcoice: ShopInvoice;
	IsShopUnique?: boolean;
};

export default class InvoiceAddWrapper extends React.Component<IInvoiceAddWrapperProps, InvoiceAddWrapperState> {
	_productService: IProductService;
	constructor(props: IInvoiceAddWrapperProps) {
		super(props);
		this.state = {
			Mediator: new MediatorSubject([]),
			ShopSubscribers: [],
			Products: [],
			ApiStatus: { Status: CallStatus.EMPTY, Message: '' },
			InvoiceMappedObserver: new Map()
		};
		this._productService = new ProductService();
	}
	GetObserverBySubscriptionAndComponentId = (subscriptionId: number, componentId: number): Observer => {
		const { InvoiceMappedObserver } = this.state;
		return ((InvoiceMappedObserver.get(subscriptionId) as Observer[]).find(e => e.GetObserverInfo().ComponentId === componentId)) as Observer;
	}
	AddASubscriber = () => {
		const { InvoiceMappedObserver, Mediator } = this.state;
		const NewSubscriptionId = Math.random();
		InvoiceMappedObserver.set(NewSubscriptionId, []);
		const NewSubscriber: ShopInvoice = { Invoices: [], SchemeId: undefined, ShopId: undefined };
		this.setState(({ ShopSubscribers: ShopSubscriber }) => {
			return { ShopSubscribers: [...ShopSubscriber, { ShopInvcoice: NewSubscriber, SubscriptionId: NewSubscriptionId }] };
		});
	};
	AddASubscriberComponent = (subscriptionId: number) => {
		const { Mediator, InvoiceMappedObserver } = this.state;
		const ComponentId = Math.random() * 10;
		const Observer = Mediator.GetAObserver(subscriptionId, ComponentId);
		const { ShopSubscribers: ShopSubscriber } = this.state;
		const Observers = InvoiceMappedObserver.get(subscriptionId) as Observer[];
		Observers.push(Observer);
		const ShopInvoice = ShopSubscriber.find(e => e.SubscriptionId == subscriptionId)?.ShopInvcoice as ShopInvoice;
		ShopInvoice.Invoices.push({ CaretSize: 0, FlavourId: -1, ProductId: -1, Id: ComponentId, Quantity: 0 });
		this.setState({ ShopSubscribers: ShopSubscriber });
	}
	HandleDelete = (SubscriptionId: number) => {
		const { Mediator } = this.state;
		Mediator.Unsubscribe(SubscriptionId);

		this.setState(({ ShopSubscribers: ShopSubscriber }) => {
			return { ShopSubscribers: ShopSubscriber.filter(e => e.SubscriptionId != SubscriptionId) };
		});

	};
	HandleComponentDelete = (subscriptionId: number, componentId: number) => {
		const { Mediator, InvoiceMappedObserver, ShopSubscribers: ShopSubscriber } = this.state;
		const Observers = (InvoiceMappedObserver.get(subscriptionId) as Observer[]).filter(e => e.GetObserverInfo().ComponentId != componentId);
		InvoiceMappedObserver.set(subscriptionId, Observers);
		Mediator.UnsubscribeAComponent(subscriptionId, componentId);
		const ShopInvoice = ShopSubscriber.find(e => e.SubscriptionId === subscriptionId)?.ShopInvcoice as ShopInvoice;
		ShopInvoice.Invoices = ShopInvoice.Invoices.filter(e => e.Id !== componentId);
		this.setState({ ShopSubscribers: ShopSubscriber });
	}
	componentWillUpdate() {
		console.log('invoice Add Wrapper updating');
	}
	HandeShopInvoice = (SubscriptionId: number, ComponentId: number, name: string, value: any) => {
		const { ShopSubscribers: ShopSubscriber } = this.state;
		const ShopInvoice = ShopSubscriber.find(e => e.SubscriptionId == SubscriptionId)?.ShopInvcoice as ShopInvoice;
		let SoldItem = ShopInvoice.Invoices.find(e => e.Id == ComponentId) as SoldItem;
		// if (name == 'FlavourId') {
		// 	Mediator.SetASubscription(SubscriptionId, ComponentId, SoldItem.ProductId, value);
		// }
		// else if (name == 'ProductId') {
		// 	Mediator.SetASubscription(SubscriptionId, ComponentId, value);
		// }
		// else if (name == 'Quantity') {
		// 	Mediator.SetASubscription(SubscriptionId, ComponentId, SoldItem.ProductId, SoldItem.FlavouId, value);
		// }
		if (name == "ProductId") {
			SoldItem.CaretSize = this.GetCaretSizeByProductId(value);
		}
		if (Object.keys(SoldItem).includes(name)) {
			ShopInvoice.Invoices = ShopInvoice.Invoices.map(e => {
				if (e.Id == ComponentId)
					return { ...SoldItem, [name]: value };
				else return e;
			})
		}
		SoldItem = { ...SoldItem, [name]: value };
		this.setState({ ShopSubscribers: ShopSubscriber }, () => console.log("Handle CHanged Executed"));
		console.log('Handle CHanged Out');
	};
	HandleShopOrSchemeChange = (subscriptionId: number, name: string, value: any) => {
		const { ShopSubscribers: ShopSubscriber } = this.state;
		const CurrentShupscriber = ShopSubscriber.find(e => e.SubscriptionId == subscriptionId) as ShopSubscriber;

		const ShopInvoice = CurrentShupscriber.ShopInvcoice as ShopInvoice;
		if (Object.keys(ShopInvoice).includes(name)) {
			if (name == "ShopId") {
				const IsAlreadySelected = ShopSubscriber.find(e => e.ShopInvcoice.ShopId == value) != null;
				if (IsAlreadySelected)
					CurrentShupscriber.IsShopUnique = false;
				else
					CurrentShupscriber.IsShopUnique = true;
			}
			(ShopInvoice as any)[name] = value;
		}
		this.setState({ ShopSubscribers: ShopSubscriber });
	}

	GetCaretSizeByProductId = (productId: number): number => {
		const { Products } = this.state;
		return Products.find(e => e.Id == productId)?.CaretSize ?? 0;
	};
	HandleSubmit = () => { };
	render() {
		const { ApiStatus: { Status, Message } } = this.state;
		return (
			<Loader Status={Status} Message={Message}>
				<div className='invoices'>
					<div className='d-flex flex-column'>

						<InvoiceContext.Provider value={{
							GetObserverBySubscriberAndComponentId: this.GetObserverBySubscriptionAndComponentId,
							HandleChange: this.HandeShopInvoice
							// HandleShopOrSchemeChange: this.HandleShopOrSchemeChange,
							// HandleComponentDelete:this.HandleComponentDelete,
							// AddASoldItem: this.AddASubscriberComponent
						}}>

							{this.state.ShopSubscribers.map(e => (

								<InvoiceAdd
									SubscriptionId={e.SubscriptionId}
									key={e.SubscriptionId}
									HandleDelete={this.HandleDelete}
									ShopInvoice={e.ShopInvcoice}
									AddASubscriberComponent={this.AddASubscriberComponent}
									HandleShopOrSchemeChange={this.HandleShopOrSchemeChange}
									IsShopAlreadySelected={e.IsShopUnique != undefined ? !e.IsShopUnique : undefined}
									GetCaretSizeByProductId={this.GetCaretSizeByProductId}
									HandleComponentDelete={this.HandleComponentDelete}
								/>


							))}
						</InvoiceContext.Provider>
					</div>
					<Action handleAdd={this.AddASubscriber} handleProcess={this.HandleSubmit} />

				</div>
			</Loader>
		);
	}
	componentDidMount() {
		this.setState({ ApiStatus: { Status: CallStatus.LOADING, Message: 'Gathering Shipment Product Info' } });
		this._productService
			.GetProductWithLimit()
			.then(res => this.setState({ Mediator: new MediatorSubject(res.data), Products: res.data, ApiStatus: { Status: CallStatus.LOADED, Message: '' } })).catch(() => this.setState({ ApiStatus: { Status: CallStatus.LOADED, Message: undefined } }));
	}
}
