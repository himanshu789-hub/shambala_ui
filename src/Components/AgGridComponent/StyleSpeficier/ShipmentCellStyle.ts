import { CellClassParams } from "@ag-grid-community/all-modules";
import  "Validation/Validation.d";
import './StyleSpecifier.css';

const CellClassRuleSpecifier = function <T, V extends ValidateMember<T>>(name: keyof T, validator: new (data:T)=>V,getValidationEnttyFromParams?:(params:CellClassParams)=>T) {
    return {
        'is-invalid': (params: CellClassParams) => {
            const data = getValidationEnttyFromParams?getValidationEnttyFromParams(params):params.data;
            const result =(new validator(data) as any)['Is' + name + 'Valid']() as IValidateResult;
            return !result.IsValid;
        }
    }
}

export default CellClassRuleSpecifier;