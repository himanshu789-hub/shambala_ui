import { CellClassParams } from "@ag-grid-community/all-modules";
import { CSSProperties } from "react";
import { ShipmentDTO } from "Types/DTO";
import { IsFuntionOrConstructor } from "Utilities/Utilities";
import { ValidateShipment } from "Validation/ShipmentValidation";
import { IValidateResult, ValidateMember } from "Validation/Validation.d";
import { GridCellStyleParams } from "../Grid.d";

const CellColors = {
    error: '#ff5959',
    info: ''
}
const CellClassRuleSpecifier = function <T, V extends ValidateMember<T>>(name: keyof T, validator: new (data:T)=>V) {
    return {
        'is-invalid': (params: CellClassParams) => {
            const result = (new validator(params.data) as any)['Is' + name + 'Valid'] as IValidateResult;
            return !result.IsValid;
        }
    }
}
export default CellClassRuleSpecifier;