import React, { Fragment, KeyboardEvent, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ShopInvoice, Product, SoldItem, IOutgoingShipmentLedgerWithOldDebit, IShopBaseDTO, LedgerStatus, OutgoingShipment, IOutgoingShipmentLedger, CreditLeftOver } from 'Types/DTO';
import Loader, { ApiStatusInfo, CallStatus } from 'Components/Loader/Loader';
import IOutgoingShipmentService from 'Contracts/services/IOutgoingShipmentService';
import OutgoingService from 'Services/OutgoingShipmentService';
import { Heading, Spinner } from 'Components/Miscellaneous/Miscellaneous';
import GridView from 'Components/GridView/GridView';
import { useState } from 'react';
import ShopSelector from 'Components/ShopSelector/ShopSelector';
import { IsValidInteger, tocurrencyText } from 'Utilities/Utilities';
import { addDanger } from 'Utilities/AlertUtility';
import CreditService from 'Services/CreditService';
import { OutgoingStatus } from 'Enums/Enum';

interface IInvoiceAddWrapperProps extends RouteComponentProps<{ id: string }> {
}

function FloatingInput(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 190))
			e.preventDefault();
		if (e.keyCode == 190)
			e.currentTarget.value.includes(".") && e.preventDefault();

		props.onKeyDown && props.onKeyDown(e);
	}
	const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (e.currentTarget.value.charAt(e.currentTarget.value.length - 1) == '.')
			e.currentTarget.value = e.currentTarget.value + '00'

		props.onBlur && props.onBlur(e);
	}
	return <input {...props} onKeyDown={handleKeyDown} onBlur={onBlur} />
}
type InvoiceAddWrapperState = {
	ShopSubscribers: ShopSubscriber[];
	ApiStatus: ApiStatusInfo;
	OutgoingShipmentId?: number;
	LedgerStatus?: LedgerStatus;
	OutgoingShipment?: OutgoingShipment;
	ShowSpinner: boolean;
	CreditLeftOvers: CreditLeftOver[];
};
type ShopLedger = {
	Shop: IShopBaseDTO;
	Credit: number;
	Debit: number;
	OldDebit: number;
}
type ShopSubscriber = {
	Id: number;
	ShopLedger: ShopLedger;
	IsShopUnique?: boolean;
	CreditOverDue?: CreditLeftOver;
};
type FloatingPointWrapperProps = {
	Id: number;
	Name: string;
	Value: any;
	handleChange(SubscriptionId: number, name: string, value: any): void;
}


function FloatingPointWrapper(props: FloatingPointWrapperProps) {
	const { handleChange, Id, Name, Value } = props;
	const [fraction, setFraction] = useState<string>(Value + '');
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setFraction(e.currentTarget.value);
		handleChange(Id, Name, e.currentTarget.value);
	}
	return <FloatingInput {...props} name={Name} onChange={(e) => setFraction(e.currentTarget.value)} value={fraction} onBlur={handleBlur} />
}
function CalculateTotalAmountInHand(ledgers: IOutgoingShipmentLedger[]) {
	let total: number = 0;
	for (var i = 0; i < ledgers.length; i++) {
		total += ledgers[i].Credit;
	}
	return total;
}
const ShowLegerStatus = (props: { LedgerStatus?: LedgerStatus, AmountInHand: number }) => {
	const { LedgerStatus } = props;
	if (!LedgerStatus)
		return <React.Fragment></React.Fragment>;

	if (!LedgerStatus.Result)
		return <div className="alert alter-danger">Total Shipment Cost Mismatch : {tocurrencyText(LedgerStatus.TotalShipmentPrice - LedgerStatus.YourTotal)}</div>
	return <div className="alert alert-success">Amount In Hand : {tocurrencyText(props.AmountInHand)}</div>;
}

