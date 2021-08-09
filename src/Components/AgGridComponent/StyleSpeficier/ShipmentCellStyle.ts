import { CellClassParams } from "@ag-grid-community/all-modules";
import { CSSProperties } from "react";
import { ShipmentDTO } from "Types/DTO";
import { ValidateShipment } from "Validation/ShipmentValidation";
import { IValidateResult } from "Validation/Validation.d";
import { GridCellStyleParams } from "../Grid.d";

const CellColors = {
    error: '#ff5959',
    info: ''
}
export function StyleSpecifier<T extends {}>(name: keyof ShipmentDTO, getDataFromParams: (e: CellClassParams) => T) {
    return function (params: CellClassParams) {
        const result = (ValidateShipment(params.data.Shipment) as any)['Is' + name + 'Valid']() as IValidateResult;
        if (!result.IsValid)
            return { background: CellColors.error, fontWeight: 'bold' };
        return { background: 'none', fontWeight: 'normal' };
    }
}