import { CustomPrice } from "Types/DTO";
import {  ValidateMember, ValidationCode } from "./Validation.d";
import { CaretSizeValue } from 'Components/AgGridComponent/Editors/CaretSizeEditor';
import { ValidateResultBad, ValidationResultOK } from "./Validation";
import QuantityValidation from './CaretQuantityValidation';

type CustomPriceValue = Omit<CustomPrice, 'Id' | 'Quantity'> & { Quantity: CaretSizeValue };
export default class CustomPriceValidation implements ValidateMember<CustomPriceValue>
{
    private data: CustomPriceValue;
    constructor(data: CustomPriceValue) {
        this.data = data;
    }
    IsPriceValid = () => {
        if (this.data.Price == 0)
            return new ValidateResultBad("Price Cannot Be Zero", ValidationCode.Memeber);
        return new ValidationResultOK();
    }
    IsQuantityValid = () => {
        const quantity = this.data.Quantity;
        if (quantity.Value === 0)
            return new ValidateResultBad("Cannot Be Zero");
        return new QuantityValidation(quantity).IsQuantityValid();
    }
}