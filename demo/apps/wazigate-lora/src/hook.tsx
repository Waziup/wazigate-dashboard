import {dashboard} from "wazigate-dashboard";
import {LoRaMeta} from "./components/LoRaMeta"

import { version, branch } from "./version";


console.log("This is Wazigate-LoRa, a %s build. %s", branch, version);


dashboard.addMetaHandler("wazigate-lora", LoRaMeta);
dashboard.completeHook();