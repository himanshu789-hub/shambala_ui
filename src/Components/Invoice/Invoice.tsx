import { Route, RouteComponentProps, useRouteMatch } from 'react-router';
import InvoiceAddWrapper from 'Containers/Invoices/InvoiceWrapper/InvoiceAddWrapper';
import { Heading } from 'Components/Miscellaneous/Miscellaneous';
import InvoiceBillWrapper from 'Containers/Invoices/InvoiceBill/InvoiceBill';
import InvoiceDetail from 'Containers/Invoices/InvoiceDetail/InvoiceDetail';
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
