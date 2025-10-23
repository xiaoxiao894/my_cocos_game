System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Node, tween, Vec3, Animation, Sprite, find, BoxCollider, RigidBody, Camera, GlobeVariable, App, SoundManager, GameEndManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, MapShowController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "./core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "./App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "./core/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEndManager(extras) {
    _reporterNs.report("GameEndManager", "./UI/GameEndManager", _context.meta, extras);
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
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Animation = _cc.Animation;
      Sprite = _cc.Sprite;
      find = _cc.find;
      BoxCollider = _cc.BoxCollider;
      RigidBody = _cc.RigidBody;
      Camera = _cc.Camera;
    }, function (_unresolved_2) {
      GlobeVariable = _unresolved_2.GlobeVariable;
    }, function (_unresolved_3) {
      App = _unresolved_3.App;
    }, function (_unresolved_4) {
      SoundManager = _unresolved_4.SoundManager;
    }, function (_unresolved_5) {
      GameEndManager = _unresolved_5.GameEndManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "80814rZqn9LJbULsGsEPGsW", "MapShowController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node', 'tween', 'Vec3', 'Animation', 'Sprite', 'find', 'BoxCollider', 'RigidBody', 'Camera', 'Quat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MapShowController", MapShowController = (_dec = ccclass('MapShowController'), _dec2 = property({
        type: Node,
        tooltip: "建筑物父类Cons"
      }), _dec3 = property({
        type: Node,
        tooltip: "建筑物 解锁区域父类UIPos"
      }), _dec4 = property({
        type: Camera,
        tooltip: "记录主摄像机"
      }), _dec5 = property({
        type: Node,
        tooltip: "记录玩家节点"
      }), _dec6 = property({
        type: Node,
        tooltip: " 箭头引导"
      }), _dec7 = property({
        type: Animation,
        tooltip: "结束坍塌动画"
      }), _dec(_class = (_class2 = class MapShowController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "buidingParent", _descriptor, this);

          _initializerDefineProperty(this, "buidingAreaParent", _descriptor2, this);

          _initializerDefineProperty(this, "mianCamera", _descriptor3, this);

          _initializerDefineProperty(this, "player", _descriptor4, this);

          _initializerDefineProperty(this, "arrowGuide", _descriptor5, this);

          _initializerDefineProperty(this, "playerAnim", _descriptor6, this);

          //显示模型
          this.arrowTower = null;
          //箭塔模型
          this.turret = null;
          //炮塔模型
          this.block1 = null;
          //拦截拒马
          this.block2 = null;
          //拦截拒马
          this.beetle = null;
          // Beetle模型
          this.flower = null;
          //花模型
          this.attackFlower = null;
          //攻击的花
          //解锁区域 
          this.arrowTowerArea = null;
          //箭塔模型
          this.turretArea = null;
          //炮塔模型
          this.block1Area = null;
          //拦截拒马
          this.block2Area = null;
          //拦截拒马
          this.beetleArea = null;
          // Beetle 甲虫骑士兵营
          this.beetleArea1 = null;
          // Beetle 甲虫骑士
          this.attackFlowerArea = null;
          //攻击的花
          this.bubble = null;
          // 兵营气泡
          this.mainCameraPos = null;
          this.mainCameraRot = null;
          this.playerPos = null;
          this.playerRot = null;
          this.curCameraPos = new Vec3();
        }

        onLoad() {
          //模型
          this.arrowTower = this.buidingParent.getChildByName("jianta");
          this.turret = this.buidingParent.getChildByName("paota");
          this.block1 = this.buidingParent.getChildByName("juma01");
          this.block2 = this.buidingParent.getChildByName("juma02");
          this.beetle = this.buidingParent.getChildByName("jiachong");
          this.flower = this.buidingParent.getChildByName("hua");
          this.attackFlower = this.buidingParent.getChildByName("shirenhua"); //解锁区域

          this.arrowTowerArea = this.buidingAreaParent.getChildByName("UI_jianta");
          this.turretArea = this.buidingAreaParent.getChildByName("UI_paota");
          this.block1Area = this.buidingAreaParent.getChildByName("UI_juma");
          this.block2Area = this.buidingAreaParent.getChildByName("UI_juma-001");
          this.beetleArea = this.buidingAreaParent.getChildByName("UI_jiachong");
          this.beetleArea1 = this.buidingAreaParent.getChildByName("UI_jiachong-001");
          this.attackFlowerArea = this.buidingAreaParent.getChildByName("UI_shirenhua");
          this.bubble = this.buidingAreaParent.getChildByName("qipao");
          this.bubble.active = false;
          this.beetleArea1.active = false;
          this.showLable(); // 记录初始位置和旋转

          this.mainCameraPos = this.mianCamera.node.position.clone();
          this.mainCameraRot = this.mianCamera.node.rotation.clone();
          this.playerPos = this.player.position.clone();
          this.playerRot = this.player.rotation.clone();
        }

        guildMoveCamera() {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isBeetleGuild) {
            return;
          }

          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isBeetleGuild = true;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isJoyStickBan = true;
          this.curCameraPos = this.mianCamera.node.position.clone();
          tween(this.mianCamera.node).to(1.5, {
            position: new Vec3(156.87, 111, 27.13)
          }).to(0.8, {
            position: new Vec3(156.87, 111, 27.13)
          }) // 添加1秒延时
          .to(1.5, {
            position: this.curCameraPos
          }).call(() => {
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isJoyStickBan = false; // 箭头引导

            this.arrowGuide.active = true;
            this.arrowGuide.getComponent(Animation).play("endArrowAni"); //this.mianCamera.node.position = this.curCameraPos;
          }).start();
        }

        continueGame() {
          // 恢复初始位置和旋转
          this.mianCamera.node.setPosition(this.mainCameraPos);
          this.mianCamera.node.setRotation(this.mainCameraRot);
          this.player.setPosition(this.playerPos);
          this.player.setRotation(this.playerRot);
          this.arrowTower.active = false;
          let arrowTowerModel = this.arrowTower.getChildByName("HuoChaiHeJiaTa").getChildByName("model").getChildByName("L_prp_HuoChaiHe_jt_Skin_V001");
          arrowTowerModel.getChildByName("HuoChaiHe").getChildByName("HuoChaiGun").active = true;
          this.turret.active = false;
          this.block1.active = false;
          this.block2.active = false;
          this.beetle.active = false;
          this.attackFlower.active = false;
          this.arrowTowerArea.active = true;
          this.turretArea.active = false;
          this.block1Area.active = false;
          this.block2Area.active = false;
          this.beetleArea.active = false;
          this.beetleArea1.active = false;
          this.attackFlowerArea.active = false;
          this.bubble = this.buidingAreaParent.getChildByName("qipao");
          this.bubble.active = false;
          this.beetleArea1.active = false;
          this.continueShowLable(); // 调用函数处理不同路径的物体

          this.disableColliderAndRigidBody("Physice/UI_paota");
          this.disableColliderAndRigidBody("Physice/UI_jianta");
          this.disableColliderAndRigidBody("Physice/UI_jiachong");
        } // 定义一个通用函数来禁用物体的碰撞器和刚体


        disableColliderAndRigidBody(path) {
          const obj = find(path);
          if (!obj) return;
          const collider = obj.getComponent(BoxCollider);
          if (collider) collider.enabled = false;
          const rigidBody = obj.getComponent(RigidBody);
          if (rigidBody) rigidBody.enabled = false;
        }

        continueShowLable() {
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handOverArea.forEach(element => {
            const passData = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).handVoer[element];
            let nodes = this.buidingAreaParent.getChildByName(element);

            if (nodes) {
              var _nodes$getChildByName;

              let lab = (_nodes$getChildByName = nodes.getChildByName("UnlockTileLabel")) == null ? void 0 : _nodes$getChildByName.getComponent(Label);
              lab.string = passData.maxCoin + "";
              let sp = nodes.getChildByName("progress").getComponent(Sprite);
              sp.fillRange = 0;
            } // passData.isShow = true;
            // passData.showCoin = passData.maxCoin;

          });
          this.bubble.getChildByName("qipao").getChildByName("UnlockTileLabel-001").getComponent(Label).string = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer["UI_jiachong-001"].maxCoin + "";
        }

        bubbleAniSpeed(speed = 0.7) {
          let ani = this.bubble.getComponent(Animation);
          let state = ani.getState("qipaohuxi");

          if (state) {
            state.speed = speed;
          }

          ani.play("qipaohuxi");
        }

        showLable() {
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handOverArea.forEach(element => {
            const passData = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).handVoer[element];
            let nodes = this.buidingAreaParent.getChildByName(element);

            if (nodes) {
              var _nodes$getChildByName2;

              let lab = (_nodes$getChildByName2 = nodes.getChildByName("UnlockTileLabel")) == null ? void 0 : _nodes$getChildByName2.getComponent(Label);
              lab.string = passData.maxCoin + "";
            } // passData.isShow = true;
            // passData.showCoin = passData.maxCoin;

          });
          this.bubble.getChildByName("qipao").getChildByName("UnlockTileLabel-001").getComponent(Label).string = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer["UI_jiachong-001"].maxCoin + "";
        }

        setBubbleLable() {
          let remaining = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer["UI_jiachong-001"].maxCoin - (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer["UI_jiachong-001"].showCoin; //passData.curCoin;
          // 处理边界值

          remaining = Math.max(0, remaining);
          this.bubble.getChildByName("qipao").getChildByName("UnlockTileLabel-001").getComponent(Label).string = remaining + "";
          let sp = this.bubble.getChildByName("qipao").getChildByName("qipao-001").getComponent(Sprite);
          sp.fillRange = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer["UI_jiachong-001"].showCoin / (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer["UI_jiachong-001"].maxCoin;
        }

        start() {
          this.buidingAreaParent.children.forEach(element => {
            element.active = false;
          });
          this.buidingParent.children.forEach(element => {
            element.active = false;
          });
          this.arrowTower.active = true;
          this.scheduleOnce(() => {
            this.arrowTower.active = false;
          }, 0);
          this.flower.active = true;
          this.arrowTowerArea.active = true; //临时功能
          // this.attackFlower.active = true;
        }

        reunBlock1() {
          return this.block1Area.active;
        }

        retunBeetle1() {
          return this.beetleArea1.active;
        }

        restBlock1() {
          this.block1Area.active = true;
          const sp = this.block1Area.getChildByName("progress").getComponent(Sprite);
          const lb = this.block1Area.getChildByName("UnlockTileLabel").getComponent(Label); // 缓存当前关卡数据

          const passData = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer[this.block1Area.name];
          passData.curCoin = 0;
          passData.showCoin = 0; //passData.curCoin;

          sp.fillRange = 0;
          lb.string = passData.maxCoin + "";
        } //显示甲虫的气泡


        showBeetleBubble() {
          this.bubble.active = true;
          this.bubbleAniSpeed(); //  this.bubble.getChildByName("qipao_red").active = false;

          this.beetleArea1.active = true;
        } //显示甲虫的气泡


        hideBeetleBubble(areaName) {
          // 缓存当前关卡数据
          const passData = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer[areaName];
          passData.curCoin = 0;
          passData.showCoin = 0; //passData.curCoin;

          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleIsMove = true;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleLockNum++;
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.playAudio("jiachongchongfenghao");
          this.bubble.active = false; //this.bubble.getChildByName("qipao_red").active = true;

          this.beetleArea1.active = false;
          let sp = this.bubble.getChildByName("qipao").getChildByName("qipao-001").getComponent(Sprite);
          sp.fillRange = 0;
          this.bubble.getChildByName("qipao").getChildByName("UnlockTileLabel-001").getComponent(Label).string = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).handVoer["UI_jiachong-001"].maxCoin + "";
        } //显示拦截拒马解锁区域


        showUIBlock1Area() {
          this.block1Area.active = true;
        }

        showUIBlock2Area() {
          this.block2Area.active = true;
        } //甲虫骑士解锁区域


        showUIBeetleArea() {
          this.beetleArea.active = true;
        } //攻击的花解锁区域  


        showUIAttackFlowerArea() {
          this.attackFlowerArea.active = true;
        } //箭塔解锁区域


        showUIArrowTowerArea() {
          this.arrowTowerArea.active = true;
        } //炮塔解锁区域


        showUITurretArea() {
          this.turretArea.active = true;
        }

        cameraMove() {
          this.curCameraPos = this.mianCamera.node.position.clone();
          tween(this.mianCamera.node).to(1.5, {
            position: new Vec3(118, 111, 66)
          }).to(1.5, {
            position: this.curCameraPos
          }).call(() => {
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isJoyStickBan = false; //this.mianCamera.node.position = this.curCameraPos;
          }).start();
        }
        /**
         * 显示区域建筑
         * @param areaName 区域名称
         */


        showUIBuiding(areaName) {
          if (areaName == "UI_jianta") {
            //解锁箭塔后显示拒马交付区域
            const jiantou = find("Physice/UI_jianta");
            const collider = jiantou.getComponent(BoxCollider);

            if (collider) {
              collider.enabled = true;
            }

            const rigidBody = jiantou.getComponent(RigidBody);

            if (rigidBody) {
              rigidBody.enabled = true;
            }

            this.arrowTower.active = true;
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("jiesuo");
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isStartGame = true;
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.enemyParent.active = true;
            this.showUIBlock1Area();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.setGuideStepCompLate(1);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.nexStep();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.nexPhase();
          }

          if (areaName == "UI_juma") {
            this.block1.active = true;
            this.block1.getComponent(Animation).play("juma01chuxian");
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("jiesuo");
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isBlock = true;

            if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isFirstBlock) {
              this.showUITurretArea();
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).guideManager.setGuideStepCompLate(2);
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).guideManager.nexStep();
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).guideManager.nexPhase();
            }

            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).blockLockNum++;
          }

          if (areaName == "UI_paota") {
            const jiantou = find("Physice/UI_paota");
            const collider = jiantou.getComponent(BoxCollider);

            if (collider) {
              collider.enabled = true;
            }

            const rigidBody = jiantou.getComponent(RigidBody);

            if (rigidBody) {
              rigidBody.enabled = true;
            }

            this.turret.active = true;
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("jiesuo");
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).enemySpiderNumBig = 3;
            this.showUIAttackFlowerArea();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.setGuideStepCompLate(3);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.nexStep(); // App.guideManager.nexPhase();
          }

          if (areaName == "UI_juma-001") {
            //this.block2.active = true;
            this.playerAnim.play("endAni");
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("jiesuo");
            setTimeout(() => {
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).sceneNode.GameEnd.active = true;
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).sceneNode.GameEnd.getComponent(_crd && GameEndManager === void 0 ? (_reportPossibleCrUseOfGameEndManager({
                error: Error()
              }), GameEndManager) : GameEndManager).showGameEnd(1);
            }, 2000);
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isGameEnd = true;
          }

          if (areaName == "UI_jiachong") {
            const jiantou = find("Physice/UI_jiachong");
            const collider = jiantou.getComponent(BoxCollider);

            if (collider) {
              collider.enabled = true;
            }

            const rigidBody = jiantou.getComponent(RigidBody);

            if (rigidBody) {
              rigidBody.enabled = true;
            }

            this.beetle.active = true;
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("jiesuo");
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).beetleIsMove = true;
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("jiachongchongfenghao");
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).beetleLockNum++;
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.setGuideStepCompLate(5);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.nexStep();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.nexPhase();
          }

          if (areaName == "UI_jiachong-001") {
            this.hideBeetleBubble(areaName);
            this.showUIBlock2Area();
            this.guildMoveCamera();
          }

          if (areaName == "UI_shirenhua") {
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("jiesuo");
            this.attackFlower.active = true;
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isJoyStickBan = true;
            this.showUIBeetleArea();
            this.cameraMove();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.setGuideStepCompLate(4);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.nexStep();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.nexPhase(); // GlobeVariable.beetleLockNum++;
            // this.hideBeetleBubble(areaName);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "buidingParent", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "buidingAreaParent", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "mianCamera", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "player", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "arrowGuide", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "playerAnim", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=bab66546573182385f406604304e4fc98d2d042c.js.map