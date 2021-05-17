import { Route, useRouteMatch } from "react-router";
import Add from 'Containers/Shop/Add/Add';
export default function Shop() {
    const match = useRouteMatch();
    return (<div className='incoming-shipment'>
        <Route path={match.path + '/add'} children={() => <Add />} />
        <Route path={match.path + '/search'}>
          
        </Route>
    </div>);
}