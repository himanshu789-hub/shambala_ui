import { Route, RouteComponentProps, Switch, useRouteMatch } from "react-router";
import { Add_Update_Wrapper } from "Components/Miscellaneous/Miscellaneous";
import Salesman_Add_Update from "Containers/Salesman/Add_Update/Add_Update";
export default function Salesman() {
    const match = useRouteMatch();
    return (<div className='shop-add'>
        <Switch>
        <Route path={match.path + '/add'} children={(props:RouteComponentProps) => Add_Update_Wrapper(props,Salesman_Add_Update)} />
        <Route path={match.path + '/update/:id'} children={(props:RouteComponentProps<{id:string}>) => Add_Update_Wrapper(props,Salesman_Add_Update)} />
        <Route path={match.path + '/search'} >
        </Route>
        </Switch>
    </div>);
}