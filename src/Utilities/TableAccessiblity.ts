export default class TableAccesiblilty {
    _domNode: HTMLElement;
    constructor(domNode: HTMLElement) {
        this._domNode = domNode;

    }
    init(): void {
        this._domNode.addEventListener("keydown", this.keyDownEvent.bind(this));
    }

    handleEnterEvent(rowNode: HTMLElement|null) {
        var target = rowNode as HTMLElement;
        if ( !target?.onclick)
            ((target as HTMLElement)?.querySelector('[tabindex]') as HTMLElement)?.click();
        else
            (target as HTMLElement)?.click()
    }
    keyDownEvent(e: KeyboardEvent) {
        switch (e.keyCode) {
            case 38:
            case 37:
            case 39:
            case 40:
                var selectedRow = this._domNode.querySelector('tr.selected');
                if (!selectedRow) {
                    var row = e.keyCode == 38 || e.keyCode == 37 ? this._domNode.querySelector('tbody>tr:last-child') : this._domNode.querySelector('tbody>tr:first-child')
                    row?.classList.add('selected')
                }
                else {
                    var nextRow = e.keyCode == 38 || e.keyCode == 37 ? selectedRow.previousElementSibling : selectedRow.nextElementSibling;
                    if (!nextRow) {
                        nextRow = e.keyCode == 38 || e.keyCode == 37 ? this._domNode.querySelector('tbody>tr:last-child') : this._domNode.querySelector('tbody>tr:first-child')
                    }
                    selectedRow.classList.remove('selected')
                    nextRow?.classList.add('selected');
                }
                break;
            case 13:
                this.handleEnterEvent(document.querySelector('tr.selected'));
                break;
        }
    }
};

