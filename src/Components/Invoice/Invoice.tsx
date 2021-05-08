import { Route, RouteComponentProps, useRouteMatch } from 'react-router';
import InvoiceAddWrapper from 'Containers/Invoices/InvoiceWrapper/InvoiceAddWrapper';
import { Heading } from 'Components/Miscellaneous/Miscellaneous';
export default function Invoice() {
	const match = useRouteMatch();
	return (
		<div id='invoice'>
			<Route path={match.path + '/add/:id'} component={(props: RouteComponentProps<{id:string}>) => <InvoiceAddWrapper {...props}/>}></Route>
			<Route path={match.path + '/search'}>
                <Heading label={"Invoice Search"}/>
            </Route>
		</div>
	);
}
