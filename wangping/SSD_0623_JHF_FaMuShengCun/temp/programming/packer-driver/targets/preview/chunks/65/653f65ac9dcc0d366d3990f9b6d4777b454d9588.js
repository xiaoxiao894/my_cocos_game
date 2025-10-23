System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, Node, find, Material, Animation, Label, CCFloat, SpriteFrame, EntityTypeEnum, PrefabPathEnum, ResourceManager, DataManager, GridSystem, Simulator, Vector2, RVOObstacles, super_html_playable, SoundManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, SceneManager;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabPathEnum(extras) {
    _reporterNs.report("PrefabPathEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "../Global/ResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGridSystem(extras) {
    _reporterNs.report("GridSystem", "../Grid/GridSystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "../RVO/Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector2", "../RVO/Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOObstacles(extras) {
    _reporterNs.report("RVOObstacles", "../Global/RVOObstacles", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "../Common/super_html_playable", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      Node = _cc.Node;
      find = _cc.find;
      Material = _cc.Material;
      Animation = _cc.Animation;
      Label = _cc.Label;
      CCFloat = _cc.CCFloat;
      SpriteFrame = _cc.SpriteFrame;
    }, function (_unresolved_2) {
      EntityTypeEnum = _unresolved_2.EntityTypeEnum;
      PrefabPathEnum = _unresolved_2.PrefabPathEnum;
    }, function (_unresolved_3) {
      ResourceManager = _unresolved_3.ResourceManager;
    }, function (_unresolved_4) {
      DataManager = _unresolved_4.DataManager;
    }, function (_unresolved_5) {
      GridSystem = _unresolved_5.GridSystem;
    }, function (_unresolved_6) {
      Simulator = _unresolved_6.Simulator;
    }, function (_unresolved_7) {
      Vector2 = _unresolved_7.Vector2;
    }, function (_unresolved_8) {
      RVOObstacles = _unresolved_8.default;
    }, function (_unresolved_9) {
      super_html_playable = _unresolved_9.default;
    }, function (_unresolved_10) {
      SoundManager = _unresolved_10.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7ec65RrpElLGYwVABwEQCSi", "SceneManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab', 'Node', 'director', 'find', 'math', 'Material', 'Pool', 'instantiate', 'Animation', 'Label', 'CCFloat', 'SpriteAtlas', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SceneManager", SceneManager = (_dec = ccclass('SceneManager'), _dec2 = property(SpriteFrame), _dec3 = property({
        type: CCFloat,
        tooltip: "背景音效差值"
      }), _dec4 = property({
        tooltip: "配置一个字符串参数"
      }), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Material), _dec8 = property(Material), _dec9 = property(Node), _dec(_class = (_class2 = class SceneManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "logoIcon", _descriptor, this);

          _initializerDefineProperty(this, "bgmOffset", _descriptor2, this);

          _initializerDefineProperty(this, "bulletAttackTimeInterval", _descriptor3, this);

          // 在属性检查器里可修改
          _initializerDefineProperty(this, "walls", _descriptor4, this);

          _initializerDefineProperty(this, "obstacles", _descriptor5, this);

          _initializerDefineProperty(this, "doorMaterials", _descriptor6, this);

          _initializerDefineProperty(this, "guardrailMaterials", _descriptor7, this);

          _initializerDefineProperty(this, "initFireNode", _descriptor8, this);

          this.hitEffectPrefabPool = null;
          this.towerAttackInterval = [];
          // 栅栏血条消失逻辑
          this._frames = 0;
        }

        onLoad() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManager = this; //跳转链接

          var google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
          var appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_google_play_url(google_play);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_app_store_url(appstore);

          if (this.bulletAttackTimeInterval.length > 0) {
            var strArr = this.bulletAttackTimeInterval.split(",").map(item => Number(item));
            this.towerAttackInterval = strArr;
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.bulletAttackTimeInterval = this.towerAttackInterval[0];
          }
        }

        start() {
          var _this = this;

          return _asyncToGenerator(function* () {
            var unlock = find("THREE3DNODE/Unlock");

            for (var i = 0; i < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList.length; i++) {
              var data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.guideTargetList[i];
              if (!data) continue;
              var plot = unlock.getChildByName(data.plot);
              if (!plot) continue;
              var landmark = plot.getChildByName("Landmark");
              if (!landmark) continue;
              var label = landmark.getChildByName("Label");
              if (!label) continue;
              var labelCom = label.getComponent(Label);
              if (!labelCom) continue;
              data.coinNum = Number(labelCom.string);
              data.initCoinNum = Number(labelCom.string);
            }

            if (_this.initFireNode) {
              _this.initFireNode.active = true;

              var fireAni = _this.initFireNode.getComponent(Animation);

              if (fireAni) fireAni.play();
            }

            yield Promise.all([_this.loadRes()]);

            _this.initGame();

            _this.initGridSystem();
          })();
        }

        loadRes() {
          return _asyncToGenerator(function* () {
            var list = [];

            var _loop = function* _loop(type) {
              var p = (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
                error: Error()
              }), ResourceManager) : ResourceManager).Instance.loadRes((_crd && PrefabPathEnum === void 0 ? (_reportPossibleCrUseOfPrefabPathEnum({
                error: Error()
              }), PrefabPathEnum) : PrefabPathEnum)[type], Prefab).then(Prefab => {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.prefabMap.set(type, Prefab);
              });
              list.push(p);
            };

            for (var type in _crd && PrefabPathEnum === void 0 ? (_reportPossibleCrUseOfPrefabPathEnum({
              error: Error()
            }), PrefabPathEnum) : PrefabPathEnum) {
              yield* _loop(type);
            }

            yield Promise.all(list);
          })();
        }

        initGame() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.init(); //rvo

          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0)); // 添加静态障碍物

          this.addRvoObstacle(); // 收集护栏

          this.collectGuardrails();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.woodManager.woodManagerInit();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.boardManager.boardManagerInit();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeManager.initTrees();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.electricTowerManager.electricTowerManagerInit();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.partnerConManager.partnerConManagerInit(); //预加载音乐音效

          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).inst.preloadAudioClips();
        }

        initGridSystem() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.gridSystem = new (_crd && GridSystem === void 0 ? (_reportPossibleCrUseOfGridSystem({
            error: Error()
          }), GridSystem) : GridSystem)(5);
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeManager.initTreeSystem();
        } // 添加静态障碍物


        addRvoObstacle() {
          (_crd && RVOObstacles === void 0 ? (_reportPossibleCrUseOfRVOObstacles({
            error: Error()
          }), RVOObstacles) : RVOObstacles).addOneObstacle(this.obstacles);
          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.processObstacles();
        } // 收集护栏


        collectGuardrails() {
          for (var i = 0; i < this.walls.children.length; i++) {
            var wall = this.walls.children[i];
            if (i > 8) return;
            if (!wall) continue;
            var bloodNode = wall.getChildByName((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).FenceBloodBar);

            if (bloodNode) {
              bloodNode.active = false;
            }

            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guardrailArr.push({
              node: wall,
              attackingMonsterCount: 0,
              blood: (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.guardrailBlood
            });
          }
        }

        update(dt) {
          if (this._frames++ > 10) {
            this._frames = 0;
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guardrailArr.forEach(guardrail => {
              if (guardrail.attackingMonsterCount <= 0) {
                var bloodNode = guardrail.node.getChildByName((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
                  error: Error()
                }), EntityTypeEnum) : EntityTypeEnum).FenceBloodBar);

                if (bloodNode) {
                  bloodNode.active = false;
                }
              }
            });
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "logoIcon", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bgmOffset", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bulletAttackTimeInterval", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "2,1,0.9,0.8,0.7";
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "walls", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "obstacles", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "doorMaterials", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "guardrailMaterials", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "initFireNode", [_dec9], {
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
//# sourceMappingURL=653f65ac9dcc0d366d3990f9b6d4777b454d9588.js.map