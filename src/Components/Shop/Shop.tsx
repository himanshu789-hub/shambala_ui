import { Route, RouteChildrenProps, RouteComponentProps, useRouteMatch } from "react-router";
import Add from 'Containers/Shop/Add_Update/Shop_Add_Update';
import Shop_Add_Update from "Containers/Shop/Add_Update/Shop_Add_Update";
export default function Shop() {
    const match = useRouteMatch();
    return (<div className='incoming-shipment'>
        <Route path={match.path + '/add'} children={(props:RouteComponentProps) => <Shop_Add_Update {...props} />} />
        <Route path={match.path + '/update/:id'} children={(props:RouteComponentProps<{id:string}>) => <Shop_Add_Update {...props} />} />
        <Route path={match.path + '/search'} >
        </Route>
    </div>);
}