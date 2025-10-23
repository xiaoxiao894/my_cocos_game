System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Pool, EntityTypeEnum, DataManager, SoundManager, _dec, _class, _crd, ccclass, property, PartnerConManager;

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../Common/SoundManager", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Pool = _cc.Pool;
    }, function (_unresolved_2) {
      EntityTypeEnum = _unresolved_2.EntityTypeEnum;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }, function (_unresolved_4) {
      SoundManager = _unresolved_4.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3bf68g+U1dEtZkKVLGBCleY", "PartnerConManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'Pool']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PartnerConManager", PartnerConManager = (_dec = ccclass('PartnerConManager'), _dec(_class = class PartnerConManager extends Component {
        constructor(...args) {
          super(...args);
          this.PartnerPool = null;
          this.partnerCount = 10;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.partnerConManager = this;
        }

        partnerConManagerInit() {
          this.PartnerPool = new Pool(() => {
            const monsterPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Partner);
            return instantiate(monsterPrefab);
          }, this.partnerCount, node => {
            node.removeFromParent();
          });
        }

        create() {
          if (!this.PartnerPool) return;
          let node = this.PartnerPool.alloc();
          node.active = true;
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).inst.playAudio("YX_huoban");
          return node;
        }

        onDestroy() {
          this.PartnerPool.destroy();
        } // 回收金币


        onProjectileDead(node) {
          node.active = false;
          this.PartnerPool.free(node);
        } // 自动寻怪


        update(dt) {
          if (this.node.children.length < 0) return; //
          // 攻击到的怪
          // const monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, 10, 360);
          // const hasMonsters = monsters && monsters.length > 0;
          // if (!hasMonsters) return;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3fee0750abcde080edb4ad0e89556c900ade671c.js.map