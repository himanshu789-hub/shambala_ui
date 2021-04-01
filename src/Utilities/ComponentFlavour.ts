import { Flavour, Product } from 'Types/Product';

type FlavourWithProductKey = {
	Id: number;
	ProductId: number;
};

type FlavourInfo = Map<number, FlavourWithProductKey>;

export default class FlavourMediator {
	private _cloneFlavours: Map<number, Flavour[]>;
	private _flavours: Map<number, Flavour[]>;
	private _componentFlavourChoosen: Map<number, FlavourInfo>;
	constructor(products: Product[]) {
		this._flavours = new Map();
		this._cloneFlavours = new Map();

		for (var i = 0; i < products.length; i++) {
			const product = products[i];
			this._flavours.set(product.Id, product.Flavour);

			let CloneFlavours: Array<Flavour> = [];
			for (let j = 0; j < product.Flavour.length; j++) CloneFlavours.push({ ...product.Flavour[i] });
			this._cloneFlavours.set(product.Id, CloneFlavours);
		}
		this._componentFlavourChoosen = new Map();
	}

	private _deductFlavour(productId: number, flavourId: number) {
		let flavours = this._flavours.get(productId) as Flavour[];
		flavours = flavours.filter(e => e.Id != flavourId);
	}
	private _restoreFlavour(productId: number, flavourId: number) {
		let Flavours = this._flavours.get(productId) as Flavour[];
		Flavours = [...Flavours, this._getFlavourInfoFromProductId(productId, flavourId)];
	}
	private _checkArgumentNullException(...params: number[]) {
		for (let i = 0; i < params.length; i++) if (!params[i]) throw new Error('Argument Not Set');
	}
	Unsubscribe(subscriptionId: number, componentId: number, flavourId: number): boolean {
		this._checkArgumentNullException(subscriptionId, componentId, flavourId);
		this._checkSubscription(subscriptionId);
		const SubscriptionComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId) as FlavourInfo;
		if (SubscriptionComponentMapFlavour.has(componentId)) {
			const FlavourWithProductKey = SubscriptionComponentMapFlavour.get(componentId) as FlavourWithProductKey;
			SubscriptionComponentMapFlavour.delete(componentId);
			this._restoreFlavour(FlavourWithProductKey.ProductId, flavourId);
			return true;
		} else throw new Error('Unresgistering Unknown Component');
	}
	IsFlavourDeleted(productId: number, flavourId: number) {
		this._checkArgumentNullException(productId, flavourId);
		const Flavours = this._flavours.get(productId) as Flavour[];
		let IsFlavourDelted = true;
		for (let i = 0; i < Flavours.length; i++) if (Flavours[i].Id == flavourId) IsFlavourDelted = false;
		return IsFlavourDelted;
		
	}
	private _getFlavourInfoFromProductId(productId: number, flavourId: number): Flavour {
		const Flavours = this._cloneFlavours.get(productId) as Flavour[];
		const Flavour = Flavours.find(e => e.Id === flavourId) as Flavour;
		return { ...Flavour };
	}
	GetFlavours(subscriptionId: number, componentId: number, productId: number): Flavour[] {
		this._checkArgumentNullException(subscriptionId, componentId, productId);
		this._checkSubscription(subscriptionId);
		const SubscriptionComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId) as FlavourInfo;
		if (SubscriptionComponentMapFlavour.has(componentId)) {
			const FlavourID = (SubscriptionComponentMapFlavour.get(componentId) as FlavourWithProductKey).Id as number;
			if (this.IsFlavourDeleted(productId, FlavourID)) {
				return [...(this._flavours.get(productId) as Flavour[]), this._getFlavourInfoFromProductId(productId, FlavourID)];
			} else [...(this._flavours.get(productId) as Flavour[])];
		}
		throw new Error('Unkown Component');
	}
	Subscribe(subscriptionId: number, componentId: number, productId: number, flavourId: number) {
		this._checkArgumentNullException(subscriptionId, componentId, flavourId, productId);
		this._checkSubscription(subscriptionId);

		if (this._componentFlavourChoosen.has(subscriptionId)) {
			const SubscriptionComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId);
			SubscriptionComponentMapFlavour?.set(componentId, { Id: flavourId, ProductId: productId });
		} else {
			const NewSubscriptionComponentMapFlavour = new Map<number, FlavourWithProductKey>();
			NewSubscriptionComponentMapFlavour.set(componentId, { Id: flavourId, ProductId: productId });
			this._componentFlavourChoosen.set(subscriptionId, NewSubscriptionComponentMapFlavour);
		}
		this._deductFlavour(productId, flavourId);
	}
	private _checkSubscription(subscribeId: number) {
		if (!this._componentFlavourChoosen.has(subscribeId)) throw new Error('Subscription Id Not Set');
	}
	IsFlavourExhausted(productId:number):boolean
	{
      const Flavours = this._flavours.get(productId) as Flavour[];
      return !Flavours.length;
	}
	ChangeSubscription(subscriptionId: number, componentId: number, productId: number, flavourId: number): boolean {
		this._checkSubscription(subscriptionId);
		const SubscriptionComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId) as Map<
			number,
			FlavourWithProductKey
		>;
		if (SubscriptionComponentMapFlavour.has(componentId)) {
			const FlavourWithProductKey = SubscriptionComponentMapFlavour.get(componentId) as FlavourWithProductKey;
			let IsSubcribed = true;
			if (FlavourWithProductKey.ProductId === productId) {
				if (FlavourWithProductKey.Id === flavourId) IsSubcribed = false;
				else FlavourWithProductKey.Id = flavourId;
			} else {
				FlavourWithProductKey.Id = productId;
				FlavourWithProductKey.ProductId = productId;
			}
			if (IsSubcribed) {
				this._restoreFlavour(FlavourWithProductKey.ProductId, FlavourWithProductKey.Id);
				this._deductFlavour(productId, flavourId);
			}
			return IsSubcribed;
		}
		throw new Error('Changing Subscription For Unregister Component');
	}
}
