import { _decorator, CCFloat, Component, Node, Sprite, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { StateDefine } from '../Actor/StateDefine';
const { ccclass, property } = _decorator;



@ccclass('PlayerHealthBarManager')
export class PlayerHealthBarManager extends Component {

    @property({ type: CCFloat, tooltip: "生命值" })
    hp = 200;

    @property({ type: Sprite, tooltip: "进度条" })
    progressSprite: Sprite = null;

    @property(Node)
    healNode: Node = null;

    private _curHp = 0;
    private _tryAgagin = `tryAgagin`

    private _timer: number = 0;

    onLoad() {
        this._timer = 0;

        DataManager.Instance.playerHealthBarManager = this;
    }

    start() {
        this._curHp = this.hp;
    }

    // 被攻击了
    underAttack(damage: number = 1) {
        if (DataManager.Instance.isPlayAgain) return;

        this._curHp -= damage;
        if (this._curHp < 0) {
            this._curHp = 0;

            if (this._curHp == 0) {
                DataManager.Instance.isPlayAgain = true;
                // 弹出重玩界面

                const actor = DataManager.Instance.player.actor;

                // 立即禁止由 Actor 控制的移动（全局移动锁）
                // （确保你已在类里声明 private _canMove: boolean = true;）
                (actor as any)._canMove = false;

                // 立刻清零目标朝向，防止 doMove 再计算速度
                actor.destForward.set(0, 0, 0);

                // 立刻清零刚体速度（但不禁用刚体）
                try {
                    if (actor.rigidbody) {
                        actor.rigidbody.setLinearVelocity(Vec3.ZERO);
                        actor.rigidbody.setAngularVelocity(Vec3.ZERO);
                    }
                    if (actor.rightBody && typeof actor.rightBody.setLinearVelocity === 'function') {
                        actor.rightBody.setLinearVelocity(Vec3.ZERO);
                    }
                } catch (e) {
                    console.warn("stop velocities failed", e);
                }

                // 停止人物输入
                // DataManager.Instance.playerAction = false;

                // 隐藏背包、停止动作
                DataManager.Instance.player.hideAllBackpacks();
                actor.changState(StateDefine.Die); // 如果 Die 动画会产生 root-motion，考虑在动画中禁用位移或在下面持续清零

                this.scheduleOnce(() => {

                    // 启动结算/重玩界面
                    DataManager.Instance.gameEndManager.init(this._tryAgagin);
                }, 2)
            }
        }

        if (this.progressSprite) {
            this.progressSprite.fillRange = this._curHp / this.hp;
        }
    }

    update(dt: number) {
        if (!DataManager.Instance.sceneManager || this._curHp == this.hp || !DataManager.Instance.isPlayerInDoor || !DataManager.Instance.isDisplayKeroseneLamp) {
            if (this.healNode) this.healNode.active = false;

            return;
        }

        this._timer += dt;

        if (this._timer >= DataManager.Instance.sceneManager.hpRecoveryInterval) {
            this._timer = 0;

            if (this._curHp < this.hp) {
                this._curHp += DataManager.Instance.sceneManager.hpRecoveryAmount;

                this.healNode.active = true;

                // this.scheduleOnce(() => {
                //     this.healNode.active = false;
                // }, .6)
            } else {
                this._curHp = this.hp;
                this.healNode.active = false;
            }
            this.progressSprite.fillRange = this._curHp / this.hp;
        }
    }

    // 重置血条
    resetHealthBar() {
        this._curHp = this.hp;
        if (this.progressSprite) this.progressSprite.fillRange = 1;

        this._timer = 0;

        this.healNode.active = false;
    }

}


