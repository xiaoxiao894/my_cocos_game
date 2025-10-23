import { _decorator, Component, easing, MeshRenderer, Node, Tween, tween, v3 } from 'cc';
import { HealthComponent } from '../Components/HealthComponent';
import { ComponentEvent } from '../../common/ComponentEvents';
import { DamageData } from '../../common/CommonInterface';
import { CommonEvent } from '../../common/CommonEnum';

const { ccclass, property } = _decorator;

/**
 * 敌人角色类 - 展示重构后的事件系统使用
 */
@ccclass('SpiderEgg')
export class SpiderEgg extends Component {
    @property({
        type: Node,
        displayName: '蛋'
    })
    public egg: Node = null!;

    @property({
        type: HealthComponent,
        displayName: '血量组件'
    })
    public healthComponent: HealthComponent = null!;

    @property({
        type: MeshRenderer,
        displayName: '消融组件'
    })
    public dissolve: MeshRenderer = null!;

    onLoad(): void {
        this.node.on(ComponentEvent.HURT, this.onHurt, this);
        this.node.on(ComponentEvent.DEAD, this.onDead, this);
    }

    private onHurt(damageData: DamageData): void {
        // console.log('SpiderEgg onHurt', damageData);
        
        Tween.stopAllByTarget(this.egg);
        this.egg.setScale(1, 1, 1);

        tween(this.egg)
        .to(0.1, { scale: v3(1.05, 1.05, 1.05) }, { easing: easing.backOut })
        .to(0.1, { scale: v3(1, 1, 1) }, { easing: easing.backOut })
        .start();

        app.event.emit(CommonEvent.SpiderEggAttacked, damageData);
    }


    private onDead(){
        console.log('蜘蛛卵死亡');
        // 触发蜘蛛卵死亡事件
        app.event.emit(CommonEvent.SpiderEggDead, this.node);

        // let progress = { dissolve: 0 };
        // tween(progress).to(2, { dissolve: 1 }, { onUpdate: (target, ratio) => {
        //     this.dissolve.material.setProperty('dissolveThreshold', target.dissolve, 0);
        //     this.dissolve.material.setProperty('dissolveThreshold', target.dissolve, 1);
        // }}).start();
        
        this.scheduleOnce(() => {
            this.node.active = false
        });
    }

    //生成小蜘蛛
    public playSpawnSpiderAni(cb: () => void): void {
        
        Tween.stopAllByTarget(this.egg);
        this.egg.setScale(1, 1, 1);
        
        // 阶段1：轻微摇摆 - 蛋内开始有动静
        const phase1 = tween(this.egg)
            .to(0.05, { eulerAngles: v3(0, 0, 4) }, { easing: easing.sineInOut })
            .to(0.05, { eulerAngles: v3(0, 0, -4) }, { easing: easing.sineInOut })
            .to(0.05, { eulerAngles: v3(0, 0, 0) }, { easing: easing.sineInOut });
        
        // 阶段4：生成效果 - 膨胀后恢复
        const phase4 = tween(this.egg)
            .delay(0.2) // 短暂停顿增加紧张感
            .to(0.15, { 
                scale: v3(1.1, 1.1, 1.1),
            }, { easing: easing.sineInOut })
            .call(() => {
                // 在膨胀最大时生成小蜘蛛
                cb();
            })
            .to(0.1, { 
                scale: v3(1, 1, 1),
            }, { easing: easing.sineInOut });
        
        // 顺序执行所有阶段
        tween(this.node)
            .sequence(
                tween().call(() => phase1.start()),
                tween().call(() => phase4.start())
            )
            .start();
    }
} 