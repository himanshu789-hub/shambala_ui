import React, { ChangeEvent, SyntheticEvent } from 'react';
import { ShipmentDTO, Product } from 'Types/DTO';
import ShipmentList from 'Containers/ShipmentList/ShipmentList';
import ProductService from 'Services/ProductService';
import IProductService from 'Contracts/services/IProductService';
import Loader, { CallStatus } from 'Components/Loader/Loader';
import { RouteComponentProps } from 'react-router';
import { AxiosError } from 'axios';

interface IIncomingAddProps extends RouteComponentProps {};
type IIncomingAddState = {
	Products: Array<Product>;
	ApiStatus:CallStatus;
};

export default class IncomingAdd extends React.Component<IIncomingAddProps, IIncomingAddState> {
	_productService: IProductService;
	constructor(props: IIncomingAddProps) {
		super(props);
		this.state = {
			Products: [],ApiStatus:CallStatus.EMPTY
		};
		this._productService = new ProductService();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(shipments: ShipmentDTO[]) {
		this._productService.Add(shipments).then(() => {
			const { history } = this.props;
			history.push({pathname:"/message/pass",search:"?message=Added Successfully"});
		}).catch((error:AxiosError) => {
			const { history } = this.props;
			history.push({pathname:"/message/fail",search:"?message=Some Error Occurred"});
		});
	}

	render() {
		const { Products ,ApiStatus} = this.state;
		return (
			<div className='incmoming-add'>
				<h5 className="app-head">Add Incoming Shipments</h5>
				<Loader Status={ApiStatus}>
					<ShipmentList Products={Products} handleSubmit={this.handleSubmit} ShouldLimitQuantity={false} />
				</Loader>
			</div>
		);
	}

	componentDidMount() {
		this.setState({ApiStatus:CallStatus.LOADING});
		this._productService.GetAll().then(res => {
			debugger;
			if (res.data.length > 0) {
				this.setState({ Products: res.data ?? [],ApiStatus:CallStatus.LOADED });
			}
		}).catch(()=>this.setState({ ApiStatus:CallStatus.ERROR}));
	}
}
