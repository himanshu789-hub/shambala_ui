import { enumerateValidateMemberOnly, ValidateResultBad, ValidationResultOK } from './Validation';
import { OutgoingUpdateRow } from 'Containers/Outgoing/OutgoingGrid.d';
import CustomPriceCollectionValidation,{CustomPriceValidation} from './CustomPriceCollectionValidation';

export default class OutgoingValidator implements ValidateMember<OutgoingUpdateRow> {
    private readonly outgoing: OutgoingUpdateRow;

    constructor(outgoing: OutgoingUpdateRow) {
        this.outgoing = outgoing;
    }
    IsAllValid():IValidateResultBad|IValidateResultOK {
        return enumerateValidateMemberOnly<OutgoingUpdateRow,OutgoingValidator>(this);
    };

    IsCaretSizeValid(): IValidateResultOK | IValidateResultBad {
        if (!this.outgoing.CaretSize)
            return { IsValid: false, } as IValidateResultBad;
        return new ValidationResultOK();
    }
    IsCustomCaratPricesValid(): IValidateResultOK {
        if (!this.outgoing.CustomCaratPrices || this.outgoing.CustomCaratPrices.length == 0)
            return { IsValid: false, Message: "Cannot Left Empty" } as IValidateResultBad;
        const validator = new CustomPriceCollectionValidation(this.outgoing.CustomCaratPrices, this.outgoing.TotalQuantityShiped);
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
        if (!this.outgoing.SchemePrice && this.outgoing.SchemePrice !== 0)
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
        if (!value)
            return { IsValid: false, Message: "Cannot Be Empty" }
        if (value > this.outgoing.TotalQuantityTaken) {
            return { IsValid: false, Message: "Cannot Be Greater To Taken" }
        }
        return { IsValid: true };
    }
    IsTotalQuantityTakenValid(): IValidateResultOK | IValidateResultBad {
        const value = this.outgoing.TotalQuantityTaken;
        if (!value)
            return new ValidateResultBad("Cannot Be Empty");
        return new ValidationResultOK();
    }
    IsTotalQuantityShipedValid(): IValidateResultOK | IValidateResultBad {
        const value = this.outgoing.TotalQuantityShiped;
        if (!value)
            return { IsValid: false, Message: "Cannot Be Empty" };
        if (!this.IsTotalQuantityTakenValid().IsValid)
            return { IsValid: false, Message: "Taken Quantity Must Have Value", Code: "Parameter" };
        if (!this.outgoing.TotalQuantityReturned)
            return { IsValid: false, Message: "Return Quantity Must Have Value", Code: 'Parameter' };
        if (this.outgoing.TotalQuantityTaken - this.outgoing.TotalQuantityReturned < value)
            return { IsValid: false, Message: "Cannot Be Greater Than Difference of Taken/Return Quantity", Code: 'Parameter' };
        return { IsValid: true };
    }
    IsTotalSchemeQuantityValid(): IValidateResultBad | IValidateResultOK {
        const value = this.outgoing.TotalSchemeQuantity;
        if (!value)
            return new ValidateResultBad("Canot Be Empty");
        if (!this.IsCaretSizeValid().IsValid)
            return new ValidateResultBad("Caret Size Not Valid", 'Parameter');
        return { IsValid: true };
    }
}