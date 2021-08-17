import { ProductInfo } from 'Types/Mediator';
import { Flavour } from 'Types/DTO';
import MediatorSubject from './MediatorSubject';
import { DeterminantsNotSetError } from 'Errors/Error';

//export type ReactComponent = Component<any, any>;

export default class Observer {
	public _componentId: number;
	public _subscriptionId: number;
	private _subject: MediatorSubject;
	private flavourId?: number;
	private productId?: number;
	//	private _component?: ReactComponent;
	constructor(subscriptionId: number, componentId: number, subject: MediatorSubject) {
		this._subscriptionId = subscriptionId;
		this._componentId = componentId;
		this._subject = subject;
	}
	GetObserverInfo() {
		return this._subject.GetSubscribedInfo(this._subscriptionId, this._componentId);
	}
	// SetComponent(component: ReactComponent) {
	// 	this._component = component;
	// }

	GetProduct(): ProductInfo[] {
		return this._subject.GetProducts(this._subscriptionId, this._componentId);
	}

	GetQuantityLimit(): number {
		const info = this.GetObserverInfo();
		if (!info.ProductId && !info.FlavourId) {
			throw new DeterminantsNotSetError();
		}
		return this._subject.GetQuantity(info.ProductId as number, info.FlavourId as number);
	}
	Unubscribe() {
		if (!(this._componentId && this._subscriptionId)) {
			return;
		}
		this._subject.UnsubscribeAComponent(this._subscriptionId, this._componentId);
		this.productId = undefined;
	}
	UnsubscribeToQuantity() {
		const info = this.GetObserverInfo();
		if (!(info.ProductId && info.FlavourId)) {
			throw new DeterminantsNotSetError();
		}
		this._subject.UnsubscribeToQuantity(this._subscriptionId as number, this._componentId as number);
	}

	GetFlavours(): Flavour[] {
		const info = this.GetObserverInfo();
		if (!info.ProductId) {
			throw new DeterminantsNotSetError()
		}
		return this._subject.GetFlavours(this._subscriptionId, this._componentId, info.ProductId!);
	}
	SetProduct(Id: number): void {
		this._subject.SetASubscription(this._subscriptionId, this._componentId, Id);
	}
	SetFlavour(Id: number) {
		const info = this.GetObserverInfo();
		if (!info.ProductId) {
			throw new DeterminantsNotSetError();
		}
		else
			this._subject.SetASubscription(this._subscriptionId, this._componentId, info.ProductId as number, Id);
	}
	SetQuantity(quantity: number) {
		const info = this.GetObserverInfo();
		if (!info.ProductId || !info.FlavourId) {
			throw new DeterminantsNotSetError();
		}
		this._subject.SetASubscription(this._subscriptionId, this._componentId, info.ProductId, info.FlavourId, quantity);
	}
}
