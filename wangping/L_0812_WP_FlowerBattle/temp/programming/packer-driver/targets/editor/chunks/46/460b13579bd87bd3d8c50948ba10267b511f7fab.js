System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Component, Input, math, Node, Sprite, UIOpacity, v3, Vec3, VirtualInput, GlobeVariable, App, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, property, UIJoyStick;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfVirtualInput(extras) {
    _reporterNs.report("VirtualInput", "./VirtuallInput", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      Component = _cc.Component;
      Input = _cc.Input;
      math = _cc.math;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      UIOpacity = _cc.UIOpacity;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      VirtualInput = _unresolved_2.VirtualInput;
    }, function (_unresolved_3) {
      GlobeVariable = _unresolved_3.GlobeVariable;
    }, function (_unresolved_4) {
      App = _unresolved_4.App;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "789f3NYuP1KJ5rN9IlOyMVz", "UIJoyStick", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Component', 'EventTouch', 'Input', 'math', 'Node', 'Sprite', 'UIOpacity', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIJoyStick", UIJoyStick = (_dec = ccclass('UIJoyStick'), _dec2 = property(Sprite), _dec3 = property(Sprite), _dec4 = property(Node), _dec5 = property(CCFloat), _dec(_class = (_class2 = class UIJoyStick extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "thumbnail", _descriptor, this);

          _initializerDefineProperty(this, "joyStickBg", _descriptor2, this);

          _initializerDefineProperty(this, "hand", _descriptor3, this);

          _initializerDefineProperty(this, "radius", _descriptor4, this);

          this.initJoyStickBgPosition = v3();
          this.uiOpacity = null;

          _initializerDefineProperty(this, "amplitudeX", _descriptor5, this);

          _initializerDefineProperty(this, "amplitudeY", _descriptor6, this);

          _initializerDefineProperty(this, "speed", _descriptor7, this);

          _initializerDefineProperty(this, "pauseDuration", _descriptor8, this);

          // 停顿时间（秒）
          // 添加平滑系数和缓存变量
          _initializerDefineProperty(this, "smoothFactor", _descriptor9, this);

          // 平滑系数，值越小平滑效果越明显（范围0-1）
          this.lastHorizontal = 0;
          this.lastVertical = 0;
          this.t = 0;
          this.loopCount = 0;
          this.isPaused = false;
          this.pauseTimer = 0;
          this.handStartPos = new Vec3();
        }

        start() {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isTouching) {
            this.uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
            this.uiOpacity.opacity = 0;
          }

          this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          this.initJoyStickBgPosition = this.joyStickBg.node.worldPosition;

          if (this.hand) {
            this.handStartPos = this.hand.getPosition().clone();
          }
        }

        onDestroy() {
          this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        onTouchStart(event) {
          var _playerController;

          //  GlobeVariable.isStartGame = true;
          //  App.sceneNode.enemyParent.active = true;
          if ((_playerController = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).playerController) != null && _playerController.playMove) (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).playerController.playMove();
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isDeactivateVirtualJoystick || (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isGameEnd || !(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isCameraMoveEnd) return;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isTouching = true;
          if (this.hand) this.hand.active = false;
          let x = event.touch.getUILocationX();
          let y = event.touch.getUILocationY();
          this.joyStickBg.node.setWorldPosition(x, y, 0);
          if (this.uiOpacity) this.uiOpacity.opacity = 255;
        }

        onTouchMove(event) {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isDeactivateVirtualJoystick || (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isGameEnd || (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isJoyStickBan || !(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isCameraMoveEnd) return;
          let x = event.touch.getUILocationX();
          let y = event.touch.getUILocationY();
          let worldPos = new Vec3(x, y, 0);
          let localPos = v3();
          this.joyStickBg.node.inverseTransformPoint(localPos, worldPos);
          let thumbnailPos = v3();
          let len = localPos.length();
          localPos.normalize();
          Vec3.scaleAndAdd(thumbnailPos, v3(), localPos, math.clamp(len, 0, this.radius));
          this.thumbnail.node.setPosition(thumbnailPos); // 计算目标值

          const targetHorizontal = this.thumbnail.node.position.x / this.radius;
          const targetVertical = this.thumbnail.node.position.y / this.radius; // 使用线性插值进行平滑处理

          this.lastHorizontal = this.lastHorizontal + (targetHorizontal - this.lastHorizontal) * this.smoothFactor;
          this.lastVertical = this.lastVertical + (targetVertical - this.lastVertical) * this.smoothFactor; // 设置平滑后的值

          (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).horizontal = this.lastHorizontal;
          (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).vertical = this.lastVertical;
        }

        onTouchEnd(event) {
          // if (DataManager.Instance.isDeactivateVirtualJoystick) return;
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).playerController.playIdle();
          (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).horizontal = 0;
          (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).vertical = 0; // 重置缓存值

          this.lastHorizontal = 0;
          this.lastVertical = 0;
          this.thumbnail.node.setPosition(Vec3.ZERO);
          this.joyStickBg.node.setWorldPosition(this.initJoyStickBgPosition);

          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isTouching) {
            this.uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
            this.uiOpacity.opacity = 0;
          }
        }

        update(dt) {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isTouching) return;

          if (this.isPaused) {
            this.pauseTimer += dt;

            if (this.pauseTimer >= this.pauseDuration) {
              this.pauseTimer = 0;
              this.isPaused = false;
              this.t = 0;
            }

            return;
          }

          this.t += dt * this.speed;
          const xRaw = this.amplitudeX * Math.sin(this.t);
          const yRaw = this.amplitudeY * Math.sin(this.t) * Math.cos(this.t);
          const x = yRaw;
          const y = -xRaw;
          const offset = new Vec3(x, y, 0);
          this.thumbnail.node.setPosition(offset);

          if (this.hand) {
            const handPos = this.handStartPos.clone().add(offset);
            this.hand.setPosition(handPos);
          }

          if (this.t >= Math.PI * 2) {
            this.loopCount += 1;
            this.t = 0;

            if (this.loopCount >= 2) {
              this.loopCount = 0;
              this.thumbnail.node.setPosition(Vec3.ZERO);
              if (this.hand) this.hand.setPosition(this.handStartPos);
              this.isPaused = true;
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "thumbnail", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "joyStickBg", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "hand", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "radius", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 130;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "amplitudeX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "amplitudeY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 80;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.3;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "pauseDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "smoothFactor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=460b13579bd87bd3d8c50948ba10267b511f7fab.js.map