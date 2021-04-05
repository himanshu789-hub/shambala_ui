interface IComponentErrorProps {
	children: JSX.Element;
	show?: boolean;
}
export default function ComponentError(props: IComponentErrorProps) {
	let shouldDisplay = props.show ?? false;

	if (!shouldDisplay) return props.children;
	else
		return (
			<div>
				<h5>A Component Error Occured</h5>
			</div>
		);
}
