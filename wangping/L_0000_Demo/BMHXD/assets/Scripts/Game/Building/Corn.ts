import { _decorator, Component, instantiate, Node, Prefab, Vec3, tween, Tween } from 'cc';
import { HealthComponent } from '../Components/HealthComponent';
import { ComponentEvent } from '../../common/ComponentEvents';
import { ObjectType } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { PickupComponent } from '../Components/PickupComponent';
import { DropItemCom } from '../Drop/DropItemCom';
import { Hero, WeaponType } from '../Role/Hero';
const { ccclass, property } = _decorator;

@ccclass('Corn')
export class Corn extends Component {
    @property({type: Node, displayName: '玉米粒层'})
    public cornKernelLayer: Node = null!;

    @property({type: HealthComponent, displayName: '血量组件'})
    public healthComponent: HealthComponent = null!;

    @property({type: Node, displayName: '玉米粒预制'})
    public cornPrefab: Node = null!;

    @property({displayName: '重新生长时间(秒)', min: 1, max: 60})
    public regrowTime: number = 5;

    @property({type: Node, displayName: '攻击点'})
    public attackPoint: Node = null!;

    private cornList: Node[] = [];
    private originalScale: Vec3 = new Vec3(); // 记录原始缩放值

    onLoad() {
        // 记录原始缩放值
        this.originalScale.set(this.node.scale);
        
        this._initCorn();
        // this.healthComponent.initHealth();

        this.node.on(ComponentEvent.HURT, this.onHurt, this);

        // this.schedule(() => {
        //     this.dropCorn();
        // }, 0.1);
    }

    update(deltaTime: number) {
        
    }

    private async _initCorn() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 12; j++) {
                const corn = instantiate(this.cornPrefab);
                corn.active = true;
                corn.setParent(this.cornKernelLayer);
                corn.setPosition(0, i * 0.15 - 0.6, 0);
                corn.setRotationFromEuler(0, j * 30, 0);
                this.cornList.push(corn);
                await new Promise(resolve => this.scheduleOnce(resolve));
            }
        }
    }

    onHurt(damageData: DamageData) {
        // console.log('onHurt', damageData);
        const source = damageData.damageSource;

        // 受击缩放效果
        this.playHitEffect();


        const hero = source.getComponent(Hero);
        if (hero){
            if (hero.weaponType === WeaponType.BigShovel) {
                this.schedule(()=>{
                    this.dropCorn(source.getWorldPosition().add(new Vec3(0, 1.5, 0)), source);
                }, 0.05, 4);
            } else {
                this.schedule(()=>{
                    this.dropCorn(source.getWorldPosition().add(new Vec3(0, 1.5, 0)), source);
                }, 0.05, 1);
            }
        }else{
            this.schedule(()=>{
                this.dropCorn(source.getWorldPosition().add(new Vec3(0, 1.5, 0)), source);
            }, 0.05, 1);
        }
    }

    /**
     * 播放受击缩放效果
     */
    private playHitEffect() {
        // 停止之前的缩放动画
        tween(this.node).stop();
        
        // 基于原始缩放的受击效果：先缩小再恢复
        const hitScale = this.originalScale.clone().multiplyScalar(0.95); // 缩小到80%
        
        tween(this.node)
            .to(0.05, { scale: hitScale }) // 0.1秒缩小到80%
            .to(0.08, { scale: this.originalScale }) // 0.15秒恢复到原始大小
            .start();
    }

    dropCorn(sourcePosition: Vec3, source: Node) {
        let closestCorn: Node = null;
        let closestDistance = Infinity;
        let dropPos: Vec3 = null;

        // 如果有伤害来源位置，找到离它最近的激活玉米
        if (sourcePosition) {
            for (let corn of this.cornList) {
                if (corn.active) {
                    const cornWorldPos = corn.getChildByName('dropPos').getWorldPosition();
                    const distance = Vec3.distance(cornWorldPos, sourcePosition);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestCorn = corn;
                    }
                }
            }
        }

        // 掉落最近的玉米
        if (closestCorn) {
            closestCorn.active = false;
            Tween.stopAllByTarget(closestCorn);
            dropPos = closestCorn.getChildByName('dropPos').getWorldPosition();
            
            // 检查攻击来源是否为喷火器
            let dropItemType = ObjectType.DropItemCornKernel; // 默认掉落玉米粒
            const hero = source.getComponent(Hero);
            if (hero && hero.weaponType === WeaponType.FireGun) {
                dropItemType = ObjectType.DropItemCornSoup; // 喷火器攻击掉落汤
            }
            
            const item = manager.drop.spawnItem(dropItemType, dropPos, false);
            const pickupComponent = source.getComponent(PickupComponent);
            if(pickupComponent){
                pickupComponent.pickupItem(item);
            }
            
            // 启动重新生长定时器
            this.scheduleOnce(() => {
                this.regrowCorn(closestCorn);
            }, this.regrowTime);
        }
    }

    /**
     * 重新生长玉米
     * @param corn 要重新生长的玉米节点
     */
    private regrowCorn(corn: Node) {
        if (corn && !corn.active) {
            corn.active = true;
            // 添加生长动画效果
            corn.setScale(0, 0, 0);
            tween(corn)
                .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                .start();
        }
    }

    public get cornCount(): number {
        return this.cornList.filter(corn => corn.active).length;
    }

    public getAttackPoint(): Vec3 {
        return this.attackPoint.getWorldPosition();
    }
}