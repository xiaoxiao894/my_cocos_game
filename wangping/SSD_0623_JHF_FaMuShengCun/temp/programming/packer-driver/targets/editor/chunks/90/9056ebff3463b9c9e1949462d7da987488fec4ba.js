System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Component, _dec, _class, _crd, ccclass, property, PartnerManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4ed2de7CEtDJbIg9bB8I+bj", "PartnerManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'AnimationState', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PartnerManager", PartnerManager = (_dec = ccclass('PartnerManager'), _dec(_class = class PartnerManager extends Component {
        constructor(...args) {
          super(...args);
          this._isWalkAttack = false;
        }

        start() {}

        update(deltaTime) {} // 停顿攻击特效


        pauseAttackEffect() {// const jack = this.node.getChildByName("jack");
          // const txWalkAttack = jack.getChildByName("TX_attack");
          // txWalkAttack.active = true;
          // const attackSprite = txWalkAttack.getChildByName("Sprite");
          // if (attackSprite) {
          //     const walkAttackAni = attackSprite.getComponent(Animation);
          //     if (walkAttackAni) {
          //         walkAttackAni.once(Animation.EventType.FINISHED, this._onAttackFinished, this);
          //         walkAttackAni.play("TX_Attack");
          //     }
          // }
        }

        _onAttackFinished(anim, state) {
          if (state.name === "TX_Attack") {
            const jack = this.node.getChildByName("jack");
            const txWalkAttack = jack.getChildByName("TX_attack");
            txWalkAttack.active = false;

            if (this._isWalkAttack) {
              this._isWalkAttack = false; // this.walkingAttackEffects();
            }
          }
        } // 走路攻击特效


        walkingAttackEffects() {
          const jack = this.node.getChildByName("jack");
          const txWalkAttack = jack.getChildByName("TX_walk_attack");
          txWalkAttack.active = true;
          const walkAttackSprite = txWalkAttack.getChildByName("Sprite");

          if (walkAttackSprite) {
            const walkAttackAni = walkAttackSprite.getComponent(Animation);

            if (walkAttackAni) {
              walkAttackAni.once(Animation.EventType.FINISHED, this._onWalkAttackFinished, this); // walkAttackAni?.stop();

              walkAttackAni == null || walkAttackAni.play("TX_Attack");
            }
          }
        }

        _onWalkAttackFinished(anim, state) {
          if (state.name === "TX_Attack") {
            const jack = this.node.getChildByName("jack");
            const txWalkAttack = jack.getChildByName("TX_walk_attack");
            txWalkAttack.active = false;
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9056ebff3463b9c9e1949462d7da987488fec4ba.js.map