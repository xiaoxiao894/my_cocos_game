import { _decorator, Collider, Component, ITriggerEvent, Label, native, Node, Quat, Sprite, tween, Vec3 } from 'cc';
import Player  from './Player';
import { EntityTypeEnum, EventName } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
import { EntityTrigger } from '../Common/EntityTrigger';
import { NodePoolManager } from '../Common/NodePoolManager';
import { EventManager } from '../Global/EventManager';
import { SoundManager } from '../Global/SoundManager';
import { Partner } from '../Partner/Partner';
const { ccclass, property } = _decorator;

@ccclass('PlayerTrigger')
export class PlayerTrigger extends EntityTrigger {

    @property({type:Player,override:true})
    entity: Player|null = null;

    private _deliveringCornNum:number = 0;
    private _deliveringCoinNum:number = 0;

    //正则 伙伴
    private _partnerRegex = /partnerPos([0-9])/; 
    //正则 篱笆
    private _wallRegex = /weilanditu_UI-00([0-9])/; 
    //正则 解锁炮塔
    private _unlockTurretRegex = /paota_js0([0-9])/; 
    //正则 升级炮塔
    private _upgradeTurretRegex = /paota_sj0([0-9])/; 

    protected onTriggerEnter(event: ITriggerEvent) {
        super.onTriggerEnter(event);
    }

    //事件监听触发
    protected onTriggerStay(event: ITriggerEvent) {
        super.onTriggerStay(event);
        const otherNode:Node = event.otherCollider.node;
        const otherName:string = otherNode.name;
        //伙伴
        if(otherName === EntityTypeEnum.partnerNeedCorn){
            const index = otherNode.parent.getComponent(Partner).index;
            const needNum:number = DataManager.Instance.partnerController.getNeedNumByIndex(index);
            if(needNum-this._deliveringCornNum > 0){
                const node = this.entity.getItemByType(EntityTypeEnum.Corn);
                if(node){
                    this._deliveringCornNum++;
                    let endPos:Vec3 = otherNode.getWorldPosition().clone();
                    endPos.y += 5;
                    const callback = () => {
                        this._deliveringCornNum--;
                        DataManager.Instance.partnerController.addCornByIndex(index);
                    };
                    this.deliverItem(EntityTypeEnum.Corn,node,endPos,callback);
                }
            }
        }
        else if(otherName.match(this._wallRegex)){
            //解锁篱笆
            const index = parseInt(otherName.match(this._wallRegex)[1]);
            const needNum:number = DataManager.Instance.wallController.getNeedNumByIndex(index);
            if(needNum-this._deliveringCoinNum > 0){
                const node = this.entity.getItemByType(EntityTypeEnum.Coin);
                if(node){
                    this._deliveringCoinNum++;
                    let endPos:Vec3 = DataManager.Instance.wallController.getDeliverPosByIndex(index);
                    const callback = () => {
                        this._deliveringCoinNum--;
                        DataManager.Instance.wallController.addGrassByIndex(index);
                    };
                    this.deliverItem(EntityTypeEnum.Coin,node,endPos,callback);
                }
            }
        }else if(otherName.match(this._unlockTurretRegex)){
            //解锁炮塔
            const index = parseInt(otherName.match(this._unlockTurretRegex)[1])-1;
            const needNum:number = DataManager.Instance.turretController.getNeedNumByIndex(index);
            if(needNum-this._deliveringCoinNum > 0){
                const node = this.entity.getItemByType(EntityTypeEnum.Coin);
                if(node){
                    this._deliveringCoinNum++;
                    let endPos:Vec3 = otherNode.getWorldPosition().clone();
                    const callback = () => {
                        this._deliveringCoinNum--;
                        DataManager.Instance.turretController.addCoinByIndex(index);
                    };
                    this.deliverItem(EntityTypeEnum.Coin,node,endPos,callback);
                }
            }
        }else if(otherName.match(this._upgradeTurretRegex)){
            //升级炮塔
            const index = parseInt(otherName.match(this._upgradeTurretRegex)[1])-1;
            const needNum:number = DataManager.Instance.turretController.getNeedNumByIndex(index,false);
            if(needNum-this._deliveringCoinNum > 0){
                const node = this.entity.getItemByType(EntityTypeEnum.Coin);
                if(node){
                    this._deliveringCoinNum++;
                    let endPos:Vec3 = otherNode.getWorldPosition().clone();
                    const callback = () => {
                        this._deliveringCoinNum--;
                        DataManager.Instance.turretController.addCoinByIndex(index,false);
                    };
                    this.deliverItem(EntityTypeEnum.Coin,node,endPos,callback);
                }
            }
        }
        else{
            switch(otherName){
                case EntityTypeEnum.groundCornArea:
                    //伙伴堆放的玉米
                    const cornPos:Vec3 = DataManager.Instance.cornController.getGroundCorn();
                    if(cornPos){
                        this.entity.cornFly(cornPos,false);
                    }
                    break;
                // case EntityTypeEnum.groundGrassArea:
                //     //堆放的草堆
                //     const grassPos:Vec3 = DataManager.Instance.grassController.getGroundGrass();
                //     if(grassPos){
                //         let grass:Node = NodePoolManager.Instance.getNode(EntityTypeEnum.Grass);
                //         if(grass){
                //             this.entity.itemFlyToMe(grass,EntityTypeEnum.Grass,grassPos);
                //         }
                //     }
                //     break;
                // case EntityTypeEnum.UnlockLawnMowerArea:
                //     //交付金币解锁割草机
                //     if(DataManager.Instance.unlockLawnMowerCost-this._deliveringCoinNum>0){
                //         const node = this.entity.getItemByType(EntityTypeEnum.Coin);
                //         if(node){
                //             this._deliveringCoinNum++;
                //             let endPos:Vec3 = otherNode.getWorldPosition().clone();
                //             const callback = () => {
                //                 this._deliveringCoinNum--;
                //                 EventManager.inst.emit(EventName.DeliverCoinUnlockLawnMower);
                //             };
                //             this.deliverItem(EntityTypeEnum.Coin,node,endPos,callback);
                //         }
                //     }
                //     break;
                // case EntityTypeEnum.LawnMowerStartArea:
                //     //交付金币启动割草机
                //     const node = this.entity.getItemByType(EntityTypeEnum.Coin);
                //     if(node){
                //         const callback = () => {
                //             DataManager.Instance.grassController.playerDeliverCoin();
                //         };
                //         const endPos:Vec3 = DataManager.Instance.grassController.deliverNode.getWorldPosition().clone();
                //         this.deliverItem(EntityTypeEnum.Coin,node,endPos,callback);
                //     }
                //     break;
                default:
                    //console.log(`触发器${this.node.name}未处理事件${otherName}`);
                    break;
            }
        }
    }

