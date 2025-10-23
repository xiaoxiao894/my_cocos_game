System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Node, Prefab, EntityTypeEnum, EventName, PrefabPathEnum, ResourceManager, DataManager, EventManager, super_html_playable, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, google_play, appstore, SceneManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "./Common/Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "./Common/Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabPathEnum(extras) {
    _reporterNs.report("PrefabPathEnum", "./Common/Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "./Global/ResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "./Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "./Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "../super_html_playable", _context.meta, extras);
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
      Node = _cc.Node;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      EntityTypeEnum = _unresolved_2.EntityTypeEnum;
      EventName = _unresolved_2.EventName;
      PrefabPathEnum = _unresolved_2.PrefabPathEnum;
    }, function (_unresolved_3) {
      ResourceManager = _unresolved_3.ResourceManager;
    }, function (_unresolved_4) {
      DataManager = _unresolved_4.DataManager;
    }, function (_unresolved_5) {
      EventManager = _unresolved_5.EventManager;
    }, function (_unresolved_6) {
      super_html_playable = _unresolved_6.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e455b6a7HVEXqdIpY+3AaP1", "SceneManger", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);
      google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
      appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";

      _export("SceneManager", SceneManager = (_dec = ccclass('SceneManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class SceneManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "socketNodes", _descriptor, this);

          _initializerDefineProperty(this, "arrowNodes", _descriptor2, this);

          _initializerDefineProperty(this, "arrowParent", _descriptor3, this);

          this._arrowNode = null;
        }

        async start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManger = this;
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_google_play_url(google_play);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_app_store_url(appstore);
          await Promise.all([this.loadRes()]);
          this.initGame();
        }

        async loadRes() {
          const list = [];

          for (const type in _crd && PrefabPathEnum === void 0 ? (_reportPossibleCrUseOfPrefabPathEnum({
            error: Error()
          }), PrefabPathEnum) : PrefabPathEnum) {
            const p = (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
              error: Error()
            }), ResourceManager) : ResourceManager).Instance.loadRes((_crd && PrefabPathEnum === void 0 ? (_reportPossibleCrUseOfPrefabPathEnum({
              error: Error()
            }), PrefabPathEnum) : PrefabPathEnum)[type], Prefab).then(Prefab => {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.prefabMap.set(type, Prefab);
            });
            list.push(p);
          }

          await Promise.all(list);
        }

        initGame() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.socketNodes = this.socketNodes;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.arrowNodes = this.arrowNodes;
          this.createArrow();
        }

        createArrow() {
          if (!this._arrowNode) {
            this._arrowNode = instantiate((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Arrow));
            this._arrowNode.parent = this.arrowParent;
            this.scheduleOnce(() => {
              (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
                error: Error()
              }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
                error: Error()
              }), EventName) : EventName).ArrowTargetVectorUpdate, (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.ropeManager.endNodes[0].getWorldPosition().clone());
            }, 0);
          }
        }

        checkBuildCanUpdate() {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.leftSocket.length === 2) {
            console.log('升级塔 ui出现');
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
              error: Error()
            }), EventName) : EventName).TowerUpgradeButtonShow);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "socketNodes", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "arrowNodes", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "arrowParent", [_dec4], {
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
//# sourceMappingURL=6cc979c8b07ca044d00dba628b8e7a2b46afd2aa.js.map