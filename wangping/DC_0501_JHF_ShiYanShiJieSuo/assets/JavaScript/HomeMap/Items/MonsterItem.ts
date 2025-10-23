import { _decorator, Component, Node, SkeletalAnimation, CCString, Vec3, tween, Material, MeshRenderer } from 'cc';
import { EventManager } from '../../Global/EventManager';
import { EventNames, HeroEnum } from '../../Enum/Index';
import { SoundManager } from '../../Common/SoundManager';
import { DataManager } from '../../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('MonsterItem')
export class MonsterItem extends Component {

    @property(SkeletalAnimation)
    ani: SkeletalAnimation = null;

    @property(Material)
    monsterMtls: Material[] = [];

    @property(MeshRenderer)
    monsterSkin: MeshRenderer = null;

    //方向 计算出来的
    private _direction: Vec3 = new Vec3();
    //走路速度
    private _speed: number = 5;

    //0 走路 1打英雄
    private _state: number = 0;
    //血量
    private _blood: number = 0;

    private _redTimeOut;

    private _hero: HeroEnum = null;

    protected onEnable(): void {
        EventManager.inst.on(EventNames.MonsterBeaten, this.monsterBeaten, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventNames.MonsterBeaten, this.monsterBeaten, this);
    }

    public init(num: number, start, end, hero) {
        clearTimeout(this._redTimeOut);
        this._hero = hero;
        this._blood = 80;
        this._state = 0;
        let aniTime: number = 4.5;
        this.node.setPosition(start);
        this.monsterSkin.setMaterial(this.monsterMtls[0], 0);
        if (num > 0) {
            let scaleNum: number = 0.33;
            if (num === 3) {
                scaleNum = 0.66;
            }

            aniTime *= scaleNum;

            let testPos: Vec3 = new Vec3();
            Vec3.subtract(testPos, end, start);
            Vec3.multiplyScalar(testPos, testPos, scaleNum);

            Vec3.add(testPos, start, testPos);
            this.node.setPosition(testPos);
        }

        //播放走路的动画
        setTimeout(() => {
            this.ani.play("run");
        }, 0);
        tween(this.node).to(aniTime, { position: end }).call(() => {
            this._state = 1;
            if(this._hero == HeroEnum.Batman){
                console.log(num);
            }
        }).start();
    }

    public firstMonsterInit(start, end, hero) {
        clearTimeout(this._redTimeOut);
        this._hero = hero;
        this._blood = 80;
        this._state = 0;
        this.node.setPosition(end);

        this._state = 1;
    }

    private monsterBeaten(hero: HeroEnum) {
        if (this._hero !== hero) {
            return;
        }
        if (this._state == 1) {

            this._state = 2;
            this.ani.play("die");

            //红边
            this.monsterSkin.setMaterial(this.monsterMtls[1], 0);
            clearTimeout(this._redTimeOut);
            this._redTimeOut = setTimeout(() => {
                this.monsterSkin.setMaterial(this.monsterMtls[2], 0);
                SoundManager.inst.playAudio("DC_canjiao");
                EventManager.inst.emit(EventNames.MonsterGiveMoney, this.node);

                DataManager.Instance.MoneyManeger.giveMoney(this.node);
            }, 400);

            setTimeout(() => {
                DataManager.Instance.MoneyManeger.recycleMonster(this.node);
            }, 1600);
        }

        // if (hero == HeroEnum.Batman) {
        // } else {
        //     this.ani.play("die");

        //     //红边
        //     this.monsterSkin.setMaterial(this.monsterMtls[1], 0);
        //     clearTimeout(this._redTimeOut);
        //     this._redTimeOut = setTimeout(() => {
        //         this.monsterSkin.setMaterial(this.monsterMtls[2], 0);
        //         SoundManager.inst.playAudio("DC_canjiao");
        //         EventManager.inst.emit(EventNames.MonsterGiveMoney, this.node);

        //         DataManager.Instance.MoneyManeger.giveMoney(this.node);
        //     }, 900);

        //     setTimeout(() => {
        //         DataManager.Instance.MoneyManeger.recycleMonster(this.node);
        //     }, 1600);
        // }

    }
}



