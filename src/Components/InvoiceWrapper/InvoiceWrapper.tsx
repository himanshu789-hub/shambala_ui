import { Route, RouteComponentProps, useRouteMatch } from 'react-router';
import InvoiceAdd from 'Containers/Invoices/InvoiceAdd/InvoiceAdd';
export default function InvoiceWrapper() {
	const match = useRouteMatch();
	return (
		<div id='invoice'>
			<Route path={match.path + '/add'} component={(props: RouteComponentProps) => <InvoiceAdd {...props} />}></Route>
			<Route path={match.path + '/search'}>
                <h1>Invoice Search</h1>
            </Route>
		</div>
	);
}
