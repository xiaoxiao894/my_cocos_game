System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Quat, Vec3, State, CharacterType, BehaviourType, Global, _dec, _class, _crd, ccclass, property, MoveState;

  function _reportPossibleCrUseOfState(extras) {
    _reporterNs.report("State", "./State", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBehaviourType(extras) {
    _reporterNs.report("BehaviourType", "../entitys/Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacter(extras) {
    _reporterNs.report("Character", "../entitys/Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfenemyCharacter(extras) {
    _reporterNs.report("enemyCharacter", "../entitys/enemyCharacter", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "../core/Global", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      State = _unresolved_2.default;
    }, function (_unresolved_3) {
      CharacterType = _unresolved_3.CharacterType;
    }, function (_unresolved_4) {
      BehaviourType = _unresolved_4.BehaviourType;
    }, function (_unresolved_5) {
      Global = _unresolved_5.Global;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "65959JUkVBBsJKnM0Rc5wY9", "MoveState", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Quat', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MoveState", MoveState = (_dec = ccclass('MoveState'), _dec(_class = class MoveState extends (_crd && State === void 0 ? (_reportPossibleCrUseOfState({
        error: Error()
      }), State) : State) {
        constructor(entity) {
          super();
          // private target: any = null;
          this.speed = 0;
          this.targetPos = new Vec3();
          this.isUpate = false;
          this.stopDistance = 2;
          // 默认值调整为更合理的值
          this.callback = null;
          // 临时变量，减少GC压力
          this.tempDir = new Vec3();
          this.tempMoveVec = new Vec3();
          this.tempNextPos = new Vec3();
          this.tempForward = new Vec3();
          this.tempRotation = new Quat();
          this.tempParentRotation = new Quat();
          this.tempParentRotationInv = new Quat();
          this.entity = entity;
        }
        /**进入移动状态 */


        onEnter(callback) {
          this.isUpate = true;

          if (this.entity.getType() == (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).CHARACTER) {
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
              console.error("骨骼动画组件未初始化");
              return;
            }

            this.entity.characterSkeletalAnimation.play("kugongnanpao");
          }

          if (this.entity.getBehaviour() == (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
            error: Error()
          }), BehaviourType) : BehaviourType).Tree) {
            this.stopDistance = 2;
          } else if (this.entity.getBehaviour() == (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
            error: Error()
          }), BehaviourType) : BehaviourType).FindEnemy) {
            this.stopDistance = 2;
          } else {
            this.stopDistance = 0.5;
          }

          this.speed = this.entity.getMoveSpeed();
          this.callback = callback;
        }
        /**移动逻辑处理 */


        onUpdate(dt) {
          if (!this.isUpate) return;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playPlayerRunSound(); // 更新目标位置

          if (this.entity.getBehaviour() == (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
            error: Error()
          }), BehaviourType) : BehaviourType).FindEnemy) {
            this.entity.moveTargetWorldPos = this.entity.target.node.worldPosition;
          }

          Vec3.copy(this.targetPos, this.entity.moveTargetWorldPos); // 移动到目标

          if (this.moveToTarget(dt, this.targetPos)) {
            this.isUpate = false;
          }
        }
        /**
         * 旋转角色朝向目标位置
         * @param targetPos 目标位置
         */


        lookAtTarget(targetPos) {
          var _this$entity$node$par;

          // 计算朝向向量 (目标位置 - 当前位置)
          Vec3.subtract(this.tempForward, targetPos, this.entity.node.worldPosition);
          this.tempForward.y = 0; // 保持水平方向

          this.tempForward.normalize(); // 如果有父节点旋转，需要转换到局部空间

          var parent = (_this$entity$node$par = this.entity.node.parent) == null ? void 0 : _this$entity$node$par.parent;

          if (parent) {
            // 获取父节点旋转
            parent.getRotation(this.tempParentRotation); // 计算逆旋转

            Quat.invert(this.tempParentRotationInv, this.tempParentRotation); // 将世界方向转换到父节点局部空间

            Vec3.transformQuat(this.tempForward, this.tempForward, this.tempParentRotationInv);
          } // 计算旋转四元数


          Quat.fromViewUp(this.tempRotation, this.tempForward, Vec3.UP);
          this.entity.node.setRotation(this.tempRotation);
        }
        /**
         * 移动角色到目标位置
         * @param deltaTime 帧间隔时间
         * @param targetPos 目标位置
         * @returns 是否到达目标
         */


        moveToTarget(deltaTime, targetPos) {
          // 计算方向向量
          Vec3.subtract(this.tempDir, targetPos, this.entity.node.worldPosition);
          this.tempDir.y = 0; // 保持水平移动

          var distance = this.tempDir.length();
          console.log("=================>", distance, "====================>", this.stopDistance);

          if (distance < this.stopDistance) {
            // 距离足够近，认为已到达目标
            if (this.callback) {
              this.callback(this.entity);
            }

            return true;
          } // 归一化方向向量


          this.tempDir.normalize(); // 计算本次移动距离

          var moveDistance = this.speed * deltaTime;

          if (moveDistance >= distance) {
            // 本次移动距离超过剩余距离，直接设置到目标位置
            if (this.callback) {
              this.callback(this.entity);
            }

            console.log("=============moveDistance", targetPos);
            this.entity.node.worldPosition = targetPos.clone();
            this.lookAtTarget(targetPos);
            return true;
          } else {
            // 计算移动向量
            Vec3.multiplyScalar(this.tempMoveVec, this.tempDir, moveDistance); // 计算下一个位置

            Vec3.add(this.tempNextPos, this.entity.node.worldPosition, this.tempMoveVec); // 设置新位置

            this.entity.node.worldPosition = this.tempNextPos; // 转向目标

            this.lookAtTarget(targetPos);
            return false;
          }
        }
        /**退出移动状态 */


        onExit() {
          this.entity.moveTargetWorldPos = null; // this.target = null;

          this.speed = 0;
          this.targetPos.set(0, 0, 0);
          this.stopDistance = 2;
          this.isUpate = false;
          this.callback = null;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8c8c9cf3e13bf72dc15b91f0743505567fa634b5.js.map