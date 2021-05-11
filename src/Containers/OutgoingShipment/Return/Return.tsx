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
	OutgoingShipmentId?: number;
};

function OutgoingStatusDisplay(props: { Status: OutgoingStatus }) {
	const Status = props.Status;
	let message = "";
	if (Status == OutgoingStatus.RETURNED)
		message = "The Shipment Has Been Succesfully Returned";
	else if (Status == OutgoingStatus.COMPLETED)
		message = "The Shipment Has Been Completed";
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
	handleSubmit = (shipments: IShipmentElement[]) => {
		const { OutgoingShipmentId } = this.state;
		if (OutgoingShipmentId) {
			this._outgoingService.Return(OutgoingShipmentId, shipments)
				.then(() => {
					const { history } = this.props;
					history.push("/message/pass", { message: "Return Posted Sucessfully" });
				})
				.catch(() => {
					const { history } = this.props;
					history.push("/message/fail", { message: "Some Error Ocurred" });
				});
		}
	};
	render() {
		const { ApiStatus, Products, OutgoingShipmentStatus } = this.state;
		let DisplayComponent = <React.Fragment></React.Fragment>;
		if (OutgoingStatus.PENDING)
			DisplayComponent = <ShipmentList Products={Products} ShouldLimitQuantity={true} handleSubmit={this.handleSubmit} />;
		else
			DisplayComponent = <OutgoingStatusDisplay Status={OutgoingShipmentStatus} />

		return (
			<div className='returns'>
				<h5 className="app-head">Outgoing Shipment Return</h5>
				{
					<Loader Status={ApiStatus} Message={'Gathering Shipment Info'}>
						{DisplayComponent}
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
				.then(res => this.setState({ Products: res.data.Products, ApiStatus: CallStatus.LOADED, OutgoingShipmentStatus: res.data.Status, OutgoingShipmentId: Id }))
				.catch(error => this.setState({ ApiStatus: CallStatus.ERROR }));
		}
		else
			console.error("Outgoing Shipment 'Id' Url Paramater Not Valid");
	}
}
