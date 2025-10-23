System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Node, v2, Vec2, Vec3, tween, Material, SkinnedMeshRenderer, MeshRenderer, ParticleSystem, SkeletalAnimation, Entity, Simulator, App, GlobeVariable, RVOMath, SoundManager, BooldPaling, RVOUtils, DissolveEffect, Flower, blockRed, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _crd, enemyStateType, ccclass, property, EnemySpider;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "../RVO/Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOMath(extras) {
    _reporterNs.report("RVOMath", "../RVO/Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBlood(extras) {
    _reporterNs.report("Blood", "./Blood", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBooldPaling(extras) {
    _reporterNs.report("BooldPaling", "../BooldPaling", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOUtils(extras) {
    _reporterNs.report("RVOUtils", "../RVO/RVOUtils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDissolveEffect(extras) {
    _reporterNs.report("DissolveEffect", "../../Res/DissolveEffect/scripts/DissolveEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlower(extras) {
    _reporterNs.report("Flower", "./Flower", _context.meta, extras);
  }

  function _reportPossibleCrUseOfblockRed(extras) {
    _reporterNs.report("blockRed", "../blockRed", _context.meta, extras);
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
      v2 = _cc.v2;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      Material = _cc.Material;
      SkinnedMeshRenderer = _cc.SkinnedMeshRenderer;
      MeshRenderer = _cc.MeshRenderer;
      ParticleSystem = _cc.ParticleSystem;
      SkeletalAnimation = _cc.SkeletalAnimation;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
    }, function (_unresolved_3) {
      Simulator = _unresolved_3.Simulator;
    }, function (_unresolved_4) {
      App = _unresolved_4.App;
    }, function (_unresolved_5) {
      GlobeVariable = _unresolved_5.GlobeVariable;
    }, function (_unresolved_6) {
      RVOMath = _unresolved_6.RVOMath;
    }, function (_unresolved_7) {
      SoundManager = _unresolved_7.SoundManager;
    }, function (_unresolved_8) {
      BooldPaling = _unresolved_8.BooldPaling;
    }, function (_unresolved_9) {
      RVOUtils = _unresolved_9.default;
    }, function (_unresolved_10) {
      DissolveEffect = _unresolved_10.DissolveEffect;
    }, function (_unresolved_11) {
      Flower = _unresolved_11.Flower;
    }, function (_unresolved_12) {
      blockRed = _unresolved_12.blockRed;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "57677vBurFBw5ueKgsqX32Y", "EnemySpider", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Quat', 'v2', 'Vec2', 'Vec3', 'Animation', 'tween', 'ProgressBar', 'approx', 'Material', 'SkinnedMeshRenderer', 'Tween', 'MeshRenderer', 'ParticleSystem', 'SkeletalAnimation']); //import { DissolveEffect } from '../../Res/Fbx/materials/DissolveEffect/scripts/DissolveEffect';


      /**
       *   敌人状态用类型限时状态
       *   没有太复杂逻辑 在本类做处理即可
       */
      _export("enemyStateType", enemyStateType = /*#__PURE__*/function (enemyStateType) {
        enemyStateType["Idle"] = "idle";
        enemyStateType["Move"] = "move";
        enemyStateType["Hit"] = "hit";
        enemyStateType["Attack"] = "attack";
        enemyStateType["Die"] = "die";
        enemyStateType["Walk"] = "walk";
        enemyStateType["Track"] = "track";
        return enemyStateType;
      }({}));

      ({
        ccclass,
        property
      } = _decorator);

      _export("EnemySpider", EnemySpider = (_dec = ccclass('EnemySpider'), _dec2 = property(Material), _dec3 = property(Material), _dec4 = property(SkinnedMeshRenderer), _dec5 = property(_crd && DissolveEffect === void 0 ? (_reportPossibleCrUseOfDissolveEffect({
        error: Error()
      }), DissolveEffect) : DissolveEffect), _dec6 = property(Node), _dec7 = property(ParticleSystem), _dec8 = property(ParticleSystem), _dec9 = property(Number), _dec10 = property(Boolean), _dec11 = property(Number), _dec12 = property(Number), _dec(_class = (_class2 = class EnemySpider extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor() {
          super(...arguments);

          // @property(Node)
          // electricParticle: Node = null;
          _initializerDefineProperty(this, "baseMaterial", _descriptor, this);

          _initializerDefineProperty(this, "grayMaterial", _descriptor2, this);

          _initializerDefineProperty(this, "skinnedMeshRenderer", _descriptor3, this);

          _initializerDefineProperty(this, "dissolveEffect", _descriptor4, this);

          _initializerDefineProperty(this, "hitPosNode", _descriptor5, this);

          _initializerDefineProperty(this, "hitParticle", _descriptor6, this);

          _initializerDefineProperty(this, "hitParticle1", _descriptor7, this);

          this.machineState = enemyStateType.Move;
          this._blood = null;
          this.hitRangeV3 = null;
          this.poolName = null;
          this.spiderName = "spider";
          //||rovSpider
          this._bloodOffset = new Vec3(0, 3, 0);
          //最大血量 当前血量
          this._hp = 1;
          this.hp = 1;
          this.maxHp = 1;
          //做预先扣除 防止怪物死亡后仍发射子弹攻击
          this.recordHp = 1;
          this.hitPow = 2;
          this.endIsMove = true;
          //结束后蜘蛛是否可以移动
          this._radius = 1.5;
          //敌人半径
          this._rvoSpeed = 20;
          //敌人速度
          // 是否到达追踪的栅栏
          this.isRvo = false;
          this.blockIndex = 0;
          this.speed = 5;
          this.movePhase = 1;
          this.rvoLastMove = false;
          // 添加属性用于跟踪当前目标点
          this.currentTargetIndex = 0;
          this.dieGray = false;
          //是否死亡灰度
          this.flowerEat = false;
          //是否被花吃了
          this.selfScal = null;

          _initializerDefineProperty(this, "currentIndex", _descriptor8, this);

          _initializerDefineProperty(this, "isInitCraet", _descriptor9, this);

          _initializerDefineProperty(this, "spiderHp", _descriptor10, this);

          _initializerDefineProperty(this, "spiderType", _descriptor11, this);

          // 0 普通蜘蛛 1  大蜘蛛
          this.Idtype = 0;
          this.scheduleId = undefined;
          this.scheduleId1 = undefined;
          this.isAttack = false;
          //是否可以被攻击
          //RVOid
          this._agentHandleId = -1;
          this._walkTween = null;

          /**
          * 在此之前 请确保Simulator run执行完毕
          */
          this._curState = null;
        }

        get agentHandleId() {
          return this._agentHandleId;
        }

        set agentHandleId(value) {
          this._agentHandleId = value;
        }

        setSpiderPos() {
          this.currentTargetIndex = 8;
        }

        start() {
          this.selfScal = this.node.scale.clone();

          if (this.isInitCraet) {
            this.init();
            this.currentTargetIndex = this.currentIndex;
            this._hp = this.spiderHp;
            this.hp = this._hp;
            this.maxHp = this._hp;
            this.recordHp = this._hp;
            this.isAttack = true;

            if (this.spiderType == 0) {
              this.node.getComponent(SkeletalAnimation).getState("walk_f_1").speed = 1.5;
            } else if (this.spiderType == 1) {
              this.node.getComponent(SkeletalAnimation).getState("walk_f_1").speed = 1;
            }
          }
        }

        setHp(hp) {
          this._hp = hp;
          this.hp = hp;
          this.maxHp = hp;
          this.recordHp = hp;
        }
        /** 初始化 */


        init() {
          var data = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dataManager.getMonsterById(1);

          if (data) {
            this._hp = data._hp;
            this.hitPow = data._hitPow;
            this.Idtype = data.Idtype;
          }

          this.reset();
          this.Idtype = 0; //RVOid

          this.agentHandleId = -1;
          this.setMaterByIndex(0, true); //创建血条
          // let bloodNode: Node = App.poolManager.getNode(GlobeVariable.entifyName.BloodBar);
          // bloodNode.parent = App.sceneNode.bloodParent;
          // bloodNode.active = true;
          // this._blood = bloodNode.getComponent(Blood);
          // this._blood?.init(this.maxHp);

          this.blockIndex = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).blockIndex;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).blockIndex++;

          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).blockIndex >= (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.moveBlockPos.children.length) {
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).blockIndex = 0;
          }

          this.move(); //  this.walk();
        }

        setMaterByIndex(matIndex, needReset) {
          if (needReset === void 0) {
            needReset = false;
          }

          if (!this.dissolveEffect) {
            return;
          }

          this.dissolveEffect.forEach(d => {
            d.init();
            var mesh = d.node.getComponent(MeshRenderer);

            if (mesh) {
              var matInstance = mesh.getMaterialInstance(0);

              if (matIndex === 1) {
                matInstance.setProperty('showType', 1.0);
              } else if (matIndex === 0) {
                matInstance.setProperty('showType', 0.0);
                matInstance.setProperty('dissolveThreshold', 0.0);
              } else if (matIndex === 2) {
                matInstance.setProperty('showType', 0.0);
                matInstance.setProperty('dissolveThreshold', 0.0);
                matInstance.setProperty('showTypeGray', 1.0); // this.dieGray = true;
                // d.play(0.8)
              }
            }

            if (needReset) {
              d.reset();
            }
          });
        } //普通的被攻击


        baseHit(attack, bulletPos, hitRange) {
          if (hitRange === void 0) {
            hitRange = 1;
          }

          if (this.hp <= 0) return;
          if (!this.isAttack) return; // this.hitParticle.node.parent.active = true;
          // this.hitParticle.play();

          this.hitRangeV3 = new Vec3(bulletPos.x, bulletPos.y, bulletPos.z);
          this.hitPow = hitRange;
          this.hitEffct();
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.playAudio("zhizhushouji");
          this.setMaterByIndex(1);

          if (this.machineState != enemyStateType.Die) {
            if (this.machineState != enemyStateType.Hit) this.machineState = enemyStateType.Hit;
            this.takeDamage(attack);
            this.setShowHp(attack);
          }

          this.scheduleOnce(() => {
            if (this.dieGray) return;
            this.setMaterByIndex(0);
          }, 0.1);
        }

        hitEffct(back) {
          var _this$hitParticle;

          if (back === void 0) {
            back = null;
          }

          var arrowTx = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.ArrowTX);
          if (!this.hitParticle || !this.hitParticle.node) return;
          arrowTx.parent = (_this$hitParticle = this.hitParticle) == null ? void 0 : _this$hitParticle.node.parent;
          arrowTx.setPosition(this.hitParticle.node.position);
          arrowTx.active = true;
          var particle = arrowTx.getChildByName("jizhong").getComponent(ParticleSystem);
          particle;
          particle.play();
          this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop(); // 3. 可选：手动清除所有粒子（根据引擎特性）

            particle.clear();
            arrowTx.active = false;
            arrowTx.removeFromParent();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.returnNode(arrowTx, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.ArrowTX);

            if (back) {
              back();
            }
          }, 1.5);
        } //普通的被攻击


        baseHit1(attack, bulletPos, hitRange) {
          if (hitRange === void 0) {
            hitRange = 1;
          }

          if (this.hp <= 0) return;
          if (!this.isAttack) return; // this.hitParticle.node.parent.active = true;
          // this.hitParticle.play();

          this.hitRangeV3 = new Vec3(bulletPos.x, bulletPos.y, bulletPos.z);
          this.hitPow = hitRange;
          this.hitEffct1();
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.playAudio("zhizhushouji");
          this.setMaterByIndex(1);

          if (this.machineState != enemyStateType.Die) {
            if (this.machineState != enemyStateType.Hit) this.machineState = enemyStateType.Hit;
            this.takeDamage(attack);
            this.setShowHp(attack);
          }

          this.scheduleOnce(() => {
            if (this.dieGray) return;
            this.setMaterByIndex(0);
          }, 0.1);
        }

        hitEffct1(back) {
          if (back === void 0) {
            back = null;
          }

          var arrowTx = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.BeetleCollideTx);
          arrowTx.parent = this.hitParticle1.node.parent;
          arrowTx.setPosition(this.hitParticle1.node.position);
          arrowTx.active = true;
          var particle = arrowTx.getChildByName("jizhong").getComponent(ParticleSystem);
          particle;
          particle.play();
          this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop(); // 3. 可选：手动清除所有粒子（根据引擎特性）

            particle.clear();
            arrowTx.active = false;
            arrowTx.removeFromParent();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.returnNode(arrowTx, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.BeetleCollideTx);

            if (back) {
              back();
            }
          }, 1.5);
        } //被炮塔攻击的受击


        turretHit(attack, bulletPos, hitRange) {
          if (hitRange === void 0) {
            hitRange = 8;
          }

          if (this.hp <= 0) return;
          if (!this.isAttack) return;
          this.hitRangeV3 = new Vec3(bulletPos.x, bulletPos.y, bulletPos.z);
          this.hitPow = hitRange;
          this.setMaterByIndex(1);

          if (this.machineState != enemyStateType.Die) {
            if (this.machineState != enemyStateType.Hit) this.machineState = enemyStateType.Hit;
            this.takeDamage(attack);
            this.setShowHp(attack);
          }

          this.scheduleOnce(() => {
            if (this.dieGray) return;
            this.setMaterByIndex(0);
          }, 0.1);
        }

        setShowHp(attack) {
          if (!this._blood) {
            return;
          }

          this._blood.node.active = true;

          this._blood.injuryAni(attack);
        } //攻击的事件回调


        attackEvent() {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isBlock) {
            //攻击的拒马存在
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.QianBiJuMa.forEach(item => {
              item.getComponent(_crd && blockRed === void 0 ? (_reportPossibleCrUseOfblockRed({
                error: Error()
              }), blockRed) : blockRed).setRed();
            });
            var blood = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.juma01.getChildByName("BloodPaling");
            blood.getComponent(_crd && BooldPaling === void 0 ? (_reportPossibleCrUseOfBooldPaling({
              error: Error()
            }), BooldPaling) : BooldPaling).subscribeBool();

            if (blood.getComponent(_crd && BooldPaling === void 0 ? (_reportPossibleCrUseOfBooldPaling({
              error: Error()
            }), BooldPaling) : BooldPaling).getBloodHp() <= 0) {
              // App.sceneNode.juma01.removeFromParent();
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).sceneNode.juma01.active = false;
              (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).isBlock = false;
              (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).blockRest = false; // this.scheduleOnce(() => {

              (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).isFirstBlock = false;
              blood.getComponent(_crd && BooldPaling === void 0 ? (_reportPossibleCrUseOfBooldPaling({
                error: Error()
              }), BooldPaling) : BooldPaling).resetBloodHp(); // App.mapShowController.restBlock1();
              // }, 3)

              this.isRvo = false;
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).enemyController.restRvoEnemy();
            }
          }
        }

        /**移动状态 动画*/
        move() {
          if (this.machineState == enemyStateType.Die || !(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isStartGame) return;
          if (this.machineState != enemyStateType.Move) this.machineState = enemyStateType.Move;

          if (!this.characterSkeletalAnimation.getState("walk_f_1").isPlaying) {
            this.characterSkeletalAnimation.play("walk_f_1");
            return;
          }
        } //开始追踪怪


        trackMonster() {
          // 设置 RVO
          var mass = 1;
          var agentId = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.addAgent((_crd && RVOUtils === void 0 ? (_reportPossibleCrUseOfRVOUtils({
            error: Error()
          }), RVOUtils) : RVOUtils).v3t2(this.node.worldPosition.clone()), this._radius, this._rvoSpeed, null, mass);
          var agentObj = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentByAid(agentId);
          agentObj.neighborDist = this._radius * 2.5;
          this.agentHandleId = agentId;
          this.machineState = enemyStateType.Track;
        }

        moveByRvo(dt) {
          if (this.agentHandleId == -1) return;
          var currentPos1 = new Vec3();
          Vec3.copy(currentPos1, this.node.worldPosition); // 获取玩家的世界位置

          var playerPos = new Vec3();
          var block = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.moveBlockPos.children[this.blockIndex];
          block.getWorldPosition(playerPos); // 计算距离

          var distance = Vec3.distance(currentPos1, playerPos); // 如果距离小于等于攻击距离，则执行攻击逻辑

          if (distance <= 2.5) {
            if (this.attack1()) {
              return;
            }
          } else {
            var p = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.getAgentPosition(this.agentHandleId);
            var targetPos = new Vec3(p.x, playerPos.y, p.y);
            var currentPos = this.node.worldPosition.clone();
            var dist = Vec3.distance(currentPos, targetPos);

            if (dist > 1) {
              var smoothFactor = 1;
              Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
              this.node.setWorldPosition(currentPos);
            }
          }
        }
        /**
        * 设置追踪主角的线速度方向和大小
        *  
        */


        setPreferredVelocities(hitPow) {
          if (hitPow === void 0) {
            hitPow = null;
          }

          if (this.agentHandleId < 0) {
            return;
          }

          var agentAid = this.agentHandleId;
          var agent = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentByAid(agentAid);
          var agentPos = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentPosition(agentAid);
          var playerPos = new Vec3();
          var block = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.moveBlockPos.children[this.blockIndex];
          block.getWorldPosition(playerPos);
          var moveTargetPos = v2(playerPos.x, playerPos.z);

          if (hitPow) {
            if (agent && agentPos) {
              var goalVector = moveTargetPos.subtract2f(agentPos.x, agentPos.y);
              goalVector = goalVector.normalize().multiplyScalar(agent.maxSpeed_ * -hitPow);
              (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.setAgentPrefVelocity(agentAid, goalVector);
            }

            return;
          }

          if (agent && agentPos) {
            var _goalVector = moveTargetPos.subtract2f(agentPos.x, agentPos.y);

            if (_goalVector.lengthSqr() > 1.0) {
              _goalVector = _goalVector.normalize().multiplyScalar(agent.maxSpeed_);
            }

            if (_goalVector.lengthSqr() < (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).RVO_EPSILON) {
              (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
            } else {
              (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.setAgentPrefVelocity(agentAid, _goalVector);
            }
          } else {
            console.error("RVO异常::", agent, agentPos, agentAid);
          }
        }

        attack1() {
          if (this.machineState != enemyStateType.Attack) this.machineState = enemyStateType.Attack;

          if (!this.characterSkeletalAnimation.getState("attack01_1").isPlaying) {
            this.characterSkeletalAnimation.play("attack01_1"); // if (this._isArrivePaling) {
            //     GlobeVariable.bearAttackPalingNum_audio++;
            //     if (GlobeVariable.bearAttackPalingNum_audio < 4) {
            //         SoundManager.inst.playAudio("YX_daqiang");
            //     }
            // }

            return true;
          }

          return false;
        }

        updateBloodPos() {
          //同步更新血条位置
          if (this._blood) {
            var bloodPos = new Vec3();
            Vec3.add(bloodPos, this.node.worldPosition.clone(), this._bloodOffset);

            this._blood.node.setWorldPosition(bloodPos);
          }
        }

        bombDie() {
          if (!this.isAttack) return;
          if (this.machineState != enemyStateType.Die) this.machineState = enemyStateType.Die;
          this.isAttack = false;
          this.hitEffct();
          this.scheduleOnce(() => {
            var _this$node, _this$_blood;

            // 1. 从EnemyController的列表中移除自己
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).enemyController.removeEnemy(this);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).enemyController.removeEnemyRvo(this); //  this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {

            this.node.removeFromParent();
            this.node.active = false; // 回收节点到对象池（检查节点有效性）

            if ((_this$node = this.node) != null && _this$node.isValid) {
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).poolManager.returnNode(this.node, this.poolName);
            } // 回收血条节点（检查节点有效性）


            if ((_this$_blood = this._blood) != null && _this$_blood.isValid) {
              //this._blood.node.active = false;
              this._blood = null;
            }

            this.reset(); // if (this.Idtype == 1) {
            //     for (let i = 0; i < 10; i++) {
            //         this.randomPos();
            //     }
            // } else {
            //     for (let i = 0; i < 3; i++) {
            //         this.randomPos();
            //     }
            // }
          }, 0.1);
        }

        attackFlowerDie(followNode) {
          if (this.machineState != enemyStateType.Die) this.machineState = enemyStateType.Die;
          this.isAttack = false;
          this.flowerEat = true;
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.removeEnemy(this);
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.removeEnemyRvo(this);
          tween(this.node).parallel(tween().to(0.5, {
            scale: new Vec3(0, 0, 0)
          }), tween().to(0.5, {
            worldPosition: followNode.worldPosition
          })).call(() => {
            var _this$node2, _this$_blood2;

            this.node.scale = this.selfScal;
            this.node.removeFromParent();
            this.node.active = false;
            this.reset(); // 回收节点到对象池（检查节点有效性）

            if ((_this$node2 = this.node) != null && _this$node2.isValid) {
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).poolManager.returnNode(this.node, this.poolName);
            } // 回收血条节点（检查节点有效性）


            if ((_this$_blood2 = this._blood) != null && _this$_blood2.isValid) {
              //this._blood.node.active = false;
              this._blood = null;
            }
          }).start(); // if(followNode){
          //     this.node.setWorldPosition(followNode.worldPosition);
          // }

          if (this.Idtype == 1) {
            for (var i = 0; i < 10; i++) {
              this.randomPos();
            }
          } else {
            for (var _i = 0; _i < 3; _i++) {
              this.randomPos();
            }
          }
        }

        die(callback) {
          if (this.machineState != enemyStateType.Die) this.machineState = enemyStateType.Die;
          this.isAttack = false;

          if (!this.node.isValid || !this.node) {
            return;
          }

          var currentPos = this.node.getWorldPosition().clone();
          var playerPos = this.hitRangeV3; // 计算击退方向向量

          var goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);
          goalVector = goalVector.normalize().multiplyScalar(-this.hitPow); // 预测击退后的终点

          var knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));
          tween(this.node).by(0.15, {
            position: new Vec3(goalVector.x, 0, goalVector.y)
          }, {
            onUpdate: () => {
              this.updateBloodPos();
            }
          }).start(); // if (!this.characterSkeletalAnimation.getState("die").isPlaying) {
          //     this.characterSkeletalAnimation.play("die");
          //     GlobeVariable.bearDiegNum_audio++;
          //     if (GlobeVariable.bearDiegNum_audio < 4) {
          //         SoundManager.inst.playAudio("YX_xiong");
          //     }
          // }

          if (!this.characterSkeletalAnimation.getState("die_1").isPlaying) {
            this.characterSkeletalAnimation.play("die_1");
          }

          this.scheduleId = this.scheduleOnce(() => {
            this.dieGray = true;
            this.skinnedMeshRenderer.setMaterialInstance(this.grayMaterial, 0); // this.setMaterByIndex(2);

            this.scheduleId1 = this.scheduleOnce(() => {
              var _this$node3, _this$_blood3;

              // 1. 从EnemyController的列表中移除自己
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).enemyController.removeEnemy(this);
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).enemyController.removeEnemyRvo(this); //  this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {

              this.node.removeFromParent();
              this.node.active = false; // 回收节点到对象池（检查节点有效性）

              if ((_this$node3 = this.node) != null && _this$node3.isValid) {
                (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                  error: Error()
                }), App) : App).poolManager.returnNode(this.node, this.poolName);
              } // 回收血条节点（检查节点有效性）


              if ((_this$_blood3 = this._blood) != null && _this$_blood3.isValid) {
                //this._blood.node.active = false;
                this._blood = null;
              }

              this.reset(); // App.dropController.dropItem(this.node.getWorldPosition().clone());

              if (this.Idtype == 1) {
                for (var i = 0; i < 10; i++) {
                  this.randomPos();
                }
              } else {
                for (var _i2 = 0; _i2 < 3; _i2++) {
                  this.randomPos();
                }
              } // });

            }, 0.5);
          }, 0.05);
        }

        randomPos() {
          // 获取原位置并克隆
          var originalPos = this.node.getWorldPosition().clone(); // 生成随机方向向量并归一化

          var randomDir = new Vec3(Math.random() * 2 - 1, // x轴: -1 到 1
          0, // y轴: -1 到 1
          Math.random() * 2 - 1 // z轴: -1 到 1
          ).normalize(); // 计算5单位距离的随机偏移量并添加到原位置

          var randomPos = originalPos.add(randomDir.multiplyScalar(Math.random() * 6));
          var POS = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.coinAreaBan.worldPosition.clone();
          var vDis = Vec3.distance(randomPos, POS);

          if (vDis > 6) {
            // 使用随机位置掉落物品
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).dropController.dropItem(randomPos);
          } else {
            this.randomPos();
          }
        }

        reset() {
          // 清理调度
          if (this.scheduleId !== undefined) {
            this.unschedule(this.scheduleId);
            this.scheduleId = undefined;
          }

          if (this.scheduleId1 !== undefined) {
            this.unschedule(this.scheduleId1);
            this.scheduleId1 = undefined;
          }

          this.isAttack = false;
          this.hp = this._hp;
          this.maxHp = this._hp;
          this.recordHp = this._hp;
          this.spiderName = "spider";
          this._radius = 3; //敌人半径

          this._rvoSpeed = 20; //敌人速度
          // 是否到达追踪的栅栏

          this.isRvo = false;
          this.blockIndex = 0;
          this.speed = 5;
          this.movePhase = 1;
          this.rvoLastMove = false;
          this.machineState = enemyStateType.Move;
          this.characterSkeletalAnimation.play("walk_f_1");
          this.setMaterByIndex(0);
          this.dieGray = false;
          this.flowerEat = false;
          this.currentTargetIndex = 0; //RVOid

          if (this.agentHandleId != -1) {
            (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.removeAgent(this.agentHandleId);
            this.agentHandleId = -1;
          }
        }

        update(deltaTime) {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isGameEnd) {
            if (!this.endIsMove) return;
            var randomIndex = Math.floor(Math.random() * 4);
            var pos = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.moveEndBlockPos.children[randomIndex].worldPosition;
            var selfPos = this.node.worldPosition; // // 计算两点到世界原点的距离
            // const posDistance = pos.length();
            // const selfDistance = selfPos.length();
            // const isFartherFromOrigin = posDistance > selfDistance;
            // if (isFartherFromOrigin) {
            //     this.node.setWorldPosition(pos);
            // }
            // 获取自身前方向量（假设Z轴为前）

            var forward = this.node.forward; // 计算目标相对于自身的向量

            var toTarget = pos.clone().subtract(selfPos); // 点积判断是否在前方（大于0为前方）

            var isInFront = toTarget.dot(forward) < 1.5;

            if (isInFront && this.endIsMove) {
              this.endIsMove = false;
              this.node.setWorldPosition(pos);
              return;
            }
          }

          if (!(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isStartGame) {
            return;
          }

          if (this.flowerEat) return;
          this.updateBloodPos();

          if (this.currentTargetIndex < (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.enemyMovePath.children.length && this.movePhase == 1) {
            this.machineState = enemyStateType.Walk;
            this.moveToTarget(deltaTime, (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.enemyMovePath);
          } else if (this.movePhase == 2) {
            if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isBlock && this.isRvo && !this.rvoLastMove) {
              this.moveByRvo(deltaTime);
              this.setPreferredVelocities();
            } else {
              this.move();

              if (this.spiderName == "rovSpider") {
                (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                  error: Error()
                }), Simulator) : Simulator).instance.removeAgent(this.agentHandleId);
                this.agentHandleId = -1;
                this.speed = 8;

                if (this.rvoLastMove) {
                  this.moveToTarget(deltaTime, (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                    error: Error()
                  }), App) : App).sceneNode.enemyMoveRvoPath);
                }
              } else {
                this.moveToTarget(deltaTime, (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                  error: Error()
                }), App) : App).sceneNode.enemyMovePath2);
              }
            }
          }
        }
        /*************************主体移动模块 每帧移动*********************************/

        /** 移动到当前目标点 */


        moveToTarget(deltaTime, enemtParentPath) {
          var targetNode = enemtParentPath.children[this.currentTargetIndex];
          var targetPos = targetNode.worldPosition;
          var currentPos = this.node.worldPosition; // 计算距离

          var distance = Vec3.distance(currentPos, targetPos); // 如果到达目标点，切换到下一个

          if (distance < 0.1) {
            // 可根据需要调整阈值
            this.currentTargetIndex++; // 旋转到目标方向

            this.node.eulerAngles = targetNode.eulerAngles.clone();

            if (this.currentTargetIndex >= enemtParentPath.children.length) {
              this.movePhase += 1;
              this.currentTargetIndex = 0;

              if (this.movePhase > 2) {
                if (this._blood) {
                  this._blood.injuryAni(100);
                }

                this.bombDie();
                (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                  error: Error()
                }), App) : App).sceneNode.flower.getComponent(_crd && Flower === void 0 ? (_reportPossibleCrUseOfFlower({
                  error: Error()
                }), Flower) : Flower).hit(1);
                return;
              } // 第二阶段：GlobeVariable.isBlock true 拒马存在，开启RVO


              if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).isBlock && this.movePhase == 2) {
                this.isRvo = true;
                this.trackMonster();
                this.spiderName = "rovSpider";
                (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                  error: Error()
                }), App) : App).enemyController.setEnemyRvoList(this);
              }
            }

            return;
          } // 计算移动方向


          var direction = Vec3.subtract(new Vec3(), targetPos, currentPos).normalize(); // 计算每帧移动距离

          var moveDistance = this.speed * deltaTime; // 更新位置

          var newPos = Vec3.add(new Vec3(), currentPos, Vec3.multiplyScalar(new Vec3(), direction, moveDistance));
          this.node.worldPosition = newPos; // 平滑旋转朝向目标

          this.rotateToTarget(targetNode.eulerAngles, deltaTime);
        }
        /** 平滑旋转到目标角度 */


        rotateToTarget(targetRot, deltaTime) {
          var currentRot = this.node.eulerAngles; // 计算旋转差值并平滑过渡

          var rotDiff = new Vec3(this.smoothDamp(currentRot.x, targetRot.x, deltaTime), this.smoothDamp(currentRot.y, targetRot.y, deltaTime), this.smoothDamp(currentRot.z, targetRot.z, deltaTime));
          this.node.eulerAngles = rotDiff;
        }
        /** 平滑插值函数 */


        smoothDamp(current, target, deltaTime, smoothTime) {
          if (smoothTime === void 0) {
            smoothTime = 0.5;
          }

          var diff = target - current; // 处理角度环绕问题

          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return current + diff * (1 - Math.exp(-deltaTime / smoothTime));
        } // // 旋转到目标方向
        // private rotateTowards(targetWorldPos: Vec3, dt: number) {
        //     const currentPos = this.node.worldPosition.clone();
        //     const dir = new Vec3();
        //     Vec3.subtract(dir, targetWorldPos, currentPos);
        //     dir.y = 0;
        //     dir.normalize();
        //     if (!dir) return;
        //     const targetQuat = new Quat();
        //     Quat.fromViewUp(targetQuat, dir, Vec3.UP);
        //     const currentQuat = this.node.worldRotation.clone();
        //     const resultQuat = new Quat();
        //     Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
        //     this.node.worldRotation = resultQuat;
        // }
        // public isAlive(): boolean {
        //     return this.machineState !== enemyStateType.Die;
        // }


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "baseMaterial", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "grayMaterial", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "skinnedMeshRenderer", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "dissolveEffect", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "hitPosNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "hitParticle", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "hitParticle1", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "currentIndex", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "isInitCraet", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "spiderHp", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "spiderType", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b5b695f2168ce7f9f7a2b356e11e4d1d339d0ce7.js.map