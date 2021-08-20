import { ProductInfo } from 'Types/Mediator';
import { Flavour } from 'Types/DTO';
import MediatorSubject from './MediatorSubject';
import { DeterminantsNotSetError } from 'Errors/Error';

//export type ReactComponent = Component<any, any>;

export default class Observer {
	readonly ComponentId: number;
	readonly SubscriptionId: number;
	private _subject: MediatorSubject;
	//	private _component?: ReactComponent;

	constructor(subscriptionId: number, componentId: number, subject: MediatorSubject) {
		this.SubscriptionId = subscriptionId;
		this.ComponentId = componentId;
		this._subject = subject;
	}

	GetObserverInfo() {
		return this._subject.GetSubscribedInfo(this.SubscriptionId, this.ComponentId);
	}
	// SetComponent(component: ReactComponent) {
	// 	this._component = component;
	// }

	GetProducts(): ProductInfo[] {
		return this._subject.GetProducts(this.SubscriptionId, this.ComponentId);
	}

	GetQuantityLimit(): number {
		const info = this.GetObserverInfo();
		if (!info.ProductId && !info.FlavourId) {
			throw new DeterminantsNotSetError();
		}
		return this._subject.GetQuantity(info.ProductId as number, info.FlavourId as number);
	}
	Unubscribe() {
		if (!(this.ComponentId && this.SubscriptionId)) {
			return;
		}
		this._subject.UnsubscribeAComponent(this.SubscriptionId, this.ComponentId);
	}
	UnsubscribeIfSubscribedToQuantity() {
		const info = this.GetObserverInfo();
		if (!(info.ProductId && info.FlavourId)) {
			throw new DeterminantsNotSetError();
		}
		this._subject.UnsubscribeToQuantity(this.SubscriptionId as number, this.ComponentId as number);
	}

	GetFlavours(): Flavour[] {
		const info = this.GetObserverInfo();
		if (!info.ProductId) {
			throw new DeterminantsNotSetError()
		}
		return this._subject.GetFlavours(this.SubscriptionId, this.ComponentId, info.ProductId!);
	}
	SetProduct(Id: number): void {
		this._subject.SetAProduct(this.SubscriptionId, this.ComponentId, Id);
	}
	SetFlavour(Id: number) {
		this._subject.SetAFlavour(this.SubscriptionId, this.ComponentId, Id);
	}
	SetQuantity(quantity: number) {
		this._subject.SetAQuantity(this.SubscriptionId, this.ComponentId, quantity);
	}
}
