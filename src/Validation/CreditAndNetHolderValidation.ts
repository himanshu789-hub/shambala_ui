import { CreditType } from "Enums/Enum";
import { CreditAndNetHolderDTO } from "Types/DTO";
import { ValidateResultBad, ValidationResultOK } from "./Validation";

export class CreditAndNetHolderValidation implements ValidateMember<CreditAndNetHolderDTO>
{
    data: CreditAndNetHolderDTO;
    constructor(data: CreditAndNetHolderDTO) {
        this.data = data;
    }
    IsTypeValid() {
        if (!this.data.Type && this.data.Type !== 0) {
            return new ValidateResultBad("Cannot Be Empty");
        }
        if (this.data.Type === CreditType.CASH || this.data.Type === CreditType.CHEQUE)
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
    IsQtyValid() {
        if (this.data.Type === CreditType.CASH) {
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