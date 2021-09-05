import QuantityMediator, { IQuantityMediator } from './.././../../../Utilities/QuantityMediator';

export interface IQuantityMediatorWrapper {
    GetQuantityLimit():number;
    Unsubscribe(componentId:number):void;
    ChangeQuantity(componentId:number,quantity:number):void;
    Subscribe(componentId:number,quantity:number):void;
    IsQuantitySubscribed(componentId:number):boolean;
}
export default class OutgoingMediator implements IQuantityMediatorWrapper  {
    private quantityMediator:IQuantityMediator;
    constructor(quantityLimit:number) {
            this.quantityMediator = new QuantityMediator([{CaretSize:12,Flavours:[{Id:1,Quantity:quantityLimit,Title:''}],Id:1,Name:'',Price:0,SchemeQuantity:0,PricePerBottle:0}]);
    }
    GetQuantityLimit(): number {
     return this.quantityMediator.GetQuantityLimit(1,1);
    }
    Unsubscribe(componentId: number): void {
        this.quantityMediator.Unsubscibe(1,componentId);
    }
    ChangeQuantity(componentId: number, quantity: number): void {
        this.quantityMediator.ChangeQuantity(1,componentId,1,1,quantity);
    }
    Subscribe(componentId: number, quantity: number): void {
        this.quantityMediator.Subscribe(1,componentId,1,1,quantity);
    }
    IsQuantitySubscribed(componentId: number): boolean {
    return    this.quantityMediator.IsQuantitySubscribed(1,componentId);
    }
}