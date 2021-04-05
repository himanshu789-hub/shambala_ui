import { Shop } from 'Types/DTO';

export const Shops: Shop[] = [
	{
		Id: 1,
		Address: 'Tellibandha Raipur',
		IsWithPredinedScheme: false,
		Name: 'General Store',
		Scheme: { Date: new Date().toUTCString(), Id: 1, Name: 'I_DO_D',IsUserDefinedScheme:false,SchemeType:1,Value:12 },
	},
];
