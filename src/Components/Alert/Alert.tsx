import React from 'react';
import './Alert.css';
import { IAlert, AlertType, currentAlert$ } from 'Utilities/AlertUtility';

interface IComponentAlert extends IAlert {
    Fade: boolean;
    Id:number
}
type AlertState = {
    Alerts: IComponentAlert[]
}
type AlertProps = {

}
export default class Alert extends React.Component<AlertProps, AlertState>
{
    constructor(props: AlertProps) {
        super(props);
        this.state = {
            Alerts: []
        };
    }
    cssClasses(alert: IComponentAlert) {
        const classes = [];
        switch (alert.type) {
            case AlertType.DANGER: classes.push('alert-danger'); break;
            default: classes.push('alert-warn');
        }
        if (alert.Fade)
            classes.push('alert-remove');
        return classes.join(' ');
    }
    handleRemove = (alert: IComponentAlert) => {
        const fadedAlert: IComponentAlert = { ...alert, Fade: true };
        this.setState(({ Alerts }) => { return { Alerts: Alerts.map(e => e == alert ? fadedAlert : e) } });
        setTimeout(() => { this.setState({ Alerts: this.state.Alerts.filter(e => e != fadedAlert) }) }, 250);
    }
    classForType(type:AlertType){
      let classes=["fa"];
      switch(type)
      {
          case AlertType.DANGER:classes.push('fa-shield') ;break;
          default:classes.push('fa-exclamation-circle');
      }
      return classes.join(' ');
    }
    render() {
        return <div className="d-flex flex-column alert-wrapper">{this.state.Alerts.map((e,index) => <div key={e.Id} className={`d-flex align-items-center alert ${this.cssClasses(e)}`}>
            <i className="alert-close fa fa-times" onClick={() => this.handleRemove(e)}></i>
            <i className={'p-1 '+this.classForType(e.type)}></i>
            <span>{e.msg}</span>
        </div>)}</div>
    }
    componentDidMount() {
        currentAlert$.react((value) => {
            if (!value)
                this.setState({ Alerts: [] });
            else
                this.setState({ Alerts: [...this.state.Alerts, { ...value, Fade: false,Id:Math.random() }] });
        })
    }
}