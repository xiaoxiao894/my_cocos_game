import { _decorator,  AnimationComponent,  CCFloat, CCString, Collider,  Component,  CylinderCollider,  ICollisionEvent,  ITriggerEvent, Material, math, MeshRenderer, Node, RigidBody, SkeletalAnimation, tween, UITransform, v3, Vec3 } from 'cc';

import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, EventName, StateDefine } from '../Common/Enum';
import { MathUtil } from '../Utils/MathUtils';
import { PlugItem } from '../Repo/PlugItem';
import GridPathController from './GridPathController';
import { EventManager } from '../Global/EventManager';
import { PlayerTip } from './PlayerTip';
import { SoundManager } from '../Common/SoundManager';
const { ccclass, property } = _decorator;

let tempVelocity: Vec3 = v3();

@ccclass('Actor')
export class Actor extends Component {

    @property(Node)
    playerNode:Node = null;

    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    @property(CCFloat)
    linearSpeed: number = 100.0;

    @property(Collider)
    collider: Collider = null;

    @property(RigidBody)
    rigidbody: RigidBody = null;

    //背包
    @property(Node)
    backpack: Node = null;

    @property(Node)
    plugParent:Node = null;

    @property(PlayerTip)
    playerTip:PlayerTip = null;

    @property(Material)
    mats:Material[] = [];

    @property(MeshRenderer)
    meshRenderer:MeshRenderer = null;

    @property({type:CCString,tooltip:"交付木头音效名字"})
    deliverWoodSoundName:string = "YX_jinbi";


    private _plugInMoving:boolean = false;
    private _liftMoving:boolean = false;

    //当前状态
    currState = null;

    //行进方向
    destForward: Vec3 = v3();

    //动画方向
    aniForward: Vec3 = v3();


    // 移动倍率
    private runRate = 4;

    // 控制木头收集的变量
    private _woodCollectCooldown = 0;
    private _woodCollectInterval = 0.03;

    //是否在交付木头区域
    private _isDeliverWoodArea = false;


    //移动动画速度
    private _playerAniMoveTime:number = 0.3;

    // 镜头移回人身上
    private _lookBackTimer;

    protected start(): void {
        DataManager.Instance.player = this.playerNode;
        
        this.skeletalAnimation.play(StateDefine.Idle);
        this.currState = StateDefine.Idle;
        this.updatePlayerTip();
        let startPos = this.playerNode.getWorldPosition().clone();
        let treePos = DataManager.Instance.bigTreePos.clone();
        treePos.y -= 2;
        this.playerNode.setWorldPosition(treePos);
        this.scheduleOnce(()=>{
            this.playerNode.setWorldPosition(startPos);
        },0.5);
    }

    

    protected onEnable(): void {
        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider?.on("onTriggerExit", this.onTriggerExit, this);
        EventManager.inst.on(EventName.PeoPleCanMove, this.peopleCanMove, this);
    }

    protected onDisable(): void {
        this.collider?.off("onTriggerEnter", this.onTriggerEnter, this);
        this.collider?.off("onTriggerExit", this.onTriggerExit, this);
        EventManager.inst.off(EventName.PeoPleCanMove, this.peopleCanMove, this);
    }

    onTriggerEnter(event: ITriggerEvent) {
        const selfCollider = event.selfCollider;
        const otherCollider = event.otherCollider;
        
        if(otherCollider.node.name == EntityTypeEnum.PlugGetArea ){
            //如果插头还没回到原地
            let plugNode = DataManager.Instance.plugNode;
            if(plugNode.getComponent(PlugItem).state!== 0){
                return;
            }
            if(this.currState == StateDefine.Idle || this.currState == StateDefine.Run){
                GridPathController.instance.cleanPath();
                // 碰到插头 举起
                this.liftPlug();
            }
        }else if (otherCollider.node.name == EntityTypeEnum.PlugInArea) {
            if(this.currState ===StateDefine.LiftIdle||this.currState ===StateDefine.LiftRun || this.currState ===StateDefine.LiftNoPull){
                //插上插头
                this.plugIn();
            }
        }else if(otherCollider.node.name === EntityTypeEnum.DeliverWoodArea){
            //交付木头
            this._isDeliverWoodArea = true;
            
        }else if(otherCollider.node.name === EntityTypeEnum.PlayerHideNode){
            if(DataManager.Instance.bigTreeAlive){
                EventManager.inst.emit(EventName.XrayEffect);
                this.meshRenderer.setSharedMaterial(this.mats[2],0);
                this.meshRenderer.setSharedMaterial(this.mats[3],1);
            }
            
        }
    }


