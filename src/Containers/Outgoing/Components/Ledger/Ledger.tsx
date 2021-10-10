import { AxiosError } from "axios";
import { LedgerErrorCode } from "Enums/Enum";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { LedgerService } from "Services/LedgerService";
import { LedgerDetailDTO, LedgerDTO } from "Types/DTO";
import { addDanger, addWarn } from "Utilities/AlertUtility";
import { addDecimal, getPriceInText, IsValidInteger } from "Utilities/Utilities";
import { useCalc, useCalcReturn } from './useCalcHook';
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

function calcPrice(rawPrice: number, oldCheque: useCalcReturn, newCheque: useCalcReturn, oldCash: number): number {
    return calculateNetPrice(rawPrice, { NewCheque: Number.parseFloat(newCheque.valueProps.value), OldCheque: Number.parseFloat(oldCheque.valueProps.value), OldCash: oldCash, TotalNewCheque: newCheque.countProps.value, TotalOldCheque: newCheque.countProps.value });
}
const handError = (e: AxiosError) => {
    if (e.response?.status === 422) {
        addWarn("Another User Already Changed Resource\nPlease,Refresh");
    }
    else if (e.response?.status === 400 && e.response.data.Code !== undefined) {
        switch (e.response.data.Code) {
            case LedgerErrorCode.INVALID_TotalPrice:
                alert('InValid Net Price.\nPlease, Contact Administration');
                break;
        }
    }
    else
        addDanger('Error Sending Data');
}
export function Ledger(props: LedgerProps) {
    const [showPrice, shouldShow] = useState<boolean>(true);
    const [netPrice, setNetPrice] = useState<number>(0);
    const [oldCash, setOldCash] = useState<number>(props.ledger?.OldCash || 0);
    const oldCheque = useCalc({ count: props.ledger?.TotalOldCheque || 0, value: props.ledger?.OldCheque || 0 });
    const newCheque = useCalc({ count: props.ledger?.TotalNewCheque || 0, value: props.ledger?.NewCheque || 0 });
    const [oldCashError, setOldCashError] = useState<boolean>(false);

    function handleOldCashChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { target: { value } } = e;
        if (/^\d+\.?(\d+)?$/.test(value)) {
            setOldCashError(false);
            setOldCash(() => Number.parseFloat(value));
        }
        if (value.length === 0) {
            setOldCash(() => 0);
        }
    }
    function isAllValid() {
        return !oldCashError && !oldCheque.valueProps.error && !newCheque.valueProps.error;
    }
    function handleSubmit() {
        if (!isAllValid()) {
            return;
        }
        const { rawPrice, rowVersion, shipmentId } = props;
        const ledger: LedgerDetailDTO = {
            NewCheque: Number.parseFloat(newCheque.valueProps.value),
            OldCash: oldCash,
            OldCheque: Number.parseFloat(oldCheque.valueProps.value),
            TotalNewCheque: newCheque.countProps.value,
            TotalOldCheque: oldCheque.countProps.value
        };
        if (ledger.NewCheque === 0 && ledger.OldCash === 0 && ledger.TotalNewCheque === 0 && ledger.TotalOldCheque === 0 && ledger.NewCheque === 0)
            return;
        const data = {
            NewCheque: ledger.NewCheque, OldCash: ledger.OldCash, OldCheque: ledger.OldCheque
            , TotalNewCheque: ledger.TotalNewCheque, TotalOldCheque: ledger.TotalOldCheque,
            OutgoingShipmentId: shipmentId, RowVersion: rowVersion, NetPrice: calculateNetPrice(rawPrice, ledger)
        } as LedgerDTO;

        new LedgerService().Post(data).then(() => {
            props.history.push({ pathname: "/message/pass", search: `?message=Updated SuccessFully&redirect=/outgoing/view/${shipmentId}` });
        }).catch(e => handError(e));
    }
    useEffect(() => {
        if (oldCheque.valueProps.error || newCheque.valueProps.error || oldCashError)
            shouldShow(false);
        else {
            const v = calcPrice(props.rawPrice, oldCheque, newCheque, oldCash);
            setNetPrice(v);
            shouldShow(true);
        }
    }, [oldCheque.countProps.value, newCheque.countProps.value, oldCash, props.ledger,oldCheque.valueProps.error,newCheque.valueProps.error])

    // useEffect(() => {
    //     if (props.ledger) {
    //         setNetPrice(calculateNetPrice(props.rawPrice, props.ledger));
    //     }
    // }, [props.ledger])
    return (<div>
        <div className="form-row">
            <div className="form-group col-md-6">
                <label>Today Credit</label>
                <input name={field('OldCheque')} autoComplete="off" className="form-control-sm" value={oldCheque.valueProps.value} onChange={oldCheque.valueProps.onChange} onKeyDown={oldCheque.valueProps.onKeyDown} />
                <small className="form-text text-danger">{oldCheque.valueProps.error && "Invalid Value"}</small>
            </div>
            <div className="form-group col-md-6">
                <label>No. Of  Bill</label>
                <input name={field('TotalOldCheque')} tabIndex={-1} autoComplete="off" className="form-control-sm" value={oldCheque.countProps.value} onChange={oldCheque.countProps.onChange} />
            </div>
            <div className="form-group col-md-6">
                <label>Today Cheque Amt</label>
                <input name={field('NewCheque')} autoComplete="off" className="form-control-sm" value={newCheque.valueProps.value} onChange={newCheque.valueProps.onChange} onKeyDown={newCheque.valueProps.onKeyDown} />
                <small className="form-text text-danger">{newCheque.valueProps.error && "Invalid Value"}</small>
            </div>
            <div className="form-group col-md-6">
                <label>No. Of Cheque</label>
                <input name={field('TotalNewCheque')} autoComplete="off" tabIndex={-1} className="form-control-sm" value={newCheque.countProps.value} onChange={newCheque.countProps.onChange} />
            </div>
            <div className="form-group col">
                <label>Old Credit Rvd.</label>
                <input name={field('OldCash')} className="form-control-sm" autoComplete="off" value={oldCash} onChange={handleOldCashChange} />
                <small className="form-text text-danger">{oldCashError && "Invalid Value"}</small>
            </div>
            <div className="form-group col-md-6 d-flex flex-column">
                <button className="btn btn-info btn-sm m-2" onClick={handleSubmit}>Post</button>
            </div>
            <div className="form-group col-md-12">
                {
                    showPrice &&
                    <label className="text-underline text-dark font-weight-bold">In Hand(Amount) : {getPriceInText(netPrice)}</label>
                }
            </div>
        </div>

    </div>);
}
// export class Ledger extends React.Component<LedgerProps, LedgerState>
// {
//     private regexp = /^[\+-]?(\d+(\.\d+)?)(([\+-])?(\d+(\.\d+)?))+[\+-]?$/;