function toLedgersWithoutOldDebit(shopSubscribers: ShopSubscriber[]) {
	return shopSubscribers.map((e): IOutgoingShipmentLedger => { return { Credit: e.ShopLedger.Credit, Debit: e.ShopLedger.Debit, ShopId: e.ShopLedger.Shop.Id } });
}
function toLedgersWithOldDebit(shopSubscribers: ShopSubscriber[]) {
	return shopSubscribers.map((e): IOutgoingShipmentLedgerWithOldDebit => { return { Credit: e.ShopLedger.Credit, Debit: e.ShopLedger.Debit, ShopId: e.ShopLedger.Shop.Id, OldDebit: e.ShopLedger.OldDebit } });
}

export default class InvoiceAddWrapper extends React.Component<IInvoiceAddWrapperProps, InvoiceAddWrapperState> {

	_outgoingService: IOutgoingShipmentService;
	constructor(props: IInvoiceAddWrapperProps) {
		super(props);
		this.state = {
			ShopSubscribers: [], CreditLeftOvers: [],
			ApiStatus: { Status: CallStatus.EMPTY, Message: '' }, ShowSpinner: false
		};
		this._outgoingService = new OutgoingService();
	}
	AddASubscriber = () => {
		const NewSubscriptionId = Math.random();
		this.setState(({ ShopSubscribers }) => { return { ShopSubscribers: [...ShopSubscribers, { Id: NewSubscriptionId, ShopLedger: { Credit: 0, Debit: 0, Shop: { Address: '', Id: -1, Title: '' }, OldDebit: 0 } }] } })
	};

	HandleDelete = (Id: number) => {
		this.setState(({ ShopSubscribers: ShopSubscriber }) => {
			return { ShopSubscribers: ShopSubscriber.filter(e => e.Id != Id) };
		});
	};
	HandeShopLedger = (SubscriptionId: number, name: string, value: any) => {
		let { ShopSubscribers } = this.state;
		this.setState({
			ShopSubscribers: ShopSubscribers.map(e => {
				if (e.Id == SubscriptionId)
					return { ...e, [name]: value };
				return e;
			})
		})
	};
	HandleShopSelection = (Id: number, shop: IShopBaseDTO) => {
		const { ShopSubscribers } = this.state;
		const IsShopUnique = ShopSubscribers.find(e => e.Id != Id && e.ShopLedger.Shop.Id == shop.Id) == null;

		this.setState(({ ShopSubscribers }) => {
			return {
				ShopSubscribers: ShopSubscribers.map((e) => e.Id == Id ? { ...e, Shop: shop, IsShopUnique } : e)
			}
		});
	}
	CheckShipmentAmountAsync = (): Promise<LedgerStatus> => this._outgoingService.CheckShipmentAmount(toLedgersWithoutOldDebit(this.state.ShopSubscribers)).then(res => { this.setState({ LedgerStatus: res.data }); return res.data });

	CheckOldDebtClearedAsync = (): Promise<CreditLeftOver[]> =>
		new CreditService().GetCreditLeftByShopIds(this.state.ShopSubscribers.map((e):CreditLeftOver => {return {Credit:e.ShopLedger.OldDebit,ShopId:e.ShopLedger.Shop.Id}}))
			.then(res => {
				const { ShopSubscribers } = this.state;

				this.setState({
					ShopSubscribers: ShopSubscribers.map(e => {
						const shopCredit = res.data.find(e => e.ShopId == e.ShopId);
						if (shopCredit)
							return { ...e, CreditOverDue: shopCredit };
						return { ...e, CreditOverDue: undefined }
					})
				});
				return res.data;
			});

	CompleteAsync = () => {
		const { OutgoingShipmentId } = this.state;
		if (OutgoingShipmentId)
			this._outgoingService.Complete(OutgoingShipmentId, toLedgersWithOldDebit(this.state.ShopSubscribers))
	}
	PostShipmentAsync = () => {
		return this.CheckOldDebtClearedAsync().then(res => {
			if (res.length == 0)
				return this.CompleteAsync();
		})
	}
	HandleSubmit = () => {
		const { ShopSubscribers, LedgerStatus } = this.state;
		if (ShopSubscribers.length > 0) {
			const IsCheckShipmentCompleted = LedgerStatus?.Result ?? false;
			if (!IsCheckShipmentCompleted)
				this.CheckShipmentAmountAsync().then(res => {
					if (res.Result)
						return this.PostShipmentAsync();
				})
					.catch(() => this.setState({ ApiStatus: { Status: CallStatus.ERROR, Message: undefined } }));
			else
				this.PostShipmentAsync()
					.catch(() => this.setState({ ApiStatus: { Status: CallStatus.ERROR, Message: undefined } }));
		}
		else
			addDanger('Please Add Some Ledger');
	};

