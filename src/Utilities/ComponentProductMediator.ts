import { Product } from 'Types/Product';

type ProductInfo = {
	Id: number;
	Title: string;
};
type ProductComponentMap = Map<number, number>;
export default class ComponentProductMediator {
	_cloneProduct: Map<number, string>;
	_componentProductMap: Map<number, Map<number, ProductComponentMap>>;
	_deletedProducts: Set<number>;
	_products: Map<number, string>;
	constructor(products: Product[]) {
		this._cloneProduct = new Map();
		this._products = new Map();
		for (let i = 0; i < products.length; i++) {
			const Product = products[i];
			this._cloneProduct.set(Product.Id, Product.Name);
			this._products.set(Product.Id, Product.Name);
		}
		this._deletedProducts = new Set();
		this._componentProductMap = new Map();
	}

	private _checkArgumentNullException(...params: number[]) {
		for (let i = 0; i < params.length; i++) if (!params[i]) throw new Error('Argument Not Set');
	}

	private _checkSubscription(subscribeId: number) {
		if (!this._componentProductMap.has(subscribeId)) throw new Error('Subscription Id Not Set');
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
	Subscribe(subscriptionId: number, componentId: number, productId: number) {
        this._checkArgumentNullException(subscriptionId,componentId,productId);
        if(this._componentProductMap.has(subscriptionId))
        {

        }
        else
        {
            const ComponentMapProduct =  new Map<number,ProductInfo>();
        }
    }
	GetDefaultProductList(): ProductInfo[] {
		return this._mapToArray(this._products);
	}
}
