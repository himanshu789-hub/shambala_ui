import React, { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
import './CaretSize.css';

interface ICaretSizeProps {
	Size: number;
	handleInput: (num: number) => void;
	Limit?: number;
	OnFocusIn?: () => void;
	OnFocusOut?: () => void;
	Quantity: number;
}
const CaretSize = memo(function CaretSize(props: ICaretSizeProps) {
	const [inputValue, setInputValue] = useState("00/00");
	const [quantity, setQuantity] = useState<number>(0);
	const [caretPosition, setCaretPosition] = useState<number>(0)
	const inputRef = useRef<HTMLInputElement>(null);
	const { Size, handleInput } = props;

	const Max_Caret_Allow = 100;
	const Max_Pieces_Allow = props.Size;
	const calculateTotalQuantity = (caret: number, pieces: number) => {
		return caret * Size + pieces;
	};
	const setQuantityByValue = function(value:string){
		setQuantity(calculateTotalQuantity(Number.parseInt(value.substr(0,2)),Number.parseInt(value.substr(3,2))));
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
		if(Max_Pieces_Allow==0)
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
		const { OnFocusIn, OnFocusOut } = props;
		OnFocusIn && OnFocusIn();
	}
	const handleBlurEvent = () => {
		handleInput(quantity);
	}
	useEffect(() => {
		if (inputRef && inputRef.current)
		{
			inputRef.current.setSelectionRange(caretPosition,caretPosition)
		}
	}, [caretPosition]);
	return (
		<div className={'carat-control ' + (!quantity ? 'is-invalid rounded' : '')}>
			<div className={`form-group ${!props.Size ? 'disabled' : ''} 
			${props.Limit == undefined ? '' : quantity > props.Limit ? 'border bg-warning border-danger rounded is-invalid' : ''}`}>
				<div className="input-group carat-group">
					<label className="input-group-prepend">Carat/Piece(s)</label>
					<input ref={inputRef} type="text" onKeyDown={handleKeyDown} onChange={handleChange} value={inputValue}
						className="form-control" onBlur={handleBlurEvent}
						onFocus={handleFocusEvent} />
				</div>
				<div className='invalid-feedback pl-1'>Quantity Exceed</div>
			</div>
			<div className='invalid-feedback pl-1'>Cannot Be Zero</div>
		</div>
	);
});

export default CaretSize;
