import { AlreadySubscribedError, FlavourOccupiedError, UnIdentifyComponentError, UnIdentityFlavourError, UnknownSubscription } from 'Errors/Error';
import { Flavour, Product } from 'Types/DTO';

type FlavourWithProductKey = {
	Id: number;
	ProductId: number;
};

type FlavourInfo = Map<number, FlavourWithProductKey>;
export interface IFlavourMediator {
	GetFlavours(subscriptionId: number, componentId: number, productId: number): Flavour[];
	Subscribe(subscriptionId: number, componentId: number, productId: number, flavourId: number): void;
	IsFlavourExhausted(productId: number): boolean;
	ChangeSubscription(subscriptionId: number, componentId: number, productId: number, flavourId: number): boolean;
	Unsubscribe(subscriptionId: number, componentId: number): void;
	IsFlavourDeleted(productId: number, flavourId: number): boolean;
	DeductFlavour(productId: number, flavourId: number): void;
	IsSubscribed(subcriptionId: number, componentId: number): boolean;
	RestoreFlavour(productId: number, flavourId: number): boolean;
	GetSubscribedFlavourId(subscriptionId: number, componentId: number): number;
	UnsubscribeASubscription(subscriptionId: number): boolean;
	IsFlavourExists(productId: number, flavourId: number): boolean;
	IsFlavourAvailable(subscibeId:number,productId:number,flavourId:number):boolean;
}

export default class FlavourMediator implements IFlavourMediator {
	private _cloneFlavours: Map<number, Flavour[]>;
	private _flavours: Map<number, Flavour[]>;
	private _deletedFlavour: FlavourWithProductKey[];
	private _deletedSubscriptionFlavour: Map<number, FlavourWithProductKey[]>;
	private _componentFlavourChoosen: Map<number, FlavourInfo>;
	constructor(products: Product[]) {
		this._flavours = new Map();
		this._cloneFlavours = new Map();
		this._deletedFlavour = [];
		for (var i = 0; i < products.length; i++) {
			const product = products[i];
			this._flavours.set(product.Id, product.Flavours);

			let CloneFlavours: Array<Flavour> = [];
			for (let j = 0; j < product.Flavours.length; j++) CloneFlavours.push({ ...product.Flavours[j] });
			this._cloneFlavours.set(product.Id, CloneFlavours);
		}
		this._componentFlavourChoosen = new Map();
		this._deletedSubscriptionFlavour = new Map();
	}
	IsFlavourExists(productId: number, flavourId: number): boolean {
		return this._flavours.get(productId)?.find(e => e.Id === flavourId) !== undefined;
	}
	IsFlavourAvailable(subscibeId: number,productId: number, flavourId: number) {
		if (!this.IsFlavourExists(productId, flavourId))
			throw new UnIdentityFlavourError(productId, flavourId);
		return !this._isFlavourDeletedForSubscriptionId(subscibeId,productId,flavourId);
	}
	UnsubscribeASubscription(subscriptionId: number): boolean {
		try {
			this._checkArgumentNullException(subscriptionId);
			const SubscriptionMappedCOmponent = this._componentFlavourChoosen.get(subscriptionId);
			if (SubscriptionMappedCOmponent) {
				Array.from(SubscriptionMappedCOmponent).forEach((value) => {
					const componentId = value[0];
					const item = value[1];
					this.Unsubscribe(subscriptionId, componentId);
				});
				this._componentFlavourChoosen.delete(subscriptionId);
				return true;
			}
		}
		catch (error) {
		}

		return false;
	}

