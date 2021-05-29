import { Route, RouteComponentProps, useRouteMatch } from 'react-router';
import InvoiceAddWrapper from 'Containers/Invoice/InvoiceWrapper/InvoiceAddWrapper';
import InvoiceBillWrapper from 'Containers/Invoice/InvoiceBill/InvoiceBill';
import InvoiceDetail from 'Containers/Invoice/InvoiceDetail/InvoiceDetail';
export default function Invoice() {
	const match = useRouteMatch();
	return (
		<div id='invoice'>
			<Route path={match.path + '/add/:id'} component={(props: RouteComponentProps<{ id: string }>) => <InvoiceAddWrapper {...props} />}></Route>
			<Route path={match.path + '/search'}>
				<InvoiceDetail />
			</Route>
			<Route path="/invoice/bill" >
				<InvoiceBillWrapper />
			</Route>
		</div>
	);
}
