System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, instantiate, Pool, Prefab, Vec3, DataManager, Bullet, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, GunTurretManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBullet(extras) {
    _reporterNs.report("Bullet", "./Bullet", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Pool = _cc.Pool;
      Prefab = _cc.Prefab;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      Bullet = _unresolved_3.Bullet;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "892baxyzkFNIJ9D5zCU8kcm", "GunTurretManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'instantiate', 'Node', 'Pool', 'Prefab', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GunTurretManager", GunTurretManager = (_dec = ccclass('GunTurretManager'), _dec2 = property(Prefab), _dec(_class = (_class2 = class GunTurretManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "projectile", _descriptor, this);

          this.prefabPool = null;
          // 是否普通攻击
          this.isNormalAttacking = true;
        }

        init() {
          var poolCount = 5;
          this.prefabPool = new Pool(() => {
            return instantiate(this.projectile);
          }, poolCount, node => {
            node.removeFromParent();
          });
        }

        onDestroy() {
          this.prefabPool.destroy();
        }

        create() {
          if (!this.prefabPool) return;
          var node = this.prefabPool.alloc();

          if (node.parent == null) {
            director.getScene().addChild(node);
          }

          node.active = true;
          return node;
        }

        onProjectileDead(node) {
          node.active = false;
          this.prefabPool.free(node);
        }

        update(dt) {
          var monsters = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.searchMonsters.getAttackTargets(this.node, 50, 180);
          if (!monsters.length) return;
          var partnerWorldPos = this.node.worldPosition;
          var nearestMonster = this.getNearestMonster(monsters, partnerWorldPos);

          if (nearestMonster && this.isNormalAttacking) {
            this.fireAtTarget(nearestMonster);
            this.isNormalAttacking = false;
            this.scheduleOnce(() => {
              this.isNormalAttacking = true;
            }, 3);
          }
        }

        fireAtTarget(target) {
          var bullet = this.create();
          if (!bullet) return;
          var newBulletPos = new Vec3(this.node.worldPosition.x, this.node.worldPosition.y + 10, this.node.worldPosition.z);
          bullet.setWorldPosition(newBulletPos);
          var bulletComp = bullet.getComponent(_crd && Bullet === void 0 ? (_reportPossibleCrUseOfBullet({
            error: Error()
          }), Bullet) : Bullet);

          if (bulletComp) {
            bulletComp.target = target;
            bulletComp.speed = 40;
          }
        } // 获取离伙伴最近的怪物


        getNearestMonster(monsters, partnerPos) {
          var nearest = null;
          var minDistance = Infinity;

          for (var monster of monsters) {
            if (!monster || !monster.isValid) continue;
            var monsterPos = monster.worldPosition;
            var distance = Vec3.distance(monsterPos, partnerPos);

            if (distance < minDistance) {
              minDistance = distance;
              nearest = monster;
            }
          }

          return nearest;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "projectile", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=55bedb45a23a893a7d64c843a349193189980408.js.map