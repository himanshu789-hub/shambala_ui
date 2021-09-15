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
};
type ValidateMemberWithAll<T> = ValidateMember<T> & {
    IsAllValid: () => IValidateResultOK | IValidateResultBad;
}
type ValidateArray<T extends {}> = {
    IsAllValid: () => IValidateResultBad | IValidateResultOK;
}