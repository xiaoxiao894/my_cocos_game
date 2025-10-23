System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SkeletalAnimation, CCString, Vec3, tween, Material, MeshRenderer, CCInteger, Quat, Vec2, v2, ProgressBar, CCFloat, DataManager, Simulator, RVOMath, Vector2, MonsterStateEnum, DissolveEffect, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _crd, ccclass, property, MonsterItem;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGuardrail(extras) {
    _reporterNs.report("Guardrail", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "../RVO/Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOMath(extras) {
    _reporterNs.report("RVOMath", "../RVO/Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector2", "../RVO/Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterStateEnum(extras) {
    _reporterNs.report("MonsterStateEnum", "../Actor/StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDissolveEffect(extras) {
    _reporterNs.report("DissolveEffect", "../../Res/DissolveEffect/scripts/DissolveEffect", _context.meta, extras);
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
      SkeletalAnimation = _cc.SkeletalAnimation;
      CCString = _cc.CCString;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      Material = _cc.Material;
      MeshRenderer = _cc.MeshRenderer;
      CCInteger = _cc.CCInteger;
      Quat = _cc.Quat;
      Vec2 = _cc.Vec2;
      v2 = _cc.v2;
      ProgressBar = _cc.ProgressBar;
      CCFloat = _cc.CCFloat;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      Simulator = _unresolved_3.Simulator;
    }, function (_unresolved_4) {
      RVOMath = _unresolved_4.RVOMath;
      Vector2 = _unresolved_4.Vector2;
    }, function (_unresolved_5) {
      MonsterStateEnum = _unresolved_5.MonsterStateEnum;
    }, function (_unresolved_6) {
      DissolveEffect = _unresolved_6.DissolveEffect;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a0201ITWJJLloHoSEg1mpk7", "MonsterItem", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'SkeletalAnimation', 'CCString', 'Vec3', 'tween', 'Material', 'MeshRenderer', 'CCInteger', 'Quat', 'Vec2', 'v2', 'ProgressBar', 'CCFloat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MonsterItem", MonsterItem = (_dec = ccclass('MonsterItem'), _dec2 = property(SkeletalAnimation), _dec3 = property(Node), _dec4 = property(CCString), _dec5 = property(CCString), _dec6 = property(CCInteger), _dec7 = property(_crd && DissolveEffect === void 0 ? (_reportPossibleCrUseOfDissolveEffect({
        error: Error()
      }), DissolveEffect) : DissolveEffect), _dec8 = property(Material), _dec9 = property(CCInteger), _dec10 = property(CCInteger), _dec11 = property(CCFloat), _dec12 = property(CCFloat), _dec13 = property(Node), _dec(_class = (_class2 = class MonsterItem extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "skeletalAnimation", _descriptor, this);

          _initializerDefineProperty(this, "affectedSpecialEffects", _descriptor2, this);

          _initializerDefineProperty(this, "runAniName", _descriptor3, this);

          _initializerDefineProperty(this, "dieAniName", _descriptor4, this);

          _initializerDefineProperty(this, "type", _descriptor5, this);

          _initializerDefineProperty(this, "dissolveEffect", _descriptor6, this);

          _initializerDefineProperty(this, "mats", _descriptor7, this);

          _initializerDefineProperty(this, "hp", _descriptor8, this);

          //rvo
          _initializerDefineProperty(this, "hitPow", _descriptor9, this);

          //受击系数 系数越高 反弹力度越大
          _initializerDefineProperty(this, "sizeSquare", _descriptor10, this);

          _initializerDefineProperty(this, "dropNum", _descriptor11, this);

          _initializerDefineProperty(this, "bloodNode", _descriptor12, this);

          this.currentState = null;
          this._isDead = false;
          this._index = void 0;
          this._lastPathHasObstacle = false;
          this._checkCounter = 0;
          this._noMove = false;
          this._nowHp = 1;
          // 闪红恢复timeout
          this.redTimeout = void 0;
          this._frames = 0;
          this._agentHandleId = -1;

          /**
          * 设置追踪主角的线速度方向和大小
          */
          // 怪物 RVO 移动与护栏攻击逻辑
          this._assignedGuardrail = null;
          this._hasCountedAttack = false;
        }

        //RVOid
        get agentHandleId() {
          return this._agentHandleId;
        }

        set agentHandleId(value) {
          this._agentHandleId = value;
        }

        init(index = 0, isDissolveOnce = true, isCustomHp) {
          this._index = index;

          if (isCustomHp) {
            this._nowHp = 1;
            this.hp = 1;
          } else {
            this._nowHp = this.hp;
          }

          this._isDead = false;
          this._noMove = false;
          this._hasCountedAttack = false;
          this._assignedGuardrail = null;

          if (this.runAniName) {
            this.scheduleOnce(() => {
              this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                error: Error()
              }), MonsterStateEnum) : MonsterStateEnum).Walk);
            }, 0);
          }

          if (this.bloodNode) {
            let bar = this.bloodNode.getComponent(ProgressBar);

            if (bar) {
              bar.progress = 1;
            }

            this.bloodNode.active = false;
          } //初始化材质
          // this.dissolveEffect.forEach((d: DissolveEffect) => {
          //     this.setMaterByIndex(d.node, 0);
          //     if (isDissolveOnce) {
          //         this.warmUpMaterial(d.node, 1);
          //         this.warmUpMaterial(d.node, 2);
          //     }
          //     d.reset();
          // })


          this.setMaterByIndex(0, true);
        }

        setMaterByIndex(matIndex, needReset = false) {
          this.dissolveEffect.forEach(d => {
            let mesh = d.node.getComponent(MeshRenderer);

            if (mesh) {
              let matInstance = mesh.getMaterialInstance(0);

              if (matIndex === 1) {
                matInstance.setProperty('showType', 1.0);
              } else {
                matInstance.setProperty('showType', 0.0);
                matInstance.setProperty('dissolveThreshold', 0.0);
              }
            }

            if (needReset) {
              d.reset();
            }
          });
        }

        warmUpMaterial(node, index) {
          let mesh = node.getComponent(MeshRenderer);
          if (!mesh) return;
          mesh.setMaterial(this.mats[index], 0);

          if (this.type === 1) {
            if (index === 1) {
              mesh.setMaterial(this.mats[index], 1);
            } else {
              mesh.setMaterial(this.mats[index + 3], 1);
            }
          }

          this.scheduleOnce(() => {
            mesh.setMaterial(this.mats[0], 0);

            if (this.type === 1) {
              mesh.setMaterial(this.mats[0 + 3], 1);
            }
          });
        }

        deathAni(end) {
          if (this._isDead) {
            return;
          } // 固定击退方向 -Z 方向）


          const knockbackDir = new Vec3(0, 0, -1); // 固定击退距离

          const knockbackDistance = 0.75; // 击退 3 个单位

          const goalVector = knockbackDir.multiplyScalar(knockbackDistance);
          tween(this.node).by(0.15, {
            position: goalVector
          }).call(() => {
            var _this$node;

            const agent = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.getAgentByAid(this.agentHandleId);

            if (agent && (_this$node = this.node) != null && _this$node.isValid) {
              const newWorldPos = this.node.worldPosition;
              agent.position_ = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(newWorldPos.x, newWorldPos.z);
            }

            if (this._assignedGuardrail) {
              this._assignedGuardrail.attackingMonsterCount = Math.max(0, (this._assignedGuardrail.attackingMonsterCount || 1) - 1);
              this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                error: Error()
              }), MonsterStateEnum) : MonsterStateEnum).Walk);
              this._assignedGuardrail = null;
              this._hasCountedAttack = false;
              this._noMove = false;
            }
          }).start();

          if (this.redTimeout) {
            clearTimeout(this.redTimeout);
            this.redTimeout = null;
          }

          this._nowHp--;

          if (this.affectedSpecialEffects) {
            this.affectedSpecialEffects.active = true;
          }

          this.scheduleOnce(() => {
            this.affectedSpecialEffects.active = false;
          }, 2);

          if (this.bloodNode) {
            let bar = this.bloodNode.getComponent(ProgressBar);

            if (bar) {
              bar.progress = this._nowHp / this.hp;
            }

            this.bloodNode.active = true;
          }

          if (this._nowHp > 0) {
            //闪红
            this.setMaterByIndex(1);
            this.redTimeout = setTimeout(() => {
              //恢复
              this.setMaterByIndex(0);
            }, 250);
            return;
          } //真死了


          this._isDead = true; // this.updateIconPos();

          if (this._assignedGuardrail && this._assignedGuardrail.attackingMonsterCount > 0) {
            this._assignedGuardrail.attackingMonsterCount--;
          }

          this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
            error: Error()
          }), MonsterStateEnum) : MonsterStateEnum).Die);
          let timeout = 650;

          if (this.type > 0) {
            timeout = 880;
          } //闪红


          this.setMaterByIndex(1);
          setTimeout(() => {
            //消融
            // this.setMaterByIndex(0);
            this.dissolveEffect.forEach(d => {
              this.setMaterByIndex(0);
              d.init();
              d.play(0.5);
            });
          }, 250);
          setTimeout(() => {
            this.clearData();
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.monsterManager.recycleMonster(this._index, this.node);
          }, timeout); // this.scheduleOnce(() => {

          this.updateIconPos(end); // }, 0.15)

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.gridSystem.removeNode(this.node);
        }

        updateIconPos(end) {
          // const randomIconNum = MathUtil.getRandom(1, 4);
          const worldPos = this.node.getWorldPosition().clone();

          for (let i = 0; i < this.dropNum; i++) {
            const randius = 3;
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * randius;
            const offsetX = r * Math.cos(angle);
            const offsetZ = r * Math.sin(angle);
            const newRandomPos = new Vec3(worldPos.x + offsetX, worldPos.y, worldPos.z + offsetZ);
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.monsterManager.dropItem(newRandomPos, end);
          }
        }

        update(dt) {
          if (this._isDead) {
            return;
          }

          if (this._frames++ > 8) {
            this._frames = 0;
            this.setPreferredVelocities(dt); //设置追踪主角的线速度
          }
        }

        setPreferredVelocities(dt) {
          if (this.agentHandleId < 0 || (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guardrailArr.length <= 0) return;
          let moveTarget;
          let worldTarget;
          const monsterPos = this.node.worldPosition.clone();
          let nearestGuardrail = null;
          let minDistSqr = Infinity;

          for (const guardrail of (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guardrailArr) {
            const attackingCount = guardrail.attackingMonsterCount || 0;
            if (attackingCount >= 2) continue;
            const guardrailPos = guardrail.node.worldPosition;
            const dx = guardrailPos.x - monsterPos.x;
            const dz = guardrailPos.z - monsterPos.z;
            const distSqr = dx * dx + dz * dz;

            if (distSqr < minDistSqr) {
              minDistSqr = distSqr;
              nearestGuardrail = guardrail;
            }
          }

          if (nearestGuardrail && !this._assignedGuardrail) {
            const pos = nearestGuardrail.node.worldPosition;
            const dir = new Vec3();
            Vec3.subtract(dir, pos, monsterPos);
            dir.y = 0;
            dir.normalize();
            const offset = 4;
            const adjustedPos = pos.clone().subtract(dir.multiplyScalar(offset));
            moveTarget = v2(adjustedPos.x, adjustedPos.z);
            worldTarget = new Vec3(adjustedPos.x, 0, adjustedPos.z);
            this._assignedGuardrail = nearestGuardrail;
            this._assignedGuardrail.attackingMonsterCount = (this._assignedGuardrail.attackingMonsterCount || 0) + 1;
          } else if (this._assignedGuardrail) {
            const guardrailPos = this._assignedGuardrail.node.worldPosition;
            const dir = new Vec3();
            Vec3.subtract(dir, guardrailPos, monsterPos);
            dir.y = 0;
            dir.normalize();
            const offset = 4;
            const adjustedPos = guardrailPos.clone().subtract(dir.multiplyScalar(offset));
            moveTarget = v2(adjustedPos.x, adjustedPos.z);
            worldTarget = new Vec3(adjustedPos.x, 0, adjustedPos.z);
          } else {
            for (const guardrail of (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guardrailArr) {
              const guardrailPos = guardrail.node.worldPosition;
              const dx = guardrailPos.x - monsterPos.x;
              const dz = guardrailPos.z - monsterPos.z;
              const distSqr = dx * dx + dz * dz;

              if (distSqr < minDistSqr) {
                minDistSqr = distSqr;
                nearestGuardrail = guardrail;
              }
            }

            if (nearestGuardrail) {
              const pos = nearestGuardrail.node.worldPosition;
              const dir = new Vec3();
              Vec3.subtract(dir, pos, monsterPos);
              dir.y = 0;
              dir.normalize();
              const offset = 4;
              const adjustedPos = pos.clone().subtract(dir.multiplyScalar(offset));
              moveTarget = v2(adjustedPos.x, adjustedPos.z);
              worldTarget = new Vec3(adjustedPos.x, 0, adjustedPos.z);
            }
          }

          if (!moveTarget || !worldTarget) {
            return;
          }

          const agentAid = this.agentHandleId;
          const agent = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentByAid(agentAid);
          const agentPos = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentPosition(agentAid);

          if (agent && agentPos) {
            const goalVector = moveTarget.subtract2f(agentPos.x, agentPos.y);
            const distSqr = goalVector.lengthSqr();
            const distanceToTargetSquared = Vec3.squaredDistance(this.node.worldPosition, worldTarget);
            const hasArrived = distanceToTargetSquared <= this.sizeSquare;

            if (hasArrived) {
              if (this.currentState !== (_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                error: Error()
              }), MonsterStateEnum) : MonsterStateEnum).Attack) {
                this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                  error: Error()
                }), MonsterStateEnum) : MonsterStateEnum).Attack);
              }

              (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);

              if (this._assignedGuardrail) {
                this.rotateTowards(this._assignedGuardrail.node.worldPosition, dt);
                this._hasCountedAttack = true;
              }

              return;
            } else {
              if (this.currentState !== (_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                error: Error()
              }), MonsterStateEnum) : MonsterStateEnum).Walk) {
                this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                  error: Error()
                }), MonsterStateEnum) : MonsterStateEnum).Walk);
              }
            }

            if (distSqr < (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).RVO_EPSILON) {
              (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
            } else {
              (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.setAgentPrefVelocity(agentAid, goalVector);
            }

            const forward = new Vec3(goalVector.x, 0, goalVector.y).normalize();

            if (forward.lengthSqr() > 0.0001) {
              const currentRotation = this.skeletalAnimation.node.worldRotation.clone();
              const targetRotation = new Quat();
              Quat.fromViewUp(targetRotation, forward, Vec3.UP);
              const rotateSpeed = 8;
              const slerped = new Quat();
              Quat.slerp(slerped, currentRotation, targetRotation, Math.min(1, dt * rotateSpeed));
              const childZero = this.skeletalAnimation.node;

              if (childZero) {
                childZero.worldRotation = slerped;
              }
            }
          } else {// console.error("RVO异常::", agent, agentPos, agentAid);
          }
        }

        rotateTowards(targetWorldPos, dt) {
          const currentPos = this.node.worldPosition.clone();
          const dir = new Vec3();
          Vec3.subtract(dir, targetWorldPos, currentPos);
          dir.y = 0;
          dir.normalize();
          if (dir.lengthSqr() < 0.0001) return;
          const targetQuat = new Quat();
          Quat.fromViewUp(targetQuat, dir, Vec3.UP);
          const currentQuat = this.skeletalAnimation.node.worldRotation.clone();
          const resultQuat = new Quat();
          Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
          this.skeletalAnimation.node.worldRotation = resultQuat;
        }
        /**
         * 在此之前 请确保Simulator run执行完毕
         */


        moveByRvo(dt) {
          if (this._isDead) return;

          if (this._noMove) {
            return;
          } //栅栏边上的怪不移动


          if (this._hasCountedAttack) {
            this._noMove = true;
          }

          if (this.agentHandleId == -1) return;
          const p = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentPosition(this.agentHandleId);
          const targetPos = new Vec3(p.x, 0, p.y);
          const currentPos = this.node.worldPosition.clone();
          const dist = Vec3.distance(currentPos, targetPos);

          if (dist > 0.01) {
            var _Instance$gridSystem;

            const smoothFactor = 10;
            Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
            this.node.setWorldPosition(currentPos);
            (_Instance$gridSystem = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.gridSystem) == null || _Instance$gridSystem.updateNode(this.node);
          }
        }

        changState(state) {
          if (state == this.currentState) {
            return;
          }

          if (state === (_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
            error: Error()
          }), MonsterStateEnum) : MonsterStateEnum).Die) {
            // 播放一次动画以初始化动画状态
            this.skeletalAnimation.play((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
              error: Error()
            }), MonsterStateEnum) : MonsterStateEnum).Attack);
            const state = this.skeletalAnimation.getState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
              error: Error()
            }), MonsterStateEnum) : MonsterStateEnum).Attack);
            if (!state) return;
            state.update(0); // 强制立即应用该时间的骨骼姿势

            state.pause();
            (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.removeAgent(this.agentHandleId);
          } else {
            var _this$skeletalAnimati;

            (_this$skeletalAnimati = this.skeletalAnimation) == null || _this$skeletalAnimati.crossFade(state, 0.1);
          }

          this.currentState = state;
        }

        attack() {
          //打护栏
          if (this._assignedGuardrail) {
            //护栏掉血
            if (this._assignedGuardrail.blood > 0) {
              this._assignedGuardrail.blood -= 1;

              let bloodNode = this._assignedGuardrail.node.getChildByName("FenceBloodBar");

              if (!bloodNode) {
                // bloodNode = instantiate(DataManager.Instance.prefabMap.get(EntityTypeEnum.FenceBloodBar));
                if (!bloodNode) {
                  return;
                }

                bloodNode.parent = this._assignedGuardrail.node;
              }

              bloodNode.active = true;
              let bloodBar = bloodNode.getComponent(ProgressBar);

              if (bloodBar) {
                bloodBar.progress = this._assignedGuardrail.blood / (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.guardrailBlood;
              }
            } //闪白


            if (this._assignedGuardrail.node.name.includes("Door")) {
              //门
              let leftNode = this._assignedGuardrail.node.getChildByPath("Door_Left/WeiLan/WeiLan");

              if (leftNode) {
                let leftMesh = leftNode.getComponent(MeshRenderer);

                if (leftMesh) {
                  leftMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[3], 0);
                  leftMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[3], 1);
                  leftMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[3], 2);
                  setTimeout(() => {
                    leftMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[0], 0);
                    leftMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[1], 1);
                    leftMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[2], 2);
                  }, 50);
                }
              }

              let rightNode = this._assignedGuardrail.node.getChildByPath("Door_Right/WeiLan/WeiLan");

              if (rightNode) {
                let rightMesh = rightNode.getComponent(MeshRenderer);

                if (rightMesh) {
                  rightMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[3], 0);
                  rightMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[3], 1);
                  rightMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[3], 2);
                  setTimeout(() => {
                    rightMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[0], 0);
                    rightMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[1], 1);
                    rightMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[2], 2);
                  }, 50);
                }
              }
            } else {
              //围栏
              let fenceNode = this._assignedGuardrail.node.getChildByName("weiqiang02");

              if (fenceNode) {
                let fenceMesh = fenceNode.getComponent(MeshRenderer);

                if (fenceMesh) {
                  fenceMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.guardrailMaterials[1], 0);
                  setTimeout(() => {
                    fenceMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.guardrailMaterials[0], 0);
                  }, 50);
                }
              }
            }
          }
        }

        clearData() {
          if (this.agentHandleId >= 0) {
            (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.removeAgent(this.agentHandleId);
            this._agentHandleId = -1;
          }

          this._isDead = false;
          this.currentState = null;
          this._frames = 0;
        }

        get isDead() {
          return this._isDead;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletalAnimation", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "affectedSpecialEffects", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "runAniName", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "walk_f";
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "dieAniName", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "die";
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "dissolveEffect", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "mats", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "hp", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "hitPow", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "sizeSquare", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 16;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "dropNum", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "bloodNode", [_dec13], {
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
//# sourceMappingURL=ef15e3ea0ae09bdb90d6e23ed1378353a195e546.js.map