    onTriggerExit(event: ITriggerEvent) {
        const otherCollider = event.otherCollider;
        const selfCollider = event.selfCollider;
        if (otherCollider.node.name === EntityTypeEnum.DeliverWoodArea) {
            this._isDeliverWoodArea = false;
        }else if(otherCollider.node.name === EntityTypeEnum.PlayerHideNode){
            EventManager.inst.emit(EventName.XrayEffectOver);
            this.meshRenderer.setSharedMaterial(this.mats[0],0);
            this.meshRenderer.setSharedMaterial(this.mats[1],1);
        }

    }

    /** 举起插头 */
    private liftPlug(){
        if(this.currState == StateDefine.Idle || this.currState == StateDefine.Run){
            // 走到固定位置
            DataManager.Instance.playerCanMove = false;
            this._liftMoving = true;
            this.scheduleOnce(()=>{
                //开始举起
                EventManager.inst.emit(EventName.HideRopeLenChangeTip);
                this._liftMoving = false;
                this.changeState(StateDefine.Lift);
                
                let plugNode = DataManager.Instance.plugNode;
                let oldPos:Vec3 = plugNode.worldPosition.clone();
                plugNode.setParent(this.plugParent);
                let plug:PlugItem = plugNode.getComponent(PlugItem);
                if(plug){
                    plug.state = 1;
                    plug.playLiftAni(oldPos);
                }
                this.skeletalAnimation.once(AnimationComponent.EventType.FINISHED,this.liftPlugOver,this);
                console.log("举起插头位置",this.playerNode.worldPosition.toString());
            },this._playerAniMoveTime);
        }
    }

    /** 举起结束 */
    private liftPlugOver(){
        this.changeState(StateDefine.LiftIdle);
        DataManager.Instance.playerCanMove = true;
        this.updatePlayerTip();
        this.scheduleOnce(()=>{
            this.playerTip.showTip();
        })

    }

    /** 插上插头 */
    private plugIn(){
        // 走到固定位置
        DataManager.Instance.playerCanMove = false;
        this._plugInMoving = true;
        this.scheduleOnce(()=>{
            //开始插插头
            this._plugInMoving = false;
            this.changeState(StateDefine.LinkPlug);
            
            this.skeletalAnimation.once(AnimationComponent.EventType.FINISHED,this.PlugInOver,this);
            let plugNode = DataManager.Instance.plugNode;
            if(plugNode){
                let plug:PlugItem = plugNode.getComponent(PlugItem);
                if(plug){
                    plug.playPlugInAni();
                }
            }
            DataManager.Instance.mainCamera.moveToTree();
            this.scheduleOnce(()=>{
                //圈住的树爆出木材，绳子缩回
                EventManager.inst.emit(EventName.PlugInOver);
                //隐藏提示
                this.playerTip.hideTip();
            },0.76);
            console.log("插上插头位置",this.playerNode.worldPosition.toString());
        },this._playerAniMoveTime);
        
        
    }

    /**  插插座结束 */
    private PlugInOver(){
        DataManager.Instance.playerCanMove = true;
        this.changeState(StateDefine.Idle);
        
    }

    /** 踉跄结束 */
    private liftNoPullOver(){
        this.changeState(StateDefine.LiftIdle);
        DataManager.Instance.playerCanMove = true;
    }

    private peopleCanMove(){
        DataManager.Instance.playerCanMove = true;
    }


