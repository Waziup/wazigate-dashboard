import React from "react";
import ReactDOM from "react-dom";
import * as waziup from "waziup";

import "./external";

import { version, branch } from "./version";

import "./HookRegistry";

import { DashboardComp } from "./components/Dashboard";


console.log("Welcome to Wazigate! This is a %s build. %s", branch, version);

const search = new URLSearchParams(window.location.search);
const isDemo = search.has("demo");


// basic UI styles, platform dependant
if (navigator.platform.indexOf("Win") == 0)
    document.body.classList.add("windows");
else if (navigator.platform.indexOf("Mac") == 0)
    document.body.classList.add("mac");
else if (navigator.platform.indexOf("Linux") != -1)
    document.body.classList.add("linux");


// const send = WebSocket.prototype.send;
// WebSocket.prototype.send = function(data: ArrayBuffer) {
//     if (data.byteLength !== 1) send.apply(this, arguments);
// }

waziup.connect().then(wazigate => {
    (window as any)["wazigate"] = wazigate;

    if (isDemo) {
        wazigate.toURL = (path: string) => `demo/${path}.json`;
        wazigate.toProxyURL = (name: string, path: string) => `demo/apps/${name}/${path}`;
        wazigate.set = (path: string, val: any) => Promise.resolve(null);
        wazigate.connectMQTT = (onConnect: () => void) => setTimeout(onConnect);
        wazigate.reconnectMQTT = () => {};
        wazigate.disconnectMQTT = (onDisconnect: () => void) => setTimeout(onDisconnect);
        wazigate.subscribe = (path: string) => {};
        wazigate.unsubscribe = (path: string) => {};
    }
    
    ReactDOM.render(
        <DashboardComp/>,
        document.getElementById("dashboard")
    );
})
