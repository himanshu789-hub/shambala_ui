import Loader, { CallStatus } from 'Components/Loader/Loader';
import React, { ChangeEvent, MouseEvent, MouseEventHandler, useState } from 'react';
import { useEffect } from 'react';
import { KeyboardEvent } from 'react';
import { KeyCode as Keys } from 'Utilities/Utilities';
import './SearchPanel.css';

interface IComboBox<T> {
    HandleEnter(data: T | null): void;
    FetchPoint(name: string): Promise<T[]>;
    DisplayFunction(data: T): JSX.Element;
    PlaceHolder: string;
    PropertyName: string;
}
const ComboxBoxHelphers = {
    Id: "x-combobox",
    GetItemId(index: number): string {
        return "item-combobox-" + index;
    }
}
interface IComboBoxExtend<T> extends IComboBox<T> {
    SetName(name: string): void;
    DropDownToggle(show: boolean): void;
    FocusInput: React.RefObject<HTMLInputElement>;
    ShowDropDown: boolean;
    Name: string;
    LabelFocus: React.RefObject<HTMLInputElement>;
}
function ComboBox<T>(props: IComboBoxExtend<T>) {
    const [APIStatus, setAPIStatus] = useState<number>(CallStatus.EMPTY);
    const [list, setList] = useState<SearchPanelItem<T>[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const { HandleEnter, DropDownToggle, SetName } = props;
    const close = () => {
        DropDownToggle(false);
        if (activeIndex == -1) {
            SetName('');
        }
        props.LabelFocus.current?.focus();
    }
    const handleClick = function (index: number) {
        selectCurret(index);
    }
    const selectCurret = function (index: number) {
        if (index == -1) {
            HandleEnter(null);
            SetName('');
        }
        else {
            const item = list[index].Item;
            close();
            SetName((item as any)[props.PropertyName]);
            HandleEnter(item);
        }
        setActiveIndex(index);
    }
    const handleKeyDown = function (e: KeyboardEvent<HTMLInputElement>) {
        let newActiveIndex = -1;

        switch (e.keyCode) {
            case Keys.DOWN:
                if (activeIndex != -1)
                    newActiveIndex = activeIndex + 1;
                else
                    newActiveIndex = 0;
                break;
            case Keys.UP:
                if (activeIndex != -1)
                    newActiveIndex = activeIndex - 1;
                else
                    newActiveIndex = list.length - 1;
                break;
            case Keys.ENTER:
                selectCurret(activeIndex);
                break;
            case Keys.ESC:
                if (props.Name.length == 0)
                    props.FocusInput.current?.blur();
                else {
                    SetName('')
                    setActiveIndex(-1);
                    setList([]);
                }
                break;
        }
        if (newActiveIndex > list.length - 1)
            newActiveIndex = 0;
        if (newActiveIndex < 0)
            newActiveIndex = list.length - 1;

        setActiveIndex(newActiveIndex);
        if (e.keyCode == Keys.UP || e.keyCode == Keys.DOWN) {
            e.preventDefault();
        }
        e.stopPropagation();
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.value;
        props.SetName(name);
        if (name.length > 0) {
            setAPIStatus(CallStatus.LOADING);
            props.FetchPoint(name).then(res => {
                setList(res.map((e): SearchPanelItem<T> => { return { Id: Math.random(), Item: e } }));
                setAPIStatus(CallStatus.LOADED);
            }).catch(() => setAPIStatus(CallStatus.ERROR));
        }
        else
            setList([]);
    }

    useEffect(() => {
        setActiveIndex(-1);
    }, [list])
    return (<div className={`d-none flex-column justify-content list-wrapper ${props.ShowDropDown ? 'd-flex' : ''}`}>
        <label className="text-right" onClick={close}><i className="fa fa-times"></i></label>
        <input onKeyDown={handleKeyDown} ref={props.FocusInput} value={props.Name} data-controltype="search"
            placeholder={props.PlaceHolder} className="form-control" onChange={handleChange} />
        <Loader Status={APIStatus}>

            <div id="x-combobox" className="mt-4" onMouseEnter={() => setActiveIndex(-1)}>
                {list.map((e, index) =>
                    <div key={index} className={activeIndex == index ? 'focused' : ''} data-id={`x-comboxbox-item-` + e.Id}
                        onClick={() => handleClick(index)}>
                        {props.DisplayFunction(e.Item)}
                    </div>)}
            </div>
        </Loader>

    </div>)
}
interface SearchPanelProps<T> extends IComboBox<T> {
    PropertyName: string;
}
type SearchPanelItem<T> = {
    Id: number;
    Item: T;
}
const SearchPanel = function <T>(props: SearchPanelProps<T>) {
    const [name, setName] = useState<string>('');
    const [showDropdown, setShouldDropdownDisplay] = useState<boolean>(false);
    const focusInput = React.useRef<HTMLInputElement>(null);
    const labelInput = React.useRef<HTMLInputElement>(null);
    const makeInputFocus = () => {
        setShouldDropdownDisplay(true); labelInput.current?.blur(); setTimeout(() => focusInput.current?.focus(), 200)
    }
    const onkeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.altKey && e.key == "/") {
            makeInputFocus();
        }
        if (new RegExp('^[A-Za-z]$').test(e.key))
            makeInputFocus();
    }


    return (
        <div className='form-group shop dropdown m-0'>
            <input ref={labelInput} tabIndex={-1} className='form-control' value={name} data-controltype="search"
                placeholder={props.PlaceHolder || ''} onKeyDown={onkeyDown} onClick={makeInputFocus} />
            <ComboBox<T>  {...props} DropDownToggle={setShouldDropdownDisplay} LabelFocus={labelInput}
                FocusInput={focusInput} Name={name} SetName={setName} ShowDropDown={showDropdown} />
        </div>
    );
}
export default React.memo(SearchPanel) as typeof SearchPanel;