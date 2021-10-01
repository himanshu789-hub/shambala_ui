import { enumerateValidateMemberOnly, ValidateResultBad, ValidationResultOK } from './Validation';
import { OutgoingGridCol,OutgoingUpdateRow } from 'Containers/Outgoing/Add_Update/OutgoingGrid.d';
import CustomPriceCollectionValidation, { CustomPriceValidation } from './CustomPriceCollectionValidation';

export default class OutgoingValidator implements ValidateMemberWithAll<OutgoingGridCol> {
    private readonly outgoing: OutgoingUpdateRow;

    constructor(outgoing: OutgoingUpdateRow) {
        this.outgoing = outgoing;
    }
    
    IsTotalShipedPriceValid() {
        if (!this.outgoing.TotalShipedPrice)
            return new ValidateResultBad("Sale Price Cannot Be Empty");
        return new ValidationResultOK();
    }
    IsNetPriceValid() {
        if (!this.outgoing.NetPrice)
            return new ValidateResultBad('Cannot Be Empty');
        return new ValidationResultOK();
    }
    IsUnitPriceValid() {
        if (!this.outgoing.UnitPrice) {
            return new ValidateResultBad('Cannot Be Empty');
        }
        return new ValidationResultOK();
    }
    IsSchemeQuantityValid() {
        const schemeQuantity = this.outgoing.SchemeInfo.SchemeQuantity;
        if (Number.isInteger(schemeQuantity))
            return new ValidationResultOK();
        return new ValidateResultBad("Cannot Be Non-Integer");
    }
    IsAllValid(): IValidateResultBad | IValidateResultOK {
        return enumerateValidateMemberOnly<OutgoingUpdateRow, OutgoingValidator, OutgoingGridCol>(this);
    }
    IsTotalSchemePriceValid() {
        const quantity = this.outgoing.SchemeInfo.TotalQuantity;
        if (Number.isInteger(quantity))
            return new ValidationResultOK();
        return new ValidateResultBad("Cannot be non-integer");
    }
    IsCaretSizeValid(): IValidateResultOK | IValidateResultBad {
        if (!this.outgoing.CaretSize)
            return { IsValid: false, } as IValidateResultBad;
        return new ValidationResultOK();
    }
    IsCustomCaratPricesValid(): IValidateResultOK {
        if (!this.outgoing.CustomCaratPrices)
            return { IsValid: false, Message: "Cannot Left Empty" } as IValidateResultBad;
        const validator = new CustomPriceCollectionValidation(this.outgoing.CustomCaratPrices.Prices, this.outgoing.TotalQuantityShiped);
        const result = validator.IsAllValid();
        if (!result.IsValid)
            return result;
        return new ValidationResultOK();
    }
    IsFlavourIdValid(): IValidateResultOK | IValidateResultBad {
        if (this.outgoing.FlavourId === -1)
            return { IsValid: false, Message: "Cannot Left Empty" } as IValidateResultBad;
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
        if (!this.outgoing.SchemeInfo.TotalSchemePrice && this.outgoing.SchemeInfo.TotalSchemePrice !== 0)
            return { IsValid: false, Message: "Invalid" };
        return { IsValid: true };
    }
    IsTotalQuantityRejectedValid(): IValidateResultOK | IValidateResultBad {

        if (!this.outgoing.TotalQuantityRejected)
            return { IsValid: false, Message: "Invalid" }
        const value = this.outgoing.TotalQuantityRejected;
        if (value >= this.outgoing.TotalQuantityShiped) {
            return { IsValid: false, Message: 'Cannot Be Greater or Equal To Sale' }
        }
        return { IsValid: true };
    }
    IsTotalQuantityReturnedValid(): IValidateResultOK | IValidateResultBad {
        const value = this.outgoing.TotalQuantityReturned;
        if (!value && value !== 0)
            return { IsValid: false, Message: "Cannot Be Empty" }
        if (value > this.outgoing.TotalQuantityTaken) {
            return { IsValid: false, Message: "Cannot Be Greater To Taken" }
        }
        return new ValidationResultOK();
    }
    IsTotalQuantityTakenValid(): IValidateResultOK | IValidateResultBad {
        const value = this.outgoing.TotalQuantityTaken;
        if (!value)
            return new ValidateResultBad("Cannot Be Empty");
        return new ValidationResultOK();
    }
    IsTotalQuantityShipedValid(): IValidateResultOK | IValidateResultBad {
        const value = this.outgoing.TotalQuantityShiped;
        if (!value && value !== 0)
            return { IsValid: false, Message: "Cannot Be Empty" };
        if (!this.IsTotalQuantityTakenValid().IsValid)
            return { IsValid: false, Message: "Taken Quantity Must Have Value", Code: "Parameter" };
        if (!this.outgoing.TotalQuantityReturned && this.outgoing.TotalQuantityReturned !== 0)
            return { IsValid: false, Message: "Return Quantity Must Have Value", Code: 'Parameter' };
        if (this.outgoing.TotalQuantityTaken - this.outgoing.TotalQuantityReturned < value)
            return { IsValid: false, Message: "Cannot Be Greater Than Difference of Taken/Return Quantity" };
        const result = this.IsTotalShipedPriceValid();
        if (!result.IsValid)
            return result;
        return { IsValid: true };
    }
    IsTotalSchemeQuantityValid(): IValidateResultBad | IValidateResultOK {
        const value = this.outgoing.SchemeInfo.TotalQuantity;
        if (!value)
            return new ValidateResultBad("Canot Be Empty");
        if (!this.IsCaretSizeValid().IsValid)
            return new ValidateResultBad("Caret Size Not Valid", 'Parameter');
        return { IsValid: true };
    }
}