import OutgoingGrid from "Containers/Outgoing/Add_Update/OutgoingGrid";
import OutgoingGridView from "Containers/Outgoing/View/OutgoingGridView";
import { Route, RouteComponentProps, Switch, useRouteMatch } from "react-router";

export default function Outgoing() {
    const match = useRouteMatch();
    return <Switch>
        <Route path={match.path + "/add/:id"} children={(props: RouteComponentProps<{ id?: string }>) => <OutgoingGrid {...props} />} />
        <Route path={match.path + '/view/:id'} children={(props: RouteComponentProps<{ id: string }>) => <OutgoingGridView {...props} />}></Route>
    </Switch>
}