import * as React from "react";
import { Device, Waziup } from "waziup";
import { DeviceComp } from "./devices/Device";
import { ErrorComp } from "./Error";

declare var gateway: Waziup;

type State = {
    devices: Device[];
    error: any;
}

export class DevicesPageComp extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            devices: null,
            error: null
        };

        gateway.getDevices().then(devices => {
            this.setState({
                devices: devices,
                error: null,
            });
        }, (error) => {
            this.setState({
                devices: null,
                error: error,
            });
        })
    }

    render() {
        if(this.state.error) {
            return <ErrorComp error={this.state.error} />
        }

        if(!this.state.devices) {
            return <div>Loading... please wait.</div>
        }

        var devices = this.state.devices.map(
            device => <DeviceComp device={device} key={device.id}></DeviceComp>
        );

        return (
            <div className="devices">
                <h1 className="title">Devices</h1>
                {devices}
            </div>
        );
    }
}