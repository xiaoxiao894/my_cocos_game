import { Node, tween, Vec3 } from "cc";
import { App } from "../App";
import { GlobeVariable } from "../core/GlobeVariable";
import { Parter } from "./Parter";
import { EnemyBear } from "./EnemyBear";

export default class ParterController {

    /** 左右两边是否启动 */
    private _leftStarted: boolean = false;
    private _rightStarted: boolean = false;

    /** 时间间隔 */
    private _timeLimit: number = 1;
    private _leftTimer: number = 0;
    private _rightTimer: number = 0;

    /** 活着的小兵们 */
    private _parters: Array<Parter> = [];
    private _targetMonsters: EnemyBear[] = [];

    public static _instance: ParterController = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new ParterController();
        }
        return this._instance;
    }

    public startLeft(): void {
        this._leftStarted = true;
    }

    public startRight(): void {
        this._rightStarted = true;
    }

    update(dt: number): void {
        if (this._leftStarted && this._leftTimer >= this._timeLimit) {
            this.addOneParter(true);
            this._leftTimer = 0;
        }
        if (this._rightStarted && this._rightTimer >= this._timeLimit) {
            this.addOneParter(false);
            this._rightTimer = 0;
        }
        this._leftTimer += dt;
        this._rightTimer += dt;

        //RVO
        for (let index = 0; index < this._parters.length; index++) {
            const enemy = this._parters[index];
            enemy?.getComponent(Parter)?.moveByRvo(dt);
        }
    }

    /** 创建新小兵 */
    private addOneParter(isLeft: boolean) {
        let prefab = App.poolManager.getNode(GlobeVariable.entifyName.Parter);
        prefab.parent = App.sceneNode.enemyParent;
        prefab.active = true;
        let parter = prefab.getComponent(Parter);
        parter.init(isLeft);
        this._parters.push(parter);
        tween(prefab)
            .call(() => {
                if (isLeft) {
                    App.mapShowController.leftHouseAni();
                } else {
                    App.mapShowController.rightHouseAni();
                }

            })
            .to(0.15, { scale: prefab.scale.clone().multiplyScalar(1.2) }, { easing: 'quadOut' })


            .to(0.05, { scale: prefab.scale.clone().multiplyScalar(1) }, { easing: 'quadOut' })

            .call(() => {

            })
            .start();
    }

    /** 移除小兵 */
    public removeParter(parter: Parter) {
        const index = this._parters.indexOf(parter);
        if (index !== -1) {
            this._parters.splice(index, 1); // 从列表中移除
        }
    }

    public addMonsterTarget(enemy: EnemyBear) {
        this._targetMonsters.push(enemy);
        //console.log(`增加目标 ${node.uuid}`);
    }

    public removeMonsterTarget(enemy: EnemyBear) {
        let index: number = this._targetMonsters.indexOf(enemy);
        if (index >= 0) {
            this._targetMonsters.splice(index, 1);
            //console.log(`移除目标 ${node.uuid}`);
        } else {
            if (enemy) {
                // console.log(`目标 ${node.uuid} 不存在`);
            } else {
                // console.log(`目标为空`);
            }
        }

    }

    public hasTarget(enemy: EnemyBear) {
        return this._targetMonsters.indexOf(enemy) !== -1;
    }
}