//     constructor(props: LedgerProps) {
//         super(props);

//         this.state = {
//             ledger: props.ledger || { NewCheque: 0, OldCheque: 0, OldCash: 0, TotalNewCheque: 0, TotalOldCheque: 0 },
//             netPrice: calculateNetPrice(props.rawPrice, props.ledger), shouldNetPriceShow: props.ledger !== undefined,
//             message: { NewCheque: '', OldCash: '', OldCheque: '', TotalNewCheque: '', TotalOldCheque: '' }
//         }
//     }
//     handleCalculate = () => {
//         if (!this.IsAllValid())
//             return;
//         this.setState({ netPrice: calculateNetPrice(this.props.rawPrice, this.state.ledger), shouldNetPriceShow: true });
//     }
//     IsAllValid = () => {
//         const { ledger } = this.state;
//         let isValid = true;
//         const msg: ErrorMessage<LedgerDetailDTO> = { OldCash: '', NewCheque: '', OldCheque: '', TotalNewCheque: '', TotalOldCheque: '' };
//         // if (!/^\d{1,5}(\.\d{1,2})?$/.test(ledger.NewCheque + '')) {
//         //     msg.NewCheque = "Invalid Value";
//         //     isValid = false;
//         // }

//         if (!/^\d{1,5}(\.\d{1,2})?$/.test(ledger.OldCash + '')) {
//             msg.OldCash = "Invalid Value";
//             isValid = false;
//         }
//         // if (!/^\d{1,5}(\.\d{1,2})?$/.test(ledger.OldCheque + '')) {
//         //     msg.OldCheque = "Invalid Value";
//         //     isValid = false;
//         // }

//         if (!(/^\d+$/.test(ledger.TotalNewCheque + ''))) {
//             msg.TotalNewCheque = "Invalid value";
//             isValid = false;
//         }

//         // else if (msg.NewCheque.length === 0 && this.state.ledger.NewCheque != 0) {
//         //     if (this.state.ledger.TotalNewCheque == 0) {
//         //         msg.TotalNewCheque = 'Cannot be Zero if cheque amount exists';
//         //         isValid = false;
//         //     }
//         //     else if (this.state.ledger.TotalNewCheque > 128) {
//         //         msg.TotalNewCheque = "Cannot Me Greater Than 127";
//         //     }
//         // }

