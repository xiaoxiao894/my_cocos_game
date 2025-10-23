import { _decorator, Component, Node, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    public PartnerManager = null;
    public explosiveSpecialEffects = null;
    public target: Node | null = null;
    public speed: number = 10;
    private _dir = new Vec3();
    private _tempPos = new Vec3();

    update(deltaTime: number) {
        if (!this.target || !this.target.isValid) {
            this.node.active = false;
            return;
        }

        const currentPos = this.node.worldPosition;
        const targetPos = this.target.worldPosition;

        Vec3.subtract(this._dir, targetPos, currentPos);
        const distance = this._dir.length();

        if (distance < 0.3) {
            this.node.active = false;
            // 击中怪物， 播放动画
            const boundFunc = this.explosiveSpecialEffects.bind(this.PartnerManager);
            boundFunc(this.target, this.node.name);
            // 处理命中怪物的逻辑
            // DataManager.Instance.monsterManager.killMonsters([this.target]);
            return;
        }

        Vec3.normalize(this._dir, this._dir);
        Vec3.scaleAndAdd(this._tempPos, currentPos, this._dir, this.speed * deltaTime);
        this.node.setWorldPosition(this._tempPos)

        this.node.lookAt(targetPos);
        const euler = this.node.eulerAngles.clone();
        this.node.setRotationFromEuler(new Vec3(euler.x, euler.y + 90, euler.z));
    }
}

