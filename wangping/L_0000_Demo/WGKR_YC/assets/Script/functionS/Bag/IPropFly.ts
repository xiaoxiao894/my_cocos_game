import { Prop } from "./Prop";

export default interface IPropFly {
    /**
     * flyProp
     */
    flyProp(prop: Prop): boolean;
}