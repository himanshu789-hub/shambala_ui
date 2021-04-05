import ComponentError from 'Components/ComponentError/ComponentError';
import Loader, { CallStatus } from 'Components/Loader/Loader';
import ShipmentList from 'Components/ShipmentList/ShipmentList';
import IOutgoingService from 'Contracts/Services/IOutgoingShipmentService';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import OutgoingService from 'Services/OutgoingShipmentService';
import { IShipmentElement, Product } from 'Types/Types';

interface IOutgoingShipmentReturnProps extends RouteComponentProps {}
type OutgoingShipmentReturnState = {
	ApiStatus: number;
	AnyComponentError: boolean;
	Products: Product[];
};
export default class OutgoingShipmentReturn extends React.Component<IOutgoingShipmentReturnProps, OutgoingShipmentReturnState> {
	_outgoingService: IOutgoingService;
	constructor(props: IOutgoingShipmentReturnProps) {
		super(props);
		this.state = {
			ApiStatus: CallStatus.LOADING,
			Products: [],
			AnyComponentError: false,
		};
		this._outgoingService = new OutgoingService();
	}
	handleSubmit = (shipments: IShipmentElement[]) => {};
	render() {
		const { ApiStatus, Products, AnyComponentError } = this.state;
		return (
			<ComponentError show={AnyComponentError}>
				<div className='returns'>
					<Loader Status={ApiStatus} Message={'Gathering Shipment Info'}>
						<ShipmentList Products={Products} ShouldLimitQuantity={true} handleSubmit={this.handleSubmit} />
					</Loader>
				</div>
			</ComponentError>
		);
	}
	componentDidMount() {
		const {
			match: { params },
		} = this.props;
		this._outgoingService.GetShipmentDetailsById(1).then(res => this.setState({ Products: res.data.Products ,ApiStatus:CallStatus.LOADED}));
	}
}
