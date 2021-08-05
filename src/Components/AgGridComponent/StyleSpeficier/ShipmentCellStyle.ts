import { CSSProperties } from "react";
import { ShipmentDTO } from "Types/DTO";
import { ValidateShipment } from "Validation/ShipmentValidation";
import { ValidateResult } from "Validation/Validation";
import { GridCellStyleParams } from "../Grid.d";

export function ShipmentStyleSpecifier(name: keyof ShipmentDTO, params: GridCellStyleParams): CSSProperties {
    const result = (ValidateShipment(params.data.Shipment) as any)['Is' + name + 'Valid']() as ValidateResult;
    if (!result.IsValid)
        return { background:'#ff5959',fontWeight:'bold'};
    return {background:'none',fontWeight:'normal'};
}