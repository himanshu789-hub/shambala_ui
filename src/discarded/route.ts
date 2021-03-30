import {FunctionComponent,Component, ComponentClass} from 'react';
export interface RouteConfigElement
{
    path:string;
    component:ComponentClass<any,any>|FunctionComponent<any>;
    routes?:RouteConfig;
    exact?:boolean;
    uniqueId:string;
}

export type RouteConfig = RouteConfigElement[];