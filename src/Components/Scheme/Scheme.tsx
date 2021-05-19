import SchemeAdd from "Containers/Scheme/Add/Add";
import { Route, RouteComponentProps, Switch, useRouteMatch } from "react-router"

export default function Scheme() {
    const match = useRouteMatch();
    return <Switch>
        <Route path={match.path + '/add'} children={(props: RouteComponentProps) => <SchemeAdd {...props} />} />
        <Route path={match.path + '/search'} children={() => <span>Search</span>} />
    </Switch>
}