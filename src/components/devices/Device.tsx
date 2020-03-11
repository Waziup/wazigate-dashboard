import * as React from "react";
import { EntComp } from "./Entity";

import { Device } from "waziup";

type State = {
    device: Device;
}
type Props = {
    device: Device;
}

export class DeviceComp extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = this.props;
        this.handleNameClick = this.handleNameClick.bind(this);
    }

    handleNameClick() {
        var device = this.state.device;
        var newName = prompt("Enter new device name:", device.name);
        if (newName && newName != device.name) {
            this.setState(() => {
                device.name = newName;
                return this.state;
            });
        }
    }

    render() {
        var device = this.state.device;
        return (
            <div className="devices-device">
                <div className="device-name" onClick={this.handleNameClick}>{device.name}</div>
                {device.sensors.map(sensor => <EntComp key={sensor.id} type="sensor" ent={sensor} />)}
            </div>
        );
    }
}