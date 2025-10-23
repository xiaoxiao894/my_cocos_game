System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, AnimationClip, CCFloat, Collider, Color, Component, find, Label, math, Node, RigidBody, SkeletalAnimation, Sprite, Texture2D, tween, UIRenderer, v3, Vec3, StateDefine, MathUtil, DataManager, FunTypeEnum, PlotEnum, TypeItemEnum, GridPathController, SoundManager, ItemElectricTowerManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, tempVelocity, Actor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStateDefine(extras) {
    _reporterNs.report("StateDefine", "./StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Util/MathUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFunTypeEnum(extras) {
    _reporterNs.report("FunTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlotEnum(extras) {
    _reporterNs.report("PlotEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTypeItemEnum(extras) {
    _reporterNs.report("TypeItemEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStackManager(extras) {
    _reporterNs.report("StackManager", "../StackSlot/StackManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGridPathController(extras) {
    _reporterNs.report("GridPathController", "./GridPathController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../Common/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemElectricTowerManager(extras) {
    _reporterNs.report("ItemElectricTowerManager", "../ElectricTower/ItemElectricTowerManager", _context.meta, extras);
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
      CCFloat = _cc.CCFloat;
      Collider = _cc.Collider;
      Color = _cc.Color;
      Component = _cc.Component;
      find = _cc.find;
      Label = _cc.Label;
      math = _cc.math;
      Node = _cc.Node;
      RigidBody = _cc.RigidBody;
      SkeletalAnimation = _cc.SkeletalAnimation;
      Sprite = _cc.Sprite;
      Texture2D = _cc.Texture2D;
      tween = _cc.tween;
      UIRenderer = _cc.UIRenderer;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      StateDefine = _unresolved_2.StateDefine;
    }, function (_unresolved_3) {
      MathUtil = _unresolved_3.MathUtil;
    }, function (_unresolved_4) {
      DataManager = _unresolved_4.DataManager;
    }, function (_unresolved_5) {
      FunTypeEnum = _unresolved_5.FunTypeEnum;
      PlotEnum = _unresolved_5.PlotEnum;
      TypeItemEnum = _unresolved_5.TypeItemEnum;
    }, function (_unresolved_6) {
      GridPathController = _unresolved_6.default;
    }, function (_unresolved_7) {
      SoundManager = _unresolved_7.SoundManager;
    }, function (_unresolved_8) {
      ItemElectricTowerManager = _unresolved_8.ItemElectricTowerManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "526d5KpRDJM/5r9F6Cd6IPA", "Actor", undefined);

      __checkObsolete__(['_decorator', 'absMaxComponent', 'animation', 'Animation', 'AnimationClip', 'AnimationState', 'AsyncDelegate', 'BoxCollider', 'builtinResMgr', 'CCFloat', 'Collider', 'Color', 'Component', 'director', 'DynamicAtlasManager', 'EffectAsset', 'find', 'gfx', 'ICollisionEvent', 'instantiate', 'Label', 'Mat4', 'Material', 'math', 'MeshRenderer', 'Node', 'resources', 'RigidBody', 'SkeletalAnimation', 'Slider', 'Sprite', 'Texture2D', 'tween', 'UIOpacity', 'UIRenderer', 'v3', 'Vec3', 'Vec4', 'warnID']);

      ({
        ccclass,
        property
      } = _decorator);
      tempVelocity = v3();

      _export("Actor", Actor = (_dec = ccclass('Actor'), _dec2 = property(SkeletalAnimation), _dec3 = property(CCFloat), _dec4 = property(CCFloat), _dec5 = property(Node), _dec6 = property(Texture2D), _dec7 = property(Node), _dec8 = property(SkeletalAnimation), _dec9 = property(Animation), _dec(_class = (_class2 = class Actor extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "skeletalAnimation", _descriptor, this);

          _initializerDefineProperty(this, "linearSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "angularSpeed", _descriptor3, this);

          _initializerDefineProperty(this, "partnerCon", _descriptor4, this);

          _initializerDefineProperty(this, "texture", _descriptor5, this);

          // 升级动画
          _initializerDefineProperty(this, "powerPlant", _descriptor6, this);

          _initializerDefineProperty(this, "conveyorAni", _descriptor7, this);

          _initializerDefineProperty(this, "logging", _descriptor8, this);

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
          // 是否正在交付
          this.isDeliveryProgress = false;
          this.areaEffectNode = null;
          this._plots = ["Plot0", "Plot9", "Plot3", "Plot2", "Plot4"];
          this.stackOffsetY = 0.5;
          this._isEnterArea = false;
          this._deliverCooldown = 0.1;
          this._lastDeliverTime = 0;
          this._activeTransferringItems = new Set();
          this._curPlots = [];
          // === 贝塞尔转移动画 ===
          this._reservedLabelMap = new Map();
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

        update(deltaTime) {
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

          this.doMove(); //记录网格坐标

          (_crd && GridPathController === void 0 ? (_reportPossibleCrUseOfGridPathController({
            error: Error()
          }), GridPathController) : GridPathController).instance.updatePath(this.node.worldPosition.clone());
        }

        doMove() {
          var _this$rigidbody;

          var speed = this.linearSpeed * this.destForward.length() * 15;
          tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
          tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
          (_this$rigidbody = this.rigidbody) == null || _this$rigidbody.setLinearVelocity(tempVelocity);
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
          } else {// console.warn(`未找到动画状态：${clipName}`);
          }

          this.currentState = state;
        }

        // 进入
        onTriggerEnter(event) {
          this.isDeliveryProgress = true;
          this.resetLandDiscoloration();
          var otherCollider = event.otherCollider; // this._isEnterArea = true;

          this._curPlots.push(otherCollider.node.name);

          if (otherCollider && otherCollider.node.name == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
            error: Error()
          }), PlotEnum) : PlotEnum).Plot7) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isGetCoins = true;
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.arrowTargetNode._unlockHelper = false;
          } // 地块颜色


          this.landDiscoloration(otherCollider);
        }

        onTriggerStay(event) {
          // if (!this._isEnterArea) return;
          var otherCollider = event.otherCollider;

          this._handleExecution(otherCollider);
        } // 离开


        onTriggerExit(event) {
          var otherCollider = event.otherCollider; // this._isEnterArea = false;

          this.isDeliveryProgress = false;

          if (otherCollider && otherCollider.node.name == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
            error: Error()
          }), PlotEnum) : PlotEnum).Plot7) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isGetCoins = false;
          }

          var plotIndex = this._curPlots.findIndex(item => {
            return item == otherCollider.node.name;
          });

          if (plotIndex >= 0) {
            this._curPlots.splice(plotIndex, 1);
          }

          this.resetLandDiscoloration();
          this.isEnterPromptArea(otherCollider);
          var landmark = otherCollider.node.getChildByName("Landmark");

          if (landmark) {
            this.scheduleOnce(() => {
              this.stopBreathingAni(landmark);
            });
          }
        }

        isEnterPromptArea(otherCollider) {
          var guideTarget = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
            return item.isDisplay;
          });

          if (guideTarget && guideTarget.plot == otherCollider.node.name) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isEnterPromptArea = true;
          } else if (otherCollider.name == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
            error: Error()
          }), PlotEnum) : PlotEnum).Plot7) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isEnterPromptArea = true;
          }
        } // 执行处理函数


        _handleExecution(otherCollider) {
          var rule = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.rules.find(item => item.colliderName == otherCollider.node.name);
          if (!rule) return;
          var {
            placing,
            funType,
            typeItem,
            isChangValue
          } = rule; // 检查背包

          var playerNode = this.node;
          var backpack1 = playerNode.getChildByName("Backpack1");
          var backpack2 = playerNode.getChildByName("Backpack2");
          var backpack3 = playerNode.getChildByName("Backpack3");
          var backpacks = [backpack1, backpack2, backpack3].filter(Boolean);
          var targetPath = "THREE3DNODE/PlacingCon/" + placing;
          var targetCon = find(targetPath);

          if (!targetCon) {
            // console.log(`未找到目标容器 PlacingcCon/${placing}`);
            if (this.isDeliveryProgress == false) {
              var landmark = otherCollider.node.getChildByName("Landmark");

              if (landmark) {
                this.stopBreathingAni(landmark); // this.labelStopBreathingAni(landmark);
              }
            }

            return;
          }

          var obj = {
            isChangValue: isChangValue,
            otherCollider: otherCollider,
            isPlot1ArrangePos: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot1 == otherCollider.node.name ? true : false,
            isPlot7ArrangePos: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot7 == otherCollider.node.name ? true : false
          };

          if (funType == (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
            error: Error()
          }), FunTypeEnum) : FunTypeEnum).Deliver) {
            // 交付
            var sourceBackpack = this._findBackpackWithItem(backpacks, typeItem);

            if (sourceBackpack) {
              this.startDelivery(sourceBackpack, targetCon, obj);
            } else {
              if (this.isDeliveryProgress == false) {
                var _landmark = otherCollider.node.getChildByName("Landmark");

                if (_landmark) {
                  this.scheduleOnce(() => {
                    this.stopBreathingAni(_landmark); // this.labelStopBreathingAni(landmark);
                  }, 0.2);
                }
              } // console.warn(`未找到包含 ${typeItem} 的背包用于交付`);

            }
          } else if (funType == (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
            error: Error()
          }), FunTypeEnum) : FunTypeEnum).Collect) {
            // 收集
            var targetBackpack = this._findBackpackWithItem(backpacks, typeItem);

            if (!targetBackpack) {
              targetBackpack = this._findEmptyBackpack(backpacks);
            }

            if (targetBackpack) {
              this.collectAni(targetCon, targetBackpack, obj);
            } else {
              if (this.isDeliveryProgress == false) {
                var _landmark2 = otherCollider.node.getChildByName("Landmark");

                if (_landmark2) {
                  this.stopBreathingAni(_landmark2); // this.labelStopBreathingAni(landmark);
                }
              } // console.warn(`未找到可收集的目标背包（含${typeItem}或为空）`);

            }
          }
        } // 查找背包物品


        _findBackpackWithItem(backpacks, typeItem) {
          for (var bag of backpacks) {
            if (bag.children.some(child => child.name.includes(typeItem))) {
              return bag;
            }
          }

          return null;
        } // 查找空背包


        _findEmptyBackpack(backpacks) {
          return backpacks.find(bag => bag.children.length === 0) || null;
        }

        startDelivery(from, to, obj) {
          var now = performance.now(); // if (now - this._lastDeliverTime < this._deliverCooldown * 1000) return;

          this._lastDeliverTime = now;
          this.playBezierTransfer(from, to, 'deliver', obj);
        }

        collectAni(from, to, obj) {
          this.playBezierTransfer(from, to, 'collect', obj);
        }

        playBezierTransfer(from, to, mode, obj) {
          var _item;

          if (!from || !to) return;

          if (obj.isChangValue) {
            var landmark = obj.otherCollider.node.getChildByName("Landmark");

            if (!landmark || !this.reserveValueIfPossible(landmark, 1)) {
              // console.warn("资源不足，跳过交付");
              return;
            }
          }

          var children = from.children;
          if (children.length === 0) return;
          var stackManager = obj.isPlot1ArrangePos ? to["__stackManager"] : to["__stackManager"]; // to始终用于目标堆叠

          var item = null; // Plot5：从 from 的堆叠管理器中取顶部 item 并释放槽位

          if (obj.isPlot7ArrangePos) {
            var _fromStackManager$get;

            var fromStackManager = from["__stackManager"];

            if (!fromStackManager) {
              // console.warn("from 没有 stackManager，无法取出");
              return;
            }

            var slots = (_fromStackManager$get = fromStackManager.getAllOccupiedSlots == null ? void 0 : fromStackManager.getAllOccupiedSlots()) != null ? _fromStackManager$get : [];

            for (var i = slots.length - 1; i >= 0; i--) {
              var slot = slots[i];
              var node = slot.assignedNode;

              if (node && node.isValid && node['__fallingTarget'] === true) {
                item = node;
                fromStackManager.releaseSlot(node);
                break;
              }
            }

            if (!item) {
              // console.warn("Plot5 没有可收集的 __isReady 物品");
              return;
            }
          } else {
            for (var _i = children.length - 1; _i >= 0; _i--) {
              var child = children[_i];

              if (child['__isReady'] === true) {
                item = child;
                break;
              }
            }
          }

          if (!((_item = item) != null && _item.isValid)) return;

          if (mode == "deliver" && item.name == "Coin") {
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).inst.playAudio("YX_jinbi_jiaofu");
          } else if (mode == "deliver" && item.name == "Wood") {
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).inst.playAudio("Sounds_jiaofu_mutou");
          }

          this._activeTransferringItems.add(item);

          var startPos = item.getWorldPosition();
          item.parent = this.node;
          item.setWorldPosition(startPos);
          var endPos = null;

          if (obj.isPlot1ArrangePos) {
            var _slot = stackManager.assignSlot(item);

            if (!_slot) {
              this._activeTransferringItems.delete(item);

              return;
            }

            endPos = stackManager.getSlotWorldPos(_slot, to);
          } else {
            endPos = this._getStackTopWorldPos(to, this.stackOffsetY);
          }

          var curvePeakY = Math.max(startPos.y, endPos.y) + 8;
          var curvePeakYOffset = Math.abs(startPos.y - endPos.y);
          var controlPoint;

          if (curvePeakYOffset <= 2 && mode == "deliver" && item.name == "Coin") {
            controlPoint = new Vec3((startPos.x + endPos.x) / 2, curvePeakY, (startPos.z + endPos.z) / 2 + 2);
          } else {
            controlPoint = new Vec3((startPos.x + endPos.x) / 2, curvePeakY, (startPos.z + endPos.z) / 2);
          }

          if (this.isDeliveryProgress && obj.isChangValue) {
            this.isDeliveryProgress = false;

            var _landmark3 = obj.otherCollider.node.getChildByName("Landmark");

            var landmarkAni = _landmark3.getComponent(Animation);

            if (landmarkAni) {
              landmarkAni.play("UI_jiaofu");
            }
          }

          var tParam = {
            t: 0
          };
          var distance = Math.abs(startPos.y - endPos.y); // 使用指数衰减函数，提升高处下落速度

          var runTime = 1.2 * (1 - Math.exp(-distance / 50)); // 限定时间边界

          runTime = Math.min(Math.max(runTime, 0.3), 1.0);
          tween(tParam).to(runTime, {
            t: 1
          }, {
            onUpdate: () => {
              var t = tParam.t;
              var oneMinusT = 1 - t; // 计算贝塞尔曲线位置

              var current = new Vec3(oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x, oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y, oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z);
              item.setWorldPosition(current);
            },
            onComplete: () => {
              if (item.name == (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
                error: Error()
              }), TypeItemEnum) : TypeItemEnum).Wood) {
                item.eulerAngles = new Vec3(-90, 0, 0);

                if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.onlyGuidanceOnce) {
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.onlyGuidanceOnce = false;
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.mainCamera.woodGuidance();
                }
              } else {
                item.eulerAngles = new Vec3(0, 0, 0);
              }

              if (obj.isPlot7ArrangePos) {
                if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.UIPropertyManager) {
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.UIPropertyManager.collectProperty();
                  (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                    error: Error()
                  }), SoundManager) : SoundManager).inst.playAudio("YX_jinbi_shiqu");
                }
              } // 物理组件禁用


              var rigidBody = item.getComponent(RigidBody);

              if (rigidBody) {
                rigidBody.enabled = false;
              } // 禁用碰撞器


              var collider = item.getComponent(Collider);

              if (collider) {
                collider.enabled = false;
              }

              tween(item).to(0.15, {
                scale: new Vec3(1.2, 1.2, 1.2)
              }, {
                easing: 'quadOut'
              }).to(0.05, {
                scale: new Vec3(1, 1, 1)
              }, {
                easing: 'quadOut'
              }).start(); // 处理物体的位置

              if (obj.isPlot1ArrangePos) {
                var finalWorldPos = endPos;
                item.setWorldPosition(finalWorldPos);
                item.setParent(to);
                var localPos = new Vec3();
                to.inverseTransformPoint(localPos, finalWorldPos);
                item.setPosition(localPos);
              } else {
                var finalPos = null;

                if (item.name == "Coin") {
                  finalPos = this._getStackTopWorldPos(to, 0.3);
                } else {
                  finalPos = this._getStackTopWorldPos(to, this.stackOffsetY);
                }

                item.setWorldPosition(finalPos);
                item.setParent(to);

                var _localPos = new Vec3();

                to.inverseTransformPoint(_localPos, finalPos);
                item.setPosition(_localPos);
              }

              this._activeTransferringItems.delete(item);

              if (obj.isChangValue) {
                this.changeValueFun(item, obj);

                if (mode == "deliver") {
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.UIPropertyManager.deliverProperty();

                  var _landmark4 = obj.otherCollider.node.getChildByName("Landmark");

                  var label = _landmark4.getChildByName("Label");

                  var progress = _landmark4.getChildByName("jindu");

                  var data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                    return item.plot == obj.otherCollider.node.name;
                  });

                  if (data) {
                    var labelStr = label.getComponent(Label).string;
                    data.coinNum = labelStr;
                    var progressSprite = progress.getComponent(Sprite);

                    if (progressSprite) {
                      progressSprite.fillRange = (data.initCoinNum - data.coinNum) / data.initCoinNum;
                    }
                  }
                }
              }
            }
          }).start();
        }
        /**
         * plot2, 3, 4， 9
         * 
         * plot5 升级
         * 
         * plot6 传送
         */


        changeValueFun(item, obj) {
          var _this = this;

          item.removeFromParent();
          item.destroy(); // DataManager.Instance.coinManager.onProjectileDead(item);
          // ================== 主处理 ==================

          var landmark = obj.otherCollider.node.getChildByName("Landmark");
          if (!landmark) return;
          var newVal = this.finalizeReservedValue(landmark, 1);

          if (newVal === 0 && this.isDeliveryProgress === false) {
            this.stopBreathingAni(landmark);
          }

          var otherColliderNode = obj.otherCollider.node;
          if (newVal !== 0) return; // 只有清零才触发后续逻辑

          switch (otherColliderNode.name) {
            case (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot8:
              {
                // 解锁人物 + 解锁电塔两个地块 + 弹提示/特效
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.isUnlockHelper = true;
                this.cancelPhysics(otherColliderNode);
                this.shrinkHideLandmark(landmark, () => {
                  landmark.active = false;
                  this.unlockHelper(obj);
                  this.unlockPlot3AndPlot9();
                  this.setGuideDisplay((_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                    error: Error()
                  }), PlotEnum) : PlotEnum).Plot8, false, true);
                  this.playLevelUpOnce(otherColliderNode, "TX_shengjiLZ");
                });
                break;
              }

            case (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot3:
            case (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot9:
              {
                this.cancelPhysics(otherColliderNode);
                this.shrinkHideLandmark(landmark, () => {
                  this.scheduleOnce(() => this.plotLevelUpEffect(otherColliderNode), 0.2);
                  this.setGuideDisplay(otherColliderNode.name, false, true);
                  landmark.active = false;
                  this.activateElementCon(otherColliderNode, dtNode => {
                    var _dtNode$parent;

                    // 完成电线动画与DT弹起后，更新状态/解锁逻辑（两者一致）
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.curReduceTemplateTimeIndex++;
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.unlockPowerTowersNum++;
                    this.unlockTriggerConditions();
                    this.enablePhysics(dtNode);
                    var itemElectricTowerManager = dtNode == null || (_dtNode$parent = dtNode.parent) == null ? void 0 : _dtNode$parent.parent.getComponent(_crd && ItemElectricTowerManager === void 0 ? (_reportPossibleCrUseOfItemElectricTowerManager({
                      error: Error()
                    }), ItemElectricTowerManager) : ItemElectricTowerManager);

                    if (itemElectricTowerManager) {
                      itemElectricTowerManager.isNew = true;
                    }

                    if (otherColliderNode.name === (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                      error: Error()
                    }), PlotEnum) : PlotEnum).Plot3) {
                      // 激活Plot4并出现Landmark引导
                      var plot4 = find("THREE3DNODE/Unlock/Plot4");

                      if (plot4) {
                        plot4.active = true;
                        var lm = plot4.getChildByName("Landmark");
                        this.popShowLandmark(lm, (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                          error: Error()
                        }), PlotEnum) : PlotEnum).Plot4, true);
                      }
                    } else {
                      // name === PlotEnum.Plot9，激活Plot2并开物理+Landmark引导
                      var plot2 = find("THREE3DNODE/Unlock/Plot2");

                      if (plot2) {
                        plot2.active = true;
                        this.enablePhysics(plot2);

                        var _lm = plot2.getChildByName("Landmark");

                        this.popShowLandmark(_lm, (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                          error: Error()
                        }), PlotEnum) : PlotEnum).Plot2, true);
                      }
                    }
                  });
                });
                break;
              }

            case (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot4:
            case (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot2:
              {
                this.cancelPhysics(otherColliderNode);
                this.shrinkHideLandmark(landmark, () => {
                  this.scheduleOnce(() => this.plotLevelUpEffect(otherColliderNode), 0.2);
                  this.setGuideDisplay(otherColliderNode.name, false, true);
                  landmark.active = false;
                  this.activateElementCon(otherColliderNode, dtNode => {
                    var _dtNode$parent2;

                    this.enablePhysics(dtNode);
                    var itemElectricTowerManager = dtNode == null || (_dtNode$parent2 = dtNode.parent) == null ? void 0 : _dtNode$parent2.parent.getComponent(_crd && ItemElectricTowerManager === void 0 ? (_reportPossibleCrUseOfItemElectricTowerManager({
                      error: Error()
                    }), ItemElectricTowerManager) : ItemElectricTowerManager);

                    if (itemElectricTowerManager) {
                      itemElectricTowerManager.isNew = true;
                    }

                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.curReduceTemplateTimeIndex++;
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.unlockPowerTowersNum++;
                    this.unlockTriggerConditions();
                  });
                });
                break;
              }

            case (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot5:
              {
                // 升级建筑
                this.shrinkHideLandmark(landmark, () => {
                  this.setGuideDisplay((_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                    error: Error()
                  }), PlotEnum) : PlotEnum).Plot5, false, true);
                  landmark.active = false;
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.boardManager.denominatorUpgradeAni(30, 80, 0.03); // 三阶段展示 + 动画

                  var thirdShow = this.powerPlant.getChildByName("thirdShow");
                  if (thirdShow) thirdShow.active = true;
                  var plantAni = this.powerPlant.getComponent(Animation);
                  plantAni == null || plantAni.play("shengji02"); // 火焰动画与升级特效

                  var fire = this.powerPlant.getChildByName("TX_huoyan-001");

                  if (fire) {
                    fire.active = true;
                    var fireAni = fire.getComponent(Animation);
                    var fireState = fireAni == null ? void 0 : fireAni.getState("TX_huoyan");

                    if (fireState) {
                      fireState.speed = 0.35;
                      fireState.play();
                    }
                  }

                  this.playLevelUpOnce(this.powerPlant, "TX_shengji");
                  this.playLevelUpOnce(this.powerPlant, "TX_shengjiLZ");
                  this.scheduleOnce(() => {
                    var unlock = find("THREE3DNODE/Unlock");

                    var _loop = function _loop() {
                      var str = _this._plots[i];

                      _this.scheduleOnce(() => {
                        var plot = unlock.children.find(item => {
                          return item.name == str;
                        });

                        if (plot) {
                          var elementCon = plot.getChildByName("ElementCon");

                          if (elementCon) {
                            var node = elementCon.getChildByName("Node");

                            if (node) {
                              var dtani = node.getChildByName("DTani");

                              if (dtani) {
                                var dtaniAni = dtani.getComponent(Animation);
                                if (dtaniAni) dtaniAni.play("levelDT");
                                var shengji = dtani.getChildByName("TX_shengji_02");

                                if (shengji) {
                                  shengji.active = true;
                                }

                                (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                                  error: Error()
                                }), SoundManager) : SoundManager).inst.playAudio("YX_huoban");
                              }
                            }

                            ; // const itemElectricTowerManager = elementCon.getComponent(ItemElectricTowerManager);
                            // if (itemElectricTowerManager) {
                            //     itemElectricTowerManager.isNew = true;
                            // }
                            // 升级之后的电塔攻击距离

                            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                              error: Error()
                            }), DataManager) : DataManager).Instance.electricTowerAttackRange = 22.5;
                          }
                        }
                      }, i * 0.1);
                    };

                    for (var i = 0; i < this._plots.length; i++) {
                      _loop();
                    } // this.scheduleOnce(() => {


                    var _loop2 = function _loop2() {
                      var str = _this._plots[_i2];
                      var plot = unlock.children.find(item => {
                        return item.name == str;
                      });

                      if (plot) {
                        var elementCon = plot.getChildByName("ElementCon");

                        if (elementCon) {
                          var itemElectricTowerManager = elementCon.getComponent(_crd && ItemElectricTowerManager === void 0 ? (_reportPossibleCrUseOfItemElectricTowerManager({
                            error: Error()
                          }), ItemElectricTowerManager) : ItemElectricTowerManager);

                          if (itemElectricTowerManager) {
                            itemElectricTowerManager.isNew = true;
                          }
                        }
                      }
                    };

                    for (var _i2 = 0; _i2 < this._plots.length; _i2++) {
                      _loop2();
                    } // }, 1)

                  }, 0.6);
                  if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.mainCamera) (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.mainCamera.overGuide(); // 结束游戏

                  if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.isGameEnd) {
                    this.scheduleOnce(() => {
                      (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                        error: Error()
                      }), DataManager) : DataManager).Instance.isGameEnd = true;
                      (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                        error: Error()
                      }), DataManager) : DataManager).Instance.gameEndManager.init();
                    }, 2);
                  }

                  (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                    error: Error()
                  }), SoundManager) : SoundManager).inst.playAudio("YX_weiqiangSC");
                });
                break;
              }

            case (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot6:
              {
                // 升级传送带
                (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                  error: Error()
                }), SoundManager) : SoundManager).inst.playAudio("YX_weiqiangSC");
                this.shrinkHideLandmark(landmark, () => {
                  this.setGuideDisplay((_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                    error: Error()
                  }), PlotEnum) : PlotEnum).Plot6, false, true);
                  landmark.active = false; // 提速

                  var aniState = this.conveyorAni.getState("Take 001");
                  if (aniState) aniState.speed = 2;
                  var loggingState = this.logging.getState("chilun");
                  if (loggingState) loggingState.speed = 2;
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.conveyorLevel = 2;
                  this.plotLevelUpEffect(this.conveyorAni.node.parent, "TX_shengji");
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.isConveyerBeltUpgrade = true; // 切换皮带显示

                  var workflow = find("THREE3DNODE/Workflow");
                  var beltNode = workflow == null ? void 0 : workflow.getChildByName("chuansongdai");
                  (beltNode == null ? void 0 : beltNode.getChildByName("polySurface42")) && (beltNode.getChildByName("polySurface42").active = false);
                  (beltNode == null ? void 0 : beltNode.getChildByName("polySurface43")) && (beltNode.getChildByName("polySurface43").active = true);
                  var workflowAni = workflow == null ? void 0 : workflow.getComponent(Animation);
                  workflowAni == null || workflowAni.play("chuansongSJ");
                });
                break;
              }

            default:
              break;
          }
        }
        /** Landmark 收缩隐藏后回调 */


        shrinkHideLandmark(landmark, done) {
          tween(landmark).to(0.15, {
            scale: new Vec3(0, 0, 0)
          }, {
            easing: 'quadOut'
          }).call(done).start();
        }
        /** 设置引导列表的显示状态，并可选地标记进入提示区域 */


        setGuideDisplay(plot, isDisplay, enterPrompt) {
          if (enterPrompt === void 0) {
            enterPrompt = false;
          }

          var data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetList.find(it => it.plot === plot);
          if (data) data.isDisplay = isDisplay;
          if (enterPrompt) (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isEnterPromptArea = true;
        }
        /** 激活 ElementCon + 播放电线动画 + 弹起DT，完成后回调返还 DT 节点 */


        activateElementCon(parentPlot, onDtReady) {
          var elementCon = parentPlot.getChildByName("ElementCon");
          if (!elementCon) return;
          elementCon.active = true;
          elementCon.setScale(1, 1, 1);
          var node = elementCon.getChildByName("Node");
          var wireCon = node == null ? void 0 : node.getChildByName("WireCon");
          if (!wireCon) return;
          wireCon.active = true;
          var dianxian = wireCon.getChildByName("dianxian");
          var dianxianAni = dianxian == null ? void 0 : dianxian.getComponent(Animation);
          dianxianAni == null || dianxianAni.play("dianxianCS");
          dianxianAni == null || dianxianAni.once(Animation.EventType.FINISHED, () => {
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).inst.playAudio("YX_huoban");
            var dt = node.getChildByName("DTani");
            if (!dt) return;
            dt.active = true;
            dt.setScale(1, 0, 1);
            tween(dt).to(0.15, {
              scale: new Vec3(1, 1.2, 1)
            }, {
              easing: 'quadOut'
            }).to(0.05, {
              scale: new Vec3(1, 1, 1)
            }, {
              easing: 'quadOut'
            }).call(() => onDtReady(dt)).start();
          }, this);
        }
        /** 一键开刚体/碰撞体*/


        enablePhysics(node) {
          var col = node.getComponent(Collider);
          if (col) col.enabled = true;
          var rb = node.getComponent(RigidBody);
          if (rb) rb.enabled = true;
        }
        /** 播放一次性升级特效 */


        playLevelUpOnce(host, childName) {
          var fx = host.getChildByName(childName);
          if (!fx) return;
          fx.active = true;
          var ani = fx.getComponent(Animation);
          ani == null || ani.play();
          ani == null || ani.once(Animation.EventType.FINISHED, () => fx.active = false, this);
        }
        /** 弹出显示 Landmark（并更新引导显示） */


        popShowLandmark(landmark, plot, guideDisplay) {
          if (!landmark) return;
          landmark.active = true;
          landmark.setScale(0, 0, 0);
          tween(landmark).to(0.15, {
            scale: new Vec3(1.2, 1.2, 1.2)
          }, {
            easing: 'quadOut'
          }).to(0.05, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'quadOut'
          }).call(() => {
            this.setGuideDisplay(plot, guideDisplay, true);
          }).start();
        } // 解锁5 or 6


        unlockPlot5OrPlot6(plots) {
          var _loop3 = function _loop3() {
            var plotName = plots[i];
            var plot = find("THREE3DNODE/Unlock/" + plotName);

            if (plot) {
              plot.active = true;
              var landmark = plot.getChildByName("Landmark");
              landmark.active = true;
              landmark.setScale(0, 0, 0);
              tween(landmark).to(0.15, {
                scale: new Vec3(1.2, 1.2, 1.2)
              }, {
                easing: 'quadOut'
              }).to(0.05, {
                scale: new Vec3(1, 1, 1)
              }, {
                easing: 'quadOut'
              }).call(() => {
                if (plotName == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                  error: Error()
                }), PlotEnum) : PlotEnum).Plot6) {
                  var data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                    return item.plot == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                      error: Error()
                    }), PlotEnum) : PlotEnum).Plot6;
                  });

                  if (data) {
                    data.isDisplay = true;
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.isEnterPromptArea = true;
                  }
                } else if (plotName == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                  error: Error()
                }), PlotEnum) : PlotEnum).Plot5) {
                  var _data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                    return item.plot == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                      error: Error()
                    }), PlotEnum) : PlotEnum).Plot5;
                  });

                  if (_data) {
                    _data.isDisplay = true;
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.isEnterPromptArea = true;
                  }
                }
              }).start();
            }
          };

          for (var i = 0; i < plots.length; i++) {
            _loop3();
          }
        } // 解锁触发条件


        unlockTriggerConditions() {
          switch ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.unlockPowerTowersNum) {
            case 2:
              {
                var _Instance$sceneManage;

                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.bulletAttackTimeInterval = (_Instance$sceneManage = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.sceneManager.towerAttackInterval[1]) != null ? _Instance$sceneManage : 1;
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.monsterNum = 25;
              }
              break;

            case 3:
              {
                var _Instance$sceneManage2;

                var plots = [(_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                  error: Error()
                }), PlotEnum) : PlotEnum).Plot6]; // 解锁传送带地块

                this.unlockPlot5OrPlot6(plots);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.bornTimeLimit = 0.3;
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.bulletAttackTimeInterval = (_Instance$sceneManage2 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.sceneManager.towerAttackInterval[2]) != null ? _Instance$sceneManage2 : 0.9;
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.monsterNum = 30;
              }
              break;

            case 4:
              {
                {
                  var _Instance$sceneManage3;

                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.bulletAttackTimeInterval = (_Instance$sceneManage3 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.towerAttackInterval[3]) != null ? _Instance$sceneManage3 : 0.8;
                }
                break;
              }

            case 5:
              {
                var _Instance$sceneManage4;

                var _plots = [(_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                  error: Error()
                }), PlotEnum) : PlotEnum).Plot5];
                this.unlockPlot5OrPlot6(_plots);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.bornTimeLimit = 0.2;
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.bulletAttackTimeInterval = (_Instance$sceneManage4 = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.sceneManager.towerAttackInterval[4]) != null ? _Instance$sceneManage4 : 0.7;
              }
              break;

            default:
              break;
          }
        } // 金币停止呼吸动画


        stopBreathingAni(landmark) {
          var coinAni = landmark.getComponent(Animation);
          if (!coinAni) return;
          var clipName = "UI_jiaofu";
          var state = coinAni.getState(clipName); // 如果还没创建 state，则手动创建

          if (!state) {
            var _coinAni$clips;

            var clip = (_coinAni$clips = coinAni.clips) == null ? void 0 : _coinAni$clips.find(c => c && c.name === clipName);
            if (!clip) return;
            state = coinAni.createState(clip, clipName);
          } // 强制跳到第 0 秒并采样


          state.time = 0;
          state.sample();
          state.stop();
        } // 解锁plot3 和 plot9的两个地块


        unlockPlot3AndPlot9() {
          var plots = [(_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
            error: Error()
          }), PlotEnum) : PlotEnum).Plot3, (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
            error: Error()
          }), PlotEnum) : PlotEnum).Plot9];

          var _loop4 = function _loop4() {
            var plotName = plots[i];
            var plot = find("THREE3DNODE/Unlock/" + plotName);

            if (plot) {
              plot.active = true;
              var plotBoxCollider = plot.getComponent(Collider);

              if (plotBoxCollider) {
                plotBoxCollider.enabled = true;
              }

              var plotRightbody = plot.getComponent(RigidBody);

              if (plotRightbody) {
                plotRightbody.enabled = true;
              }

              var landmark = plot.getChildByName("Landmark");
              landmark.active = true;
              landmark.setScale(0, 0, 0);
              tween(landmark).to(0.15, {
                scale: new Vec3(1.2, 1.2, 1.2)
              }, {
                easing: 'quadOut'
              }).to(0.05, {
                scale: new Vec3(1, 1, 1)
              }, {
                easing: 'quadOut'
              }).call(() => {
                var data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                  return item.plot == plotName;
                });

                if (data) {
                  data.isDisplay = true;
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.isEnterPromptArea = true;
                }
              }).start();
            }
          };

          for (var i = 0; i < plots.length; i++) {
            _loop4();
          }
        }
        /**
         * 地块升级效果
         * @param node 地块节点
         */


        plotLevelUpEffect(node, name) {
          if (name === void 0) {
            name = "TX_shengjiLZ";
          }

          var levelUpNode = node.getChildByName(name);

          if (levelUpNode) {
            levelUpNode.active = true;
            levelUpNode.getComponent(Animation).play();
            levelUpNode.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
              levelUpNode.active = false;
            }, this);
          }
        } // 取消武器


        cancelPhysics(otherColliderNode) {
          var collider = otherColliderNode.getComponent(Collider);

          if (collider) {
            collider.enabled = false;
          }

          var rightBody = otherColliderNode.getComponent(Collider);

          if (rightBody) {
            rightBody.enabled = false;
          }
        } // 解锁士兵


        unlockHelper(obj) {
          var partner = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.partnerConManager.create();
          var worldPos = obj.otherCollider.node.getWorldPosition();
          partner.setPosition(worldPos);
          if (partner && this.partnerCon) partner.setParent(this.partnerCon);
        }

        reserveValueIfPossible(landmarkNode, amount) {
          var labelNode = landmarkNode.getChildByName("Label");
          var labelCom = labelNode == null ? void 0 : labelNode.getComponent(Label);
          if (!labelCom) return false;
          var key = landmarkNode.parent;
          var currentVal = Number(labelCom.string);
          var reserved = this._reservedLabelMap.get(key) || 0;
          if (currentVal - reserved < amount) return false;

          this._reservedLabelMap.set(key, reserved + amount);

          return true;
        }

        finalizeReservedValue(landmarkNode, amount) {
          var labelNode = landmarkNode.getChildByName("Label");
          var labelCom = labelNode == null ? void 0 : labelNode.getComponent(Label);
          if (!labelCom) return 0;
          var key = landmarkNode.parent;
          var currentVal = Number(labelCom.string);
          var newVal = Math.max(0, currentVal - amount);
          labelCom.string = "" + newVal;
          var reserved = this._reservedLabelMap.get(key) || 0;

          this._reservedLabelMap.set(key, Math.max(0, reserved - amount));

          return newVal;
        } // === 获取堆叠位置 ===


        _getStackTopWorldPos(container, offsetY) {
          var base = container.getWorldPosition();
          var maxY = 0;

          for (var child of container.children) {
            var y = child.getWorldPosition().y - base.y;
            if (y > maxY) maxY = y;
          }

          return new Vec3(base.x, base.y + maxY + offsetY, base.z);
        } // 修改地块颜色


        landDiscoloration(otherCollider) {
          this.resetLandDiscoloration();
          var landmark = otherCollider.node.getChildByName("Landmark");

          if (landmark) {
            var dashedBoxParent = landmark.getChildByName("kuang-001");

            if (dashedBoxParent) {
              this.areaEffectNode = dashedBoxParent;
              var renderer = dashedBoxParent.getComponent(UIRenderer);

              if (renderer) {
                renderer.color = new Color(61, 255, 0);
              }
            }
          }
        }

        resetLandDiscoloration() {
          var _this2 = this;

          var unlock = find("THREE3DNODE/Unlock");
          if (!unlock) return;

          var _loop5 = function _loop5(plot) {
            var plotName = _this2._curPlots.find(item => {
              return item == plot.name;
            });

            if (!plot || plotName) return 0; // continue

            var landmark = plot.getChildByName("Landmark");
            if (!landmark) return 0; // continue

            _this2.stopBreathingAni(landmark);

            var dashedBox = landmark.getChildByName("kuang-001");
            if (!dashedBox) return 0; // continue

            _this2.areaEffectNode = dashedBox;
            var renderer = dashedBox.getComponent(UIRenderer);

            if (renderer) {
              renderer.color = new Color(255, 255, 255);
            }
          },
              _ret;

          for (var plot of unlock.children) {
            _ret = _loop5(plot);
            if (_ret === 0) continue;
          }
        } // 重置plot动画


        resetPlotPromptAni() {
          var list = [find("ThreeDNode/Plot6"), find("ThreeDNode/Plot7"), find("ThreeDNode/Plot8"), find("ThreeDNode/Plot9")];

          for (var i = 0; i < list.length; i++) {
            var plotNode = list[i];
            if (!plotNode) continue;
            var renderer = plotNode.getComponent(UIRenderer);
            if (renderer) renderer.color = new Color(255, 255, 255, 255);
          }
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
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "partnerCon", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "texture", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "powerPlant", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "conveyorAni", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "logging", [_dec9], {
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
//# sourceMappingURL=a63cc4ed49c4edc1a5dd9f40981f924d8bd9629e.js.map