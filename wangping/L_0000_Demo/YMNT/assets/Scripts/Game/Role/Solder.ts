import { _decorator, Label, Material, MeshRenderer, Node, UITransform, Vec3 } from 'cc';
import { Character } from './Character';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { SolderAIComponent } from '../AI/SolderAIComponent';
import { AutoHuntAIComponent } from '../AI/AutoHuntAIComponent';
import { DamageData } from '../../common/CommonInterface';
import { HealthComponent } from '../Components/HealthComponent';
import { CommonEvent, EffectType, PHY_GROUP } from '../../common/CommonEnum';

const { ccclass, property } = _decorator;

/**
 * 士兵组件 - 基于组件化设计的士兵类
 */
@ccclass('Solder')
export class Solder extends Character {
    @property({type: SolderAIComponent, displayName: '基础AI组件'})
    public aiComponent: SolderAIComponent = null!;

    @property({type: AutoHuntAIComponent, displayName: '自动追击AI组件'})
    public autoHuntAIComponent: AutoHuntAIComponent = null!;

    @property({
        displayName: '启用自动追击',
        tooltip: '是否启用自动追击敌人功能'
    })
    public enableAutoHunt: boolean = false;

    @property({
        type: MeshRenderer,
        displayName: '模型组件',
        tooltip: '士兵的模型组件'
    })
    public modelComponent: MeshRenderer = null!;

    @property({
        type: [Material],
        displayName: '材质列表',
        tooltip: '士兵的材质列表'
    })
    public materialList: Material[] = [];

    onLoad() {
        super.onLoad();

        ComponentInitializer.initComponents(this.node, {
            aiComponent: SolderAIComponent,
            autoHuntAIComponent: AutoHuntAIComponent
        }, this);

        this.randomMaterial();
    }

    protected start(): void {
        this.setupAIComponents();
    }

    /**
     * 设置AI组件
     */
    private setupAIComponents(): void {
        if (this.enableAutoHunt) {
            // 启用自动追击AI，禁用基础AI
            this.autoHuntAIComponent.setAIEnabled(true);
            this.aiComponent.enabled = false;
        } else {
            // 启用基础AI，禁用自动追击AI
            this.autoHuntAIComponent.setAIEnabled(false);
            this.aiComponent.enabled = true;
        }
    }

    /**
     * 切换AI模式
     * @param enableAutoHunt 是否启用自动追击
     */
    public switchAIMode(enableAutoHunt: boolean): void {
        this.enableAutoHunt = enableAutoHunt;
        this.setupAIComponents();
    }

    /**
     * 设置自动追击参数
     * @param searchRadius 搜索半径
     * @param huntRange 追击距离
     */
    public setAutoHuntParams(searchRadius: number, huntRange: number): void {
        if (this.autoHuntAIComponent) {
            this.autoHuntAIComponent.setSearchRadius(searchRadius);
            this.autoHuntAIComponent.setHuntRange(huntRange);
        }
    }

    onDestroy() {
        super.onDestroy();
    }

    protected onPerformAttack(damageData: DamageData): void {
        // console.log('onHeroPerformAttack', damageData);
        const target = this.GetAttackTarget();
        if(target){
            const healthComponent = target.getComponent(HealthComponent);
            if(healthComponent && !healthComponent.isDead){
                healthComponent.takeDamage(damageData);
            }
            app.audio.playEffect('resources/audio/小怪甲虫攻击');

            const pos = manager.game.calculateSolderCount(this.node.getWorldPosition().add(new Vec3(0, 0.5, 0)), target.getWorldPosition().add(new Vec3(0, 1, 0)), [PHY_GROUP.ENEMY]);
            if(pos){
                manager.effect.playEffect(EffectType.Solder_Attack, pos);
            }
        }
    }

    public GetAttackTarget(): Node | null {
        const attackComponent = this.attackComponent;
        const attackRange = attackComponent.attackRangeValue;

        const enemies = manager.enemy.getRangeEnemies(this.node.position, attackRange);
        if(enemies.length > 0){
            return enemies[0].node;            
        }
        
        return null;
    }
    
    /**
     * 搜索敌人
     */
    public searchForAttackTarget(searchRadius: number): { node: Node; squaredDistance: number }[] {
        const currentPos = this.node.getWorldPosition();
        const enemies = manager.enemy.getRangeEnemies(currentPos, searchRadius);
        // console.log('enemies', enemies.length);
        return enemies;
    }

    public reset(): void {
        super.reset();
        this.aiComponent.reset();
        this.autoHuntAIComponent.reset();
        this.switchAIMode(false);
    }

    protected onDead(): void {
        super.onDead();
        // 通知敌人管理器回收
        this.scheduleOnce(() => {
            manager.game.putSolder(this.node);
        }, 1.5);
    }

    protected onHurt(damageData: DamageData): void {
        super.onHurt(damageData);
        app.event.emit(CommonEvent.SolderHurt, damageData);
    }

    protected randomMaterial() {
        if(this.materialList.length > 0){
            const randomIndex = Math.floor(Math.random() * this.materialList.length);
            this.modelComponent.material = this.materialList[randomIndex];
        }
    }
} 