import React, { forwardRef, useImperativeHandle } from 'react';
import { ShipmentDTO } from 'Types/DTO';
import { ValidateShipment } from 'Validation/ShipmentValidation';
import { ValidateResult } from 'Validation/Validation';
import { GridToolTipParams } from '../Grid.d';

export const ToolTipComponent = forwardRef<{ getReactContainerClasses: () => string[] }, GridToolTipParams>((props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            getReactContainerClasses() {
                return ['tool-tip-container'];
            }
        }
    });

    if (props.value.length == 0)
        return <React.Fragment></React.Fragment>;
    return <span className="tool-tip-container border p-1"><i className="fa fa-info-circle text-danger"></i> {props.value}</span>
});


export function ToolTipGetter(name: keyof ShipmentDTO, params: GridToolTipParams): string {
    const ValidationResult = (ValidateShipment(params.data.Shipment) as any)['Is' + name + 'Valid']() as ValidateResult;
    if (ValidationResult.IsValid)
        return '';
    return ValidationResult.Message!;
}
