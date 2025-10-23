System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SkeletalAnimation, CCString, Vec3, tween, Material, MeshRenderer, CCInteger, Quat, Vec2, v2, instantiate, ProgressBar, DataManager, Simulator, RVOMath, Vector2, MonsterStateEnum, EntityTypeEnum, DissolveEffect, MathUtil, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, MonsterItem;

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

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDissolveEffect(extras) {
    _reporterNs.report("DissolveEffect", "../../Res/DissolveEffect/scripts/DissolveEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Util/MathUtil", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      ProgressBar = _cc.ProgressBar;
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
      EntityTypeEnum = _unresolved_6.EntityTypeEnum;
    }, function (_unresolved_7) {
      DissolveEffect = _unresolved_7.DissolveEffect;
    }, function (_unresolved_8) {
      MathUtil = _unresolved_8.MathUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "60961ndE9pO2b4kzBZS1+J2", "MonsterItem", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'SkeletalAnimation', 'CCString', 'Vec3', 'tween', 'Material', 'MeshRenderer', 'CCInteger', 'Quat', 'Vec2', 'v2', 'instantiate', 'ProgressBar', 'random']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MonsterItem", MonsterItem = (_dec = ccclass('MonsterItem'), _dec2 = property(SkeletalAnimation), _dec3 = property(CCString), _dec4 = property(CCString), _dec5 = property(CCInteger), _dec6 = property(_crd && DissolveEffect === void 0 ? (_reportPossibleCrUseOfDissolveEffect({
        error: Error()
      }), DissolveEffect) : DissolveEffect), _dec7 = property(Material), _dec8 = property(CCInteger), _dec9 = property(CCInteger), _dec(_class = (_class2 = class MonsterItem extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "skeletalAnimation", _descriptor, this);

          _initializerDefineProperty(this, "runAniName", _descriptor2, this);

          _initializerDefineProperty(this, "dieAniName", _descriptor3, this);

          _initializerDefineProperty(this, "type", _descriptor4, this);

          _initializerDefineProperty(this, "dissolveEffect", _descriptor5, this);

          _initializerDefineProperty(this, "mats", _descriptor6, this);

          _initializerDefineProperty(this, "hp", _descriptor7, this);

          //rvo
          _initializerDefineProperty(this, "hitPow", _descriptor8, this);

          //受击系数 系数越高 反弹力度越大
          this.currentState = null;
          this._isDead = false;
          this._index = void 0;
          this._lastPathHasObstacle = false;
          this._checkCounter = 0;
          this._noMove = false;
          this._nowHp = 1;
          this._bloodNode = null;
          this._bloodOffset = new Vec3(0, 7.5, 0);
          // 闪红恢复timeout
          this.redTimeout = void 0;
          this._frames = 0;
          this._agentHandleId = -1;
          // 攻击玩家
          this._isAttackPlayer = false;
          this._isHit = false;

          /**
          * 设置追踪主角的线速度方向和大小
          */
          //_tmpScale: Vec3 = new Vec3()
          // 怪物 RVO 移动与护栏攻击逻辑
          this._isExecuteRvo = true;
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

        init(index, bloodNode = null, isDissolveOnce) {
          this._index = index;
          this._bloodNode = bloodNode;
          this._nowHp = this.hp;
          this._isDead = false;
          this._noMove = false;
          this._hasCountedAttack = false;
          this._assignedGuardrail = null;

          if (this.runAniName) {
            this.scheduleOnce(() => {
              this._isAttackPlayer = false;
              this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                error: Error()
              }), MonsterStateEnum) : MonsterStateEnum).Walk);
            }, 0);
          }

          if (this.type === 1) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.BossTipConManager.addTarget(this.node);
            this._bloodOffset = new Vec3(0, 15, 0);
          } else {
            this._bloodOffset = new Vec3(0, 7.5, 0);
          }

          if (this._bloodNode) {
            let bar = this._bloodNode.getComponent(ProgressBar);

            if (bar) {
              bar.progress = 1;
            }

            this._bloodNode.active = false;
          } //初始化材质


          this.dissolveEffect.forEach(d => {
            this.setMaterByIndex(d.node, 0);

            if (isDissolveOnce) {
              this.warmUpMaterial(d.node, 1);
              this.warmUpMaterial(d.node, 2);
            }

            d.reset();
          });
        }

        setMaterByIndex(node, matIndex) {
          let mesh = node.getComponent(MeshRenderer);

          if (mesh) {
            mesh.setMaterial(this.mats[matIndex], 0);

            if (this.type === 1) {
              //大怪需要挂双材质
              if (matIndex == 1) {
                mesh.setMaterial(this.mats[matIndex], 1);
              } else {
                mesh.setMaterial(this.mats[matIndex + 3], 1);
              }
            }
          }
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

        deathAni(isPlayer = false) {
          if (this._isDead) {
            return;
          }

          if (isPlayer) {
            //击退效果
            this._isHit = true;
            const agentAid = this.agentHandleId;
            const currentPos = this.node.getWorldPosition().clone();
            const playerPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.player.node.getWorldPosition().clone(); // 计算击退方向向量

            let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);
            goalVector = goalVector.normalize().multiplyScalar(-this.hitPow); // 预测击退后的终点

            const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));
            const targetNode = new Node("Temp");
            targetNode.setWorldPosition(knockbackFinalPos);
            const isInsideDoor = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.sceneManager.isNodeInsideDoorArea(targetNode); // if (isInsideDoor) {
            //     console.log("击退后会进门区域");
            // } else {
            //     console.log("击退后不会进门区域");
            // }

            if (!isInsideDoor) {
              tween(this.node).by(0.15, {
                position: new Vec3(goalVector.x, 0, goalVector.y)
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

                this._isHit = false;
              }).start();
            } else {
              if (this._assignedGuardrail) {
                this._assignedGuardrail.attackingMonsterCount = Math.max(0, (this._assignedGuardrail.attackingMonsterCount || 1) - 1);
                this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                  error: Error()
                }), MonsterStateEnum) : MonsterStateEnum).Walk);
                this._assignedGuardrail = null;
                this._hasCountedAttack = false;
                this._noMove = false;
              }

              this._isHit = false;
            }
          } else {
            this.updateIconPos();
          }

          if (this.redTimeout) {
            clearTimeout(this.redTimeout);
            this.redTimeout = null;
          }

          this._nowHp--;

          if (this._nowHp > 0) {
            if (this._bloodNode) {
              let bar = this._bloodNode.getComponent(ProgressBar);

              if (bar) {
                bar.progress = this._nowHp / this.hp;
              }

              this._bloodNode.active = true;
            }

            if (isPlayer) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.player.monsterHitEffect([this.node]);
            } //闪红


            this.dissolveEffect.forEach(d => {
              this.setMaterByIndex(d.node, 1);
            });
            this.redTimeout = setTimeout(() => {
              //恢复
              this.dissolveEffect.forEach(d => {
                this.setMaterByIndex(d.node, 0);
              });
            }, 250);
            return;
          } //真死了


          this._isDead = true;

          if (this._assignedGuardrail && this._hasCountedAttack && this._assignedGuardrail.attackingMonsterCount > 0) {
            this._assignedGuardrail.attackingMonsterCount--;
          }

          this._isAttackPlayer = false;
          this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
            error: Error()
          }), MonsterStateEnum) : MonsterStateEnum).Die);
          let timeout = 650;

          if (this.type > 0) {
            timeout = 880;
          } //闪红


          this.dissolveEffect.forEach(d => {
            this.setMaterByIndex(d.node, 1);
          });
          setTimeout(() => {
            //消融
            this.dissolveEffect.forEach(d => {
              this.setMaterByIndex(d.node, 2);
              d.init();
              d.play(0.5);
            });
          }, 250);
          setTimeout(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.monsterManager.recycleMonster(this._index, this.node);
          }, timeout);

          if (this.type === 1) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.BossTipConManager.removeTarget(this.node);
          }

          this.scheduleOnce(() => {
            if (isPlayer) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.player.monsterHitEffect([this.node]);
              this.updateIconPos();
            } else {
              this.updateIconPos();
            }
          }, 0.15); //血条回收

          if (this._bloodNode) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.monsterManager.recycleBlood(this._bloodNode);
          } //掉落生成


          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.gridSystem.removeNode(this.node);
        }

        updateIconPos() {
          if (this.node.name == "Mantis") {
            const randomIconNum = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
              error: Error()
            }), MathUtil) : MathUtil).getRandom(3, 5);
            const worldPos = this.node.getWorldPosition().clone();

            for (let i = 0; i < randomIconNum; i++) {
              const randius = 3;
              const angle = Math.random() * Math.PI * 2;
              const r = Math.sqrt(Math.random()) * randius;
              const offsetX = r * Math.cos(angle);
              const offsetZ = r * Math.sin(angle);
              const newRandomPos = new Vec3(worldPos.x + offsetX, worldPos.y, worldPos.z + offsetZ);
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.monsterManager.dropItem(newRandomPos);
            }
          } else {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.monsterManager.dropItem(this.node.getWorldPosition().clone());
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
          const playerPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node.getWorldPosition();
          let moveTarget = v2(playerPos.x, playerPos.z);
          let worldTarget = new Vec3(playerPos.x, 0, playerPos.z);
          const isPlayerInDoorArea = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManager.isNodeInsideDoorArea((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node);

          if (isPlayerInDoorArea) {
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
              moveTarget = v2(pos.x, pos.z);
              worldTarget = new Vec3(pos.x, 0, pos.z);
              this._assignedGuardrail = nearestGuardrail;
              this._assignedGuardrail.attackingMonsterCount = (this._assignedGuardrail.attackingMonsterCount || 0) + 1;
            } else if (this._assignedGuardrail) {
              const guardrailPos = this._assignedGuardrail.node.worldPosition;
              moveTarget = v2(guardrailPos.x, guardrailPos.z);
              worldTarget = new Vec3(guardrailPos.x, 0, guardrailPos.z);
            }
          } else {
            if (this._assignedGuardrail) {
              if (this._hasCountedAttack) {
                this.rotateTowards(this._assignedGuardrail.node.worldPosition, dt);
                (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                  error: Error()
                }), Simulator) : Simulator).instance.setAgentPrefVelocity(this.agentHandleId, Vec2.ZERO);
                return;
              }

              const count = this._assignedGuardrail.attackingMonsterCount || 0;
              const guardrailPos = this._assignedGuardrail.node.worldPosition;
              moveTarget = v2(guardrailPos.x, guardrailPos.z);
              worldTarget = new Vec3(guardrailPos.x, 0, guardrailPos.z);

              if (count === 0) {
                const monsterPos = this.node.worldPosition.clone();
                const dx = playerPos.x - monsterPos.x;
                const dz = playerPos.z - monsterPos.z;
                const distSqr = dx * dx + dz * dz;
                const playerRange = 0.3;

                if (distSqr <= playerRange * playerRange) {
                  this._assignedGuardrail = null;
                  this._hasCountedAttack = false;
                  this._noMove = false;
                  moveTarget = v2(playerPos.x, playerPos.z);
                  worldTarget = new Vec3(playerPos.x, 0, playerPos.z);
                }
              }
            }
          }

          const agentAid = this.agentHandleId;
          const agent = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentByAid(agentAid);
          const agentPos = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentPosition(agentAid);

          if (this._isHit) {
            return;
          }

          if (agent && agentPos) {
            const goalVector = moveTarget.subtract2f(agentPos.x, agentPos.y);
            const distSqr = goalVector.lengthSqr();
            const distanceToTargetSquared = Vec3.squaredDistance(this.node.worldPosition, worldTarget);
            const hasArrived = distanceToTargetSquared <= 16;

            if (hasArrived) {
              if (this.currentState !== (_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                error: Error()
              }), MonsterStateEnum) : MonsterStateEnum).Attack) {
                this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                  error: Error()
                }), MonsterStateEnum) : MonsterStateEnum).Attack);

                if (Vec3.equals(worldTarget, (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.player.node.worldPosition) && !this._isDead && this.node.name === "Mantis") {
                  this._isAttackPlayer = true;
                }
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
              // ✅ 确保正在追击时状态是 Walk
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
              const currentRotation = this.node.worldRotation.clone();
              const targetRotation = new Quat();
              Quat.fromViewUp(targetRotation, forward, Vec3.UP);
              const rotateSpeed = 8;
              const slerped = new Quat();
              Quat.slerp(slerped, currentRotation, targetRotation, Math.min(1, dt * rotateSpeed));
              this.node.worldRotation = slerped;
            }
          } else {
            console.error("RVO异常::", agent, agentPos, agentAid);
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
          const currentQuat = this.node.worldRotation.clone();
          const resultQuat = new Quat();
          Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
          this.node.worldRotation = resultQuat;
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
          } //同步更新血条位置


          if (this._bloodNode) {
            let bloodPos = new Vec3();
            Vec3.add(bloodPos, currentPos, this._bloodOffset);

            this._bloodNode.setWorldPosition(bloodPos);
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
          } else {
            var _this$skeletalAnimati;

            (_this$skeletalAnimati = this.skeletalAnimation) == null || _this$skeletalAnimati.crossFade(state, 0.1);
          }

          this.currentState = state;
        }

        attack() {
          if (this._isAttackPlayer) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.uiWarnManager.playWarnFadeAnimation();
          } //打护栏


          if (this._assignedGuardrail) {
            //护栏掉血
            if (this._assignedGuardrail.blood > 0) {
              this._assignedGuardrail.blood -= 1;

              let bloodNode = this._assignedGuardrail.node.getChildByName("FenceBloodBar");

              if (!bloodNode) {
                bloodNode = instantiate((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
                  error: Error()
                }), EntityTypeEnum) : EntityTypeEnum).FenceBloodBar));

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
                  }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[1], 0);
                  setTimeout(() => {
                    leftMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[0], 0);
                  }, 50);
                }
              }

              let rightNode = this._assignedGuardrail.node.getChildByPath("Door_Right/WeiLan/WeiLan");

              if (rightNode) {
                let rightMesh = rightNode.getComponent(MeshRenderer);

                if (rightMesh) {
                  rightMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[1], 0);
                  setTimeout(() => {
                    rightMesh.setMaterial((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.sceneManager.doorMaterials[0], 0);
                  }, 50);
                }
              }
            } else {
              //围栏
              let fenceNode = this._assignedGuardrail.node.getChildByName("B");

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
        /**
         * 如果是打人，检测人是否远离，远离动画切换成走路
         */


        attackOver() {
          if (this._isAttackPlayer) {
            const playerPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.player.node.getWorldPosition();
            const monsterPos = this.node.getWorldPosition();
            const distSqr = Vec3.squaredDistance(playerPos, monsterPos);

            if (distSqr > 16) {
              this.changState((_crd && MonsterStateEnum === void 0 ? (_reportPossibleCrUseOfMonsterStateEnum({
                error: Error()
              }), MonsterStateEnum) : MonsterStateEnum).Walk);
              this._isAttackPlayer = false;
            }
          }
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
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "runAniName", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "walk_f";
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "dieAniName", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "die";
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "dissolveEffect", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "mats", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "hp", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "hitPow", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3fe10a5ecdcbf515dac0a644a2b0cb08a803921c.js.map