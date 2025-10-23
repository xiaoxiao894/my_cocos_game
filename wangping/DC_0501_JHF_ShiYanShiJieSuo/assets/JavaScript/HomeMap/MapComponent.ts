import { _decorator, BoxCollider, Collider, Color, Component, instantiate, ITriggerEvent, Label, Node, Sprite, Animation, Vec3, director, tween } from 'cc';
import { DataManager } from '../Global/DataManager';
import { CollisionZoneEnum, EntityTypeEnum, EventNames, UnlockType } from '../Enum/Index';
import HonorManager from './HonorManeger';
import { UnlockItem } from './Items/UnlockItem';
import { GuideItem } from '../Common/DataTypes';
import { EventManager } from '../Global/EventManager';
import { SoundManager } from '../Common/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('MapComponent')
export class MapComponent extends Component {

    // 交互节点
    @property(Node)
    interactionNode: Node = null;

    // 拿钱区域
    @property(Node)
    getMoneyArea: Node = null;

    @property(BoxCollider)
    getHonorCollider: BoxCollider = null; //获取荣誉区域

    @property(Node)
    honorParent: Node = null; //荣誉父节点

    @property(Sprite)
    getHonorGreen: Sprite = null;

    //帮手一
    @property(UnlockItem)
    helper1Area: UnlockItem = null;

    //帮手二
    @property(UnlockItem)
    helper2Area: UnlockItem = null;

    @property(UnlockItem)
    unlockTileArea: UnlockItem = null; //解锁地块

    //解锁帮手动画
    @property(Animation)
    unlockAni: Animation = null;

    @property(Animation)
    endLevelAni: Animation = null;

    @property(Node)
    nextArea: Node = null;

    @property(Node)
    nextAreaFence: Node = null;

    @property(Node)
    effectNode: Node = null;

    //药剂交付节点
    @property(Collider)
    deliverMedicineArea: Collider = null;




    private _helper1Show: boolean = false; //帮助1是否显示
    private _helper2Show: boolean = false; //帮助2是否显示


    start() {
        DataManager.Instance.HomeMap = this;
        this.nextArea.active = false;
        this.nextAreaFence.active = true;
        this.unlockAni.node.active = false;
        this.endLevelAni.node.active = false;
        this._helper1Show = false;
        this._helper2Show = false;
        this.helper1Area.node.active = false; //帮手1地块
        this.helper2Area.node.active = false; //帮手2地块
        this.unlockTileArea.node.active = false; //解锁地块
        this.initGuide();

        HonorManager.Instance.init(this.honorParent); //初始化荣誉
    }

    protected onEnable(): void {
        this.getHonorCollider.on('onTriggerEnter', this.onHonorTriggerEnter, this);
        this.getHonorCollider.on('onTriggerExit', this.onHonorTriggerExit, this);
    }

    protected onDisable(): void {
        this.getHonorCollider.off('onTriggerEnter', this.onHonorTriggerEnter, this);
        this.getHonorCollider.off('onTriggerExit', this.onHonorTriggerExit, this);
    }

    private loadTile(type: EntityTypeEnum) {
        const prefab = DataManager.Instance.prefabMap.get(type);
        const map = instantiate(prefab);
        map.setParent(this.node);
    }

    update(deltaTime: number) {

    }

    private onHonorTriggerEnter(event: ITriggerEvent) {
        if (!this._helper1Show) {
            this._helper1Show = true;
            //显示解锁帮手1地块
            this.helper1Area.init(UnlockType.Helper1, DataManager.Instance.Helper1NeedNum);
            this.helper1Area.node.active = true;
            DataManager.Instance.isUnlockPlotOne = true;
            //增加帮手一引导
            let helper1: GuideItem = {
                pos: this.helper1Area.node.getWorldPosition().clone(),
                type: CollisionZoneEnum.Helper1Area,
                order: 6,
                honor: DataManager.Instance.Helper1NeedNum
            }
            DataManager.Instance.guide.push(helper1);
        }
        this.getHonorGreen.color = new Color().fromHEX("#00fc1e");
    }

    private onHonorTriggerExit(e: ITriggerEvent) {
        this.getHonorGreen.color = new Color().fromHEX("#ffffff");
    }

    /** 帮手1解锁时，显示帮手2地块 */
    public onHelper1Unlocke() {
        this.playUnlockAni(this.helper1Area.node.getWorldPosition().clone());
        DataManager.Instance.generateRobotsController.createWithdrawMoneyRobot();
        this.helper1Area.node.active = false;
        DataManager.Instance.isUnlockPlotOne = false;
        SoundManager.inst.playAudio("DC_jiaofu");
        if (!this._helper2Show) {
            this._helper2Show = true;
            //显示解锁帮手2地块
            this.helper2Area.init(UnlockType.Helper2, DataManager.Instance.Helper2NeedNum);
            this.helper2Area.node.active = true;
            DataManager.Instance.isUnlockPlotTwo = true;
            //增加帮手二引导
            let helper2: GuideItem = {
                pos: this.helper2Area.node.getWorldPosition().clone(),
                type: CollisionZoneEnum.Helper2Area,
                order: 7,
                honor: DataManager.Instance.Helper2NeedNum
            }
            DataManager.Instance.guide.push(helper2);

            this.scheduleOnce(() => {
                // 获取所有需排序的节点（通过Tag或自定义逻辑）
                const sprites = director.getScene().getComponentsInChildren('SpriteComponent');

                // 按Z轴排序
                sprites.sort((a, b) => a.node.position.z - b.node.position.z);
            }, 0.1);
        }
        //显示待解锁地块
        setTimeout(() => {
            this.showUnlockTile();
        }, 5000);

        //去掉帮手一的引导
        this.removeGuideByType(CollisionZoneEnum.Helper1Area);
    }

