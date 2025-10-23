System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Node, Quat, RopeGeneratorNew, RopeBatch, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, CompleteRopeItem;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRopeGeneratorNew(extras) {
    _reporterNs.report("RopeGeneratorNew", "./RopeGeneratorNew", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRopeBatch(extras) {
    _reporterNs.report("RopeBatch", "./RopeBatch", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Quat = _cc.Quat;
    }, function (_unresolved_2) {
      RopeGeneratorNew = _unresolved_2.RopeGeneratorNew;
    }, function (_unresolved_3) {
      RopeBatch = _unresolved_3.RopeBatch;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8f87dFROI1DLaTDHkskvjbT", "CompleteRopeItem", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Material', 'MeshRenderer', 'Node', 'Quat', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CompleteRopeItem", CompleteRopeItem = (_dec = ccclass('CompleteRopeItem'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class CompleteRopeItem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "ropeNode", _descriptor, this);

          _initializerDefineProperty(this, "effectNode", _descriptor2, this);

          _initializerDefineProperty(this, "ropeParent", _descriptor3, this);

          /** 状态 0未连接 1连接中 2已连接 */
          this._state = 0;
          this._index = 0;
          this._ropeLen = 120;
          this._rope = null;
          this.headNode = null;
          this.endNode = null;
          this._reopIndex = 0;
          this._timeAccumulator = 0;
          this._yOffset = -2;
          this._yDirection = 1;
        }

        set state(value) {
          this._state = value;

          if (this._state === 1) {
            this._rope.startMove(); //取消合批


            this.unschedule(this.batchStaticModel);
            this.node.getComponent(_crd && RopeBatch === void 0 ? (_reportPossibleCrUseOfRopeBatch({
              error: Error()
            }), RopeBatch) : RopeBatch).unbatchStaticModel();
          } else {
            if (this._state === 2) {
              this._rope.stopMove();
            } else {
              this._rope.stopMove();
            } //合批


            this.scheduleOnce(this.batchStaticModel, 6);
          }
        }

        get state() {
          return this._state;
        }

        init(index, startNode, endNode) {
          this._index = index;
          this._state = 0;
          this.headNode = startNode;
          this.endNode = endNode;
          this.effectNode.active = false;
          this.creatRope();
        }

        creatRope() {
          var ropeNode = instantiate(this.ropeNode);
          ropeNode.active = true;
          ropeNode.parent = this.ropeParent;
          ropeNode.getComponent(_crd && RopeGeneratorNew === void 0 ? (_reportPossibleCrUseOfRopeGeneratorNew({
            error: Error()
          }), RopeGeneratorNew) : RopeGeneratorNew).createRope(this._ropeLen, this.headNode, this.endNode);
          this._rope = ropeNode.getComponent(_crd && RopeGeneratorNew === void 0 ? (_reportPossibleCrUseOfRopeGeneratorNew({
            error: Error()
          }), RopeGeneratorNew) : RopeGeneratorNew); //8秒后合批

          this.scheduleOnce(this.batchStaticModel, 8);
        }

        // 1表示递增，-1表示递减
        update(deltaTime) {
          if (this._state === 2) {
            if (this._reopIndex < 0) {
              this._reopIndex = this.ropeParent.children.length - 1;
            }

            var newPos = this.ropeParent.children[Math.floor(this._reopIndex)].worldPosition.clone();
            newPos.y += 2;
            newPos.x -= -0.3; // // 累积时间
            // this._timeAccumulator += deltaTime;
            // if (this._timeAccumulator >= 0.01) {
            //     // 每0.01秒更新y偏移，范围-2到2循环
            //     this._yOffset += this._yDirection * 0.1; // 每次变化0.1，可调节速度
            //     if (this._yOffset >= 2) {
            //         this._yOffset = 2;
            //         this._yDirection = -1;
            //     } else if (this._yOffset <= -0.5) {
            //         this._yOffset = -0.5;
            //         this._yDirection = 1;
            //     }
            //     this._timeAccumulator = 0;
            // }
            // newPos.x += this._yOffset;
            // newPos.y += this._yOffset;

            if (!this.effectNode.active) {
              this.effectNode.active = true;
            }

            var rotation = Quat.fromEuler(new Quat(), 0, -90, 0);
            this.effectNode.setWorldRotation(rotation);
            this.effectNode.setWorldPosition(newPos); // 每帧减少一个索引，使用累积速度实现加速

            this._reopIndex -= deltaTime * 60 * 2.8; // 5为加速倍数，60为假设帧率，调节加速速度

            if (this._reopIndex < 0) {
              this._reopIndex += this.ropeParent.children.length;
            }
          }
        }

        shackRope() {
          this._rope.shackRope();
        }

        batchStaticModel() {
          this.node.getComponent(_crd && RopeBatch === void 0 ? (_reportPossibleCrUseOfRopeBatch({
            error: Error()
          }), RopeBatch) : RopeBatch).batchStaticModel();
        }

        unbatchStaticModel() {
          this.unschedule(this.batchStaticModel);
          this.node.getComponent(_crd && RopeBatch === void 0 ? (_reportPossibleCrUseOfRopeBatch({
            error: Error()
          }), RopeBatch) : RopeBatch).unbatchStaticModel();

          this._rope.startMove();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ropeNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "effectNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "ropeParent", [_dec4], {
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
//# sourceMappingURL=b5866728cc4b1886785b89860a24e46758101b6d.js.map