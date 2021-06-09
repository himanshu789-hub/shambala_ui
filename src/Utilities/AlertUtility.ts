import { atom } from '@politie/sherlock';
export enum AlertType {
    DANGER, WARN
}
export interface IAlert {
    type: AlertType;
    msg: string;
}
export const currentAlert$ = atom<IAlert | null>(null);

const add = function (alert: IAlert) {
    currentAlert$.set(alert);
}
const addDanger = function (msg: string) {
    add({ msg, type: AlertType.DANGER });
}
const addWarn = function (msg: string) {
    add({ msg, type: AlertType.WARN });
}

export { addDanger, addWarn };