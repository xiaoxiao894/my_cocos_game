System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, _dec, _class, _crd, ccclass, property, Bullet;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e6677ww9ohArpD61Cz4kcl1", "Bullet", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Bullet", Bullet = (_dec = ccclass('Bullet'), _dec(_class = class Bullet extends Component {
        constructor(...args) {
          super(...args);
          this.PartnerManager = null;
          this.explosiveSpecialEffects = null;
          this.target = null;
          this.speed = 10;
          this._dir = new Vec3();
          this._tempPos = new Vec3();
        }

        update(deltaTime) {
          if (!this.target || !this.target.isValid) {
            this.node.active = false;
            return;
          }

          const currentPos = this.node.worldPosition;
          const targetPos = this.target.worldPosition;
          Vec3.subtract(this._dir, targetPos, currentPos);

          const distance = this._dir.length();

          if (distance < 0.3) {
            this.node.active = false; // 击中怪物， 播放动画

            const boundFunc = this.explosiveSpecialEffects.bind(this.PartnerManager);
            boundFunc(this.target, this.node.name); // 处理命中怪物的逻辑
            // DataManager.Instance.monsterManager.killMonsters([this.target]);

            return;
          }

          Vec3.normalize(this._dir, this._dir);
          Vec3.scaleAndAdd(this._tempPos, currentPos, this._dir, this.speed * deltaTime);
          this.node.setWorldPosition(this._tempPos);
          this.node.lookAt(targetPos);
          const euler = this.node.eulerAngles.clone();
          this.node.setRotationFromEuler(new Vec3(euler.x, euler.y + 90, euler.z));
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=25db58406c955e80e0f1c6bdf9f3caee2a0910c5.js.map