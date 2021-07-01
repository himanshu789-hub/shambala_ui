import Loader, { CallStatus } from 'Components/Loader/Loader';
import React, { ChangeEvent, MouseEvent, MouseEventHandler, useState } from 'react';
import { useEffect } from 'react';
import { KeyboardEvent } from 'react';
import './SearchPanel.css';
interface IComboBox<T> {
    HandleEnter(data: T): void;
    FetchPoint(name: string): Promise<T[]>;
    DisplayFunction(data: T): JSX.Element;
    PlaceHolder: string;
    PropertyName: string;
}
const Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13
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
}
const checkKey = function (e: KeyboardEvent<HTMLInputElement>) {
    let IsValid = false;
    Object.values(Keys).map(c => (c == e.keyCode) && (IsValid = true))
    return IsValid;
}
function ComboBox<T>(props: IComboBoxExtend<T>) {
    const [APIStatus, setAPIStatus] = useState<number>(CallStatus.EMPTY);
    const [list, setList] = useState<SearchPanelItem<T>[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const { HandleEnter, DropDownToggle, SetName } = props;
    const handleKeyDown = function (e: KeyboardEvent<HTMLInputElement>) {
        let newActiveIndex = -1;
        const caretPosition = e.currentTarget.value.length;

        switch (e.keyCode) {
            case Keys.DOWN:
            case Keys.RIGHT:
                if (activeIndex != -1)
                    newActiveIndex = activeIndex + 1;
                else
                    newActiveIndex = 0;
                break;
            case Keys.UP:
            case Keys.LEFT:
                if (activeIndex != -1)
                    newActiveIndex = activeIndex - 1;
                else
                    newActiveIndex = list.length - 1;
                break;
            case Keys.ENTER:
                const item = list[activeIndex!].Item;
                SetName((item as any)[props.PropertyName]);
                DropDownToggle(false);
                HandleEnter(item);
                break;
        }
        if (newActiveIndex > list.length - 1)
            newActiveIndex = 0;
        if (newActiveIndex < 0)
            newActiveIndex = list.length - 1;
         
        setActiveIndex(newActiveIndex);
        if(checkKey(e)){
            e.preventDefault();
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.value;
        props.SetName(name);
        props.DropDownToggle(true);
        if (name.length > 0) {
            setAPIStatus(CallStatus.LOADING);
            props.FetchPoint(name).then(res => {
                setList(res.map((e): SearchPanelItem<T> => { return { Id: Math.random(), Item: e } }));
                setAPIStatus(CallStatus.LOADED);
            }).catch(() => setAPIStatus(CallStatus.ERROR));
        };
    }
    return (<div className={`d-none flex-column justify-content list-wrapper ${props.ShowDropDown ? 'd-flex' : ''}`}>
        <input onKeyDown={handleKeyDown} ref={props.FocusInput} value={props.Name} data-controltype="search"
            placeholder={props.PlaceHolder} className="form-control" onChange={handleChange} />
        <Loader Status={APIStatus}>
            <div id="x-combobox" className="mt-4">
                {list.map((e, index) => <div key={index} className={activeIndex == index ? 'focused' : ''} data-id={`x-comboxbox-item-` + e.Id}>{props.DisplayFunction(e.Item)}</div>)}
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

    return (
        <div className='form-group shop dropdown'>
            <input
                ref={labelInput}
                className='form-control'
                value={name}
                data-toggle="dropdown"
                data-controltype="search"
                placeholder={props.PlaceHolder || ''}
                onClick={() => { setShouldDropdownDisplay(true); labelInput.current?.blur(); setTimeout(() => focusInput.current?.focus(), 200) }}
            />
            <ComboBox<T>  {...props} DropDownToggle={setShouldDropdownDisplay}
                FocusInput={focusInput} Name={name} SetName={setName} ShowDropDown={showDropdown} />
        </div>
    );
}
export default React.memo(SearchPanel) as typeof SearchPanel;