    /** 攻击大玉米 */
    public onAttackCorn(){
        if(this._inTrigger === EntityTypeEnum.BigCorn){
            DataManager.Instance.cornController.attackCorn(this.entity.attackNode.worldPosition,true);
        }
    }

    /** 交付动画 */
    private deliverItem(type:EntityTypeEnum,item:Node,endPos:Vec3,callback:Function|null = null):void{
        let startPos:Vec3 = item.getWorldPosition().clone();
        let startRot:Quat = item.getWorldRotation().clone();
        let endRot:Quat = new Quat();
        Quat.fromEuler(endRot,0,0,0);
        item.parent = DataManager.Instance.sceneManager.effectNode;
        item.setWorldPosition(startPos);
        item.setWorldRotation(startRot);
        const control  = new Vec3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + 10,
            (startPos.z + endPos.z) / 2
        );
        const controller = { t: 0 };

        let distance = Math.abs(endPos.y - startPos.y);
        // 使用指数衰减函数，提升高处下落速度（体验更利落）
        let runTime = 1.2 * (1 - Math.exp(-distance / 50));
        // 限定时间边界
        runTime = Math.min(Math.max(runTime, 0.3), 1.0);
        tween(controller)
                .to(runTime, { t: 1 }, {
                    easing: 'quadOut',
                    onUpdate: () => {
                        const t = controller.t;
                        const oneMinusT = 1 - t;

                        const pos = new Vec3(
                            oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * control.x + t * t * endPos.x,
                            oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * control.y + t * t * endPos.y,
                            oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * control.z + t * t * endPos.z
                        );

                        item.setWorldPosition(pos);
                    }
                })
                .call(() => {
                    NodePoolManager.Instance.returnNode(item,type);
                    if(callback){
                        callback();
                    }
                })
                .start();

        //音效
        if(type === EntityTypeEnum.Coin){
            SoundManager.inst.playAudio("jinbi_jiaofu");
        }else{
            SoundManager.inst.playAudio("yumi_jiaofu");
        }
    }
}


