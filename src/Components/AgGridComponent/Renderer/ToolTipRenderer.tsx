import { ITooltipParams } from '@ag-grid-community/all-modules';
import { sign } from 'node:crypto';
import React, { forwardRef, useImperativeHandle } from 'react';
import { ShipmentDTO } from 'Types/DTO';
import { ValidateShipment } from 'Validation/ShipmentValidation';
import { IValidateResult, IValidateResultBad, IValidateResultOK, ValidateMember } from 'Validation/Validation.d';
import { GridToolTipParams, sig } from '../Grid.d';
import { IsFuntionOrConstructor } from 'Utilities/Utilities';

import './ToolTip.css'

export const ToolTipComponent = forwardRef<{ getReactContainerClasses: () => string[] }, ITooltipParams>((props, ref) => {
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

export function ToolTipGetter<T, V extends ValidateMember<T>>(validator: new (data:T)=>V, name: keyof T) {
    return function (params: ITooltipParams) {
        //@ts-ignore
        let ValidationResult: IValidateResult = { IsValid: false };
        ValidationResult = (new validator(params.data) as any)['Is' + name + 'Valid'] as IValidateResult;
        if (ValidationResult.IsValid)
            return '';
        return (ValidationResult as IValidateResultBad).Message!;
    };
}
