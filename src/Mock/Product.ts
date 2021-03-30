import { Product } from 'Types/Product';
export let products: Product[] = [
	{
		Carets: [
			{ CaretSize: 12, Id: 1 },
			{ CaretSize: 24, Id: 2 },
		],
		Id: 1,
		Name: '100 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange' },
			{ Id: 2, Title: 'Mango' },
			{ Id: 3, Title: 'Lemonade' },
		],
	},
	{
		Carets: [
			{ CaretSize: 12, Id: 1 },
			{ CaretSize: 24, Id: 2 },
		],
		Id: 2,
		Name: '200 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange' },
			{ Id: 2, Title: 'Mango' },
			{ Id: 3, Title: 'Lemonade' },
		],
	},
	{
		Carets: [
			{ CaretSize: 12, Id: 1 },
			{ CaretSize: 24, Id: 2 },
		],
		Id: 3,
		Name: '300 RGB',
		Flavour: [{ Id: 1, Title: 'No Flavour' }],
	},
	{
		Carets: [
			{ CaretSize: 12, Id: 1 },
			{ CaretSize: 24, Id: 2 },
		],
		Id: 4,
		Name: '400 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange' },
			{ Id: 2, Title: 'Mango' },
			{ Id: 3, Title: 'Lemonade' },
		],
	},
	{
		Carets: [{ CaretSize: 12, Id: 1 }],
		Id: 5,
		Name: '500 RGB',
		Flavour: [{ Id: 1, Title: 'No Flavour' }],
	},
];
