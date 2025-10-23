import Entity from "../entitys/Entity";
import State from "./State";

export default class DieState extends State {
    constructor(entity: Entity) {
        super();

    }
    onEnter(): void {
        console.log("进入死亡状态");
    }

    onUpdate(dt: number): void {
        // 死亡状态的逻辑
    }

    onExit(): void {
        console.log("退出死亡状态");
    }
}