import Loader, { CallStatus } from 'Components/Loader/Loader';
import ShipmentList from 'Containers/ShipmentList/ShipmentList';
import IOutgoingService from 'Contracts/Services/IOutgoingShipmentService';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import OutgoingService from 'Services/OutgoingShipmentService';
import { IShipmentElement, Product } from 'Types/Types';

interface IOutgoingShipmentReturnProps extends RouteComponentProps { }
type OutgoingShipmentReturnState = {
	ApiStatus: number;
	Products: Product[];
};
export default class OutgoingShipmentReturn extends React.Component<IOutgoingShipmentReturnProps, OutgoingShipmentReturnState> {
	_outgoingService: IOutgoingService;
	constructor(props: IOutgoingShipmentReturnProps) {
		super(props);
		this.state = {
			ApiStatus: CallStatus.LOADING,
			Products: [],
		};
		this._outgoingService = new OutgoingService();
	}
	handleSubmit = (shipments: IShipmentElement[]) => { };
	render() {
		const { ApiStatus, Products } = this.state;
		return (
			<div className='returns'>
			<h4>Outgoing Shipment Return</h4>
				<Loader Status={ApiStatus} Message={'Gathering Shipment Info'}>
					<ShipmentList Products={Products} ShouldLimitQuantity={true} handleSubmit={this.handleSubmit} />
				</Loader>
			</div>
		);
	}
	componentDidMount() {
		const {
			match: { params },
		} = this.props;
		this._outgoingService.GetShipmentDetailsById(1).then(res => this.setState({ Products: res.data.Products, ApiStatus: CallStatus.LOADED }));
	}
}
