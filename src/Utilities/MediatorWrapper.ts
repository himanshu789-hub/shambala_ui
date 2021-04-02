import { ProductInfo } from 'Types/Mediator';
import { Product } from 'Types/Product';
import FlavourMediator, { IFlavourMediator } from './FlavourMediator';
import QuantityMediator, { IQuantityMediator } from './QuantityMediator';
import ComponentProductMediator, { IProductMediator } from './ProductMediator';

export default class MediatorWrapper {
	_productMediator: IProductMediator;
	_flavourMediator: IFlavourMediator;
	_quantityMediator: IQuantityMediator;
	constructor(products: Product[]) {
		this._productMediator = new ComponentProductMediator(products);
		this._flavourMediator = new FlavourMediator(products);
		this._quantityMediator = new QuantityMediator(products);
	}
	GetProducts(subscriptionId: number, componentId: number): ProductInfo[] {
		return this._productMediator.GetDefaultProductList(subscriptionId, componentId);
	}
	SetASubscription(subscriptionId: number, componentId: number, productId: number, flavourId?: number, quantity?: number) {
		if (this._productMediator.IsAlreadySubscribed(subscriptionId, componentId)) {
			if (this._productMediator.ChangeSubscription(subscriptionId, componentId, productId)) {
				this._flavourMediator.IsSubscribed(subscriptionId, componentId) &&
					flavourId &&
					this._flavourMediator.Unsubscribe(subscriptionId, componentId);
			}
			if (flavourId) {
				if (this._flavourMediator.IsSubscribed(subscriptionId, componentId)) {
					if (this._flavourMediator.ChangeSubscription(subscriptionId, componentId, productId, flavourId)) {
						this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId) &&
							this._quantityMediator.Unsubscibe(subscriptionId, componentId);
					}
					if (quantity) {
						if (this._quantityMediator.IsQuantitySubscribed(subscriptionId, componentId)) {
							this._quantityMediator.ChangeQuantity(subscriptionId, componentId, productId, flavourId,quantity);
						} else {
							this._quantityMediator.Subscribe(subscriptionId, componentId, productId, flavourId, quantity);
						}
					}
				} else {
					this._flavourMediator.Subscribe(subscriptionId, componentId, productId, flavourId);
				}
			}
		} else {
			this._productMediator.Subscribe(subscriptionId, componentId, productId);
		}
	}
}
