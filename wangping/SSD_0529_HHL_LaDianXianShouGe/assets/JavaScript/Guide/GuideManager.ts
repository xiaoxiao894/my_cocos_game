import { _decorator, Component, Node, Vec3 } from 'cc';
import { EventName, GuideType } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { PlugItem } from '../Repo/PlugItem';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager extends Component {

    @property(Node)
    handNode:Node = null;

    @property(Node)
    hand1:Node = null;

    @property(Node)
    hand2:Node = null;

    @property(Node)
    pickPlugGuideNode:Node = null;

    @property(Node)
    plugInGuideNode:Node = null;

    private _woodNum:number = 10;
    private _deliverNum:number = 10;
    private _treeNum:number = 5;

    private _guideType:GuideType = GuideType.NoGuide;
    private _targetPos:Vec3 = null;
    private _targetWood:Node = null;

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
        if(DataManager.Instance.isGameOver){
            //游戏结束
            if(this._guideType!== GuideType.NoGuide){
                this._guideType = GuideType.NoGuide;
                this.hideGuide();
            }
            return;
        }

        let plugState:number = DataManager.Instance.plugNode.getComponent(PlugItem).state;
        //插插头
        if(plugState === 1 && DataManager.Instance.ropeTrees.size>=this._treeNum){
            if(this._guideType!== GuideType.PlugIn){
                this._guideType = GuideType.PlugIn;
                this._targetPos = this.plugInGuideNode.worldPosition.clone();
                
                this.showGuide();
            }
            return;
        }

        const playerWoodNum:number = DataManager.Instance.playerWoodNum;
        let needNum:number = DataManager.Instance.towerWoodNum >= DataManager.Instance.upgradeSecondWoodNum ? DataManager.Instance.upgradeThirdWoodNum : DataManager.Instance.upgradeSecondWoodNum;
        // 交付
        if(playerWoodNum>0){
            
            if(DataManager.Instance.inDeliverArea){
                if(this._guideType!==GuideType.NoGuide){
                    this._guideType = GuideType.NoGuide;
                    this.hideGuide();
                }
                return;
            }else if(playerWoodNum>=this._deliverNum||(playerWoodNum+DataManager.Instance.towerWoodNum)>= needNum){
                if(this._guideType!== GuideType.DeliverWood){
                    this._guideType = GuideType.DeliverWood;
                    this._targetPos = DataManager.Instance.sceneManger.deliverWoodPosNode.worldPosition.clone();
                    this.showGuide();
                }
                return;
            }
        }

        // 拾取
        const groundWoodNum:number = DataManager.Instance.treeManger.getWoodNum();
        let canUpgrade:boolean = false;
        let nowHaveWoodNum:number = playerWoodNum + groundWoodNum + DataManager.Instance.towerWoodNum;
        if(nowHaveWoodNum >= needNum && (playerWoodNum+DataManager.Instance.towerWoodNum)< needNum){
            canUpgrade = true;
        }
        if(playerWoodNum<this._woodNum&&(groundWoodNum>=10||canUpgrade)){
            this._guideType = GuideType.PickWood;
            if(!this._targetWood || this._targetWood.active === false || this._targetWood.parent !== DataManager.Instance.treeManger.woodParent){
                this.checkPickWood();
                this._targetPos = this._targetWood.getWorldPosition().clone();
                this.showGuide();
            }
            return;
        }

        //圈地
        if(plugState === 1){
            if(this._guideType!== GuideType.CircleTree){
                this._guideType = GuideType.CircleTree;
                this.showGuide();
            }
            return;
        }
        //拿插头
        if(plugState === 0){
            if(this._guideType!== GuideType.PickPlug){
                this._guideType = GuideType.PickPlug;
                this._targetPos = this.pickPlugGuideNode.worldPosition.clone();
                this.showGuide();
            }
            return;
        }

        //啥也不满足
        if(this._guideType!== GuideType.NoGuide){
            this._guideType = GuideType.NoGuide;
            this.hideGuide();
        }
    }

    private showGuide(){
        if(this._guideType !== GuideType.CircleTree){
            this.handNode.active = false;
            EventManager.inst.emit(EventName.ArrowTargetVectorUpdate,this._targetPos);
            EventManager.inst.emit(EventName.ArrowPathCreate,this._targetPos);
        }else{
            this.handNode.active = true;
            if(DataManager.Instance.wireLen === DataManager.Instance.wireSecendLen){
                this.hand1.active = false;
                this.hand2.active = true;
            }else{
                this.hand1.active = true;
                this.hand2.active = false;
            }
            EventManager.inst.emit(EventName.ArrowTargetVectorUpdate);
            EventManager.inst.emit(EventName.ArrowPathRemove);
        }

        if(this._guideType!== GuideType.PickWood){
            this._targetWood = null;
        }
    }

    private hideGuide(){
        this._targetWood = null;
        this.handNode.active = false;
        EventManager.inst.emit(EventName.ArrowTargetVectorUpdate);
        EventManager.inst.emit(EventName.ArrowPathRemove);
    }

    /** 检测最近的木头 */
    private checkPickWood() {
        let latestWood:Node;
        const center = DataManager.Instance.player.getWorldPosition().clone();
        let woods = DataManager.Instance.treeManger.woodParent.children;
        let minDistance = Number.MAX_SAFE_INTEGER;
        if(woods.length>0){
            for (let i = 0; i < woods.length; i++) {
                const wood = woods[i];
                const woodPos = wood.getWorldPosition();
                const distanceSquare = Vec3.squaredDistance(center, woodPos);
                if (distanceSquare < minDistance) {
                    minDistance = distanceSquare;
                    latestWood = wood;
                }
            }
        }
        this._targetWood = latestWood;
    }
}


