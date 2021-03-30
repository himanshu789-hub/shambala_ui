import './Action.css';

type IActionProps = {
	handleAdd: Function;
	handleProcess: Function;
};
export default function Action(props: IActionProps) {
	return (
		<div id='action' className='d-flex flex-row justify-content-around fixed-bottom'>
			<button className='btn btn-primary rounded-circle' onClick={() => props.handleAdd()}>
				<i className='fa fa-plus'></i>
			</button>
			<button className='btn btn-outline-success rounded-circle' onClick={() => props.handleProcess()}>
				<i className='fa fa-check'></i>
			</button>
		</div>
	);
}