    private removeGuideByType(type: CollisionZoneEnum): void {
        const len: number = DataManager.Instance.guide.length;
        for (let i = 0; i < len; i++) {
            let item = DataManager.Instance.guide[i];
            if (item.type === type) {
                DataManager.Instance.guide.splice(i, 1);
                break;
            }
        }
    }

    public onHelper2Unlocke() {
        this.playUnlockAni(this.helper2Area.node.getWorldPosition().clone());
        this.helper2Area.node.active = false;
        DataManager.Instance.generateRobotsController.createCollectingMedicationRobot();
        SoundManager.inst.playAudio("DC_jiaofu");
        //去掉帮手二的引导
        this.removeGuideByType(CollisionZoneEnum.Helper2Area);
        DataManager.Instance.isUnlockPlotTwo = false;
    }

    private playUnlockAni(pos: Vec3) {
        if (this.unlockAni) {
            this.unlockAni.node.setWorldPosition(pos);
            this.unlockAni.node.active = true;
            this.unlockAni.play();
            this.unlockAni.once(Animation.EventType.FINISHED, () => {
                this.unlockAni.node.active = false;
            });
        }
    }

    /** 显示解锁地块 */
    private showUnlockTile() {
        if (!this.unlockTileArea.node.active) {
            this.unlockTileArea.init(UnlockType.UnlockTile, DataManager.Instance.UnlockAreaNeedNum);
            this.unlockTileArea.node.active = true;
            DataManager.Instance.isUnlockPlotThree = true;
            //增加解锁地块引导
            let unlockArea: GuideItem = {
                pos: this.unlockTileArea.node.getWorldPosition().clone(),
                type: CollisionZoneEnum.UnlockTileArea,
                order: 8,
                honor: DataManager.Instance.UnlockAreaNeedNum
            }
            DataManager.Instance.guide.push(unlockArea);
        }

    }

    /** 解锁地块 */
    public unlockTile() {

        this.unlockTileArea.node.active = false;
        this.nextAreaFence.active = false;
        this.nextArea.active = true;

        // 解锁实验室动画
        this.endLevelAni.node.active = true;
        this.endLevelAni.play();
        this.endLevelAni.once(Animation.EventType.FINISHED, () => {
            this.endLevelAni.node.active = false;
        });

        SoundManager.inst.playAudio("DC_shiyanshijiesuo");

        DataManager.Instance.effectManager.effectScene2();
        DataManager.Instance.effectManager.effectScene3();

        this.playGrowQElastic(this.nextArea);
        //摄像机移动
        DataManager.Instance.mainCamera.overGuide();
    }

    playGrowQElastic(target: Node) {
        const baseScale = new Vec3(5, 5, 5);

        target.setScale(new Vec3(0, 0, 0));

        tween(target)
            .to(0.2, { scale: baseScale.clone().multiplyScalar(1.2) }, { easing: 'quadOut' })  // 放大超出
            .to(0.15, { scale: baseScale.clone().multiplyScalar(0.95) }, { easing: 'quadIn' }) // 回弹
            .to(0.1, { scale: baseScale.clone().multiplyScalar(1.05) }, { easing: 'quadOut' }) // 轻微反弹
            .to(0.1, { scale: baseScale.clone() }, { easing: 'quadIn' })                      // 稳定
            .call(() => {
                this.scheduleOnce(() => {
                    EventManager.inst.emit(EventNames.GameEnd);
                }, 2)
            })
            .start();
    }

    private initGuide(): void {
        DataManager.Instance.guide = [];
        //取钱
        let getMoney: GuideItem = {
            pos: this.getMoneyArea.getWorldPosition().clone(),
            type: CollisionZoneEnum.GetMoneyArea,
            order: 1
        }
        DataManager.Instance.guide.push(getMoney);

        //交钱
        let giveMoney: GuideItem = {
            pos: DataManager.Instance.LaboratoryManeger.operatorNode.getWorldPosition().clone(),
            type: CollisionZoneEnum.Operator,
            order: 2
        }
        DataManager.Instance.guide.push(giveMoney);

        //取药
        let getMedicine: GuideItem = {
            pos: DataManager.Instance.LaboratoryManeger.getMedicineEndPos(),
            type: CollisionZoneEnum.MedicineGetArea,
            order: 3
        }
        DataManager.Instance.guide.push(getMedicine);

        //发药
        let giveMedicine: GuideItem = {
            pos: this.deliverMedicineArea.node.getWorldPosition().clone(),
            type: CollisionZoneEnum.DeliverMedicineArea,
            order: 4
        }
        DataManager.Instance.guide.push(giveMedicine);

        //取荣誉值
        let honor: GuideItem = {
            pos: this.getHonorCollider.node.getWorldPosition().clone(),
            type: CollisionZoneEnum.GetHonorArea,
            order: 5
        }
        DataManager.Instance.guide.push(honor);

        console.log(DataManager.Instance.guide);
    }

}


