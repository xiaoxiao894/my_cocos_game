import { _decorator, Tween, tween, Vec3, Node } from "cc";
import { PoolObjectBase } from "../../common/PoolObjectBase";
import { DropItemCom } from "./DropItemCom";
const { ccclass, property } = _decorator;

@ccclass('DropItemSoup')
export class DropItemSoup extends DropItemCom {
    protected update(dt: number): void {
        this.node.setWorldRotationFromEuler(0, 0, 0);
    }
}