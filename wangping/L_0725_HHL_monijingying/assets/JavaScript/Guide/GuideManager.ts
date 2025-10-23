import { _decorator, Component, Node, Vec3 } from 'cc';
import { EntityTypeEnum, EventName, GuideType } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import Player from '../Player/Player';
import DropController from '../Map/DropController';
import { Monster } from '../Monster/Monster';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager extends Component {

    private _guideType:GuideType = GuideType.NoGuide;
    private _targetPos:Vec3 = null;
    private _targetPos2:Vec3 = new Vec3();
    private _targetNode:Node = null;
    private _targetMonster:Monster = null;

    private _monsterYOffest:number = 14;

    private _guideTime:number = 0;
    private _guideInterval:number = 0.5;

    start() {

    }

    update(dt: number) {
        if(this._guideTime>this._guideInterval){
            this.checkGuide();
            this._guideTime = 0;
        }
        this._guideTime += dt;
    }

    public checkGuide(){
        if(!DataManager.Instance.isGameStart){
            return;
        }
        if(DataManager.Instance.isGameEnd){
            //游戏结束
            if(this._guideType!== GuideType.NoGuide){
                this._guideType = GuideType.NoGuide;
                this.hideGuide();
            }
            return;
        }
        const playerNode:Node = DataManager.Instance.player;
        if(!playerNode){
            return;
        }
        const player:Player = playerNode.getComponent(Player);
        if(!player){
            return;
        }

        const unlockedPartnerNum:number = DataManager.Instance.partnerController.getUnlockedNum();

        //激活农民<3
        if(unlockedPartnerNum<3){
            const playerCornNum:number = player.getItemNumByType(EntityTypeEnum.Corn);
            const nextUnlockPartnerIndex:number = DataManager.Instance.partnerController.getNextNeedUnlockIndex();
            const nextPartnerNeedCornNum:number = DataManager.Instance.partnerController.getNeedNumByIndex(nextUnlockPartnerIndex);

            //玉米够解锁农民，引导解锁农民
            if(nextUnlockPartnerIndex!=-1 && playerCornNum>=nextPartnerNeedCornNum&&nextPartnerNeedCornNum>0){
                this._guideType = GuideType.UnlockPartner;
                this._targetPos = DataManager.Instance.partnerController.getPartnerPosByIndex(nextUnlockPartnerIndex);
                this._targetPos2.set(this._targetPos);
                this._targetPos2.y+=12.3;
                this.showGuide();
                return;
            }
            
            
            const groundCornNum:number = DataManager.Instance.cornController.getGroundCornNum();
            const startCornNum:number = DataManager.Instance.cornController.getStartCornNum();
            //不够，初始玉米还有，引导捡玉米
            if(startCornNum>0){
                if(this._guideType!== GuideType.PickStartCorn||!this._targetNode||!this._targetNode.isValid||!this._targetNode.active){
                    this._guideType = GuideType.PickStartCorn;
                    this._targetNode = DataManager.Instance.cornController.getStartCornNearestNode(playerNode.position);
                    this._targetPos = this._targetNode.position.clone();
                    this._targetPos2.set(this._targetPos);
                    this.showGuide();
                }
                return;
            }
            //不够，地上+身上够，引导捡玉米
            if(groundCornNum+playerCornNum>=nextPartnerNeedCornNum){
                this._targetPos = DataManager.Instance.cornController.getGuideGroundCornPos();
                this._targetPos2.set(this._targetPos);
                this._targetPos.y = 0;
                if(this._guideType!== GuideType.PickCorn){
                    this._guideType = GuideType.PickCorn;
                    this.showGuide();
                }else{
                    this.showGuide(false);
                }
                return;
            }
            //引导攻击玉米
            if(this._guideType!== GuideType.AttackCorn){
                this._guideType = GuideType.AttackCorn;
                this._targetPos = DataManager.Instance.cornController.wholeCorn.getWorldPosition().clone();
                this._targetPos2.set(this._targetPos);
                this._targetPos.y = 0;
                this._targetPos2.y = 20;
                this.showGuide();
            }
            return;
        }

        const playerCoinNum:number = player.getItemNumByType(EntityTypeEnum.Coin);
        const wallAllUnlock:boolean = DataManager.Instance.wallController.isWallAllUnlocked();
        if(wallAllUnlock){
            const nextUpgradeTurretIndex:number = DataManager.Instance.turretController.getNextUpgradeTurretIndex();
            const nextUpgradNeedCoinNum:number = DataManager.Instance.turretController.getNeedNumByIndex(nextUpgradeTurretIndex,false);
            //升级炮塔,金币够
            if(nextUpgradeTurretIndex!=-1 && playerCoinNum>=nextUpgradNeedCoinNum){
                this._guideType = GuideType.UpgradeTurret;
                this._targetPos = DataManager.Instance.turretController.getDeliverPosByIndex(nextUpgradeTurretIndex,false);
                this._targetPos2.set(this._targetPos);
                this.showGuide();
                return;
            }
        }
        
        const nextwallIndex:number = DataManager.Instance.wallController.getNextUnlockWallIndex();
        const nextTurretIndex:number = DataManager.Instance.turretController.getNextUnlockTurretIndex();
        if((nextTurretIndex-1)<=nextwallIndex&&nextTurretIndex!=-1){
            const nextTurretNeedCoinNum:number = DataManager.Instance.turretController.getNeedNumByIndex(nextTurretIndex);
            //解锁炮塔
            if(nextTurretNeedCoinNum<=playerCoinNum){
                this._guideType = GuideType.UnlockTurret;
                this._targetPos = DataManager.Instance.turretController.getDeliverPosByIndex(nextTurretIndex);
                this._targetPos2.set(this._targetPos);
                this.showGuide();
                return;
            }
        }

        //解锁墙
        const nextWallNeedCoinNum:number = DataManager.Instance.wallController.getNeedNumByIndex(nextwallIndex);
        if(nextwallIndex!=-1 && nextWallNeedCoinNum<=playerCoinNum){
            this._guideType = GuideType.UnlockWall;
            this._targetPos = DataManager.Instance.wallController.getDeliverPosByIndex(nextwallIndex);
            this._targetPos2.set(this._targetPos);
            this.showGuide();
            return;
        }


        


        
        // const playerGrassNum:number = player.getItemNumByType(EntityTypeEnum.Grass);
        // const nextwallIndex:number = DataManager.Instance.wallController.getNextUnlockWallIndex();
        // const nextWallNeedGrassNum:number = DataManager.Instance.wallController.getNeedNumByIndex(nextwallIndex);
        // //有没解锁的篱笆，草板够，解锁篱笆
        // if(nextwallIndex!=-1 && playerGrassNum>=nextWallNeedGrassNum){
        //     this._guideType = GuideType.UnlockWall;
        //     this._targetPos = DataManager.Instance.wallController.getDeliverPosByIndex(nextwallIndex);
        //     this._targetPos2.set(this._targetPos);
        //     this._targetPos.y = 0;
        //     this.showGuide();
        //     return;
        // }

        // const groundGrassNum:number = DataManager.Instance.grassController.getGroundGrassNum();
        // //地上草板+身上草板够解锁，拾取草板
        // if(nextwallIndex!==-1 && (playerGrassNum+groundGrassNum)>= nextWallNeedGrassNum){
        //     if(this._guideType!== GuideType.PickGrass){
        //         this._guideType = GuideType.PickGrass;
        //         this._targetPos = DataManager.Instance.grassController.getGroundGrassPos();
        //         this._targetPos2.set(this._targetPos);
        //         this.showGuide();
        //     }
        //     return;
        // }

        // const playerCoinNum:number = player.getItemNumByType(EntityTypeEnum.Coin);
        // if(DataManager.Instance.unlockLawnMowerCost<=0){
        //     //割草机已解锁
        //     //金币够，引导玩家提交金币给割草机
        //     if(playerCoinNum>0){
        //         if(this._guideType!== GuideType.DeliverCoin){
        //             this._guideType = GuideType.DeliverCoin;
        //             this._targetPos = DataManager.Instance.mapController.deliverLawnArea.getWorldPosition().clone();
        //             this._targetPos2.set(this._targetPos);
        //             this.showGuide();
        //         }
        //         return;
        //     }
        // }else{
        //     //割草机未解锁
        //     //金币够，引导交付金币解锁割草机
        //     if(playerCoinNum>=DataManager.Instance.unlockLawnMowerCost){
        //         if(this._guideType!== GuideType.UnlockLawnMower){
        //             this._guideType = GuideType.UnlockLawnMower;
        //             this._targetPos = DataManager.Instance.mapController.unlockLawnMowerArea.getWorldPosition().clone();
        //             this._targetPos2.set(this._targetPos);
        //             this.showGuide();
        //         }
        //         return;
        //     }
        // }


        const groundCoinNum:number = DropController.Instance.getDropNum();
        //地上有金币，引导玩家拾取金币
        if(groundCoinNum>0){
            if(this._guideType!== GuideType.PickCoin||!this._targetNode||!this._targetNode.isValid||!this._targetNode.active||!Vec3.equals(this._targetNode.worldPosition,this._targetPos)){
                this._guideType = GuideType.PickCoin;
                this._targetNode = DropController.Instance.getNearestDropNode(playerNode.position);
                this._targetPos = this._targetNode.position.clone();
                this._targetPos2.set(this._targetPos);
                this.showGuide();
            }
            
            return;
        }

        if(!this._targetMonster||!this._targetMonster.isAlive()){
            this._targetMonster = DataManager.Instance.monsterController.getFirstMonster();
            
            //有蜘蛛，引导玩家攻击蜘蛛
            if(this._targetMonster){
                const monsterPos:Vec3 = this._targetMonster.node.worldPosition;
                this._guideType = GuideType.AttackMonster;
                this._targetPos = monsterPos.clone();
                this._targetPos2.set(this._targetPos);
                this._targetPos2.y+=this._monsterYOffest;
                this.showGuide();
                return;
            }
        }else{
            const monsterPos:Vec3 = this._targetMonster.node.worldPosition;
            this._guideType = GuideType.AttackMonster;
            this._targetPos = monsterPos.clone();
            this._targetPos2.set(this._targetPos);
            this._targetPos2.y+=this._monsterYOffest;
            this.showGuide(false);
            return;
        }
        

        
            
        
        //啥也不满足
        if(this._guideType!== GuideType.NoGuide){
            this._guideType = GuideType.NoGuide;
            this.hideGuide();
        }
    }

    private showGuide(changeTarget:boolean = true){
        EventManager.inst.emit(EventName.ArrowTargetVectorUpdate,{pos:this._targetPos2,changeTarget:changeTarget});
        EventManager.inst.emit(EventName.ArrowPathCreate,this._targetPos);
    }

    private hideGuide(){
        EventManager.inst.emit(EventName.ArrowTargetVectorUpdate);
        EventManager.inst.emit(EventName.ArrowPathRemove);
    }
}


