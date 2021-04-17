import { Flavour, Product } from 'Types/Types';

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
	IsQuantitySubscribed(subscriptionId: number, componentId: number): boolean; UnsubscribeASubscription(subscriptionId: number): boolean;
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
			for (let j = 0; j < Product.Flavour.length; j++) CloneFlavours.push({ ...Product.Flavour[j] });
			this._productsWithFlavourLimit.set(Product.Id, CloneFlavours);
			this._cloneProductWithFlavourList.set(Product.Id, [...CloneFlavours]);
		}
	}
	UnsubscribeASubscription(subscriptionId: number): boolean {
		try {
			this._checkArgumentNullException(subscriptionId);
			const SubscriptionMappedCOmponent = this._componentQuantity.get(subscriptionId);
			if (SubscriptionMappedCOmponent) {
				Array.from(SubscriptionMappedCOmponent).forEach((value) => {
					const componentId = value[0];
					const item = value[1];
					this.Unsubscibe(subscriptionId, componentId);
				});
				this._componentQuantity.delete(subscriptionId);
				return true;
			}
		}
		catch (error) {
		}

		return false;
	}
	IsQuantitySubscribed(subscriptionId: number, componentId: number): boolean {
		const ComponentMapQUantity = this._componentQuantity.get(subscriptionId);
		if (!ComponentMapQUantity) return false;
		return ComponentMapQUantity.has(componentId);
	}
	private _checkSubscription(subscribeId: number) {
		if (!this._componentQuantity.has(subscribeId)) throw new Error('Subscription Id Not Set');
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
	Unsubscibe(subscriptionId: number, componentId: number) {
		try {
			this._checkSubscription(subscriptionId);

		} catch (error) {
			return false;
		}
		this._checkArgumentNullException(subscriptionId, componentId);
		const QuantityComponentList = this._componentQuantity.get(subscriptionId) as Map<number, QuantityFlavourInfo>;
		if (QuantityComponentList.has(componentId)) {
			const QuantityFlavourInfo = QuantityComponentList.get(componentId) as QuantityFlavourInfo;

			this._restoreQuantity(QuantityFlavourInfo.ProductId, QuantityFlavourInfo.FlavourId, QuantityFlavourInfo.Quantity);
			QuantityComponentList.delete(componentId);
			return true;
		}
		return false;
	}
	ChangeQuantity(subscriptionId: number, componentId: number, productId: number, flavourId: number, quantity: number): boolean {
		if (this._componentQuantity.has(subscriptionId)) {
			const QuantityAssigned = this._componentQuantity.get(subscriptionId) as Map<number, QuantityFlavourInfo>;
			if (QuantityAssigned.has(componentId)) {
				const QuantityFlavourInfo = QuantityAssigned.get(componentId) as QuantityFlavourInfo;
				this._restoreQuantity(QuantityFlavourInfo.ProductId, QuantityFlavourInfo.FlavourId, QuantityFlavourInfo.Quantity);
				const QuantityFlavourInfoNew = QuantityAssigned.get(componentId)?.Quantity as number;
				if (QuantityFlavourInfoNew && quantity <= QuantityFlavourInfoNew) this._deductQuantity(productId, flavourId, quantity);
				return true;
			} else throw new Error('Unknown Component');
		}
		throw new Error('Unknown Subcription');
	}
	Subscribe(subscriptionId: number, componentId: number, productId: number, flavourId: number, quantity: number) {
		if (this._componentQuantity.has(subscriptionId)) {
			const ComponentMapQuantity = this._componentQuantity.get(subscriptionId) as Map<number, QuantityFlavourInfo>;
			ComponentMapQuantity.set(componentId, { FlavourId: flavourId, Quantity: quantity, ProductId: productId });
		} else {
			const ComponentMapQuantity = new Map<number, QuantityFlavourInfo>();
			ComponentMapQuantity.set(componentId, { FlavourId: flavourId, ProductId: productId, Quantity: quantity });
			this._componentQuantity.set(subscriptionId, ComponentMapQuantity);
		}
		this._deductQuantity(productId, flavourId, quantity);
	}
}
