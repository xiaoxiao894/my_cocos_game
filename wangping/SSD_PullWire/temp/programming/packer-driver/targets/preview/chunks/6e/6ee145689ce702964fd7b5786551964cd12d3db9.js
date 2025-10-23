System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCInteger, Component, Node, Vec3, Animation, EventManager, EventName, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, HandComonent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "../Common/Enum", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCInteger = _cc.CCInteger;
      Component = _cc.Component;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
      Animation = _cc.Animation;
    }, function (_unresolved_2) {
      EventManager = _unresolved_2.EventManager;
    }, function (_unresolved_3) {
      EventName = _unresolved_3.EventName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fb7e9GfIeNMo4zO2SAEXaKB", "HandComonent", undefined);

      __checkObsolete__(['_decorator', 'CCInteger', 'Color', 'Component', 'Layers', 'Node', 'Sprite', 'Tween', 'tween', 'Vec3', 'Animation']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HandComonent", HandComonent = (_dec = ccclass('HandComonent'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Vec3), _dec5 = property(Vec3), _dec6 = property(CCInteger), _dec(_class = (_class2 = class HandComonent extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "handNode", _descriptor, this);

          _initializerDefineProperty(this, "handNodeMove", _descriptor2, this);

          // @property(Sprite)
          // slideSprite: Sprite = null;
          _initializerDefineProperty(this, "startPos", _descriptor3, this);

          _initializerDefineProperty(this, "endPos", _descriptor4, this);

          _initializerDefineProperty(this, "handScale", _descriptor5, this);

          this._handTween = null;
          this._handTween2 = null;
          this._handTween1 = null;
        }

        start() {
          //播动画
          // this.handNode.setPosition(this.startPos);
          // this.handNode.active = true;
          // //  this.slideSprite.node.active = true;
          // this.handNode.setScale(0, 0, 0);
          // this._handTween = tween(this.handNode)
          //     .delay(1)
          //     .to(0.1, { scale: new Vec3(this.handScale, this.handScale, 1) })
          //     .call(() => {
          //         this.playLoopAni();
          //     })
          //     .start();
          this.scheduleOnce(() => {
            this.handNode.active = true; // this.slideSprite.node.active = true;

            this.node.getComponent(Animation).play();
          }, 0.6); // this.node.getComponent(Animation).play();
        }

        onEnable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TouchSceenStart, this.onTouched, this);
        }

        onDisable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TouchSceenStart, this.onTouched, this);
        }

        update(deltaTime) {} // private playLoopAni() {
        //     let tweenHand = tween(this.handNode)
        //         .to(2, { position: this.endPos })
        //         .call(() => {
        //             this.handNode.setPosition(this.startPos);
        //         });
        //     this._handTween = tween(this.handNode)
        //         .repeatForever(tweenHand)
        //         .start();
        // }
        // 拖尾效果
        // private _trailNodes: Node[] = [];
        // private _trailIndex: number = 0;
        // private _trailCount: number = 20;
        // private playLoopAni() {
        //     const spriteFrame = this.handNodeMove.getComponent(Sprite)?.spriteFrame;
        //     if (!spriteFrame) {
        //         return;
        //     }
        //     if (this._trailNodes.length === 0) {
        //         for (let i = 0; i < this._trailCount; i++) {
        //             const trailNode = new Node(`Trail_${i}`);
        //             trailNode.layer = Layers.Enum.UI_2D;
        //             const sprite = trailNode.addComponent(Sprite);
        //             sprite.spriteFrame = spriteFrame;
        //             trailNode.setParent(this.handNode.parent);
        //             trailNode.active = false;
        //             this._trailNodes.push(trailNode);
        //         }
        //     }
        //     let tweenHand = tween(this.handNode)
        //         .to(2, { position: this.endPos })
        //         .call(() => {
        //             this.handNode.setPosition(this.startPos);
        //             // 手指回到起点时隐藏所有轨迹点，清空拖尾
        //             this._trailNodes.forEach(node => node.active = false);
        //             this._trailIndex = 0; // 重置轨迹索引
        //         });
        //     this._handTween = tween(this.handNode)
        //         .repeatForever(tweenHand)
        //         .start();
        //     this.schedule(() => {
        //         this._updateTrail();
        //     }, 0.3);
        // }
        // private _updateTrail() {
        //     const node = this._trailNodes[this._trailIndex];
        //     // 让轨迹点沿手指移动路径形成一条线，位置直接跟随handNode
        //     const pos = this.handNode.getPosition();
        //     node.setPosition(pos.x - 10, pos.y + 60, pos.z);
        //     node.setRotation(this.handNode.getRotation());
        //     // node.setScale(this.handNode.getScale());
        //     node.active = true;
        //     const sprite = node.getComponent(Sprite);
        //     if (sprite) {
        //         sprite.color = new Color(170, 255, 255, 255);
        //         tween(sprite)
        //             .to(1.5, { color: new Color(255, 255, 255, 255) })
        //             .call(() => {
        //                 node.active = false;
        //                 //sprite.color = new Color(255, 255, 255, 255);
        //             })
        //             .start();
        //     }
        //     this._trailIndex = (this._trailIndex + 1) % this._trailCount;
        // }


        onTouched() {
          this.node.getComponent(Animation).stop();
          this.handNode.active = false; // this.slideSprite.node.active = false;

          if (this._handTween) {
            this._handTween.stop();

            this._handTween = null;
            this.handNode.active = false;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "handNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "handNodeMove", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "startPos", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(0, 0, 0);
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "endPos", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(0, 0, 0);
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "handScale", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6ee145689ce702964fd7b5786551964cd12d3db9.js.map