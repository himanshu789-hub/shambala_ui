import { Component } from 'react';
import ComponentProductMediator, { IProductMediator } from './ComponentProductMediator';
type ReactComponent = Component<any, any>;

class ProductObserver {
	private _productId?: number;
	private _componentId: number;
	private _subscriptionId: number;
	private _subject: IProductSubject;
	private _component: ReactComponent;
	constructor(subscriptionId: number, componentId: number, component: ReactComponent, subject: IProductSubject) {
		this._subscriptionId = subscriptionId;
		this._componentId = componentId;
		this._component = component;
		this._subject = subject;
	}
	SetProduct(Id: number): void {
		if (!this._subject.ProductMediator.IsAlreadySubscribed(this._subscriptionId, this._componentId)) {
			this._productId = Id;
			this._subject.ProductMediator.Subscribe(this._subscriptionId, this._componentId, Id);
		} else {
			if (this._subject.ProductMediator.ChangeSubscription(this._subscriptionId, this._componentId, Id)) {
				this._productId = Id;
			}
		}
	}
}
interface IProductSubject {
	ProductMediator: IProductMediator;
}
