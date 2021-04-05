import ComponentError from 'Components/ComponentError/ComponentError';
import Loader, { CallStatus } from 'Components/Loader/Loader';
import ShipmentList from 'Components/ShipmentList/ShipmentList';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IShipmentElement, Product } from 'Types/Types';

interface IOutgoingShipmentReturnProps extends RouteComponentProps {}
type OutgoingShipmentReturnState = {
	ApiStatus: number;
    AnyComponentError:boolean;
	Products: Product[];
};
export default class OutgoingShipmentReturn extends React.Component<IOutgoingShipmentReturnProps, OutgoingShipmentReturnState> {
	constructor(props: IOutgoingShipmentReturnProps) {
		super(props);
		this.setState({ ApiStatus: CallStatus.LOADING ,AnyComponentError:false});
	}
	handleSubmit = (shipments: IShipmentElement[]) => {};
	render() {
		const { ApiStatus, Products,AnyComponentError } = this.state;
		return (
			<ComponentError show={AnyComponentError}>
				<div className='returns'>
					<Loader Status={ApiStatus}>
						<ShipmentList Products={Products} ShouldLimitQuantity={true} handleSubmit={this.handleSubmit} />
					</Loader>
				</div>
			</ComponentError>
		);
	}
	componentDidMount() {
		const {
			location: { search }
		} = this.props;
        
	}
}
