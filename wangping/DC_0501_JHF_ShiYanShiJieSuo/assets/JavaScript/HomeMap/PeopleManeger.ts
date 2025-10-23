import { _decorator, Component, math, Node, tween, Vec3 } from "cc";
import ItemPool from "../Common/ItemPool";
import { EntityTypeEnum } from "../Enum/Index";
import { DataManager } from "../Global/DataManager";
import { MathUtil } from "../Utils/MathUtil";
import { PeopleItem } from "./Items/PeopleItem";
import { SoundManager } from "../Common/SoundManager";
const { ccclass, property } = _decorator;

@ccclass('PeopleManeger')
export default class PeopleManeger extends Component {

    @property(Node)
    peopleParent: Node = null; //人父节点

    @property(Node)
    honorEffectNode: Node = null; //勋章特效节点

    private _startX: number = 30; //人开始位置X
    private _intervalX: number = 6; //间隔X
    private _groupIntervalX: number = 8; //组间隔X
    private _moveX: number = 32; //移动X
    private _middleGroup: Node[] = []; //中间组
    private _leaveGroup: Node[] = []; //离开组
    private _prepareGroup: Node[] = []; //准备组

    private _giveHonorNum: number = 0; //给勋章数量
    private _giveHonorIndex: number = 0;

    private _moving: boolean = false;

    //人缓存池
    private _peoplePool: ItemPool = null;

    private _medicineCount: number = 0;

    start() {
        DataManager.Instance.PeopleManeger = this;
    }

    public init(): void {
        this._medicineCount = 0;
        this._moving = false;
        this._peoplePool = new ItemPool(EntityTypeEnum.People); //人池
        for (let i = 0; i < 8; i++) {
            if (i % 4 == 0) {
                DataManager.Instance.randomSeed = MathUtil.shuffleArray(DataManager.Instance.randomSeed);
            }
            let peopleItem: Node = this._peoplePool.getItem();
            peopleItem.setParent(this.peopleParent);
            let posX: number = this._startX + i * this._intervalX + this._groupIntervalX * Math.floor(i / 4); //人位置X
            let pos = new Vec3(posX, 0, 0);
            peopleItem.setPosition(pos);
            if (i < 4) {
                this._middleGroup.push(peopleItem); //中间组
            } else {
                this._prepareGroup.push(peopleItem); //准备组
            }
        }

        //setTimeout(() => {
            this._moving = true;
            this.middleGroupMoveIn();
            this.prepareGroupMoveIn();
        //}, 1500);
    }

    private _changeTimeOuter;
    private _aniTimeOuter;

    private _canGiveHonor: boolean = false;

    protected update(dt: number): void {
        if(this._giveHonorNum>=20){
            this._canGiveHonor = true;
        }
        if(!this._canGiveHonor){
            return;
        }
        if (this._giveHonorNum > 0) {
            this.giveHonor();
            if (this._giveHonorNum == 0) {
                this._canGiveHonor = false;
                this._moving = true;
                clearTimeout(this._changeTimeOuter);
                clearTimeout(this._aniTimeOuter);
                this._changeTimeOuter = setTimeout(() => {
                    this.middleReadyLeave();
                }, 300);
                this._aniTimeOuter = setTimeout(() => {
                    this.changeGroup(); //换组
                }, 900);
            }

        }
    }

    //中间组移动到中间位置
    private middleGroupMoveIn(): void {

        for (let i = 0; i < this._middleGroup.length; i++) {
            let peopleItem: Node = this._middleGroup[i];
            let item: PeopleItem = peopleItem.getComponent(PeopleItem);
            if (item) {
                item.startWalk();
            }
            tween(peopleItem).by(2.5, { position: new Vec3(-this._moveX, 0, 0) }).call(() => {
                if (item) {
                    item.readyRecieve();
                }
                this._moving = false;
            }).start(); //移动到中间位置
        }
    }

    //准备组移动到准备位置
    private prepareGroupMoveIn(): void {
        for (let i = 0; i < this._prepareGroup.length; i++) {
            let peopleItem: Node = this._prepareGroup[i];
            tween(peopleItem).by(2.5, { position: new Vec3(-this._moveX, 0, 0) }).call(() => {
                let item: PeopleItem = peopleItem.getComponent(PeopleItem);
                if (item) {
                    item.walkEnd();
                }
            }).start(); //移动到准备位置
        }
    }

