System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, Node, Quat, tween, Vec3, EntityTypeEnum, EventNames, Pool, Simulator, Vector2, Util, MonsterItem, EventManager, DataManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, SPIN_KEY, MonsterConManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventNames(extras) {
    _reporterNs.report("EventNames", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPool(extras) {
    _reporterNs.report("Pool", "../Pool/Pool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "../RVO/Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector2", "../RVO/Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUtil(extras) {
    _reporterNs.report("Util", "../Common/Util", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterItem(extras) {
    _reporterNs.report("MonsterItem", "./MonsterItem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
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
      director = _cc.director;
      Node = _cc.Node;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      EntityTypeEnum = _unresolved_2.EntityTypeEnum;
      EventNames = _unresolved_2.EventNames;
    }, function (_unresolved_3) {
      Pool = _unresolved_3.default;
    }, function (_unresolved_4) {
      Simulator = _unresolved_4.Simulator;
    }, function (_unresolved_5) {
      Vector2 = _unresolved_5.Vector2;
    }, function (_unresolved_6) {
      Util = _unresolved_6.default;
    }, function (_unresolved_7) {
      MonsterItem = _unresolved_7.MonsterItem;
    }, function (_unresolved_8) {
      EventManager = _unresolved_8.EventManager;
    }, function (_unresolved_9) {
      DataManager = _unresolved_9.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3a592kF3uFKiKzhD3Fbj7k9", "MonsterConManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'Node', 'Quat', 'Tween', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      SPIN_KEY = '__spinTween';

      _export("MonsterConManager", MonsterConManager = (_dec = ccclass('MonsterConManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class MonsterConManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "monsterBirthPoint", _descriptor, this);

          _initializerDefineProperty(this, "monsterParent", _descriptor2, this);

          _initializerDefineProperty(this, "coinConNode", _descriptor3, this);

          this.selectLocationIndex = 0;
          this._monsterPools = [];
          this._monsterTypes = [(_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Elephant, (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Bear, (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Bear_B, (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Bear_L];
          this._dropPool = void 0;
          this._bloodPool = void 0;
          this._speedCfg = [7, 5.5, 5.5, 5.5];
          this._radiusCfg = [3, 2, 2.5, 1.8];
          this._coinsList = [];
          this.initMonsterPos = [{
            pos: new Vec3(-18.466, 0, -25.856),
            type: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Elephant
          }, {
            pos: new Vec3(-10.782, 0, -25.856),
            type: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Bear_L
          }, {
            pos: new Vec3(-2.515, 0, -25.856),
            type: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Bear_B
          }, {
            pos: new Vec3(8.038, 0, -25.209),
            type: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Bear
          }, {
            pos: new Vec3(16.237, 0, -25.687),
            type: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Bear
          }];
          this._bornSpeed = 1;
          this._bornTimeLimit = 1;
          this._bornTime = 0;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager = this;
        }

        init() {
          this._monsterPools = [];

          for (let i = 0; i < this._monsterTypes.length; i++) {
            this._monsterPools.push(new (_crd && Pool === void 0 ? (_reportPossibleCrUseOfPool({
              error: Error()
            }), Pool) : Pool)(this._monsterTypes[i]));
          }

          this._dropPool = new (_crd && Pool === void 0 ? (_reportPossibleCrUseOfPool({
            error: Error()
          }), Pool) : Pool)((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Coin);
          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0)); // for (let i = 0; i < this.initMonsterPos.length; i++) {
          //     const { pos } = this.initMonsterPos[i];
          //     DataManager.Instance.monsterManager.creatMonster(true, true, pos, true);
          // }

          for (let i = 0; i < this.node.children.length; i++) {
            const monster = this.node.children[i];
            const monsterItem = monster.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
              error: Error()
            }), MonsterItem) : MonsterItem);
            if (!monsterItem) return;
            let validPos = monster.worldPosition;

            const idx = this._monsterPools.findIndex(item => {
              return item[`_prefab`].name == monster.name; // return item == monster.name;
            });

            monsterItem.init(idx, true, false); // const newNode = new Node("tempNode");
            // newNode.setScale(1, 0, 1);
            // director.getScene().addChild(newNode);
            // newNode.addChild(monster)
            // tween(newNode)
            //     .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
            //     .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            //     .call(() => {
            //         this.monsterParent.addChild(monster);
            //         newNode.removeFromParent();
            //         newNode.destroy();

            const mass = 1;
            const agentId = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.addAgent((_crd && Util === void 0 ? (_reportPossibleCrUseOfUtil({
              error: Error()
            }), Util) : Util).v3t2(validPos), this._radiusCfg[idx], this._speedCfg[idx], null, mass);
            const agentObj = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.getAgentByAid(agentId);
            agentObj.neighborDist = this._radiusCfg[idx] * 2;
            monsterItem.agentHandleId = agentId; // })
            // .start();
          }
        }

        creatMonster(isDissolveOnce, isAfferentPos = false, pos = new Vec3(0, 0, 0), isCustomHp = false) {
          const randomNum = this.getWeightedRandom();
          const pool = this._monsterPools[randomNum];

          if (!pool) {
            // console.warn(`No monster pool found for type ${randomNum}`);
            return;
          }

          const node = pool.getItem();
          const monster = node.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
            error: Error()
          }), MonsterItem) : MonsterItem);
          if (!monster) return;
          let validPos = null;

          if (isAfferentPos) {
            validPos = pos;
            node.setWorldPosition(validPos);
          } else {
            const birthPoints = this.monsterBirthPoint.children;

            if (this.selectLocationIndex >= birthPoints.length) {
              this.selectLocationIndex = 0;
            }

            const birthPoint = birthPoints[this.selectLocationIndex];
            validPos = birthPoint.getWorldPosition();
            node.setWorldPosition(validPos);
            this.selectLocationIndex++;
          }

          monster.init(randomNum, true, isCustomHp);
          const newNode = new Node("tempNode");
          newNode.setScale(1, 0, 1);
          director.getScene().addChild(newNode);
          newNode.addChild(node);
          tween(newNode).to(0.15, {
            scale: new Vec3(1, 1.1, 1)
          }, {
            easing: 'quadOut'
          }).to(0.05, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'quadOut'
          }).call(() => {
            this.monsterParent.addChild(node);
            newNode.removeFromParent();
            newNode.destroy();
            const mass = 1;
            const agentId = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.addAgent((_crd && Util === void 0 ? (_reportPossibleCrUseOfUtil({
              error: Error()
            }), Util) : Util).v3t2(validPos), this._radiusCfg[randomNum], this._speedCfg[randomNum], null, mass);
            const agentObj = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.getAgentByAid(agentId);
            agentObj.neighborDist = this._radiusCfg[randomNum] * 2;
            monster.agentHandleId = agentId;
          }).start();
        }

        getWeightedRandom() {
          const weights = [25, 25, 25, 25]; // 对应 0, 1, 2 的权重

          const total = weights.reduce((a, b) => a + b, 0);
          const rand = Math.random() * total;
          let cumulative = 0;

          for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];

            if (rand < cumulative) {
              return i; // i 就是结果：0, 1, 或 2
            }
          }

          return 1; // 理论上不会走到这里，但加上以防万一
        }

        killMonsters(nodes, end) {
          for (let node of nodes) {
            if (!node || !node.isValid) {
              continue;
            }

            let monster = node.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
              error: Error()
            }), MonsterItem) : MonsterItem);

            if (monster) {
              monster.deathAni(end);
            }
          }
        }

        recycleMonster(index, node) {
          if (this._monsterPools[index]) {
            this._monsterPools[index].putItem(node);
          }
        }

        update(dt) {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isStartGame) {
            if (this._monsterPools.length > 0) {
              const currentMonsterCount = this.monsterParent.children.length;

              if (currentMonsterCount < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.monsterNum) {
                this._bornTime += dt;

                if (this._bornTime > (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.bornTimeLimit) {
                  this._bornTime = 0; // 可创建的数量不超过最大限制

                  const spawnCount = Math.min(this._bornSpeed, (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.monsterNum - currentMonsterCount);

                  for (let i = 0; i < spawnCount; i++) {
                    this.creatMonster(false);
                  }
                }
              }
            } // rvo 更新逻辑坐标


            (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.run(dt);

            for (let index = 0; index < this.monsterParent.children.length; index++) {
              var _monster$getComponent;

              const monster = this.monsterParent.children[index];
              monster == null || (_monster$getComponent = monster.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
                error: Error()
              }), MonsterItem) : MonsterItem)) == null || _monster$getComponent.moveByRvo(dt);
            }

            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).inst.emit((_crd && EventNames === void 0 ? (_reportPossibleCrUseOfEventNames({
              error: Error()
            }), EventNames) : EventNames).ArmyMoveByRVO, dt);
          }
        }

        dropItem(pos, end) {
          const node = this._dropPool.getItem();

          node['__isReady'] = false;
          node['__fallingTarget'] = false;
          this.coinConNode.addChild(node);
          node.eulerAngles = new Vec3(90, 0, 0);
          node.setWorldPosition(new Vec3(pos.x, pos.y + 0.5, pos.z));
          const startY = pos.y + 0.5;
          const peakY = startY + 3; // 第一次跃起高度

          const bounceY = startY + 0.7; // 回落后的弹跳高度

          const targetPos = new Vec3(pos.x, pos.y, pos.z - 3);
          const startRot = node.rotation.clone();
          const p0 = end; //.worldPosition //.clone();// node.worldPosition.clone(); // 起点（此时在地面）

          const p2 = targetPos.clone(); // 终点
          // 控制点：取中点并抬高一些，形成明显弧线；你也可以把 2.5 调高/调低

          const p1 = new Vec3((p0.x + p2.x) * 0.5, Math.max(p0.y, p2.y) + 15, (p0.z + p2.z) * 0.5);
          const totalSpinDeg = 720;
          const tmpQ = new Quat();
          this.startSelfRotate(node, 180);
          const param = {
            t: 0
          };
          tween(param).to(0.5, {
            t: 1
          }, {
            easing: 'quadInOut',
            onUpdate: () => {
              const t = param.t;
              const u = 1 - t; // 二次贝塞尔：B(t) = u^2 * p0 + 2*u*t * p1 + t^2 * p2

              const x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
              const y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
              const z = u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z;
              node.setWorldPosition(x, y, z); // —— 同步做 360° 翻滚 —— 
              // 1) 默认绕 X 轴翻滚；如需改轴：X翻滚(ang,0,0) / Y自转(0,ang,0) / Z滚动(0,0,ang)

              const angle = totalSpinDeg * t;
              Quat.fromEuler(tmpQ, angle, 0, 0); // 绕 X 轴

              const curQ = new Quat();
              Quat.multiply(curQ, startRot, tmpQ);
              node.setRotation(curQ); // 局部旋转
            } // onComplete: () => {
            //     node['__isReady'] = true;
            //     node['__fallingTarget'] = true;
            //     this._coinsList.push(node);
            // }

          }).call(() => {
            // 先做一次“起落-回弹”的弹性效果
            tween(node).to(0.15, {
              position: new Vec3(targetPos.x, peakY, targetPos.z)
            }, {
              easing: 'quadOut'
            }) // 向上弹起
            .to(0.15, {
              position: new Vec3(targetPos.x, startY, targetPos.z)
            }, {
              easing: 'quadIn'
            }) // 回落
            .to(0.07, {
              position: new Vec3(targetPos.x, bounceY, targetPos.z)
            }, {
              easing: 'quadOut'
            }) // 二次弹起
            .to(0.07, {
              position: new Vec3(targetPos.x, startY, targetPos.z)
            }, {
              easing: 'quadIn'
            }) // 回到地面
            .delay(0.5).call(() => {
              // 弹跳结束后，沿二次贝塞尔弧线飞向 targetPos
              node[`__isReady`] = true;

              this._coinsList.push(node);
            }).start();
          }).start();
        } // public dropItem(pos: Vec3) {
        //     let node = this._dropPool.getItem();
        //     node[`__isReady`] = false;
        //     node[`__fallingTarget`] = false;
        //     this.coinConNode.addChild(node);
        //     node.setWorldPosition(pos);
        //     const targetPos = new Vec3(pos.x, pos.y, pos.z - 3);
        //     // 原始位置
        //     const startY = pos.y;
        //     const peakY = startY + 3;     // 第一次跃起高度
        //     const bounceY = startY + 0.7;   // 回落后的弹跳高度
        //     tween(node)
        //         .to(0.25, { position: new Vec3(pos.x, peakY, pos.z) }, { easing: 'quadOut' })   // 向上弹起
        //         .to(0.2, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })    // 回落
        //         .to(0.15, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadOut' }) // 二次弹起
        //         .to(0.15, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })   // 回到地面
        //         .call(() => {
        //             node[`__isReady`] = true;
        //             this._coinsList.push(node);
        //         })
        //         .start();
        // }


        getDrops() {
          let newList = this._coinsList.splice(0, Math.min(this._coinsList.length, 1));

          return newList;
        }

        startSelfRotate(node, speedDegPerSec = 60, axis = 'y') {
          if (!(node != null && node.isValid)) return;
          this.stopSelfRotate(node); // 避免重复叠加

          const dur = 10; // tween 动画时长

          const delta = speedDegPerSec * dur; // 总旋转角度

          const by = axis === 'x' ? new Vec3(delta, 0, 0) : axis === 'y' ? new Vec3(0, delta, 0) : new Vec3(0, 0, delta);
          const tw = tween(node).repeatForever(tween(node).to(dur, {
            eulerAngles: by
          })).start();
          node[SPIN_KEY] = tw;
        }

        stopSelfRotate(node) {
          const tw = node == null ? void 0 : node[SPIN_KEY];

          if (tw) {
            tw.stop();
            delete node[SPIN_KEY];
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "monsterBirthPoint", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "monsterParent", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "coinConNode", [_dec4], {
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
//# sourceMappingURL=8ab55b4c4bdc4615477c6c118709d260c2c6fc6c.js.map