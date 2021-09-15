import { NullOrUndefinedError, UnIdentifyComponentError, UnknownSubscription } from 'Errors/Error';
import { Product } from 'Types/DTO';
import { ProductInfo } from 'Types/Mediator';

type ProductComponentMap = Map<number, number>;
export interface IProductMediator {
	IsProductDeleted(productId: number): boolean;
	DeleteProduct(productId: number): void;
	IsProductExists(productId: number): boolean;
	RestoreProduct(productId: number): void;
	GetDefaultProductList(subscriptionId: number, componentId: number): ProductInfo[];
	Subscribe(subscriptionId: number, componentId: number, productId: number): void;
	GetSubscribedProduct(subscriptionId: number, componentId: number): number;
	Unsubscribe(subscriptionId: number, componentId: number): boolean;
	IsAlreadySubscribed(subcriptionId: number, componentId: number): boolean;
	ChangeSubscription(subscriptionId: number, componentId: number, productId: number): boolean; UnsubscribeASubscription(subscriptionId: number): boolean;
}
export default class ComponentProductMediator implements IProductMediator {
	_cloneProduct: Map<number, string>;
	_componentProductMap: Map<number, ProductComponentMap>;
	_deletedProducts: Set<number>;
	_subscriptionDeletedProduct: Map<number, Set<number>>;
	_products: Map<number, string>;
	constructor(products: Product[]) {
		this._cloneProduct = new Map();
		this._products = new Map();
		this._subscriptionDeletedProduct = new Map();
		for (let i = 0; i < products.length; i++) {
			const Product = products[i];
			this._cloneProduct.set(Product.Id, Product.Name);
			this._products.set(Product.Id, Product.Name);
		}
		this._deletedProducts = new Set();
		this._componentProductMap = new Map();
	}
	IsProductExists(productId: number): boolean {
		return this._cloneProduct.has(productId);
	}
	UnsubscribeASubscription(subscriptionId: number): boolean {
		try {
			this._checkArgumentNullException(subscriptionId);
			const SubscriptionMappedCOmponent = this._componentProductMap.get(subscriptionId);
			if (SubscriptionMappedCOmponent) {
				Array.from(SubscriptionMappedCOmponent).forEach((value) => {
					const componentId = value[0];
					const item = value[1];
					this.Unsubscribe(subscriptionId, componentId);
				});
				this._componentProductMap.delete(subscriptionId);
				return true;
			}
		}
		catch (error) {
		}

		return false;
	}

	private _checkArgumentNullException(...params: number[]) {
		for (let i = 0; i < params.length; i++) if (!params[i]) throw new NullOrUndefinedError();
	}

	private _checkSubscription(subscribeId: number) {
		if (!this._componentProductMap.has(subscribeId))
			throw new UnknownSubscription();
	}

	private _mapToArray(map: Map<number, string>) {
		const array: ProductInfo[] = [];
		const iterator = map.entries();
		let result = iterator.next();
		while (!result.done) {
			array.push({ Id: result.value[0], Title: result.value[1] });
			result = iterator.next();
		}
		return [...array];
	}
	private _getSubscriptionDeletedProduct(subscriptionId: number) {
		if (this._subscriptionDeletedProduct.has(subscriptionId)) {
			const ProductsDeleted = this._subscriptionDeletedProduct.get(subscriptionId);
			return ProductsDeleted ? Array.from(ProductsDeleted) : [];
		}
		return [];
	}
	private _removeProductFromArray(products: ProductInfo[], productToDelted: number[]): ProductInfo[] {
		if (!productToDelted.length) return products;
		let FilteredProduct = products.filter(e => !productToDelted.includes(e.Id));
		return FilteredProduct;
	}
	private _isProductDeletedForSubscriptionId(subscrptionId: number, productId: number): boolean {
		if (!(this._subscriptionDeletedProduct.has(subscrptionId))) return false;
		const productDeleted = Array.from(this._subscriptionDeletedProduct.get(subscrptionId) as Set<number>);
		return productDeleted.includes(productId);
	}

