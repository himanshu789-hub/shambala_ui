import { ChangeEvent, memo, useEffect, useState } from 'react';
import { provideValidNumber } from 'Utilities/Utilities';
interface ICaretSizeProps {
	Size: number;
	handleInput: (num: number) => void;
	Limit?: number;
	OnFocusIn?: () => void;
	OnFocusOut?: () => void;
	Quantity: number;
}
const CaretSize = memo(function CaretSize(props: ICaretSizeProps) {
	const [caret, setCart] = useState<number>(0);
	const [pieces, setPieces] = useState<number>(0);
	const [quantity, setQuantity] = useState<number>(0);
	const { Size, handleInput } = props;
	const Max_Caret_Allow = 100;
	const Max_Pieces_Allow = props.Size;
	const calculateTotalQuantity = (caret: number, pieces: number) => {
		return caret * Size + pieces;
	};

	const handleCaretChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		let num = event.currentTarget.value;
		const validNum = provideValidNumber(num);
		if (validNum < Max_Caret_Allow) {
			const caret = validNum;
			const quantity = calculateTotalQuantity(caret, pieces);
			setQuantity(quantity);
			setCart(caret);
		}
	};

	const handlePiecesChange = (event: ChangeEvent<HTMLInputElement>) => {
		const num = event.target.value;
		const validNum = provideValidNumber(num);
		if (validNum <= Max_Pieces_Allow) {
			const pieces = validNum;
			const quantity = calculateTotalQuantity(caret, pieces);

			setQuantity(quantity);
			setPieces(pieces);
		}
	};
	const handleFocusEvent = () => {
		const { OnFocusIn, OnFocusOut } = props;
		OnFocusIn && OnFocusIn();
	}
	const handleBlurEvent = () => {
		handleInput(quantity);
	}
	useEffect(() => {
		const Quantity = props.Quantity;
		if (Quantity == quantity)
			return;
		try {
			const caret = quantity / props.Size;
			const pieces = quantity % props.Size;
			setPieces(pieces);
			setCart(caret);
			setQuantity(quantity);
		}
		catch (e) {
			setCart(0);
			setPieces(0);
			setQuantity(0);
		}
	}, [props.Quantity]);
	return (
		<div className={!quantity ? 'border border-danger is-invalid rounded' : ''}>
			<div
				className={`form-group p-1 ${!props.Size ? 'disabled' : ''} ${!props.Limit ? '' : quantity > props.Limit ? 'border border-danger rounded is-invalid' : ''
					}`}>
				<label htmlFor=''>Quantity</label>
				<div className='d-flex justify-content-around'>
					<div className={`form-group `}>
						<input className='form-control' value={caret} onChange={handleCaretChange}
							disabled={(props.Limit != undefined && props.Limit < 0)} onFocus={handleFocusEvent} onBlur={handleBlurEvent} />
						<small className='form-text text-muted'>Caret</small>
					</div>
					<label className='pl-2 pr-2 font-weight-bold'>:</label>
					<div className={`form-group ${pieces > props.Size ? 'is-invalid' : ''}`}>
						<input className='form-control' value={pieces} onChange={handlePiecesChange}
							disabled={(props.Limit != undefined && props.Limit < 0)} onFocus={handleFocusEvent} onBlur={handleBlurEvent} />
						<small className='form-text text-muted'>Pieces</small>
						<small className='invalid-feedback'>Atmost {props.Size}</small>
					</div>
				</div>
				<div className='invalid-feedback pl-1'>Quantity Exceed</div>
			</div>
			<div className='invalid-feedback pl-1'>Cannot Be Zero</div>
		</div>
	);
});

export default CaretSize;
