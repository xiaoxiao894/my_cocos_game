import {_decorator, Component } from "cc";
import { PillarItem } from "./PillarItem";
import { DataManager } from "../Global/DataManager";



const { ccclass, property } = _decorator;

@ccclass('PillarComponent')
export default class PillarManager extends Component {

    @property(PillarItem)
    pillars:PillarItem[]=[];

    private _activeIndex:number = 0;
    private _deliveringNum:number = 0;


    protected start(): void {
        DataManager.Instance.pillarManager = this;
        this.pillars.forEach((item)=>{
            DataManager.Instance.guideTargetList.push(item.node);
        });
        //直接激活第一个
        this.scheduleOnce(()=>{
            this.pillars[this._activeIndex].pillarActive();
        },0);
        
    }

    public deliverItem(){
        if(this._activeIndex>=this.pillars.length){
            return;
        }
        this._deliveringNum++;
        this.scheduleOnce(()=>{
            this.pillars[this._activeIndex].itemAdd();
            if(this.pillars[this._activeIndex].isUnlocked()){
                this._activeIndex++;
                if(this.pillars[this._activeIndex]){
                    this.pillars[this._activeIndex].pillarActive();
                }
            }
            this._deliveringNum--;
        },0.2);
    }

    public deliverNeedNum():number{

        return this.pillars[this._activeIndex].getLeftNeedNum()+this._deliveringNum;
    }

}

