import { ProductInfo } from 'Types/Mediator';
import { Flavour, Product } from 'Types/Types';
import FlavourMediator, { IFlavourMediator } from './FlavourMediator';
import QuantityMediator, { IQuantityMediator } from './QuantityMediator';
import ComponentProductMediator, { IProductMediator } from './ProductMediator';
import Observer, { ReactComponent } from './Observer';

export default class MediatorSubject {
	private _observers: Observer[];

	private _productMediator: IProductMediator;
	private _flavourMediator: IFlavourMediator;
	private _quantityMediator: IQuantityMediator;
	constructor(products: Product[]) {
		this._productMediator = new ComponentProductMediator(products);
		this._flavourMediator = new FlavourMediator(products);
		this._quantityMediator = new QuantityMediator(products);
		this._observers = [];
	}
	UnsubscribeAComponent(subscriptionId: number, componentId: number) {
		this._flavourMediator.Unsubscribe(subscriptionId, componentId);
		this._productMediator.Unsubscribe(subscriptionId, componentId);
		this._quantityMediator.Unsubscibe(subscriptionId, componentId);
	}
	GetAObserver(subscriptionId: number, componentId: number) {
		const observer = new Observer(subscriptionId, componentId, this);
		this._observers.push(observer);
		return observer;
	}
	GetProducts(subscriptionId: number, componentId: number): ProductInfo[] {
		return this._productMediator.GetDefaultProductList(subscriptionId, componentId);
	}
	GetFlavours(subscriptionId: number, componentId: number, productId: number): Flavour[] {
		return this._flavourMediator.GetFlavours(subscriptionId, componentId, productId);
	}
	GetQuantity(productId: number, flavourId: number) {
		return this._quantityMediator.GetQuantityLimit(productId, flavourId);
	}
	UnsubscribeToQuantity(subscriptionId: number, componentId: number) {
		if (this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId))
			this._quantityMediator.Unsubscibe(subscriptionId, componentId);
	}
	SetASubscription(subscriptionId: number, componentId: number, productId: number, flavourId?: number, quantity?: number) {
		if (this._productMediator.IsAlreadySubscribed(subscriptionId, componentId)) {
			if (this._productMediator.ChangeSubscription(subscriptionId, componentId, productId)) {
				this._flavourMediator.IsSubscribed(subscriptionId, componentId) &&
					flavourId &&
					this._flavourMediator.Unsubscribe(subscriptionId, componentId);
			}
			if (flavourId) {
				if (this._flavourMediator.IsSubscribed(subscriptionId, componentId)) {
					const previoudFlavourId = this._flavourMediator.GetSUbscribedFlavourId(subscriptionId, componentId);
					if (this._flavourMediator.ChangeSubscription(subscriptionId, componentId, productId, flavourId)) {
						// this._flavourMediator.IsFlavourExhausted(subscriptionId,productId) &&
						// 	this._flavourMediator.RestoreFlavour(productId, previoudFlavourId) &&
						// 	this._productMediator.IsProductDeleted(productId) &&
						// 	this._productMediator.RestoreProduct(productId);
						this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId) &&
							this._quantityMediator.Unsubscibe(subscriptionId, componentId);
					}
					// if (this._flavourMediator.IsFlavourExhausted(productId)) {
					// 	//this._productMediator.DeleteProduct(productId);
					// }
					if (quantity) {
						if (this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId)) {
							this._quantityMediator.ChangeQuantity(subscriptionId, componentId, productId, flavourId, quantity);
						} else {
							this._quantityMediator.Subscribe(subscriptionId, componentId, productId, flavourId, quantity);
						}
					}
				} else {
					this._flavourMediator.Subscribe(subscriptionId, componentId, productId, flavourId);
				}
			}
		} else {
			this._productMediator.Subscribe(subscriptionId, componentId, productId);
		}
	}
}
