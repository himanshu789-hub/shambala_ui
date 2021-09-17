import { CustomPrice } from "Types/DTO";
import { checkAllElementValidInCollection, enumerateValidateMemberOnly, ValidateResultBad, ValidationResultOK } from "./Validation";
import QuantityMediatorWrapper from '../Utilities/QuatityMediatorWrapper';
import { getARandomNumber } from "Utilities/Utilities";


export class CustomPriceValidation implements ValidateMemberWithAll<CustomPrice>{
    private readonly data: CustomPrice;
    constructor(data: CustomPrice) {
        this.data = data;
    }
    IsIdValid() {
        return new ValidationResultOK();
    }
    IsQuantityValid() {
        if (this.data.Quantity === 0)
            return new ValidateResultBad('Cannot Be Zero');

        return new ValidationResultOK();
    }
    IsPricePerCaratValid() {
        if (this.data.PricePerCarat === 0)
            return new ValidateResultBad('Cannot Be Zero');
        return { IsValid: true } as IValidateResultOK
    }
    IsAllValid():IValidateResultBad|IValidateResultOK{
        return enumerateValidateMemberOnly<CustomPrice, CustomPriceValidation>(this);
    }
} 

export default class CustomPriceCollectionValidation implements ValidateArray<CustomPrice>
{
    private arr: CustomPrice[];
    private readonly limit: number;
    constructor(data: CustomPrice[], limit: number) {
        this.arr = data;
        this.limit = limit;
    }
    IsAllValid() {
        const result = checkAllElementValidInCollection(this.arr, CustomPriceValidation);
        if (!result.IsValid)
            return result;
        const quantityMediator = new QuantityMediatorWrapper(this.limit);
        for (const customPrice of this.arr) {
            if (customPrice.Quantity < quantityMediator.GetQuantityLimit()) {
                quantityMediator.Subscribe(getARandomNumber(), customPrice.Quantity);
            }
            else
                return new ValidateResultBad("Quantity Exceed");
        }
        return new ValidationResultOK();
    }
}

