import { useEffect } from "react";
import { KeyboardEvent, useState } from "react";
import { KeyCode } from "Utilities/Utilities";
import './GridView.css';

type GridViewProps<T> = {
    HeaderDisplay: JSX.Element;
    children: React.ReactNode;
}
type Cell = {
    RowIndex: number;
    ColIndex: number;
}
export default function GridView<T extends {}>(props: GridViewProps<T>) {
    const { HeaderDisplay } = props;
    const [activeCell, setActiveCell] = useState<Cell>({ ColIndex: -1, RowIndex: -1 });
    const [shouldChangeFocus, setShouldChangeFocus] = useState<boolean>(true);

    const IsCellActive = function () { return activeCell.ColIndex != -1 && activeCell.RowIndex != -1 };
    const getRoot = () => document.querySelector('#gridview-table>tbody');
    const getTotalColumn = () => (getRoot()?.querySelector('tr')?.querySelectorAll('td').length) ?? 0;
    const getTotalRow = () => getRoot()?.querySelectorAll('tr').length ?? 0;
    const getNextCell = function (row: 0 | 1 | -1, col: 0 | 1 | -1): Cell {
        if (!IsCellActive())
            return { ColIndex: activeCell.ColIndex == -1 ? 0 : activeCell.ColIndex, RowIndex: activeCell.RowIndex == -1 ? 0 : activeCell.RowIndex };
        const nextColumn = activeCell.ColIndex + col;
        const nextRow = activeCell.RowIndex + row;

        return { ColIndex: nextColumn >= getTotalColumn() || nextColumn<0 ? activeCell.ColIndex : nextColumn, RowIndex: nextRow >= getTotalRow() || nextRow<0 ? activeCell.RowIndex : nextRow };
    }
    const getFocusAbleElement = function (cellPosition: Cell) {
        const cell = getRoot()?.querySelectorAll('tr')[cellPosition.RowIndex].querySelectorAll('td')[cellPosition.ColIndex];
        let focusableElement: HTMLElement | undefined | null = cell;
        if (cell?.hasAttribute('tabindex')) {
            focusableElement = cell;
        }
        else {
            focusableElement = cell?.querySelector('[tabindex]');
        }
        return focusableElement;
    }
    const removeFocusToElement = function (cell: Cell) {
        const previousFocusElement = getFocusAbleElement(activeCell);
        if (previousFocusElement) {
            previousFocusElement.setAttribute('tabindex', '-1');
            previousFocusElement.blur();
        }
    }
    const setFocusToElement = function (cellPosition: Cell) {
        const nextFocusableElement = getFocusAbleElement(cellPosition);
        if (nextFocusableElement) {
            nextFocusableElement.setAttribute('tabindex', '0');
            nextFocusableElement.focus();
        }
    }
    const find = function (element: Element, selector: string) {
        return element.querySelector(selector) != null;
    }
    const activateNext = function (cell: Cell) {
        removeFocusToElement(activeCell)
        setFocusToElement(cell);
        setActiveCell(cell);
    }
    const handleClickEvent = function (event: React.MouseEvent) {
        const grid = getRoot()?.querySelectorAll('tr');
        if (grid) {
            for (var i = 0; i < grid.length; i++) {
                var cols = grid[i].querySelectorAll('td');
                let IsFound = false;
                for (var j = 0; j < cols.length ?? 0; j++) {
                    const element = cols[j];
                    if (element && (element).contains(event.target as Element)) {
                        IsFound = true;
                        const cell = { ColIndex: j, RowIndex: i };
                        focusToEditablELement(element, cell);
                        break;
                    }
                }
                if (IsFound) {
                    console.log('founded');
                    break;

                }
            }
        }
    }
    const focusToEditablELement = function (element: Element, cell: Cell) {

        if (find(element, 'input')) {
            removeFocusToElement(activeCell);

            if (!element.querySelector('input')?.matches('[tabindex="0"')) {
                getFocusAbleElement(cell)?.querySelector('input')?.setAttribute('tabindex', '0');
                getFocusAbleElement(cell)?.querySelector('input')?.focus();
                setShouldChangeFocus(false);
            }
            else {
                element.querySelector('input')?.blur();
                element.querySelector('input')?.setAttribute('tabindex', '-1');
                setFocusToElement(cell);
                setShouldChangeFocus(true);
            }
            setActiveCell(cell);
        }
        else {
            activateNext(cell);
        }
    }
    const handleKeyDownEvent = function (e: KeyboardEvent<HTMLTableElement>) {

        let nextCell = activeCell;

        switch (e.keyCode) {
            case KeyCode.DOWN:
                nextCell = getNextCell(1, 0);
                break;
            case KeyCode.UP:
                nextCell = getNextCell(-1, 0);
                break;
            case KeyCode.LEFT:
                nextCell = getNextCell(0, -1);
                break;
            case KeyCode.RIGHT:
                nextCell = getNextCell(0, 1);
                break;
            case KeyCode.HOME:
                if (e.ctrlKey) {
                    nextCell.ColIndex = 0;
                    nextCell.RowIndex = 0;
                }
                else
                    nextCell.ColIndex = getRoot()?.querySelectorAll('tr')[activeCell.RowIndex].querySelectorAll('td').length ?? 0 - 1;
                break;
            case KeyCode.END:
                if (e.ctrlKey)
                    nextCell.ColIndex = getRoot()?.querySelectorAll('tr')[activeCell.RowIndex].querySelectorAll('td').length ?? 0 - 1;
                else {
                    nextCell.ColIndex = getRoot()?.querySelectorAll('tr')[activeCell.RowIndex].querySelectorAll('td').length ?? 0 - 1;
                    nextCell.RowIndex = getRoot()?.querySelectorAll('tr').length ?? 0 - 1;
                }
                break;
            case KeyCode.ENTER:
                const cell = getRoot()?.querySelectorAll('tr')[activeCell.RowIndex].querySelectorAll('td')[activeCell.ColIndex];
                if (cell) {
                    focusToEditablELement(cell, activeCell);
                }
                return;
            default: return;
        }
        if (shouldChangeFocus) {
            activateNext(nextCell);
        }
    }
    const onFocus = () => {
        if (!IsCellActive())
            setActiveCell({ ColIndex: 0, RowIndex: 0 });
    }
    useEffect(() => {
        document.getElementById('gridview-table')?.focus();
    }, [])
    return (<div className="table-wrapper">
        <table className="table" id="gridview-table" tabIndex={0} onKeyDown={handleKeyDownEvent} onClick={handleClickEvent} onFocus={onFocus}>
            <thead>
                {HeaderDisplay}
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </table></div>);

}