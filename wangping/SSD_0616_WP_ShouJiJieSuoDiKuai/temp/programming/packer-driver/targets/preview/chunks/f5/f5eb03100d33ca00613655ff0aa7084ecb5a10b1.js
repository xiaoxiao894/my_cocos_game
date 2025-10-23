System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Node, Sprite, Animation, Material, MeshRenderer, tween, eventMgr, EventType, EnemyTree, Global, GroundEffct, enemyCharacter, treeController, playerController, super_html_playable, BubbleFead, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _crd, ccclass, property, google_play, appstore, WorldMap;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../core/EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyTree(extras) {
    _reporterNs.report("EnemyTree", "../entitys/EnemyTree", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBehaviourType(extras) {
    _reporterNs.report("BehaviourType", "../entitys/Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "../core/Global", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGroundEffct(extras) {
    _reporterNs.report("GroundEffct", "../GroundEffct", _context.meta, extras);
  }

  function _reportPossibleCrUseOfenemyCharacter(extras) {
    _reporterNs.report("enemyCharacter", "../entitys/enemyCharacter", _context.meta, extras);
  }

  function _reportPossibleCrUseOftreeController(extras) {
    _reporterNs.report("treeController", "./TreeController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfplayerController(extras) {
    _reporterNs.report("playerController", "./PlayerController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "../../super_html_playable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBubbleFead(extras) {
    _reporterNs.report("BubbleFead", "../BubbleFead", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      Animation = _cc.Animation;
      Material = _cc.Material;
      MeshRenderer = _cc.MeshRenderer;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      eventMgr = _unresolved_2.eventMgr;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
    }, function (_unresolved_4) {
      EnemyTree = _unresolved_4.EnemyTree;
    }, function (_unresolved_5) {
      Global = _unresolved_5.Global;
    }, function (_unresolved_6) {
      GroundEffct = _unresolved_6.GroundEffct;
    }, function (_unresolved_7) {
      enemyCharacter = _unresolved_7.enemyCharacter;
    }, function (_unresolved_8) {
      treeController = _unresolved_8.treeController;
    }, function (_unresolved_9) {
      playerController = _unresolved_9.playerController;
    }, function (_unresolved_10) {
      super_html_playable = _unresolved_10.default;
    }, function (_unresolved_11) {
      BubbleFead = _unresolved_11.BubbleFead;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b6ba4O3HP1GF4A8jPUiZJGQ", "WorldMap", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'Label', 'Node', 'Sprite', 'Animation', 'Vec3', 'Quat', 'Material', 'MeshRenderer', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);
      google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
      appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";

      _export("WorldMap", WorldMap = (_dec = ccclass('WorldMap'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(_crd && GroundEffct === void 0 ? (_reportPossibleCrUseOfGroundEffct({
        error: Error()
      }), GroundEffct) : GroundEffct), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property({
        type: Node,
        tooltip: "birshPos1"
      }), _dec13 = property(Material), _dec14 = property(Material), _dec15 = property({
        type: Node,
        tooltip: "endPos1"
      }), _dec16 = property({
        type: Node,
        tooltip: "enemySelfPos1"
      }), _dec17 = property({
        type: Node,
        tooltip: "cornPos1"
      }), _dec18 = property({
        type: Node,
        tooltip: "enemyHandOverPos1"
      }), _dec19 = property({
        type: Node,
        tooltip: "gameOverPos1"
      }), _dec20 = property(Node), _dec(_class = (_class2 = class WorldMap extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "mainCamera", _descriptor, this);

          _initializerDefineProperty(this, "greenScript", _descriptor2, this);

          _initializerDefineProperty(this, "greenScript_1", _descriptor3, this);

          _initializerDefineProperty(this, "treeArrow", _descriptor4, this);

          _initializerDefineProperty(this, "upgradeNodep", _descriptor5, this);

          this.isShowUpgradeNodep = false;

          _initializerDefineProperty(this, "upgradeNodep1", _descriptor6, this);

          _initializerDefineProperty(this, "GroundEffect", _descriptor7, this);

          _initializerDefineProperty(this, "enemyParent", _descriptor8, this);

          _initializerDefineProperty(this, "characterParent", _descriptor9, this);

          _initializerDefineProperty(this, "treeParentNode", _descriptor10, this);

          //出生点 和第一地块交付的位置 //
          _initializerDefineProperty(this, "birthNodes", _descriptor11, this);

          _initializerDefineProperty(this, "materialHouseBase", _descriptor12, this);

          _initializerDefineProperty(this, "meterialHouseChange", _descriptor13, this);

          //结束点传送点  暂时没有用 后续看需要
          _initializerDefineProperty(this, "endNodes", _descriptor14, this);

          _initializerDefineProperty(this, "enemySelfLanPos", _descriptor15, this);

          //玉米地占位点
          _initializerDefineProperty(this, "cronNodesPos", _descriptor16, this);

          //人物交付时候所站的位置
          _initializerDefineProperty(this, "enemyHandOverPos", _descriptor17, this);

          //游戏结束时候四散的位置
          _initializerDefineProperty(this, "allCharacterPos", _descriptor18, this);

          this.upgradeUIAnmationTree = null;
          this.upgradeUIAnmationEnemy = null;
          this.changeAnimation = null;

          _initializerDefineProperty(this, "gameEndUI", _descriptor19, this);

          this.isComplate = false;
          this.isAniTrue = false;
        }

        start() {
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_google_play_url(google_play);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_app_store_url(appstore);
          this.upgradeUIAnmationEnemy = this.upgradeNodep1.getComponent(Animation);
          this.upgradeUIAnmationTree = this.upgradeNodep.getComponent(Animation);
          this.initAll();
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playBgMusic();
        }

        initAll() {
          (_crd && treeController === void 0 ? (_reportPossibleCrUseOftreeController({
            error: Error()
          }), treeController) : treeController).initAllTree(this.treeParentNode);
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).initCharacters(this.characterParent, this.birthNodes, this.endNodes, this.cronNodesPos, this.enemyHandOverPos, this.allCharacterPos, this.enemySelfLanPos);
          this.onListenerEvent();
        }

        onListenerEvent() {
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_MOVE_TREE, this.moveTreeCallBack);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_MOVE_HAND_OVER, this.moveHandOver.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_HAND_OVER_ADD, this.updateHandOverProgress.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_TREE_COMPLATE, this.treeUpgradeComplate.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_TREE_TRANSMIT, this.treeTransmitCallback.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_CORN_CUT, this.cornCutCallback.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_ENEMY_TRANSMIT, this.enemyTransmitCallback.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_ENEMY_DIE, this.enemyDieCallback.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_ENEMY_HAND_OVER, this.enemyHandOverCallback.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_CORNHAND_OVER_ADD, this.enemyHandeOverAdd.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_CORN_COMPLATE, this.enemyHandOverComplate.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_CLICK_ENEMY, this.clickEnemyAttack.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_SHOW_TREEHANDE, this.showTreeHande.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_ALL_DIE, this.allDieCallback.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).SHOW_ENEMY, this.showCallBack.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).GAME_OVER, this.gameOver.bind(this));
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ENTITY_HAND_OVER_NO, this.handoverNo.bind(this));
        }

        handoverNo() {
          this.treeParentNode.children.forEach(item => {
            if (item.active) {
              var enemy = item.getComponent(_crd && EnemyTree === void 0 ? (_reportPossibleCrUseOfEnemyTree({
                error: Error()
              }), EnemyTree) : EnemyTree);

              if (enemy.animationNum < 4) {
                item.getComponent(_crd && EnemyTree === void 0 ? (_reportPossibleCrUseOfEnemyTree({
                  error: Error()
                }), EnemyTree) : EnemyTree).setFindState(true);
                console.log("enemy.animationNum enemy.animationNum ", enemy.animationNum);
                item.getChildByName("UI_famuzhiyin").getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                  error: Error()
                }), BubbleFead) : BubbleFead).Show1(enemy.curCollectNum);
              }
            }
          });
        }

        showCallBack() {
          var houseMaterial = this.GroundEffect.enemyLandHouse.getChildByName("shengjiqian").getChildByName("posun").getComponent(MeshRenderer);
          tween(houseMaterial.node) // 定义要重复的动作序列：切换材质→等待→切回材质→等待
          .sequence( // 切换到目标材质
          tween().call(() => {
            houseMaterial.material = this.meterialHouseChange;
          }), // 等待 0.2 秒
          tween().delay(0.2), // 切回原材质
          tween().call(() => {
            houseMaterial.material = this.materialHouseBase;
          }), // 等待 0.2 秒（与切换时间对称）
          tween().delay(0.2)) // 重复整个序列 3 次
          .repeat(5) // 启动 tween
          .start(); //houseMaterial.material = this.meterialHouseChange;

          if (!this.enemyParent.active) {
            this.enemyParent.active = true; //  this.scheduleOnce(()=>{
            //  },1.2)
          }
        }

        gameOver() {
          this.scheduleOnce(() => {
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).isClickUpgrade = true;
            var red = this.upgradeNodep1.getChildByName("2dNode").getChildByName("scaleNode").getChildByName("Sprite-red");
            red.active = false;

            if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeUIAnimtion != 3) {
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).upgradeUIAnimtion = 3;
            }

            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).soundManager.playShatterSound();
            var ani = this.upgradeNodep1.getChildByName("TX_posun");
            ani.active = true;

            if (!this.isAniTrue) {
              this.isAniTrue = true;
              ani.getComponent(Animation).play();
              ani.getComponent(Animation).once(Animation.EventType.FINISHED, () => {
                this.upgradeNodep1.getChildByName("UI_ZYXS").active = true;
              });
            }
          }, 1);
        }

        allDieCallback() {
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).allCharacterHanover();
        } ///////////////////////////////////第一个地块的操作
        //移动到目标点树


        moveTreeCallBack(target, behaviourType) {
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).squenceMove(target, behaviourType);
        } //移动到树交付的目标点


        moveHandOver(target, behaviourType) {
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).squenceHandOver(target, behaviourType);
        }

        showTreeHande() {
          this.upgradeNodep.getChildByName("UI_ZYXS").active = true;
        } //交付木材 每次交付回调设置显示进度


        updateHandOverProgress() {
          var sp = this.greenScript.getComponent(Sprite);
          var curNum = sp.node.getParent().getChildByName("Label").getComponent(Label);
          var maxNum = sp.node.getParent().getChildByName("Label-001").getComponent(Label); // 确保数值在有效范围内

          var current = Math.max(0, Math.min((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).treeHandOverNum, (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).treeHandOverNumLimit));
          var max = Math.max(1, (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).treeHandOverNumLimit); // 防止除零错误

          curNum.string = current.toString();
          maxNum.string = "/" + max.toString(); // if(Number(curNum) >= Number(maxNum)){
          //     this.upgradeNodep.getChildByName("UI_ZYXS").active = true;
          // }
          // 计算百分比 (0-1范围)

          var percentage = current / max; // 更新进度条

          sp.fillRange = percentage; // 可选：显示进度文本

          console.log("\u4EA4\u4ED8\u8FDB\u5EA6: " + Math.round(percentage * 100) + "% (" + current + "/" + max + ")");
        } //  交付 数量达到成绩的处理 升级处理


        treeUpgradeComplate() {
          this.upgradeNodep.active = false;
          this.treeParentNode.children.forEach(item => {
            if (item.active) {
              item.getChildByName("UI_famuzhiyin").active = false;
            }
          });
          this.GroundEffect.upgradeTreeHouseAnimation(() => {
            this.GroundEffect.passAnimation1();
            this.scheduleOnce(() => {
              this.treeArrow.active = true;
            }, 2.4);
          });
        } //点击引导按钮人物移动到下一个场景


        treeTransmitCallback(selfNode) {
          this.treeParentNode.children.forEach(item => {
            item.getChildByName("UI_famuzhiyin").active = false;
          });
          this.GroundEffect.ArrowgroundObject2_1.active = true;
          this.GroundEffect.ArrowgroundObject2_2.active = true;
          this.GroundEffect.ArrowgroundObject2_3.active = true;
          this.GroundEffect.ArrowgroundObject2_4.active = true;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isClickUpLandTree = false;
          this.GroundEffect.passAnimation11();
          this.treeArrow.active = false;
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).resetBehaviour();
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).moveCornPos();
        } //////////////////////////////////////第二个地块的操作
        // 点击玉米地块开始收割玉米


        cornCutCallback(selfNode) {
          for (var i = 1; i < (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).clickCornLand.length; i++) {
            if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).clickCornLand[i] == 0) {
              this.GroundEffect["ArrowgroundObject2_" + i].getChildByName("UI_ZYXS").active = true;
              break;
            }
          } // this.GroundEffect.ArrowgroundObject2_2.active = true;
          // this.GroundEffect.ArrowgroundObject2_3.active = true;
          // this.GroundEffect.ArrowgroundObject2_4.active = true;


          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).cutCornController(selfNode, this.GroundEffect);
        } // 玉米收割完 点击 传送按钮  摄像机操作 人物进入有怪物的地块


        enemyTransmitCallback(selfNode) {
          this.upgradeNodep1.active = true;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).upgradeAnimationgPlayTyep = 2;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).upgradeUIAnimtion = 1;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isStartMoveEnemyLand = true;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isClickUpLandCorn = false;
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).resetBehaviour();
          this.schedule(() => {
            this.GroundEffect.hideCornArrow();
          }, 3);
          this.GroundEffect.passAnimation21(); //直接寻找敌人之后攻击的操作 后续有需要解开注释
          //playerController.moveFindEnemyPos(this.enemyParent);
          //找到自己的占位点

          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).moveFindEnemyLandPos(this.enemyParent);
        } //点击攻击敌人


        clickEnemyAttack(arrowEnemynode) {
          console.log("点击攻击敌人");
          var enemy = arrowEnemynode.getComponent(_crd && enemyCharacter === void 0 ? (_reportPossibleCrUseOfenemyCharacter({
            error: Error()
          }), enemyCharacter) : enemyCharacter);
          var target = enemy.target;
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).attackEnemy(target, enemy);
        } //敌人死亡事件回调 


        enemyDieCallback(cahracter) {
          this.upgradeNodep1.active = true; // this.scheduleOnce(() => {
          //     Global.isClickUpgrade = true;
          // }, 0.5)

          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).warnUI.stopWarnFadeAnimation();
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isClickUpLandTree = true;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isClickEnemy = true;
          this.GroundEffect.showAllTreeClick();
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isEnemyCutTree = true;
        } //怪物死亡点击交付


        enemyHandOverCallback() {
          (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
            error: Error()
          }), playerController) : playerController).moveFindEnemHandOver();
        } //点击交付进度增长


        enemyHandeOverAdd() {
          var sp = this.greenScript_1.getComponent(Sprite); // 确保数值在有效范围内

          var curNum = sp.node.getParent().getChildByName("Label").getComponent(Label);
          var maxNum = sp.node.getParent().getChildByName("Label-001").getComponent(Label); // 确保数值在有效范围内

          var current = Math.max(0, Math.min((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).cornHandOverNum, (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).cornHandOverNumLimit));
          var max = Math.max(1, (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).cornHandOverNumLimit); // 防止除零错误

          curNum.string = current.toString();
          maxNum.string = "/" + max.toString(); // 计算百分比 (0-1范围)

          var percentage = current / max; // 更新进度条

          sp.fillRange = percentage; // 可选：显示进度文本

          console.log("\u4EA4\u4ED8\u8FDB\u5EA6: " + Math.round(percentage * 100) + "% (" + current + "/" + max + ")");
        } //交付完成


        enemyHandOverComplate(character) {
          if (!this.isComplate) {
            this.isComplate = true;
            this.scheduleOnce(() => {
              this.upgradeNodep1.active = false;
            }, 0.1);
            this.scheduleOnce(() => {
              this.GroundEffect.upgradeEnemyHouseAnimation(() => {
                (_crd && playerController === void 0 ? (_reportPossibleCrUseOfplayerController({
                  error: Error()
                }), playerController) : playerController).GameHandOverComplate();
                this.scheduleOnce(() => {
                  this.GroundEffect.passAnimation3();
                  this.gameEndUI.active = true;
                }, 1);
              });
            }, 0.12);
          }

          console.log("CornHandOverComplate");
        }

        update(deltaTime) {
          if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).clickNum == 5 && !this.isShowUpgradeNodep) {
            if (!this.upgradeNodep.active) {
              this.upgradeNodep.active = true;
              this.isShowUpgradeNodep = true;
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).upgradeUIAnimtion = 1;
            }
          }

          if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).upgradeAnimationgPlayTyep == 1) {
            this.changeAnimation = this.upgradeUIAnmationTree;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeAnimationgPlayTyep = 0;
          } else if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).upgradeAnimationgPlayTyep == 2) {
            this.changeAnimation = this.upgradeUIAnmationEnemy;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeAnimationgPlayTyep = 0;
          }

          if (this.upgradeNodep.active || this.upgradeNodep1.active) {
            if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeUIAnimtion == 1) {
              // const anim = this.upgradeNodep.getComponent(Animation);
              this.changeAnimation.stop();
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).upgradeUIAnimtion = 2;
              var animState = this.changeAnimation.getState('SJZY');

              if (!animState || animState.isPlaying) {
                return;
              }

              this.changeAnimation.play('SJZY');
            } else if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeUIAnimtion == 3) {
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).upgradeUIAnimtion = 4; // const anim = this.upgradeNodep.getComponent(Animation);

              this.changeAnimation.stop();

              var _animState = this.changeAnimation.getState('WoodTDAni');

              _animState.speed = 2;

              if (!_animState || _animState.isPlaying) {
                return;
              }

              this.changeAnimation.play('WoodTDAni');
            } else if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeUIAnimtion == 5 || (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeUIAnimtion == 0) {
              //  const anim = this.upgradeNodep.getComponent(Animation);
              this.changeAnimation.stop();

              var _animState2 = this.changeAnimation.getState('WoodTDAni');

              _animState2.speed = 1;
              this.changeAnimation.play('WoodTDAni');
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).upgradeUIAnimtion = -1;
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "greenScript", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "greenScript_1", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "treeArrow", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "upgradeNodep", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "upgradeNodep1", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "GroundEffect", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enemyParent", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "characterParent", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "treeParentNode", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "birthNodes", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "materialHouseBase", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "meterialHouseChange", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "endNodes", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "enemySelfLanPos", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "cronNodesPos", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "enemyHandOverPos", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "allCharacterPos", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "gameEndUI", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f5eb03100d33ca00613655ff0aa7084ecb5a10b1.js.map