	private _restoreFlavour(subscriptionId: number, productId: number, flavourId: number) {
		let FlavoursDeleted = this._deletedSubscriptionFlavour.get(subscriptionId);
		if (FlavoursDeleted) {
			FlavoursDeleted = FlavoursDeleted.filter(e => e.Id !== flavourId && e.ProductId === productId);
			this._deletedSubscriptionFlavour.set(subscriptionId, FlavoursDeleted);
			return;
		}
		throw new Error('Unknown Subscription');
	}
	private _deductFlavour(subscritpionId: number, ProductId: number, flavourId: number) {
		if (!this._deletedSubscriptionFlavour.has(subscritpionId)) {
			this._deletedSubscriptionFlavour.set(subscritpionId, [{ Id: flavourId, ProductId }]);
		} else
			this._deletedSubscriptionFlavour.get(subscritpionId)?.push({ Id: flavourId, ProductId: ProductId });
	}
	private _checkArgumentNullException(...params: number[]) {
		for (let i = 0; i < params.length; i++) if (!params[i]) throw new Error('Argument Not Set');
	}
	private _getFlavourInfoFromProductId(productId: number, flavourId: number): Flavour {
		const Flavours = this._cloneFlavours.get(productId) as Flavour[];
		const Flavour = Flavours.find(e => e.Id === flavourId) as Flavour;
		return { ...Flavour };
	}
	private _getSubcriptionDeletedFlavour(subscribeId: number, productId: number): number[] {
		if (this._deletedSubscriptionFlavour.has(subscribeId)) {
			let array: number[] = [];
			const SubscriptionDeletedFlavour = this._deletedSubscriptionFlavour.get(subscribeId) as FlavourWithProductKey[];
			for (let index = 0; index < SubscriptionDeletedFlavour.length; index++) {
				const element = SubscriptionDeletedFlavour[index];
				if (element.ProductId == productId) array = [...array, element.Id];
			}
			return array;
		}
		return [];
	}
	private _removeFlavoursFromArray(flavours: Flavour[], flavoursToDelele: number[]) {
		if (!flavoursToDelele.length) return flavours;
		let Flavours = flavours.filter(e => !flavoursToDelele.includes(e.Id));
		return Flavours;
	}
	private _isFlavourDeletedForSubscriptionId(subscribeId: number, productId: number, flavourId: number) {
		const DeletedFlavour = (this._deletedSubscriptionFlavour.get(subscribeId) as FlavourWithProductKey[]).filter(
			e => e.ProductId == productId,
		);
		for (let index = 0; index < DeletedFlavour.length; index++) {
			if (DeletedFlavour[index].Id == flavourId) return true;
		}
		return false;
	}
	private _cloneFlavoursArray(flavours: Flavour[]): Flavour[] {
		let Flavours: Array<Flavour> = [];
		for (let index = 0; index < flavours.length; index++) {
			Flavours = [...Flavours, { ...flavours[index] }];
		}
		return Flavours;
	}
	private _checkSubscription(subscribeId: number) {
		if (!this._componentFlavourChoosen.has(subscribeId))
			throw new UnknownSubscription();
	}

