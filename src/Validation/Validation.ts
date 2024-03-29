export class ValidationResultOK implements IValidateResultOK {
    IsValid: boolean = true;
}
export class ValidateResultBad implements IValidateResultBad {
    Message: string;
    Code: ValidationCode;
    IsValid: boolean = false;
    constructor(msg: string, code?: ValidationCode) {
        this.Message = msg;
        this.Code = code || "Member";
    }
}

export function enumerateValidateMemberOnly<T, V extends ValidateMember<L>,L=T>(obj: V, name?: keyof L):IValidateResult|IValidateResultBad {
    for (let propertyName in Object.getOwnPropertyNames(Object.getPrototypeOf(obj))) {
        if (propertyName !== "IsAllValid" && propertyName !== 'constructor' && (typeof (obj as any)[propertyName] === "function") && (name ? propertyName.includes(name.toString()) : true)) {
            const result:IValidateResultOK|IValidateResultBad = (obj as any)[propertyName]();
            if (!result.IsValid)
                return result;
        }
    }
    return {IsValid:true} as IValidateResultOK;
};

export function checkAllElementValidInCollection<T, V extends ValidateMemberWithAll<T>>(arr: T[], validator: new (data: T) => V):IValidateResultOK|IValidateResultBad {
    for (const element of arr) {
        const result = new validator(element).IsAllValid();
        if (!result.IsValid)
            return result;
    }
    return new ValidationResultOK();
}