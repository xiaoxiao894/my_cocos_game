System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Node, Vec3, App, Arrow3D, ArroePath, GlobeVariable, _dec, _class, _class2, _crd, ccclass, property, GuideManager;

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArrow3D(extras) {
    _reporterNs.report("Arrow3D", "./Arrow3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArroePath(extras) {
    _reporterNs.report("ArroePath", "./ArroePath", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }, function (_unresolved_3) {
      Arrow3D = _unresolved_3.Arrow3D;
    }, function (_unresolved_4) {
      ArroePath = _unresolved_4.ArroePath;
    }, function (_unresolved_5) {
      GlobeVariable = _unresolved_5.GlobeVariable;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6139b8LE8FMXoxiYLCg38ge", "GuideManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GuideManager", GuideManager = (_dec = ccclass('GuideManager'), _dec(_class = (_class2 = class GuideManager {
        constructor() {
          //引导当前步骤
          this.guideCurStep = 1;
          //引导阶段
          this.guidePhase = 1;
          //引导当前执行到的步骤
          this.executingStep = 0;
          this.arrowPath = null;
          this.arrow3dComp = null;
          this.guideList = {};
          //引导节点 索引位置
          this.guideStepJson = {};
          // 检查最近的敌人（优先锁定当前目标，死亡后再更新）
          this.currentTarget = null;
        }

        static get Instance() {
          if (this._instance == null) {
            this._instance = new GuideManager();
          }

          return this._instance;
        }

        continueGame() {
          this.guideCurStep = 1;
          this.executingStep = 0;
          this.guidePhase = 1;
          this.guideList = {};
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.guideList.forEach(node => {
            if (node.name) {
              // 假设节点有唯一名称属性（如 "UI_jianta"）
              this.guideList[node.name] = node;
            }
          });
          var arrow3d = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).guidArrow3D;
          arrow3d.setParent((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.guideParent);
          this.arrow3dComp = arrow3d.getComponent(_crd && Arrow3D === void 0 ? (_reportPossibleCrUseOfArrow3D({
            error: Error()
          }), Arrow3D) : Arrow3D);
          this.arrow3dComp.setActive(true);
          this.arrowPath = new (_crd && ArroePath === void 0 ? (_reportPossibleCrUseOfArroePath({
            error: Error()
          }), ArroePath) : ArroePath)();
          this.jsonTablePhase2();
        }

        init() {
          //this.guideList = App.sceneNode.guideList;
          this.guideList = {};
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.guideList.forEach(node => {
            if (node.name) {
              // 假设节点有唯一名称属性（如 "UI_jianta"）
              this.guideList[node.name] = node;
            }
          });
          var arrow3d = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).guidArrow3D;
          arrow3d.setParent((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.guideParent);
          this.arrow3dComp = arrow3d.getComponent(_crd && Arrow3D === void 0 ? (_reportPossibleCrUseOfArrow3D({
            error: Error()
          }), Arrow3D) : Arrow3D);
          this.arrow3dComp.setActive(true);
          this.arrowPath = new (_crd && ArroePath === void 0 ? (_reportPossibleCrUseOfArroePath({
            error: Error()
          }), ArroePath) : ArroePath)();
          this.jsonTablePhase1();
        }

        jsonTablePhase2() {
          var guideStepJson = {
            1: {
              "targetPos": this.guideList["UI_jianta1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_jianta1"],
              "isGuideComplate": false,
              "nextStep": 2,
              "extendNext": 0,
              "handOver": "UI_jianta"
            },
            2: {
              "targetPos": this.guideList["UI_juma1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_juma1"],
              "isGuideComplate": false,
              "nextStep": 3,
              "extendNext": 0,
              "handOver": "UI_juma"
            },
            3: {
              "targetPos": this.guideList["UI_paota1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_paota1"],
              "isGuideComplate": false,
              "nextStep": 4,
              "extendNext": 0,
              "handOver": "UI_paota"
            },
            4: {
              "targetPos": this.guideList["UI_shirenhua1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_shirenhua1"],
              "isGuideComplate": false,
              "nextStep": 5,
              "extendNext": 0,
              "handOver": "UI_shirenhua"
            },
            5: {
              "targetPos": this.guideList["UI_jiachong1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_jiachong1"],
              "isGuideComplate": false,
              "nextStep": 6,
              "extendNext": 0,
              "handOver": "UI_jiachong"
            },
            6: {
              "targetPos": this.guideList["UI_juma-0011"].worldPosition.clone(),
              "targetNode": this.guideList["UI_juma-0011"],
              "isGuideComplate": false,
              "nextStep": 0,
              "extendNext": 0,
              "handOver": "UI_juma-001"
            },
            7: {
              "targetPos": this.guideList["UI_jiachong-0011"].worldPosition.clone(),
              "targetNode": this.guideList["UI_jiachong-0011"],
              "isGuideComplate": false,
              "nextStep": 0,
              "extendNext": 0,
              "handOver": "UI_jiachong-001"
            }
          };
          this.guideStepJson = guideStepJson;
        }

        jsonTablePhase1() {
          var guideStepJson = {
            1: {
              "targetPos": this.guideList["UI_jianta1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_jianta1"],
              "isGuideComplate": false,
              "nextStep": 2,
              "extendNext": 0,
              "handOver": "UI_jianta"
            },
            2: {
              "targetPos": this.guideList["UI_juma1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_juma1"],
              "isGuideComplate": false,
              "nextStep": 3,
              "extendNext": 0,
              "handOver": "UI_juma"
            },
            3: {
              "targetPos": this.guideList["UI_paota1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_paota1"],
              "isGuideComplate": false,
              "nextStep": 4,
              "extendNext": 0,
              "handOver": "UI_paota"
            },
            4: {
              "targetPos": this.guideList["UI_shirenhua1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_shirenhua1"],
              "isGuideComplate": false,
              "nextStep": 5,
              "extendNext": 0,
              "handOver": "UI_shirenhua"
            },
            5: {
              "targetPos": this.guideList["UI_jiachong1"].worldPosition.clone(),
              "targetNode": this.guideList["UI_jiachong1"],
              "isGuideComplate": false,
              "nextStep": 6,
              "extendNext": 0,
              "handOver": "UI_jiachong"
            },
            6: {
              "targetPos": this.guideList["UI_juma-0011"].worldPosition.clone(),
              "targetNode": this.guideList["UI_juma-0011"],
              "isGuideComplate": false,
              "nextStep": 0,
              "extendNext": 0,
              "handOver": "UI_juma-001"
            },
            7: {
              "targetPos": this.guideList["UI_jiachong-0011"].worldPosition.clone(),
              "targetNode": this.guideList["UI_jiachong-0011"],
              "isGuideComplate": false,
              "nextStep": 0,
              "extendNext": 0,
              "handOver": "UI_jiachong-001"
            }
          };
          this.guideStepJson = guideStepJson;
        }

        setGuideStepCompLate(num) {
          this.guideStepJson[num].isGuideComplate = true;
        }

        setNextGuideStep(num) {
          this.guideCurStep = num;
        }

        nexStep(nextStep) {
          if (nextStep === void 0) {
            nextStep = 0;
          }

          if (nextStep == 0) {
            this.guideCurStep = this.guideStepJson[this.guideCurStep].nextStep;
          } else {
            this.guideCurStep = this.guideStepJson[this.guideCurStep].extendNext;
          }
        }

        nexPhase() {
          this.guidePhase += 1;
        }

        // resetTargetEnemy(){
        //     this.currentTargetEnemy = null;
        // }
        checkRange() {
          // 1. 先检查当前锁定的敌人是否有效（存在且未死亡）
          if (this.currentTarget && this.currentTarget.parent == (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.coinParent) {
            return this.currentTarget;
          } // 2. 若当前目标无效，重新查找最近的存活敌人


          var minDis = Number.MAX_VALUE;
          var minCoin = null;
          var coinList = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.coinParent.children;

          for (var i = 0; i < coinList.length; i++) {
            var coin = coinList[i]; // 跳过已销毁的节点

            if (!coin.isValid) continue;
            var randomIndex = Math.floor(Math.random() * 4);
            var pos = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.moveEndBlockPos.children[randomIndex].worldPosition;
            var selfPos = coin.worldPosition.clone(); // // 计算两点到世界原点的距离
            // const posDistance = pos.length();
            // const selfDistance = selfPos.length();
            // const isFartherFromOrigin = posDistance > selfDistance;
            // if (isFartherFromOrigin) {
            //     this.node.setWorldPosition(pos);
            // }
            // 获取自身前方向量（假设Z轴为前）

            var forward = coin.forward; // 计算目标相对于自身的向量

            var toTarget = pos.clone().subtract(selfPos); // 点积判断是否在前方（大于0为前方）

            var isInFront = toTarget.dot(forward) < 1.5;

            if (isInFront) {
              continue;
            } // 计算与玩家的距离


            var enemyPos = coin.worldPosition.clone();
            var playerPos = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).playerController.getPlayer().node.worldPosition.clone();
            var distance = enemyPos.subtract(playerPos).length(); // 记录最近的敌人

            if (distance < minDis) {
              minDis = distance;
              minCoin = coin;
            }
          } // 3. 更新当前锁定的敌人


          this.currentTarget = minCoin; // 4. 返回目标位置（若无敌人则返回玩家位置）

          return minCoin;
        }

        update(dt) {
          if (!(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isCameraMoveEnd) return; // 无需引导时直接返回

          if (this.guideCurStep === -1 || this.guideCurStep === 0) return; // 缓存当前步骤数据

          var currentStep = this.guideStepJson[this.guideCurStep]; // 提取箭头控制通用方法

          var showArrow = targetPos => {
            var _this$arrow3dComp, _this$arrowPath;

            this.arrow3dComp.setActive(true);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.guideParent.active = true;
            (_this$arrow3dComp = this.arrow3dComp) == null || _this$arrow3dComp.playFloatingEffect(dt, targetPos);
            var vv3 = new Vec3(targetPos.x, targetPos.y + 2, targetPos.z);
            (_this$arrowPath = this.arrowPath) == null || _this$arrowPath.createArrowPathTo(vv3);
          };

          var hideArrow = () => {
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.guideParent.active = false;
            this.arrow3dComp.setActive(false);
          };

          switch (this.guidePhase) {
            case 1:
              // 第一阶段：引导解锁箭塔
              if (!currentStep.isGuideComplate && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).playerController.getPlayer().coinNum > 0) {
                showArrow(currentStep.targetPos);
              } else {
                hideArrow();
              }

              break;

            case 2:
              // 第二阶段：引导解锁拒马
              var handOverNam = currentStep.handOver;
              var lockCoin = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[handOverNam].maxCoin - (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[handOverNam].curCoin;

              if (!currentStep.isGuideComplate && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).playerController.getPlayer().coinNum >= lockCoin && !(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).isBlock) {
                showArrow(currentStep.targetPos);
              } else {
                var targetPos = this.checkRange();
                targetPos instanceof Node ? showArrow(targetPos.worldPosition.clone()) : hideArrow();
              }

              break;

            case 3: // 第三阶段：引导拒马炮塔

            case 4:
              // 第四阶段：引导甲虫兵营
              var step2 = this.guideStepJson[2];
              var handOverNam1 = currentStep.handOver;
              var lockCoin1 = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[handOverNam1].maxCoin - (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[handOverNam1].curCoin;
              var lockCoin2 = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[step2.handOver].maxCoin - (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[step2.handOver].curCoin;

              if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).blockLockNum < 2 && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).mapShowController.reunBlock1() && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).playerController.getPlayer().coinNum >= lockCoin2) {
                showArrow(step2.targetPos);
              } else if (!currentStep.isGuideComplate && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).playerController.getPlayer().coinNum >= lockCoin1) {
                showArrow(currentStep.targetPos);
              } else {
                var _targetPos = this.checkRange();

                _targetPos instanceof Node ? showArrow(_targetPos.worldPosition.clone()) : hideArrow();
              }

              break;

            case 5:
              // 第五阶段：引导之终点拒马
              var step22 = this.guideStepJson[2];
              var lockCoin22 = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[step22.handOver].maxCoin - (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[step22.handOver].curCoin;
              var step6 = this.guideStepJson[7];
              var lockCoin3 = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[step6.handOver].maxCoin - (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[step6.handOver].curCoin;
              var handOverNam2 = currentStep.handOver;
              var lockCoin11 = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[handOverNam2].maxCoin - (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).handVoer[handOverNam2].curCoin; // if (GlobeVariable.blockLockNum < 2 && App.mapShowController.reunBlock1() && App.playerController.getPlayer().coinNum >= lockCoin22) {
              //     showArrow(step22.targetPos);
              // } else 

              if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).beetleLockNum < 2 && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).mapShowController.retunBeetle1() && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).playerController.getPlayer().coinNum >= lockCoin3) {
                showArrow(step6.targetPos);
              } else if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).beetleLockNum >= 2 && !currentStep.isGuideComplate && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).playerController.getPlayer().coinNum >= lockCoin11) {
                showArrow(currentStep.targetPos);
              } else {
                var _targetPos2 = this.checkRange();

                _targetPos2 instanceof Node ? showArrow(_targetPos2.worldPosition.clone()) : hideArrow();
              }

              break;
          }
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e30939ca7b3b461f0ed5d7140c0b899ad5873732.js.map