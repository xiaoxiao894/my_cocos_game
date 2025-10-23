System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Component, instantiate, Mat4, Node, SkeletalAnimation, tween, Vec3, DataManager, EntityTypeEnum, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, WeaponManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Mat4 = _cc.Mat4;
      Node = _cc.Node;
      SkeletalAnimation = _cc.SkeletalAnimation;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a936by2BN1CMIgNpsMxKhRo", "WeaponManager", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Component', 'instantiate', 'Mat4', 'Node', 'Prefab', 'SkeletalAnimation', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("WeaponManager", WeaponManager = (_dec = ccclass('WeaponManager'), _dec2 = property(CCFloat), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec(_class = (_class2 = class WeaponManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "createInterval", _descriptor, this);

          _initializerDefineProperty(this, "temporaryWeapons", _descriptor2, this);

          _initializerDefineProperty(this, "transferStart", _descriptor3, this);

          _initializerDefineProperty(this, "transferCenter", _descriptor4, this);

          _initializerDefineProperty(this, "transferEnd", _descriptor5, this);

          _initializerDefineProperty(this, "minionWeaponCon", _descriptor6, this);

          this._maxWeaponCount = 3;
          this._timer = 0;
          this._slotSyncTimer = 0;
          this.weaponPos = [new Vec3(0.839, -2.448, -1.216), new Vec3(2.003, -2.448, -1.216), new Vec3(3.277, -2.448, -1.216)];
          this.weapons = null;
          this._slotOccupied = [false, false, false];
          this._tieJiang = null;
          this._tieJiangAni = null;
          this._isTransmitting = false;
          this._transmitTimer = 0;
          this._transmitInterval = 0.1;
        }

        start() {
          this._tieJiang = this.node.getChildByName("TieJiang");
          this._tieJiangAni = this._tieJiang.getComponent(SkeletalAnimation);
          this.weapons = this.node.getChildByName("Weapons");

          if (!this.weapons) {
            console.error("Weapons 节点未找到");
          }
        }

        update(deltaTime) {
          var _this$weapons;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isConveyorBeltUnlocking) {
            this._transmitTimer += deltaTime;

            if (!this._isTransmitting && this._transmitTimer >= this._transmitInterval) {
              this._transmitTimer = 0;
              this.automaticallyTransmitAni();
            }
          } // 是否生成武器


          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isGenerateWeapons) return;
          if (!this.weapons) return;

          if (((_this$weapons = this.weapons) == null ? void 0 : _this$weapons.children.length) >= this._maxWeaponCount) {
            this._tieJiangAni.stop();

            return;
          }

          this._timer += deltaTime;

          if (this._timer >= this.createInterval) {
            this._timer = 0;
            this.createWeapon();
          }

          this._slotSyncTimer += deltaTime;

          if (this._slotSyncTimer >= 1) {
            this.syncSlotOccupiedState();
            this._slotSyncTimer = 0;
          }
        }

        syncSlotOccupiedState() {
          for (let i = 0; i < this.weaponPos.length; i++) {
            const pos = this.weaponPos[i];
            let occupied = false;

            for (const child of this.weapons.children) {
              const localPos = this.weapons.inverseTransformPoint(new Vec3(), child.getWorldPosition());

              if (Vec3.distance(localPos, pos) < 0.1) {
                occupied = true;
                break;
              }
            }

            this._slotOccupied[i] = occupied;
          }
        }

        createWeapon() {
          if (!this._tieJiang || !this.weapons) return;
          const prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Weapon);
          if (!prefab) return;
          let slotIndex = -1;

          for (let i = 0; i < this.weaponPos.length; i++) {
            const expectedPos = this.weaponPos[i];
            let isOccupied = false;

            for (const child of this.weapons.children) {
              const worldPos = child.getWorldPosition();
              const localPos = this.weapons.inverseTransformPoint(new Vec3(), worldPos);

              if (Vec3.distance(localPos, expectedPos) < 0.1) {
                isOccupied = true;
                break;
              }
            }

            if (!isOccupied) {
              slotIndex = i;
              this._slotOccupied[i] = true;
              break;
            } else {
              this._slotOccupied[i] = true;
            }
          }

          if (slotIndex === -1) return;
          const end = this.weaponPos[slotIndex].clone();
          const duration = 0.6;

          this._tieJiangAni.crossFade("Take 001", 0.1);

          this.scheduleOnce(() => {
            this.spawnAndAnimateWeapon(prefab, end, duration, slotIndex);
          }, 0.67);
        }

        spawnAndAnimateWeapon(prefab, end, duration, slotIndex) {
          const weapon = instantiate(prefab);
          weapon.setParent(this.node);
          weapon.setPosition(new Vec3(1.719, -8.208, -1.43));
          tween(weapon).to(duration, {
            position: end
          }, {
            easing: 'quadInOut'
          }).call(() => {
            const worldPos = weapon.getWorldPosition();
            const finalLocal = this.weapons.inverseTransformPoint(new Vec3(), worldPos);
            weapon.setParent(this.weapons);
            weapon.setPosition(finalLocal);
            weapon.__slotIndex = slotIndex;
          }).start();
        }

        playerWeaponRotationAni(weapon) {
          const duration = 0.6;
          const startEuler = weapon.children[0].eulerAngles.clone();
          const targetEuler = new Vec3(123, -8, 180);
          const rotCtrl = {
            t: 0
          };
          tween(rotCtrl).to(duration, {
            t: 1
          }, {
            easing: 'quadOut',
            onUpdate: () => {
              const t = rotCtrl.t;
              const currentEuler = new Vec3();
              Vec3.lerp(currentEuler, startEuler, targetEuler, t);
              weapon.children[0].setRotationFromEuler(currentEuler.x, currentEuler.y, currentEuler.z);
            }
          }).start();
        }

        automaticallyTransmitAni() {
          if (this._isTransmitting || !this.weapons) return; // 排列顺序

          this.getLastPositionWeapon();
          const children = this.weapons.children;
          if (children.length === 0) return;
          const lastWeapon = children[children.length - 1];
          if (!lastWeapon || !lastWeapon.isValid) return;
          this._isTransmitting = true;
          const slotIndex = lastWeapon.__slotIndex;

          if (slotIndex !== undefined) {
            this._slotOccupied[slotIndex] = false;
          }

          const worldStartPos = lastWeapon.getWorldPosition();
          const worldRotation = lastWeapon.children[0].getWorldRotation();
          lastWeapon.setParent(this.temporaryWeapons);
          lastWeapon.setWorldPosition(worldStartPos);
          lastWeapon.children[0].setWorldRotation(worldRotation);
          const jumpTarget = this.transferStart.getWorldPosition();
          const jumpMid = new Vec3((worldStartPos.x + jumpTarget.x) / 2, Math.max(worldStartPos.y, jumpTarget.y) + 2, (worldStartPos.z + jumpTarget.z) / 2);
          const controller = {
            t: 0
          };
          tween(controller).to(0.4, {
            t: 1
          }, {
            easing: 'quadOut',
            onUpdate: () => {
              const t = controller.t;
              const oneMinusT = 1 - t;
              const pos = new Vec3(oneMinusT * oneMinusT * worldStartPos.x + 2 * oneMinusT * t * jumpMid.x + t * t * jumpTarget.x, oneMinusT * oneMinusT * worldStartPos.y + 2 * oneMinusT * t * jumpMid.y + t * t * jumpTarget.y, oneMinusT * oneMinusT * worldStartPos.z + 2 * oneMinusT * t * jumpMid.z + t * t * jumpTarget.z);
              lastWeapon.setWorldPosition(pos);
            }
          }).call(() => {
            const basePos = lastWeapon.getWorldPosition();
            tween(lastWeapon).to(0.15, {
              position: basePos.clone().add3f(0, 0.5, 0)
            }, {
              easing: 'quadOut'
            }).to(0.15, {
              position: basePos
            }, {
              easing: 'bounceOut'
            }).call(() => {
              const center = this.transferCenter.getWorldPosition();
              const end = this.transferEnd.getWorldPosition();
              tween(lastWeapon).to(0.6, {
                worldPosition: center
              }, {
                easing: 'linear'
              }).to(1.2, {
                worldPosition: end
              }, {
                easing: 'linear'
              }).call(() => {
                this.playerWeaponRotationAni(lastWeapon);
                const total = this.minionWeaponCon.children.length;
                const itemsPerRow = 4;
                const spacingZ = 1.3;
                const spacingY = 1;
                const col = total % itemsPerRow;
                const row = Math.floor(total / itemsPerRow);
                const localTarget = new Vec3(0, row * spacingY, col * spacingZ);
                const worldTarget = this.minionWeaponCon.getWorldPosition().clone();
                const worldRot = this.minionWeaponCon.getWorldRotation();
                const worldScale = this.minionWeaponCon.getWorldScale();
                const mat = new Mat4();
                Mat4.fromRTS(mat, worldRot, worldTarget, worldScale);
                const targetPos = Vec3.transformMat4(new Vec3(), localTarget, mat);
                const finalStart = lastWeapon.getWorldPosition();
                const finalControl = new Vec3((finalStart.x + targetPos.x) / 2, Math.min(Math.max(finalStart.y, targetPos.y) + 2, 5), (finalStart.z + targetPos.z) / 2);
                const finalController = {
                  t: 0
                };
                tween(finalController).to(0.4, {
                  t: 1
                }, {
                  easing: 'quadInOut',
                  onUpdate: () => {
                    const t = finalController.t;
                    const oneMinusT = 1 - t;
                    const pos = new Vec3(oneMinusT * oneMinusT * finalStart.x + 2 * oneMinusT * t * finalControl.x + t * t * targetPos.x, oneMinusT * oneMinusT * finalStart.y + 2 * oneMinusT * t * finalControl.y + t * t * targetPos.y, oneMinusT * oneMinusT * finalStart.z + 2 * oneMinusT * t * finalControl.z + t * t * targetPos.z);
                    lastWeapon.setWorldPosition(pos);
                  }
                }).call(() => {
                  // 被传送过来的武器
                  lastWeapon.__delivered = true;
                  lastWeapon[`__isTransferredWeapons`] = true;
                  lastWeapon.setParent(this.minionWeaponCon);
                  lastWeapon.setWorldPosition(targetPos);
                  this._isTransmitting = false;
                }).start();
              }).start();
            }).start();
          }).start();
        }

        getLastPositionWeapon() {
          const weapons = this.weapons.children.filter(w => w && w.isValid);
          if (weapons.length === 0) return null;
          weapons.sort((a, b) => b.worldPosition.z - a.worldPosition.z);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "createInterval", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "temporaryWeapons", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "transferStart", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "transferCenter", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "transferEnd", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "minionWeaponCon", [_dec7], {
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
//# sourceMappingURL=1ace275cec59770fd15316df503a0ed753e1b82f.js.map