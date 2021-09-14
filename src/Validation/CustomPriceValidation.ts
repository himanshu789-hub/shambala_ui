import { CustomPrice } from "Types/DTO";
import { ValidateResultBad, ValidationResultOK } from "./Validation";
import './Validation.d';
import QuantityMediatorWrapper from './../Utilities/QuatityMediatorWrapper';
import { QuantityLimitExceeded } from 'Errors/Error';

export default class CustomPriceCollectionValidation implements ValidateArray<CustomPrice>
{
    private arr: CustomPrice[];
    private readonly limit: number;
    constructor(data: CustomPrice[], limit: number) {
        this.arr = data;
        this.limit = limit;
    }
    IsAllPriceValid(): IValidateResultBad | IValidateResultOK {

        for (const element of this.arr) {
            if (element.Price === 0)
                return new ValidateResultBad("Price Cannot Be Zero");
        }
        return { IsValid: true };
    }
    IsAllQuantityValid(): IValidateResultOK | IValidateResultBad {
        const quantityMediator = new QuantityMediatorWrapper(this.limit);
        for (const element of this.arr) {
            try {
                quantityMediator.Subscribe(element.Id, element.Quantity);
            }
            catch (e) {
                if (e instanceof QuantityLimitExceeded)
                    return new ValidateResultBad("Quantity Limit Exceed");
            }
        }
        return new ValidationResultOK();
    }
}
export class CustomPriceValidation implements ValidateMember<CustomPrice>{
    private readonly data: CustomPrice;
    constructor(data: CustomPrice) {
        this.data = data;
    }
    IsIdValid(){
        return new ValidationResultOK();
    }
    IsQuantityValid(): IValidateResultBad | IValidateResultOK {
        if (this.data.Quantity === 0)
            return new ValidateResultBad('Cannot Be Zero');

        return { IsValid: true } as IValidateResultOK;
    }
    IsPriceValid() {
        if (this.data.Price === 0)
            return new ValidateResultBad('Cannot Be Zero');
        return { IsValid: true } as IValidateResultOK
    }
}