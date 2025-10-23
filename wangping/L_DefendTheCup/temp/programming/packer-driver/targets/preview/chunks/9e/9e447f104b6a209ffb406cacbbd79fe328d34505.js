System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, Node, find, Material, Pool, instantiate, EntityTypeEnum, PathEnum, PrefabPathEnum, ResourceManager, DataManager, Platform, GridSystem, FlowField, Simulator, Vector2, RVOObstacles, super_html_playable, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, SceneManager;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPathEnum(extras) {
    _reporterNs.report("PathEnum", "../Enum/Index", _context.meta, extras);
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

  function _reportPossibleCrUseOfPlatform(extras) {
    _reporterNs.report("Platform", "../Common/Platform", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGridSystem(extras) {
    _reporterNs.report("GridSystem", "../Grid/GridSystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlowField(extras) {
    _reporterNs.report("FlowField", "../Monster/FlowField", _context.meta, extras);
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
      Pool = _cc.Pool;
      instantiate = _cc.instantiate;
    }, function (_unresolved_2) {
      EntityTypeEnum = _unresolved_2.EntityTypeEnum;
      PathEnum = _unresolved_2.PathEnum;
      PrefabPathEnum = _unresolved_2.PrefabPathEnum;
    }, function (_unresolved_3) {
      ResourceManager = _unresolved_3.ResourceManager;
    }, function (_unresolved_4) {
      DataManager = _unresolved_4.DataManager;
    }, function (_unresolved_5) {
      Platform = _unresolved_5.default;
    }, function (_unresolved_6) {
      GridSystem = _unresolved_6.GridSystem;
    }, function (_unresolved_7) {
      FlowField = _unresolved_7.FlowField;
    }, function (_unresolved_8) {
      Simulator = _unresolved_8.Simulator;
    }, function (_unresolved_9) {
      Vector2 = _unresolved_9.Vector2;
    }, function (_unresolved_10) {
      RVOObstacles = _unresolved_10.default;
    }, function (_unresolved_11) {
      super_html_playable = _unresolved_11.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7ec65RrpElLGYwVABwEQCSi", "SceneManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab', 'Node', 'director', 'find', 'math', 'Material', 'Pool', 'instantiate']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SceneManager", SceneManager = (_dec = ccclass('SceneManager'), _dec2 = property(Node), _dec3 = property(Material), _dec4 = property(Material), _dec(_class = (_class2 = class SceneManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "obstacles", _descriptor, this);

          _initializerDefineProperty(this, "doorMaterials", _descriptor2, this);

          _initializerDefineProperty(this, "guardrailMaterials", _descriptor3, this);

          this.hitEffectPrefabPool = null;
          // 栅栏血条消失逻辑
          this._frames = 0;
        }

        onLoad() {
          //跳转链接
          var google_play = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
          var appstore = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_google_play_url(google_play);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_app_store_url(appstore);
        }

        start() {
          var _this = this;

          return _asyncToGenerator(function* () {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.sceneManager = _this;
            yield Promise.all([_this.loadRes()]);

            _this.initGame();

            _this.initGrid();
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
          }), DataManager) : DataManager).Instance.soundManager.playLoopAudio();
          (_crd && Platform === void 0 ? (_reportPossibleCrUseOfPlatform({
            error: Error()
          }), Platform) : Platform).instance.init();
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager) (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.init();

          if (this.obstacles) {
            (_crd && FlowField === void 0 ? (_reportPossibleCrUseOfFlowField({
              error: Error()
            }), FlowField) : FlowField).Instance.init(this.obstacles.children);
          } //rvo


          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0)); // 添加静态障碍物

          this.addRvoObstacle(); // 收集护栏

          var fencesScene1 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).FencesScene1);
          this.collectGuardrails(fencesScene1); // 添加门

          this.initAddScene1DoorFun();
          var poolCount = 5;
          this.hitEffectPrefabPool = new Pool(() => {
            var prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).TX_Attack_hit);
            return instantiate(prefab);
          }, poolCount, node => {
            node.removeFromParent();
          });
          this.updateGuidanceData();
        }

        initGrid() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.gridSystem = new (_crd && GridSystem === void 0 ? (_reportPossibleCrUseOfGridSystem({
            error: Error()
          }), GridSystem) : GridSystem)(5);
        } // 更新指引数据


        updateGuidanceData() {
          var deliveryAreas = find("ThreeDNode/Map/DeliveryAreas");

          if (deliveryAreas) {
            var guideList = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList;

            for (var i = 0; i < deliveryAreas.children.length; i++) {
              var node = deliveryAreas.children[i];
              if (!node) continue;
              var guideData = {
                name: node.name,
                isDisplay: true,
                isFind: true,
                node: node,
                worldPos: node.worldPosition
              }; // 最后两个插入数组开头，其余插入末尾

              if (i >= deliveryAreas.children.length - 2) {
                guideData.isDisplay = false;
                guideList.unshift(guideData); // 插入开头
              } else {
                var plot = node.getChildByName("Plot");

                if (plot) {
                  var isZeroScale = plot && plot.scale.x !== 0 && plot.scale.y !== 0 && plot.scale.z !== 0;

                  if (isZeroScale) {
                    guideData.isDisplay = true;
                  } else {
                    guideData.isDisplay = false;
                  }
                }

                guideList.push(guideData); // 插入末尾
              }
            }
          }
        } // 添加障碍物


        addRvoObstacle() {
          var tempList = [];
          var scene1Physics = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).Scene1Physics);
          var left = scene1Physics.getChildByName("Left");
          var right = scene1Physics.getChildByName("Right");
          var top = scene1Physics.getChildByName("Top");
          var bottom = scene1Physics.getChildByName("Bottom");
          var obstacle = scene1Physics.getChildByName("obstacle");
          var outSide1 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).OutSide1);
          var outSide2 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).OutSide2);
          var outSide3 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).OutSide3);
          var outSide4 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).OutSide4);
          tempList.push(...left.children, ...right.children, ...bottom.children, ...top.children);
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.obstacleArr.push(obstacle, ...outSide1.children, ...outSide2.children, ...outSide3.children, ...outSide4.children);
          var excludedNames = ["Scene1_T_Door", "Scene1_L_Door", "Scene1_R_Door", "Scene1_B_Door"];

          for (var i = 0; i < tempList.length; i++) {
            var node = tempList[i];

            if (excludedNames.indexOf(node.name) === -1) {
              (_crd && RVOObstacles === void 0 ? (_reportPossibleCrUseOfRVOObstacles({
                error: Error()
              }), RVOObstacles) : RVOObstacles).addOneObstacle(node);
            }
          }

          for (var _i = 0; _i < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.obstacleArr.length; _i++) {
            var _node = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.obstacleArr[_i];
            (_crd && RVOObstacles === void 0 ? (_reportPossibleCrUseOfRVOObstacles({
              error: Error()
            }), RVOObstacles) : RVOObstacles).addOneObstacle(_node);
          }

          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.processObstacles();
        } // 收集护栏


        collectGuardrails(scene) {
          for (var i = 0; i < scene.children.length; i++) {
            for (var j = 0; j < scene.children[i].children.length; j++) {
              var node = scene.children[i].children[j];
              if (!node) continue;
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.guardrailArr.push({
                node: node,
                attackingMonsterCount: 0,
                blood: (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.guardrailBlood
              });
            }
          }
        } // 添加门


        initAddScene1DoorFun() {
          var scene1 = find((_crd && PathEnum === void 0 ? (_reportPossibleCrUseOfPathEnum({
            error: Error()
          }), PathEnum) : PathEnum).Scene1);
          var doorConfigs = [{
            side: "LSide",
            doorName: "L_Door",
            direction: "Left"
          }, {
            side: "TSide",
            doorName: "T_Door",
            direction: "Top"
          }, {
            side: "RSide",
            doorName: "R_Door",
            direction: "Right"
          }, {
            side: "BSide",
            doorName: "B_Door",
            direction: "Bottom"
          }];
          doorConfigs.forEach(cfg => {
            var sideNode = scene1.getChildByName(cfg.side);

            if (!sideNode) {
              console.warn("\u672A\u627E\u5230 " + cfg.side);
              return;
            }

            var doorNode = sideNode.children.find(child => child.name === cfg.doorName);

            if (!doorNode) {
              console.warn("\u672A\u627E\u5230 " + cfg.doorName + " in " + cfg.side);
              return;
            }

            this.addDoor({
              direction: cfg.direction,
              doorNode
            });
          });
        } // 添加场景2


        addSceneDoorFun(path) {
          var index = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.doors.findIndex(item => {
            return item.direction == "Right";
          });

          if (index >= 0) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.doors.splice(index, 1);
            var scene2 = find(path);
            var rSide = scene2.getChildByName("RSide");

            if (rSide) {
              var rDoor = rSide.getChildByName("R_Door");

              if (rDoor) {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.doors.push({
                  direction: "Right",
                  doorNode: rDoor
                });
              }
            }
          }
        } // 添加门


        addDoor(door) {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.doors.push(door);
        } // 判断一个节点是否在门围城的区域内


        isNodeInsideDoorArea(node) {
          var doors = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.doors;

          if (!doors || doors.length < 4) {
            // console.log("门数量不足， 无法判断区域")
            return false;
          }

          var minX = Infinity,
              maxX = -Infinity;
          var minZ = Infinity,
              maxZ = -Infinity;

          for (var {
            doorNode
          } of doors) {
            var doorLeft = doorNode.getChildByName("Door_Left");
            var _pos = doorLeft.worldPosition;
            minX = Math.min(minX, _pos.x);
            maxX = Math.max(maxX, _pos.x);
            minZ = Math.min(minZ, _pos.z);
            maxZ = Math.max(maxZ, _pos.z);
          }

          var pos = node.worldPosition;
          return pos.x >= minX && pos.x <= maxX && pos.z >= minZ && pos.z <= maxZ;
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

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "obstacles", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "doorMaterials", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "guardrailMaterials", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9e447f104b6a209ffb406cacbbd79fe328d34505.js.map