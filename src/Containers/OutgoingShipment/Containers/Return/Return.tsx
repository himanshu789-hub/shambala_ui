import Loader, { CallStatus } from 'Components/Loader/Loader';
import ShipmentList from 'Containers/ShipmentList/ShipmentList';
import IOutgoingService from 'Contracts/services/IOutgoingShipmentService';
import { OutgoingStatus } from 'Enums/Enum';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import OutgoingService from 'Services/OutgoingShipmentService';
import { IShipmentElement, Product } from 'Types/DTO';

interface MatchParams {
	id: string
}
interface IOutgoingShipmentReturnProps extends RouteComponentProps<MatchParams> { }
type OutgoingShipmentReturnState = {
	ApiStatus: number;
	Products: Product[];
	OutgoingShipmentStatus: OutgoingStatus;
};

function OutgoingStatusDisplay(props: { Status: OutgoingStatus }) {
	const Status = props.Status;
	let message = "";
	if (Status == OutgoingStatus.RETURNED)
		message = "The Shipment Has Been Succesfully Returned";
	else if (Status == OutgoingStatus.COMPLETED)
		message = "The Shipment Has Been Complted";
	return <div className="alert alert-danger">{message}</div>;
}
export default class OutgoingShipmentReturn extends React.Component<IOutgoingShipmentReturnProps, OutgoingShipmentReturnState> {
	_outgoingService: IOutgoingService;
	constructor(props: IOutgoingShipmentReturnProps) {
		super(props);
		this.state = {
			ApiStatus: CallStatus.LOADING,
			Products: [],
			OutgoingShipmentStatus: OutgoingStatus.PENDING
		};
		this._outgoingService = new OutgoingService();
	}
	handleSubmit = (shipments: IShipmentElement[]) => { };
	render() {
		const { ApiStatus, Products, OutgoingShipmentStatus } = this.state;
		let DisplayCOmponent = <React.Fragment></React.Fragment>;
		if (OutgoingStatus.PENDING)
			DisplayCOmponent = <ShipmentList Products={Products} ShouldLimitQuantity={true} handleSubmit={this.handleSubmit} />;
		else
			DisplayCOmponent = <OutgoingStatusDisplay Status={OutgoingShipmentStatus} />

		return (
			<div className='returns'>
				<h5 className="app-head">Outgoing Shipment Return</h5>
				{
					<Loader Status={ApiStatus} Message={'Gathering Shipment Info'}>
						{DisplayCOmponent}
					</Loader>
				}
			</div>
		);
	}
	componentDidMount() {
		const {
			match: { params: { id } },
		} = this.props;
		const Id = Number.parseInt(id);
		if (Id) {
			this._outgoingService.GetShipmentProductDetailsById(Id)
				.then(res => this.setState({ Products: res.data.Products, ApiStatus: CallStatus.LOADED, OutgoingShipmentStatus: res.data.Status }))
				.catch(error => this.setState({ ApiStatus: CallStatus.ERROR }));
		}
		else
			console.error("Outgoing Shipment 'Id' Url Paramater Not Valid");
	}
}
