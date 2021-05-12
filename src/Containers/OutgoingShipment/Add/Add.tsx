import React from 'react';
import ShipmentList from 'Containers/ShipmentList/ShipmentList';
import IProductService from 'Contracts/services/IProductService';
import ProductService from 'Services/ProductService';
import { ShipmentDTO, PostOutgoingShipment, Product, SalesmanDTO } from 'Types/DTO';
import Loader, { CallStatus } from 'Components/Loader/Loader';
import IOutgoingService from 'Contracts/services/IOutgoingShipmentService';
import OutgoingService from 'Services/OutgoingShipmentService';
import ISalesmanService from 'Contracts/services/ISalesmanService';
import { SalesmanService } from 'Services/SalesmanService';
import SalesmanList from 'Components/SalesmanList/SalesmanList';
import { RouteChildrenProps } from 'react-router';

interface OutgoingShipmentAddProps extends RouteChildrenProps { };
type OutgoingShipmentAddState = {
	Products: Product[];
	APIStatus: CallStatus;
	SalesmanList: SalesmanDTO[];
	OutgoingShipment: PostOutgoingShipment;
	SalesmanSelectionErrorMessage: string;
};
export default class OutgoingShipmentAdd extends React.Component<OutgoingShipmentAddProps, OutgoingShipmentAddState> {
	_productService: IProductService;
	_outgoingShipmentService: IOutgoingService;
	_salesmanService: ISalesmanService;
	constructor(props: OutgoingShipmentAddProps) {
		super(props);
		this._productService = new ProductService();
		this.state = {
			Products: [], APIStatus: CallStatus.EMPTY, SalesmanList: [],
			OutgoingShipment: { DateCreated: new Date(), OutgoingShipmentDetails: [], SalesmanId: -1 },
			SalesmanSelectionErrorMessage: ""
		};
		this._salesmanService = new SalesmanService();
		this._outgoingShipmentService = new OutgoingService();
	}
	handleSubmit(Shipments: ShipmentDTO[]) {
		const { OutgoingShipment } = this.state;
		if (this.IsAllValid()) {
			OutgoingShipment.DateCreated = new Date();
			this._outgoingShipmentService.PostOutgoingShipmentWithProductList(OutgoingShipment)
			.then(() => {
				const { history } = this.props;
				history.push("/message/pass", { message: "Added Sucessfully" });
			}).catch(() => {
				const { history } = this.props;
				history.push("/message/fail", { message: "Some Error Ocurred" });
			});
		}
	}
	IsAllValid = (): boolean => {
		let IsAllValid = true;
		const { OutgoingShipment } = this.state;
		if (OutgoingShipment.SalesmanId == -1) {
			this.setState({ SalesmanSelectionErrorMessage: 'Please Select A Salesman' });
			IsAllValid = false;
		}
		return IsAllValid;
	}
	handleSelection = (Id: number) => {
		this.setState(({ OutgoingShipment }) => { return { OutgoingShipment: { ...OutgoingShipment, SalesmanId: Id }, SalesmanSelectionErrorMessage: '' } });
	}
	render() {
		const { APIStatus, SalesmanList: Salesmans, SalesmanSelectionErrorMessage } = this.state;
		return (
			<div className='outgoing-add'>
				<h5 className="app-head">Add Outgoing Shipment</h5>
				<Loader Status={APIStatus}>
					<React.Fragment>
						<div className="d-flex flex-column">
							<SalesmanList Salesmans={Salesmans} handleSelection={this.handleSelection} />
							<small className='form-text  text-danger'>{SalesmanSelectionErrorMessage}</small>
						</div>
						<ShipmentList Products={this.state.Products} handleSubmit={this.handleSubmit} ShouldLimitQuantity={true} />
					</React.Fragment>
				</Loader>
			</div>
		);
	}
	componentDidMount() {
		this.setState({ APIStatus: CallStatus.LOADING });
		this._productService.GetAll().then(res => {
			this.setState({ Products: res.data });
			return this._salesmanService.GetAll()
		}).then(res => this.setState({ SalesmanList: res.data }))
		.catch(error => this.setState({ APIStatus: CallStatus.ERROR }));
	}
}
