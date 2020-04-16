import React from "react";
import waziup from "waziup";

interface Props {
    path: string;
    app: string;
}

export const AppsProxyComp = (props: Props) => <iframe className="app" src={wazigate.toProxyURL(props.app, props.path)} />;