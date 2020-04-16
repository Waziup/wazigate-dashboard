import { Waziup, HookRegistry } from "waziup";

declare global {
    const hooks: HookRegistry;
    const wazigate: Waziup;
}