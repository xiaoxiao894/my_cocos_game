import { _decorator, Component, Node, tween } from 'cc';
import { GuideLine } from './GuideLine';
import Shopping from '../ShoppIng/Shopping';
import { MonsterCreate } from '../Monster/MonsterCreate';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { HeroManager } from '../Hero/HeroManager';
import { PropEnum } from '../../Base/EnumIndex';
import { BagBase } from '../Bag/Base/BagBase';
import TweenTool from '../../Tool/TweenTool';
import { EffectManager } from '../Effect/EffectManager';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager extends UnityUpComponent {

    public static instance: GuideManager

    @property(GuideLine)
    public gl: GuideLine;
    protected onLoad(): void {
        GuideManager.instance = this;

        for (let i = 0; i < this.shopList.length; i++) {
            let shop = this.shopList[i];
            shop.node.active = false;
        }
        // for (let i = 0; i < this.siteList.length; i++) {
        //     let site = this.siteList[i];
        //     site.active = false;
        // }
    }

    @property(HeroManager)
    public heroMgr: HeroManager;

    @property(Shopping)
    public shopList: Shopping[] = [];
    @property(Node)
    public siteList: Node[] = [];
    @property(BagBase)
    public bagList: BagBase[] = [];
    @property(MonsterCreate)
    public monsterC: MonsterCreate;


    public guideSwitch: boolean = false;

    private guideList: Function[] = [this.monsterGuide, this.meatBagPlace, this.takeCookMeat, this.shopCookMeat, this.takeGold, this.shopShopAi, this.shopWarriorAI, this.shopArms, this.gameOver];

    protected _update(dt: number): void {
        EffectManager.instance.frameReleaseSpecialEffects();
        if (!this.guideSwitch) {
            return;
        }
        let fun = this.guideList[0];
        if (fun) {
            let over = fun.call(this);
            if (over) {
                this.guideList.splice(0, 1);
                if (!this.guideList.length) {
                    this.guideSwitch = false;
                }
            }
        } else {
            this.guideSwitch = false;
        }
    }

    private monsterGuide() {
        let monster = this.monsterC.monsterRandom;
        this.gl.setLineNode(this.heroMgr.node, monster.node);
        return true;
    }

    private meatBagPlace() {
        let bag = this.heroMgr.buyWay.getBag(PropEnum.meat);
        if (bag.propCount) {
            let node = this.siteList[0];
            node.active = true;
            this.gl.setLineNode(this.heroMgr.node, node);
            return true;
        } else {
            return false;
        }
    }

    private takeCookMeat() {
        let bag = this.bagList[0];
        if (bag.propCount) {
            let node = this.siteList[1];
            node.active = true;
            this.gl.setLineNode(this.heroMgr.node, node);
            return true;
        } else {
            return false;
        }
    }

    private shopCookMeat() {
        let bag = this.heroMgr.buyWay.getBag(PropEnum.cookMeat);
        if (bag.propCount) {
            let node = this.siteList[2];
            node.active = true;
            this.gl.setLineNode(this.heroMgr.node, node);
            return true;
        } else {
            return false;
        }
    }

    private takeGold() {
        let bag = this.bagList[1];
        if (bag.propCount) {
            let node = this.siteList[3];
            node.active = true;
            this.gl.setLineNode(this.heroMgr.node, node);
            return true;
        } else {
            return false;
        }
    }

    private shopShopAi() {
        let bag = this.heroMgr.buyWay.getBag(PropEnum.gold);
        if (bag.propCount) {
            let shop = this.shopList[0];
            shop.node.active = true;
            TweenTool.scaleShake(shop.node);
            this.gl.setLineNode(this.heroMgr.node, shop.node);
            return true;
        } else {
            return false;
        }
    }

    private shopWarriorAI() {
        let shop = this.shopList[0];
        if (!shop.loopCount) {
            let shop2 = this.shopList[1];
            shop2.node.active = true;
            TweenTool.scaleShake(shop2.node);
            this.gl.setLineNode(this.heroMgr.node, shop2.node);
            return true;
        } else {
            return false;
        }
    }
    private levelArms = 2;

    private shopArms() {
        let arms_shop = this.shopList[2];
        if (arms_shop.node.active) {

            const loopCount = arms_shop.loopCount;
            if (this.levelArms == loopCount) {
                this.gl.setLineNode(this.heroMgr.node, arms_shop.node);
                this.levelArms--;
                if (!this.levelArms) {

                    return true;
                }
            }

        }
        return false;
    }


    private gameOver() {
        const shop_over = this.shopList[3];
        if (shop_over.node.active) {
            this.gl.setLineNode(this.heroMgr.node, shop_over.node);
            return true;
        }
        return false;
    }


}


