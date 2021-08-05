
export type ValidateResult = {
    IsValid: boolean;
    Message?: string;
}

export type ValidateMember<T> = {
    [Property in keyof T as `Is${Property}Valid`]: () => ValidateResult;
}
