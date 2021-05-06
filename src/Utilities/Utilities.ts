import { Product } from "Types/DTO";

export const provideValidNumber = (num: string): number => {
	if (!num.length) return 0;
	const parseInteger = Number.parseInt(num);
	if (parseInteger) return parseInteger;
	else if (num.length === 1) return 0;
	return Number.parseInt(num.substring(0, num.length - 1));
};
export function deepCloneProducts(products:Product[])
{
	let CloneProducts = [];
    for(let i=0;i<products.length;i++)
	{
		const Product = products[i];
		const Flavours = Product.Flavours;
		let CloneFlavours = [];
		for(let j=0;j<Flavours.length;j++)
		{
			CloneFlavours.push({...Flavours[j]});
		}
		CloneProducts.push({...Product,Flavour:CloneFlavours});
	}
	return CloneProducts;
}

export function caretInfo(quantity:number,caretSize:number){
	const pieces = quantity%caretSize;
return `${Math.floor(quantity/caretSize)} Caret ${pieces} Piece${pieces<=1?'':'s'}`;
}