	private _getProductById(productId: number): ProductInfo {
		const name = this._cloneProduct.get(productId) as string;
		return { Title: name, Id: productId };
	}
	IsAlreadySubscribed(subcriptionId: number, componentId: number): boolean {
		try {
			this._checkSubscription(subcriptionId);
		} catch (error) {
			return false;
		}
		const ComponentMapProduct = this._componentProductMap.get(subcriptionId) as ProductComponentMap;
		return ComponentMapProduct.has(componentId);
	}
	private _checkComponentSubscribed(subscriptionId: number, componentId: number) {
		this._checkSubscription(subscriptionId);
		if (!this._componentProductMap.get(subscriptionId)!.has(componentId)) {
			throw new UnIdentifyComponentError(componentId, subscriptionId);
		}
	}
	GetSubscribedProduct(subscriptionId: number, componentId: number) {
		this._checkComponentSubscribed(subscriptionId, componentId);
		return this._componentProductMap.get(subscriptionId)!.get(componentId)!;
	}
	IsProductDeleted(productId: number): boolean {
		return this._deletedProducts.has(productId);
	}
	DeleteProduct(productId: number) {
		this._products.delete(productId);
	}
	RestoreProduct(productId: number) {
		this._products.set(productId, this._getProductById(productId).Title);
	}
	GetDefaultProductList(subscriptionId: number, componentId: number): ProductInfo[] {
		this._checkArgumentNullException(subscriptionId, componentId);
		if (this._componentProductMap.has(subscriptionId)) {
			const ComponentMapProduct = this._componentProductMap.get(subscriptionId) as ProductComponentMap;
			if (ComponentMapProduct.has(componentId)) {
				const ProductsDeleted = this._getSubscriptionDeletedProduct(subscriptionId);
				const SubscribedProductId = ComponentMapProduct.get(componentId) as number;
				if (
					this._isProductDeletedForSubscriptionId(subscriptionId, SubscribedProductId) ||
					this.IsProductDeleted(SubscribedProductId)
				) {
					return [
						...this._removeProductFromArray(this._mapToArray(this._products) as ProductInfo[], ProductsDeleted),
						this._getProductById(SubscribedProductId),
					];
				} else return [...this._removeProductFromArray(this._mapToArray(this._products) as ProductInfo[], ProductsDeleted)];
			} else {
				const GlobalDeletdProduct = Array.from(this._deletedProducts);
				return this._removeProductFromArray(this._mapToArray(this._products), GlobalDeletdProduct);
			}
		}
		return this._mapToArray(this._products);
	}
	Subscribe(subscriptionId: number, componentId: number, productId: number) {
		this._checkArgumentNullException(subscriptionId, componentId, productId);

		if (this._componentProductMap.has(subscriptionId)) {
			const ComponentMap = this._componentProductMap.get(subscriptionId) as ProductComponentMap;
			ComponentMap.set(componentId, productId);
		} else {
			const ComponentMapProduct = new Map<number, number>();
			ComponentMapProduct.set(componentId, productId);
			this._componentProductMap.set(subscriptionId, ComponentMapProduct);
		}
	}

	Unsubscribe(subscriptionId: number, componentId: number): boolean {
		this._checkSubscription(subscriptionId);
		const ComponentMapProduct = this._componentProductMap.get(subscriptionId) as ProductComponentMap;
		if (ComponentMapProduct.has(componentId)) {
			const ProductId = ComponentMapProduct.get(componentId) as number;
			if (this._getSubscriptionDeletedProduct(subscriptionId).includes(ProductId)) {
				const DeletedProductFromComponent = this._subscriptionDeletedProduct.get(subscriptionId) as Set<number>;
				DeletedProductFromComponent.delete(ProductId);
			}
			ComponentMapProduct.delete(subscriptionId);
			return true;
		}
		return false;
	}

	ChangeSubscription(subscriptionId: number, componentId: number, productId: number): boolean {
		this._checkSubscription(subscriptionId);
		this._checkArgumentNullException(componentId, productId);
		const ComponentProductMap = this._componentProductMap.get(subscriptionId) as ProductComponentMap;
		if (ComponentProductMap.has(componentId)) {
			const previousProductId = ComponentProductMap.get(componentId) as number;
			let IsSubscribedChange = false;
			if (previousProductId !== productId) {
				IsSubscribedChange = true;
				this.Unsubscribe(subscriptionId, componentId);
				this.Subscribe(subscriptionId, componentId, productId);
			}
			return IsSubscribedChange;
		}
		throw new UnIdentifyComponentError(componentId, subscriptionId);
	}
}
