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

        return { ColIndex: nextColumn >= getTotalColumn() ? activeCell.ColIndex : nextColumn, RowIndex: nextRow >= getTotalRow() ? activeCell.RowIndex : nextRow };
    }
    const getFocusAbleElement = function (cellPosition: Cell) {
        if (!IsCellActive())
            return null;
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
                const cell = getFocusAbleElement(activeCell);
                if (cell) {
                    if (find(cell, 'input')) {
                        if (!cell.querySelector('input')?.matches('[tabindex="0"')) {
                            removeFocusToElement(activeCell);
                            getFocusAbleElement(activeCell)?.querySelector('input')?.setAttribute('tabindex', '0');
                            setShouldChangeFocus(false);
                        }
                        else {
                            cell.querySelector('input')?.blur();
                            cell.querySelector('input')?.setAttribute('tabindex', '-1');
                            setFocusToElement(activeCell);
                            setShouldChangeFocus(true);
                        }
                    }
                    return;
                }
                break;
            default: return;
        }
        if (shouldChangeFocus) {
            activateNext(nextCell);
            setActiveCell(nextCell);
        }
    }
    useEffect(() => {
        if (!shouldChangeFocus) {
            getFocusAbleElement(activeCell)?.querySelector('input')?.focus();
        }
    }, [shouldChangeFocus]);

    return (<div className="table-wrapper">
        <table className="table" id="gridview-table" tabIndex={0} onKeyDown={handleKeyDownEvent}>
            <thead>
                {HeaderDisplay}
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </table></div>)

}