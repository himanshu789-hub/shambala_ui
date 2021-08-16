import { Component } from 'react';
import { ProductInfo } from 'Types/Mediator';
import { Flavour } from 'Types/DTO';
import MediatorSubject from './MediatorSubject';

export type ReactComponent = Component<any, any>;

export default class Observer {
	public ProductId?: number;
	public _componentId: number;
	public _subscriptionId: number;
	private _subject: MediatorSubject;
	private _component?: ReactComponent;
	public FlavourId?: number;
	constructor(subscriptionId: number, componentId: number, subject: MediatorSubject) {
		this._subscriptionId = subscriptionId;
		this._componentId = componentId;
		this._subject = subject;
	}
	GetObserverInfo() {
		return { SubscriptionId: this._subscriptionId, ComponentId: this._componentId };
	}
	SetComponent(component: ReactComponent) {
		this._component = component;
	}
	
	GetProduct(): ProductInfo[] {
		return this._subject.GetProducts(this._subscriptionId, this._componentId);
	}
	GetQuantityLimit(): number {
		if (!(this.ProductId && this.FlavourId)) {
			console.error('Product or Flavour Not Set');
			return -1;
		}
		return this._subject.GetQuantity(this.ProductId as number, this.FlavourId as number);
	}
	Unubscribe() {
		if (!(this._componentId && this._subscriptionId)) {
			return;
		}
		this._subject.UnsubscribeAComponent(this._subscriptionId, this._componentId);
	}
	UnsubscribeToQuantity() {
		if (!(this._subscriptionId && this._componentId)) {
			console.error('Product or Flavour Not Set');
			return;
		}
		this._subject.UnsubscribeToQuantity(this._subscriptionId as number, this._componentId as number);
	}

	GetFlavours(): Flavour[] {
		if (!this.ProductId) {
			console.error('Product Id  no Set');
			return [];
		}
		return this._subject.GetFlavours(this._subscriptionId, this._componentId, this.ProductId as number);
	}
	SetProduct(Id: number): void {
		this._subject.SetASubscription(this._subscriptionId, this._componentId, Id);
	}
	SetFlavour(Id: number) {
		if (!this.ProductId) {
			console.error('Product Not Set');
			return;
		}
		this._subject.SetASubscription(this._subscriptionId, this._componentId, this.ProductId as number, Id);
	}
	SetQuantity(quantity: number) {
		if (!this.ProductId) {
			console.error('Product Not Set');
			return;
		}
		this._subject.SetASubscription(this._subscriptionId, this._componentId, this.ProductId, this.FlavourId, quantity);
	}
}
