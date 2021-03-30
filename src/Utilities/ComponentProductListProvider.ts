import { Product, Flavour } from 'Types/Product';
import { ProductKeyWithName } from 'Types/types';
export default class ComponentProductListMediator {
	private _cloneProductNames: Map<number, string>;
	private _cloneProductFlavours: Map<number, Flavour[]>;
	private _productNames: Map<number, string>;
	private _flavourNames: Map<number, Flavour[]>;
	private _deletedProductIds: Set<number>;
	private _componentMappedProduct: Map<number, number>;
	private _componentMappedFlavour: Map<number, number>;

	constructor(productList: Product[]) {
		if (!productList) {
			throw new Error('ArgumentNullException');
		}
		const IsItemMapped = new Set<number>();
		productList.forEach(element => {
			if (IsItemMapped.has(element.Id)) throw new Error('Product List Not Unique');
		});
		this._cloneProductNames = new Map<number, string>();
		this._cloneProductFlavours = new Map<number, Flavour[]>();

		productList.forEach(element => {
			this._cloneProductFlavours.set(element.Id, element.Flavour);
			this._cloneProductNames.set(element.Id, element.Name);
		});
		this._productNames = new Map(this._cloneProductNames);
		this._flavourNames = new Map(this._cloneProductFlavours);
		this._componentMappedFlavour = new Map<number, number>();
		this._componentMappedProduct = new Map<number, number>();
		this._deletedProductIds = new Set();
	}

	private _deleteProductIfAllConsumed(productId: number) {
		const AllFlavours = this._cloneProductFlavours.get(productId);
		if (AllFlavours) {
			if (
				AllFlavours.length &&
				!this._deletedProductIds.has(productId) &&
				AllFlavours.length == Array.from(this._componentMappedProduct.values()).filter(e => e == productId).length
			) {
				this._productNames.delete(productId);
				this._deletedProductIds.add(productId);
			}
		}
	}
	private _unsubscribedToProduct(subscriptionId: number) {
		if (this._componentMappedProduct.has(subscriptionId)) {
			this._componentMappedProduct.delete(subscriptionId);
		}
	}
	private _unscubscribedToFlavour(subscriptionId: number, productId: number) {
		if (!productId || !subscriptionId) {
			throw new Error('ArgumentNullException');
		}
		if (this._componentMappedFlavour.has(subscriptionId)) {
			this._componentMappedFlavour.delete(subscriptionId);
		}
	}
	private _restoreProductIfDeleted(productId: number) {
		if (this._deletedProductIds.has(productId)) {
			this._deletedProductIds.delete(productId);
			const Name = this._cloneProductNames.get(productId);
			Name && this._productNames.set(productId, Name);
		}
	}

	provideProductListBySubscriptionId(subscriptionId: number): ProductKeyWithName[] {
		const toKeyValuePairArray = (products: Map<number, string>): ProductKeyWithName[] => [
			...Array.from(this._productNames).map(e => {
				return { Id: e[0], Name: e[1] };
			}),
		];

		if (this._componentMappedProduct.get(subscriptionId)) {
			const productId = this._componentMappedProduct.get(subscriptionId) as number;
			let ProductCloneName = this._cloneProductNames.get(productId) as string;
			const ProductFromClone = { Id: productId, Name: ProductCloneName } as ProductKeyWithName;

			if (!this._productNames.has(productId)) {
				return [...toKeyValuePairArray(this._productNames), { ...ProductFromClone }];
			}
		}
		return toKeyValuePairArray(this._productNames);
	}
	private _restoreFlavourByflavourId(productId: number, flavourId: number | undefined) {
		const Flavour = (this._cloneProductFlavours.get(productId) as Flavour[]).find(e => e.Id === flavourId);
		if (Flavour) {
			const Flavours = this._flavourNames.get(productId);
			if (Flavours) {
				this._flavourNames.set(productId, [...Flavours, Flavour]);
			}
		}
	}
	private _productDoNotExists = (productId: number) => console.error('Product With ' + productId + ' Do Not Exists');

	private _consoleNullExcepion = () => console.error('Argument Null Exception');

	private _deductProductFlavourByFlavourId(productId: number, flacourId: number) {
		const Flavours = this._flavourNames.get(productId) as Flavour[];
		if (!Flavours || !Flavours.length) {
			return;
		}
		let NewFlavours = Flavours.filter(e => e.Id != flacourId);
		this._flavourNames.set(productId, NewFlavours);
	}

