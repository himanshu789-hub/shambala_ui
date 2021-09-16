import { ITooltipParams,CellClassParams } from '@ag-grid-community/all-modules';
import React, { forwardRef, useImperativeHandle } from 'react';
import  'Validation/Validation.d';
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
type ToolTipGetterParams = Omit<ITooltipParams,"data"|"value">&{data:any,value:any};
export function ToolTipGetter<T, V extends ValidateMember<L>,L=T>(validator: new (data:T)=>V, name: keyof L,getConstructorDataFromParams?:(e:ToolTipGetterParams)=>T) {
    return function (params: ITooltipParams) {
        let ValidationResult: IValidateResult = { IsValid: false };
        //@ts-ignore
        ValidationResult =(getConstructorDataFromParams?new validator(getConstructorDataFromParams(params)): ( new validator(params.data) as any))['Is' + name + 'Valid']() as IValidateResult;
        if (ValidationResult.IsValid)
            return '';
        return (ValidationResult as IValidateResultBad).Message!;
    };
}
