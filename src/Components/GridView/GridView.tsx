import { KeyboardEvent, useState } from "react";
import { KeyCode } from "Utilities/Utilities";

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
    const IsCellActive = function () { return activeCell.ColIndex != -1 && activeCell.RowIndex != -1 };
    const getRoot = () => document.getElementById('gridview-table');
    const getNextCell = function (row: 0 | 1 | -1, col: 0 | 1 | -1): Cell {
        if (!IsCellActive())
            return { ColIndex: activeCell.ColIndex == -1 ? 0 : activeCell.ColIndex, RowIndex: activeCell.RowIndex == -1 ? 0 : activeCell.RowIndex };
        return { ColIndex: activeCell.ColIndex + col, RowIndex: activeCell.RowIndex + row };
    }
    const getFocusAbleElement = function (cellPosition: Cell) {
        const cell = getRoot()?.querySelectorAll('tr')[cellPosition.RowIndex].querySelectorAll('td')[cellPosition.ColIndex];
        let focusableElement: HTMLElement | undefined | null = cell;
        if (cell?.hasAttribute('tabindex')) {
            focusableElement = cell;
        }
        else {
            focusableElement = cell?.querySelector('input');
            if (!focusableElement)
                focusableElement = cell?.querySelector('tabindex');
        }
        return focusableElement ?? cell;
    }
    const setFocusToElement = function (cellPosition: Cell) {
        const previousFocusElement = getFocusAbleElement(activeCell);
        if (previousFocusElement) {
            previousFocusElement.setAttribute('tabindex', '-1');
            previousFocusElement.blur();
        }
        const nextFocusableElement = getFocusAbleElement(cellPosition);
        if (nextFocusableElement) {
            nextFocusableElement.setAttribute('tabindex', '0');
            nextFocusableElement.focus();
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
        }
        setFocusToElement(nextCell);
        setActiveCell(nextCell);
    }
    return (<table className="table table-wrapper" id="gridview-table" tabIndex={0} onKeyDown={handleKeyDownEvent}>
        <thead>
            {HeaderDisplay}
        </thead>
        <tbody>
            {props.children}
        </tbody>
    </table>)

}