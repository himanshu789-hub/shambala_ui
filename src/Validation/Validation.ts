import { IValidateResultBad, IValidateResultOK, ValidationCode } from './Validation.d';

export class ValidationResultOK implements IValidateResultOK {
    IsValid: boolean = true;
    
}
export class ValidateResultBad implements IValidateResultBad {
    Message: string;
    Code: ValidationCode;
    IsValid: boolean = false;
    constructor(msg: string, code: ValidationCode) {
        this.Message = msg;
        this.Code = code;
    }
}