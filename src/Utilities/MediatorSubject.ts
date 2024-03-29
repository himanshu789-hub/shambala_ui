import { ProductInfo } from 'Types/Mediator';
import { Flavour, OutOfStock, Product } from 'Types/DTO';
import FlavourMediator, { IFlavourMediator } from './FlavourMediator';
import QuantityMediator, { IQuantityMediator } from './QuantityMediator';
import ComponentProductMediator, { IProductMediator } from './ProductMediator';
import Observer from './Observer';
import { DeterminantsNotSetError, FlavourOccupiedError, QuantityLimitExceeded, UnIdentityFlavourError, UnkownObserver } from 'Errors/Error';

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
		const observer = this._findObserver(subscriptionId, componentId);

		observer.Quantity && this._quantityMediator.Unsubscibe(subscriptionId, componentId);
		observer.FlavourId && this._flavourMediator.Unsubscribe(subscriptionId, componentId);
		observer.ProductId && this._productMediator.Unsubscribe(subscriptionId, componentId);
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
	GetQuantityLimit(productId: number, flavourId: number) {
		return this._quantityMediator.GetQuantityLimit(productId, flavourId);
	}
	UnsubscribeToQuantity(subscriptionId: number, componentId: number) {
		if (this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId))
			this._quantityMediator.Unsubscibe(subscriptionId, componentId);
	}
	SetAProduct(subscriptionId: number, componentId: number, productId: number) {
		let flavourId: number | undefined, quantity, previousProductId;

		if (this._productMediator.IsAlreadySubscribed(subscriptionId, componentId)) {
			previousProductId = this._productMediator.GetSubscribedProduct(subscriptionId, componentId);
			if (this._productMediator.ChangeSubscription(subscriptionId, componentId, productId)) {
				if (this._flavourMediator.IsSubscribed(subscriptionId, componentId)) {
					flavourId = this._flavourMediator.GetSubscribedFlavourId(subscriptionId, componentId);
					quantity = this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId) ? this._quantityMediator.GetQuantitySubscribed(subscriptionId, componentId) : undefined;
					this._flavourMediator.Unsubscribe(subscriptionId, componentId);
					quantity && this._quantityMediator.Unsubscibe(subscriptionId, componentId);
				}
				if (flavourId) {
					let IsFlavourExists = true;
					try {
						IsFlavourExists = this._flavourMediator.IsFlavourAvailable(subscriptionId, productId, flavourId)
					}
					catch (e) {
						if (e instanceof UnIdentityFlavourError) {
							IsFlavourExists = false;
							flavourId = undefined;
						}
						else
							throw e;
					}
					if (IsFlavourExists) {
						this._flavourMediator.Subscribe(subscriptionId, componentId, productId, flavourId!);
						if (quantity) {
							const limit = this._quantityMediator.GetQuantityLimit(productId, flavourId!);
							if (quantity <= limit) {
								this._quantityMediator.Subscribe(subscriptionId, componentId, productId, flavourId!, quantity);
							}
						}
					}
					else {
						flavourId = undefined;
						quantity = undefined;
					}
				}
			}
		} else {
			this._productMediator.Subscribe(subscriptionId, componentId, productId);
		}
		const subscriptionInfo = this._observersInfo.find(e => e.SubscriptonId === subscriptionId && e.ComponentId === componentId)!;
		subscriptionInfo.ProductId = productId;
		subscriptionInfo.FlavourId = flavourId;
		subscriptionInfo.Quantity = quantity;
	}
	private _findObserver(subscibeId: number, componentId: number): SubscribedInfo {
		const observer = this._observersInfo.find(e => e.SubscriptonId === subscibeId && e.ComponentId === componentId);
		if (observer !== undefined)
			return observer;
		throw new UnkownObserver(subscibeId, componentId);
	}
	SetAFlavour(subscribeId: number, componentId: number, flavourId: number) {
		const observer = this._findObserver(subscribeId, componentId);
		if (!observer.ProductId)
			throw new DeterminantsNotSetError();

		const productId = this._productMediator.GetSubscribedProduct(subscribeId, componentId);
		if (!this._flavourMediator.IsFlavourExists(productId, flavourId))
			throw new UnIdentityFlavourError(productId, flavourId);
		let quantity:number|undefined = undefined;
		if (this._flavourMediator.IsSubscribed(subscribeId, componentId)) {
			if (this._flavourMediator.ChangeSubscription(subscribeId, componentId, productId, flavourId)) {
				if (this._quantityMediator.IsQuantitySubscribed(subscribeId, componentId)) {
					 quantity = this._quantityMediator.GetQuantitySubscribed(subscribeId, componentId)!;
					try {
						this._quantityMediator.ChangeQuantity(subscribeId, componentId, productId, flavourId, quantity);
					}
					catch (e) {
                        if(e instanceof QuantityLimitExceeded){
							quantity = undefined;
							this._quantityMediator.Unsubscibe(subscribeId,componentId);
						}
					}
				}
			}
		}
		else
			this._flavourMediator.Subscribe(subscribeId, componentId, productId, flavourId);
		const subscriptionInfo = this._findObserver(subscribeId, componentId);
		subscriptionInfo.FlavourId = flavourId;
		subscriptionInfo.Quantity = quantity;
	}
	SetAQuantity(subscribeId: number, componentId: number, quantity: number) {
		const subscriptionInfo = this._findObserver(subscribeId, componentId);
		const productId = subscriptionInfo.ProductId;
		const flavourId = subscriptionInfo.FlavourId;
		if (!productId || !flavourId)
			throw new DeterminantsNotSetError();

		if (this._quantityMediator.IsQuantitySubscribed(subscribeId, componentId)) {
			this._quantityMediator.ChangeQuantity(subscribeId, componentId, productId, flavourId, quantity)
		}
		else {
			this._quantityMediator.Subscribe(subscribeId, componentId, productId, flavourId, quantity);
		}
		this._findObserver(subscribeId, componentId).Quantity = quantity;
	}
	// SetASubscription(subscriptionId: number, componentId: number, productId: number, flavourId?: number, quantity?: number) {
	// 	const IsFlavourNull = !flavourId;
	// 	const IsQuantityNull = !quantity;
	// 	if (this._productMediator.IsAlreadySubscribed(subscriptionId, componentId)) {
	// 		if (this._productMediator.ChangeSubscription(subscriptionId, componentId, productId)) {
	// 			if (this._flavourMediator.IsSubscribed(subscriptionId, componentId)) {
	// 				flavourId = flavourId || this._flavourMediator.GetSubscribedFlavourId(subscriptionId, componentId);
	// 				quantity = quantity || this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId) ? this._quantityMediator.GetQuantitySubscribed(subscriptionId, componentId) : undefined;
	// 			}
	// 		}
	// 	} else {
	// 		this._productMediator.Subscribe(subscriptionId, componentId, productId);
	// 	}
	// 	if (flavourId) {
	// 		if (this._flavourMediator.IsSubscribed(subscriptionId, componentId)) {
	// 			try {
	// 				if (this._flavourMediator.ChangeSubscription(subscriptionId, componentId, productId, flavourId)) {
	// 					// this._flavourMediator.IsFlavourExhausted(subscriptionId,productId) &&
	// 					// 	this._flavourMediator.RestoreFlavour(productId, previoudFlavourId) &&
	// 					// 	this._productMediator.IsProductDeleted(productId) &&
	// 					// 	this._productMediator.RestoreProduct(productId);
	// 					this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId) &&
	// 						this._quantityMediator.Unsubscibe(subscriptionId, componentId);
	// 				}
	// 				// if (this._flavourMediator.IsFlavourExhausted(productId)) {
	// 				// 	//this._productMediator.DeleteProduct(productId);
	// 				// }
	// 			}
	// 			catch (e) {
	// 				if (IsFlavourNull && (e instanceof UnIdentityFlavourError || e instanceof FlavourOccupiedError)) {
	// 					this._flavourMediator.Unsubscribe(subscriptionId, componentId);
	// 					this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId) && this._quantityMediator.Unsubscibe(subscriptionId, componentId)
	// 					flavourId = undefined;
	// 				}
	// 				else
	// 					throw e;
	// 			}

	// 		} else {
	// 			this._flavourMediator.Subscribe(subscriptionId, componentId, productId, flavourId);
	// 		}
	// 	}
	// 	if (quantity) {
	// 		if (this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId)) {
	// 			try {
	// 				this._quantityMediator.ChangeQuantity(subscriptionId, componentId, productId, flavourId!, quantity);
	// 			}
	// 			catch (e) {
	// 				if (IsQuantityNull && e instanceof QuantityLimitExceeded) {
	// 					this._quantityMediator.Unsubscibe(subscriptionId, componentId);
	// 					quantity = undefined;
	// 				}
	// 				else
	// 					throw e;
	// 			}
	// 		} else {
	// 			this._quantityMediator.Subscribe(subscriptionId, componentId, productId, flavourId!, quantity);
	// 		}
	// 	}
	// 	const observer = this._observersInfo.find(e => e.SubscriptonId === subscriptionId && e.ComponentId === componentId)!;
	// 	observer.ProductId = productId;
	// 	observer.FlavourId = flavourId;
	// 	observer.Quantity = quantity;
	// }
}
