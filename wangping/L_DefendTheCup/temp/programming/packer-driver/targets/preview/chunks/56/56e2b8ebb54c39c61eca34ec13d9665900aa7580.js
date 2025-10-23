System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, AnimationClip, BoxCollider, CCFloat, Collider, Color, Component, director, find, gfx, instantiate, Label, Mat4, Material, math, MeshRenderer, Node, RigidBody, SkeletalAnimation, Texture2D, tween, UIOpacity, v3, Vec3, Vec4, MinionStateEnum, StateDefine, MathUtil, DataManager, FlowField, AreaEnum, CollisionEntityEnum, EntityTypeEnum, PathEnum, ItemAreaManager, RVOObstacles, Simulator, MinionManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _crd, ccclass, property, tempVelocity, Actor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMinionStateEnum(extras) {
    _reporterNs.report("MinionStateEnum", "./StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStateDefine(extras) {
    _reporterNs.report("StateDefine", "./StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Util/MathUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlowField(extras) {
    _reporterNs.report("FlowField", "../Monster/FlowField", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAreaEnum(extras) {
    _reporterNs.report("AreaEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCollisionEntityEnum(extras) {
    _reporterNs.report("CollisionEntityEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPathEnum(extras) {
    _reporterNs.report("PathEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemAreaManager(extras) {
    _reporterNs.report("ItemAreaManager", "../Area/ItemAreaManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOObstacles(extras) {
    _reporterNs.report("RVOObstacles", "../Global/RVOObstacles", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "../RVO/Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMinionManager(extras) {
    _reporterNs.report("MinionManager", "./MinionManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      AnimationClip = _cc.AnimationClip;
      BoxCollider = _cc.BoxCollider;
      CCFloat = _cc.CCFloat;
      Collider = _cc.Collider;
      Color = _cc.Color;
      Component = _cc.Component;
      director = _cc.director;
      find = _cc.find;
      gfx = _cc.gfx;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
      Mat4 = _cc.Mat4;
      Material = _cc.Material;
      math = _cc.math;
      MeshRenderer = _cc.MeshRenderer;
      Node = _cc.Node;
      RigidBody = _cc.RigidBody;
      SkeletalAnimation = _cc.SkeletalAnimation;
      Texture2D = _cc.Texture2D;
      tween = _cc.tween;
      UIOpacity = _cc.UIOpacity;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
      Vec4 = _cc.Vec4;
    }, function (_unresolved_2) {
      MinionStateEnum = _unresolved_2.MinionStateEnum;
      StateDefine = _unresolved_2.StateDefine;
    }, function (_unresolved_3) {
      MathUtil = _unresolved_3.MathUtil;
    }, function (_unresolved_4) {
      DataManager = _unresolved_4.DataManager;
    }, function (_unresolved_5) {
      FlowField = _unresolved_5.FlowField;
    }, function (_unresolved_6) {
      AreaEnum = _unresolved_6.AreaEnum;
      CollisionEntityEnum = _unresolved_6.CollisionEntityEnum;
      EntityTypeEnum = _unresolved_6.EntityTypeEnum;
      PathEnum = _unresolved_6.PathEnum;
    }, function (_unresolved_7) {
      ItemAreaManager = _unresolved_7.ItemAreaManager;
    }, function (_unresolved_8) {
      RVOObstacles = _unresolved_8.default;
    }, function (_unresolved_9) {
      Simulator = _unresolved_9.Simulator;
    }, function (_unresolved_10) {
      MinionManager = _unresolved_10.MinionManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "526d5KpRDJM/5r9F6Cd6IPA", "Actor", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'AnimationClip', 'AnimationState', 'BoxCollider', 'builtinResMgr', 'CCFloat', 'Collider', 'Color', 'Component', 'director', 'EffectAsset', 'find', 'gfx', 'ICollisionEvent', 'instantiate', 'Label', 'Mat4', 'Material', 'math', 'MeshRenderer', 'Node', 'resources', 'RigidBody', 'SkeletalAnimation', 'Slider', 'Texture2D', 'tween', 'UIOpacity', 'v3', 'Vec3', 'Vec4']);

      ({
        ccclass,
        property
      } = _decorator);
      tempVelocity = v3();

      _export("Actor", Actor = (_dec = ccclass('Actor'), _dec2 = property(SkeletalAnimation), _dec3 = property(CCFloat), _dec4 = property(CCFloat), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(Texture2D), _dec14 = property({
        type: CCFloat,
        tooltip: "R"
      }), _dec15 = property({
        type: CCFloat,
        tooltip: "G"
      }), _dec16 = property({
        type: CCFloat,
        tooltip: "B"
      }), _dec(_class = (_class2 = class Actor extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "skeletalAnimation", _descriptor, this);

          _initializerDefineProperty(this, "linearSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "angularSpeed", _descriptor3, this);

          _initializerDefineProperty(this, "scene1TSide", _descriptor4, this);

          _initializerDefineProperty(this, "scene1RSide", _descriptor5, this);

          _initializerDefineProperty(this, "scene1BSide", _descriptor6, this);

          _initializerDefineProperty(this, "scene1LSide", _descriptor7, this);

          _initializerDefineProperty(this, "scene2TSide", _descriptor8, this);

          _initializerDefineProperty(this, "scene2RSide", _descriptor9, this);

          _initializerDefineProperty(this, "scene2BSide", _descriptor10, this);

          _initializerDefineProperty(this, "scene2LSide", _descriptor11, this);

          _initializerDefineProperty(this, "texture", _descriptor12, this);

          _initializerDefineProperty(this, "R", _descriptor13, this);

          _initializerDefineProperty(this, "G", _descriptor14, this);

          _initializerDefineProperty(this, "B", _descriptor15, this);

          // const targetColor = new Color(163, 150, 0, 255);
          this.destForward = v3();
          this.collider = null;
          this.rigidbody = null;
          this.currentState = (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
            error: Error()
          }), StateDefine) : StateDefine).Idle;
          this.uiproperty = null;
          this.onceData = true;
          // 是否在获取兵器的区域
          this.isWeaponArea = false;
          this._weaponCollectIndex = -1;
          this._weaponCollecting = false;
          this._weaponCollectDelay = 0;
          // 是否已经交付一次武器              FALSE没有交付， TURE已经交付一次
          this._hasWeaponDeliverdOnce = false;
          // 解锁地块6
          this.isUnlockDeliveryAreas6 = true;
          // 是否交付金币
          this.isDeliverCoins = false;
          this.otherNode = null;
          // 初始化交付状态
          this._isWeaponDelivering = false;
          this._weaponQueue = [];
          this._weaponDeliverInterval = 0.3;
          // === 声明交付状态映射（以区域 Node 为 key，追踪剩余次数） ===
          this.deliveryCountMap = new Map();
          this.pendingDeliveryCountMap = new Map();
          this._deliverInterval = 0.05;
          this._deliverTimer = 0;
        }

        start() {
          var _this$collider, _this$collider2, _this$collider3;

          this.rigidbody = this.node.getComponent(RigidBody);
          this.collider = this.node.getComponent(Collider);
          this.uiproperty = this.node.getChildByName("UIproperty");
          (_this$collider = this.collider) == null || _this$collider.on("onTriggerEnter", this.onTriggerEnter, this);
          (_this$collider2 = this.collider) == null || _this$collider2.on("onTriggerStay", this.onTriggerStay, this);
          (_this$collider3 = this.collider) == null || _this$collider3.on("onTriggerExit", this.onTriggerExit, this);
        }

        showPlane(node) {
          var meshRenderer = node.getComponent(MeshRenderer);
          var material = new Material();
          material.initialize({
            effectName: 'builtin-unlit',
            technique: 1,
            // transparent
            defines: {
              USE_TEXTURE: true
            }
          }); // 目标颜色（最后应该过渡到这个颜色）

          var targetColor = new Color(this.R, this.G, this.B, 255);
          var startColorVec4 = new Vec4(targetColor.r / 255, targetColor.g / 255, targetColor.b / 255, 0 // 初始 alpha = 0（完全透明）
          ); // 设置初始透明色

          material.setProperty('mainColor', startColorVec4);
          material.setProperty('mainTexture', this.texture);
          var tilingOffset = new Vec4(6, 8, 0, 0);
          material.setProperty('tilingOffset', tilingOffset);
          meshRenderer.setMaterial(material, 0); // 开始渐变动画（从 alpha = 0 → 1）

          var tweenColor = new Vec4(startColorVec4.x, startColorVec4.y, startColorVec4.z, 0);
          tween(tweenColor).to(1.5, {
            w: 1 // Vec4 的第4个参数是 alpha

          }, {
            onUpdate: () => {
              material.setProperty('mainColor', tweenColor);
            }
          }).start();
        }

        colorToVec4(color) {
          return new Vec4(color.r / 255, color.g / 255, color.b / 255, color.a / 255);
        }

        update(deltaTime) {
          // 是否在金币的交付区域内
          if (this.isDeliverCoins) {
            this.deliverCoinsFun(deltaTime);
          }

          var canCollect = this._weaponCollecting && this.isWeaponArea;

          if (canCollect) {
            this._weaponCollectDelay += deltaTime;

            if (this._weaponCollectDelay >= 0.2) {
              this._weaponCollectDelay = 0;
              this.getPlayerWeaponStep(); // 每次收集一个
            }
          }

          if (this.currentState == (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
            error: Error()
          }), StateDefine) : StateDefine).Die) {
            return;
          } // 始终执行朝向调整


          var a = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).signAngle(this.node.forward, this.destForward, Vec3.UP);
          var as = v3(0, a * 20, 0);
          this.rigidbody.setAngularVelocity(as); //  改成无条件执行移动（不依赖状态）

          this.doMove();
        }

        doMove() {
          var _this$rigidbody;

          var speed = this.linearSpeed * this.destForward.length() * 15;
          tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
          tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
          (_this$rigidbody = this.rigidbody) == null || _this$rigidbody.setLinearVelocity(tempVelocity);
          (_crd && FlowField === void 0 ? (_reportPossibleCrUseOfFlowField({
            error: Error()
          }), FlowField) : FlowField).Instance.updateFlowField(this.node.getWorldPosition().clone());
        } // 武器获取


        startWeaponCollecting() {
          var deliveryAreas7 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).DeliveryAreas7);
          if (!deliveryAreas7) return;
          var buildingCon = deliveryAreas7.getChildByName("BuildingCon");
          var weapons = buildingCon == null ? void 0 : buildingCon.getChildByName("Weapons");
          var isZeroScale = buildingCon && buildingCon.scale.x !== 0 && buildingCon.scale.y !== 0 && buildingCon.scale.z !== 0;
          if (!isZeroScale || !weapons || weapons.children.length === 0) return;
          this._weaponCollectIndex = weapons.children.length - 1;
          this._weaponCollecting = true;
        }

        arrangeDeliveredWeapons() {
          var minionWeaponCon = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).MinionWeaponCon);
          if (!minionWeaponCon) return;
          var itemsPerRow = 4;
          var horizontalSpacing = 1.3;
          var verticalSpacing = 1;
          var validWeapons = minionWeaponCon.children.filter(w => w.__delivered && !w.__used);
          validWeapons.forEach((weapon, index) => {
            var col = index % itemsPerRow;
            var row = Math.floor(index / itemsPerRow);
            var targetPos = new Vec3(0, row * verticalSpacing, col * horizontalSpacing);
            weapon.setPosition(targetPos);
          });
        }

        weaponDelivery() {
          if (this._isWeaponDelivering) return;
          var backpack2 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node.getChildByName("Backpack2");
          if (!backpack2 || backpack2.children.length === 0) return;
          var minionWeaponCon = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).MinionWeaponCon);
          if (!minionWeaponCon) return;

          if (this._weaponQueue.length === 0) {
            this._weaponQueue = [...backpack2.children].reverse();
          }

          if (this._weaponQueue.length === 0) return;

          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isInWeaponDeliveryArea) {
            this._weaponQueue = [];
            return;
          }

          var item = this._weaponQueue.shift();

          if (!(item != null && item.isValid)) {
            this.scheduleOnce(() => this.weaponDelivery(), this._weaponDeliverInterval);
            return;
          }

          this._isWeaponDelivering = true;
          var itemsPerRow = 4;
          var horizontalSpacing = 1.3;
          var verticalSpacing = 1;
          var validWeapons = minionWeaponCon.children.filter(w => w.__delivered && !w.__used);
          var nextIndex = validWeapons.length;
          var col = nextIndex % itemsPerRow;
          var row = Math.floor(nextIndex / itemsPerRow);
          var targetPos = new Vec3(0, row * verticalSpacing, col * horizontalSpacing);
          var worldStartPos = item.getWorldPosition();
          var worldTargetPos = minionWeaponCon.getWorldPosition().clone().add(targetPos);
          var midPoint = worldStartPos.clone().lerp(worldTargetPos, 0.5).add3f(0, 5, 0);
          var obj = {
            t: 0
          };
          tween(obj).to(0.6, {
            t: 1
          }, {
            easing: 'quadInOut',
            onUpdate: () => {
              if (!(item != null && item.isValid)) return;
              var pos = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
                error: Error()
              }), MathUtil) : MathUtil).bezierCurve(worldStartPos, midPoint, worldTargetPos, obj.t);
              item.setWorldPosition(pos);
            }
          }).call(() => {
            item.setParent(minionWeaponCon);
            item.__delivered = true;
            item.setPosition(targetPos);
            this.arrangeDeliveredWeapons(); // 自动重新排布所有已交付武器

            if (!this._hasWeaponDeliverdOnce) {
              this._hasWeaponDeliverdOnce = true;
              this.deliverAllWeaponsOnce();
            }

            this._isWeaponDelivering = false;

            if (this._weaponQueue.length > 0 && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isInWeaponDeliveryArea) {
              this.scheduleOnce(() => this.weaponDelivery(), this._weaponDeliverInterval);
            } else {
              this._weaponQueue = [];
            }

            var nextData = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList.find(item => item.name === "DeliverEquipmentArea");

            if (nextData) {
              nextData.isFind = false;
              nextData.isDisplay = false;
            }
          }).start();
        } // 是否有一次交付武器


        deliverAllWeaponsOnce() {
          var deliveryAreas9 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).DeliveryAreas9);
          var deliveryAreas9Plot = deliveryAreas9.getChildByName("Plot");
          var itemAreaManager9 = deliveryAreas9Plot.getComponent(_crd && ItemAreaManager === void 0 ? (_reportPossibleCrUseOfItemAreaManager({
            error: Error()
          }), ItemAreaManager) : ItemAreaManager);
          itemAreaManager9 == null || itemAreaManager9.displayAni(deliveryAreas9Plot);
          var areas9Data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
            return item.name == "DeliveryAreas9";
          });

          if (areas9Data) {
            areas9Data.isFind = true;
            areas9Data.isDisplay = true;
          }

          var deliveryAreas10 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).DeliveryAreas10);
          var deliveryAreas10Plot = deliveryAreas10.getChildByName("Plot");
          var itemAreaManage10 = deliveryAreas10Plot.getComponent(_crd && ItemAreaManager === void 0 ? (_reportPossibleCrUseOfItemAreaManager({
            error: Error()
          }), ItemAreaManager) : ItemAreaManager);
          itemAreaManage10 == null || itemAreaManage10.displayAni(deliveryAreas10Plot);
          var areas10Data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
            return item.name == "DeliveryAreas10";
          });

          if (areas10Data) {
            areas10Data.isFind = true;
            areas10Data.isDisplay = true;
          }
        }

        stopMove() {
          var _this$rigidbody2;

          (_this$rigidbody2 = this.rigidbody) == null || _this$rigidbody2.setLinearVelocity(Vec3.ZERO);
        }

        changState(state) {
          var _this$skeletalAnimati;

          var clipName = state; // 获取目标动画状态

          var aniState = (_this$skeletalAnimati = this.skeletalAnimation) == null ? void 0 : _this$skeletalAnimati.getState(clipName); // 如果是攻击状态，允许重复切换（防止攻击无法连击）

          if (state === (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
            error: Error()
          }), StateDefine) : StateDefine).Attack) {
            var _this$skeletalAnimati2;

            (_this$skeletalAnimati2 = this.skeletalAnimation) == null || _this$skeletalAnimati2.crossFade(clipName, 0.1);
            this.currentState = state;
            return;
          } // 允许 Walk/WALK_ATTACK 状态重复切换播放动画


          if (state === this.currentState) {
            if (aniState && !aniState.isPlaying) {
              var _this$skeletalAnimati3;

              (_this$skeletalAnimati3 = this.skeletalAnimation) == null || _this$skeletalAnimati3.play(clipName);
            }

            return;
          } // 若切换自 Walk 类状态，停止移动


          if (this.currentState === (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
            error: Error()
          }), StateDefine) : StateDefine).Walk || this.currentState === (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
            error: Error()
          }), StateDefine) : StateDefine).Walk_attack) {
            this.stopMove();
          }

          if (aniState) {
            var _this$skeletalAnimati4;

            aniState.wrapMode = AnimationClip.WrapMode.Loop; // 防止播放完卡住

            (_this$skeletalAnimati4 = this.skeletalAnimation) == null || _this$skeletalAnimati4.crossFade(clipName, 0.1);
          } else {
            console.warn("\u672A\u627E\u5230\u52A8\u753B\u72B6\u6001\uFF1A" + clipName);
          }

          this.currentState = state;
        } // 进入


        onTriggerEnter(event) {
          var selfCollider = event.selfCollider;
          var otherCollider = event.otherCollider; // 执行开门逻辑

          if (otherCollider.node.name.includes("Door")) {
            var _sceneMap$scene;

            var [scene, side] = otherCollider.node.name.split("_");
            var sceneMap = {
              Scene1: {
                L: this.scene1LSide,
                T: this.scene1TSide,
                B: this.scene1BSide,
                R: this.scene1RSide
              },
              Scene2: {
                L: this.scene2LSide,
                T: this.scene2TSide,
                B: this.scene2BSide,
                R: this.scene2RSide
              }
            };
            var doorGroup = (_sceneMap$scene = sceneMap[scene]) == null || (_sceneMap$scene = _sceneMap$scene[side]) == null ? void 0 : _sceneMap$scene.getChildByName(side + "_Door");

            if (!doorGroup) {
              console.warn("[Door] " + scene + "_" + side + " \u672A\u627E\u5230\u95E8\u8282\u70B9");
              return;
            }

            var doorL = doorGroup.getChildByName("Door_Left");
            var doorR = doorGroup.getChildByName("Door_Right");
            this.openDoorBySide(doorL, doorR, side);
          } // 是否进入交付金币的区域


          var otherNode = otherCollider.node;
          var deliveryAreaNames = [];

          for (var key in _crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum) {
            if ((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).hasOwnProperty(key)) {
              deliveryAreaNames.push((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                error: Error()
              }), CollisionEntityEnum) : CollisionEntityEnum)[key]);
            }
          }

          if (deliveryAreaNames.indexOf(otherNode.name) !== -1) {
            this.isDeliverCoins = true;
            this.otherNode = otherNode;
          }
        }

        openDoorBySide(doorL, doorR, side) {
          var duration = 0.3; // 不同方向的开门角度设置（左门/右门）

          var angleMap = {
            L: {
              left: 70,
              right: 300
            },
            R: {
              left: -110,
              right: 110
            },
            T: {
              left: -20,
              right: 200
            },
            B: {
              left: 20,
              right: -200
            }
          };
          var config = angleMap[side];

          if (!config) {
            console.warn("[Door] \u672A\u5B9A\u4E49\u65B9\u5411\u5F00\u95E8\u89D2\u5EA6: " + side);
            return;
          }

          if (doorL != null && doorL.isValid) {
            tween(doorL).to(duration, {
              eulerAngles: new Vec3(0, config.left, 0)
            }, {
              easing: 'quadOut'
            }).start();
          }

          if (doorR != null && doorR.isValid) {
            tween(doorR).to(duration, {
              eulerAngles: new Vec3(0, config.right, 0)
            }, {
              easing: 'quadOut'
            }).start();
          }
        }

        onTriggerStay(event) {
          var otherNode = event.otherCollider.node;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isInWeaponDeliveryArea = true; // 人物在装备区域， 并且7已经解锁

          if (otherNode.name === "ObtainEquipmentArea" && !(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isConveyorBeltUnlocking) {
            this.isWeaponArea = true;
            this.startWeaponCollecting();
          } // 武器交付区域


          if (otherNode.name === (_crd && AreaEnum === void 0 ? (_reportPossibleCrUseOfAreaEnum({
            error: Error()
          }), AreaEnum) : AreaEnum).DeliverEquipmentArea) {
            this.weaponDelivery();
          } // // === 👇记录执行时间开始
          // const t0 = performance.now();
          // const backpack1 = this.node.getChildByName("Backpack1");
          // if (!backpack1 || backpack1.children.length === 0) return;
          // const deliveryAreaNames = Object.values(CollisionEntityEnum) as string[];
          // if (!deliveryAreaNames.includes(otherNode.name)) return;
          // const plot = otherNode.getChildByName("Plot");
          // const deliveryNumNode = plot?.getChildByName("DeliveryNum");
          // const label = deliveryNumNode?.getComponent(Label);
          // const isNotZeroScale = plot?.scale.x !== 0 || plot.scale.y !== 0 || plot.scale.z !== 0;
          // if (!plot || !deliveryNumNode || !label || !isNotZeroScale) return;
          // let total = this.deliveryCountMap.get(otherNode);
          // if (total === undefined) {
          //     total = Number(label.string);
          //     this.deliveryCountMap.set(otherNode, total);
          // }
          // const pending = this.pendingDeliveryCountMap.get(otherNode) ?? 0;
          // if ((total - pending) > 0 && !this._deliverQueue.includes(otherNode)) {
          //     this.pendingDeliveryCountMap.set(otherNode, pending + 1);
          //     this._deliverQueue.push(otherNode);
          //     this._tryDeliverNext();
          //     const t1 = performance.now();
          //     console.log(`🕒 deliverItemToTarget 执行耗时: ${(t1 - t0).toFixed(2)}ms`);
          // }

        }

        deliverCoinsFun(deltaTime) {
          var _this$pendingDelivery;

          var backpack1 = this.node.getChildByName("Backpack1");
          if (!backpack1 || backpack1.children.length === 0) return;
          if (!this.otherNode) return;
          var deliveryAreaNames = [];

          for (var key in _crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum) {
            if ((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).hasOwnProperty(key)) {
              deliveryAreaNames.push((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                error: Error()
              }), CollisionEntityEnum) : CollisionEntityEnum)[key]);
            }
          }

          if (deliveryAreaNames.indexOf(this.otherNode.name) === -1) return;
          var plot = this.otherNode.getChildByName("Plot");
          var deliveryNumNode = plot == null ? void 0 : plot.getChildByName("DeliveryNum");
          var label = deliveryNumNode == null ? void 0 : deliveryNumNode.getComponent(Label);
          var isNotZeroScale = (plot == null ? void 0 : plot.scale.x) !== 0 || plot.scale.y !== 0 || plot.scale.z !== 0;
          if (!plot || !deliveryNumNode || !label || !isNotZeroScale) return; // 初始化交付数

          var total = this.deliveryCountMap.get(this.otherNode);

          if (total === undefined) {
            total = Number(label.string);
            this.deliveryCountMap.set(this.otherNode, total);
            this.pendingDeliveryCountMap.set(this.otherNode, 0);
          }

          var pending = (_this$pendingDelivery = this.pendingDeliveryCountMap.get(this.otherNode)) != null ? _this$pendingDelivery : 0;
          if (total - pending <= 0) return; // 没有金币可交付（剩余全部在飞）

          this._deliverTimer += deltaTime;
          if (this._deliverTimer < this._deliverInterval) return;
          this._deliverTimer = 0;
          var success = this.deliverItemToTarget(this.otherNode);
          if (!success) return;
        }

        deliverItemToTarget(targetNode) {
          var _player$node, _this$deliveryCountMa, _this$pendingDelivery2;

          var player = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player;
          var backpack1 = player == null || (_player$node = player.node) == null ? void 0 : _player$node.getChildByName("Backpack1");
          if (!player || !backpack1 || backpack1.children.length === 0) return false;
          var item = backpack1.children[backpack1.children.length - 1];
          if (!item || !item.isValid) return false;
          var plot = targetNode.getChildByName("Plot");
          var deliveryNumNode = plot == null ? void 0 : plot.getChildByName("DeliveryNum");
          var label = deliveryNumNode == null ? void 0 : deliveryNumNode.getComponent(Label);
          if (!plot || !deliveryNumNode || !label) return false;
          var currentTotal = (_this$deliveryCountMa = this.deliveryCountMap.get(targetNode)) != null ? _this$deliveryCountMa : Number(label.string);
          var currentPending = (_this$pendingDelivery2 = this.pendingDeliveryCountMap.get(targetNode)) != null ? _this$pendingDelivery2 : 0;
          if (currentTotal - currentPending <= 0) return false; // 标记为已飞出待完成

          this.pendingDeliveryCountMap.set(targetNode, currentPending + 1); // 播放UI缩放动画（保持不变）

          var iconSprite = plot.getChildByName("Icon");

          if (iconSprite) {
            tween(iconSprite).stop();
            tween(iconSprite).to(0.1, {
              scale: new Vec3(0.02, 0.02, 0.02)
            }).to(0.1, {
              scale: new Vec3(0.015, 0.015, 0.015)
            }).start();
          }

          var deliveryNumSprite = plot.getChildByName("DeliveryNum");

          if (deliveryNumSprite) {
            tween(deliveryNumSprite).stop();
            tween(deliveryNumSprite).to(0.1, {
              scale: new Vec3(0.08, 0.08, 0.08)
            }).to(0.1, {
              scale: new Vec3(0.06, 0.06, 0.06)
            }).start();
          } // 飞行动画轨迹


          var itemWorldPos = item.worldPosition.clone();
          item.setParent(this.node.parent);
          var start = itemWorldPos;
          var end = targetNode.worldPosition.clone();
          var control = new Vec3((start.x + end.x) / 2, Math.max(start.y, end.y) + 7, (start.z + end.z) / 2);
          var controller = {
            t: 0
          };
          tween(controller).to(0.5, {
            t: 1
          }, {
            easing: 'quadInOut',
            onUpdate: () => {
              var t = controller.t;
              var oneMinusT = 1 - t;
              var pos = new Vec3(oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * end.x, oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * end.y, oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * end.z);
              item.setWorldPosition(pos);
            }
          }).call(() => {
            var _this$deliveryCountMa2, _this$pendingDelivery3;

            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.monsterManager.recycleDrop(item);
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playIconSound(); // 动画完成后：更新实际数据和 UI

            var remaining = (_this$deliveryCountMa2 = this.deliveryCountMap.get(targetNode)) != null ? _this$deliveryCountMa2 : 1;
            remaining = Math.max(remaining - 1, 0);
            this.deliveryCountMap.set(targetNode, remaining);
            label.string = remaining.toString();
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.UIPropertyManager.deliverProperty();
            var pending = (_this$pendingDelivery3 = this.pendingDeliveryCountMap.get(targetNode)) != null ? _this$pendingDelivery3 : 1;
            this.pendingDeliveryCountMap.set(targetNode, Math.max(pending - 1, 0));

            if (remaining === 0 && !targetNode._hasDeliveredZero) {
              targetNode._hasDeliveredZero = true;
              this.onDeliveryComplete(targetNode);
            }
          }).start();
          return true;
        } // 离开


        onTriggerExit(event) {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isInWeaponDeliveryArea = false;
          var otherCollider = event.otherCollider;
          var selfCollider = event.selfCollider;
          var otherNode = event.otherCollider.node;

          if (otherNode.name == "ObtainEquipmentArea") {
            this.isWeaponArea = false;
            this._weaponCollecting = false;
          }

          if (otherCollider.node.name.includes("Door")) {
            var _sceneMap$scene2;

            var [scene, side] = otherCollider.node.name.split("_");
            var sceneMap = {
              Scene1: {
                L: this.scene1LSide,
                T: this.scene1TSide,
                B: this.scene1BSide,
                R: this.scene1RSide
              },
              Scene2: {
                L: this.scene2LSide,
                T: this.scene2TSide,
                B: this.scene2BSide,
                R: this.scene2RSide
              }
            };
            var doorGroup = (_sceneMap$scene2 = sceneMap[scene]) == null || (_sceneMap$scene2 = _sceneMap$scene2[side]) == null ? void 0 : _sceneMap$scene2.getChildByName(side + "_Door");

            if (!doorGroup) {
              console.warn("[Door] " + scene + "_" + side + " \u672A\u627E\u5230\u95E8\u8282\u70B9");
              return;
            }

            var doorL = doorGroup.getChildByName("Door_Left");
            var doorR = doorGroup.getChildByName("Door_Right");
            this.closeDoorBySide(doorL, doorR, side);
          } // 是否离开金币的交付区域


          var deliveryAreaNames = [];

          for (var key in _crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum) {
            if ((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).hasOwnProperty(key)) {
              deliveryAreaNames.push((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                error: Error()
              }), CollisionEntityEnum) : CollisionEntityEnum)[key]);
            }
          }

          if (deliveryAreaNames.indexOf(otherNode.name) !== -1) {
            this.isDeliverCoins = false;
            this.otherNode = null;
          }
        }

        closeDoorBySide(doorL, doorR, side, isMinion) {
          if (isMinion === void 0) {
            isMinion = false;
          }

          var duration = 0.3;
          var angleMap = {
            L: {
              left: 180,
              right: 180
            },
            R: {
              left: 0,
              right: 0
            },
            T: {
              left: 90,
              right: 90
            },
            B: {
              left: -90,
              right: -90
            }
          };
          var config = angleMap[side];

          if (!config) {
            console.warn("[Door] \u672A\u5B9A\u4E49\u65B9\u5411\u5F00\u95E8\u89D2\u5EA6: " + side);
            return;
          }

          if (this.node.name == "Player" && !(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isAllMinionsPassed && side == "B" && !isMinion) {
            return;
          }

          if (doorL != null && doorL.isValid) {
            tween(doorL).to(duration, {
              eulerAngles: new Vec3(0, config.left, 0)
            }, {
              easing: 'quadOut'
            }).start();
          }

          if (doorR != null && doorR.isValid) {
            tween(doorR).to(duration, {
              eulerAngles: new Vec3(0, config.right, 0)
            }, {
              easing: 'quadOut'
            }).start();
          }
        }

        onDeliveryComplete(otherNode) {
          var plot = otherNode.getChildByName("Plot");
          var buildingCon = otherNode.getChildByName("BuildingCon");
          if (!plot) return;
          var uiOpacity = plot.getComponent(UIOpacity) || plot.addComponent(UIOpacity);
          tween(uiOpacity).to(0.3, {
            opacity: 0
          }).call(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.BuildingUnlockSoundPlay();
            var data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
              return item.name == otherNode.name;
            });

            if (data) {
              data.isFind = false;
              data.isDisplay = false;
            }

            if (otherNode.name == "DeliveryAreas3" || otherNode.name == "DeliveryAreas4" || otherNode.name == "DeliveryAreas5" || otherNode.name == "DeliveryAreas8" || otherNode.name == "DeliveryAreas7") {
              buildingCon.setScale(1, 1, 0);
              tween(buildingCon).to(0.15, {
                scale: new Vec3(1, 1, 1.1)
              }, {
                easing: 'quadOut'
              }) // 带弹性效果
              .to(0.05, {
                scale: new Vec3(1, 1, 1)
              }, {
                easing: 'quadOut'
              }).call(() => {
                var deliveryAreasPh = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                  error: Error()
                }), PathEnum) : PathEnum).DeliveryAreasPh);

                if (deliveryAreasPh) {
                  var deliveryAreas = deliveryAreasPh.getChildByName(otherNode.name);

                  if (deliveryAreas) {
                    var boxCollider = deliveryAreas.getComponent(BoxCollider);

                    if (boxCollider) {
                      boxCollider.enabled = true;
                    }

                    var rigidbody = deliveryAreas.getComponent(RigidBody);

                    if (rigidbody) {
                      rigidbody.enabled = true;
                      rigidbody.wakeUp();
                    }
                  }
                } // 解锁规则条件


                this.unlockNewSpecies(otherNode);
              }).start();
            } else {
              buildingCon.setScale(1, 0, 1);
              tween(buildingCon).to(0.15, {
                scale: new Vec3(1, 1.1, 1)
              }, {
                easing: 'quadOut'
              }) // 带弹性效果
              .to(0.05, {
                scale: new Vec3(1, 1, 1)
              }, {
                easing: 'quadOut'
              }).call(() => {
                var deliveryAreasPh = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                  error: Error()
                }), PathEnum) : PathEnum).DeliveryAreasPh);

                if (deliveryAreasPh) {
                  var deliveryAreas = deliveryAreasPh.getChildByName(otherNode.name);

                  if (deliveryAreas) {
                    var boxCollider = deliveryAreas.getComponent(BoxCollider);

                    if (boxCollider) {
                      boxCollider.enabled = true;
                    }

                    var rigidbody = deliveryAreas.getComponent(RigidBody);

                    if (rigidbody) {
                      rigidbody.enabled = true;
                      rigidbody.wakeUp();
                    }
                  }
                } // 解锁规则条件


                this.unlockNewSpecies(otherNode);
              }).start();
            }
          }).start();
        } // 解锁规则条件


        unlockNewSpecies(otherNode) {
          var _this = this;

          // 解锁地块6
          if (otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas3 || otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas4 || otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas5) {
            if (this.isUnlockDeliveryAreas6) {
              this.isUnlockDeliveryAreas6 = false;
              var deliveryAreas6 = otherNode.parent.getChildByName((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                error: Error()
              }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas6);

              if (deliveryAreas6) {
                var plot = deliveryAreas6.getChildByName("Plot");
                var itemAreaManager7 = deliveryAreas6.getComponent(_crd && ItemAreaManager === void 0 ? (_reportPossibleCrUseOfItemAreaManager({
                  error: Error()
                }), ItemAreaManager) : ItemAreaManager);
                itemAreaManager7 == null || itemAreaManager7.displayAni(plot);
                var data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                  return item.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                    error: Error()
                  }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas6;
                });

                if (data) {
                  data.isFind = true;
                  data.isDisplay = true;
                }
              }
            }
          } // 解锁角色


          if (otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas3 || otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas4 || otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas5 || otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas8) {
            // 生成两张卡片
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.cardConManager.createCards(otherNode);
          } else if (otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas6) {
            // 解锁场景1
            // 地图1 打开
            var fencesScene1 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
              error: Error()
            }), PathEnum) : PathEnum).FencesScene1);
            var scene1RSide = fencesScene1.getChildByName("RSide");
            scene1RSide.active = false;
            var scene1PhysicsRight = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
              error: Error()
            }), PathEnum) : PathEnum).Scene1PhysicsRight);

            for (var i = 0; i < scene1PhysicsRight.children.length; i++) {
              var node = scene1PhysicsRight.children[i];
              var boxCollider = node.getComponent(BoxCollider);
              boxCollider.enabled = false;
              var rigidBody = node.getComponent(RigidBody);
              rigidBody.enabled = false;
            } // 地图2


            var sideList = [];
            sideList.push(...this.scene2TSide.children, ...this.scene2RSide.children, ...this.scene2BSide.children.reverse()); // 开启阴影

            var _loop = function _loop(_i) {
              var node = sideList[_i];

              if (node.name.includes("Door")) {
                var doorLeft = node.getChildByName("Door_Left");
                var childrenL = doorLeft.children[0].children[0];
                var meshRendererL = childrenL.getComponent(MeshRenderer);
                meshRendererL.shadowCastingMode = 1;
                var doorRight = node.getChildByName("Door_Left");
                var childrenR = doorRight.children[0].children[0];
                var meshRendererR = childrenR.getComponent(MeshRenderer);
                meshRendererR.shadowCastingMode = 1;
              } else {
                var children = node.children[0];
                var meshRender = children.getComponent(MeshRenderer);
                meshRender.shadowCastingMode = 1;
              }

              if (node._hasFadedIn) return 1; // continue

              node._hasFadedIn = true; // 设定初始位置（地底）

              var originPos = node.getPosition(); // 构建上升动画

              var targetPos = new Vec3(originPos.x, 0, originPos.z); // 延迟执行，形成依次升起效果

              _this.scheduleOnce(() => {
                tween(node).to(0.2, {
                  position: targetPos
                }, {
                  easing: 'quadOut'
                }).call(() => {
                  // 动画结束后执行额外逻辑（仅最后一个节点或全部执行都可）
                  if (_i === sideList.length - 1) {
                    var plane2 = find("Dixing/Plane-002");

                    if (plane2) {
                      plane2.active = true;
                      var palne02Ani = plane2.getComponent(Animation);

                      if (palne02Ani) {
                        palne02Ani.play("Plane02CS");
                      } // this.showPlane(plane2);

                    }

                    var deliveryAreas8 = otherNode.parent.getChildByName((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                      error: Error()
                    }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas8);

                    if (deliveryAreas8) {
                      var _plot = deliveryAreas8.getChildByName("Plot");

                      var itemAreaManager8 = deliveryAreas8.getComponent(_crd && ItemAreaManager === void 0 ? (_reportPossibleCrUseOfItemAreaManager({
                        error: Error()
                      }), ItemAreaManager) : ItemAreaManager);
                      itemAreaManager8 == null || itemAreaManager8.displayAni(_plot);

                      var _data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                        error: Error()
                      }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                        return item.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                          error: Error()
                        }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas8;
                      });

                      if (_data) {
                        _data.isFind = true;
                        _data.isDisplay = true;
                      }
                    }

                    var deliveryAreas7 = otherNode.parent.getChildByName((_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                      error: Error()
                    }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas7);

                    if (deliveryAreas7) {
                      var _plot2 = deliveryAreas7.getChildByName("Plot");

                      var _itemAreaManager = deliveryAreas7.getComponent(_crd && ItemAreaManager === void 0 ? (_reportPossibleCrUseOfItemAreaManager({
                        error: Error()
                      }), ItemAreaManager) : ItemAreaManager);

                      _itemAreaManager == null || _itemAreaManager.displayAni(_plot2);

                      var _data2 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                        error: Error()
                      }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                        return item.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
                          error: Error()
                        }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas7;
                      });

                      if (_data2) {
                        _data2.isFind = true;
                        _data2.isDisplay = true;
                      }
                    } // 显示场景2的路径


                    _this.displaySceneTwoPath(); // 显示场景2的刚体


                    _this.displaySceneRigidBody((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                      error: Error()
                    }), PathEnum) : PathEnum).Scene2Physics); // 添加场景2的障碍物到避障里面


                    _this.addSceneToObstacle((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                      error: Error()
                    }), PathEnum) : PathEnum).Scene2Physics); // 更新门数据


                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.addSceneDoorFun((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                      error: Error()
                    }), PathEnum) : PathEnum).Scene2); // 检查哪些怪在这个场景中

                    var monsters = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.monsterManager.getSurroundedMonsters();

                    if (monsters.length > 0) {
                      // 
                      for (var _i2 = 0; _i2 < monsters.length; _i2++) {
                        var _node = monsters[_i2];
                        if (!_node || !_node.isValid) continue;

                        if (_node.name == "Mantis") {
                          // 直接死五次
                          for (var j = 0; j < 5; j++) {
                            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                              error: Error()
                            }), DataManager) : DataManager).Instance.monsterManager.killMonsters([_node]);
                          }
                        } else {
                          for (var _j = 0; _j < 3; _j++) {
                            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                              error: Error()
                            }), DataManager) : DataManager).Instance.monsterManager.killMonsters([_node]);
                          }
                        }
                      }
                    }

                    var fencesScene2 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                      error: Error()
                    }), PathEnum) : PathEnum).FencesScene2);
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.collectGuardrails(fencesScene2);
                  }
                }).start();
              }, _i * 0.05); // 每个节点延迟0.05秒

            };

            for (var _i = 0; _i < sideList.length; _i++) {
              if (_loop(_i)) continue;
            }
          } else if (otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas7) {
            // 解锁铁匠铺
            // const deliveryAreas7 = otherNode.parent.getChildByName(CollisionEntityEnum.DeliveryAreas7);
            // if (deliveryAreas7) {
            //     const buildingCon = deliveryAreas7.getChildByName("BuildingCon");
            //     buildingCon.setScale(1, 1, 0);
            //     tween(buildingCon)
            //         .to(0.3, { scale: new Vec3(1, 1, 1.1) }, { easing: 'backOut' })
            //         .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            //         .call(() => {
            //             // 开始产出弓箭
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isGenerateWeapons = true;

            var _data3 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
              return item.name == "ObtainEquipmentArea";
            });

            if (_data3) {
              _data3.isFind = true;
              _data3.isDisplay = true;
            } // })
            // .start();
            // const itemAreaManager7 = deliveryAreas7.getComponent(ItemAreaManager);
            // itemAreaManager7?.displayAni(buildingCon);
            // }

          } else if (otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas10) {
            // 解锁场景2，  结束
            // 地图2 打开
            var _fencesScene = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
              error: Error()
            }), PathEnum) : PathEnum).FencesScene1);

            var _scene1RSide = _fencesScene.getChildByName("RSide");

            _scene1RSide.active = false;

            var _scene1PhysicsRight = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
              error: Error()
            }), PathEnum) : PathEnum).Scene2PhysicsRight);

            for (var _i3 = 0; _i3 < _scene1PhysicsRight.children.length; _i3++) {
              var _node2 = _scene1PhysicsRight.children[_i3];

              var _boxCollider = _node2.getComponent(BoxCollider);

              _boxCollider.enabled = false;

              var _rigidBody = _node2.getComponent(RigidBody);

              _rigidBody.enabled = false;
            }

            var fencesScene2 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
              error: Error()
            }), PathEnum) : PathEnum).FencesScene2);
            var scene2RSide = fencesScene2.getChildByName("RSide");
            scene2RSide.active = false;
            var fencesScene3 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
              error: Error()
            }), PathEnum) : PathEnum).FencesScene3);
            var tSide = fencesScene3.getChildByName("TSide");
            var rSide = fencesScene3.getChildByName("RSide");
            var bSide = fencesScene3.getChildByName("BSide");
            var newList = [];
            newList.push(...tSide.children, ...rSide.children, ...bSide.children);

            var _loop2 = function _loop2(_i4) {
              var node = newList[_i4];
              if (node._hasFadedIn) return 1; // continue

              node._hasFadedIn = true; // 保存原始位置

              var originPos = node.getPosition();
              var targetPos = new Vec3(originPos.x, 0, originPos.z); // 延迟播放上升动画

              _this.scheduleOnce(() => {
                tween(node).to(0.2, {
                  position: targetPos
                }, {
                  easing: 'quadOut'
                }).call(() => {
                  if (_i4 === newList.length - 1) {
                    var plane3 = find("Dixing/Plane-003");

                    if (plane3) {
                      plane3.active = true;
                      var palne03Ani = plane3.getComponent(Animation);

                      if (palne03Ani) {
                        palne03Ani.play("Plane003CS");
                      } // this.showPlane(plane3);

                    } // 显示场景2的刚体


                    _this.displaySceneRigidBody((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                      error: Error()
                    }), PathEnum) : PathEnum).Scene3Physics); // 添加场景2的障碍物到避障里面


                    _this.addSceneToObstacle((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                      error: Error()
                    }), PathEnum) : PathEnum).Scene3Physics); // 更新门数据


                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.addSceneDoorFun((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                      error: Error()
                    }), PathEnum) : PathEnum).Scene3); // 检查哪些怪在这个场景中

                    var monsters = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.monsterManager.getSurroundedMonsters();

                    if (monsters.length > 0) {
                      for (var _i5 = 0; _i5 < monsters.length; _i5++) {
                        var _node3 = monsters[_i5];
                        if (!_node3 || !_node3.isValid) continue;

                        if (_node3.name == "Mantis") {
                          // 直接死五次
                          for (var j = 0; j < 5; j++) {
                            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                              error: Error()
                            }), DataManager) : DataManager).Instance.monsterManager.killMonsters([_node3]);
                          }
                        } else {
                          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                            error: Error()
                          }), DataManager) : DataManager).Instance.monsterManager.killMonsters([_node3]);
                        }
                      }
                    }

                    var _fencesScene2 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
                      error: Error()
                    }), PathEnum) : PathEnum).FencesScene3);

                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.collectGuardrails(_fencesScene2); // 结束游戏

                    if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.isGameEnd) return;

                    _this.scheduleOnce(() => {
                      (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                        error: Error()
                      }), DataManager) : DataManager).Instance.isGameEnd = true;
                      (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                        error: Error()
                      }), DataManager) : DataManager).Instance.gameEndManager.init();
                    }, 2);
                  }
                }).start();
              }, _i4 * 0.05); // 每个间隔 0.05s

            };

            for (var _i4 = 0; _i4 < newList.length; _i4++) {
              if (_loop2(_i4)) continue;
            }
          } else if (otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas9) {
            // 解锁传送带
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.conveyerBeltManager.init();
            this.scheduleOnce(() => {
              // 等待两秒钟，解锁自动运输模式
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.isConveyorBeltUnlocking = true;
            }, 2);
          } else if (otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas1 || otherNode.name == (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
            error: Error()
          }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas2) {
            var buildingCon = otherNode.getChildByName("BuildingCon");

            if (buildingCon) {
              var minion = buildingCon.getChildByName("Minion");

              if (minion) {
                var minionManager = minion.children[0].getComponent(_crd && MinionManager === void 0 ? (_reportPossibleCrUseOfMinionManager({
                  error: Error()
                }), MinionManager) : MinionManager);

                if (minionManager) {
                  minionManager.init();
                  minionManager.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
                    error: Error()
                  }), MinionStateEnum) : MinionStateEnum).Idle);
                  var worldPos = minion.worldPosition;
                  var effectPrafab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
                    error: Error()
                  }), EntityTypeEnum) : EntityTypeEnum).TX_shengjiLZ);
                  var skillExplosion = instantiate(effectPrafab);
                  director.getScene().addChild(skillExplosion);
                  skillExplosion.setWorldPosition(new Vec3(worldPos.x, worldPos.y + 1, worldPos.z));
                  var anim = skillExplosion == null ? void 0 : skillExplosion.getComponent(Animation);

                  if (anim) {
                    anim.play("TX_shengjiLZ");
                    anim.once(Animation.EventType.FINISHED, () => {
                      skillExplosion.destroy();
                    });
                  } else {
                    // 没动画时，延迟回收
                    this.scheduleOnce(() => {
                      skillExplosion.destroy();
                    }, 1);
                  }

                  tween(minion).to(0.4, {
                    scale: new Vec3(1, 1, 1)
                  }, {
                    easing: 'backOut' // 或 'elasticOut'，带弹力的缓出

                  }).call(() => {
                    minionManager.isLookingForMonsters = true;
                    minionManager.isMoveMinion = false;
                  }).start();
                }
              }
            }
          }
        }

        fadeInMesh3D(node, duration) {
          if (duration === void 0) {
            duration = 1.5;
          }

          var meshRenderer = node.getComponent(MeshRenderer);

          if (!meshRenderer) {
            console.warn('[fadeInMesh3D] 节点上缺少 MeshRenderer');
            return;
          }

          var sharedMat = meshRenderer.material;

          if (!sharedMat) {
            console.warn('[fadeInMesh3D] 没有共享材质');
            return;
          } // ✅ 创建材质（只用 effectAsset 初始化）


          var newMat = new Material();
          newMat.initialize({
            effectAsset: sharedMat.effectAsset
          }); // ✅ 设置混合模式（启用透明）

          var pass = newMat.passes[0];
          var blendTarget = pass.blendState.targets[0];
          blendTarget.blend = true;
          blendTarget.blendSrc = gfx.BlendFactor.SRC_ALPHA;
          blendTarget.blendDst = gfx.BlendFactor.ONE_MINUS_SRC_ALPHA;
          pass.blendState.targets[0] = blendTarget; // ✅ 设置初始颜色透明

          var baseColor = new Color(163, 150, 0, 0);
          var baseVec4 = new Vec4(baseColor.r / 255, baseColor.g / 255, baseColor.b / 255, 0);
          newMat.setProperty('mainColor', baseVec4); // ✅ 应用材质

          meshRenderer.setMaterial(newMat, 0); // ✅ tween 动画：透明 -> 不透明

          var fade = {
            alpha: 0
          };
          tween(fade).to(duration, {
            alpha: 1
          }, {
            onUpdate: () => {
              newMat.setProperty('mainColor', new Vec4(baseVec4.x, baseVec4.y, baseVec4.z, fade.alpha));
            }
          }).start();
        }

        fadeInMaterial(node, duration) {
          if (duration === void 0) {
            duration = 1.0;
          }

          var renderer = node.getComponent(MeshRenderer);
          if (!renderer) return;
          var material = renderer.getMaterial(0);
          if (!material) return; // 设置混合模式，允许透明（只需一次）

          var target = material.passes[0].blendState.targets[0];
          target.blend = true;
          target.blendSrc = 5; // src alpha

          target.blendDst = 6; // one minus src alpha

          target.blendEq = 0; // 初始为完全透明

          var color = new Color(255, 255, 255, 0);
          material.setProperty('albedo', color); // 注意：标准材质属性名是 'albedo'
          // Tween 到不透明

          var tempColor = color.clone();
          tween(tempColor).to(duration, new Color(255, 255, 255, 255), {
            onUpdate: () => {
              material.setProperty('albedo', tempColor);
            }
          }).start();
        } // 显示场景3的刚体


        displayScene3RigidBody() {
          var scene3Physics = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).Scene3Physics);
          if (!scene3Physics) return;

          for (var i = 0; i < scene3Physics.children.length; i++) {
            var dirNode = scene3Physics.children[i];
            if (!dirNode.activeInHierarchy) continue;

            for (var j = 0; j < dirNode.children.length; j++) {
              var node = dirNode.children[j];
              if (!node || !node.activeInHierarchy) continue;
              var boxColider = node.getComponent(BoxCollider);

              if (boxColider) {
                boxColider.enabled = true;
              }

              var rigidBody = node.getComponent(RigidBody);

              if (rigidBody) {
                rigidBody.enabled = true;
                rigidBody.wakeUp();
              }
            }
          }
        } // 添加场景到避障里面


        addSceneToObstacle(path) {
          var scenePhysics = find(path);

          for (var i = 0; i < scenePhysics.children.length; i++) {
            var outNode = scenePhysics.children[i];

            for (var j = 0; j < outNode.children.length; j++) {
              var inNode = outNode.children[j];

              if (inNode.name != "Scene2_R_Door") {
                (_crd && RVOObstacles === void 0 ? (_reportPossibleCrUseOfRVOObstacles({
                  error: Error()
                }), RVOObstacles) : RVOObstacles).addOneObstacle(inNode);
              }
            }
          }

          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.processObstacles();
        } // 显示场景2刚体


        displaySceneRigidBody(path) {
          var scenePhysics = find(path);
          if (!scenePhysics) return;

          for (var i = 0; i < scenePhysics.children.length; i++) {
            var dirNode = scenePhysics.children[i];
            if (!dirNode.activeInHierarchy) continue;

            for (var j = 0; j < dirNode.children.length; j++) {
              var node = dirNode.children[j];
              if (!node || !node.activeInHierarchy) continue;
              var boxCollider = node.getComponent(BoxCollider);
              var rigidBody = node.getComponent(RigidBody);

              if (boxCollider) {
                boxCollider.enabled = true;
              }

              if (rigidBody) {
                rigidBody.enabled = true;
                rigidBody.wakeUp();
              }
            }
          }
        } // 显示场景2路径


        displaySceneTwoPath() {
          var list = [];
          var roadS2H = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).RoadS2H);
          var roadS2S = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).RoadS2S);
          list.push(...roadS2H.children.reverse(), ...roadS2S.children);

          for (var i = 0; i < list.length; i++) {
            tween(list[i]).to(i * 0.1, {
              scale: new Vec3(1, 1, 1)
            }).start();
          }
        } // 角色获取武器


        getPlayerWeaponStep() {
          if (!this.isWeaponArea) {
            this._weaponCollecting = false;
            return;
          }

          var deliveryAreas7 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).DeliveryAreas7);
          if (!deliveryAreas7) return;
          var buildingCon = deliveryAreas7.getChildByName("BuildingCon");
          var weapons = buildingCon == null ? void 0 : buildingCon.getChildByName("Weapons");

          if (!weapons || this._weaponCollectIndex < 0 || this._weaponCollectIndex >= weapons.children.length) {
            this._weaponCollecting = false;
            return;
          }

          var weapon = weapons.children[this._weaponCollectIndex];
          this._weaponCollectIndex--;
          if (!weapon || !weapon.isValid) return;
          var backpack2 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node.getChildByName("Backpack2");
          if (!backpack2) return;
          var duration = 0.6;
          var start = weapon.worldPosition.clone();
          var controller = {
            t: 0
          };
          weapon.setParent(this.node.parent);
          weapon.setWorldPosition(start);
          this.playerWeaponRotationAni(weapon);
          tween(controller).to(duration, {
            t: 1
          }, {
            easing: 'quadOut',
            onUpdate: () => {
              var t = controller.t;
              var oneMinusT = 1 - t;
              var maxY = 0;

              for (var j = 0; j < backpack2.children.length; j++) {
                var child = backpack2.children[j];
                if (!child || !child.isValid) continue;
                var localPos = child.getPosition();

                if (localPos.y > maxY) {
                  maxY = localPos.y;
                }
              }

              var localTarget = new Vec3(0, maxY + 0.5, 0);
              var worldPos = backpack2.getWorldPosition();
              var worldRot = backpack2.getWorldRotation();
              var worldScale = backpack2.getWorldScale();
              var worldMat = new Mat4();
              Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);
              var worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat);
              var control = new Vec3((start.x + worldTarget.x) / 2, Math.max(start.y, worldTarget.y) + 2, (start.z + worldTarget.z) / 2);
              var pos = new Vec3(oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x, oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y, oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z);
              weapon.setWorldPosition(pos);
            }
          }).call(() => {
            var finalWorldPos = weapon.getWorldPosition().clone();
            weapon.setParent(backpack2);
            weapon.setWorldPosition(finalWorldPos);
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.WeaponPickingUpSoundPlay();

            if (this.onceData) {
              this.onceData = false;
              var data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                return item.name == "ObtainEquipmentArea";
              });

              if (data) {
                data.isFind = false;
                data.isDisplay = false;
              }

              var nextData = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                return item.name == "DeliverEquipmentArea";
              });

              if (nextData) {
                nextData.isFind = true;
                nextData.isDisplay = true;
              }
            }
          }).start();
        } // 武器旋转动画


        playerWeaponRotationAni(weapon) {
          var duration = 0.6; // 添加旋转动画（独立于位移动画）

          var startEuler = weapon.children[0].eulerAngles.clone(); // 初始角度（建议为 Vec3.ZERO）

          var targetEuler = new Vec3(123, -8, 180);
          var rotCtrl = {
            t: 0
          };
          tween(rotCtrl).to(duration, {
            t: 1
          }, {
            easing: 'quadOut',
            onUpdate: () => {
              var t = rotCtrl.t;
              var currentEuler = new Vec3();
              Vec3.lerp(currentEuler, startEuler, targetEuler, t);
              weapon.children[0].setRotationFromEuler(currentEuler.x, currentEuler.y, currentEuler.z);
            }
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletalAnimation", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "linearSpeed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "angularSpeed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 90;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "scene1TSide", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "scene1RSide", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "scene1BSide", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "scene1LSide", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "scene2TSide", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "scene2RSide", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "scene2BSide", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "scene2LSide", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "texture", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "R", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 163;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "G", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "B", [_dec16], {
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
//# sourceMappingURL=56e2b8ebb54c39c61eca34ec13d9665900aa7580.js.map