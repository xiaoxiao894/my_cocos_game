System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, instantiate, Material, Node, SkinnedMeshRenderer, tween, Vec3, Entity, treeController, ResourceManager, Global, MathUtil, eventMgr, EventType, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, BehaviourType, Character;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOftreeController(extras) {
    _reporterNs.report("treeController", "../Game/TreeController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "../core/ResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "../core/Global", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyTree(extras) {
    _reporterNs.report("EnemyTree", "./EnemyTree", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGroundEffct(extras) {
    _reporterNs.report("GroundEffct", "../GroundEffct", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../MathUtils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../core/EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfenemyCharacter(extras) {
    _reporterNs.report("enemyCharacter", "./enemyCharacter", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      instantiate = _cc.instantiate;
      Material = _cc.Material;
      Node = _cc.Node;
      SkinnedMeshRenderer = _cc.SkinnedMeshRenderer;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
    }, function (_unresolved_3) {
      treeController = _unresolved_3.treeController;
    }, function (_unresolved_4) {
      ResourceManager = _unresolved_4.ResourceManager;
    }, function (_unresolved_5) {
      Global = _unresolved_5.Global;
    }, function (_unresolved_6) {
      MathUtil = _unresolved_6.MathUtil;
    }, function (_unresolved_7) {
      eventMgr = _unresolved_7.eventMgr;
    }, function (_unresolved_8) {
      EventType = _unresolved_8.EventType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a36dfgYc2pDkrDtaPmyHo/p", "Character", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Material', 'MeshRenderer', 'Node', 'SkeletalAnimation', 'SkinnedMeshRenderer', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 角色类型枚举
       * Tree 寻树  
       * handOver 交付   
       * transmit 传送 
       * idel 空闲可以切换任何状态
       * ConrPost 去玉米地位置点
       * enemyHnadOverPos 去玉米地位置点
       */

      _export("BehaviourType", BehaviourType = /*#__PURE__*/function (BehaviourType) {
        BehaviourType["Tree"] = "Tree";
        BehaviourType["CutTree"] = "CutTree";
        BehaviourType["HandOver"] = "HandOver";
        BehaviourType["Transmit"] = "Transmit";
        BehaviourType["ConrPost"] = "ConrPost";
        BehaviourType["CutCorn"] = "CutCorn";
        BehaviourType["FindEnemy"] = "FindEnemy";
        BehaviourType["FindLandPos"] = "FindLandPos";
        BehaviourType["Idel"] = "Idel";
        BehaviourType["EnemyHnadOverPos"] = "enemyHnadOverPos";
        return BehaviourType;
      }({}));

      _export("Character", Character = (_dec = ccclass('Character'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Material), _dec5 = property(Material), _dec6 = property(Material), _dec7 = property(SkinnedMeshRenderer), _dec(_class = (_class2 = class Character extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor() {
          super(...arguments);
          this.isTarget = false;
          this.frontage = true;
          // true 是正面 false 是反面
          this.cornIndex = 1;
          // fals 没有寻找 目标  true 寻找目标状态
          this.isFindTarget = false;
          this.BehaviourType = BehaviourType.Idel;
          this.moveSpeed = 8;
          this.woodNum = 0;
          //木材
          this.cornNum = 0;

          //玉米
          _initializerDefineProperty(this, "axe", _descriptor, this);

          _initializerDefineProperty(this, "sickle", _descriptor2, this);

          _initializerDefineProperty(this, "chapeauMaterial", _descriptor3, this);

          _initializerDefineProperty(this, "bodyMaterial", _descriptor4, this);

          _initializerDefineProperty(this, "redyMaterial", _descriptor5, this);

          _initializerDefineProperty(this, "skinnedMeshRenderer", _descriptor6, this);

          //树的交付点
          this.handOverNode = null;
          // 玉米的交付点
          this.cornHandOverNode = null;
          this.curHanOverType = 0;
          //1 第一次交付树的  2 第二次交付 玉米的
          this.groundEffect = null;
          this.isAttack = false;
          this.woodParentBackpack = void 0;
          this.woodParentBackpack1 = void 0;
          this.initPos = new Vec3(0.017, 0.4, -0.225);
          this.woodNUm = 0;
          //收集树
          this.onlyCollectNum = 10;
        }

        //设置寻找目标
        setFindTarget(value) {
          this.isFindTarget = value;
        }

        getFindTarget() {
          return this.isFindTarget;
        }

        start() {
          this.idle();
          var woodParent = this.node.getChildByName("backpack");
          var woodParent1 = this.node.getChildByName("backpack1");
        }

        setBehaviour(state) {
          this.BehaviourType = state;
        }

        getBehaviour() {
          return this.BehaviourType;
        }

        nextTree() {
          (_crd && treeController === void 0 ? (_reportPossibleCrUseOftreeController({
            error: Error()
          }), treeController) : treeController).netxTree();
        }

        getHandOverPosNode() {
          return this.handOverNode;
        }

        getCornHandOverNode() {
          return this.cornHandOverNode;
        }

        shakeRed() {
          var houseMaterial = this.node.getChildByName("playerNode").getChildByName("player").getChildByName("Shimin").getComponent(SkinnedMeshRenderer); // let materials = houseMaterial.materials;
          //    materials[0] = this.redyMaterial;
          //    materials[1] = this.redyMaterial;
          //    houseMaterial.materials = materials

          tween(houseMaterial.node) // 定义要重复的动作序列：切换材质→等待→切回材质→等待
          .sequence( // 切换到目标材质
          tween().call(() => {
            houseMaterial.setMaterialInstance(this.redyMaterial, 0);
            houseMaterial.setMaterialInstance(this.redyMaterial, 1);
          }), // 等待 0.2 秒
          tween().delay(0.2), // 切回原材质
          tween().call(() => {
            houseMaterial.setMaterialInstance(this.chapeauMaterial, 0);
            houseMaterial.setMaterialInstance(this.bodyMaterial, 1);
          }), // 等待 0.2 秒（与切换时间对称）
          tween().delay(0.2)) // 重复整个序列 3 次
          .repeat(1) // 启动 tween
          .start();
        }

        collectWood(character) {
          var _this = this;

          return _asyncToGenerator(function* () {
            var prefab = yield (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
              error: Error()
            }), ResourceManager) : ResourceManager).instance.loadPrefab((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).woodPrefabPath);
            var woodParent = character.node.getChildByName("backpack"); //woodParent.setScale(new Vec3(0.8,0.8,0.8));

            for (var i = 0; i < _this.onlyCollectNum; i++) {
              _this.scheduleOnce(() => {
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).soundManager.playPickUpSound();
                var woodNode = instantiate(prefab);
                var originalScale = woodNode.scale.clone();
                var shrunkenScale = originalScale.clone().multiplyScalar(0.75);

                var pos = _this.initPos.clone();

                pos.y += 0.22 * character.woodNum;
                character.woodNum++;
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).playerBodyWood++;
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).playerBodyWoodAll++;

                if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).playerBodyWoodAll >= (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).treeHandOverNumLimit) {
                  (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                    error: Error()
                  }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                    error: Error()
                  }), EventType) : EventType).ENTITY_SHOW_TREEHANDE);
                }

                if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).upgradeUIAnimtion == 0 || (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).upgradeUIAnimtion == -1) {
                  (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).upgradeUIAnimtion = 1;
                }

                woodNode.setPosition(pos);
                woodNode.setRotationFromEuler(90, 90, 0);
                woodNode.parent = woodParent;
                tween(woodNode).to(0.1, {
                  scale: shrunkenScale
                }).to(0.1, {
                  scale: originalScale
                }).start();
              }, i * 0.05);
            }
          })();
        }

        collectWoodNew(character, num, target) {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            var prefab = yield (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
              error: Error()
            }), ResourceManager) : ResourceManager).instance.loadPrefab((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).woodPrefabPath);
            var woodParent = character.node.getChildByName("backpack");

            var _loop = function* _loop() {
              var woodNode = instantiate(prefab);
              var pos = woodParent.worldPosition.clone();
              pos.y += 0.32 * character.woodNum; // // 获取 woodParent 的世界矩阵
              // const worldMatrix = woodParent.worldMatrix;
              // // 使用 transformMat4 方法将局部坐标转换为世界坐标
              // const worldPos1 = pos.transformMat4(worldMatrix);

              character.woodNum++; // woodNode.setPosition(pos);

              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).playerBodyWood++;
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).playerBodyWoodAll++;

              if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).playerBodyWoodAll >= (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).treeHandOverNumLimit) {
                (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                  error: Error()
                }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                  error: Error()
                }), EventType) : EventType).ENTITY_SHOW_TREEHANDE);
              }

              woodNode.setRotationFromEuler(90, 90, 0);
              woodNode.parent = woodParent;

              _this2.randomizeItemsInBackpack1(target, woodNode);

              _this2.scheduleOnce(() => {
                _this2.restoreItemsInBackpack1(pos, woodNode, character);

                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).soundManager.playPickUpSound();
              }, i * 0.1);
            };

            for (var i = 0; i < num; i++) {
              yield* _loop();
            } //woodParent.setScale(new Vec3(0.8,0.8,0.8));
            // for (let i = 0; i < num; i++) {
            //     this.scheduleOnce(() => {
            //         Global.soundManager.playPickUpSound()
            //         let woodNode = instantiate(prefab);
            //         const originalScale = woodNode.scale.clone();
            //         const shrunkenScale = originalScale.clone().multiplyScalar(0.75);
            //         let pos = this.initPos.clone();
            //         pos.y += 0.22 * (character as Character).woodNum;
            //         (character as Character).woodNum++;
            //         Global.playerBodyWood++;
            //         Global.playerBodyWoodAll++;
            //         if(Global.playerBodyWoodAll >= Global.treeHandOverNumLimit){
            //             eventMgr.emit(EventType.ENTITY_SHOW_TREEHANDE);
            //         }
            //         if (Global.upgradeUIAnimtion == 0 || Global.upgradeUIAnimtion == -1) {
            //             Global.upgradeUIAnimtion = 1;
            //         }
            //         woodNode.setPosition(pos);
            //         woodNode.setRotationFromEuler(90, 90, 0);
            //         woodNode.parent = woodParent;
            //         tween(woodNode)
            //             .to(0.1, { scale: shrunkenScale })
            //             .to(0.1, { scale: originalScale })
            //             .start();
            //     }, i * 0.05);
            // }

          })();
        }

        randomizeItemsInBackpack1(target, woodNode) {
          if (!target || !target.node) {
            return;
          }

          var parentWorldPos = target.node.getWorldPosition(); // 生成相对于父节点的随机偏移量

          var relativeOffset;

          do {
            relativeOffset = new Vec3( // 缩小 x 轴随机范围至 -1 到 1
            Math.floor(Math.random() * 3) - 1, 0, // 缩小 z 轴随机范围至 -1 到 1
            Math.floor(Math.random() * 3) - 1);
          } while (relativeOffset.x === 0 && relativeOffset.z === 0); // 计算相对于父节点的目标位置


          var handOverPos = new Vec3(parentWorldPos.x + relativeOffset.x, parentWorldPos.y + relativeOffset.y, parentWorldPos.z + relativeOffset.z);
          var itemNode = woodNode;
          var itemWorldPos = itemNode.getWorldPosition().clone(); // 计算贝塞尔曲线控制点

          var LIFT_HEIGHT = 2;

          var randomLift = () => Math.floor(Math.random() * (LIFT_HEIGHT * 2 + 1)) - LIFT_HEIGHT;

          var controlPoint = new Vec3((itemNode.worldPosition.x + handOverPos.x) / 2 + randomLift(), (itemNode.worldPosition.y + handOverPos.y) / 2 + 6, (itemNode.worldPosition.z + handOverPos.z) / 2 + randomLift()); // 执行贝塞尔曲线动画

          tween(itemNode).to(0.1, {// scale: new Vec3(1, 1, 1)
          }, {
            easing: 'cubicInOut',
            onUpdate: (target, ratio) => {
              var position = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
                error: Error()
              }), MathUtil) : MathUtil).bezierCurve(itemWorldPos, controlPoint, handOverPos, ratio);
              target.worldPosition = position;
            }
          }).call(() => {// backpack.indexLength--;
            // this.randomizeItemsInBackpack(backpackIndex, count - 1);
          }).start();
        }

        restoreItemsInBackpack1(originalPos1, itemNode, character) {
          // 遍历所有物品，执行恢复动画
          var originalPos = originalPos1;
          if (!originalPos) return;
          var currentPos = itemNode.getWorldPosition().clone(); // 贝塞尔曲线控制点

          var controlPoint = new Vec3((currentPos.x + originalPos.x) / 2, (currentPos.y + originalPos.y) / 2 + 5, (currentPos.z + originalPos.z) / 2); // for(let i = 0 ;i <5;i++){
          //     this.scheduleOnce(()=>{
          //         Global.soundManager.playPickUpSound()
          //     },i*0.1)
          // }
          // Global.soundManager.playPickUpSound()

          tween(itemNode).to(0.3, {}, {
            easing: 'cubicInOut',
            onUpdate: (target, ratio) => {
              var woodParent = character.node.getChildByName("backpack");
              var newOriginalPos = new Vec3(woodParent.worldPosition.x, originalPos.y, woodParent.worldPosition.z);
              var position = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
                error: Error()
              }), MathUtil) : MathUtil).bezierCurve(currentPos, controlPoint, newOriginalPos, ratio);
              target.worldPosition = position;
            }
          }).start(); // 恢复完成后，重置indexLength
        } // randomizeItemsInBackpack(target, count: number = 1) {
        //     const backpack = target;
        //     const parentWorldPos = backpack.getWorldPosition();
        //     // 生成相对于父节点的随机偏移量
        //     let relativeOffset: Vec3;
        //     do {
        //         relativeOffset = new Vec3(
        //             Math.floor(Math.random() * 7) - 3, // -3 到 3
        //             -0.35,
        //             Math.floor(Math.random() * 7) - 3  // -3 到 3
        //         );
        //     } while (relativeOffset.x === 0 && relativeOffset.z === 0);
        //     // 计算相对于父节点的目标位置
        //     let handOverPos = new Vec3(
        //         parentWorldPos.x + relativeOffset.x,
        //         parentWorldPos.y + relativeOffset.y,
        //         parentWorldPos.z + relativeOffset.z
        //     );
        //     const itemNode = backpack.parentNode.children[backpack.indexLength];
        //     const itemWorldPos = itemNode.getWorldPosition().clone();
        //     // 计算贝塞尔曲线控制点
        //     const LIFT_HEIGHT = 2;
        //     const randomLift = () => Math.floor(Math.random() * (LIFT_HEIGHT * 2 + 1)) - LIFT_HEIGHT;
        //     const controlPoint = new Vec3(
        //         (itemNode.worldPosition.x + handOverPos.x) / 2 + randomLift(),
        //         (itemNode.worldPosition.y + handOverPos.y) / 2 + 6,
        //         (itemNode.worldPosition.z + handOverPos.z) / 2 + randomLift()
        //     );
        //     // 执行贝塞尔曲线动画
        //     tween(itemNode)
        //         .to(0.1, {
        //             // scale: new Vec3(1, 1, 1)
        //         }, {
        //             easing: 'cubicInOut',
        //             onUpdate: (target: Node, ratio: number) => {
        //                 const position = MathUtil.bezierCurve(
        //                     itemWorldPos,
        //                     controlPoint,
        //                     handOverPos,
        //                     ratio
        //                 );
        //                 target.worldPosition = position;
        //             }
        //         })
        //         .call(() => {
        //             // backpack.indexLength--;
        //             // this.randomizeItemsInBackpack(backpackIndex, count - 1);
        //         })
        //         .start();
        // }
        //收集玉米


        collectCorn(character) {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            var prefab = yield (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
              error: Error()
            }), ResourceManager) : ResourceManager).instance.loadPrefab((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).cornPrefabPath);
            var woodParent1 = character.node.getChildByName("backpack1"); //let woodParent = (character as Character).node.getChildByName("backpack");
            //  if (woodParent.children.length <= 0) {
            // let poss1 = woodParent1.position.clone()
            // let poss = woodParent.position.clone()
            // woodParent.setPosition(poss1)
            // woodParent1.setPosition(poss)
            //   }

            for (var i = 0; i < 4; i++) {
              _this3.scheduleOnce(() => {
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).soundManager.playPickUpSound();
                var woodNode = instantiate(prefab);
                var originalScale = woodNode.scale.clone();
                var shrunkenScale = originalScale.clone().multiplyScalar(0.75);

                var pos = _this3.initPos.clone();

                pos.y += 0.23 * character.cornNum;
                character.cornNum++;
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).playerBodyCornAll++;
                woodNode.setPosition(pos);
                woodNode.setRotationFromEuler(0, 90, 0);
                woodNode.parent = woodParent1;
                tween(woodNode).to(0.1, {
                  scale: shrunkenScale
                }).to(0.1, {
                  scale: originalScale
                }).start();
              }, i * 0.05);
            }
          })();
        } //开始移动 找树


        strtMoveTree() {
          this.target.setFindState(false);
          this.move(character => {
            this.cutTree();
          });
        } //开始移动到交付点


        strtMoveHandOver() {
          this.move(character => {
            character.target = null;
            this.handOver();
          });
        } // //到树地块的传送点
        // moveTransmit() {
        //     this.move((character: Entity) => {
        //         this.setFindTarget(false);
        //         this.BehaviourType = BehaviourType.Idel;
        //         this.idle();
        //     })
        // }
        //移动到玉米地块的位置


        moveCornPos() {
          this.move(character => {
            this.setFindTarget(false);
            this.BehaviourType = BehaviourType.CutCorn;
            this.idle();
          });
        } // //寻找怪物
        // findEnemy() {
        //     this.move((character: Entity) => {
        //         this.useSkill(()=>{
        //              eventMgr.emit(EventType.ENTITY_ENEMY_DIE,this);
        //         });
        //     })
        // }
        //寻找怪物


        findEnemyPos(enemy, enemyParentNode) {
          this.move(character => {
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).characterPosNum++;
            this.setFindTarget(false);
            this.BehaviourType = BehaviourType.Idel;
            this.idle();

            if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).characterPosNum >= 4) {
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).isUpgrade = true; //  enemyParentNode.active = true;
              // Global.warnUI.playWarnFadeAnimation();
            }
          });
        } //到达交付点


        findEnemyHandOver() {
          this.move(character => {
            this.cornHandOver();
          });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "axe", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sickle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "chapeauMaterial", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bodyMaterial", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "redyMaterial", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "skinnedMeshRenderer", [_dec7], {
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
//# sourceMappingURL=5354ec3b5ae6759c50b152171d1e90113d436018.js.map