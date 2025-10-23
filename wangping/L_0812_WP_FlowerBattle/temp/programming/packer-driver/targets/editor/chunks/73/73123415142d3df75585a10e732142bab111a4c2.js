System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider, Component, Label, Sprite, Animation, Color, HandOver, App, GlobeVariable, SoundManager, _dec, _class, _crd, ccclass, property, PlayerTrigger;

  function _reportPossibleCrUseOfHandOver(extras) {
    _reporterNs.report("HandOver", "./HandOver", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Collider = _cc.Collider;
      Component = _cc.Component;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      Animation = _cc.Animation;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      HandOver = _unresolved_2.HandOver;
    }, function (_unresolved_3) {
      App = _unresolved_3.App;
    }, function (_unresolved_4) {
      GlobeVariable = _unresolved_4.GlobeVariable;
    }, function (_unresolved_5) {
      SoundManager = _unresolved_5.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d28b73zRNZM/L/EPKu1884n", "PlayerTrigger", undefined); // import { _decorator, Collider, Component, ITriggerEvent, Label, native, Node, Sprite } from 'cc';
      // import { Player } from './Player';
      // import { HandOver } from './HandOver';
      // import { App } from '../App';
      // import { GlobeVariable } from '../core/GlobeVariable';
      // import { SoundManager } from '../core/SoundManager';
      // const { ccclass, property } = _decorator;
      // @ccclass('Trigger')
      // export class PlayerTrigger extends Component {
      //     private player = null;
      //     private handOver: HandOver = new HandOver();
      //     private isTrigger: boolean = false;
      //     private _isInGoldMineArea: boolean = false;
      //     private index: number = 0;
      //     private testGuidStep: number = 0;
      //     private testGuidStep1: number = 0;
      //     private isIndex6: boolean = false;
      //     private index3: boolean = false;
      //     private index4: boolean = false;
      //     initTrigger(player) {
      //         //this.triggerNode = node;
      //         this.player = player;
      //         const collider = this.player.node.getComponent(Collider);
      //         if (!collider) {
      //             console.warn('没有找到碰撞矩阵');
      //             return;
      //         }
      //         if (!collider) return;
      //         //   collider.isTrigger = true; // 只是触发事件 不触发物理效果
      //         // 注册触发器回调
      //         collider.on('onTriggerEnter', this.onTriggerEnter, this);
      //         collider.on('onTriggerStay', this.onTriggerStay, this);
      //         collider.on('onTriggerExit', this.onTriggerExit, this);
      //     }
      //     onTriggerEnter(event: ITriggerEvent) {
      //         if (event.otherCollider.node.name == "DeliverWoodArea") {
      //             //this.isTrigger = true;
      //         }
      //     }
      //     callBack() {
      //         console.log("回调函数")
      //     }
      //     //事件监听触发
      //     onTriggerStay(event: ITriggerEvent) {
      //         const nodeName = event.otherCollider.node.name;
      //         if (GlobeVariable.handOverArea.indexOf(nodeName) != -1) {
      //             console.log("交付区域")
      //             const tnode = event.otherCollider.node;
      //             let { curCoin: cur, maxCoin: max } = GlobeVariable.handVoer[event.otherCollider.node.name];
      //             // 检查交付条件
      //             if (this.player.backpack?.children.length && !this.isTrigger && cur < max) {
      //                  const lastItem = this.player.backpack.children[this.player.backpack.children.length - 1];
      //                 // // 通过 [] 访问对象属性
      //                  let handOverLevelPos = App.sceneNode.allPos.getChildByName(nodeName);
      //                 this.handOver.handOver(lastItem, handOverLevelPos, () => {
      //                     this.player.subtractCoin(1);
      //                     GlobeVariable.handVoer[event.otherCollider.node.name].curCoin++;
      //                    // this.showProgressLevel(tnode);
      //                     lastItem.removeFromParent();
      //                     lastItem.destroy();
      //                     this.isTrigger = false;
      //                 });
      //                 this.isTrigger = true;
      //                // SoundManager.inst.playAudio("YX_jiaofu");
      //             }
      //         } else if (event.otherCollider.node.name == "coinArea") {
      //             let coinItem = App.goldMineController.playerGetCoin();
      //             if (coinItem) {
      //                 this.player.getGoldMineCoin(coinItem.coin, coinItem.pos);
      //             }
      //         }
      //         // // 简化碰撞检测与处理逻辑
      //         // if (event.otherCollider.node.name.match(/DeliverWoodArea-(10|[1-9])/)) {
      //         //     // 提取区域编号
      //         // //    GlobeVariable.handOverArea = true;
      //         //     console.log("交付区域")
      //         //     let num = parseInt(event.otherCollider.node.name.match(/DeliverWoodArea-(\d+)/)[1], 10);
      //         //     console.log(`DeliverWoodArea == ${num}`);
      //         //     GlobeVariable.g_curArea = num;
      //         //     const tnode = event.otherCollider.node;
      //         //     let { curCoin: cur, maxCoin: max } = GlobeVariable.handVoer[`pass_${GlobeVariable.g_curArea}`];
      //         //     // 检查交付条件
      //         //     if (this.player.backpack?.children.length && !this.isTrigger && cur < max) {
      //         //         const lastItem = this.player.backpack.children[this.player.backpack.children.length - 1];
      //         //         const propName = `handOverPosLevel_${num}`;
      //         //         // 通过 [] 访问对象属性
      //         //         let handOverLevelPos = App.sceneNode[propName];
      //         //         this.handOver.handOver(lastItem, handOverLevelPos, () => {
      //         //             this.player.subtractCoin(1);
      //         //             GlobeVariable.handVoer[`pass_${GlobeVariable.g_curArea}`].curCoin++;
      //         //             this.showProgressLevel(tnode);
      //         //             lastItem.removeFromParent();
      //         //             lastItem.destroy();
      //         //             this.isTrigger = false;
      //         //         });
      //         //         this.isTrigger = true;
      //         //         SoundManager.inst.playAudio("YX_jiaofu");
      //         //     }
      //         // } else if (event.otherCollider.node.name == "coinArea") {
      //         //     let coinItem = App.goldMineController.playerGetCoin();
      //         //     if (coinItem) {
      //         //         this.player.getGoldMineCoin(coinItem.coin, coinItem.pos);
      //         //     }
      //         // }
      //     }
      //     showProgressLevel(node) {
      //         // 简化组件获取
      //         const sp = node.getChildByName("progress").getComponent(Sprite);
      //         const lb = node.getChildByName("UnlockTileLabel").getComponent(Label);
      //         // 缓存当前关卡数据
      //         const passData = GlobeVariable.handVoer[`pass_${GlobeVariable.g_curArea}`];
      //         let remaining = passData.maxCoin - passData.curCoin;
      //         // 处理边界值
      //         remaining = Math.max(0, remaining);
      //         lb.string = remaining.toString();
      //         // 隐藏节点并处理关卡切换
      //         if (remaining === 0) {
      //             node.active = false;
      //            // this.guidProcess();
      //            // App.mapShowController.showLevelPylon(GlobeVariable.g_curArea);
      //         }
      //         // 设置进度条
      //         sp.fillRange = passData.curCoin / passData.maxCoin;
      //     }


      __checkObsolete__(['_decorator', 'Collider', 'Component', 'ITriggerEvent', 'Label', 'native', 'Node', 'Sprite', 'Animation', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerTrigger", PlayerTrigger = (_dec = ccclass('Trigger'), _dec(_class = class PlayerTrigger extends Component {
        constructor(...args) {
          super(...args);
          this.player = null;
          this.handOver = new (_crd && HandOver === void 0 ? (_reportPossibleCrUseOfHandOver({
            error: Error()
          }), HandOver) : HandOver)();
          this.spriteFrame = null;
          this.colliderNode = null;
          this.time = 0;
          this.intervalTime = 0.1;
        }

        initTrigger(player) {
          //this.triggerNode = node;
          this.player = player;
          const collider = this.player.node.getComponent(Collider);

          if (!collider) {
            console.warn('没有找到碰撞矩阵');
            return;
          }

          if (!collider) return; //   collider.isTrigger = true; // 只是触发事件 不触发物理效果
          // 注册触发器回调

          collider.on('onTriggerEnter', this.onTriggerEnter, this);
          collider.on('onTriggerStay', this.onTriggerStay, this);
          collider.on('onTriggerExit', this.onTriggerExit, this);
        }

        onTriggerEnter(event) {
          if (event.otherCollider.node.name == "DeliverWoodArea") {//this.isTrigger = true;
          }

          const nodeName = event.otherCollider.node.name;

          if (nodeName == "UI_jiachong-001") {
            if ((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).playerController.getPlayer().coinNum > 0) {
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).mapShowController.bubbleAniSpeed(2);
            }
          }
        }

        callBack() {
          console.log("回调函数");
        }

        //  private curCoin: number = 0;
        //事件监听触发
        onTriggerStay(event) {
          const nodeName = event.otherCollider.node.name; //         if (GlobeVariable.handOverArea.indexOf(nodeName) != -1) {
          //             console.log("交付区域")
          //             const tnode = event.otherCollider.node;
          //             let { curCoin: cur, maxCoin: max } = GlobeVariable.handVoer[event.otherCollider.node.name];
          //             // 检查交付条件
          //             if (this.player.backpack?.children.length && !this.isTrigger && cur < max) {
          //                  const lastItem = this.player.backpack.children[this.player.backpack.children.length - 1];
          //                 // // 通过 [] 访问对象属性
          //                  let handOverLevelPos = App.sceneNode.allPos.getChildByName(nodeName);
          //                 this.handOver.handOver(lastItem, handOverLevelPos, () => {
          //                     this.player.subtractCoin(1);
          //                     GlobeVariable.handVoer[event.otherCollider.node.name].curCoin++;
          //                    // this.showProgressLevel(tnode);
          //                     lastItem.removeFromParent();
          //                     lastItem.destroy();
          //                     this.isTrigger = false;
          //                 });
          //                 this.isTrigger = true;
          //                // SoundManager.inst.playAudio("YX_jiaofu");
          //             }
          //         } else if (event.otherCollider.node.name == "coinArea") {
          //             let coinItem = App.goldMineController.playerGetCoin();
          //             if (coinItem) {
          //                 this.player.getGoldMineCoin(coinItem.coin, coinItem.pos);
          //             }
          //         }
          // 简化碰撞检测与处理逻辑

          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handOverArea.indexOf(nodeName) != -1) {
            var _this$player$backpack, _this$player$backpack2;

            // 提取区域编号
            // this.spriteFrame = event.otherCollider.node.getChildByName("kuang-001")?.getComponent(Sprite);
            // this.spriteFrame.color = new Color(0, 255, 0); // 设置为白色
            console.log("交付区域");
            this.colliderNode = event.otherCollider.node;
            let {
              curCoin: cur,
              maxCoin: max
            } = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).handVoer[event.otherCollider.node.name]; // 检查交付条件

            if (nodeName == "UI_jiachong-001") {
              if ((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).playerController.getPlayer().coinNum <= 0) {
                (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                  error: Error()
                }), App) : App).mapShowController.bubbleAniSpeed(0.7);
              }
            }

            if ((_this$player$backpack = this.player.backpack) != null && _this$player$backpack.children.length && cur < max) {
              this.time += 0.1;

              if (this.time < this.intervalTime) {
                return;
              }

              this.time = 0;
              const lastItem = this.player.backpack.children[this.player.backpack.children.length - 1];
              let pos = lastItem.worldPosition.clone();
              this.player.subtractCoin(1);
              (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[event.otherCollider.node.name].curCoin++;
              lastItem.setParent((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).sceneNode.effectParent);
              lastItem.setWorldPosition(pos); // 通过 [] 访问对象属性

              let handOverLevelPos = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).sceneNode.allPos.getChildByName(nodeName + "Pos");
              this.handOver.handOver(lastItem, handOverLevelPos, () => {
                if (nodeName != "UI_jiachong-001") {
                  this.showProgressLevel(this.colliderNode);
                } else {
                  this.showProgressBubbleLevel(this.colliderNode);
                }

                lastItem.removeFromParent();
                lastItem.destroy();
              });
              (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                error: Error()
              }), SoundManager) : SoundManager).Instance.playAudio("jinbi_jiaofu");
            } else if (((_this$player$backpack2 = this.player.backpack) == null ? void 0 : _this$player$backpack2.children.length) <= 0) {//  this.colliderNode.getComponent(Animation)?.stop()
            }
          } else if (event.otherCollider.node.name == "coinArea") {
            let coinItem = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).goldMineController.playerGetCoin();

            if (coinItem) {
              this.player.getGoldMineCoin(coinItem.coin, coinItem.pos);
            }
          }
        }

        showProgressBubbleLevel(node) {
          // const sp = node.getChildByName("qipao-001").getComponent(Sprite);
          // const lb = node.getChildByName("UnlockTileLabel-001").getComponent(Label);
          // 缓存当前关卡数据
          const passData = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer[node.name];
          passData.showCoin++;
          let remaining = passData.maxCoin - passData.showCoin; //passData.curCoin;
          // 处理边界值

          remaining = Math.max(0, remaining); // lb.string = remaining.toString();

          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).mapShowController.setBubbleLable(); // 隐藏节点并处理关卡切换

          if (remaining === 0) {
            node.active = false;
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).mapShowController.showUIBuiding(node.name);
          } // 设置进度条
          // sp.fillRange = passData.showCoin / passData.maxCoin; 

        }

        showProgressLevel(node) {
          // this.curCoin++;
          // 简化组件获取
          const sp = node.getChildByName("progress").getComponent(Sprite);
          const lb = node.getChildByName("UnlockTileLabel").getComponent(Label); // 缓存当前关卡数据

          const passData = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer[node.name];
          passData.showCoin++;
          let remaining = passData.maxCoin - passData.showCoin; //passData.curCoin;
          // 处理边界值

          remaining = Math.max(0, remaining);
          lb.string = remaining.toString(); // 隐藏节点并处理关卡切换

          if (remaining === 0) {
            node.active = false;
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).mapShowController.showUIBuiding(node.name);
          } // 设置进度条


          sp.fillRange = passData.showCoin / passData.maxCoin;
        }

        onTriggerExit(event) {
          console.log("onTriggerExit");
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).mapShowController.bubbleAniSpeed(0.7); //    this.curCoin = 0;

          if (this.spriteFrame) {
            this.spriteFrame.color = new Color(255, 255, 255); // 设置为白色
          }

          if (this.colliderNode) {
            var _this$colliderNode$ge;

            (_this$colliderNode$ge = this.colliderNode.getComponent(Animation)) == null || _this$colliderNode$ge.stop();
          } //  GlobeVariable.handOverArea = false;

        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=73123415142d3df75585a10e732142bab111a4c2.js.map