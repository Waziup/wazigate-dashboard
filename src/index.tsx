import React from "react";
import ReactDOM from "react-dom";
import * as waziup from "waziup";

import "./external";

import { version, branch } from "./version";

import "./HookRegistry";

// Not sure if we should keep this here,
// but without this the styles I wrote into index.scss file do not work
import "./style/index.scss";

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


const isAuthorized = () => {
    //Just a cheap API call
    window.fetch("/sys/uptime").then(
        (resp) => {
            if (resp.status == 401) {
                window.location.href = "/#/login";
            } else {
                setTimeout(isAuthorized, 1000 * 30); // Check every 30s if we need to show the login page
            }
        },
        (error) => {
            window.location.href = "/#/login";
        }
    );
};
isAuthorized();

/*----------- */

// We might make this optional in future
const reToken = () => {
    wazigate.set<any>("auth/retoken", {}).then(
        (res) => {
            // console.log("Referesh token", res);
            setTimeout(reToken, 1000 * 60 * 8); // Referesh the token every 10-2 minutes
        },
        (error) => {
            console.log(error);
        }
    );
}
setTimeout(reToken, 1000 * 60 * 8);


/*----------- */

waziup.connect().then(wazigate => {
    (window as any)["wazigate"] = wazigate;

    if (isDemo) {
        wazigate.toURL = (path: string) => `demo/${path}.json`;
        wazigate.toProxyURL = (name: string, path: string) => `demo/apps/${name}/${path}`;
        wazigate.set = (path: string, val: any) => Promise.resolve(null);
        wazigate.connectMQTT = (onConnect: () => void) => setTimeout(onConnect);
        wazigate.reconnectMQTT = () => { };
        wazigate.disconnectMQTT = (onDisconnect: () => void) => setTimeout(onDisconnect);
        wazigate.subscribe = (path: string) => { };
        wazigate.unsubscribe = (path: string) => { };
        wazigate.on = (event: string, cb: Function) => { };
        wazigate.off = (event: string, cb: Function) => { };
    }

    wazigate.connectMQTT(() => {
        console.log("MQTT Connected.");
    }, (err: Error) => {
        console.error("MQTT Err", err);
    }, {
        reconnectPeriod: 0,
    });

    ReactDOM.render(
        <DashboardComp />,
        document.getElementById("dashboard")
    );
})
