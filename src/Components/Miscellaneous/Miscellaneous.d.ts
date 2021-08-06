import {MouseEvent} from 'react';

export type ButtonProps = {
    handleClick: (e?: MouseEvent<HTMLButtonElement>) => void;
    className?:string;
    children?:React.ReactNode;
}
