import { Device, Sensor, Actuator } from "waziup";

export type Hook = () => JSX.Element
export interface MenuHookProps {
    handleMenuClose: () => void;
}

export interface DeviceHookProps {
    device: Device;
    setDevice: React.Dispatch<React.SetStateAction<Device>>;
}
export type DeviceHook = (props: DeviceHookProps) => JSX.Element;
export type DeviceMenuHook = (props: DeviceHookProps & MenuHookProps) => JSX.Element;

export interface SensorHookProps {
    sensor: Sensor;
    deviceId: string;
}
export type SensorHook = (props: SensorHookProps) => JSX.Element;
export type SensorMenuHook = (props: SensorHookProps & MenuHookProps) => JSX.Element;

export interface ActuatorHookProps {
    actuator: Actuator;
    deviceId: string;
}
export type ActuatorHook = (props: ActuatorHookProps) => JSX.Element;
export type ActuatorMenuHook = (props: ActuatorHookProps & MenuHookProps) => JSX.Element;

export type MenuHook = {
    primary: string;
    icon?: JSX.Element;
    iconSrc?: string;
    href: string;
    target?: string;
};

export default class HookRegistry {

    hooks: {
        [id: string]: [any, number][]
    } = {}

    add(id: string, hook: any, prio: number = 0) {
        if (id in this.hooks) {
            this.hooks[id].push([hook, prio]);
            this.hooks[id].sort((a, b) => a[1]-b[1]);
        } else {
            this.hooks[id] = [[hook, prio]];
        }
    }

    set(id: string, hook: any, prio: number = 0) {
        this.hooks[id] = [[hook, prio]];
    }

    delete(id: string, hook: any) {
        if (id in this.hooks) {
            const i = this.hooks[id].findIndex(a => a[0] == hook);
            if (i !== -1) {
                if(this.hooks[id].length === 1)
                    delete this.hooks[id];
                else
                    this.hooks[id].splice(i, 1);
            }
        }
    }

    clear() {
        this.hooks = {};
    }

    get<I=any>(id: string) {
        if (id in this.hooks) {
            return this.hooks[id].map(a => a[0]) as I[];
        }
        return [] as I[];
    }

    getAt(id: string) {
        const subId = `${id}.`
        const d = depth(id)+1;
        // const hooks = Object.entries(this.hooks)
        //     .filter(([id]) => id.startsWith(subId) && depth(id) === d)
        //     .map(([id, hooks]) => hooks)
        //     .flat()
        //     .sort((a, b) => a[1]-b[1])
        //     .map(hook => hook[0]);
        const hooksList = Object.entries(this.hooks)
            .filter(([id]) => id.startsWith(subId) && depth(id) === d);
        var hooks: {
            [id: string]: any[];
        } = {};
        for (const hook of hooksList) {
            hooks[hook[0]] = hook[1].map(h => h[0]);
        }
        return hooks;
    }

    getAtPrio(id: string): [string, any][] {
        const subId = `${id}.`
        const d = depth(id)+1;
        const hooks = Object.entries(this.hooks)
            .filter(([id]) => id.startsWith(subId) && depth(id) === d)
            .map(([id, hooks]) => hooks.map(([hook, prio]) => [id, hook, prio] as [string, any, number]))
            .flat()
            .sort((a, b) => a[2]-b[2])
        return hooks as any as [string, any][];
    }

    getAtFlat(id: string) {
        const subId = `${id}.`
        const d = depth(id)+1;
        const hooks = Object.entries(this.hooks)
            .filter(([id]) => id.startsWith(subId) && depth(id) === d)
            .map(([id, hooks]) => hooks)
            .flat()
            .sort((a, b) => a[1]-b[1])
            .map(hook => hook[0]);
        return hooks;
    }

    getSubIDs(id: string) {
        const subID = `${id}.`
        const d = depth(id)+1;
        const keys = Object.keys(this.hooks)
            .filter(id => id.startsWith(subID) && depth(id) === d)
        return keys;
    }

    setMenuHook(menu: string, hook: MenuHook, prio: number = 0) {
        this.set(`menu.${menu}`, hook, prio)
    }

    addDeviceHook(hook: DeviceHook, prio: number = 0) {
        this.add("device", hook, prio)
    }
    addDeviceMetaHook(meta: string, hook: DeviceHook, prio: number = 0) {
        this.add(`device.meta.${meta}`, hook, prio)
    }
    addDeviceMenuHook(hook: DeviceMenuHook, prio: number = 0) {
        this.add("device.menu", hook, prio)
    }

    addSensorHook(hook: SensorHook, prio: number = 0) {
        this.add("sensor", hook, prio)
    }
    addSensorMenuHook(hook: SensorMenuHook, prio: number = 0) {
        this.add("sensor.menu", hook, prio)
    }
    addSensorMetaHook(meta: string, hook: SensorHook, prio: number = 0) {
        this.add(`sensor.meta.${meta}`, hook, prio)
    }

    addActuatorHook(hook: ActuatorHook, prio: number = 0) {
        this.add("sensor", hook, prio)
    }
    addActuatorMenuHook(hook: ActuatorMenuHook, prio: number = 0) {
        this.add("sensor.menu", hook, prio)
    }
    addActuatorMetaHook(meta: string, hook: ActuatorHook, prio: number = 0) {
        this.add(`sensor.meta.${meta}`, hook, prio)
    }
}

const hooks = new HookRegistry;
(window as any)["hooks"] = hooks;

function depth(id: string) {
    for(var c=-1, i=-2; i!=-1; c++, i=id.indexOf(".",i+1));
    return c;
}


 