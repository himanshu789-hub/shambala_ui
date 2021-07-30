import React, { ChangeEvent, memo, MutableRefObject, Ref, RefObject, useEffect, useRef, useState } from 'react';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import './CaretSize.css';

export interface ICaretSizeProps {
	Size: number;
	handleInput: (num: number) => void;
	MaxLimit?: number;
	OnFocusIn?: () => void;
	OnFocusOut?: () => void;
	Quantity: number;
	MinLimit?: number;
}
function getTwoDigitValue(num: number): string {
	return num < 10 ? "0" + num : num + '';
}

const CaretSize = memo(forwardRef<HTMLInputElement, ICaretSizeProps>((props, ref) => {
	const [inputValue, setInputValue] = useState("00/00");
	const [typingTimOut, setTimingOut] = useState<number>(0);
	const [quantity, setCaretQuantity] = useState<number>(props.Quantity);
	const [caretPosition, setCaretPosition] = useState<number>(0);
	const [error, setErrorMessage] = useState<string | null>(null);
	let inputRef: HTMLInputElement;

	const { Size, handleInput, MinLimit, Quantity, MaxLimit } = props;

	useEffect(() => {
		let IsValid = true;
		if (MinLimit && quantity < MinLimit) {
			setErrorMessage('Quantity Limit Surpass');
			IsValid = false;
		}
		if (MaxLimit && quantity > MaxLimit) {
			setErrorMessage('Quantity Limit Exceed');
			IsValid = false;
		}
		if (quantity == 0) {
			setErrorMessage('Cannot Be Zero');
			IsValid = false;
		}
		IsValid && setErrorMessage(null);
	}, [quantity])
	const Max_Caret_Allow = 100;
	const Max_Pieces_Allow = Size - 1;

	const calculateTotalQuantity = (caret: number, pieces: number) => {
		return caret * Size + pieces;
	};

	const setQuantityByValue = function (value: string) {
		const q = calculateTotalQuantity(Number.parseInt(value.substr(0, 2)), Number.parseInt(value.substr(3, 2)));
		setCaretQuantity(q);
		handleInput(q);
	}

	const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
		let value = e.currentTarget.value;
		var pos = e.currentTarget.selectionStart ?? 0;
		var setCaretPos = pos - 1;
		var elementPositionChange = pos;
		if (pos > 0 && pos <= 5) {
			if (pos != 3)
				value = value.substr(0, pos - 1) + '0' + value.substr(elementPositionChange);
		}
		else
			setCaretPos = 0;
		setInputValue(value);
		setCaretPosition(setCaretPos);
		setQuantityByValue(value);
	}
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode == 8) {
			handleBackspace(e);
			e.preventDefault();
		}
		if (!((e.key >= '0' && e.key <= '9') || (e.keyCode >= 37 && e.keyCode <= 40))) {
			e.preventDefault();
		}
	}
	function makePiecesValueValid(value: string) {
		const pieces = value.substr(3);
		const num = Number.parseInt(pieces)
		if (Max_Pieces_Allow == 0)
			value = value.substr(0, 3) + "00";

		if (!(num <= Max_Pieces_Allow))
			value = value.substr(0, 3) + Max_Pieces_Allow;
		setInputValue(value);
		setQuantityByValue(value);
	}
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		var value = e.currentTarget.value;
		var pos = e.currentTarget.selectionStart ?? 0;
		var setCaretPos = pos;
		var elementPositionChange = pos + 1;
		if (pos < 3) {
			value = value.substr(0, pos) + value.substr(elementPositionChange);
		}
		else if (pos < 5) {
			if (pos == 3) {
				setCaretPos++;
				value = value.substr(0, pos - 1) + '/' + value[2] + value[5];
			}
			else
				value = value.substr(0, pos) + value.substr(pos + 1);
		}
		else {
			value = value.substr(0, value.length - 1);
		}
		makePiecesValueValid(value);
		setCaretPosition(setCaretPos);
	};
	const handleFocusEvent = () => {
		const { OnFocusIn } = props;
		OnFocusIn && OnFocusIn();
	}
	const handleBlurEvent = () => {
		handleInput(quantity);
	}

	useEffect(() => {
		inputRef?.setSelectionRange(caretPosition, caretPosition);
	}, [caretPosition]);
	useEffect(() => {
		if (Size) {
			const caret = Math.floor(Quantity / Size);
			const pieces = Quantity % Size;
			setInputValue(`${getTwoDigitValue(caret)}/${getTwoDigitValue(pieces)}`);
		}
	}, [])
	function assignRef(node: HTMLInputElement) {
		node && (inputRef = node);
		if (typeof ref === 'function')
			ref(node);
		else
			(ref as MutableRefObject<HTMLInputElement>).current = node!;
	};

	return (
		<div className={`form-group ${!props.Size ? 'disabled' : ''}  
			${error == null ? '' : 'border bg-warning border-danger rounded is-invalid'}`}>
			<div className="input-group carat-group">
				<label className="input-group-prepend">Carat/Piece(s)</label>
				<input ref={assignRef} type="text" onKeyDown={handleKeyDown} onChange={handleChange} value={inputValue}
					className="form-control" onBlur={handleBlurEvent}
					onFocus={handleFocusEvent} />
			</div>
			<div className='invalid-feedback pl-1'>${error}</div>
		</div>
	);
}));

export default CaretSize;
