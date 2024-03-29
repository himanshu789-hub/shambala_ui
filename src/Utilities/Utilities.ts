﻿import { ValueContainer } from "Components/Select/Select";
import { SchemeKey, SchemeType } from "Enums/Enum";
import { Flavour, IOutgoingShipmentAddDetail, Product, SchemeDTO, ShipmentDTO } from "Types/DTO";
import { ProductInfo } from 'Types/Mediator';
import Big from 'big.js';

export const IsValidInteger = function (num: string): boolean {
	if (num.length === 0)
		return false;
	return num.search("[\D]") == -1;
}
export const provideValidInteger = (num: string): number => {
	if (!num.length) return 0;
	const parseInteger = Number.parseInt(num);
	if (parseInteger) return parseInteger;
	return Number.parseInt(num.substring(0, num.length - 1));
};
export function provideValidFloat(num: string): number {
	const re = Number.parseFloat(Number.parseFloat(num).toFixed(2));
	return num.indexOf('.') != -1 ? re + 0.00 : re;
}
export function divideDecimalAndRound(numA:number,numB:number){
	return new Big(numA).div(numB).round(2).toNumber();
}
export function deepCloneProducts(products: Product[]) {
	let CloneProducts = [];
	for (let i = 0; i < products.length; i++) {
		const Product = products[i];
		const Flavours = Product.Flavours;
		let CloneFlavours = [];
		for (let j = 0; j < Flavours.length; j++) {
			CloneFlavours.push({ ...Flavours[j] });
		}
		CloneProducts.push({ ...Product, Flavour: CloneFlavours });
	}
	return CloneProducts;
}
export function round(num:number) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}
getARandomNumber.num = 1;
export function doFlavourExists(flavours: Flavour[], Id: number) {
	return flavours.find(e => e.Id === Id) !== undefined;
}
export function getARandomNumber(): number {
	return getARandomNumber.num++;
}

export function getQuantityInText(quantity: number, caretSize: number) {
	const pieces = (quantity) % caretSize;
	return `${Math.floor(quantity / caretSize)}/${pieces}${pieces <= 1 ? '' : ''}`;
}
export function getPriceInText(price: number) {
	return '\u20B9 ' + price;
}
export function postValidSchemeValue(Type: SchemeKey, val: number) {
	if (Type === SchemeKey.PERCENTAGE)
		return val / 100;
	return val
}
export function getValidSchemeValue(Type: SchemeKey, val: number) {
	if (Type === SchemeKey.PERCENTAGE)
		return (val * 100).toPrecision(2);
	return (val).toPrecision(0);
}
export const Parser = {
	FlavoursToValueContainer: function (flaours: Flavour[]): ValueContainer[] {
		return flaours.map(e => ({ label: e.Title, value: e.Id }));
	},
	ProductsToValueContainer: function (products: ProductInfo[]): ValueContainer[] {
		return products.map(e => ({ label: e.Title, value: e.Id }));
	}
}
export function IsFuntionOrConstructor(element: (Function | (new (...args: any) => any))) {
	let IsFunction = false;
	try {
		//@ts-ignore
		(new validator(params.data));
	}
	catch (e) {
		IsFunction = true;
	}
	return IsFunction;
}
export const KeyCode = {
	UP: 38,
	DOWN: 40,
	ENTER: 13,
	ESC: 27,
	HOME: 36,
	END: 35,
	LEFT: 37,
	RIGHT: 39
}
export function getSchemeText(scheme?: SchemeDTO) {
	let result = "";
	if (!scheme)
		return "";
	switch (scheme.SchemeType) {
		case SchemeKey.BOTTLE:
			result = scheme.Value + "FREE";
			break;
		case SchemeKey.CARET:
			result = scheme.Value + "FREE";
			break;
		case SchemeKey.PERCENTAGE:
			result = getValidSchemeValue(scheme.SchemeType, scheme.Value) + "% Off";
	}
	return result;
}
export function OutgoingDetailToShipment(shipment: IOutgoingShipmentAddDetail): ShipmentDTO {
	return { CaretSize: shipment.CaretSize, FlavourId: shipment.FlavourId, Id: shipment.Id, ProductId: shipment.ProductId, TotalDefectedPieces: shipment.TotalQuantityRejected, TotalRecievedPieces: shipment.TotalQuantityTaken }
}
export function toDateText(date: string) {
	return new Date(date).toDateString();
}
export function tocurrencyText(num: number) {
	return 0x20B9 + num;
}
export class UniqueValueProvider<T = number>
{
	private _valueGenerator?: Function;
	private _values: Set<T>;
	private _maxIteration: number | undefined;
	constructor(valueGenerater?: () => T, tryAgain?: number, values: T[] = []) {
		this._valueGenerator = valueGenerater;
		this._values = new Set<T>(values);
		this._maxIteration = tryAgain;
	}
	DoValueExists(value: T) {
		return this._values.has(value);
	}
	GetUniqueValue(): T {
		let newValue: T;
		let count = 0;
		do {
			if (count === this._maxIteration)
				throw new Error('Cannot Generate Unique Value');
			newValue = this._valueGenerator ? this._valueGenerator() : getARandomNumber();
			count++;
		}
		while (this._values.has(newValue));
		this._values.add(newValue);
		return newValue;
	}
	Add(value: T) {
		if (this._values.has(value)) {
			throw new Error("Value Already Exists");
		}
		this._values.add(value);
	}
	Flush() {
		this._values.clear();
	}
}
export function getTotalPrice(quantity: number, pricePerCarat: number, PricePerBottle: number, caretSize: number) {
	const caratPrice = mulDecimal(Math.floor(quantity / caretSize), pricePerCarat);
	const piecePrice = mulDecimal((quantity % caretSize), PricePerBottle);
	return addDecimal(caratPrice , piecePrice);
}
export function addDecimal(numA: number, numB: number) {
	return new Big(numA).add(numB).toNumber();
}
export function mulDecimal(numA: number, numB: number) {
	return new Big(numA).mul(numB).round(2).toNumber();
}