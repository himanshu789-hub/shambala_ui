import Loader, { CallStatus, ApiStatusInfo } from 'Components/Loader/Loader';
import React, { SyntheticEvent } from 'react';
import { OutgoingShipment, SalesmanProperties } from 'Types/Types';
import './Search.css';
import IOUtgoingShipmentService from 'Contracts/services/IOutgoingShipmentService';
import OutgoingService from 'Services/OutgoingShipmentService';
import ISalesmanService from 'Contracts/services/ISalesmanService';
import { SalesmanService } from 'Services/SalesmanService';
import { SalesmanDTO } from 'Types/DTO';
import SalesmanList from 'Components/SalesmanList/SalesmanList';
import TableWrapper from './Components/TableWrapper/TableWrapper';
type OutgoingShipmentSearchProps = {};
type Search = {
	SalesmanId: string;
	DateCreated: string;
};
type OutgoingShipmentSearchState = {
	Search: Search;
	Salesmans: SalesmanDTO[];
	OutgoingShipments: OutgoingShipment[];
	ShouldValidate: boolean;
	ErrorMessage: { [key: string]: string };
	SalemansRequestInfo: ApiStatusInfo;
	OutgoingShipmentRequestInfo: ApiStatusInfo;
};
export default class OutgoingShipmentSearch extends React.Component<OutgoingShipmentSearchProps, OutgoingShipmentSearchState> {
	OutgoingShipmentService: IOUtgoingShipmentService;
	SalesmanService: ISalesmanService;
	constructor(props: OutgoingShipmentSearchProps) {
		super(props);
		this.state = {
			OutgoingShipmentRequestInfo: { Status: CallStatus.EMPTY }, SalemansRequestInfo: { Status: CallStatus.EMPTY },
			Salesmans: [],
			ErrorMessage: {},
			ShouldValidate: false,
			OutgoingShipments: [],
			Search: { DateCreated: '', SalesmanId: '-1' },
		};
		this.SalesmanService = new SalesmanService();
		this.IsValid = this.IsValid.bind(this);
		this.OutgoingShipmentService = new OutgoingService();
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	handleSelection = (Id: number) => {
		this.setState(({ Search }) => { return { Search: { ...Search, SalesmanId: Id + '' } } });
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
				return { ErrorMessage: { ...prevState.ErrorMessage, SalesmanId: 'Please Select A Salesman' } };
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
			this.setState({ OutgoingShipmentRequestInfo: { Status: CallStatus.LOADING, Message: 'Gathering Shipments Info' } });
			this.OutgoingShipmentService.GetShipmentByDateAndSalesmanId(Number.parseInt(SalesmanId), DateCreated).then(res =>
				this.setState({ OutgoingShipments: res.data, OutgoingShipmentRequestInfo: { Status: CallStatus.LOADED } }),
			).catch(() => this.setState({ OutgoingShipmentRequestInfo: { Status: CallStatus.ERROR, Message: "Error Gathering Shipments Info" } }));
		} else {
			this.setState({ ShouldValidate: true });
		}
	}
	render() {
		const {
			Search: { DateCreated: Date, SalesmanId },
			Salesmans,
			ShouldValidate,
			OutgoingShipments,
			ErrorMessage, OutgoingShipmentRequestInfo, SalemansRequestInfo
		} = this.state;

		
		return (
			<div className='search'>
				<h5 className="app-head">Search Outgoing Shipments</h5>
				<div className='form-inline justify-content-center'>
					<div className='d-flex flex-column'>
						<Loader Status={SalemansRequestInfo.Status} Message={SalemansRequestInfo.Message} Size={50} >
							<React.Fragment>
								<SalesmanList Salesmans={Salesmans} handleSelection={this.handleSelection} />
								<small className='form-text  text-danger'>{ShouldValidate && ErrorMessage['SalesmanId']}</small>
							</React.Fragment>
						</Loader>
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
					<Loader children={<TableWrapper OutgoingShipments={OutgoingShipments}/>} 
					Status={OutgoingShipmentRequestInfo.Status} 
					Message={OutgoingShipmentRequestInfo.Message} />
				</div>
			</div>
		);
	}
	componentDidMount() {
		this.setState({ SalemansRequestInfo:{Status:CallStatus.LOADING,Message:'Gathering All Salesman'} });
		this.SalesmanService.GetAll()
			.then(response => this.setState({ SalemansRequestInfo:{Status:CallStatus.LOADED,Message:''}, Salesmans: response.data }))
			.catch(() => this.setState({ SalemansRequestInfo:{Message:'Error Gathering Salesman',Status:CallStatus.ERROR}}));
	}
}
