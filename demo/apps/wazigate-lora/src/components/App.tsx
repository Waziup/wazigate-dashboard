
import * as React from "react";

type Radio = {
    label: string;
}

var radios: {
    [id: string]: Radio
} = {
    "htm01": {
        label: "Heltec HT-M01 Mini LoRa Gateway",
    },
    "rak2245": {
        label: "RAK2245 RPi Hat",
    },
    "wazihat": {
        label: "Wazihat RPi Hat"
    }
}

type Region = {
    label: string;
}

var regions: {
    [id: string]: Region
} =  {
    "EU": {
        label: "EU 863-870, 🇪🇺 Europe",
    },
    "US": {
        label: "US 902-928 (🇺🇸 USA, 🇨🇦 Canada, 🇿🇦 South America)",
    },
    "CN": {
        label: "CN 470-510, 🇨🇳 China",
    },
    "AU": {
        label: "AU 915-928, 🇦🇺 Australia",
    },
    "AS0": {
        label: "AS 920-923, Asia (🇯🇵 Japan, 🇲🇾 Malaysia, 🇸🇬 Singapore, 🇮🇩 Indonesia)",
    },
    "AS1": {
        label: "AS 923-925, Asia (🇧🇳 Brunei, 🇰🇭 Cambodia, 🇭🇰 Hong Kong, 🇱🇦 Laos, 🇹🇼 Taiwan, 🇹🇭 Thailand, 🇻🇳 Vietnam)",
    },
    "KR": {
        label: "KR 920-923, 🇰🇷 Korea",
    },
    "IN": {
        label: "IN 865-867, 🇮🇳 India",
    }
}

export class AppComp extends React.Component {

    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1 className="inset title">LoRaWAN Settings</h1>

                <p className="inset">
                    <label htmlFor="radio">LoRa Radio</label>
                    <select className="input" name="radio" id="radio">
                        {Object.keys(radios).map((id) => <option id={id} value={id}>{radios[id].label}</option>)}
                    </select>
                </p>

                <p className="inset">
                    <label htmlFor="region">Region</label>
                    <select className="input" name="region" id="region">
                        {Object.keys(regions).map((id) => <option id={id} value={id}>{regions[id].label}</option>)}
                    </select>
                </p>
            </div>
        );
    }
}