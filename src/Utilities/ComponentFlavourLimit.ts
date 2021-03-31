import { Flavour, Product } from 'Types/Product';

type FlavourWithKeyName = {
	Id: number;
	ProductId: number;
	Quantity: number;
};
export default class ComponentFlavourLimitMediator {
	private _flavourLimit: Map<number, Flavour[]>;
	private _componentFlavourChooseQuantity: Map<number, FlavourWithKeyName>;
	constructor(products: Product[]) {
		const IsItemMapped = new Set<number>();
		products.forEach(element => {
			if (IsItemMapped.has(element.Id)) throw new Error('Product List Not Unique');
		});
		this._flavourLimit = new Map();
		products.forEach(element => {
			this._flavourLimit.set(element.Id, element.Flavour);
		});
		this._componentFlavourChooseQuantity = new Map();
	}
	private _deductFlavourQuantity(productId: number, flavourId: number, quantity: number) {
		const flavours = this._flavourLimit.get(productId) as Flavour[];
		((flavours.find(e => e.Id == flavourId) as Flavour).Quantity as number) += quantity;
	}

	unsubscribe(subscriptionId: number) {
		const falvourChoosen = this._componentFlavourChooseQuantity.get(subscriptionId) as FlavourWithKeyName;
		this._componentFlavourChooseQuantity.delete(subscriptionId);
		this._deductFlavourQuantity(falvourChoosen.ProductId, falvourChoosen.Id, falvourChoosen.Quantity);
	}
	_changeQuantity(subscriptionId: number, productId: number, flavourId: number, newQuantity: number) {
		if (!subscriptionId || !productId || !flavourId || !newQuantity) {
			return;
		}
		const OldQuantity = this._componentFlavourChooseQuantity.get(productId)?.Quantity;
		const FlavourChoosen = this._flavourLimit.get(productId)?.find(e => e.Id === flavourId);
		if (FlavourChoosen && FlavourChoosen.Quantity && OldQuantity) {
			const abs = Math.abs(FlavourChoosen.Quantity - newQuantity);
			if (FlavourChoosen.Quantity > OldQuantity) FlavourChoosen.Quantity -= abs;
			else FlavourChoosen.Quantity += abs;
		}
	}
	getFlavourLimit(productId: number, flavourId: number) {
		if (!productId || !flavourId) {
			return 0;
		}
		const Flavours = this._flavourLimit.get(productId) as Flavour[];
		return Flavours.find(e => e.Id === flavourId)?.Quantity ?? 0;
	}
	subscribe(subscriptionId: number, productId: number, flavourId: number, quantity: number) {
		if (!subscriptionId || !productId || !flavourId || !quantity) {
			return;
		}
		let setSubscription = true;
		if (this._componentFlavourChooseQuantity.has(subscriptionId)) {
			setSubscription = false;
			const flavourChoosen = this._componentFlavourChooseQuantity.get(subscriptionId) as FlavourWithKeyName;
			if (flavourChoosen.ProductId != productId || flavourChoosen.Id != flavourId) {
				this.unsubscribe(subscriptionId);
				this.subscribe(subscriptionId, productId, flavourId, quantity);
			} else {
				setSubscription = false;
				if (quantity != flavourChoosen.Quantity) {
					this._changeQuantity(subscriptionId, productId, flavourId, quantity);
				}
			}
		}
		if (setSubscription)
			this._componentFlavourChooseQuantity.set(subscriptionId, { Id: flavourId, ProductId: productId, Quantity: quantity });
	}
}
