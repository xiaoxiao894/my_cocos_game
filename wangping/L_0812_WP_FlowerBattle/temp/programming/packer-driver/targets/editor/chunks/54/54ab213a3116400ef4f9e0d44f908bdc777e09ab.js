System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Node, PlayerController, SceneNode, ResourceManager, GlobeVariable, NodePoolManager, GameManager, EnemyController, DropController, MapShowController, GoldMineController, super_html_playable, BeetleController, GuideManager, SoundManager, DataManager, _dec, _dec2, _class, _class2, _descriptor, _class3, _crd, ccclass, property, App;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPlayerController(extras) {
    _reporterNs.report("PlayerController", "./Entitys/PlayerController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneNode(extras) {
    _reporterNs.report("SceneNode", "./SceneNode", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "./core/ResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "./core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNodePoolManager(extras) {
    _reporterNs.report("NodePoolManager", "./core/NodePoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyController(extras) {
    _reporterNs.report("EnemyController", "./Entitys/EnemyController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDropController(extras) {
    _reporterNs.report("DropController", "./Entitys/DropController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMapShowController(extras) {
    _reporterNs.report("MapShowController", "./MapShowController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGoldMineController(extras) {
    _reporterNs.report("GoldMineController", "./Entitys/GoldMineController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "./core/super_html_playable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBeetleController(extras) {
    _reporterNs.report("BeetleController", "./Entitys/BeetleController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGuideManager(extras) {
    _reporterNs.report("GuideManager", "./Guide/GuideManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "./core/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "./data/DataManager", _context.meta, extras);
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
    }, function (_unresolved_2) {
      PlayerController = _unresolved_2.PlayerController;
    }, function (_unresolved_3) {
      SceneNode = _unresolved_3.SceneNode;
    }, function (_unresolved_4) {
      ResourceManager = _unresolved_4.ResourceManager;
    }, function (_unresolved_5) {
      GlobeVariable = _unresolved_5.GlobeVariable;
    }, function (_unresolved_6) {
      NodePoolManager = _unresolved_6.NodePoolManager;
    }, function (_unresolved_7) {
      GameManager = _unresolved_7.GameManager;
    }, function (_unresolved_8) {
      EnemyController = _unresolved_8.EnemyController;
    }, function (_unresolved_9) {
      DropController = _unresolved_9.default;
    }, function (_unresolved_10) {
      MapShowController = _unresolved_10.MapShowController;
    }, function (_unresolved_11) {
      GoldMineController = _unresolved_11.default;
    }, function (_unresolved_12) {
      super_html_playable = _unresolved_12.default;
    }, function (_unresolved_13) {
      BeetleController = _unresolved_13.BeetleController;
    }, function (_unresolved_14) {
      GuideManager = _unresolved_14.GuideManager;
    }, function (_unresolved_15) {
      SoundManager = _unresolved_15.SoundManager;
    }, function (_unresolved_16) {
      DataManager = _unresolved_16.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "49f66t8yLdE/ogkVKJuj0cW", "App", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("App", App = (_dec = ccclass('App'), _dec2 = property(Node), _dec(_class = (_class2 = (_class3 = class App extends Component {
        constructor(...args) {
          super(...args);
          this.gameManager = null;

          //public static soundManager: SoundManager = null;
          _initializerDefineProperty(this, "root", _descriptor, this);
        }

        async onLoad() {
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.preloadAudioClips();
          App.sceneNode = this.node.getComponent(_crd && SceneNode === void 0 ? (_reportPossibleCrUseOfSceneNode({
            error: Error()
          }), SceneNode) : SceneNode);
          App.mapShowController = this.root.getComponent(_crd && MapShowController === void 0 ? (_reportPossibleCrUseOfMapShowController({
            error: Error()
          }), MapShowController) : MapShowController);
          App.poolManager = (_crd && NodePoolManager === void 0 ? (_reportPossibleCrUseOfNodePoolManager({
            error: Error()
          }), NodePoolManager) : NodePoolManager).Instance;
          App.resManager = (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
            error: Error()
          }), ResourceManager) : ResourceManager).instance;
          App.dataManager = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance;
          await App.dataManager.init();
          await this.initRes(); // App.soundManager = SoundManager.Instance;

          App.beetleController = (_crd && BeetleController === void 0 ? (_reportPossibleCrUseOfBeetleController({
            error: Error()
          }), BeetleController) : BeetleController).Instance;
          App.playerController = (_crd && PlayerController === void 0 ? (_reportPossibleCrUseOfPlayerController({
            error: Error()
          }), PlayerController) : PlayerController).Instance;
          App.enemyController = (_crd && EnemyController === void 0 ? (_reportPossibleCrUseOfEnemyController({
            error: Error()
          }), EnemyController) : EnemyController).Instance;
          App.enemyController.init();
          App.goldMineController = (_crd && GoldMineController === void 0 ? (_reportPossibleCrUseOfGoldMineController({
            error: Error()
          }), GoldMineController) : GoldMineController).Instance;
          App.dropController = (_crd && DropController === void 0 ? (_reportPossibleCrUseOfDropController({
            error: Error()
          }), DropController) : DropController).Instance;
          App.playerController.initPlayer();
          App.guideManager = (_crd && GuideManager === void 0 ? (_reportPossibleCrUseOfGuideManager({
            error: Error()
          }), GuideManager) : GuideManager).Instance;
          this.gameManager = new (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager)();
          App.gameManager = this.gameManager;
          this.gameManager.startGame();
        }
        /**应该放在加载进度中  没有进度在次调用 */


        async initRes() {
          // //创建敌人
          let prefab = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.EnemySpider);

          if (prefab) {
            App.poolManager.initPool(prefab, 100, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.EnemySpider);
          } // //创建敌人


          let prefabL = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.EnemySpiderL);

          if (prefabL) {
            App.poolManager.initPool(prefabL, 100, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.EnemySpiderL);
          } //创建血条


          let prefabBlood = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.BloodBar);

          if (prefabBlood) {
            App.poolManager.initPool(prefabBlood, 100, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.BloodBar);
          } //创建火柴棍箭矢


          let fireArrow = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.FireArrow);

          if (fireArrow) {
            App.poolManager.initPool(fireArrow, 100, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.FireArrow);
          } //创建炮塔胶囊


          let turret = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.TurretBullet);

          if (turret) {
            App.poolManager.initPool(turret, 100, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.TurretBullet);
          } //创建炮塔胶囊


          let beetle = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.Beetle);

          if (beetle) {
            App.poolManager.initPool(beetle, 100, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.Beetle);
          } //创建金币


          let prefabCoin = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.Coin);

          if (prefabCoin) {
            App.poolManager.initPool(prefabCoin, 100, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.Coin);
          } //箭头3d 


          let prefabArrow3D = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.Guid_Arrow3D);
          App.guidArrow3D = instantiate(prefabArrow3D); //箭头路径

          let prefabArrowPath = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.Guid_ArrowPath);

          if (prefabArrowPath) {
            App.poolManager.initPool(prefabArrowPath, 10, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.Guid_ArrowPath);
          } //花瓣特效


          let prefabFlowerTxPath = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.FlowerTx);

          if (prefabFlowerTxPath) {
            App.poolManager.initPool(prefabFlowerTxPath, 10, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.FlowerTx);
          } //炮塔攻击特效


          let prefabTurretTxPath = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.TurretTx);

          if (prefabTurretTxPath) {
            App.poolManager.initPool(prefabTurretTxPath, 22, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.TurretTx);
          } //炮塔攻击特效


          let prefabTurretBombTxPath = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.TurretBombTx);

          if (prefabTurretBombTxPath) {
            App.poolManager.initPool(prefabTurretBombTxPath, 10, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.TurretBombTx);
          } //-arrow 火柴攻击人物受击特效


          let prefabArrowTxPath = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.ArrowTX);

          if (prefabArrowTxPath) {
            App.poolManager.initPool(prefabArrowTxPath, 10, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.ArrowTX);
          } //-arrow  Beetle 攻击受击特效


          let prefabBeetleCollideTxPath = await App.resManager.loadPrefab((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).prefabPath.BeetleCollideTx);

          if (prefabBeetleCollideTxPath) {
            App.poolManager.initPool(prefabBeetleCollideTxPath, 10, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.BeetleCollideTx);
          }
        }

        start() {
          const google_play = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
          const appstore = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_google_play_url(google_play);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_app_store_url(appstore);
        }

        update(deltaTime) {
          if (this.gameManager) {
            this.gameManager.update(deltaTime);
          }
        }

      }, _class3.playerController = null, _class3.enemyController = null, _class3.beetleController = null, _class3.sceneNode = null, _class3.resManager = null, _class3.poolManager = null, _class3.dropController = null, _class3.mapShowController = null, _class3.goldMineController = null, _class3.dataManager = null, _class3.guidArrow3D = null, _class3.gameManager = null, _class3.guideManager = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "root", [_dec2], {
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
//# sourceMappingURL=54ab213a3116400ef4f9e0d44f908bdc777e09ab.js.map