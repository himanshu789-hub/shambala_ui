import { CallStatus } from 'Components/Loader/Loader';
import IOutgoingService from 'Contracts/Services/IOutgoingShipmentService';
import React from 'react';
import OutgoingService from 'Services/OutgoingShipmentService';
import { OutgoingShipmentDetails } from 'Types/types';
type InvoicesProps = {
	location:
};
type InvoicesState = {
	OutgoingShipmentDetail: OutgoingShipmentDetails | null;
	APIStatus:number;
};
export default class Invoices extends React.Component<InvoicesProps, InvoicesState> {
	_outgoingService: IOutgoingService;
	constructor(props: InvoicesProps) {
		super(props);
		this.state = {
			OutgoingShipmentDetail: null,
			APIStatus:CallStatus.EMPTY
		};
		this._outgoingService = new OutgoingService();
	}
	componentDidMount()
	{
		const {} = this.props;
		this._outgoingService.GetShipmentDetailsById()
	}
}
