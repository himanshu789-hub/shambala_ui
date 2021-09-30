import OutgoingGrid from "Containers/Outgoing/Add_Update/OutgoingGrid";
import Search from "Containers/Outgoing/Search/Search";
import OutgoingGridView from "Containers/Outgoing/View/OutgoingGridView";
import { Route, RouteComponentProps, Switch, useRouteMatch } from "react-router";

export default function Outgoing() {
    const match = useRouteMatch();
    return <Switch>
        <Route path={match.path + '/search'} children={(props)=><Search/>} />
        <Route path={match.path + "/add/:id?"} children={(props: RouteComponentProps<{ id?: string }>) => <OutgoingGrid {...props} />} />
        <Route path={match.path + '/view/:id'} children={(props: RouteComponentProps<{ id: string }>) => <OutgoingGridView {...props} />}></Route>
    </Switch>
}