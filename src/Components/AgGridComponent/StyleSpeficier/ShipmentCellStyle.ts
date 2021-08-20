import { CellClassParams } from "@ag-grid-community/all-modules";
import { IValidateResult, ValidateMember } from "Validation/Validation.d";

const CellColors = {
    error: '#ff5959',
    info: ''
}
const CellClassRuleSpecifier = function <T, V extends ValidateMember<T>>(name: keyof T, validator: new (data:T)=>V,getValidationEnttyFromParams?:(params:CellClassParams)=>T) {
    return {
        'is-invalid': (params: CellClassParams) => {
            const result = (new validator(params.data) as any)['Is' + name + 'Valid'] as IValidateResult;
            return !result.IsValid;
        }
    }
}
export default CellClassRuleSpecifier;