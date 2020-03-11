import * as React from "react";
import * as waziup from "waziup";

declare var gateway: waziup.Waziup;

interface Props {
    path: string;
    app: string;
}

export const AppsProxyComp = (props: Props) => <iframe className="app" src={gateway.toProxyURL(props.app, props.path)} />;