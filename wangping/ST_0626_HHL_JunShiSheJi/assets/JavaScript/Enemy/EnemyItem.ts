
import { _decorator,  CCInteger, CCString, Component, Node,  SkeletalAnimation, tween ,Animation, CCFloat, Vec3, RigidBody, ParticleSystem, Tween} from 'cc';
import { EnemyState, EventName } from '../Enum/Enum';
import { EventManager } from '../Globel/EventManager';
import { DataManager } from '../Globel/DataManager';
import { SoundManager } from '../Globel/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyItem')
export class EnemyItem extends Component {

    @property(CCInteger)
    bloodNum:number = 2240;
    @property(SkeletalAnimation)
    ani:SkeletalAnimation = null;

    @property(Node)
    attackNode:Node = null;

    @property(ParticleSystem)
    attackAni:ParticleSystem  = null;

    @property(ParticleSystem)
    attackAni2:ParticleSystem  = null;

    @property(ParticleSystem)
    attackSmoke:ParticleSystem  = null;

    @property(Node)
    neckNode:Node = null;

    @property(CCFloat)
    speed:number = 10;


    @property(CCString)
    walkAniName:string = "";
    @property(CCString)
    standAniName:string = "";
    @property(CCString)
    squatAniName:string = "";
    @property(CCString)
    deadAniName:string = "";
    @property(CCString)
    standUpAniName:string = "";
    @property(CCString)
    squatDownAniName:string = "";



    /** 状态 开始 0   行走 1   准备 2   射击 3  死亡 4 */
    private _state:number = EnemyState.Start;
    private _pathNodes:Node[] = [];

    private _attactTimeCount:number = 0;

    private _index:number = -1;
    private _pathIndex:number = 0;
    private _headShot:boolean = false;
    private _hitPos:Vec3 ;
    /** 开枪次数 */
    private _attackTimes:number = 1;
    /** 一波攻击时间间隔 */
    private _attackDuration:number = 2;

    /** 已经停止动画播放 */
    private _stoped:boolean = false;

    private _walkTween:Tween<Node>;

    public init(pathNodes:Node[],index:number,attackTimes:number=1){
        this.attackNode.active = false;
        this._stoped = false;
        this._headShot = false;
        this._hitPos = null;
        this._state = EnemyState.Start;
        this._pathNodes = pathNodes;
        this._index = index;
        this._attackTimes = attackTimes;
        this.node.setPosition(this._pathNodes[0].worldPosition.clone());
        this.node.rotation = this._pathNodes[0].rotation.clone();
        this._pathIndex = 1;
        this.walk();
        //console.log("group ",this.node.getComponent(RigidBody).getGroup());
    }

    update(deltaTime: number) {
        if(this._state == EnemyState.Attack&&!DataManager.Instance.isGameEnd){
            this._attactTimeCount += deltaTime;
            if(this._attactTimeCount >= this._attackDuration){
                this.attackOnce();
                this._attactTimeCount = 0;
            }
        }
    }

    /** 走向终点 */
    private walk(){
        if(this._pathNodes.length>this._pathIndex){
            //行走
            if(this._state!= EnemyState.Walk){
                this.ani.play(this.walkAniName);
                this._state = EnemyState.Walk;
            }
            //行走动画
            let dis = Vec3.distance(this.node.worldPosition,this._pathNodes[this._pathIndex].worldPosition);
            let time = dis/this.speed *3;
            this._walkTween = tween(this.node)
            .to(time,{worldPosition:this._pathNodes[this._pathIndex].worldPosition})
            .to(0.5,{eulerAngles:this._pathNodes[this._pathIndex].eulerAngles.clone()},{ easing: 'sineInOut' })
            .call(()=>{
                this._pathIndex++;
                this.walk();
            })
            .start();
        }else{
            //准备
            this.ready();
        }
    }


    private ready(){
        this._state = EnemyState.Ready;
        this.ani.crossFade(this.squatAniName,0.1);
        let randTime = Math.random()*2;
        this.scheduleOnce(()=>{
            if(this._state!== EnemyState.Dead&&!DataManager.Instance.isGameEnd){
                this.startAttack();
            }
            
        },randTime)
        
    }

    private startAttack(){
        this._state = EnemyState.Attack;
        this._attactTimeCount = 0;
        this.ani.play(this.standUpAniName);
        this.ani.once(Animation.EventType.FINISHED,()=>{
            if(this._state!== EnemyState.Dead){
                this.ani.play(this.standAniName);
            }
            
        });
    }

    private async attackOnce(){
        //攻击
        this.attackNode.active = true;
        if(this._attackTimes>1){
            // 音效
            SoundManager.inst.playAudio("YX_AK");
        }else{
            SoundManager.inst.playAudio("YX_AK02");
        }
        for(let i = 0; i < this._attackTimes; i++) {
            // 播放第一个粒子特效
            this.attackAni.node.active = true;
            this.attackAni.play();
            
            // 播放第二个粒子特效
            this.attackAni2.node.active = true;
            this.attackAni2.play();
            
            // 播放烟雾特效
            if(i ===0){
                this.attackSmoke.node.active = true;
                this.attackSmoke.play();
            }
            
            
            // 等待粒子播放完成
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        if(this&&this.node&&this.node.isValid){
            // 攻击结束后关闭攻击节点
            this.attackNode.active = false;
            if(this._index === 5&&!DataManager.Instance.isGameEnd){
                this._state = EnemyState.Escape;
                this.ani.play(this.squatDownAniName);
                this.ani.once(Animation.EventType.FINISHED,()=>{
                    if(this._state!== EnemyState.Dead&&!DataManager.Instance.isGameEnd){
                        this.ani.play(this.squatAniName);
                    }
                });
            }
        }
        
    }

    public dead(headShot:boolean,hitPos:Vec3){
        console.log("enemy dead");
        if(this._walkTween){
            this._walkTween.stop();
        }
        this._hitPos = hitPos;
        this._headShot = headShot;
        this._state = EnemyState.Dead;
        EventManager.inst.emit(EventName.EnemyDead,this);
        if(this._stoped){
            this.ani.play(this.deadAniName);
        }else{
            this.ani.crossFade(this.deadAniName,0.1);
        }
        
        let rigids =  this.node.getComponentsInChildren(RigidBody);
        if(rigids.length){
            rigids.forEach((rigidBody)=>{
                rigidBody.setGroup(1<<3);
            });
            
        }
        SoundManager.inst.playAudio("YX_die_nan0"+Math.ceil(Math.random()*3));
    }

    public headShot(){
        return this._headShot;
    }
    public getHitPos():Vec3{
        if(this._index ===5){
            let pos:Vec3 = this.neckNode.worldPosition.clone();
            pos.y -= 0.7;
            return pos;
        }else{
            return this._hitPos;
        }
        
    }

    public isLastOne():boolean{
        return this._index ===5;
    }

    public stopAni(){
        if(this.ani){
            this.ani.stop();
            this.ani.off(Animation.EventType.FINISHED);
        }
        if(this._walkTween){
            this._walkTween.stop();
        }
        this._stoped = true;
    }
}


