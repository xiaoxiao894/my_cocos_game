import Entity from "../entitys/Entity";
import State from "./State";

export default class HurtState extends State {
    constructor(entity: Entity) {
        super();

    }
    onEnter(): void {
        console.log("进入受伤状态");
    }

    onUpdate(dt: number): void {
        // 受伤状态的逻辑
    }

    onExit(): void {
        console.log("退出受伤状态");
    }
}