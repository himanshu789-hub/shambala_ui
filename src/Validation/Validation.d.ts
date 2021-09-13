

interface IValidateResult {
    IsValid: boolean;
}
type ValidationCode = "Parameter" | "Member";


interface IValidateResultOK extends IValidateResult {
}
interface IValidateResultBad extends IValidateResult {
    Message: string;
    Code: ValidationCode;
}
type ValidateMember<T extends {}> = {
    [Property in keyof T as `Is${Property}Valid`]: () => IValidateResultOK | IValidateResultBad;
}

type ValidateArray<T extends {}> = {
    [Property in keyof T as `IsAll${Exclude<string & Property, "Id">}Valid`]: () => IValidateResultBad | IValidateResultOK;
}