    changeState(state: StateDefine | string) {
        if (this.currState == state) {
            return;
        }

        if (this.currState == StateDefine.Run || this.currState == StateDefine.LiftRun ) {
            this.stopMove();
            SoundManager.inst.stopRunBGM();
        }

        if(state == StateDefine.Run || state == StateDefine.LiftRun  ){
            SoundManager.inst.playRunBGM();
        }



        this.skeletalAnimation?.crossFade(state as string, 0.1);
        // 更改状态
        this.currState = state;
    }

    update(dt: number) {
        
        let len = 0;
        if(!DataManager.Instance.playerCanMove){
            len = this.handleAni();
        }else{
            len = this.handleInput();
        }

        
        if (len > 0.1) {
            
            if (this.currState ===StateDefine.Idle ||this.currState ===StateDefine.Run) {
                this.changeState(StateDefine.Run);
            } else if(this.currState === StateDefine.LiftRun || this.currState === StateDefine.LiftIdle){
                this.changeState(StateDefine.LiftRun);
            }
            if(this._plugInMoving||this._liftMoving){
                let a = MathUtil.signAngle(this.playerNode.forward, this.aniForward, Vec3.UP);
                let absA = Math.abs(a);
                //console.log("absa",absA);
                let speed = 0;
                if (absA > 1.8) {
                    // 大角度，允许最大速度
                    speed = 30;
                }else if(absA>1.6){
                    speed = (absA-1.3)*60;
                }
                 else if (absA > 0.01) {
                    // 小角度，非线性递减
                    speed = absA * absA;
                    //console.log("absa speed",speed.toString());
                } else {
                    speed = 0;
                }
                let as = v3(0, Math.sign(a) * speed, 0);
                this.rigidbody.setAngularVelocity(as);
                //console.log("as", as.toString());
            }else{
                let a = MathUtil.signAngle(this.playerNode.forward, this.destForward, Vec3.UP);
                let as = v3(0, a * 20, 0);
                this.rigidbody.setAngularVelocity(as);
            }
            
        } else {
            if (this.currState === StateDefine.Run ||this.currState === StateDefine.Idle) {
                this.changeState(StateDefine.Idle);
            } else if (this.currState === StateDefine.LiftRun || this.currState === StateDefine.LiftIdle) {
                this.changeState(StateDefine.LiftIdle);
            }
            if(this._plugInMoving||this._liftMoving){
                this.stopMove();
            }
        }

        

        switch (this.currState) {
            case StateDefine.Run:
            case StateDefine.LiftRun:
                this.doMove();
                break;
            case StateDefine.LiftNoPull:
                this.updatePlayerTip();
                break;
        }

        //检测周围的木头
        this.checkPickWood();

        //交付木头
        this.deliveryWoodAni(dt);

    }


    /** 检测周围木头 */
    private checkPickWood() {
        const radiusSquare = 3*3;
        const center = this.playerNode.getWorldPosition().clone();
        let woods = DataManager.Instance.treeManger.woodParent.children;
        if(woods.length>0){
            for (let i = 0; i < woods.length; i++) {
                const wood = woods[i];
                const woodPos = wood.getWorldPosition();
                const distanceSquare = Vec3.squaredDistance(center, woodPos);
                if (distanceSquare < radiusSquare) {
                    //捡起木头
                     // 获取组件
                    const woodRigidbody = wood.getComponent(RigidBody);
                    const woodCollider = wood.getComponent(CylinderCollider);
                    woodCollider.enabled = false;
                    woodRigidbody.enabled = false;
                    this.collectWoodAni(wood);
                }
            }
        }
    }
    

    handleInput(): number {
        if (!DataManager.Instance.joyStick || DataManager.Instance.joyStick.input.length() == 0) return;

        const camera = DataManager.Instance.mainCamera.node;

        const { x, y } = DataManager.Instance.joyStick.input;

        const input = new Vec3(-x, 0, y);
        if (input.length() === 0) return;

        // === 相机方向对齐移动 ===
        const cameraForward = camera.forward.clone();
        cameraForward.y = 0;
        cameraForward.normalize();

        const cameraRight = new Vec3();
        Vec3.cross(cameraRight, Vec3.UP, cameraForward);

        const moveDir = new Vec3();
        Vec3.scaleAndAdd(moveDir, moveDir, cameraForward, input.z);
        Vec3.scaleAndAdd(moveDir, moveDir, cameraRight, input.x);
        moveDir.normalize();

        this.destForward.set(moveDir);
        //console.log("movedir",moveDir.toString());
        return moveDir.length();
    }

