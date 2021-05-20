import { Route, RouteChildrenProps, RouteComponentProps, Switch, useRouteMatch } from "react-router";
import Shop_Add_Update from "Containers/Shop/Add_Update/Shop_Add_Update";
import { Add_Update_Wrapper } from '../Miscellaneous/Miscellaneous';
import ShopSearchList from "Containers/Shop/Search/Search";
export default function Shop() {
    const match = useRouteMatch();
    return (<div className='shop-add'>
        <Switch>
            <Route path={match.path + '/add'} children={(props: RouteComponentProps) => Add_Update_Wrapper(props, Shop_Add_Update)} />
            <Route path={match.path + '/update/:id'} children={(props: RouteComponentProps<{ id: string }>) => Add_Update_Wrapper(props, Shop_Add_Update)} />
            <Route path={match.path + '/search'} children={() => <ShopSearchList />} />
        </Switch>
    </div>);
}