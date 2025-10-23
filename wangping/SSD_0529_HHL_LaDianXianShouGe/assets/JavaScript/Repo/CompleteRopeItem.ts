import { _decorator, CCString, Component, instantiate, Material, MeshRenderer, Node, ParticleSystem, Vec3 } from 'cc';
import { RopeGeneratorNew } from './RopeGeneratorNew';
import { RopeBatch } from './RopeBatch';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
import { PlugItem } from './PlugItem';
import { DataManager } from '../Global/DataManager';
import { SoundManager } from '../Common/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('CompleteRopeItem')
export class CompleteRopeItem extends Component {

    @property(Node)
    ropeNode:Node = null;

    @property(Node)
    ropeParent:Node = null;

    @property(Material)
    ropeMaterials:Material[] = [];

    @property(Node)
    electricity:Node = null;

    @property({type:CCString,tooltip:"通电音效名字"})
    powerUpsSoundName:string = "YX_tongdian";



    /** 状态 0未连接 1连接中 2已连接 */
    private _state:number = 0;

    private _ropeLen:number = 20;

    private _rope:RopeGeneratorNew = null;

    private headNode:Node = null;
    private endNode:Node = null;


    public set state(value:number) {
        this._state = value;
    }

    public get state() {
        return this._state;
    }
    
    public init(startNode:Node,endNode:Node){
        this._state = 0;
        this.headNode = startNode;
        this.endNode = endNode;
        this.creatRope();
        
    }

    private creatRope():void{
        DataManager.Instance.ropeParentNode = this.ropeParent;
        this.ropeNode.children[0].active = true;
        this.ropeNode.children[1].active = false;
        this.ropeNode.children[2].active = false;
        this.ropeNode.children[3].active = false;
        let ropeNode = instantiate(this.ropeNode);
        ropeNode.active = true;
        ropeNode.parent = this.ropeParent;
        ropeNode.getComponent(RopeGeneratorNew).createRope(this._ropeLen,this.headNode,this.endNode.children[0]);
        this._rope=ropeNode.getComponent(RopeGeneratorNew);

    }

    private _reopIndex:number = 0;
    private _powerOver:boolean = false;

    /** 通电效果 */
    public ropePowerOn():void{
        this._state = 2;
        this._powerOver = false;
        this._reopIndex = this.ropeParent.children.length-1;
        this._rope.ropeEnd();
        this.schedule(this.ropeChangeColor,0.001);
        SoundManager.inst.playAudio(this.powerUpsSoundName);
    }

    private ropeChangeColor(){
        for(let i=0;i<5;i++){
            if(this._reopIndex <0){
                if(!this._powerOver){
                    this._powerOver = true;
                    EventManager.inst.emit(EventName.PlugPowerOver);
                    this._rope.removeAllPoint();
                    this.unschedule(this.ropeChangeColor);
                    this.scheduleOnce(()=>{
                        EventManager.inst.emit(EventName.PeoPleCanMove);
                        EventManager.inst.emit(EventName.ElectricityHide);
                        this.resetRope();
                    },1.7);
                    this._rope.removeHalfRope();
                }
                return;
            }
            let node = this.ropeParent.children[this._reopIndex];
            if(node){
                node.children[0].active = false;
                node.children[1].active = true;

                if(this._reopIndex%3 === 0){
                    node.children[3].active = true;
                }
                
            }
            this._reopIndex--;
        }
        
    }

    /** 重建绳子 */
    public resetRope():void{
        this._rope.clearRope();

        //插头回到原位
        this.endNode.setParent(DataManager.Instance.ropeManager.plugParentNode);
        this.endNode.setPosition(0, 0, 0);
        this.endNode.eulerAngles = new Vec3(-90,90,0);
        this.endNode.getComponent(PlugItem).state = 0;
        this.endNode.getComponent(PlugItem).plugAni.node.setPosition(0, 0, 0);
        this.scheduleOnce(this.creatRope,0.2);
        
        DataManager.Instance.usedLen = 0;
    }

    public flashRed(){
        this.flashChangeColor(2);
        this.scheduleOnce(()=>{
            this.flashChangeColor(0);
        },0.5);
    }

    private flashChangeColor(index:number){
        for(let i =0;i<this.ropeParent.children.length;i++){
            let node = this.ropeParent.children[i];
            if(node){
                node.children[index].active = true;
                node.children[2-index].active = false;
            }
        }
    }

}


