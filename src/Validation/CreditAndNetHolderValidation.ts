import { CapitalType, Medium } from "Enums/Enum";
import { CreditAndNetHolderDTO } from "Types/DTO";
import { checkAllElementValidInCollection, enumerateValidateMemberOnly, ValidateResultBad, ValidationResultOK } from "./Validation";

export class CreditAndNetHolderValidation implements ValidateMemberWithAll<CreditAndNetHolderDTO>
{
    data: CreditAndNetHolderDTO;
    constructor(data: CreditAndNetHolderDTO) {
        this.data = data;
    }
    IsAllValid() {
        return enumerateValidateMemberOnly<CreditAndNetHolderDTO, CreditAndNetHolderValidation>(this);
    }
    IsMediumValid() {
        if (!this.data.Medium && this.data.Medium !== 0) {
            return new ValidateResultBad("Cannot Be Empty");
        }
        if (this.data.Medium === Medium.CASH || this.data.Medium === Medium.CHEQUE)
            return new ValidationResultOK();
        return new ValidateResultBad("InValid Value");
    }
    IsAmountValid() {
        if (!this.data.Amount)
            return new ValidateResultBad("Cannot Be Empty");
        if (!Number.isFinite(this.data.Amount))
            return new ValidateResultBad("Must Be A Number");
        return new ValidationResultOK();
    }
    IsTypeValid() {
        if (this.data.Type === CapitalType.CREDIT || this.data.Type === CapitalType.DEBIT) {
            return new ValidationResultOK();
        }
        return new ValidateResultBad("Unknown Value");
    }
    IsQtyValid() {
        if (this.data.Medium === Medium.CASH) {
            if (this.data.Qty > 0)
                return new ValidateResultBad("Qty Must Be Zero,If Medium is CASH");
            return new ValidationResultOK();
        }
        if (!this.data.Qty)
            return new ValidateResultBad("Cannot Be Empty");
        if (this.data.Qty > 10) {
            return new ValidateResultBad("Cannot Be Greater Than 10");
        }
        return new ValidationResultOK();
    }
}
export default class CreditAndNetHolderCollectionValidation implements ValidateArray<CreditAndNetHolderDTO>
{
    private arr: CreditAndNetHolderDTO[];
    constructor(arr: CreditAndNetHolderDTO[]) {
        this.arr = arr;
    }
    IsAllValid() {
        return checkAllElementValidInCollection(this.arr, CreditAndNetHolderValidation);
    }
}
