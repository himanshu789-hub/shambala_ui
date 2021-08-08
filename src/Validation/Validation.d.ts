

interface IValidateResult {
    IsValid: boolean;
}
export enum ValidationCode {
 Parameter,Memeber
}
export interface IValidateResultOK extends IValidateResult {
}
export interface IValidateResultBad extends IValidateResult {
    Message: string;
    Code: ValidationCode;
}

export type ValidateMember<T> = {
    [Property in keyof T as `Is${Property}Valid`]: () => IValidateResultOK|IValidateResultBad;
}