//         if (!/^\d+$/.test(ledger.TotalOldCheque + '')) {
//             msg.TotalOldCheque = "Invalid value";
//             isValid = false;
//         }
//         // if (msg.OldCheque.length === 0 && ledger.OldCheque !== 0) {
//         //     if (ledger.TotalOldCheque === 0) {
//         //         isValid = false;
//         //         msg.TotalOldCheque = 'Cannot be Zero if cheque amount exists';
//         //     }
//         //     else if (this.state.ledger.TotalOldCheque > 127) {
//         //         isValid = false;
//         //         msg.TotalOldCheque = "Cannot be Greater Than 127";
//         //     }
//         // }
//         this.setState({ message: msg });
//         return isValid;
//     }
//     handleSubmit = () => {
//         if (!this.IsAllValid()) {
//             return;
//         }
//         const { rawPrice, rowVersion, shipmentId } = this.props;
//         const { ledger } = this.state;
//         if (ledger.NewCheque === 0 && ledger.OldCash === 0 && ledger.TotalNewCheque === 0 && ledger.TotalOldCheque === 0 && ledger.NewCheque === 0)
//             return;
//         const data = {
//             NewCheque: Number.parseFloat(ledger.NewCheque + ''), OldCash: Number.parseFloat(ledger.OldCash + ''), OldCheque: Number.parseFloat(ledger.OldCheque + '')
//             , TotalNewCheque: Number.parseInt(ledger.TotalNewCheque + ''), TotalOldCheque: Number.parseInt(ledger.TotalOldCheque + ''),
//             OutgoingShipmentId: shipmentId, RowVersion: rowVersion, NetPrice: calculateNetPrice(this.props.rawPrice, ledger)
//         } as LedgerDTO;

//         new LedgerService().Post(data).then(() => {
//             this.props.history.push({ pathname: "/message/pass", search: `?message=Updated SuccessFully&redirect=/outgoing/view/${this.props.shipmentId}` });
//         }).catch(e => this.handError(e));
//     }
//     handError = (e: AxiosError) => {
//         if (e.response?.status === 422) {
//             addWarn("Another User Already Changed Resource\nPlease,Refresh");
//         }
//         else if (e.response?.status === 400 && e.response.data.Code !== undefined) {
//             switch (e.response.data.Code) {
//                 case LedgerErrorCode.INVALID_TotalPrice:
//                     alert('InValid Net Price.\nPlease, Contact Administration');
//                     break;
//             }
//         }
//         else
//             addDanger('Error Sending Data');
//     }
//     handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         this.setState((prState) => ({ ledger: { ...prState.ledger, [e.target.name]: e.target.value }, shouldNetPriceShow: false }));
//     }
//     componentWillReceiveProps(nextProps: LedgerProps) {
//         if (nextProps.ledger !== this.props.ledger) {
//             this.setState({
//                 ledger: nextProps.ledger || { NewCheque: 0, OldCheque: 0, OldCash: 0, TotalNewCheque: 0, TotalOldCheque: 0 },
//                 netPrice: calculateNetPrice(nextProps.rawPrice, nextProps.ledger), shouldNetPriceShow: nextProps.ledger !== undefined,
//                 message: { NewCheque: '', OldCash: '', OldCheque: '', TotalNewCheque: '', TotalOldCheque: '' }
//             });
//         }
//     }
//     render() {
//         const { message } = this.state;
//         return (<div>
//             <div className="form-row">
//                 <div className="form-group col-md-6">
//                     <label>Today Credit</label>
//                     <input name={field('OldCheque')} className="form-control-sm" value={this.state.ledger.OldCheque} onChange={this.handleChange} />
//                     <small className="form-text text-danger">{message.OldCheque}</small>
//                 </div>
//                 <div className="form-group col-md-6">
//                     <label>No. Of  Bill</label>
//                     <input name={field('TotalOldCheque')} className="form-control-sm" value={this.state.ledger.TotalOldCheque} onChange={this.handleChange} />
//                     <small className="form-text text-danger">{message.TotalOldCheque}</small>

//                 </div>
//                 <div className="form-group col-md-6">
//                     <label>Today Cheque Amt</label>
//                     <input name={field('NewCheque')} className="form-control-sm" value={this.state.ledger.NewCheque} onChange={this.handleChange} />
//                     <small className="form-text text-danger">{message.NewCheque}</small>

//                 </div>
//                 <div className="form-group col-md-6">
//                     <label>No. Of Cheque</label>
//                     <input name={field('TotalNewCheque')} className="form-control-sm" value={this.state.ledger.TotalNewCheque} onChange={this.handleChange} />
//                     <small className="form-text text-danger">{message.TotalNewCheque}</small>
//                 </div>
//                 <div className="form-group col">
//                     <label>Old Credit Rvd.</label>
//                     <input name={field('OldCash')} className="form-control-sm" value={this.state.ledger.OldCash} onChange={this.handleChange} />
//                     <small className="form-text text-danger">{message.OldCash}</small>
//                 </div>
//                 <div className="form-group col-md-6 d-flex flex-column">
//                     <button className="btn btn-warning btn-sm" onClick={this.handleCalculate}>Calculate</button>
//                     <button className="btn btn-info btn-sm m-2" onClick={this.handleSubmit}>Post</button>
//                 </div>
//                 <div className="form-group col-md-12">
//                     {
//                         this.state.shouldNetPriceShow &&
//                         <label className="text-underline text-dark font-weight-bold">In Hand(Amount) : {getPriceInText(this.state.netPrice)}</label>
//                     }
//                 </div>
//             </div>

//         </div>);
//     }
// }