    handleAni(): number {
        let targetNode = null;
        if(this._plugInMoving){
            targetNode = DataManager.Instance.sceneManger.plugInPosNode;
        }else if(this._liftMoving){
            targetNode = DataManager.Instance.sceneManger.liftPlugPosNode;
        }else{
            return 0;
        }
        let dis = Vec3.distance(this.playerNode.position, targetNode.position);
        let dotNum:number = Vec3.dot(this.playerNode.forward,targetNode.forward);
        if(dis<0.1&&dotNum>0.9){
            return 0;
        }


        let moveDir = targetNode.worldPosition.clone().subtract(this.playerNode.worldPosition.clone());
        moveDir.y = 0;
        if(Vec3.squaredDistance(moveDir,Vec3.ZERO)>1){
            moveDir.normalize();
        }
        this.destForward.set(moveDir);

        let aniForward = new Vec3();
        Vec3.subtract(aniForward, targetNode.forward.clone(), this.playerNode.forward.clone());
        aniForward.y = 0;
        aniForward.normalize();
        this.aniForward.set(aniForward);
        return moveDir.length();
    }


    doMove() {
        if(this.currState == StateDefine.LiftRun){
            //更新剩余米数
            let leftLen = this.updatePlayerTip();
            if(leftLen<=0){
                //判断方向
                let destNormalize = this.destForward.clone().normalize();
                let dot = Vec3.dot(destNormalize,DataManager.Instance.wireDir);
                const disSquare:number = Vec3.squaredDistance(this.playerNode.worldPosition,DataManager.Instance.sceneManger.plugInPosNode.worldPosition);
                if(dot > 0 && disSquare>2){
                    this.changeState(StateDefine.LiftNoPull);
                    this.skeletalAnimation.once(AnimationComponent.EventType.FINISHED,this.liftNoPullOver,this);
                    let plugNode = DataManager.Instance.plugNode;
                    if(plugNode){
                        let plug:PlugItem = plugNode.getComponent(PlugItem);
                        if(plug){
                            plug.playPlugFailAni();
                        }
                    }
                    DataManager.Instance.ropeManager.flashRed();
                    SoundManager.inst.playAudio("zhuaibudong_"+Math.floor(Math.random()*2));
                    SoundManager.inst.playAudio("jinggao");
                    return;
                }
                
            }
        }
        
        
        let speed = this.linearSpeed * this.destForward.length() * this.runRate;
        
        if(this._plugInMoving||this._liftMoving){
            tempVelocity.x = math.clamp(this.destForward.x, -1, 1) * speed;
            tempVelocity.z = math.clamp(this.destForward.z, -1, 1) * speed;
        }else{
            tempVelocity.x = math.clamp(this.playerNode.forward.x, -1, 1) * speed;
            tempVelocity.z = math.clamp(this.playerNode.forward.z, -1, 1) * speed;
        }
        this.rigidbody?.setLinearVelocity(tempVelocity);
        if(this.currState == StateDefine.LiftRun||this.currState == StateDefine.Run){
            //记录网格坐标
            GridPathController.instance.updatePath(this.playerNode.worldPosition.clone());
            
        }
    }

    stopMove() {
        this.rigidbody?.setLinearVelocity(Vec3.ZERO);
    }

    private updatePlayerTip():number{
        let pos:Vec3 = this.playerNode.getWorldPosition().clone();
        pos.y+=4;
        this.playerTip.node.setWorldPosition(pos);
        let leftLen:number = DataManager.Instance.wireLen-DataManager.Instance.usedLen;
        this.playerTip.setNum(leftLen);
        return leftLen;
    }



