import Loader, { CallStatus } from 'Components/Loader/Loader';
import ShipmentList from 'Containers/ShipmentList/ShipmentList';
import IOutgoingShipmentService from 'Contracts/services/IOutgoingShipmentService';
import { OutgoingStatus } from 'Enums/Enum';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import OutgoingService from 'Services/OutgoingShipmentService';
import { ShipmentDTO, Product, OutgoingShipment } from 'Types/DTO';
import { InitialShipment } from 'Types/Types';
import { OutgoingDetailToShipment } from 'Utilities/Utilities';

interface MatchParams {
	id: string
}
interface IOutgoingShipmentReturnProps extends RouteComponentProps<MatchParams> { }
type OutgoingShipmentReturnState = {
	ApiStatus: number;
	Products: Product[];
	OutgoingShipment?: OutgoingShipment;
	InitialShipments?: InitialShipment[];
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
	_outgoingService: IOutgoingShipmentService;
	constructor(props: IOutgoingShipmentReturnProps) {
		super(props);
		this.state = {
			ApiStatus: CallStatus.LOADING,
			Products: [],
		};
		this._outgoingService = new OutgoingService();
	}
	handleSubmit = (shipments: ShipmentDTO[]) => {
		const { OutgoingShipment } = this.state;

		const { history } = this.props;
		if (OutgoingShipment) {
			this._outgoingService.Return(OutgoingShipment.Id, shipments)
				.then(() => {
					history.push({ pathname: "/message/pass", search: "?message=Return Posted Successfully" });
				})
				.catch(() => {
					history.push({ pathname: "/message/fail", search: "?message=Some Error Ocurred" });
				});
		}
	};
	render() {
		const { ApiStatus, Products, OutgoingShipment, InitialShipments } = this.state;
		let DisplayComponent = <React.Fragment></React.Fragment>;

		if (OutgoingShipment) {
			DisplayComponent = <ShipmentList Products={Products} ShouldLimitQuantity={true} handleSubmit={this.handleSubmit}
				InitialShipments={InitialShipments} />;
		}
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
				.then(res => {
					this.setState({ Products: res.data.Products });
					return this._outgoingService.GetById(Id);
				}).then(result => {
					this.setState({
						InitialShipments: result.data.Status == OutgoingStatus.PENDING ? result.data.OutgoingShipmentDetails.filter(e => e.TotalQuantityReturned > 0).map(e => { return { Shipment: {...OutgoingDetailToShipment(e),TotalRecievedPieces:e.TotalQuantityReturned,TotalDefectedPieces:e.TotalQuantityRejected} } }) : undefined,
						ApiStatus: CallStatus.LOADED
					});
				})
				.catch(() => this.setState({ ApiStatus: CallStatus.ERROR }));

		}
		else
			console.error("Outgoing Shipment 'Id' Url Paramater Not Valid");
	}
}
