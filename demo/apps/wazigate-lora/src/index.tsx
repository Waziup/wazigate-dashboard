import * as React from "react";
import * as ReactDOM from "react-dom";

import { version, branch } from "./version";
import { AppComp } from "./components/App";


console.log("This is Wazigate-LoRa, a %s build. %s", branch, version);

// basic UI styles, platform dependant
if (navigator.platform.indexOf("Win") == 0)
    document.body.classList.add("windows");
else if (navigator.platform.indexOf("Mac") == 0)
    document.body.classList.add("mac");
else if (navigator.platform.indexOf("Linux") != -1)
    document.body.classList.add("linux");

ReactDOM.render(
    <AppComp />,
    document.getElementById("app")
);