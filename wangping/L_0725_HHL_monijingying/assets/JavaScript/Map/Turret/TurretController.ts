import { _decorator,  Component, Vec3 } from 'cc';
import { DataManager } from '../../Global/DataManager';
import { Turret } from './Turret';
import { TurretArea } from './TurretArea';
import GameUtils from '../../Util/GameUtils';
import { EventManager } from '../../Global/EventManager';
import { EventName } from '../../Common/Enum';
import { SoundManager } from '../../Global/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('TurretController')
export class TurretController extends Component {

    @property(Turret)
    turrets: Turret[] = [];

    @property(TurretArea)
    unlockAreas: TurretArea[] = [];

    @property(TurretArea)
    upgradeAreas: TurretArea[] = [];

    private _unlockShowed:boolean = false;

    protected onEnable(): void {
        EventManager.inst.on(EventName.UnlockFirstPartner,this.turretUnlockShow,this);
        EventManager.inst.on(EventName.AllWallUnlock,this.turretUpgradeShow,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.UnlockFirstPartner,this.turretUnlockShow,this);
        EventManager.inst.off(EventName.AllWallUnlock,this.turretUpgradeShow,this);
    }

    start() {
        DataManager.Instance.turretController = this;
        this.init();
    }

    /** 隐藏所有炮塔和地贴 */
    private init():void{
        this.turrets.forEach(turret => {
            turret.node.active = false;
        });
        this.unlockAreas.forEach(area => {
            area.node.active = false;
        });
        this.upgradeAreas.forEach(area => {
            area.node.active = false;
        });
    }

    /** 解锁还需要多少金币 */
    public getNeedNumByIndex(index:number,unlock:boolean = true):number{
        let area = this.unlockAreas[index];
        if(!unlock){
            area = this.upgradeAreas[index];
        }
        if(area){
            const needNum = area.leftNeedNum;
            return needNum;
        }
        return 0;
    }



    /** 提交金币 */
    public addCoinByIndex(index:number,unlock:boolean = true){
        let area = this.unlockAreas[index];
        if(!unlock){
            area = this.upgradeAreas[index];
        }
        if(area){
            if(area.deliverCoin()){
                //金币够了
                if(unlock){
                    GameUtils.showAni(this.turrets[index].node);
                    this.turrets[index].init();
                    this.checkWallAreaShow(index);
                    EventManager.inst.emit(EventName.TurretDataUpdate);
                }else{
                    this.turrets[index].upgrade();
                }
                SoundManager.inst.playAudio("jiesuo");
            }
        }
    }

    //检查墙地贴是否该出现
    private checkWallAreaShow(index:number):void{
        if(this.turrets[(index+5-1)%5].node.active){
            EventManager.inst.emit(EventName.ShowWallArea,(index+5-1)%5);
        }
        if(this.turrets[(index+5+1)%5].node.active){
            EventManager.inst.emit(EventName.ShowWallArea,index);
        }
    }

    /** 所有炮台待解锁阶段 */
    private turretUnlockShow():void{
        if(this._unlockShowed){
            return;
        }
        this._unlockShowed = true;
        this.unlockAreas.forEach(area => {
                area.node.active = true;
                GameUtils.showNodeAni(area.node);
        });
    }

    /** 所有炮台升级阶段 */
    private turretUpgradeShow():void{
       this.upgradeAreas.forEach(area => {
            area.node.active = true;
            GameUtils.showNodeAni(area.node);
       });
    }

    public getDeliverPosByIndex(index:number,unlock:boolean = true):Vec3{
        let area = this.unlockAreas[index];
        if(!unlock){
            area = this.upgradeAreas[index];
        }
        if(area){
            return area.node.worldPosition.clone();
        }
        return null;
    }

    public isTurretUnlockedByIndex(index:number):boolean{
        const area = this.unlockAreas[index];
        if(area){
            return area.leftNeedNum <= 0;
        }
        return false;
    }

    /** 获取下一个待解锁的炮塔 */
    public getNextUnlockTurretIndex():number{
        for(let i = 0;i<this.unlockAreas.length;i++){
            if(this.unlockAreas[i].leftNeedNum > 0){
                return i;
            }
        }
        return -1;
    }

    /** 获取下一个待升级的炮塔 */
    public getNextUpgradeTurretIndex():number{
        for(let i = 0;i<this.upgradeAreas.length;i++){
            if(this.upgradeAreas[i].leftNeedNum > 0){
                return i;
            }
        }
        return -1;
    }

    public isAllTurretUpgraded():boolean{
        for(let i = 0;i<this.turrets.length;i++){
            if(this.turrets[i].level < 2){
                return false;
            }
        }
        return true;
    }

    public getUnlockedTurretNum():number{
        let count = 0;
        for(let i = 0;i<this.turrets.length;i++){
            if(this.isTurretUnlockedByIndex(i)){
                count++;
            }
        }
        return count;
    }

}