import { OutgoingStatus } from 'Enums/Enum';
import { SalesmanProperties,Product,OutgoingShipment } from 'Types/Types';
import { productsWithLimit } from './Product';
import { Salesman } from './Salesman';
import {OutgoingShipmentDetails} from 'Types/DTO';


export const OutgoingShipmentValue: OutgoingShipment[] = [
	{
		Id: 1,
		DateCreated: new Date().toUTCString(),
		Salesman: Salesman[0],
		Status: OutgoingStatus.COMPLETED,
	},
	{
		Id: 2,
		DateCreated: new Date().toUTCString(),
		Salesman: Salesman[1],
		Status: OutgoingStatus.PENDING,
	},
];
export const OutgoingShipmentProducts: OutgoingShipmentDetails = {
	Id: 1,
	OutgoingShipmentDetail: {
		Id: 2,
		DateCreated: new Date().toUTCString(),
		Salesman: { FirstName: 'John', Id: 2, LastName: 'Wick' },
		Status: OutgoingStatus.PENDING,
	},
	Products: productsWithLimit,
};
