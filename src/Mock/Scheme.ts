import { SchemeKey } from 'Enums/Enum';
import { Scheme } from 'Types/DTO';

export const AllMockScheme: Scheme[] = [
	{
		Id: 1,
		Date: new Date().toUTCString(),
		Title: '20%_OFF',
		SchemeType: SchemeKey.PERCENTAGE,
		Value: 0.2,
		IsUserDefinedScheme: false,
	},
	{
		Id: 2,
		Date: new Date().toUTCString(),
		Title: '1_CARET_FREE',
		SchemeType: SchemeKey.CARET,
		Value: 1,
		IsUserDefinedScheme: true,
	},
	{
		Id: 3,
		Date: new Date().toUTCString(),
		Title: '2_BOTTLE_FREE',
		SchemeType: SchemeKey.BOTTLE,
		Value: 2,
		IsUserDefinedScheme: true,
	},
	{
		Id: 4,
		Date: new Date().toUTCString(),
		Title: '3_BOTTLE_FREE',
		SchemeType: SchemeKey.BOTTLE,
		Value: 3,
		IsUserDefinedScheme: false,
	},
];
