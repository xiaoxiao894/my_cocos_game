import Entity, { CharacterType } from "../entitys/Entity";
import State from "./State";

export default class IdleState extends State {

    constructor(entity: Entity) {
        super();
        this.entity = entity;
    }

    onEnter(): void {

        if (this.entity.getType() == CharacterType.CHARACTER) {
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
                console.error("骨骼动画组件未初始化");
                return;
            }

            this.entity.characterSkeletalAnimation.play("kugongnanidel");

        }
    }

    onUpdate(dt: number): void {
        // 空闲状态的逻辑
    }

    onExit(): void {
        console.log("退出空闲状态");
    }
}