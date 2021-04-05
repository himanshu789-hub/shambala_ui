import { Product } from 'Types/Types';

export let productsWithLimit: Product[] = [
	{
		Carets: [
			{ CaretSize: 12, Id: 1 },
			{ CaretSize: 24, Id: 2 },
		],
		Id: 1,
		Name: '100 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange', Quantity: 10 },
			{ Id: 2, Title: 'Mango', Quantity: 100 },
			{ Id: 3, Title: 'Lemonade', Quantity: 101 },
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
			{ Id: 1, Title: 'Orange', Quantity: 11 },
			{ Id: 2, Title: 'Mango', Quantity: 110 },
			{ Id: 3, Title: 'Lemonade', Quantity: 200 },
		],
	},
	{
		Carets: [
			{ CaretSize: 12, Id: 1 },
			{ CaretSize: 24, Id: 2 },
		],
		Id: 3,
		Name: '300 RGB',
		Flavour: [{ Id: 1, Title: 'No Flavour', Quantity: 112 }],
	},
	{
		Carets: [
			{ CaretSize: 12, Id: 1 },
			{ CaretSize: 24, Id: 2 },
		],
		Id: 4,
		Name: '400 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange', Quantity: 11 },
			{ Id: 2, Title: 'Mango', Quantity: 102 },
			{ Id: 3, Title: 'Lemonade', Quantity: 200 },
		],
	},
	{
		Carets: [{ CaretSize: 12, Id: 1 }],
		Id: 5,
		Name: '500 RGB',
		Flavour: [{ Id: 1, Title: 'No Flavour', Quantity: 10 }],
	},
];
export let productsWithoutLimit: Product[] = [
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
