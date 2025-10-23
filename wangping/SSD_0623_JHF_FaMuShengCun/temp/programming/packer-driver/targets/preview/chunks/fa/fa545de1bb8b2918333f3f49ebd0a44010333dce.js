System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, tween, Vec3, Animation, StackManager, DataManager, SoundManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, WoodAccumulationConManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStackManager(extras) {
    _reporterNs.report("StackManager", "../StackSlot/StackManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../Common/SoundManager", _context.meta, extras);
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
      Node = _cc.Node;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Animation = _cc.Animation;
    }, function (_unresolved_2) {
      StackManager = _unresolved_2.StackManager;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }, function (_unresolved_4) {
      SoundManager = _unresolved_4.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "94743ldKqpJGb6iuuLuhyHJ", "WoodAccumulationConManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Vec3', 'Animation']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("WoodAccumulationConManager", WoodAccumulationConManager = (_dec = ccclass('WoodAccumulationConManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Animation), _dec(_class = (_class2 = class WoodAccumulationConManager extends Component {
        constructor() {
          super(...arguments);

          // 电锯火光特效
          _initializerDefineProperty(this, "chainsawNode", _descriptor, this);

          _initializerDefineProperty(this, "cutterStart", _descriptor2, this);

          _initializerDefineProperty(this, "cutterEnd", _descriptor3, this);

          _initializerDefineProperty(this, "conveyerBeltStart", _descriptor4, this);

          _initializerDefineProperty(this, "conveyerBeltEnd", _descriptor5, this);

          _initializerDefineProperty(this, "cameraPos", _descriptor6, this);

          _initializerDefineProperty(this, "logging", _descriptor7, this);

          this._row = 2;
          this._col = 7;
          this._gapX = 0.7;
          this._gapY = 2;
          this._gapZ = 0.7;
          this._maxLayer = 20000;
          this._isProcessing = false;
        }

        start() {
          if (this.node && !this.node["__stackManager"]) {
            this.node["__stackManager"] = new (_crd && StackManager === void 0 ? (_reportPossibleCrUseOfStackManager({
              error: Error()
            }), StackManager) : StackManager)(this._row, this._col, this._gapX, this._gapY, this._gapZ, this._maxLayer);
          }
        }

        update(deltaTime) {
          var _this$node;

          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isContinueFillFireWood) return;
          if (!((_this$node = this.node) != null && _this$node.active) || this._isProcessing || this.node.children.length <= 0) return;
          var wood = this.getTopItem();
          if (!(wood != null && wood.isValid)) return;
          this._isProcessing = true;

          this._processWood(wood);
        }

        _processWood(wood) {
          var startPos = wood.getWorldPosition();
          var endPos = this.cutterStart.worldPosition.clone();
          var startRot = wood.eulerAngles.clone();
          var endRot = new Vec3(0, 0, -90);
          var controlPoint = new Vec3((startPos.x + endPos.x) / 2, Math.max(startPos.y, endPos.y) + 15, (startPos.z + endPos.z) / 2);
          var level = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.conveyorLevel;
          var tParam = {
            t: 0
          };
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.curQuantityFirewood++;
          tween(tParam).to(0.6 / level, {
            t: 1
          }, {
            easing: 'quadOut',
            onUpdate: () => this._updateBezierMovement(wood, startPos, controlPoint, endPos, startRot, endRot, tParam.t),
            onComplete: () => this._onBezierComplete(wood, endRot)
          }).start();
        }

        _updateBezierMovement(wood, startPos, controlPoint, endPos, startRot, endRot, t) {
          var oneMinusT = 1 - t; // 三次贝塞尔插值位置

          var pos = new Vec3(oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x, oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y, oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z);
          wood.setWorldPosition(pos); // 欧拉角插值

          var euler = new Vec3(startRot.x * oneMinusT + endRot.x * t, startRot.y * oneMinusT + endRot.y * t, startRot.z * oneMinusT + endRot.z * t);
          wood.eulerAngles = euler;
        }

        _onBezierComplete(wood, endRot) {
          wood.eulerAngles = endRot;
          var moveStart = wood.getWorldPosition();
          var moveEnd = this.cutterEnd.worldPosition.clone(); // const level: number = DataManager.Instance.conveyorLevel;

          var moveParam = {
            t: 0
          }; // / level

          tween(moveParam).to(0.2, {
            t: 1
          }, {
            easing: 'quadInOut',
            onUpdate: () => {
              var t = moveParam.t;
              var pos = new Vec3(moveStart.x + (moveEnd.x - moveStart.x) * t, moveStart.y + (moveEnd.y - moveStart.y) * t, moveStart.z + (moveEnd.z - moveStart.z) * t);
              wood.setWorldPosition(pos);
            },
            onComplete: () => this._onMoveComplete(wood)
          }).start();
          if (this.chainsawNode) this.chainsawNode.active = true;
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).inst.playAudio('Sounds_jumutou');
        }

        _onMoveComplete(wood) {
          if (wood != null && wood.isValid) {
            wood.removeFromParent(); // DataManager.Instance.woodManager.onWoodDead(wood); // 如需放回对象池
          }

          this._isProcessing = false;
          if (this.chainsawNode) this.chainsawNode.active = false;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.boardManager.boardAni(this.conveyerBeltStart, this.conveyerBeltEnd); // this.logging.pause();
        }

        getTopItem() {
          var stackManager = this.node["__stackManager"];
          var lastSlot = stackManager.getLastOccupiedSlot();
          var node = (lastSlot == null ? void 0 : lastSlot.assignedNode) || null;
          if (node) stackManager.releaseSlot(node);
          return node;
        }

        getMidPoint(p0, p2, peakOffsetY) {
          return new Vec3((p0.x + p2.x) / 2, Math.max(p0.y, p2.y) + peakOffsetY, (p0.z + p2.z) / 2);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "chainsawNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cutterStart", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cutterEnd", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "conveyerBeltStart", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "conveyerBeltEnd", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "cameraPos", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "logging", [_dec8], {
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
//# sourceMappingURL=fa545de1bb8b2918333f3f49ebd0a44010333dce.js.map