import { IOutgoingShipmentUpdateDetail } from 'Types/DTO';
import { ValidateMember, ValidateResult } from './Validation';



export default class OutgoingValidator implements ValidateMember<IOutgoingShipmentUpdateDetail> {
    private readonly outgoing: IOutgoingShipmentUpdateDetail;

    constructor(outgoing: IOutgoingShipmentUpdateDetail) {
        this.outgoing = outgoing;
    }

    IsCaretSizeValid(): ValidateResult {
        if (!this.outgoing.CaretSize)
            return { IsValid: false, Message: 'Cannot Be Empty' };
        return { IsValid: true };
    }
    IsCustomPricesValid(): ValidateResult {
        if (!this.outgoing.CustomPrices || this.outgoing.CustomPrices.length == 0)
            return { IsValid: false, Message: "Cannot Be Empty" }
        return { IsValid: true };
    }
    IsFlavourIdValid(): ValidateResult {
        if (this.outgoing.FlavourId === -1)
            return { IsValid: false, Message: "Cannot Left Empty" };

        return { IsValid: true };
    }
    IsIdValid(): ValidateResult {
        return { IsValid: this.outgoing.Id != undefined && typeof this.outgoing.Id === "number" }
    }
    IsProductIdValid(): ValidateResult {
        if (!this.outgoing.ProductId || this.outgoing.ProductId === -1)
            return { IsValid: false, Message: "Cannot Left Empty" };
        return { IsValid: true };
    }
    IsSchemePriceValid(): ValidateResult {
        if (!this.outgoing.SchemePrice && this.outgoing.SchemePrice !== 0)
            return { IsValid: false, Message: "Invalid" };
        return { IsValid: true };
    }
    IsTotalQuantityRejectedValid(): ValidateResult {
        if (!this.outgoing.TotalQuantityRejected)
            return { IsValid: false, Message: "Invalid" }
        const value = this.outgoing.TotalQuantityRejected;
        if (value >= this.outgoing.TotalQuantitySale) {
            return { IsValid: false, Message: 'Cannot Be Greater or Equal To Sale' }
        }
        return { IsValid: true };
    }
    IsTotalQuantityReturnedValid(): ValidateResult {
        const value = this.outgoing.TotalQuantityReturned;
        if (!value)
            return { IsValid: false, Message: "Invalid" }
        if (value > this.outgoing.TotalQuantityShiped) {
            return { IsValid: false, Message: "Cannot Be Greater To Taken" }
        }
        return { IsValid: true };
    }
    IsTotalQuantitySaleValid(): ValidateResult {
        const value = this.outgoing.TotalQuantitySale;
        if (!value)
            return { IsValid: false, Message: "Invalid" };
        
    }
}