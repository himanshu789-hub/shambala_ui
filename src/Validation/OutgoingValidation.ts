import { IOutgoingShipmentUpdateDetail } from 'Types/DTO';
import { IValidateResultBad, IValidateResultOK, ValidateMember, ValidationCode } from './Validation.d';
import { ValidateResultBad, ValidationResultOK } from './Validation';
import { OutgoingUpdateRow } from 'Containers/Outgoing/OutgoingGrid.d';


export default class OutgoingValidator implements ValidateMember<OutgoingUpdateRow> {
    private readonly outgoing: OutgoingUpdateRow;

    constructor(outgoing: OutgoingUpdateRow) {
        this.outgoing = outgoing;
    }

    IsCaretSizeValid(): IValidateResultOK | IValidateResultBad {
        if (!this.outgoing.CaretSize)
            return { IsValid: false, } as IValidateResultBad;
        return new ValidationResultOK();
    }
    IsCustomPricesValid(): IValidateResultOK {
        if (!this.outgoing.CustomPrices || this.outgoing.CustomPrices.length == 0)
            return { IsValid: false, Message: "Cannot Left Empty" } as IValidateResultBad;
        const IsNotValid = this.outgoing.CustomPrices.find(e => !e.Id.IsValid || !e.Price.IsValid || !e.Quantity.IsValid) != null;
        if (IsNotValid)
            return new ValidateResultBad("Values Are Not Valid", ValidationCode.Memeber);
        return new ValidationResultOK();
    }
    IsFlavourIdValid(): IValidateResultOK | IValidateResultBad {
        if (this.outgoing.FlavourId === -1)
            return { IsValid: false, Message: "Cannot Left Empty", Code: ValidationCode.Memeber } as IValidateResultBad;
        return { IsValid: true };
    }
    IsIdValid(): IValidateResultOK | IValidateResultBad {
        return { IsValid: this.outgoing.Id != undefined && typeof this.outgoing.Id === "number" };
    }
    IsProductIdValid(): IValidateResultOK | IValidateResultBad {
        if (!this.outgoing.ProductId || this.outgoing.ProductId === -1)
            return { IsValid: false, Message: "Cannot Left Empty" };
        return { IsValid: true };
    }
    IsSchemePriceValid(): IValidateResultOK | IValidateResultBad {
        if (!this.outgoing.SchemePrice && this.outgoing.SchemePrice !== 0)
            return { IsValid: false, Message: "Invalid" };
        return { IsValid: true };
    }
    IsTotalQuantityRejectedValid(): IValidateResultOK | IValidateResultBad {

        if (!this.outgoing.TotalQuantityRejected)
            return { IsValid: false, Message: "Invalid" }
        const value = this.outgoing.TotalQuantityRejected;
        if (value >= this.outgoing.TotalQuantitySale) {
            return { IsValid: false, Message: 'Cannot Be Greater or Equal To Sale' }
        }
        return { IsValid: true };
    }
    IsTotalQuantityReturnedValid(): IValidateResultOK | IValidateResultBad {
        const value = this.outgoing.TotalQuantityReturned;
        if (!value)
            return { IsValid: false, Message: "Invalid" }
        if (value > this.outgoing.TotalQuantityShiped) {
            return { IsValid: false, Message: "Cannot Be Greater To Taken" }
        }
        return { IsValid: true };
    }
    IsTotalQuantityShipedValid(): IValidateResultOK | IValidateResultBad {
        const value = this.outgoing.TotalQuantityShiped;
        if (!value)
            return new ValidateResultBad("Cannot Be Empty", ValidationCode.Memeber);
        return { IsValid: true };
    }
    IsTotalQuantitySaleValid(): IValidateResultOK | IValidateResultBad {
        const value = this.outgoing.TotalQuantitySale;
        if (!value)
            return { IsValid: false, Message: "Cannot Be Empty" };
        if (!this.IsTotalQuantityShipedValid().IsValid)
            return { IsValid: false, Message: "Taken Quantity Must Have Value", Code: ValidationCode.Parameter };
        if (!this.outgoing.TotalQuantityReturned)
            return { IsValid: false, Message: "Return Quantity Must Have Value", Code: ValidationCode.Parameter };
        if (this.outgoing.TotalQuantityShiped - this.outgoing.TotalQuantityReturned < value)
            return { IsValid: false, Message: "Cannot Be Greater Than Difference of Taken/Return Quantity", Code: ValidationCode.Memeber };
        return { IsValid: true };
    }
    IsTotalSchemeQuantityValid(): IValidateResultBad | IValidateResultOK {
        const value = this.outgoing.TotalSchemeQuantity;
        if (!value)
            return new ValidateResultBad("Canot Be Empty", ValidationCode.Memeber);
        if (!this.IsCaretSizeValid().IsValid)
            return new ValidateResultBad("Caret Size Not Valid", ValidationCode.Parameter);
        return { IsValid: true };
    }
}