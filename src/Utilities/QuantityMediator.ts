import { AlreadySubscribedError, QuantityLimitExceeded, UnIdentifyComponentError, UnIdentityFlavourError, UnknownSubscription } from 'Errors/Error';
import { Flavour, Product } from 'Types/DTO';

type QuantityFlavourInfo = {
	FlavourId: number;
	ProductId: number;
	Quantity: number;
};
export interface IQuantityMediator {
	GetQuantityLimit(productId: number, flavourId: number): number;
	Unsubscibe(subscriptionId: number, componentId: number): void;
	ChangeQuantity(subscriptionId: number, componentId: number, productId: number, flavourId: number, quantity: number): boolean;
	Subscribe(subscriptionId: number, componentId: number, productId: number, flavourId: number, quantity: number): void;
	IsQuantitySubscribed(subscriptionId: number, componentId: number): boolean;
	UnsubscribeASubscription(subscriptionId: number): boolean;
	GetQuantitySubscribed(subscriptionId: number, componentId: number): number | undefined;
}
type QuantityInfo = Map<number, Map<number, QuantityFlavourInfo>>;

export default class QuantityMediator implements IQuantityMediator {
	_productsWithFlavourLimit: Map<number, Flavour[]>;
	_cloneProductWithFlavourList: Map<number, Flavour[]>;
	_componentQuantity: QuantityInfo;

	constructor(products: Product[]) {
		this._componentQuantity = new Map();
		this._productsWithFlavourLimit = new Map();
		this._cloneProductWithFlavourList = new Map();
		for (let i = 0; i < products.length; i++) {
			const Product = products[i];
			let CloneFlavours = [];
			for (let j = 0; j < Product.Flavours.length; j++) CloneFlavours.push({ ...Product.Flavours[j] });
			this._productsWithFlavourLimit.set(Product.Id, CloneFlavours);
			this._cloneProductWithFlavourList.set(Product.Id, [...CloneFlavours]);
		}
	}
	GetQuantitySubscribed(subscriptionId: number, componentId: number): number | undefined {
		return this._componentQuantity.get(subscriptionId)?.get(componentId)?.Quantity;
	}
	UnsubscribeASubscription(subscriptionId: number): boolean {
		this._checkArgumentNullException(subscriptionId);
		this._checkSubscription(subscriptionId);

		const SubscriptionMappedCOmponent = this._componentQuantity.get(subscriptionId);
		Array.from(SubscriptionMappedCOmponent!).forEach((value) => {
			const componentId = value[0];
			this.Unsubscibe(subscriptionId, componentId);
		});
		this._componentQuantity.delete(subscriptionId);
		return true;
	}
	IsQuantitySubscribed(subscriptionId: number, componentId: number): boolean {
		const ComponentMapQUantity = this._componentQuantity.get(subscriptionId);
		if (!ComponentMapQUantity) return false;
		return ComponentMapQUantity.has(componentId);
	}
	private _checkSubscription(subscribeId: number) {
		if (!this._componentQuantity.has(subscribeId)) throw new UnknownSubscription();
	}

	private _checkArgumentNullException(...params: number[]) {
		for (let i = 0; i < params.length; i++) if (!params[i]) throw new Error('Argument Not Set');
	}
	private _deductQuantity(productId: number, flavourId: number, quantity: number) {
		const Flavours = this._productsWithFlavourLimit.get(productId) as Flavour[];
		((Flavours.find(e => e.Id === flavourId) as Flavour).Quantity as number) -= quantity;
	}
	private _restoreQuantity(productId: number, flavourId: number, quantity: number) {
		const Flavours = this._productsWithFlavourLimit.get(productId) as Flavour[];

		((Flavours.find(e => e.Id === flavourId) as Flavour).Quantity as number) += quantity;
	}
	GetQuantityLimit(productId: number, flavourId: number): number {
		return ((this._productsWithFlavourLimit.get(productId) as Flavour[]).find(e => e.Id == flavourId) as Flavour)
			.Quantity as number;
	}
	private _checkComponentExists(subscriptionId: number, componentId: number) {
		this._checkSubscription(subscriptionId);
		if (!this._componentQuantity.get(subscriptionId)!.has(componentId))
			throw new UnIdentifyComponentError(componentId, subscriptionId);
	}
	Unsubscibe(subscriptionId: number, componentId: number) {
		this._checkArgumentNullException(subscriptionId, componentId);
		this._checkComponentExists(subscriptionId, componentId);

		const QuantityComponentList = this._componentQuantity.get(subscriptionId) as Map<number, QuantityFlavourInfo>;
		const QuantityFlavourInfo = QuantityComponentList.get(componentId) as QuantityFlavourInfo;
		this._restoreQuantity(QuantityFlavourInfo.ProductId, QuantityFlavourInfo.FlavourId, QuantityFlavourInfo.Quantity);
		QuantityComponentList.delete(componentId);
		return true;
	}
	ChangeQuantity(subscriptionId: number, componentId: number, productId: number, flavourId: number, quantity: number): boolean {
		this._checkComponentExists(subscriptionId, componentId);
		this._isFlavourExists(flavourId, productId);
		this._willQuantityExhausted(flavourId,productId,quantity,this._componentQuantity.get(subscriptionId)!.get(componentId)!.Quantity);

		const QuantityAssigned = this._componentQuantity.get(subscriptionId) as Map<number, QuantityFlavourInfo>;
		const QuantityFlavourInfo = QuantityAssigned.get(componentId) as QuantityFlavourInfo;
		this._restoreQuantity(QuantityFlavourInfo.ProductId, QuantityFlavourInfo.FlavourId, QuantityFlavourInfo.Quantity);
		const QuantityFlavourInfoNew = QuantityAssigned.get(componentId)?.Quantity as number;
		if (QuantityFlavourInfoNew && quantity <= QuantityFlavourInfoNew) this._deductQuantity(productId, flavourId, quantity);

		return true;
	}
	private _isFlavourExists(flavourId: number, productId: number) {
		let IsValid = this._productsWithFlavourLimit.has(productId);
		IsValid && (IsValid = this._productsWithFlavourLimit.get(productId)!.find(e => e.Id === flavourId) !== null)
		if (!IsValid)
			throw new UnIdentityFlavourError(productId, flavourId);
	}
	private _willQuantityExhausted(flavourId: number, productId: number, quantity: number,previousQuantity?:number) {
		const limitQuantity = this.GetQuantityLimit(productId, flavourId) + (previousQuantity || 0);
	
		if (quantity > limitQuantity)
			throw new QuantityLimitExceeded(productId, flavourId);
	}
	Subscribe(subscriptionId: number, componentId: number, productId: number, flavourId: number, quantity: number) {
		this._isFlavourExists(flavourId, productId);
        this._willQuantityExhausted(flavourId,componentId,quantity);

		if (this._componentQuantity.has(subscriptionId)) {
			const ComponentMapQuantity = this._componentQuantity.get(subscriptionId) as Map<number, QuantityFlavourInfo>;
			if (ComponentMapQuantity.has(componentId))
				throw new AlreadySubscribedError(componentId, subscriptionId);

			ComponentMapQuantity.set(componentId, { FlavourId: flavourId, Quantity: quantity, ProductId: productId });
		} else {
			const ComponentMapQuantity = new Map<number, QuantityFlavourInfo>();
			ComponentMapQuantity.set(componentId, { FlavourId: flavourId, ProductId: productId, Quantity: quantity });
			this._componentQuantity.set(subscriptionId, ComponentMapQuantity);
		}
		this._deductQuantity(productId, flavourId, quantity);
	}
}
