import { Component } from 'react';
import { ProductInfo } from 'Types/Mediator';
import { Flavour } from 'Types/Types';
import MediatorSubject from './MediatorSubject';

export type ReactComponent = Component<any, any>;

export default class Observer {
	private _productId?: number;
	private _componentId: number;
	private _subscriptionId: number;
	private _subject: MediatorSubject;
	private _component?: ReactComponent;
	private _flavourId?: number;
	constructor(subscriptionId: number, componentId: number, subject: MediatorSubject) {
		this._subscriptionId = subscriptionId;
		this._componentId = componentId;
		this._subject = subject;
	}
	SetComponent(component: ReactComponent) {
		this._component = component;
	}
	GetProduct(): ProductInfo[] {
		return this._subject.GetProducts(this._subscriptionId, this._componentId);
	}
	GetQuantityLimit(): number {
		if (!(this._productId && this._flavourId)) {
			console.error('Product or Flavour Not Set');
			return -1;
		}
		return this._subject.GetQuantity(this._productId as number, this._flavourId as number);
	}
	UnsubscribeToQuantity(quantity: number) {
		if (!(this._subscriptionId && this._componentId)) {
			console.error('Product or Flavour Not Set');
			return;
		}
		this._subject.UnsubscribeToQuantity(this._subscriptionId as number, this._componentId as number);
	}
	GetFlavours(): Flavour[] {
		if (!this._productId) {
			console.error('Product Id  no Set');
			return [];
		}
		return this._subject.GetFlavours(this._subscriptionId, this._componentId, this._productId as number);
	}
	SetProduct(Id: number): void {
		this._subject.SetASubscription(this._subscriptionId, this._componentId, Id);
		this._productId = Id;
	}
	SetFlavour(Id: number) {
		if (!this._productId) {
			console.error('Product Not Set');
			return;
		}
		this._subject.SetASubscription(this._subscriptionId, this._componentId, this._productId as number, Id);
		this._flavourId = Id;
	}
	SetQuantity(quantity: number) {
		if (!this._productId) {
			console.error('Product Not Set');
			return;
		}
		this._subject.SetASubscription(this._subscriptionId, this._componentId, this._productId, this._flavourId, quantity);
	}
}
