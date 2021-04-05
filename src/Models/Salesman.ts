import {SalesmanProperties} from 'Types/Types';
export class Salesman {
	Id: number;
	FirstName: string;
	LastName: string;
	constructor({ Id, FirstName, LastName }: SalesmanProperties) {
		this.Id = Id;
		this.FirstName = FirstName;
		this.LastName = LastName;
	}
	public GetFullName = (): string => `${this.FirstName} ${this.LastName}`;
}
