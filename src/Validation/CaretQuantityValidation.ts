import { CaretSizeValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import { ValidateResultBad, ValidationResultOK } from "./Validation";
import { IValidateResultBad, IValidateResultOK, ValidateMember } from "./Validation.d";

export default class CaretQuantityValidation implements ValidateMember<{ Quantity: CaretSizeValue }>
{
    private data: CaretSizeValue;
    constructor(data: CaretSizeValue) {
        this.data = data;
    }
    IsQuantityValid = (): IValidateResultOK | IValidateResultBad => {
        const minValue = this.data.MinLimit;
        const maxValue = this.data.MaxLimit;
        const isMinValid = minValue ? this.data.Value < minValue : true
        const isMaxValid = maxValue ? this.data.Value > maxValue : true
        if (!isMinValid) {
            return new ValidateResultBad("Excceded Max Limit");
        }
        if (!isMaxValid) {
            return new ValidateResultBad("Cannot Suppressed Min Limit");
        }
        return new ValidationResultOK();
    }
}