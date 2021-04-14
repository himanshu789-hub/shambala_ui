import { Route, RouteComponentProps, useRouteMatch } from 'react-router';
import InvoiceAddWrapper from 'Containers/Invoices/InvoiceWrapper/InvoiceAddWrapper';
export default function Invoice() {
	const match = useRouteMatch();
	return (
		<div id='invoice'>
			<Route path={match.path + '/add'} component={(props: RouteComponentProps) => <InvoiceAddWrapper {...props}/>}></Route>
			<Route path={match.path + '/search'}>
                <h1>Invoice Search</h1>
            </Route>
		</div>
	);
}
