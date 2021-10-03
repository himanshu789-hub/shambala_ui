import { AxiosError } from "axios";
import { LedgerErrorCode } from "Enums/Enum";
import React from "react";
import { RouteComponentProps } from "react-router";
import { LedgerService } from "Services/LedgerService";
import { LedgerDetailDTO, LedgerDTO } from "Types/DTO";
import { addDanger, addWarn } from "Utilities/AlertUtility";
import { addDecimal, getPriceInText, IsValidInteger } from "Utilities/Utilities";

interface LedgerProps extends RouteComponentProps {
    ledger: LedgerDetailDTO | null;
    shipmentId: number;
    rowVersion: number;
    rawPrice: number;
}
type ErrorMessage<T> = {
    [Property in keyof T]: string
}
type LedgerState = {
    ledger: LedgerDetailDTO;
    netPrice: number;
    shouldNetPriceShow: boolean;
    message: ErrorMessage<LedgerDetailDTO>
}
function field(name: keyof LedgerDTO) {
    return name;
}
function calculateNetPrice(rawPrice: number, ledger: LedgerDetailDTO | null) {
    if (!ledger)
        return rawPrice;
    let result = rawPrice;
    result = addDecimal(result, ledger.OldCash);
    result = addDecimal(result, -ledger.NewCheque);
    result = addDecimal(result, -ledger.OldCheque);
    return result;
}
export class Ledger extends React.Component<LedgerProps, LedgerState>
{
    constructor(props: LedgerProps) {
        super(props);

        this.state = {
            ledger: props.ledger || { NewCheque: 0, OldCheque: 0, OldCash: 0, TotalNewCheque: 0, TotalOldCheque: 0 },
            netPrice: calculateNetPrice(props.rawPrice, props.ledger), shouldNetPriceShow: props.ledger !== undefined,
            message: { NewCheque: '', OldCash: '', OldCheque: '', TotalNewCheque: '', TotalOldCheque: '' }
        }
    }
    handleCalculate = () => {
        if (!this.IsAllValid())
            return;
        this.setState({ netPrice: calculateNetPrice(this.props.rawPrice, this.state.ledger), shouldNetPriceShow: true });
    }
    IsAllValid = () => {
        const { ledger } = this.state;
        let isValid = true;
        const msg: ErrorMessage<LedgerDetailDTO> = { OldCash: '', NewCheque: '', OldCheque: '', TotalNewCheque: '', TotalOldCheque: '' };
        if (!/^\d{1,5}(\.\d{1,2})?$/.test(ledger.NewCheque + '')) {
            msg.NewCheque = "Invalid Value";
            isValid = false;
        } if (!/^\d{1,5}(\.\d{1,2})?$/.test(ledger.OldCash + '')) {
            msg.OldCash = "Invalid Value";
            isValid = false;
        }
        if (!/^\d{1,5}(\.\d{1,2})?$/.test(ledger.OldCheque + '')) {
            msg.OldCheque = "Invalid Value";
            isValid = false;
        }

        if (!(/^\d+$/.test(ledger.TotalNewCheque + ''))) {
            msg.TotalNewCheque = "Invalid value";
            isValid = false;
        }
        else if (msg.NewCheque.length === 0 && this.state.ledger.NewCheque !== 0 && this.state.ledger.TotalNewCheque === 0) {
            isValid = false;
            msg.TotalNewCheque = 'Cannot be Zero if cheque amount exists';
        }

        if (!/^\d+$/.test(ledger.TotalOldCheque + '')) {
            msg.TotalOldCheque = "Invalid value";
            isValid = false;
        }
        if (msg.OldCheque.length === 0 && ledger.OldCheque !== 0 && ledger.TotalOldCheque === 0) {
            isValid = false;
            msg.TotalOldCheque = 'Cannot be Zero if cheque amount exists';
        }
        this.setState({ message: msg });
        return isValid;
    }
    handleSubmit = () => {
        if (!this.IsAllValid()) {
            return;
        }
        const { rawPrice, rowVersion, shipmentId } = this.props;
        const { ledger } = this.state;
        if (ledger.NewCheque === 0 && ledger.OldCash === 0 && ledger.TotalNewCheque === 0 && ledger.TotalOldCheque === 0 && ledger.NewCheque === 0)
            return;
        const data = {
            NewCheque: Number.parseFloat(ledger.NewCheque + ''), OldCash: Number.parseFloat(ledger.OldCash + ''), OldCheque: Number.parseFloat(ledger.OldCheque + '')
            , TotalNewCheque: Number.parseInt(ledger.TotalNewCheque + ''), TotalOldCheque: Number.parseInt(ledger.TotalOldCheque + ''),
            OutgoingShipmentId: shipmentId, RowVersion: rowVersion, NetPrice:calculateNetPrice(this.props.rawPrice,ledger)
        } as LedgerDTO;

        new LedgerService().Post(data).then(() => {
            this.props.history.push({ pathname: "/", search: `?redirect=/outgoing/view/${this.props.shipmentId}` });
        }).catch(e => this.handError(e));
    }
    handError = (e: AxiosError) => {
        if (e.response?.status === 422) {
            addWarn("Another User Already Changed Resource\nPlease,Refresh");
        }
        else if (e.response?.status === 400 && e.response.data.Code!=undefined) {
            switch (e.response.data.Code) {
                case LedgerErrorCode.INVALID_TotalPrice:
                    alert('InValid Net Price.\nPlease, Contact Administration');
                    break;
            }
        }
        else
            addDanger('Error Sending Data');
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prState) => ({ ledger: { ...prState.ledger, [e.target.name]: e.target.value }, shouldNetPriceShow: false }));
    }
    componentWillReceiveProps(nextProps: LedgerProps) {
        if (nextProps.ledger !== this.props.ledger) {
            this.setState({
                ledger: nextProps.ledger || { NewCheque: 0, OldCheque: 0, OldCash: 0, TotalNewCheque: 0, TotalOldCheque: 0 },
                netPrice: calculateNetPrice(nextProps.rawPrice, nextProps.ledger), shouldNetPriceShow: nextProps.ledger !== undefined,
                message: { NewCheque: '', OldCash: '', OldCheque: '', TotalNewCheque: '', TotalOldCheque: '' }
            });
        }
    }
    render() {
        const { message } = this.state;
        return (<div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Today Credit</label>
                    <input name={field('OldCheque')} className="form-control-sm" value={this.state.ledger.OldCheque} onChange={this.handleChange} />
                    <small className="form-text text-danger">{message.OldCheque}</small>
                </div>
                <div className="form-group col-md-6">
                    <label>No. Of  Bill</label>
                    <input name={field('TotalOldCheque')} className="form-control-sm" value={this.state.ledger.TotalOldCheque} onChange={this.handleChange} />
                    <small className="form-text text-danger">{message.TotalOldCheque}</small>

                </div>
                <div className="form-group col-md-6">
                    <label>Today Cheque Amt</label>
                    <input name={field('NewCheque')} className="form-control-sm" value={this.state.ledger.NewCheque} onChange={this.handleChange} />
                    <small className="form-text text-danger">{message.NewCheque}</small>

                </div>
                <div className="form-group col-md-6">
                    <label>No. Of Cheque</label>
                    <input name={field('TotalNewCheque')} className="form-control-sm" value={this.state.ledger.TotalNewCheque} onChange={this.handleChange} />
                    <small className="form-text text-danger">{message.TotalNewCheque}</small>
                </div>
                <div className="form-group col">
                    <label>Old Credit Rvd.</label>
                    <input name={field('OldCash')} className="form-control-sm" value={this.state.ledger.OldCash} onChange={this.handleChange} />
                    <small className="form-text text-danger">{message.OldCash}</small>
                </div>
                <div className="form-group col-md-6 d-flex flex-column">
                    <button className="btn btn-warning btn-sm" onClick={this.handleCalculate}>Calculate</button>
                    <button className="btn btn-info btn-sm m-2" onClick={this.handleSubmit}>Post</button>
                </div>
                <div className="form-group col-md-6">
                    {
                        this.state.shouldNetPriceShow &&
                        <label className="text-underline text-dark font-weight-bold">Net Price : {getPriceInText(this.state.netPrice)}</label>
                    }
                </div>
            </div>

        </div>);
    }
}