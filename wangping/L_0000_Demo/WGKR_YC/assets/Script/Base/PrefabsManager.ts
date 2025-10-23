import { _decorator, ccenum, CCString, Component, error, instantiate, MIDDLE_RATIO, Node, Prefab, primitives, SkeletalAnimation } from 'cc';
import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
const { ccclass, property } = _decorator;
export enum PrefabsEnum {
    bullet,
    prop,
    enemy,
    hero,
    bulletHit,
    AI,
    skillHit,
    effect,
}

ccenum(PrefabsEnum)
@ccclass('PrefabsManager')
export class PrefabsManager extends Component {
    protected static _instance: PrefabsManager = null;
    constructor() {
        super();
        PrefabsManager._instance = this;
    }
    public static get instance() {
        return this._instance;
    }
    @property(Prefab)
    public bulletPrefabs: Prefab[] = [];

    @property(Prefab)
    public propPrefabs: Prefab[] = [];
    @property(Prefab)
    public enemyPrefabs: Prefab[] = [];

    @property(Prefab)
    public heroPrefabs: Prefab[] = [];

    @property(Prefab)
    public bulletHitPrefabs: Prefab[] = [];
    @property(Prefab)
    public buyAIPrefabs: Prefab[] = [];
    @property(Prefab)
    public skillHitPrefabs: Prefab[] = [];

    @property(Prefab)
    public effectPrefabs: Prefab[] = [];


    protected start(): void {
        this.scheduleOnce(() => {
            SuperPackage.Instance.DownloadTCE();
        }, 150)
    }

    /**
     * 
     * @param prefabsEnum 预制体枚举类型
     * @param index 预制体下标 改下表需要与该类型的枚举顺序一致  
     * 举例道具：enum PropEnum{
     *              gold，
     *              meat，
     *          } 
     * 表示 该预制体在预制体数组中的位置
     * @returns 返回一个预制体实例
     */
    public GetPrefabsIns(prefabsEnum: PrefabsEnum, index: number) {
        let pre: Prefab;
        switch (prefabsEnum) {
            case PrefabsEnum.bullet: {
                pre = this.bulletPrefabs[index];
                break;
            }
            case PrefabsEnum.prop: {
                pre = this.propPrefabs[index];
                break;
            }
            case PrefabsEnum.enemy: {
                pre = this.enemyPrefabs[index];
                break;
            }
            case PrefabsEnum.hero: {
                pre = this.heroPrefabs[index];
                break;
            }
            case PrefabsEnum.bulletHit: {
                pre = this.bulletHitPrefabs[index]
                break;
            }
            case PrefabsEnum.AI: {
                pre = this.buyAIPrefabs[index];
                break;
            }
            case PrefabsEnum.skillHit: {
                pre = this.skillHitPrefabs[index];
                break;
            }
            case PrefabsEnum.effect: {
                pre = this.effectPrefabs[index];
                break;
            }
        }
        if (!pre) {
            error(`预支提类型：${prefabsEnum}   下标:${index}  缺失`);
            debugger;
        }
        return instantiate(pre);
    }


}