    //离开组离开
    private leaveGroupMoveOut(): void {
        for (let i = 0; i < this._leaveGroup.length; i++) {
            let peopleItem: Node = this._leaveGroup[i];
            tween(peopleItem).by(8, { position: new Vec3(-this._moveX*3, 0, 20) }).call(() => {
                this._peoplePool.putItem(peopleItem); //放入缓存池
            }).start(); //移动到准备位置
        }
        this._leaveGroup = []; //清空离开组
    }

    //交付药剂
    public playerDeliverMedicine(num: number): void {
        //中间组动画，然后增加+勋章 换组
        //this._giveHonorNum += num;
    }

    public addMedicine() {
        if(this._medicineCount>=20){
            return;
        }
        let index:number = 0;
        index = Math.floor(this._medicineCount /5);
        index = Math.min(index, 3);
        let item: PeopleItem = this._middleGroup[index].getComponent(PeopleItem);
        if (item) {
            item.addMedicine();
        }
        this._medicineCount++;
        this._giveHonorNum += 1;
    }

    private _newHonorNum = 0;
    //给勋章
    private giveHonor(): void {
        let pos: Vec3 = this._middleGroup[this._giveHonorIndex].getWorldPosition().clone();
        let item: PeopleItem = this._middleGroup[this._giveHonorIndex].getComponent(PeopleItem);
        if (item) {
            pos = item.getRealWorldPos(); //获取中间组人的位置
        }

        this._giveHonorIndex++;
        if (this._giveHonorIndex >= this._middleGroup.length) {
            this._giveHonorIndex = 0;
        }


        let targetPos: Vec3 = DataManager.Instance.HonorManeger.getNewHonorWorldPos(this._newHonorNum); //获取勋章位置
        this._newHonorNum++;
        const centerPosX = (pos.x + targetPos.x) / 2;
        const centerPosY = 20;
        const centerPosZ = (pos.z + targetPos.z) / 2;
        const controlPoint = new Vec3(centerPosX, centerPosY, centerPosZ)
        let honor: Node = DataManager.Instance.HonorManeger.getHonorNode();
        honor.setParent(this.honorEffectNode); //设置父节点

        tween(honor)
            .to(0.3, { position: targetPos }, {
                easing: `cubicInOut`,
                onUpdate: (target, ratio) => {
                    const targetNode = target as Node;
                    const position = MathUtil.bezierCurve(pos, controlPoint, targetPos, ratio)

                    targetNode.worldPosition = position;
                }
            })
            .call(() => {
                this._newHonorNum--;
                DataManager.Instance.HonorManeger.addHonor(honor); //增加勋章
                SoundManager.inst.playAudio("DC_jiaofu");
            })
            .start();
        this._giveHonorNum--;
    }

    private middleReadyLeave() {
        for (let node of this._middleGroup) {
            let item: PeopleItem = node.getComponent(PeopleItem);
            if (item) {
                item.readyLeave();
            }
        }
    }

    //换组
    private changeGroup(): void {
        this._medicineCount = 0;
        this._leaveGroup = [...this._middleGroup]; //离开组=中间组
        this._middleGroup = [...this._prepareGroup]; //中间组=准备组
        this._prepareGroup = []; //准备组=空
        DataManager.Instance.randomSeed = MathUtil.shuffleArray(DataManager.Instance.randomSeed);
        for (let i = 0; i < 4; i++) {
            let peopleItem: Node = this._peoplePool.getItem();
            peopleItem.setParent(this.peopleParent);
            let posX: number = this._startX + (i + 4) * this._intervalX + this._groupIntervalX; //人位置X
            let pos = new Vec3(posX, 0, 0);
            peopleItem.setPosition(pos);
            this._prepareGroup.push(peopleItem); //准备组
        }
        this.leaveGroupMoveOut(); //离开组移动到离开位置
        this.middleGroupMoveIn(); //中间组移动到中间位置
        this.prepareGroupMoveIn(); //准备组移动到准备位置


    }

    //获取中间组人的位置
    public getPeoplesPos(): Vec3[] {

        let pos: Vec3[] = [];
        if (this._moving||this.getNeedHonorNum()==0) {
            return pos;
        }
        for (let i = 0; i < this._middleGroup.length; i++) {
            let peopleItem: Node = this._middleGroup[i];
            let people: PeopleItem = peopleItem.getComponent(PeopleItem);
            pos.push(people.getRealWorldPos()); //获取中间组人的位置
        }
        return pos;
    }

    public getStartIndex(){
        return this._medicineCount%4;
    }

    public getNeedHonorNum():number {
        return Math.max(20-this._medicineCount,0);
    }



}