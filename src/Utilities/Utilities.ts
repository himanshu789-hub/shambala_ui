import { Product } from "Types/types";

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
		const Flavours = Product.Flavour;
		let CloneFlavours = [];
		for(let j=0;j<Flavours.length;j++)
		{
			CloneFlavours.push({...Flavours[j]});
		}
		CloneProducts.push({...Product,Flavour:CloneFlavours});
	}
	return CloneProducts;
}