import { SchemeKey, SchemeType } from "Enums/Enum";
import { Product } from "Types/DTO";

export const provideValidNumber = (num: string): number => {
	if (!num.length) return 0;

	const parseInteger = Number.parseInt(num);
	if (parseInteger) return parseInteger;

	return Number.parseInt(num.substring(0, num.length - 1));
};
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
export function getARandomNumber(power?: number): number {
	return Math.floor(Math.random() * Math.pow(10, power ?? 1));
}
export function caretInfo(quantity: number, caretSize: number) {
	const pieces = quantity % caretSize;
	return `${Math.floor(quantity / caretSize)} Caret ${pieces} Piece${pieces <= 1 ? '' : 's'}`;
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