import { ITooltipParams } from '@ag-grid-community/all-modules';
import { sign } from 'node:crypto';
import React, { forwardRef, useImperativeHandle } from 'react';
import { ShipmentDTO } from 'Types/DTO';
import { ValidateShipment } from 'Validation/ShipmentValidation';
import { IValidateResult, IValidateResultBad, IValidateResultOK, ValidateMember } from 'Validation/Validation.d';
import { GridToolTipParams } from '../Grid.d';
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

type sig<T, ObjT extends ValidateMember<T>> = (data: T) => ObjT | (new (data: T) => ObjT);
export function ToolTipGetter<T, V extends ValidateMember<T>>(validator: sig<T, V>, name: keyof T) {
    return function (params: ITooltipParams) {
        //@ts-ignore
        let ValidationResult: IValidateResult = { IsValid: false };
        let validatorObj: V;
        let IsFunction = false;
        try {
            //@ts-ignore
            (new validator(params.data));
        }
        catch (e) {
            IsFunction = true;
        }
        if (IsFunction) {
            //@ts-ignore
            validatorObj = validator(params.data);
        }
        else {
            //@ts-ignore
            validatorObj = new validator(params.data);
        }
        ValidationResult = (validatorObj as any)['Is' + name + 'Valid'] as IValidateResult;
        if (ValidationResult.IsValid)
            return '';
        return (ValidationResult as IValidateResultBad).Message!;
    };
}
