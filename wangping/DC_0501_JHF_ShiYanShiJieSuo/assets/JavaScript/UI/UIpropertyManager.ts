import { _decorator, Animation, Component, Label, Node, Tween, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { UIPropertyEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('UIpropertyManager')
export class UIpropertyManager extends Component {

    @property(Node)
    itemParent:Node = null;

    @property(Node)
    money: Node = null;

    @property(Node)
    medicaament: Node = null;

    @property(Node)
    honorValue: Node = null;

    @property(UITransform)
    bg:UITransform = null;

    @property(Animation)
    moneyAni:Animation = null;

    private _duration = 0.3;

    private tweenHide = {};

    private _moneyMaxAniPlaying:boolean = false;


    start() {
        DataManager.Instance.uiPropertyManager = this;

        if (this.node.name == "UIpropertyMoneyRobot" || this.node.name == "UIpropertyMedicationRobot") {
            this.hideNodeAni(this.node,true)
        }
    }

    updatePropertyLab(type, isAdd = true) {

        let labelCom: Label = null;

        if (type === UIPropertyEnum.Money && this.money) {
            labelCom = this.money.getChildByPath("labels/Label")?.getComponent(Label);
        } else if (type === UIPropertyEnum.Medicament && this.medicaament) {
            labelCom = this.medicaament.getChildByPath("labels/Label")?.getComponent(Label);
        } else if (type === UIPropertyEnum.HonorValue && this.honorValue) {
            labelCom = this.honorValue.getChildByPath("labels/Label")?.getComponent(Label);
        }

        if (!labelCom) return;

        let value = Number(labelCom.string);
        const delta = type === UIPropertyEnum.HonorValue ? 10 : 1;
        value = isAdd ? value + delta : Math.max(0, value - delta);
        if (this.node.name == "UIpropertyMoneyRobot" || this.node.name == "UIpropertyMedicationRobot") {
            if (value <= 0) {
                this.hideNodeAni(this.node,true);
            } else {
                this.displayNodeAni(this.node,true)
            }
        }
        labelCom.string = `${value}`;

        this.playBreathAni(labelCom.node.parent.parent);

        if(this.node.name === "UIproperty"&&type === UIPropertyEnum.Money && this.money){
            if(value>=20){
                if(!this._moneyMaxAniPlaying){
                    this._moneyMaxAniPlaying = true;
                    //闪红
                    this.moneyAni.play();
                }
            }else{
                this._moneyMaxAniPlaying = false;
                //颜色恢复
                const state = this.moneyAni.getState("bianSe");
                if (state) {
                    state.time = 0;       // 设置时间为第0秒
                    state.sample();       // 强制应用当前帧的姿势
                    state.pause();        // 停止播放
                }
            }
        }
    }


    updateMed() {
        const labelCom = this.medicaament.getChildByPath("labels/Label")?.getComponent(Label);

        if (!labelCom) return;
        labelCom.string = `${0}`;
    }



    // 公用呼吸动画方法（防叠加）
    private playBreathAni(node: Node) {
        if (!node) return;

        if ((node as any)._breathTween) {
            (node as any)._breathTween.stop(); // 停止之前的动画
        }

        const tweenAni = tween(node)
            .to(0.08, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'quadOut' })
            .to(0.08, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
            .start();

        (node as any)._breathTween = tweenAni;
    }


    displayNodeAni(node,isRoot:boolean) {
        //console.log("displayNodeAni ",node.name);
        if(!isRoot&&this.tweenHide[node.name]){
            this.tweenHide[node.name].stop();
            delete this.tweenHide[node.name];
        }
        if(!isRoot){
            node.active = true;
            if(this.node.name === "UIproperty"){
                this.updateBg();
            }
        }
        const opacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        let tweenAni = tween(opacity)
            .to(this._duration, { opacity: 255 })   // 渐显
            .call(() => {
                
            })
            .start();
    }

    hideNodeAni(node,isRoot:boolean) {
        //console.log("hideNodeAni ",node.name);
        const opacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        let tweenAni = tween(opacity)
            .to(this._duration, { opacity: 0 })
            .call(() => {
                if(!isRoot){
                    node.active = false;
                    delete this.tweenHide[node.name];
                }
                if(this.node.name === "UIproperty"){
                    this.updateBg();
                }
                
            })
            .start();
        if(!isRoot){
            this.tweenHide[node.name] = tweenAni;
        }
        
    }

    private _appearCounter = 0;  // 用于记录首次出现顺序


    update(deltaTime: number) {
        if (this.node.name !== "UIproperty") return;

        const children = this.itemParent.children;
        const visibleNodes: Node[] = [];

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const labelNode = child.getChildByPath("labels/Label");
            if (!labelNode) continue;

            const label = labelNode.getComponent(Label);
            if (!label) continue;

            const value = Number(label.string);
            if (value > 0) {
                if ((child as any)._appearOrder === undefined) {
                    (child as any)._appearOrder = ++this._appearCounter;
                }

                visibleNodes.push(child);

                const opacity = child.getComponent(UIOpacity) || child.addComponent(UIOpacity);
                if (opacity.opacity < 255) {
                    this.displayNodeAni(child,false);
                }

                child.active = true;
            } else {
                // 不显示的要清除顺序信息和布局标记
                delete (child as any)._appearOrder;
                delete (child as any)._layoutIndex;
                this.hideNodeAni(child,false);
            }
        }

        // 排序：按照首次出现顺序
        visibleNodes.sort((a, b) => {
            return (a as any)._appearOrder - (b as any)._appearOrder;
        });

        // 补位 + 动画移动
        const spacing = 60;
        for (let j = 0; j < visibleNodes.length; j++) {
            const node = visibleNodes[j];
            const targetY = j * spacing;
            const layoutIndex = (node as any)._layoutIndex;

            // 只要排序 index 变了，就做补位处理（包括首次）
            if (layoutIndex === undefined) {
                node.setPosition(0, targetY, 0);
            } else if (layoutIndex !== j) {
                // 执行动画补位
                const from = node.getPosition().clone();
                const to = new Vec3(0, targetY, 0);
                const pos = from.clone();

                tween(pos)
                    .to(0.3, to, {
                        easing: 'quadOut',
                        onUpdate: () => {
                            node.setPosition(pos);
                        }
                    })
                    .start();
            }

            // 更新记录的布局 index
            (node as any)._layoutIndex = j;
        }
    }

    private updateBg(){
        let activeNum:number = 0;
        let maxNum:number = 0;
        const children = this.itemParent.children;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            const labelNode = child.getChildByPath("labels/Label");
            if (!labelNode) continue;

            const label = labelNode.getComponent(Label);
            if (!label) continue;
            const value = Number(label.string);
            if(value>0){
                activeNum ++;
            }
            maxNum = Math.max(maxNum,value);
        }
        //150 270 390
        this.bg.height = 125 * activeNum + 20;
        // 370 405
        //this.bg.width = 340+35*(String(maxNum).length);
        this.bg.node.active = activeNum!==0;
    }

}


