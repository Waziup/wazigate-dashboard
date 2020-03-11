import * as React from "react";
import * as waziup from "waziup";

import { IconComp } from "../Icon";
import ontologies from "../../ontologies.json";
import ontologiesSprite from "../../img/ontologies.svg";
import { TimeComp } from "../Time";
import { NumericValueComp } from "../values/NumericValue";
import { LoRaComp } from "../metas/LoRa";
import { field } from "../../tools";

interface Props {
    ent: waziup.Sensor | waziup.Actuator;
    type: "sensor" | "actuator";
}

interface State {
    open: boolean;
}

// class MetaHandlerRegistry {
//     constructor() {

//     }

// }

export type MetaHandler = new (props: EntProps) => React.Component<EntProps>;

export var metaHandler: {
    [meta: string]: MetaHandler[]
} = {
    "wazigate-lora": [
        LoRaComp
    ]
}

export class EntComp extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            open: false
        }
        this.togglePreview = this.togglePreview.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    togglePreview() {
        console.log("togglePreview");
        this.setState(state => ({
            open: !state.open
        }));
    }

    handleValueChange() {

    }

    render() {
        var ent = this.props.ent;
        var onts = this.props.type === "sensor" ? ontologies.sensingDevices : null;
        var ontKind = onts[ent.kind];

        if (this.state.open) {
            var kind = (
                <span className="ent-kind">
                    <span className="kind-label">
                        <IconComp className="kind-icon" src={`dist/${ontologiesSprite}#${ontKind.icon}`} />
                        {ontKind.label}
                    </span>
                    <span className="kind-unit">°C</span>
                </span>
            );

            var Value: new (props: EntProps) => React.Component<EntProps>;

            switch (ent.kind) {
                default:
                    Value = NumericValueComp;
            }

            var metas = [];

            for(var key in ent.meta) {
                if (key in metaHandler) {
                    var handler = metaHandler[key];
                    for(var i = 0; i < handler.length; i++) {
                        var Handler = handler[i];
                        metas.push(<Handler entity={ent} type={this.props.type} changeHandler={this.handleValueChange}/>)
                    }
                }
            }

            var details = (
                <div className="ent-details">
                    {field("Time", <TimeComp time={ent.time} />)}
                    {field("Kind", kind)}
                    {field("Value", <Value entity={ent} type={this.props.type} changeHandler={this.handleValueChange}/>)}
                    {metas}
                </div>
            );
        }

        return (
            <div className="device-ent">
                <div className={`ent-preview${this.state.open?" open":""}`} onClick={this.togglePreview}>
                    <IconComp className="ent-icon" src={`dist/${ontologiesSprite}#${ontKind.icon}`} />
                    <div className="ent-name">{ent.name}</div>
                </div>
                { details }
            </div>
        );
    }
}


export interface EntProps {
    entity: waziup.Sensor | waziup.Actuator;
    type: "sensor" | "actuator";
    changeHandler: () => void;
}