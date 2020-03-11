
import * as React from "react";
import { EntProps } from "../devices/Entity";
import { field, fieldML } from "../../tools";
import { TimeComp } from "../Time";

type LoRaMeta = {
    deveui: string; // e.g. "58A0CB000010950F",
    nwkey: string; // e.g. "105FB4A2FE7DA8B78D31D2FD01BD3733",
    appkey: string; // e.g. "6700FAE34FB7CD31D8A4E1625DA1F7D2",
    version: string; // e.g. "1.0.2",
    activation: "OTAA" | "ABP"; // e.g. "OTAA", "ABP"
    activated: Date; // e.g. "2019-10-14T11:41:10.814Z",
    appeui: string; // e.g. "58A0CB0001500000"
}

export class LoRaComp extends React.Component<EntProps> {

    constructor(props: EntProps) {
        super(props);
    }

    render() {
        var meta = this.props.entity.meta["wazigate-lora"] as LoRaMeta;
        meta.activated = new Date(meta.activated);

        return (
            <div className="meta-lora">
                <div className="meta-name">LoRaWAN</div>
                {field("LoRaWAN Version:", <span></span>)}
                {fieldML("DEVEUI:", <input type="text" className="lora-id" value={meta.deveui} onChange={this.props.changeHandler} />)}
                {fieldML("NetworkKey:", <input type="text" className="lora-id" value={meta.nwkey} onChange={this.props.changeHandler} />)}
                {fieldML("AppKey:", <input type="text" className="lora-id" value={meta.appeui} onChange={this.props.changeHandler} />)}
                {field("Activated:", <TimeComp time={meta.activated} />)}
            </div>
        );
    }
}