System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider, Node, Vec3, Entity, App, EnemySpider, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, PlayerBeetle;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemySpider(extras) {
    _reporterNs.report("EnemySpider", "./EnemySpider", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Collider = _cc.Collider;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
    }, function (_unresolved_3) {
      App = _unresolved_3.App;
    }, function (_unresolved_4) {
      EnemySpider = _unresolved_4.EnemySpider;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "63c1ehT4mJAi4xICtpQ+rwy", "PlayerBeetle", undefined);

      __checkObsolete__(['_decorator', 'Collider', 'Component', 'ITriggerEvent', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerBeetle", PlayerBeetle = (_dec = ccclass('PlayerBeetle'), _dec2 = property(Node), _dec(_class = (_class2 = class PlayerBeetle extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor(...args) {
          super(...args);
          this.hp = 2;
          this.maxHp = 2;
          this.attack = 20;

          // 移动相关属性
          _initializerDefineProperty(this, "mainPath", _descriptor, this);

          // 主路径节点
          this.movePhase = 1;
          // 移动阶段
          this.currentTargetIndex = 0;
          // 当前目标点索引
          this.speed = 15;
        }

        // 移动速度
        start() {
          var _this$characterSkelet;

          let characterData = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dataManager.getCharacterById(4);

          if (characterData) {
            this.speed = characterData.moveSpeed;
            this.attack = characterData.attackDamage;
            this.maxHp = characterData.maxHp;
            this.hp = characterData.hp;
          } // 初始化路径节点（如果未在编辑器中设置，则使用默认路径）


          if (!this.mainPath) this.mainPath = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.beetleMovePath;
          (_this$characterSkelet = this.characterSkeletalAnimation) == null || _this$characterSkelet.play('cut_walk_f');
          const collider = this.node.getComponent(Collider);
          collider.on('onTriggerEnter', this.onTriggerEnter, this);
          collider.on('onTriggerStay', this.onTriggerStay, this);
          collider.on('onTriggerExit', this.onTriggerExit, this);
        }

        onTriggerEnter(event) {
          if (event.otherCollider.node.name == "Spider" || event.otherCollider.node.name == "Spider_L") {
            console.log("甲虫的碰撞是否生效 == " + event.otherCollider.node.name);
            let enemySpider = event.otherCollider.node.getComponent(_crd && EnemySpider === void 0 ? (_reportPossibleCrUseOfEnemySpider({
              error: Error()
            }), EnemySpider) : EnemySpider);

            if (enemySpider.hp > 0) {
              enemySpider.baseHit1(this.attack, this.node.worldPosition, 6);
            }

            if (event.otherCollider.node.name == "Spider") {
              this.hp -= 2;

              if (this.hp <= 0) {
                this.hp = 0;
              }
            } else {
              this.hp -= 1;

              if (this.hp <= 0) {
                this.hp = 0;
              }
            }

            if (this.hp <= 0) {
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).beetleController.removeBeetle(this);
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).poolManager.returnNode(this.node);
              this.resetMovement();
              return;
            }
          }
        } //事件监听触发


        onTriggerStay(event) {
          const nodeName = event.otherCollider.node.name;
        }

        onTriggerExit(event) {
          console.log("onTriggerExit");
        }

        update(deltaTime) {
          this.handleMovement(deltaTime);
        }
        /** 处理移动逻辑 */


        handleMovement(deltaTime) {
          var _this$mainPath;

          // 第一阶段移动：沿主路径
          if (this.currentTargetIndex < ((_this$mainPath = this.mainPath) == null ? void 0 : _this$mainPath.children.length)) {
            this.moveToTarget(deltaTime, this.mainPath);
          }
        }
        /** 移动到当前目标点 */


        moveToTarget(deltaTime, pathParent) {
          if (!pathParent || pathParent.children.length === 0) return;
          const targetNode = pathParent.children[this.currentTargetIndex];
          const targetPos = targetNode.worldPosition;
          const currentPos = this.node.worldPosition; // 计算距离

          const distance = Vec3.distance(currentPos, targetPos); // 如果到达目标点，切换到下一个

          if (distance < 3) {
            // 可根据需要调整阈值
            this.currentTargetIndex++; // 旋转到目标方向

            this.node.eulerAngles = targetNode.eulerAngles.clone(); // 检查是否到达路径终点

            if (this.currentTargetIndex >= pathParent.children.length) {
              this.currentTargetIndex = 0;
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).beetleController.removeBeetle(this);
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).poolManager.returnNode(this.node);
              this.resetMovement();
              return;
            }

            return;
          } // 计算移动方向


          const direction = Vec3.subtract(new Vec3(), targetPos, currentPos).normalize(); // 计算每帧移动距离

          const moveDistance = this.speed * deltaTime; // 更新位置

          const newPos = Vec3.add(new Vec3(), currentPos, Vec3.multiplyScalar(new Vec3(), direction, moveDistance));
          this.node.worldPosition = newPos; // 平滑旋转朝向目标

          this.rotateToTarget(targetNode.eulerAngles, deltaTime);
        }
        /** 平滑旋转到目标角度 */


        rotateToTarget(targetRot, deltaTime) {
          const currentRot = this.node.eulerAngles; // 计算旋转差值并平滑过渡

          const rotDiff = new Vec3(this.smoothDamp(currentRot.x, targetRot.x, deltaTime), this.smoothDamp(currentRot.y, targetRot.y, deltaTime), this.smoothDamp(currentRot.z, targetRot.z, deltaTime));
          this.node.eulerAngles = rotDiff;
        }
        /** 平滑插值函数 */


        smoothDamp(current, target, deltaTime, smoothTime = 0.5) {
          let diff = target - current; // 处理角度环绕问题

          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return current + diff * (1 - Math.exp(-deltaTime / smoothTime));
        }
        /** 重置移动状态 */


        resetMovement() {
          this.movePhase = 1;
          this.currentTargetIndex = 0;
          let characterData = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dataManager.getCharacterById(4);

          if (characterData) {
            this.speed = characterData.moveSpeed;
            this.attack = characterData.attackDamage;
            this.maxHp = characterData.maxHp;
            this.hp = characterData.hp;
          }
        } // /** 设置移动速度 */
        // public setSpeed(newSpeed: number) {
        //     this.speed = newSpeed;
        // }


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mainPath", [_dec2], {
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
//# sourceMappingURL=f78d331b7be0cd3de3ccf7eb113365e5560cc5e9.js.map