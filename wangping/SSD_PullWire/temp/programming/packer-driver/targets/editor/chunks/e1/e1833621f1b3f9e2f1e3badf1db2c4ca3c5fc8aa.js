System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Label, Sprite, tween, Vec3, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, coinEffect;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "629b5nqI45M+YGFYdEfvWCi", "coinEffect", undefined); // import { _decorator, Color, Component, Label, Node, Sprite, tween, Vec3 } from 'cc';
      // const { ccclass, property } = _decorator;
      // @ccclass('coinEffect')
      // export class coinEffect extends Component {
      //     @property(Sprite)
      //     coinSprite: Sprite = null;
      //     @property(Label)
      //     coinLabel: Label = null;
      //     // 动画参数
      //     @property({ type: Vec3, displayName: '初始位置' })
      //     startPosition: Vec3 = new Vec3(0, 0, 0);
      //     @property({ displayName: '第一阶段上升距离' })
      //     firstRiseDistance: number = 1.5;
      //     @property({ displayName: '第二阶段上升距离' })
      //     secondRiseDistance: number = 2;
      //     @property({ displayName: '淡入时间(秒)' })
      //     fadeInDuration: number = 1.0;
      //     @property({ displayName: '停顿时间(秒)' })
      //     pauseDuration: number = 1;
      //     @property({ displayName: '淡出时间(秒)' })
      //     fadeOutDuration: number = 1;
      //     // 显式声明opacity属性
      //     private _opacity: number = 0;
      //     start() {
      //         this.reset();
      //         //this.playEffect();
      //     }
      //     reset() {
      //         this.node.setPosition(this.startPosition);
      //         this.setOpacity(0);
      //     }
      //     setOpacity(value: number) {
      //         if (this.coinSprite) this.coinSprite.color = new Color(255, 255, 255, value);
      //         if (this.coinLabel) this.coinLabel.color = new Color(255, 255, 255, value);
      //     }
      //     playEffect() {
      //         const originalPos = this.node.position.clone();
      //         tween(this.node)
      //             .call(() => this.setOpacity(0))
      //             // 第一阶段：同时淡入和上升第一部分距离
      //             .parallel(
      //                 tween(this.node)
      //                     .to(this.fadeInDuration, { 
      //                         position: new Vec3(
      //                             originalPos.x, 
      //                             originalPos.y + this.firstRiseDistance, 
      //                             originalPos.z
      //                         ) 
      //                     }),
      //                 tween(this as any) // 添加类型断言
      //                     .to(this.fadeInDuration, { _opacity: 255 }, {
      //                         onUpdate: (target, ratio) => {
      //                             this.setOpacity(Math.floor(255 * ratio));
      //                         }
      //                     })
      //             )
      //             // 停顿
      //             .delay(this.pauseDuration)
      //             // 第二阶段：同时淡出和上升第二部分距离
      //             .parallel(
      //                 tween(this.node)
      //                     .to(this.fadeOutDuration, { 
      //                         position: new Vec3(
      //                             originalPos.x, 
      //                             originalPos.y + this.firstRiseDistance + this.secondRiseDistance, 
      //                             originalPos.z
      //                         ) 
      //                     }),
      //                 tween(this as any) // 添加类型断言
      //                     .to(this.fadeOutDuration, { _opacity: 0 }, {
      //                         onUpdate: (target, ratio) => {
      //                             this.setOpacity(Math.floor(255 * (1 - ratio)));
      //                         }
      //                     })
      //             )
      //             .call(() => this.reset())
      //             .start();
      //     }
      //     // 为opacity添加getter和setter（可选）
      //     get opacity() {
      //         return this._opacity;
      //     }
      //     set opacity(value: number) {
      //         this._opacity = value;
      //     }
      // }


      __checkObsolete__(['_decorator', 'Color', 'Component', 'Label', 'Node', 'Sprite', 'Tween', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("coinEffect", coinEffect = (_dec = ccclass('coinEffect'), _dec2 = property(Sprite), _dec3 = property(Label), _dec4 = property({
        type: Vec3,
        displayName: '初始位置'
      }), _dec5 = property({
        displayName: '第一阶段上升距离'
      }), _dec6 = property({
        displayName: '第二阶段上升距离'
      }), _dec7 = property({
        displayName: '淡入时间(秒)'
      }), _dec8 = property({
        displayName: '停顿时间(秒)'
      }), _dec9 = property({
        displayName: '淡出时间(秒)'
      }), _dec(_class = (_class2 = class coinEffect extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "coinSprite", _descriptor, this);

          _initializerDefineProperty(this, "coinLabel", _descriptor2, this);

          // 动画参数
          _initializerDefineProperty(this, "startPosition", _descriptor3, this);

          _initializerDefineProperty(this, "firstRiseDistance", _descriptor4, this);

          _initializerDefineProperty(this, "secondRiseDistance", _descriptor5, this);

          _initializerDefineProperty(this, "fadeInDuration", _descriptor6, this);

          _initializerDefineProperty(this, "pauseDuration", _descriptor7, this);

          _initializerDefineProperty(this, "fadeOutDuration", _descriptor8, this);

          // 显式声明opacity属性
          this._opacity = 0;
          this.currentTween = null;
        }

        start() {
          this.reset(); // this.playEffect();
        }

        setCoinNum(num) {
          if (this.coinLabel && num > 0) {
            this.coinLabel.string = "x" + num.toString();
          }
        }

        reset() {
          // 停止当前动画
          if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
          }

          this.node.setPosition(this.startPosition);
          this.setOpacity(0);
        }

        setOpacity(value) {
          if (this.coinSprite) this.coinSprite.color = new Color(255, 255, 255, value);
          if (this.coinLabel) this.coinLabel.color = new Color(255, 255, 255, value);
        } // 公共方法，用于外部触发动画


        playEffect() {
          // 如果正在播放，先重置
          this.reset();
          const originalPos = this.node.position.clone();
          const originalScale = new Vec3(this.node.scale.x, this.node.scale.y, this.node.scale.z);
          this.currentTween = tween(this.node).call(() => this.setOpacity(0)) // 第一阶段：同时淡入和上升第一部分距离
          .parallel(tween(this.node).to(this.fadeInDuration, {
            position: new Vec3(originalPos.x, originalPos.y + this.firstRiseDistance, originalPos.z)
          }), tween(this).to(this.fadeInDuration, {
            _opacity: 255
          }, {
            onUpdate: (target, ratio) => {
              this.setOpacity(Math.floor(255 * ratio));
            }
          }), // 新增的缩放动画 (在当前缩放基础上增加 0.1)
          tween(this.node).to(0.3, {
            scale: new Vec3(this.node.scale.x + 0.01, this.node.scale.y + 0.01, this.node.scale.z + 0.01)
          }).to(0.2, {
            scale: originalScale
          }) // 0.3秒内恢复原始大小
          ) // 停顿
          .delay(this.pauseDuration) // 第二阶段：同时淡出和上升第二部分距离
          .parallel(tween(this.node).to(this.fadeOutDuration, {
            position: new Vec3(originalPos.x, originalPos.y + this.firstRiseDistance + this.secondRiseDistance, originalPos.z)
          }), tween(this).to(this.fadeOutDuration, {
            _opacity: 0
          }, {
            onUpdate: (target, ratio) => {
              this.setOpacity(Math.floor(255 * (1 - ratio)));
            }
          })).call(() => {
            // 动画完成后重置状态，但保持不可见
            this.node.setPosition(this.startPosition);
            this.currentTween = null;
          }).start();
        } // 为opacity添加getter和setter


        get opacity() {
          return this._opacity;
        }

        set opacity(value) {
          this._opacity = value;
        } // // 测试代码
        // private addNum = 0;
        // protected update(dt: number): void {
        //        this.addNum+= dt;
        //        if(this.addNum >= 3){
        //              this.playEffect();
        //              this.addNum = 0;
        //        }
        // }


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "coinSprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "coinLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "startPosition", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(0, 0, 0);
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "firstRiseDistance", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "secondRiseDistance", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "fadeInDuration", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.3;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "pauseDuration", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "fadeOutDuration", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e1833621f1b3f9e2f1e3badf1db2c4ca3c5fc8aa.js.map