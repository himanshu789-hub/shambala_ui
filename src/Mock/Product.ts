import { Product } from 'Types/Types';

export let productsWithLimit: Product[] = [
	{
		CaretSize: 12,
		Id: 1,
		Name: '100 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange', Quantity: 10 },
			{ Id: 2, Title: 'Mango', Quantity: 100 },
			{ Id: 3, Title: 'Lemonade', Quantity: 101 },
		],
	},
	{
		CaretSize:30,
		Id: 2,
		Name: '200 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange', Quantity: 11 },
			{ Id: 2, Title: 'Mango', Quantity: 110 },
			{ Id: 3, Title: 'Lemonade', Quantity: 200 },
		],
	},
	{
		CaretSize: 24,
		Id: 3,
		Name: '300 RGB',
		Flavour: [{ Id: 1, Title: 'No Flavour', Quantity: 112 }],
	},
	{
		CaretSize: 24,
		Id: 4,
		Name: '400 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange', Quantity: 11 },
			{ Id: 2, Title: 'Mango', Quantity: 102 },
			{ Id: 3, Title: 'Lemonade', Quantity: 200 },
		],
	},
	{
		CaretSize:24,
		Id: 5,
		Name: '500 RGB',
		Flavour: [{ Id: 1, Title: 'No Flavour', Quantity: 10 }],
	},
];
export let productsWithoutLimit: Product[] = [
	{
		CaretSize:12,
		Id: 1,
		Name: '100 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange' },
			{ Id: 2, Title: 'Mango' },
			{ Id: 3, Title: 'Lemonade' },
		],
	},
	{
		CaretSize: 10,
		Id: 2,
		Name: '200 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange' },
			{ Id: 2, Title: 'Mango' },
			{ Id: 3, Title: 'Lemonade' },
		],
	},
	{
		CaretSize: 12,
		Id: 3,
		Name: '300 RGB',
		Flavour: [{ Id: 1, Title: 'No Flavour' }],
	},
	{
		CaretSize: 24,
		Id: 4,
		Name: '400 RGB',
		Flavour: [
			{ Id: 1, Title: 'Orange' },
			{ Id: 2, Title: 'Mango' },
			{ Id: 3, Title: 'Lemonade' },
		],
	},
	{
		CaretSize: 30,
		Id: 5,
		Name: '500 RGB',
		Flavour: [{ Id: 1, Title: 'No Flavour' }],
	},
];
