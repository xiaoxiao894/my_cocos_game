import { _decorator, Collider, Component, ITriggerEvent, Label, native, Node, Sprite, Animation, Color } from 'cc';
import { Player } from './Player';
import { HandOver } from './HandOver';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Trigger')
export class PlayerTrigger extends Component {

    private player = null;
    private handOver: HandOver = new HandOver();
    private isTrigger: boolean = false;
    private _isInGoldMineArea: boolean = false;
    private index: number = 0;

    private testGuidStep: number = 0;
    private testGuidStep1: number = 0;
    private isIndex6: boolean = false;
    private index3: boolean = false;
    private index4: boolean = false;
    private spriteFrame: Sprite = null;
    private colliderNode: Node = null;

    initTrigger(player) {
        //this.triggerNode = node;
        this.player = player;

        const collider = this.player.node.getComponent(Collider);
        if (!collider) {
            // console.warn('没有找到碰撞矩阵');
            return;
        }
        if (!collider) return;

        //   collider.isTrigger = true; // 只是触发事件 不触发物理效果
        // 注册触发器回调
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerStay', this.onTriggerStay, this);
        collider.on('onTriggerExit', this.onTriggerExit, this);
    }
    onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.node.name == "DeliverWoodArea") {
            //this.isTrigger = true;
        }
    }
    callBack() {
        // console.log("回调函数")
    }

    private time: number = 0;
    private intervalTime: number = 0.2;

  //  private curCoin: number = 0;
    //事件监听触发
    onTriggerStay(event: ITriggerEvent) {
        // if(GlobeVariable.collectCoin){
        //     return;
        // }

        // console.log("onTriggerStay")
        // 简化碰撞检测与处理逻辑
        if (event.otherCollider.node.name.match(/DeliverWoodArea-(10|[1-9])/)) {
            // 提取区域编号
            //    GlobeVariable.handOverArea = true;
            this.spriteFrame = event.otherCollider.node.getChildByName("kuang-001")?.getComponent(Sprite);

            this.spriteFrame.color = new Color(0, 255, 0); // 设置为白色

            // console.log("交付区域")

            let num = parseInt(event.otherCollider.node.name.match(/DeliverWoodArea-(\d+)/)[1], 10);
            // console.log(`DeliverWoodArea == ${num}`);
            GlobeVariable.g_curArea = num;
            const tnode = event.otherCollider.node;
            this.colliderNode = event.otherCollider.node
            let { curCoin: cur, maxCoin: max } = GlobeVariable.handVoer[`pass_${GlobeVariable.g_curArea}`];
            // if (!this.isTrigger) {
            //     this.isTrigger = true;
            //     this.curCoin = cur;
            // }


            // 检查交付条件
            if (this.player.backpack?.children.length && cur < max) {
                this.time += 0.1;
                if (this.time < this.intervalTime) {
                    return;
                }
                this.time = 0;

                const lastItem = this.player.backpack.children[this.player.backpack.children.length - 1];
                let pos = lastItem.worldPosition.clone();
                this.player.subtractCoin(1);
                GlobeVariable.handVoer[`pass_${GlobeVariable.g_curArea}`].curCoin++;

                lastItem.setParent(App.sceneNode.effectParent);
                lastItem.setWorldPosition(pos);


                this.colliderNode.getComponent(Animation)?.play()

                const propName = `handOverPosLevel_${num}`;
                // 通过 [] 访问对象属性
                let handOverLevelPos = App.sceneNode[propName];

                this.handOver.handOver(lastItem, handOverLevelPos, () => {
                    this.showProgressLevel(tnode);
                    lastItem.removeFromParent();
                    lastItem.destroy();
                    //  this.isTrigger = false;

                });

                // this.isTrigger = true;
                SoundManager.inst.playAudio("YX_jiaofu");
            } else if (this.player.backpack?.children.length <= 0) {
                this.colliderNode.getComponent(Animation)?.stop()
            }
        } else if (event.otherCollider.node.name == "coinArea") {
            let coinItem = App.goldMineController.playerGetCoin();
            if (coinItem) {
                this.player.getGoldMineCoin(coinItem.coin, coinItem.pos);
            }
        }
    }

    showProgressLevel(node) {
       // this.curCoin++;
        // 简化组件获取
        const sp = node.getChildByName("progress").getComponent(Sprite);
        const lb = node.getChildByName("UnlockTileLabel").getComponent(Label);

        // 缓存当前关卡数据
        const passData = GlobeVariable.handVoer[`pass_${GlobeVariable.g_curArea}`];
        passData.showCoin++;
        let remaining = passData.maxCoin - passData.showCoin;//passData.curCoin;


        // 处理边界值
        remaining = Math.max(0, remaining);
        lb.string = remaining.toString();

        // 隐藏节点并处理关卡切换
        if (remaining === 0) {
            node.active = false;
            this.guidProcess();
            App.mapShowController.showLevelPylon(GlobeVariable.g_curArea);
        }
        // 设置进度条
        sp.fillRange = passData.showCoin / passData.maxCoin;

    }

    guidProcess() {
        if (App.guideManager.guidePhase == 1) {
            if (GlobeVariable.g_curArea == 1) {
                if (App.guideManager) {
                    this.testGuidStep += 1;
                    App.guideManager.setGuideStepCompLate(1);
                    if (this.testGuidStep >= 2) {
                        App.guideManager.nexStep(1);
                    } else {
                        App.guideManager.nexStep();
                    }

                }
            }
            else if (GlobeVariable.g_curArea == 2) {
                if (App.guideManager) {
                    this.testGuidStep += 1;
                    App.guideManager.setGuideStepCompLate(2);
                    if (this.testGuidStep >= 2) {
                        App.guideManager.nexStep();
                    }

                }
            } else if (GlobeVariable.g_curArea == 3) {
                if (App.guideManager) {
                    this.testGuidStep1 += 1;
                    this.index3 = true;
                    App.guideManager.setGuideStepCompLate(5);
                    // if (this.testGuidStep >= 2) {
                    //     App.guideManager.nexStep(1);
                    // } else {
                    //     App.guideManager.nexStep();
                    // }
                }
            } else if (GlobeVariable.g_curArea == 4) {
                if (App.guideManager) {
                    this.testGuidStep1 += 1;
                    this.index4 = true;

                    App.guideManager.setGuideStepCompLate(6);

                    // if (this.testGuidStep >= 2) {
                    //     App.guideManager.nexStep();
                    // }
                }
            }
            else if (GlobeVariable.g_curArea == 5) {
                if (App.guideManager) {

                    App.guideManager.setGuideStepCompLate(3);
                    App.guideManager.nexStep();
                    App.guideManager.phase2();
                    this.testGuidStep = 0;
                }
            }
        } else if (App.guideManager.guidePhase == 2) {
            if (GlobeVariable.g_curArea == 6) {
                if (App.guideManager) {
                    this.isIndex6 = true;
                    if (this.testGuidStep1 >= 2 || this.testGuidStep >= 2) {

                        App.guideManager.setNextGuideStep(7);

                    } else {
                        //都是true的时候走上边 
                        if (!this.index3 && !this.index4) {
                            App.guideManager.setGuideStepCompLate(4);
                            App.guideManager.nexStep();
                        } else if (!this.index3 && this.index4) {
                            App.guideManager.setNextGuideStep(5);
                        } else if (this.index3 && !this.index4) {
                            App.guideManager.setNextGuideStep(6);
                        }

                    }


                }
            } else if (GlobeVariable.g_curArea == 3) {
                if (App.guideManager) {
                    this.testGuidStep1 += 1;
                    this.index3 = true
                    App.guideManager.setGuideStepCompLate(5);
                    if (this.isIndex6) {
                        if (this.testGuidStep1 >= 2) {
                            App.guideManager.nexStep(1);
                        } else {
                            App.guideManager.nexStep();
                        }
                    } else {
                        if (this.testGuidStep1 >= 2) {
                            //App.guideManager.nexStep(1);
                            App.guideManager.setNextGuideStep(4);
                        } else {
                            App.guideManager.nexStep();
                        }
                    }

                }
            } else if (GlobeVariable.g_curArea == 4) {
                if (App.guideManager) {
                    this.testGuidStep1 += 1;
                    this.index4 = true;
                    App.guideManager.setGuideStepCompLate(6);
                    if (this.isIndex6) {
                        if (this.testGuidStep1 >= 2) {
                            App.guideManager.nexStep();
                        }
                    } else {
                        App.guideManager.setNextGuideStep(4);
                    }

                }
            }
            else if (GlobeVariable.g_curArea == 7) {
                if (App.guideManager) {
                    this.testGuidStep = 0;
                    App.guideManager.setGuideStepCompLate(7);
                    App.guideManager.nexStep();

                }
            } else if (GlobeVariable.g_curArea == 8) {
                if (App.guideManager) {
                    this.testGuidStep += 1;
                    App.guideManager.setGuideStepCompLate(8);

                    if (this.testGuidStep >= 2) {
                        App.guideManager.nexStep(1);
                    } else {
                        App.guideManager.nexStep();
                    }
                }
            } else if (GlobeVariable.g_curArea == 9) {
                if (App.guideManager) {
                    this.testGuidStep += 1;
                    App.guideManager.setGuideStepCompLate(9);

                    if (this.testGuidStep >= 2) {
                        App.guideManager.nexStep();
                    }
                }
            }
            else if (GlobeVariable.g_curArea == 10) {
                if (App.guideManager) {
                    this.testGuidStep = 0;
                    App.guideManager.setGuideStepCompLate(10);

                    App.guideManager.nexStep();

                }
            }
        }
    }
    onTriggerExit(event: ITriggerEvent) {
        // console.log("onTriggerExit")
        this.isTrigger = false;
    //    this.curCoin = 0;
        if (this.spriteFrame) {
            this.spriteFrame.color = new Color(255, 255, 255); // 设置为白色
        }
        if (this.colliderNode) {
            this.colliderNode.getComponent(Animation)?.stop()
        }
        //  GlobeVariable.handOverArea = false;

    }
}


