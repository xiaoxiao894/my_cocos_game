System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Color, Component, find, math, Node, ParticleSystem, Quat, tween, Vec3, DataManager, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ItemElectricTowerManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

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
      Animation = _cc.Animation;
      Color = _cc.Color;
      Component = _cc.Component;
      find = _cc.find;
      math = _cc.math;
      Node = _cc.Node;
      ParticleSystem = _cc.ParticleSystem;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a145cIdMSdFKrcz8zqvpg6w", "ItemElectricTowerManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Camera', 'Color', 'Component', 'find', 'Material', 'math', 'Mesh', 'MeshRenderer', 'Node', 'ParticleSystem', 'primitives', 'Quat', 'tween', 'utils', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemElectricTowerManager", ItemElectricTowerManager = (_dec = ccclass('ItemElectricTowerManager'), _dec2 = property(Node), _dec(_class = (_class2 = class ItemElectricTowerManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "wirePathNode", _descriptor, this);

          // 多长时间发射一次
          this._timeInterval = 0.8;
          this._timer = 0.5;
          this._bulletAttackTime = 1;
          this._speed = 20;
          this._lightingTimeInterval = 0.8;
          this._lightingTimer = 0.5;
          // 新建电塔
          this.isNew = false;
          this.isTower = false;
          this.monster = [];
        }

        start() {}

        update(dt) {
          if (this.isNew) {
            this.isNew = false;
            this.isTower = true;
            const monsters = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.searchTreeManager.getAttackTargets(this.wirePathNode.children[this.wirePathNode.children.length - 1], 30, 360);
            this.towerAni(monsters, 2.5);
          }

          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isTowerAttack || !this.wirePathNode || this.wirePathNode.children.length <= 0 || !this.node.parent.active || !this.node.active) return;
          const electricTowerAttackRange = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.electricTowerAttackRange || 15;
          const monsters = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.searchTreeManager.getAttackTargets(this.wirePathNode.children[this.wirePathNode.children.length - 1], electricTowerAttackRange, 360);
          this.towerAni(monsters, dt);
        } // 电塔动画


        towerAni(monsters, dt) {
          this.monster = [];

          for (let i = 0; i < monsters.length; i++) {
            if (monsters[i].name != "Tree") {
              this.monster.push(monsters[i]);
            }
          }

          if (this.monster.length <= 0) return;
          this._timer += dt;

          if (this._timer >= this._timeInterval) {
            this._timer = 0;
            const pathPoints = this.wirePathNode.children.map(child => child.worldPosition.clone());
            if (pathPoints.length < 2) return;
            const electricTower = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.electricTowerManager.createElectricTower();
            if (!electricTower) return;
            const parentNode = find("THREE3DNODE/ElectricityCon");
            if (!parentNode) return;
            const light = electricTower.getChildByName("Sphere Light");
            if (light) light.active = false;
            const shandian = electricTower.getChildByName("Electricity-001");
            if (shandian) shandian.active = true;
            electricTower.setWorldPosition(pathPoints[0]);
            electricTower.setParent(parentNode);
            let seq = tween(electricTower);

            for (let i = 1; i < pathPoints.length; i++) {
              const from = pathPoints[i - 1];
              const to = pathPoints[i];
              const distance = Vec3.distance(from, to);
              const moveTime = distance / this._speed;
              const direction = new Vec3();
              Vec3.subtract(direction, to, from);
              direction.normalize(); // const angleY = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
              // console.log("============================>", angleY);

              seq = seq.then(tween(electricTower).to(moveTime, {
                worldPosition: to
              }, {
                easing: 'linear'
              }).call(() => {// 若需要旋转，设置欧拉角
                // let snappedAngle = Math.round(angleY / 90) * 90;
                // electricTower.setRotationFromEuler(new Vec3(0, snappedAngle, 0));
                // electricTower.setRotationFromEuler(new Vec3(0, angleY, 0));
              }));
            }

            seq = seq.call(() => {
              if (electricTower) electricTower.removeFromParent();
            });
            seq.start();
          }

          this._lightingTimer += dt;

          if (this._lightingTimer >= this._lightingTimeInterval) {
            this._lightingTimer = 0;
            const pathPoints = this.wirePathNode.children.map(child => child.worldPosition.clone());
            if (pathPoints.length < 2) return;
            const electricTower = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.electricTowerManager.createElectricTower();
            if (!electricTower) return;
            const parentNode = find("THREE3DNODE/ElectricityCon");
            if (!parentNode) return;
            const light = electricTower.getChildByName("Sphere Light");
            if (light) light.active = true;
            const shandian = electricTower.getChildByName("Electricity-001");
            if (shandian) shandian.active = false;
            electricTower.setWorldPosition(pathPoints[0]);
            electricTower.setParent(parentNode);
            let seq = tween(electricTower).delay(0.1);

            for (let i = 1; i < pathPoints.length; i++) {
              const from = pathPoints[i - 1];
              const to = pathPoints[i];
              const distance = Vec3.distance(from, to);
              const moveTime = distance / this._speed;
              const direction = new Vec3();
              Vec3.subtract(direction, to, from);
              direction.normalize(); // const angleY = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
              // console.log("============================>", angleY);

              seq = seq.then(tween(electricTower).to(moveTime, {
                worldPosition: to
              }, {
                easing: 'linear'
              }).call(() => {// 若需要旋转，设置欧拉角
                // let snappedAngle = Math.round(angleY / 90) * 90;
                // electricTower.setRotationFromEuler(new Vec3(0, snappedAngle, 0));
                // electricTower.setRotationFromEuler(new Vec3(0, angleY, 0));
              }));
            }

            seq = seq.call(() => {
              if (electricTower) electricTower.removeFromParent();
            });
            seq.start();
          }

          this._bulletAttackTime += dt;

          if (this._bulletAttackTime >= (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.bulletAttackTimeInterval) {
            this._bulletAttackTime = 0;
            const pathPoints = this.wirePathNode.children.map(child => child.worldPosition.clone());
            if (pathPoints.length < 2) return; // const electricTower = DataManager.Instance.electricTowerManager.createElectricTower();
            // if (!electricTower) return;
            // const parentNode = find("THREE3DNODE/ElectricityCon");
            // if (!parentNode) return;
            // electricTower.setWorldPosition(pathPoints[pathPoints.length - 1]);
            // electricTower.setParent(parentNode);

            const node = this.node.getChildByName("Node");
            if (!node) return;
            const dtAniNode = node.getChildByName("DTani");
            if (!dtAniNode) return;
            const dianhua = dtAniNode.getChildByName("TX_dianhuan");
            if (!dianhua) return;
            dianhua.active = true;
            const dianqiu = dtAniNode.getChildByName("TX_dianqiu");
            if (!dianqiu) return;
            dianqiu.active = true;
            const electricTower = dtAniNode.getChildByName("TX_dian_v1");
            if (!electricTower) return;
            electricTower.active = true;
            const dtAni = dtAniNode.getComponent(Animation);

            if (dtAni) {
              dtAni.play("attackDT"); // 播放动画，等待0.47秒执行下一次动画
              // this.scheduleOnce(() => {
              // const monsters = DataManager.Instance.gridSystem.getNearbyMonsterNodes(this.node.worldPosition, 18);
              // 查找半径内的怪物

              if (this.monster && this.monster.length > 0) {
                if (this.isTower) {
                  this.isTower = false;
                  let monsterCount = 0;

                  for (let i = 0; i < dtAniNode.children.length; i++) {
                    const dian = dtAniNode.children[i];

                    if (dian.name.includes("TX_dian_")) {
                      dian.active = true;
                      const monster = this.monster[monsterCount];
                      if (!monster) break;
                      monsterCount++;
                      let neck = monster.children[0].getChildByName("hit Socket");

                      if (!neck) {
                        neck = monster.children[0].children[0].getChildByName("hit Socket");
                      }

                      const start = dian.worldPosition;
                      const end = neck.worldPosition; // 方向与长度

                      const dir = new Vec3();
                      Vec3.subtract(dir, end, start);
                      const len = dir.length();

                      if (len > 1e-5) {
                        const dirN = dir.clone().normalize();
                        const look = new Quat();
                        Quat.fromViewUp(look, dirN, Vec3.UP);
                        const rotX90 = new Quat();
                        Quat.fromAxisAngle(rotX90, Vec3.RIGHT, math.toRadian(90));
                        const final = new Quat();
                        Quat.multiply(final, look, rotX90);
                        dian.setWorldRotation(final);
                      } // 模型原始高度


                      const modelBaseLen = 1;
                      const k = len / Math.max(1e-6, modelBaseLen);
                      const s = dian.scale;
                      dian.setScale(s.x, k / 3, s.z);
                      const ps = dian.getComponent(ParticleSystem);
                      if (!ps) return; // 重置粒子系统

                      ps.stop();
                      ps.clear(); // 设置初始颜色

                      const startColor = ps.startColor.color.clone();
                      startColor.a = 255;
                      ps.startColor.color = startColor; // 重新开始发射

                      ps.play();
                      (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                        error: Error()
                      }), DataManager) : DataManager).Instance.monsterManager.killMonsters([monster], end); // 用一个代理值做渐隐

                      const val = {
                        a: 255
                      };
                      tween(val).to(0.3, {
                        a: 0
                      }, {
                        onUpdate: () => {
                          ps.startColor.color = new Color(startColor.r, startColor.g, startColor.b, val.a);
                        },
                        onComplete: () => {
                          // 如果需要完全结束粒子
                          ps.stop();
                        }
                      }).start();
                    }
                  }
                } else {
                  var _this$getRightmostMon;

                  // let monster = this.monster[0];
                  // if (DataManager.Instance.cameraGuiding) {
                  let monster = (_this$getRightmostMon = this.getRightmostMonster(this.monster)) != null ? _this$getRightmostMon : this.monster[0]; // }

                  let neck = monster.children[0].getChildByName("hit Socket");

                  if (!neck) {
                    neck = monster.children[0].children[0].getChildByName("hit Socket");
                  }

                  const start = electricTower.worldPosition;
                  const end = neck.worldPosition; // 方向与长度

                  const dir = new Vec3();
                  Vec3.subtract(dir, end, start);
                  const len = dir.length();

                  if (len > 1e-5) {
                    const dirN = dir.clone().normalize();
                    const look = new Quat();
                    Quat.fromViewUp(look, dirN, Vec3.UP);
                    const rotX90 = new Quat();
                    Quat.fromAxisAngle(rotX90, Vec3.RIGHT, math.toRadian(90));
                    const final = new Quat();
                    Quat.multiply(final, look, rotX90);
                    electricTower.setWorldRotation(final);
                  } // 模型原始高度


                  const modelBaseLen = 1;
                  const k = len / Math.max(1e-6, modelBaseLen);
                  const s = electricTower.scale;
                  electricTower.setScale(s.x, k / 3, s.z);
                  const ps = electricTower.getComponent(ParticleSystem);
                  if (!ps) return; // 重置粒子系统

                  ps.stop();
                  ps.clear(); // 设置初始颜色

                  const startColor = ps.startColor.color.clone();
                  startColor.a = 255;
                  ps.startColor.color = startColor; // 重新开始发射

                  ps.play();
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.monsterManager.killMonsters([monster], end); // 用一个代理值做渐隐

                  const val = {
                    a: 255
                  };
                  tween(val).to(0.3, {
                    a: 0
                  }, {
                    onUpdate: () => {
                      ps.startColor.color = new Color(startColor.r, startColor.g, startColor.b, val.a);
                    },
                    onComplete: () => {
                      // 如果需要完全结束粒子
                      ps.stop();
                    }
                  }).start();
                } // electricTower.getComponent(ParticleSystem).startColor.color = new Color(255, 0, 0, 255)
                // tween(electricTower)
                //     .delay(0.4)
                //     .call(() => {
                //         DataManager.Instance.monsterManager.killMonsters([monster]);
                //     })
                //     .start();
                // 让 lineNode 连接 nodeA 和 nodeB
                // this.stretchPointKeepPos(electricTower, posA, posB, 1 /*baseLen*/, 0 /*yBase*/, 0 /*zBase*/);
                // const electricToweAni = electricTower.getComponent(Animation)
                // electricToweAni.play();
                // electricToweAni.once(Animation.EventType.FINISHED, () => {
                //     electricTower.active = false;
                //     DataManager.Instance.monsterManager.killMonsters([monster]);
                // })
                // const monsterPos = monster.worldPosition;
                // const distance = Vec3.distance(electricTower.worldPosition, monsterPos);
                // // const moveTime = distance / 20;
                // const light = electricTower.getChildByName("Sphere Light");
                // if (light) light.active = false;
                // const electricity = electricTower.getChildByName("Electricity");
                // if (electricity) electricity.active = true;
                // tween(electricTower)
                //     .to(.4, { worldPosition: monsterPos }, { easing: 'linear' })
                //     .call(() => {
                //         // 攻击到怪物， 怪物死亡
                //         DataManager.Instance.monsterManager.killMonsters([monster]);
                //         if (electricTower) electricTower.removeFromParent();
                //         // DataManager.Instance.electricTowerManager.onElectricTowerDead(electricTower);
                //     })
                //     .start();

              } // }, 0.27)

            }
          }
        }
        /**
         * 保持节点当前位置不变，基于当前旋转仅更新 Y(左右) 和 Z(上下)，
         * 让它指向目标；同时按 A-B 的距离拉伸 X 轴。
         *
         * @param node    要操作的节点（位置不改）
         * @param start   起点世界坐标（用于长度计算）
         * @param end     终点世界坐标（用于指向 & 长度计算）
         * @param baseLen 节点在缩放(1,1,1)时 X 方向的世界长度，默认 1
         * @param yBase   资源/初始朝向在 Y 轴上的基准偏移（度），默认 0
         * @param zBase   资源/初始朝向在 Z 轴上的基准偏移（度），默认 0
         */


        stretchPointKeepPos(node, start, end, baseLen = 1, yBase = 0, zBase = 0) {
          // 1) 不改位置：用“当前节点位置 → 终点”的方向来算旋转
          const from = node.worldPosition;
          const dir = new Vec3(end.x - from.x, end.y - from.y, end.z - from.z);
          if (dir.length() < 1e-6) return; // 太近就不处理
          // 2) 计算左右(Y)与上下(Z)

          const yawY = math.toDegree(Math.atan2(dir.x, dir.z)) + yBase; // 左右

          const pitchZ = math.toDegree(Math.atan2(dir.y, Math.hypot(dir.x, dir.z))) + zBase; // 上下
          // 3) 仅替换 Y/Z，保留当前的 X（roll）

          const curEuler = new Vec3();
          node.worldRotation.getEulerAngles(curEuler); // 读取当前 X/Y/Z

          const rot = new Quat();
          Quat.fromEuler(rot, curEuler.x, yawY, pitchZ);
          node.setWorldRotation(rot); // 4) 按 A-B 距离拉伸 X 轴（与节点位置无关）

          const len = Vec3.distance(start, end);
          const s = node.getScale();
          node.setScale(len / baseLen, s.y, s.z);
        } // 找到x轴最大的


        getRightmostMonster(arr) {
          if (!arr || arr.length === 0) return null;
          let rightmost = null;
          let maxX = -Infinity;

          for (let c = 0; c < arr.length; c++) {
            const worldPos = arr[c].worldPosition;

            if (worldPos.x > maxX) {
              maxX = worldPos.x;
              rightmost = arr[c];
            }
          }

          return rightmost;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "wirePathNode", [_dec2], {
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
//# sourceMappingURL=6f8660b3bbf0455ebee2f404eeaaec271d29b5d0.js.map