	render() {
		const { ShowSpinner, ApiStatus: { Status, Message }, ShopSubscribers, LedgerStatus, OutgoingShipmentId, OutgoingShipment } = this.state;
		const header = <tr>
			<th>S.No.</th>
			<th>Shop Name</th>
			<th>Debit</th>
			<th>Credit</th>
			<th>Old Due</th>
			<th>Action</th>
		</tr>;
		const length = ShopSubscribers.length;
		let DisplayComponent = <Fragment></Fragment>;

		if (!OutgoingShipmentId)
			DisplayComponent = <div className="alert alert-danger">Shopment Id Is Not Valid</div>;
		else {
			if (OutgoingShipment?.Status == OutgoingStatus.COMPLETED)
				DisplayComponent = <div className="alert alert-warning">Shipment Has Been Processed</div>;
			else
				DisplayComponent = <Loader Status={Status} Message={Message} Overlay={true}>
					<GridView<ShopSubscriber> HeaderDisplay={header} >
						{this.state.ShopSubscribers.map((e, index) => {
							return (<tr>
								<td>{index + 1}</td>
								<td><ShopSelector handleSelection={this.HandleShopSelection.bind(this, e.Id)} /></td>
								<td><FloatingPointWrapper Id={e.Id} Name="Credit" Value={e.ShopLedger.Credit} handleChange={this.HandeShopLedger} /></td>
								<td><FloatingPointWrapper Id={e.Id} Name="Debit" Value={e.ShopLedger.Debit} handleChange={this.HandeShopLedger} /></td>
								<td>
									<span>
										<FloatingPointWrapper Id={e.Id} Name="OldDebit" Value={e.ShopLedger.OldDebit} handleChange={this.HandeShopLedger} />
										{e.CreditOverDue && <span className="text-danger">Credit limit is ${e.CreditOverDue.Credit}</span>}
									</span>
								</td>
								<td>{length - 1 != index ? <button onClick={this.AddASubscriber}><i className="fa fa-minus fa-2x"></i></button> : <button onClick={() => this.HandleDelete(e.Id)} className="fa fa-plus fa-2x"></button>}</td>
							</tr>);
						})}
					</GridView>
					<ShowLegerStatus LedgerStatus={this.state.LedgerStatus} AmountInHand={LedgerStatus?.Result ? CalculateTotalAmountInHand(toLedgersWithoutOldDebit(ShopSubscribers)) : 0} />
					{!LedgerStatus?.Result && <button disabled={ShowSpinner} onClick={this.HandleSubmit}>Submit <Spinner show={ShowSpinner} /></button>}
				</Loader>;
		}

		return (<div className='invoices'>
			<Heading label="Fill Credit Detail" />
			{DisplayComponent}
		</div>);
	}
	componentDidMount() {
		const { params: { id } } = this.props.match;
		if (id && IsValidInteger(id)) {
			this.setState({ ApiStatus: { Status: CallStatus.LOADING, Message: "Gathering Shipment Info" }, OutgoingShipmentId: Number.parseInt(id) });
			this._outgoingService.GetById(Number.parseInt(id))
				.then(res => res.data && this.setState({
					OutgoingShipmentId: Number.parseInt(id),
					OutgoingShipment: res.data, ApiStatus: { Status: CallStatus.LOADED }
				}))
				.catch(() => this.setState({ ApiStatus: { Status: CallStatus.ERROR, Message: undefined } }));
		}
	}
}
