import { ChangeEvent, useState } from 'react';
import { provideValidNumber } from 'Utilities/Utilities';
interface ICaretSizeProps {
	Size: number;
	handleInput: Function;
	Limit?:number;
}
const CaretSize = function CaretSize(props: ICaretSizeProps) {
	const [caret, setCart] = useState<number>(0);
	const [pieces, setPieces] = useState<number>(0);
	const [quantity,setQuantity] = useState<number>(0);
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
			handleInput(quantity);
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
			handleInput(quantity);
			setPieces(pieces);
		}
	};
	return (
		<div className={`form-group ${!props.Size ? 'disabled' : ''} ${!props.Limit?'':quantity>props.Limit?'is-invalid':''}`}>
			<label htmlFor=''>Quantity</label>
			<div className='d-flex justify-content-around'>
				<div className={`form-group ${caret == 0 ? 'is-invalid' : ''}`}>
					<input className='form-control' value={caret} onChange={handleCaretChange} />
					<small className='form-text text-muted'>Caret</small>
					<small className='invalid-feedback'>Cannot be Zero</small>
				</div>
				<label className='pl-2 pr-2 font-weight-bold'>:</label>
				<div className={`form-group`}>
					<input className='form-control' value={pieces} onChange={handlePiecesChange} />
					<small className='form-text text-muted'>Pieces</small>
				</div>
			</div>
		</div>
	);
};

export default CaretSize;
