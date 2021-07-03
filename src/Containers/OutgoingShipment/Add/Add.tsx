import React from 'react';
import ShipmentList from 'Containers/ShipmentList/ShipmentList';
import IProductService from 'Contracts/services/IProductService';
import ProductService from 'Services/ProductService';
import { ShipmentDTO, PostOutgoingShipment, Product, SalesmanDTO, BadRequestError, OutOfStock } from 'Types/DTO';
import Loader, { CallStatus } from 'Components/Loader/Loader';
import IOutgoingShipmentService from 'Contracts/services/IOutgoingShipmentService';
import OutgoingService from 'Services/OutgoingShipmentService';
import SalesmanList from 'Components/SalesmanList/SalesmanList';
import { RouteChildrenProps } from 'react-router';
import { AxiosError } from 'axios';

interface OutgoingShipmentAddProps extends RouteChildrenProps { };
type OutgoingShipmentAddState = {
	Products: Product[];
	APIStatus: CallStatus;
	SalesmanSelectionErrorMessage: string;
	SalesmanId: number;
	OutOfStock?: OutOfStock[]
};
export default class OutgoingShipmentAdd extends React.Component<OutgoingShipmentAddProps, OutgoingShipmentAddState> {
	_productService: IProductService;
	_outgoingShipmentService: IOutgoingShipmentService;
	constructor(props: OutgoingShipmentAddProps) {
		super(props);
		this._productService = new ProductService();
		this.state = {
			Products: [], APIStatus: CallStatus.EMPTY,
			SalesmanSelectionErrorMessage: "", SalesmanId: -1
		};
		this._outgoingShipmentService = new OutgoingService();
	}
	handleSubmit = (Shipments: ShipmentDTO[]) => {
		if (this.IsAllValid()) {
			const OutgoingShipment: PostOutgoingShipment = { SalesmanId: this.state.SalesmanId, DateCreated: new Date(), Shipments: Shipments };
			OutgoingShipment.DateCreated = new Date();
			OutgoingShipment.Shipments = Shipments;
			this._outgoingShipmentService.PostOutgoingShipmentWithProductList(OutgoingShipment)
				.then(() => {
					const { history } = this.props;
					history.push({ pathname: "/message/pass", search: "?message=Added Sucessfully&redirect=/outgoing/search" });
				}).catch((error: AxiosError) => {
					if (error.code === 400 + '') {
						const data = error.response?.data as BadRequestError;
						if (data.Code == 102) {
							this.setState({ OutOfStock: data.Model as OutOfStock[] });
							return;
						}
					}
					const { history } = this.props;
					history.push({ pathname: "/message/fail" });

				});
		}
	}
	IsAllValid = (): boolean => {
		let IsAllValid = true;
		const { SalesmanId } = this.state;
		if (SalesmanId == -1) {
			this.setState({ SalesmanSelectionErrorMessage: 'Please Select A Salesman' });
			IsAllValid = false;
		}
		return IsAllValid;
	}
	handleSelection = (Id: number) => {
		this.setState({ SalesmanId: Id, SalesmanSelectionErrorMessage: '' });
	}
	render() {
		const { APIStatus, SalesmanSelectionErrorMessage, SalesmanId } = this.state;
		return (
			<div className='outgoing-add'>
				<h5 className="app-head">Add Outgoing Shipment</h5>
				<React.Fragment>
					<div className="d-flex flex-column">
						<SalesmanList handleSelection={this.handleSelection} SalemanId={SalesmanId} />
						<small className='form-text  text-danger'>{SalesmanSelectionErrorMessage}</small>
					</div>
					<Loader Status={APIStatus}>
						<ShipmentList Products={this.state.Products} handleSubmit={this.handleSubmit} ShouldLimitQuantity={true} />
					</Loader>

				</React.Fragment>
			</div>
		);
	}
	componentDidMount() {
		this.setState({ APIStatus: CallStatus.LOADING });
		this._productService.GetAll().then(res => {
			this.setState({ Products: res.data, APIStatus: CallStatus.LOADED });
		})
			.catch(error => this.setState({ APIStatus: CallStatus.ERROR }));
	}
}
