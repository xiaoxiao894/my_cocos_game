import { _decorator, CCInteger, Component, Material, MeshRenderer, Node,Animation, AnimationComponent, Vec3, CCString, tween } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
import { SoundManager } from '../Common/SoundManager';
import { MathUtil } from '../Utils/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('PlugItem')
export class PlugItem extends Component {

    @property(Material)
    plugMaterials: Material[] = [];

    @property(MeshRenderer)
    meshRenderer:MeshRenderer = null;

    @property(Animation)
    plugAni: Animation = null;

    @property(Node)
    electricity:Node = null;

    @property({type:CCString,tooltip:"举起插头音效名字"})
    plugLiftSoundName:string = "YX_xuanqu";

    /** 状态 0未连接 1连接中 2已连接 */
    private _state:number = 0;

    public set state(value:number) {
        this._state = value;
        //同步设置连接的电线
        DataManager.Instance.ropeManager.setRopeState( value);
        //通知插头状态有变化
        EventManager.inst.emit(EventName.PlugStateUpdate,value);
    }

    public get state() {
        return this._state;
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.XrayEffect, this.onXrayEffect, this);
        EventManager.inst.on(EventName.XrayEffectOver, this.onXrayEffectOver, this);
        EventManager.inst.on(EventName.ElectricityHide,this.hideElectricity,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.XrayEffect, this.onXrayEffect, this);
        EventManager.inst.off(EventName.XrayEffectOver, this.onXrayEffectOver, this);
        EventManager.inst.off(EventName.ElectricityHide,this.hideElectricity,this);
    }

    protected start(): void {
        this.electricity.active = false;
    }

    /** x光开始 */
    private onXrayEffect() {
        this.meshRenderer.setMaterial(this.plugMaterials[2],0);
        this.meshRenderer.setMaterial(this.plugMaterials[3],1);
    }

    /** x光结束 */
    private onXrayEffectOver() {
        this.meshRenderer.setMaterial(this.plugMaterials[0],0);
        this.meshRenderer.setMaterial(this.plugMaterials[1],1);
    }

    /** 播放举起动画 */
    public playLiftAni(startWorldPos:Vec3){
        console.log("举插头动画");
        
        SoundManager.inst.playAudio(this.plugLiftSoundName);

        //插头举起动画
        this.plugAni.node.setWorldPosition(startWorldPos);
        tween(this.plugAni.node)
        .delay(0.333)
        .to(0.333,{position:new Vec3(0,-2,0)})
        .start();

    }

    /** 播放插入插头动画 */
    public playPlugInAni(){
        console.log("插头插入动画");
        let pos1 = MathUtil.localToWorldPos3D(new Vec3(0,0,2.216),DataManager.Instance.sceneManger.socketNode);
        let pos2 = MathUtil.localToWorldPos3D(new Vec3(0,0,1.13),DataManager.Instance.sceneManger.socketNode);
        tween(this.plugAni.node)
        .to(0.366,{worldPosition:pos1})
        .delay(0.066)
        .to(0.26,{worldPosition:pos2})
        .call(()=>{
            this.node.setParent(DataManager.Instance.sceneManger.socketNode);
            this.node.setPosition(0, 0, 1.13);
            this.node.eulerAngles = new Vec3(-90,0,0);
            this.plugAni.node.setPosition(0, 0, 0);
            this.electricity.active = true;
        })
        .start();
    }

    /** 播放拉不动动画 */
    public playPlugFailAni(){
        console.log("插头拉不动动画");
        this.plugAni.play("chatou_zhuai");
        this.plugAni.once(AnimationComponent.EventType.FINISHED,()=>{
            this.plugAni.node.setPosition(0, 0, 0);
        },this);
    }

    private hideElectricity(){
        this.electricity.active = false;
    }

}


