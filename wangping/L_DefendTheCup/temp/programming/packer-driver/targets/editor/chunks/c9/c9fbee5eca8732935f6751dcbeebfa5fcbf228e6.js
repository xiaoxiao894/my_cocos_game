System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, find, geometry, Node, PhysicsSystem, tween, Vec2, Vec3, view, ItemPool, EntityTypeEnum, EventNames, MonsterItem, DataManager, Util, Simulator, EventManager, Vector2, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, MonsterManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemPool(extras) {
    _reporterNs.report("ItemPool", "../Common/ItemPool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventNames(extras) {
    _reporterNs.report("EventNames", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterItem(extras) {
    _reporterNs.report("MonsterItem", "./MonsterItem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUtil(extras) {
    _reporterNs.report("Util", "../Common/Util", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "../RVO/Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector2", "../RVO/Common", _context.meta, extras);
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
      find = _cc.find;
      geometry = _cc.geometry;
      Node = _cc.Node;
      PhysicsSystem = _cc.PhysicsSystem;
      tween = _cc.tween;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      view = _cc.view;
    }, function (_unresolved_2) {
      ItemPool = _unresolved_2.default;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
      EventNames = _unresolved_3.EventNames;
    }, function (_unresolved_4) {
      MonsterItem = _unresolved_4.MonsterItem;
    }, function (_unresolved_5) {
      DataManager = _unresolved_5.DataManager;
    }, function (_unresolved_6) {
      Util = _unresolved_6.default;
    }, function (_unresolved_7) {
      Simulator = _unresolved_7.Simulator;
    }, function (_unresolved_8) {
      EventManager = _unresolved_8.EventManager;
    }, function (_unresolved_9) {
      Vector2 = _unresolved_9.Vector2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c092clFZshCLpZUwj47W8BE", "MonsterManager", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'director', 'find', 'geometry', 'Node', 'PhysicsSystem', 'tween', 'Vec2', 'Vec3', 'view']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", MonsterManager = (_dec = ccclass('MonsterManager'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class MonsterManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "monsterParent", _descriptor, this);

          _initializerDefineProperty(this, "monkeyBloodParent", _descriptor2, this);

          //怪物节点池
          this._monsterPools = [];
          this._monsterTypes = [(_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Spider, (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Mantis];
          this._dropPool = void 0;
          this._bloodPool = void 0;
          this._bornSpeed = 1;
          this._bornTimeLimit = 1;
          this._bornTime = 0;
          this._dropList = [];
          this.initMonsterPos = [{
            pos: new Vec3(-11.775, 0, -22.134)
          }, {
            pos: new Vec3(-20.051, 0, -20.939)
          }, {
            pos: new Vec3(-14.659, 0, -28.843)
          }, {
            pos: new Vec3(-22.969, 0, -25.307)
          }, {
            pos: new Vec3(-28.471, 0, -18.303)
          }];
          //rvo
          this._speedCfg = [10, 8, 8, 8];
          this._radiusCfg = [1.5, 1.5];
          // 计数器/ 控制怪物生成比例
          this._createCounter = 0;
          // smallMonsterRatio   怪物生成的比例
          this._smallMonsterRatio = 10;
          this._bigMonsterRatio = 1;
          this.selectLocationIndex = 0;
          this.monsterBirthPointCon = null;
          this._framTimes = 0;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager = this;
          this.monsterBirthPointCon = find('ThreeDNode/MonsterBirthPointCon');
        } //初始化


        init() {
          this._monsterPools = [];

          for (let i = 0; i < this._monsterTypes.length; i++) {
            this._monsterPools.push(new (_crd && ItemPool === void 0 ? (_reportPossibleCrUseOfItemPool({
              error: Error()
            }), ItemPool) : ItemPool)(this._monsterTypes[i]));
          }

          this._dropPool = new (_crd && ItemPool === void 0 ? (_reportPossibleCrUseOfItemPool({
            error: Error()
          }), ItemPool) : ItemPool)((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).dropItem);
          this._bloodPool = new (_crd && ItemPool === void 0 ? (_reportPossibleCrUseOfItemPool({
            error: Error()
          }), ItemPool) : ItemPool)((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).MonsterBloodBar);
          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0));

          for (let i = 0; i < this.initMonsterPos.length; i++) {
            const {
              pos
            } = this.initMonsterPos[i];
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.monsterManager.creatMonster(true, true, pos);
          }
        }

        creatMonster(isDissolveOnce, isAfferentPos = false, pos = new Vec3(0, 0, 0)) {
          let rad = 0;

          if (this._createCounter >= this._smallMonsterRatio) {
            rad = 1;
            this._createCounter = 0;
          } else {
            rad = 0;
            this._createCounter++;
          }

          const pool = this._monsterPools[rad];

          if (!pool) {
            console.warn(`No monster pool found for type ${rad}`);
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
            const birthPoints = this.monsterBirthPointCon.children;

            if (this.selectLocationIndex >= birthPoints.length) {
              this.selectLocationIndex = 0;
            }

            const birthPoint = birthPoints[this.selectLocationIndex];
            validPos = birthPoint.getWorldPosition();
            node.setWorldPosition(validPos);
            this.selectLocationIndex++;
          } // 初始化怪物
          // if (rad === 1) {


          const bloodNode = this._bloodPool.getItem();

          this.monkeyBloodParent.addChild(bloodNode);

          if (rad == 1) {
            bloodNode.setScale(0.015, 0.015, 0.015);
          } else {
            bloodNode.setScale(0.012, 0.012, 0.012);
          }

          monster.init(rad, bloodNode, isDissolveOnce); // } else {
          // monster.init(rad);
          // }

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
            const mass = 1;
            const agentId = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.addAgent((_crd && Util === void 0 ? (_reportPossibleCrUseOfUtil({
              error: Error()
            }), Util) : Util).v3t2(validPos), this._radiusCfg[rad], this._speedCfg[rad], null, mass);
            const agentObj = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.getAgentByAid(agentId);
            agentObj.neighborDist = this._radiusCfg[rad] * 2;
            monster.agentHandleId = agentId;
          }).start(); // // 初始 scale 为 y=0
          // tween(node)
          //     .to(0.3, { position: new Vec3(validPos.x, validPos.y, validPos.z) }, { easing: 'quadOut' })
          //     .call(() => {
          //     })
          //     .start();
        } //怪出生世界坐标


        getWorldBornPos() {
          //有效范围
          let fixedY = 1; //欠地图边界判断
          //随机角度

          let radAngle = Math.random() * 2 * Math.PI; //console.log(`monster radAngle ${radAngle}`);

          let cameraMain = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.camera;
          let uiPos = this.getRayRectangleIntersection(radAngle);

          if (uiPos) {
            //console.log(`monster sceenPos ${uiPos.x} ${uiPos.y}`);
            let ray = new geometry.Ray();
            cameraMain.screenPointToRay(uiPos.x, uiPos.y, ray); //cameraMain.screenPointToRay(view.getViewportRect().width/2,view.getViewportRect().height/2,ray);
            // 以下参数可选

            const mask = 0xffffffff;
            const maxDistance = 10000000;
            const queryTrigger = true; // if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {

            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const hitPoint = raycastClosestResult.hitPoint; //console.log(`monster worldPos ${hitPoint}`);   
            //pos.y = fixedY;

            return hitPoint; // } else {
            // console.log("no raycastClosest");
            // }
          } else {// console.log("no sceenPos");
          }

          return null;
        }

        getRayRectangleIntersection(angle) {
          //x cos y sin
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const screen = view.getVisibleSize(); // 矩形边界范围（假设矩形是轴对齐的）

          const bounder = 10;
          const xMin = 0 - bounder;
          const xMax = screen.width + bounder;
          const yMin = 0 - bounder;
          const yMax = screen.height + bounder; // 处理极端情况

          const epsilon = 0.0001; // 从屏幕中心发射射线

          const rayOrigin = new Vec2(screen.width / 2, screen.height / 2);
          let nearestT = Infinity;
          let intersection = null; // 处理完全垂直或水平的射线

          if (Math.abs(cosA) < epsilon) {
            // 垂直射线
            return new Vec2(0, sinA > 0 ? yMax : yMin);
          }

          if (Math.abs(sinA) < epsilon) {
            // 水平射线
            return new Vec2(cosA > 0 ? xMax : xMin, 0);
          } // 右边界 x = xMax


          const tRight = (xMax - rayOrigin.x) / cosA;
          const yRight = rayOrigin.y + tRight * sinA;

          if (tRight > epsilon && yRight >= yMin && yRight <= yMax && tRight < nearestT) {
            nearestT = tRight;
            intersection = new Vec2(xMax, yRight);
          } // 左边界 x = xMin


          const tLeft = (xMin - rayOrigin.x) / cosA;
          const yLeft = rayOrigin.y + tLeft * sinA;

          if (tLeft > epsilon && yLeft >= yMin && yLeft <= yMax) {
            nearestT = tLeft;
            intersection = new Vec2(xMin, yLeft);
          } // 上边界 y = yMax


          const tTop = (yMax - rayOrigin.y) / sinA;
          const xTop = rayOrigin.x + tTop * cosA;

          if (tTop > epsilon && xTop >= xMin && xTop <= xMax && tTop < nearestT) {
            nearestT = tTop;
            intersection = new Vec2(xTop, yMax);
          } // 下边界 y = yMin


          const tBottom = (yMin - rayOrigin.y) / sinA;
          const xBottom = rayOrigin.x + tBottom * cosA;

          if (tBottom > epsilon && xBottom >= xMin && xBottom <= xMax && tBottom < nearestT) {
            nearestT = tBottom;
            intersection = new Vec2(xBottom, yMin);
          }

          return intersection;
        }

        update(dt) {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isStartGame) {
            if (this._monsterPools.length > 0) {
              const currentMonsterCount = this.monsterParent.children.length;
              const maxMonsterCount = 80;

              if (currentMonsterCount < maxMonsterCount) {
                this._bornTime += dt;

                if (this._bornTime > this._bornTimeLimit) {
                  this._bornTime = 0; // 可创建的数量不超过最大限制

                  const spawnCount = Math.min(this._bornSpeed, maxMonsterCount - currentMonsterCount);

                  for (let i = 0; i < spawnCount; i++) {
                    this.creatMonster(false);
                  }
                }
              }
            } // rvo 更新逻辑坐标


            (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.run(dt);
            this._framTimes = 0;

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

        killMonsters(nodes, isPlayer = false) {
          for (let node of nodes) {
            let monster = node.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
              error: Error()
            }), MonsterItem) : MonsterItem);

            if (monster) {
              monster.deathAni(isPlayer);
            }
          }
        }

        recycleMonster(index, node) {
          if (this._monsterPools[index]) {
            this._monsterPools[index].putItem(node);
          }
        }

        recycleBlood(node) {
          this._bloodPool.putItem(node);
        } // 金币掉落


        dropItem(pos) {
          let node = this._dropPool.getItem();

          this.monsterParent.addChild(node);
          node.setWorldPosition(pos); // 原始位置

          const startY = pos.y;
          const peakY = startY + 3; // 第一次跃起高度

          const bounceY = startY + 0.7; // 回落后的弹跳高度

          tween(node).to(0.25, {
            position: new Vec3(pos.x, peakY, pos.z)
          }, {
            easing: 'quadOut'
          }) // 向上弹起
          .to(0.2, {
            position: new Vec3(pos.x, startY, pos.z)
          }, {
            easing: 'quadIn'
          }) // 回落
          .to(0.15, {
            position: new Vec3(pos.x, bounceY, pos.z)
          }, {
            easing: 'quadOut'
          }) // 二次弹起
          .to(0.15, {
            position: new Vec3(pos.x, startY, pos.z)
          }, {
            easing: 'quadIn'
          }) // 回到地面
          .call(() => {
            this._dropList.push(node);
          }).start();
        } //获取掉落物


        getDrops() {
          let newList = this._dropList.splice(0, this._dropList.length);

          return newList;
        } //回收掉落物


        recycleDrop(node) {
          this._dropPool.putItem(node);
        } // 开始场景2，3的时候，检查哪些怪被包围在场景中了


        getSurroundedMonsters() {
          const monsterList = [];

          for (let i = 0; i < this.monsterParent.children.length; i++) {
            const monster = this.monsterParent.children[i];
            if (!monster) continue;

            if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.sceneManager.isNodeInsideDoorArea(monster)) {
              monsterList.push(monster);
            }
          }

          return monsterList;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "monsterParent", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "monkeyBloodParent", [_dec3], {
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
//# sourceMappingURL=c9fbee5eca8732935f6751dcbeebfa5fcbf228e6.js.map