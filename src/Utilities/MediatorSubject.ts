import { ProductInfo } from 'Types/Mediator';
import { Flavour, OutOfStock, Product } from 'Types/DTO';
import FlavourMediator, { IFlavourMediator } from './FlavourMediator';
import QuantityMediator, { IQuantityMediator } from './QuantityMediator';
import ComponentProductMediator, { IProductMediator } from './ProductMediator';
import Observer from './Observer';
import { UnkownObserver } from 'Errors/Error';
import { observers } from '@politie/sherlock/symbols';

type SubscribedInfo = {
	FlavourId?: number; ProductId?: number; Quantity?: number; SubscriptonId: number, ComponentId: number
}
export default class MediatorSubject {
	private _observersInfo: SubscribedInfo[];

	private _productMediator: IProductMediator;
	private _flavourMediator: IFlavourMediator;
	private _quantityMediator: IQuantityMediator;

	constructor(products: Product[]) {
		this._productMediator = new ComponentProductMediator(products);
		this._flavourMediator = new FlavourMediator(products);
		this._quantityMediator = new QuantityMediator(products);
		this._observersInfo = [];
	}
	UnsubscribeAComponent(subscriptionId: number, componentId: number) {
		this._quantityMediator.Unsubscibe(subscriptionId, componentId);
		this._flavourMediator.Unsubscribe(subscriptionId, componentId);
		this._productMediator.Unsubscribe(subscriptionId, componentId);
	}
	UnregisteredObserverWithQuantities(OutofStocks: OutOfStock[]) {
		for (var i = 0; i < this._observersInfo.length; i++) {
			const observer = this._observersInfo[i];
			if (OutofStocks.find(e => e.FlavourId === observer.FlavourId && e.ProductId === observer.ProductId)) {
				this._quantityMediator.Unsubscibe(observer.SubscriptonId, observer.ComponentId);
			}
		}
	}
	GetSubscribedInfo(subscribeId: number, componentId: number): SubscribedInfo {
		const info = this._observersInfo.find(e => e.ComponentId === componentId && e.SubscriptonId === subscribeId);
		if (info) {
			return info;
		}
		throw new UnkownObserver(subscribeId, componentId);
	}
	Unsubscribe(subscriptionId: number) {
		this._flavourMediator.UnsubscribeASubscription(subscriptionId);
		this._productMediator.UnsubscribeASubscription(subscriptionId);
		this._quantityMediator.UnsubscribeASubscription(subscriptionId);
	}
	GetAObserver(subscriptionId: number, componentId: number) {
		const observer = new Observer(subscriptionId, componentId, this);
		this._observersInfo.push({ ComponentId: componentId, SubscriptonId: subscriptionId });
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
				const previoudFlavourId = this._flavourMediator.IsSubscribed(subscriptionId, componentId) ? this._flavourMediator.GetSubscribedFlavourId(subscriptionId, componentId) : undefined;
				const previousQuantityLimit = this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId) ? this._quantityMediator.GetQuantitySubscribed(subscriptionId, componentId) : undefined;
				flavourId = flavourId || previoudFlavourId;
				quantity = quantity || previousQuantityLimit;
			}
		} else {
			this._productMediator.Subscribe(subscriptionId, componentId, productId);
		}
		if (flavourId) {
			if (this._flavourMediator.IsSubscribed(subscriptionId, componentId)) {
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

			} else {
				this._flavourMediator.Subscribe(subscriptionId, componentId, productId, flavourId);
			}
		}
		if (quantity) {
			if (this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId)) {
				this._quantityMediator.ChangeQuantity(subscriptionId, componentId, productId, flavourId!, quantity);
			} else {
				this._quantityMediator.Subscribe(subscriptionId, componentId, productId, flavourId!, quantity);
			}
		}
		const observer = this._observersInfo.find(e => e.SubscriptonId === subscriptionId && e.ComponentId === componentId)!;
		observer.ProductId = productId;
		observer.FlavourId = flavourId;
		observer.Quantity = quantity;

	}
}
