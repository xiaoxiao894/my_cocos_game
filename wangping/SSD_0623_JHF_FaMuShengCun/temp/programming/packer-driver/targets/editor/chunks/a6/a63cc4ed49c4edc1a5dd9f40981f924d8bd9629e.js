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
        constructor(...args) {
          super(...args);

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


          let a = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).signAngle(this.node.forward, this.destForward, Vec3.UP);
          let as = v3(0, a * 20, 0);
          this.rigidbody.setAngularVelocity(as); //  改成无条件执行移动（不依赖状态）

          this.doMove(); //记录网格坐标

          (_crd && GridPathController === void 0 ? (_reportPossibleCrUseOfGridPathController({
            error: Error()
          }), GridPathController) : GridPathController).instance.updatePath(this.node.worldPosition.clone());
        }

        doMove() {
          var _this$rigidbody;

          let speed = this.linearSpeed * this.destForward.length() * 15;
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

          const clipName = state; // 获取目标动画状态

          const aniState = (_this$skeletalAnimati = this.skeletalAnimation) == null ? void 0 : _this$skeletalAnimati.getState(clipName); // 如果是攻击状态，允许重复切换（防止攻击无法连击）

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
          const otherCollider = event.otherCollider; // this._isEnterArea = true;

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
          const otherCollider = event.otherCollider;

          this._handleExecution(otherCollider);
        } // 离开


        onTriggerExit(event) {
          const otherCollider = event.otherCollider; // this._isEnterArea = false;

          this.isDeliveryProgress = false;

          if (otherCollider && otherCollider.node.name == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
            error: Error()
          }), PlotEnum) : PlotEnum).Plot7) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isGetCoins = false;
          }

          const plotIndex = this._curPlots.findIndex(item => {
            return item == otherCollider.node.name;
          });

          if (plotIndex >= 0) {
            this._curPlots.splice(plotIndex, 1);
          }

          this.resetLandDiscoloration();
          this.isEnterPromptArea(otherCollider);
          const landmark = otherCollider.node.getChildByName("Landmark");

          if (landmark) {
            this.scheduleOnce(() => {
              this.stopBreathingAni(landmark);
            });
          }
        }

        isEnterPromptArea(otherCollider) {
          const guideTarget = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
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
          const rule = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.rules.find(item => item.colliderName == otherCollider.node.name);
          if (!rule) return;
          const {
            placing,
            funType,
            typeItem,
            isChangValue
          } = rule; // 检查背包

          const playerNode = this.node;
          const backpack1 = playerNode.getChildByName("Backpack1");
          const backpack2 = playerNode.getChildByName("Backpack2");
          const backpack3 = playerNode.getChildByName("Backpack3");
          const backpacks = [backpack1, backpack2, backpack3].filter(Boolean);
          const targetPath = `THREE3DNODE/PlacingCon/${placing}`;
          const targetCon = find(targetPath);

          if (!targetCon) {
            // console.log(`未找到目标容器 PlacingcCon/${placing}`);
            if (this.isDeliveryProgress == false) {
              const landmark = otherCollider.node.getChildByName("Landmark");

              if (landmark) {
                this.stopBreathingAni(landmark); // this.labelStopBreathingAni(landmark);
              }
            }

            return;
          }

          const obj = {
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
            let sourceBackpack = this._findBackpackWithItem(backpacks, typeItem);

            if (sourceBackpack) {
              this.startDelivery(sourceBackpack, targetCon, obj);
            } else {
              if (this.isDeliveryProgress == false) {
                const landmark = otherCollider.node.getChildByName("Landmark");

                if (landmark) {
                  this.scheduleOnce(() => {
                    this.stopBreathingAni(landmark); // this.labelStopBreathingAni(landmark);
                  }, 0.2);
                }
              } // console.warn(`未找到包含 ${typeItem} 的背包用于交付`);

            }
          } else if (funType == (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
            error: Error()
          }), FunTypeEnum) : FunTypeEnum).Collect) {
            // 收集
            let targetBackpack = this._findBackpackWithItem(backpacks, typeItem);

            if (!targetBackpack) {
              targetBackpack = this._findEmptyBackpack(backpacks);
            }

            if (targetBackpack) {
              this.collectAni(targetCon, targetBackpack, obj);
            } else {
              if (this.isDeliveryProgress == false) {
                const landmark = otherCollider.node.getChildByName("Landmark");

                if (landmark) {
                  this.stopBreathingAni(landmark); // this.labelStopBreathingAni(landmark);
                }
              } // console.warn(`未找到可收集的目标背包（含${typeItem}或为空）`);

            }
          }
        } // 查找背包物品


        _findBackpackWithItem(backpacks, typeItem) {
          for (const bag of backpacks) {
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
          const now = performance.now(); // if (now - this._lastDeliverTime < this._deliverCooldown * 1000) return;

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
            const landmark = obj.otherCollider.node.getChildByName("Landmark");

            if (!landmark || !this.reserveValueIfPossible(landmark, 1)) {
              // console.warn("资源不足，跳过交付");
              return;
            }
          }

          const children = from.children;
          if (children.length === 0) return;
          const stackManager = obj.isPlot1ArrangePos ? to["__stackManager"] : to["__stackManager"]; // to始终用于目标堆叠

          let item = null; // Plot5：从 from 的堆叠管理器中取顶部 item 并释放槽位

          if (obj.isPlot7ArrangePos) {
            var _fromStackManager$get;

            const fromStackManager = from["__stackManager"];

            if (!fromStackManager) {
              // console.warn("from 没有 stackManager，无法取出");
              return;
            }

            const slots = (_fromStackManager$get = fromStackManager.getAllOccupiedSlots == null ? void 0 : fromStackManager.getAllOccupiedSlots()) != null ? _fromStackManager$get : [];

            for (let i = slots.length - 1; i >= 0; i--) {
              const slot = slots[i];
              const node = slot.assignedNode;

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
            for (let i = children.length - 1; i >= 0; i--) {
              const child = children[i];

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

          const startPos = item.getWorldPosition();
          item.parent = this.node;
          item.setWorldPosition(startPos);
          let endPos = null;

          if (obj.isPlot1ArrangePos) {
            const slot = stackManager.assignSlot(item);

            if (!slot) {
              this._activeTransferringItems.delete(item);

              return;
            }

            endPos = stackManager.getSlotWorldPos(slot, to);
          } else {
            endPos = this._getStackTopWorldPos(to, this.stackOffsetY);
          }

          const curvePeakY = Math.max(startPos.y, endPos.y) + 8;
          const curvePeakYOffset = Math.abs(startPos.y - endPos.y);
          let controlPoint;

          if (curvePeakYOffset <= 2 && mode == "deliver" && item.name == "Coin") {
            controlPoint = new Vec3((startPos.x + endPos.x) / 2, curvePeakY, (startPos.z + endPos.z) / 2 + 2);
          } else {
            controlPoint = new Vec3((startPos.x + endPos.x) / 2, curvePeakY, (startPos.z + endPos.z) / 2);
          }

          if (this.isDeliveryProgress && obj.isChangValue) {
            this.isDeliveryProgress = false;
            const landmark = obj.otherCollider.node.getChildByName("Landmark");
            const landmarkAni = landmark.getComponent(Animation);

            if (landmarkAni) {
              landmarkAni.play("UI_jiaofu");
            }
          }

          const tParam = {
            t: 0
          };
          let distance = Math.abs(startPos.y - endPos.y); // 使用指数衰减函数，提升高处下落速度

          let runTime = 1.2 * (1 - Math.exp(-distance / 50)); // 限定时间边界

          runTime = Math.min(Math.max(runTime, 0.3), 1.0);
          tween(tParam).to(runTime, {
            t: 1
          }, {
            onUpdate: () => {
              const t = tParam.t;
              const oneMinusT = 1 - t; // 计算贝塞尔曲线位置

              const current = new Vec3(oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x, oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y, oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z);
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


              const rigidBody = item.getComponent(RigidBody);

              if (rigidBody) {
                rigidBody.enabled = false;
              } // 禁用碰撞器


              const collider = item.getComponent(Collider);

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
                const finalWorldPos = endPos;
                item.setWorldPosition(finalWorldPos);
                item.setParent(to);
                const localPos = new Vec3();
                to.inverseTransformPoint(localPos, finalWorldPos);
                item.setPosition(localPos);
              } else {
                let finalPos = null;

                if (item.name == "Coin") {
                  finalPos = this._getStackTopWorldPos(to, 0.3);
                } else {
                  finalPos = this._getStackTopWorldPos(to, this.stackOffsetY);
                }

                item.setWorldPosition(finalPos);
                item.setParent(to);
                const localPos = new Vec3();
                to.inverseTransformPoint(localPos, finalPos);
                item.setPosition(localPos);
              }

              this._activeTransferringItems.delete(item);

              if (obj.isChangValue) {
                this.changeValueFun(item, obj);

                if (mode == "deliver") {
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.UIPropertyManager.deliverProperty();
                  const landmark = obj.otherCollider.node.getChildByName("Landmark");
                  const label = landmark.getChildByName("Label");
                  const progress = landmark.getChildByName("jindu");
                  const data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                    return item.plot == obj.otherCollider.node.name;
                  });

                  if (data) {
                    const labelStr = label.getComponent(Label).string;
                    data.coinNum = labelStr;
                    const progressSprite = progress.getComponent(Sprite);

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
          item.removeFromParent();
          item.destroy(); // DataManager.Instance.coinManager.onProjectileDead(item);
          // ================== 主处理 ==================

          const landmark = obj.otherCollider.node.getChildByName("Landmark");
          if (!landmark) return;
          const newVal = this.finalizeReservedValue(landmark, 1);

          if (newVal === 0 && this.isDeliveryProgress === false) {
            this.stopBreathingAni(landmark);
          }

          const otherColliderNode = obj.otherCollider.node;
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
                    const itemElectricTowerManager = dtNode == null || (_dtNode$parent = dtNode.parent) == null ? void 0 : _dtNode$parent.parent.getComponent(_crd && ItemElectricTowerManager === void 0 ? (_reportPossibleCrUseOfItemElectricTowerManager({
                      error: Error()
                    }), ItemElectricTowerManager) : ItemElectricTowerManager);

                    if (itemElectricTowerManager) {
                      itemElectricTowerManager.isNew = true;
                    }

                    if (otherColliderNode.name === (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                      error: Error()
                    }), PlotEnum) : PlotEnum).Plot3) {
                      // 激活Plot4并出现Landmark引导
                      const plot4 = find("THREE3DNODE/Unlock/Plot4");

                      if (plot4) {
                        plot4.active = true;
                        const lm = plot4.getChildByName("Landmark");
                        this.popShowLandmark(lm, (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                          error: Error()
                        }), PlotEnum) : PlotEnum).Plot4, true);
                      }
                    } else {
                      // name === PlotEnum.Plot9，激活Plot2并开物理+Landmark引导
                      const plot2 = find("THREE3DNODE/Unlock/Plot2");

                      if (plot2) {
                        plot2.active = true;
                        this.enablePhysics(plot2);
                        const lm = plot2.getChildByName("Landmark");
                        this.popShowLandmark(lm, (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
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
                    const itemElectricTowerManager = dtNode == null || (_dtNode$parent2 = dtNode.parent) == null ? void 0 : _dtNode$parent2.parent.getComponent(_crd && ItemElectricTowerManager === void 0 ? (_reportPossibleCrUseOfItemElectricTowerManager({
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

                  const thirdShow = this.powerPlant.getChildByName("thirdShow");
                  if (thirdShow) thirdShow.active = true;
                  const plantAni = this.powerPlant.getComponent(Animation);
                  plantAni == null || plantAni.play("shengji02"); // 火焰动画与升级特效

                  const fire = this.powerPlant.getChildByName("TX_huoyan-001");

                  if (fire) {
                    fire.active = true;
                    const fireAni = fire.getComponent(Animation);
                    const fireState = fireAni == null ? void 0 : fireAni.getState("TX_huoyan");

                    if (fireState) {
                      fireState.speed = 0.35;
                      fireState.play();
                    }
                  }

                  this.playLevelUpOnce(this.powerPlant, "TX_shengji");
                  this.playLevelUpOnce(this.powerPlant, "TX_shengjiLZ");
                  this.scheduleOnce(() => {
                    const unlock = find("THREE3DNODE/Unlock");

                    for (let i = 0; i < this._plots.length; i++) {
                      const str = this._plots[i];
                      this.scheduleOnce(() => {
                        const plot = unlock.children.find(item => {
                          return item.name == str;
                        });

                        if (plot) {
                          const elementCon = plot.getChildByName("ElementCon");

                          if (elementCon) {
                            const node = elementCon.getChildByName("Node");

                            if (node) {
                              const dtani = node.getChildByName("DTani");

                              if (dtani) {
                                const dtaniAni = dtani.getComponent(Animation);
                                if (dtaniAni) dtaniAni.play("levelDT");
                                const shengji = dtani.getChildByName("TX_shengji_02");

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
                    } // this.scheduleOnce(() => {


                    for (let i = 0; i < this._plots.length; i++) {
                      const str = this._plots[i];
                      const plot = unlock.children.find(item => {
                        return item.name == str;
                      });

                      if (plot) {
                        const elementCon = plot.getChildByName("ElementCon");

                        if (elementCon) {
                          const itemElectricTowerManager = elementCon.getComponent(_crd && ItemElectricTowerManager === void 0 ? (_reportPossibleCrUseOfItemElectricTowerManager({
                            error: Error()
                          }), ItemElectricTowerManager) : ItemElectricTowerManager);

                          if (itemElectricTowerManager) {
                            itemElectricTowerManager.isNew = true;
                          }
                        }
                      }
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

                  const aniState = this.conveyorAni.getState("Take 001");
                  if (aniState) aniState.speed = 2;
                  const loggingState = this.logging.getState("chilun");
                  if (loggingState) loggingState.speed = 2;
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.conveyorLevel = 2;
                  this.plotLevelUpEffect(this.conveyorAni.node.parent, "TX_shengji");
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.isConveyerBeltUpgrade = true; // 切换皮带显示

                  const workflow = find("THREE3DNODE/Workflow");
                  const beltNode = workflow == null ? void 0 : workflow.getChildByName("chuansongdai");
                  (beltNode == null ? void 0 : beltNode.getChildByName("polySurface42")) && (beltNode.getChildByName("polySurface42").active = false);
                  (beltNode == null ? void 0 : beltNode.getChildByName("polySurface43")) && (beltNode.getChildByName("polySurface43").active = true);
                  const workflowAni = workflow == null ? void 0 : workflow.getComponent(Animation);
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


        setGuideDisplay(plot, isDisplay, enterPrompt = false) {
          const data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetList.find(it => it.plot === plot);
          if (data) data.isDisplay = isDisplay;
          if (enterPrompt) (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isEnterPromptArea = true;
        }
        /** 激活 ElementCon + 播放电线动画 + 弹起DT，完成后回调返还 DT 节点 */


        activateElementCon(parentPlot, onDtReady) {
          const elementCon = parentPlot.getChildByName("ElementCon");
          if (!elementCon) return;
          elementCon.active = true;
          elementCon.setScale(1, 1, 1);
          const node = elementCon.getChildByName("Node");
          const wireCon = node == null ? void 0 : node.getChildByName("WireCon");
          if (!wireCon) return;
          wireCon.active = true;
          const dianxian = wireCon.getChildByName("dianxian");
          const dianxianAni = dianxian == null ? void 0 : dianxian.getComponent(Animation);
          dianxianAni == null || dianxianAni.play("dianxianCS");
          dianxianAni == null || dianxianAni.once(Animation.EventType.FINISHED, () => {
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).inst.playAudio("YX_huoban");
            const dt = node.getChildByName("DTani");
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
          const col = node.getComponent(Collider);
          if (col) col.enabled = true;
          const rb = node.getComponent(RigidBody);
          if (rb) rb.enabled = true;
        }
        /** 播放一次性升级特效 */


        playLevelUpOnce(host, childName) {
          const fx = host.getChildByName(childName);
          if (!fx) return;
          fx.active = true;
          const ani = fx.getComponent(Animation);
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
          for (let i = 0; i < plots.length; i++) {
            const plotName = plots[i];
            const plot = find(`THREE3DNODE/Unlock/${plotName}`);

            if (plot) {
              plot.active = true;
              const landmark = plot.getChildByName("Landmark");
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
                  const data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
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
                  const data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                    return item.plot == (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                      error: Error()
                    }), PlotEnum) : PlotEnum).Plot5;
                  });

                  if (data) {
                    data.isDisplay = true;
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.isEnterPromptArea = true;
                  }
                }
              }).start();
            }
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

                const plots = [(_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
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

                const plots = [(_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
                  error: Error()
                }), PlotEnum) : PlotEnum).Plot5];
                this.unlockPlot5OrPlot6(plots);
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
          const coinAni = landmark.getComponent(Animation);
          if (!coinAni) return;
          const clipName = "UI_jiaofu";
          let state = coinAni.getState(clipName); // 如果还没创建 state，则手动创建

          if (!state) {
            var _coinAni$clips;

            const clip = (_coinAni$clips = coinAni.clips) == null ? void 0 : _coinAni$clips.find(c => c && c.name === clipName);
            if (!clip) return;
            state = coinAni.createState(clip, clipName);
          } // 强制跳到第 0 秒并采样


          state.time = 0;
          state.sample();
          state.stop();
        } // 解锁plot3 和 plot9的两个地块


        unlockPlot3AndPlot9() {
          const plots = [(_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
            error: Error()
          }), PlotEnum) : PlotEnum).Plot3, (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
            error: Error()
          }), PlotEnum) : PlotEnum).Plot9];

          for (let i = 0; i < plots.length; i++) {
            const plotName = plots[i];
            const plot = find(`THREE3DNODE/Unlock/${plotName}`);

            if (plot) {
              plot.active = true;
              const plotBoxCollider = plot.getComponent(Collider);

              if (plotBoxCollider) {
                plotBoxCollider.enabled = true;
              }

              const plotRightbody = plot.getComponent(RigidBody);

              if (plotRightbody) {
                plotRightbody.enabled = true;
              }

              const landmark = plot.getChildByName("Landmark");
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
                const data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
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
          }
        }
        /**
         * 地块升级效果
         * @param node 地块节点
         */


        plotLevelUpEffect(node, name = "TX_shengjiLZ") {
          let levelUpNode = node.getChildByName(name);

          if (levelUpNode) {
            levelUpNode.active = true;
            levelUpNode.getComponent(Animation).play();
            levelUpNode.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
              levelUpNode.active = false;
            }, this);
          }
        } // 取消武器


        cancelPhysics(otherColliderNode) {
          const collider = otherColliderNode.getComponent(Collider);

          if (collider) {
            collider.enabled = false;
          }

          const rightBody = otherColliderNode.getComponent(Collider);

          if (rightBody) {
            rightBody.enabled = false;
          }
        } // 解锁士兵


        unlockHelper(obj) {
          const partner = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.partnerConManager.create();
          const worldPos = obj.otherCollider.node.getWorldPosition();
          partner.setPosition(worldPos);
          if (partner && this.partnerCon) partner.setParent(this.partnerCon);
        }

        reserveValueIfPossible(landmarkNode, amount) {
          const labelNode = landmarkNode.getChildByName("Label");
          const labelCom = labelNode == null ? void 0 : labelNode.getComponent(Label);
          if (!labelCom) return false;
          const key = landmarkNode.parent;
          const currentVal = Number(labelCom.string);
          const reserved = this._reservedLabelMap.get(key) || 0;
          if (currentVal - reserved < amount) return false;

          this._reservedLabelMap.set(key, reserved + amount);

          return true;
        }

        finalizeReservedValue(landmarkNode, amount) {
          const labelNode = landmarkNode.getChildByName("Label");
          const labelCom = labelNode == null ? void 0 : labelNode.getComponent(Label);
          if (!labelCom) return 0;
          const key = landmarkNode.parent;
          const currentVal = Number(labelCom.string);
          const newVal = Math.max(0, currentVal - amount);
          labelCom.string = `${newVal}`;
          const reserved = this._reservedLabelMap.get(key) || 0;

          this._reservedLabelMap.set(key, Math.max(0, reserved - amount));

          return newVal;
        } // === 获取堆叠位置 ===


        _getStackTopWorldPos(container, offsetY) {
          const base = container.getWorldPosition();
          let maxY = 0;

          for (const child of container.children) {
            const y = child.getWorldPosition().y - base.y;
            if (y > maxY) maxY = y;
          }

          return new Vec3(base.x, base.y + maxY + offsetY, base.z);
        } // 修改地块颜色


        landDiscoloration(otherCollider) {
          this.resetLandDiscoloration();
          const landmark = otherCollider.node.getChildByName("Landmark");

          if (landmark) {
            const dashedBoxParent = landmark.getChildByName("kuang-001");

            if (dashedBoxParent) {
              this.areaEffectNode = dashedBoxParent;
              const renderer = dashedBoxParent.getComponent(UIRenderer);

              if (renderer) {
                renderer.color = new Color(61, 255, 0);
              }
            }
          }
        }

        resetLandDiscoloration() {
          const unlock = find("THREE3DNODE/Unlock");
          if (!unlock) return;

          for (const plot of unlock.children) {
            const plotName = this._curPlots.find(item => {
              return item == plot.name;
            });

            if (!plot || plotName) continue;
            const landmark = plot.getChildByName("Landmark");
            if (!landmark) continue;
            this.stopBreathingAni(landmark);
            const dashedBox = landmark.getChildByName("kuang-001");
            if (!dashedBox) continue;
            this.areaEffectNode = dashedBox;
            const renderer = dashedBox.getComponent(UIRenderer);

            if (renderer) {
              renderer.color = new Color(255, 255, 255);
            }
          }
        } // 重置plot动画


        resetPlotPromptAni() {
          const list = [find("ThreeDNode/Plot6"), find("ThreeDNode/Plot7"), find("ThreeDNode/Plot8"), find("ThreeDNode/Plot9")];

          for (let i = 0; i < list.length; i++) {
            const plotNode = list[i];
            if (!plotNode) continue;
            const renderer = plotNode.getComponent(UIRenderer);
            if (renderer) renderer.color = new Color(255, 255, 255, 255);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletalAnimation", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "linearSpeed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "angularSpeed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 90;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "partnerCon", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "texture", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "powerPlant", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "conveyorAni", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "logging", [_dec9], {
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
//# sourceMappingURL=a63cc4ed49c4edc1a5dd9f40981f924d8bd9629e.js.map