	GetSubscribedFlavourId(subscriptionId: number, componentId: number): number {
		this._checkComponentExists(subscriptionId, componentId);
		const ComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId);
		const FlavourInfo = ComponentMapFlavour!.get(componentId);
		return FlavourInfo!.Id as number;
	}

	GetFlavours(subscriptionId: number, componentId: number, productId: number): Flavour[] {
		this._checkArgumentNullException(subscriptionId, componentId, productId);
		if (this._componentFlavourChoosen.has(subscriptionId)) {
			const SubscriptionComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId) as FlavourInfo;
			const deletedflours = this._getSubcriptionDeletedFlavour(subscriptionId, productId);

			if (SubscriptionComponentMapFlavour.has(componentId)) {
				const FlavourID = (SubscriptionComponentMapFlavour.get(componentId) as FlavourWithProductKey).Id as number;

				if (
					FlavourID && this._isFlavourDeletedForSubscriptionId(subscriptionId, productId, FlavourID) ||
					this.IsFlavourDeleted(productId, FlavourID)
				) {
					return [
						// see here
						...this._removeFlavoursFromArray(this._flavours.get(productId) as Flavour[], deletedflours),
						{ ...this._getFlavourInfoFromProductId(productId, FlavourID) },
					];
				}
				// see here
				else return [...this._removeFlavoursFromArray(this._flavours.get(productId) as Flavour[], deletedflours)];
			} else {
				const GlobalDeletedProduct = this._deletedFlavour.filter(e => e.ProductId == productId).map(e => e.Id);
				return this._cloneFlavoursArray(
					// here also
					this._removeFlavoursFromArray(this._flavours.get(productId) as Flavour[], [...deletedflours, ...GlobalDeletedProduct]),
				);
			}
		} else return this._cloneFlavoursArray(this._flavours.get(productId) as Flavour[]);
	}
	IsFlavourExhausted(productId: number): boolean {
		const Flavours = this._flavours.get(productId) as Flavour[];
		return !Flavours.length;
	}

	Subscribe(subscriptionId: number, componentId: number, productId: number, flavourId: number) {
		this._checkArgumentNullException(subscriptionId, componentId, flavourId, productId);
		this._checkSubscription(subscriptionId);

		if (this._componentFlavourChoosen.has(subscriptionId)) {
			const SubscriptionComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId);

			if (SubscriptionComponentMapFlavour?.get(componentId)) {
				throw new AlreadySubscribedError(componentId, subscriptionId);
			}

			SubscriptionComponentMapFlavour?.set(componentId, { Id: flavourId, ProductId: productId });
		} else {
			const NewSubscriptionComponentMapFlavour = new Map<number, FlavourWithProductKey>();
			NewSubscriptionComponentMapFlavour.set(componentId, { Id: flavourId, ProductId: productId });
			this._componentFlavourChoosen.set(subscriptionId, NewSubscriptionComponentMapFlavour);
		}
		this._deductFlavour(subscriptionId, productId, flavourId);
	}
	private _checkFlavourValid(productId: number, flavourId: number): void {
		if (this._flavours.get(productId)!.find(e => e.Id === flavourId) == null)
			throw new UnIdentityFlavourError(productId, flavourId)
	}
	private _checkFlavourNotAlreadyOccupied(productId: number, flavourId: number, subscriptionId: number): void {
		if (this._deletedSubscriptionFlavour.get(subscriptionId)?.find(e => e.ProductId === productId && e.Id === flavourId) !== null)
			throw new FlavourOccupiedError(flavourId, productId, subscriptionId);
	}
	ChangeSubscription(subscriptionId: number, componentId: number, productId: number, flavourId: number): boolean {
		this._checkSubscription(subscriptionId);
		this._checkFlavourValid(productId, flavourId);
                 
		const SubscriptionComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId) as Map<number, FlavourWithProductKey>;
		if (SubscriptionComponentMapFlavour.has(componentId)) {
			const FlavourWithProductKey = SubscriptionComponentMapFlavour.get(componentId) as FlavourWithProductKey;
			const OldFlavour = { ...FlavourWithProductKey };

			let IsSubcribed = true;

			if (FlavourWithProductKey.ProductId === productId && FlavourWithProductKey.Id === flavourId) {
				IsSubcribed = false;
			}
			if (IsSubcribed) {
				this._checkFlavourNotAlreadyOccupied(productId, flavourId, subscriptionId);
				FlavourWithProductKey.Id = flavourId;
				FlavourWithProductKey.ProductId = productId;
				this._restoreFlavour(subscriptionId, OldFlavour.ProductId, OldFlavour.Id);
				this._deductFlavour(subscriptionId, productId, flavourId);
			}
			return IsSubcribed;
		}
		throw new UnIdentifyComponentError(componentId, subscriptionId);
	}
	private _checkComponentExists(subscribeId: number, componentId: number) {
		this._checkSubscription(subscribeId);
		if (!this._componentFlavourChoosen.get(subscribeId)!.has(componentId))
			throw new UnIdentifyComponentError(componentId, subscribeId);
	}
	Unsubscribe(subscriptionId: number, componentId: number) {
		this._checkArgumentNullException(subscriptionId, componentId);
		this._checkComponentExists(subscriptionId, componentId);

		const SubscriptionComponentMapFlavour = this._componentFlavourChoosen.get(subscriptionId) as FlavourInfo;
		if (SubscriptionComponentMapFlavour.has(componentId)) {
			const FlavourWithProductKey = SubscriptionComponentMapFlavour.get(componentId) as FlavourWithProductKey;
			SubscriptionComponentMapFlavour.delete(componentId);
			this._restoreFlavour(subscriptionId, FlavourWithProductKey.ProductId, FlavourWithProductKey.Id);
			return;
		}
	}
	IsSubscribed(subcriptionId: number, componentId: number): boolean {
		const ComponentMapFlavour = this._componentFlavourChoosen.get(subcriptionId);
		if (!ComponentMapFlavour) return false;
		return ComponentMapFlavour.has(componentId);
	}
	IsFlavourDeleted(productId: number, flavourId: number): boolean {
		this._checkArgumentNullException(productId, flavourId);
		const Flavours = this._flavours.get(productId) as Flavour[];
		let IsFlavourDelted = true;
		for (let i = 0; i < Flavours.length; i++) if (Flavours[i].Id == flavourId) IsFlavourDelted = false;
		return IsFlavourDelted;
	}

	public DeductFlavour(productId: number, flavourId: number) {
		let flavours = this._flavours.get(productId) as Flavour[];
		flavours = flavours.filter(e => e.Id != flavourId);
		this._deletedFlavour.push({ Id: flavourId, ProductId: productId });
	}
	public RestoreFlavour(productId: number, flavourId: number): boolean {
		this._flavours.set(productId, [
			...(this._flavours.get(productId) ?? []),
			{ ...this._getFlavourInfoFromProductId(productId, flavourId) },
		]);
		return true;
	}
}
