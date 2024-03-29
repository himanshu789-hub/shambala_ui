import { CaretSizeValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import { ValidateResultBad, ValidationResultOK } from "./Validation";
import "./Validation.d";

export default class CaretQuantityValidation implements ValidateMember<{ Quantity: CaretSizeValue }>
{
    private data: CaretSizeValue;
    constructor(data: CaretSizeValue) {
        this.data = data;
    }
    IsQuantityValid = (): IValidateResultOK | IValidateResultBad => {
        const minValue = this.data.MinLimit;
        const maxValue = this.data.MaxLimit;
        const isMinValid = minValue  ? this.data.Value >= minValue : true
        const isMaxValid = maxValue || maxValue == 0 ? this.data.Value <= maxValue : true
        if (!isMaxValid) {
            return new ValidateResultBad("Excceded Max Limit");
        }
        if (!isMinValid) {
            return new ValidateResultBad("Cannot Suppressed Min Limit");
        }
        return new ValidationResultOK();
    }
}