    // 交付木头动画
    deliveryWoodAni(dt) {
        if(!this._isDeliverWoodArea){
            return;
        }

        this._woodCollectCooldown -= dt;
        if (this._woodCollectCooldown > 0) return;
        if(this.backpack.children.length === 0||DataManager.Instance.towerWoodNum>= DataManager.Instance.upgradeThirdWoodNum){
            return; 
        }
        const deliverWorldPos = DataManager.Instance.woodEndNode.getWorldPosition().clone();
        this.deliveryAni(deliverWorldPos);

        this._woodCollectCooldown = this._woodCollectInterval;
        SoundManager.inst.playAudio(this.deliverWoodSoundName);
        
        DataManager.Instance.mainCamera.lookAtTower();
    }

    // 交付动画
    deliveryAni( deliverWorldPos) {
        clearTimeout(this._lookBackTimer);
        this.woodCount--;
        const node = this.backpack.children[this.backpack.children.length - 1];
        let worldPos: Vec3 = node.getWorldPosition().clone();
        node.parent = DataManager.Instance.sceneManger.effectNode;
        node.setWorldPosition(worldPos);

        const nodeWorldPos = node.position;
        let controlPoint = null;
        controlPoint = new Vec3(
            (nodeWorldPos.x + deliverWorldPos.x) / 2,
            (nodeWorldPos.y + deliverWorldPos.y) / 2+10,
            (nodeWorldPos.z + deliverWorldPos.z) / 2
        );

        tween(node)
            .to(0.3, {
                position: deliverWorldPos,
                scale: new Vec3(1, 1, 1)
            }, {
                easing: `cubicInOut`,
                onUpdate: (target, ratio) => {
                    const targetNode = target as Node;
                    const position = MathUtil.bezierCurve(nodeWorldPos, controlPoint, deliverWorldPos, ratio);
                    targetNode.worldPosition = position;
                }
            })
            .call(() => {
                DataManager.Instance.treeManger.putWood(node);
                DataManager.Instance.addTowerWoodNum();
                DataManager.Instance.playerWoodNum = this.backpack.children.length;
                clearTimeout(this._lookBackTimer);
                this._lookBackTimer = setTimeout(()=>{
                    DataManager.Instance.mainCamera.towerLookBack();
                },100);
            })
            .start();
    }


    // 收集木头动画
    private woodCount = 0;
    private collectWoodAni(wood: Node) {

        if (this.backpack.children.indexOf(wood) >= 0 ) {
            console.warn("木头已被其他背包收集，跳过动画");
            return;
        }

        this.woodCount++;
        const woodWorldPos = wood.worldPosition.clone();

        wood.setParent(DataManager.Instance.sceneManger.effectNode);

        

        const originalScale = wood.scale.clone();
        const shrunkenScale = originalScale.clone().multiplyScalar(0.9);
        SoundManager.inst.playAudio("shoujimutou");
        tween(wood)
            .to(0.3, { scale: shrunkenScale })
            .start();

        tween(wood)
            .to(0.3, {}, {
                easing: `cubicInOut`,
                onUpdate: (_, ratio) => {
                    const worldPos = this.backpack.worldPosition.clone();
                    worldPos.y += (this.woodCount-1) * DataManager.Instance.WoodHeight;
                    const controlPoint = new Vec3(
                        (woodWorldPos.x + worldPos.x) / 2,
                        Math.max(woodWorldPos.y, worldPos.y) + 10,
                        (woodWorldPos.z + worldPos.z) / 2
                    );

                    const pos = MathUtil.bezierCurve(woodWorldPos, controlPoint, worldPos, ratio);
                    wood.setWorldPosition(pos);
                }
            })
            .call(() => {
                wood.setParent(this.backpack);
                wood.setRotationFromEuler(0, 0, 90);

                // 重新排列当前背包中的所有木头
                const children = this.backpack.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].setPosition(new Vec3(0, i * DataManager.Instance.WoodHeight, 0));
                }

                tween(wood)
                    .to(0.1, { scale: originalScale })
                    .start();

                DataManager.Instance.playerWoodNum = this.backpack.children.length;
            })
            .start();
    }


}

