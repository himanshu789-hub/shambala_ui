import React, { forwardRef, memo, Ref, RefObject, useEffect } from 'react';
import { useState } from 'react';
import { KeyCode } from 'Utilities/Utilities';
import './Select.css';

type SelectProps = {
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void;
    selectedIndex: number;
    IsOpen: boolean;
    toggleDropDown(): void;
    onMoseEvent(e: React.MouseEvent<HTMLDivElement>): void;
    onMouseClick(e: React.MouseEvent<HTMLDivElement>): void;
} & SelectWithAriaProps;

const Select = forwardRef<HTMLInputElement, SelectProps>((props, ref) => {
    const { list, defaultValue: value, onChange, onFous, onMouseClick, IsOpen, onKeyDown, onMoseEvent, toggleDropDown, selectedIndex } = props;

    return (<div className="myselect w-100 border rounded select-wrapper">
        <div className="d-inline-flex justify-content-around select-body">
            <input className="select-input" value={value || ''} onChange={onChange}
                onKeyDown={onKeyDown} onFocus={onFous} ref={ref} />
            <span className="p-1" onClick={() => toggleDropDown()} tabIndex={0}><i className="fa fa-arrow-down"></i></span>
        </div>
        <div className={`select-list ${IsOpen && 'open'}`}>
            {list.map((e, index) =>
                <div onMouseOver={onMoseEvent} data-index={index} className={`item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={onMouseClick} key={index}>{e.label}</div>)}
        </div>
    </div>);
});

export type ValueContainer = { label: string, value: any };
type SelectWithAriaProps = {
    defaultValue?: any;
    list: ValueContainer[];
    onFous?(e: React.FocusEvent): void;
}
type ReactSelctProps = {
    onSelect(value: any): void;
}
const SelectWithAria = forwardRef<HTMLInputElement, SelectWithAriaProps & ReactSelctProps>((props, ref) => {
    const { list, defaultValue: value} = props;
    const [inputLabel, setInputLabel] = useState<string>('');
    const [elements, setElements] = useState<ValueContainer[]>(list);
    const [index, setIndex] = useState<number>(value||-1);
    const [isOpen, toggleOpen] = useState(false);

    const onMouseEvent = function (e: React.MouseEvent<HTMLDivElement>) {
        const index = e.currentTarget.dataset.index;
        setIndex(Number.parseInt(index!));
    
    }
    const makeSelect = function () {
        const value = elements[index].value;
        props.onSelect(value);
    }
    const onMouseClick = function (e: React.MouseEvent<HTMLDivElement>) {
        const index = Number.parseInt(e.currentTarget.dataset.index!);
        setIndex(index);
        setInputLabel(elements[index].label);
        toggleDropown();
        makeSelect();
    }
    const toggleDropown = function () {
        toggleOpen(!isOpen);
    }
    const onKeyDown = function (e: React.KeyboardEvent<HTMLInputElement>) {
        switch (e.keyCode) {
            case KeyCode.ENTER:
                if (index != -1 && index < elements.length) {
                    setInputLabel(elements[index].label);
                    makeSelect();
                }
                else {
                    setInputLabel('');

                }
                toggleDropown();
                break;
            case KeyCode.UP:
                if (index == 0)
                    setIndex(list.length - 1);
                else
                    setIndex(index - 1);
                break;
            case KeyCode.DOWN:
                if (index == list.length - 1)
                    setIndex(0);
                else
                    setIndex(index + 1);
                break;
        }
    }
    const onChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setInputLabel(value);
    }
    const onFocus = function (e: React.FocusEvent) {
        toggleOpen(true);
        props.onFous && props.onFous(e);
    }
    function selectNewValue() {
        let newList = list;
        if (inputLabel?.length > 0) {
            newList = list.filter(e => e.label.startsWith(inputLabel))
        }
        setElements(newList);
        setIndex(newList.findIndex(e => e.value === value));
    }
    useEffect(() => {
        selectNewValue();
    }, [inputLabel,list]);

    return <Select list={elements} onChange={onChange} onKeyDown={onKeyDown} selectedIndex={index}
        defaultValue={inputLabel} onMoseEvent={onMouseEvent} IsOpen={isOpen} toggleDropDown={toggleDropown} onFous={onFocus}
        onMouseClick={onMouseClick} ref={ref} />
});

const ReactSelect = memo(SelectWithAria);
export default ReactSelect;