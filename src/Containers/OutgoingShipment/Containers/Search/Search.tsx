import Loader, { CallStatus } from 'Components/Loader/Loader';
import React, { SyntheticEvent } from 'react';
import { OutgoingShipment, SalesmanProperties } from 'Types/Types';
import './Search.css';
import { OutgoingStatus } from 'Enums/Enum';
import { Salesman as SalesmanValues } from 'Mock/Salesman';
import { Salesman } from 'Models/Salesman';
import { Link } from 'react-router-dom';
import IOUtgoingShipmentService from 'Contracts/Services/IOutgoingShipmentService';
import OutgoingService from 'Services/OutgoingShipmentService';
type OutgoingShipmentSearchProps = {};
type Search = {
	SalesmanId: string;
	DateCreated: string;
};
type OutgoingShipmentSearchState = {
	Search: Search;
	Salesmans: SalesmanProperties[];
	OutgoingShipments: OutgoingShipment[];
	APIStatus: CallStatus;
	ShouldValidate: boolean;
	ErrorMessage: { [key: string]: string };
};
export default class OutgoingShipmentSearch extends React.Component<OutgoingShipmentSearchProps, OutgoingShipmentSearchState> {
	OutgoingShipmentService: IOUtgoingShipmentService;
	constructor(props: OutgoingShipmentSearchProps) {
		super(props);
		this.state = {
			APIStatus: CallStatus.EMPTY,
			Salesmans: [],
			ErrorMessage: {},
			ShouldValidate: false,
			OutgoingShipments: [],
			Search: { DateCreated: '', SalesmanId: '-1' },
		};
		this.IsValid = this.IsValid.bind(this);
		this.OutgoingShipmentService = new OutgoingService();
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
		const {
			currentTarget: { name, value },
		} = e;
		this.setState(prevState => {
			return { Search: { ...prevState.Search, [name]: value } };
		});
	}
	IsValid(): boolean {
		const { SalesmanId, DateCreated } = this.state.Search;
		let IsValid = true;
		if (SalesmanId == '-1') {
			this.setState(prevState => {
				return { ErrorMessage: { ...prevState.ErrorMessage, SalesmanId: 'Please Select A Value' } };
			});
			IsValid = false;
		} else
			this.setState(prevState => {
				return { ErrorMessage: { ...prevState.ErrorMessage, SalesmanId: '' } };
			});

		if (!DateCreated.length) {
			this.setState(prevState => {
				return { ErrorMessage: { ...prevState.ErrorMessage, DateCreated: 'Please Select A Date' } };
			});
			IsValid = false;
		} else
			this.setState(prevState => {
				return { ErrorMessage: { ...prevState.ErrorMessage, DateCreated: '' } };
			});

		return IsValid;
	}
	handleClick(e: SyntheticEvent) {
		const {
			Search: { DateCreated, SalesmanId },
		} = this.state;

		if (this.IsValid()) {
			this.setState({ APIStatus: CallStatus.LOADING });
			this.OutgoingShipmentService.GetShipmentByDateAndSalesmanId(Number.parseInt(SalesmanId), DateCreated).then(res =>
				this.setState({ OutgoingShipments: res.data, APIStatus: CallStatus.LOADED }),
			);
		} else {
			this.setState({ ShouldValidate: true });
		}
	}
	render() {
		const {
			Search: { DateCreated: Date, SalesmanId },
			Salesmans,
			APIStatus,
			ShouldValidate,
			OutgoingShipments,
			ErrorMessage,
		} = this.state;
		const LoaderChildren: JSX.Element = (
			<div className='table-wrapper'>
				<table>
					<thead>
						<tr>
							<th>S.No</th>
							<th>Salesman Name</th>
							<th>Date</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{OutgoingShipments &&
							OutgoingShipments.map((value, index) => {
								const IsPending = value.Status === OutgoingStatus.PENDING ? true : false;
								return (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>{new Salesman(value.Salesman).GetFullName()}</td>
										<td>{value.DateCreated}</td>
										<td>
											{IsPending ? (
												<span className='form-group'>
													<Link to={`/outgoing/return/${value.Id}`} className='action bg-warning text-white'>
														Pending
													</Link>
													<small className='form-text text-muted'>Click To Proceed To Return</small>
												</span>
											) : (
												<label className='badge badge-success'>Completed</label>
											)}
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		);
		return (
			<div className='search'>
				<h1>Search Outgoing Shipments</h1>
				<div className='form-inline justify-content-center'>
					<div className='d-flex flex-column'>
						<div className='input-group mr-2'>
							<div className='input-group-prepend'>
								<div className='input-group-text'>Salesman</div>
							</div>
							<select className='form-control' name='SalesmanId' onChange={this.handleChange} value={SalesmanId}>
								<option disabled selected>
									--Select A Salesman--
								</option>
								{Salesmans.map(e => (
									<option value={e.Id}>{new Salesman(e).GetFullName()}</option>
								))}
							</select>
						</div>
						<small className='form-text  text-danger'>{ShouldValidate && ErrorMessage['SalesmanId']}</small>
					</div>
					<div className='d-flex flex-column'>
						<div className='input-group mr-5'>
							<div className='input-group-prepend'>
								<div className='input-group-text'>Date</div>
							</div>
							<input type='date' name='DateCreated' className='form-control' value={Date} onChange={this.handleChange} />
						</div>
						<small className='form-text  text-danger'>{ShouldValidate && ErrorMessage['DateCreated']}</small>
					</div>
					<button type='submit' className='btn btn-success' onClick={this.handleClick}>
						Submit
					</button>
				</div>
				<div className='outgoing-table'>
					<Loader children={LoaderChildren} Status={APIStatus} />
				</div>
			</div>
		);
	}
	componentDidMount() {
		this.setState({ Salesmans: SalesmanValues });
	}
}
