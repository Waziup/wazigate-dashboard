
import * as React from "react";
import { EntProps } from "../devices/Entity";

export class NumericValueComp extends React.Component<EntProps> {

    constructor(props: EntProps) {
        super(props);
    }

    render() {
        return (
            <span>
                <input type="number" className="ent-value" onChange={this.props.changeHandler} value={this.props.entity.value}></input>
                <span> °C</span>
            </span>
        );
    }
}