	unsubscribeSubscription(subscriptionId: number) {
		if (this._componentMappedProduct.has(subscriptionId)) {
			const ProductId = this._componentMappedProduct.get(subscriptionId) as number;
			const FlavourId = this._componentMappedFlavour.get(subscriptionId);
			this._unsubscribedToProduct(subscriptionId);
			this._unscubscribedToFlavour(subscriptionId, ProductId);
			this._restoreFlavourByflavourId(ProductId, FlavourId);
			this._restoreProductIfDeleted(ProductId);
		}
	}
	getFlavourOfProductFlavourId(productId: number, flavourId: number): Flavour | undefined | null {
		if (this._cloneProductFlavours.has(productId)) {
			return (this._cloneProductFlavours.get(productId) as Flavour[]).find(e => e.Id === flavourId);
		}
		this._productDoNotExists(productId);
		return undefined;
	}
	setASubscription(subscriptonId: number, productId: number) {
		if (!productId || !subscriptonId) {
			throw new Error('ArgumentNullException');
		}
		if (this._cloneProductNames.get(productId)) {
			let shouldSet = true;
			if (this._componentMappedProduct.has(subscriptonId)) {
				const OldProductId = this._componentMappedProduct.get(subscriptonId) as number;
				if (OldProductId !== productId) {
					if (this._componentMappedFlavour.has(subscriptonId)) {
						const FlavourId = this._componentMappedFlavour.get(subscriptonId) as number;
						this._unscubscribedToFlavour(subscriptonId, OldProductId);
						this._restoreFlavourByflavourId(OldProductId, FlavourId);
						this._restoreProductIfDeleted(OldProductId);
					}
					this._unsubscribedToProduct(subscriptonId);
				} else shouldSet = false;
			}
			if (shouldSet) this.subscribeToProduct(subscriptonId, productId);
		} else this._productDoNotExists(productId);
	}
	private subscribeToProduct(subscriptonId: number, productId: number) {
		if (!productId || !subscriptonId) {
			throw new Error('ArgumentNullException');
		}
		this._componentMappedProduct.set(subscriptonId, productId);
		this._deleteProductIfAllConsumed(productId);
	}
	subscribedToFlavourId(subscriptionId: number, productId: number, flavourId: number) {
		if (!productId || !subscriptionId || !flavourId) {
			throw new Error('ArgumentNullException');
		}
		if (this._deletedProductIds.has(productId)) console.error('Cannot Subscribed To Deleted Product');
		let setFlavour = true;
		if (this._componentMappedFlavour.has(subscriptionId)) {
			if (this._componentMappedFlavour.get(subscriptionId) === flavourId) {
				setFlavour = false;
			} else {
				const PreviousFlavourId = this._componentMappedFlavour.get(subscriptionId) as number;
				this._componentMappedFlavour.delete(subscriptionId);
				this._restoreFlavourByflavourId(productId, PreviousFlavourId);
			}
		}
		if (setFlavour) {
			this._componentMappedFlavour.set(subscriptionId, flavourId);
			this._deductProductFlavourByFlavourId(productId, flavourId);
		}
	}

	getFlavours(subscriptionId: number): Flavour[] {
		if (!this._componentMappedProduct.has(subscriptionId)) return [];
		const productId = this._componentMappedProduct.get(subscriptionId) as number;
		if (!this._componentMappedFlavour.has(subscriptionId)) {
			return this._flavourNames.get(productId) as Flavour[];
		}

		const getFlavourFromFlavours = (flavours: Flavour[], flavourId: number): Flavour => {
			return { ...(flavours.find(e => e.Id == flavourId) as Flavour) };
		};
		const subscribedFlavourId = this._componentMappedFlavour.get(subscriptionId) as number;
		const Flavours = this._flavourNames.get(productId);
		if (Flavours && Flavours.length) {
			let flavours = Flavours as Flavour[];
			return [...flavours, getFlavourFromFlavours(this._cloneProductFlavours.get(productId) as Flavour[], subscribedFlavourId)];
		}
		return [this.getFlavourOfProductFlavourId(productId, subscribedFlavourId) as Flavour];
	}
}
