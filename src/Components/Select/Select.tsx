import React, { memo, useEffect } from 'react';
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
} & SelectPropsWithAria;

function Select(props: SelectProps) {
    const { list, defaultValue: value, onChange,IsOpen, onKeyDown, onMoseEvent, toggleDropDown, selectedIndex } = props;
    return (<div className="w-100 border rounded select-wrapper">
        <div className="d-inline-flex justify-content-around select-body"><input className="select-input" value={value} onChange={onChange}
            onKeyDown={onKeyDown} /> <span onClick={() => toggleDropDown()} tabIndex={0}><i className="fa fa-arrow-down"></i></span>
        </div>
        <div className={`select-list ${IsOpen && 'open'}`}>{list.map((e, index) => <div onMouseOver={onMoseEvent} data-index={index} className={`${index === selectedIndex ? 'selected' : ''}`} onClick={onMoseEvent} key={index}>{e.label}</div>)}</div>
    </div>);
}
type ValueContainer = { label: string, value: any };
type SelectPropsWithAria = {
    defaultValue?: any;
    list: ValueContainer[];
}
function SelectWithAria(props: SelectPropsWithAria) {
    const { list, defaultValue: value } = props;
    const [inputLabel, setInputLabel] = useState<any>(null);
    const [elements, setElements] = useState<ValueContainer[]>(list);
    const [index, setIndex] = useState<number>(-1);
    const [isOpen, toggleOpen] = useState(false);
    const onMouseEvent = function (e: React.MouseEvent<HTMLDivElement>) {
        const index = e.currentTarget.dataset.index;
        setIndex(Number.parseInt(index!));
    }
    const toggleDropown = function () {
        toggleOpen(!isOpen);
    }
    const onKeyDown = function (e: React.KeyboardEvent<HTMLInputElement>) {
        switch (e.keyCode) {
            case KeyCode.ENTER:
                if (index != -1 && index < elements.length) {
                    setInputLabel(elements[index].label);
                }
                else {
                    setInputLabel('');
                }
                break;
            case KeyCode.UP:
                if (index == 0)
                    setIndex(list.length - 1);
                else
                    setIndex(index + 1);
                break;
            case KeyCode.DOWN:
                if (index == list.length - 1)
                    setIndex(0);
                else
                    setIndex(index - 1);
                break;
        }
    }
    const onChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setInputLabel(value);
    }
    function selectNewValue() {
        let newList = list;
        if (value.length > 0) {
            newList = list.filter(e => e.label.startsWith(value))
        }
        setElements(newList);
        setIndex(newList.findIndex(e => e.value === value));
    }
    useEffect(() => {
        setIndex(elements.findIndex(e=>e.value===(value||-1)));
        function hover() { setIndex(-1) };
        document.getElementsByClassName('select-list')[0].addEventListener('hover', hover);
        return () => { document.getElementsByClassName('select-list')[0].removeEventListener('hover', hover) };

    }, [])
    useEffect(() => { selectNewValue(); }, [list]);
    useEffect(() => {
        selectNewValue();
        setIndex(-1);
    }, [value]);

    return <Select list={elements} onChange={onChange} onKeyDown={onKeyDown} selectedIndex={index} defaultValue={inputLabel} onMoseEvent={onMouseEvent} IsOpen={isOpen} toggleDropDown={toggleDropown}/>
}

const ReactSelect =  memo(SelectWithAria);
export default ReactSelect;