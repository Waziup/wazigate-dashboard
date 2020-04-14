export type SensingDevice = {
    label: string;
    quantities: string[];
    icon: string;
}

export type Quantity = {
    label: string;
    units: string[];
}

export type Unit = {
    label: string;
}

export type Ontologies = {
    sensingDevices: {
        [id: string]: SensingDevice
    },
    quantities: {
        [id: string]: Quantity
    },
    units: {
        [id: string]: Unit
    }
}

declare var ontolgies: Ontologies;
export default ontolgies;