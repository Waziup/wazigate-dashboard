type SensingDevice = {
    label: string;
    quantities: string[];
    icon: string;
}

type Qunatity = {
    label: string;
    units: string[];
}

type Unit = {
    label: string;
}

type Ontologies = {
    sensingDevices: {
        [id: string]: SensingDevice
    },
    qunatities: {
        [id: string]: Qunatity
    },
    units: {
        [id: string]: Unit
    }
}

declare var ontolgies: Ontologies;
export default ontolgies;