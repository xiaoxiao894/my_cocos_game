System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Vec3, BehaviourType, Character, ResourceManager, CharacterType, Global, enemyCharacter, goodsDrop, eventMgr, EventType, BubbleFead, _dec, _class, _class2, _crd, ccclass, PlayerController, playerController;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfBehaviourType(extras) {
    _reporterNs.report("BehaviourType", "../entitys/Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacter(extras) {
    _reporterNs.report("Character", "../entitys/Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "../core/ResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "../core/Global", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGroundEffct(extras) {
    _reporterNs.report("GroundEffct", "../GroundEffct", _context.meta, extras);
  }

  function _reportPossibleCrUseOfenemyCharacter(extras) {
    _reporterNs.report("enemyCharacter", "../entitys/enemyCharacter", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgoodsDrop(extras) {
    _reporterNs.report("goodsDrop", "../goodsDrop", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../core/EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBubbleFead(extras) {
    _reporterNs.report("BubbleFead", "../BubbleFead", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BehaviourType = _unresolved_2.BehaviourType;
      Character = _unresolved_2.Character;
    }, function (_unresolved_3) {
      ResourceManager = _unresolved_3.ResourceManager;
    }, function (_unresolved_4) {
      CharacterType = _unresolved_4.CharacterType;
    }, function (_unresolved_5) {
      Global = _unresolved_5.Global;
    }, function (_unresolved_6) {
      enemyCharacter = _unresolved_6.enemyCharacter;
    }, function (_unresolved_7) {
      goodsDrop = _unresolved_7.goodsDrop;
    }, function (_unresolved_8) {
      eventMgr = _unresolved_8.eventMgr;
    }, function (_unresolved_9) {
      EventType = _unresolved_9.EventType;
    }, function (_unresolved_10) {
      BubbleFead = _unresolved_10.BubbleFead;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "475e8C6qpNEEZoS0ifdMB3X", "PlayerController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'Vec3']);

      ({
        ccclass
      } = _decorator);

      _export("PlayerController", PlayerController = (_dec = ccclass('PlayerController'), _dec(_class = (_class2 = class PlayerController extends Component {
        constructor() {
          super(...arguments);
          this.parentNode = null;
          this.birthNodesPos = [];
          this.endNodesPos = [];
          this.cornNodesPos = [];
          this.enemyHandOverPos = [];
          this.allCharacterPos = [];
          this.enemySelfLanPos = [];
          this.enemyParentNode = null;
          this.curCharacter = null;
          this.curCharacterIndex = 1;
          this.curCharacterHandOverIndex = 1;
          this.enemyDieNum = 0;
          //@property({ type: [Character], tooltip: '角色列表' })
          this.characterList = [];
          this.characterListPos = [];
          //@property({ tooltip: '初始生命值' })
          this.hp = 3;
          // @property({ tooltip: '初始攻击力' })
          this.attack = 1;
        }

        static get Instance() {
          if (this._instance == null) {
            this._instance = new PlayerController();
          }

          return this._instance;
        }

        /**
         *  初始化角色 四个角色  
         *  id 从1 开始
         * 名字 player1 player2 player3 player4
         * 类型  玩家
         * @param parentNode 
         */
        initCharacters(parentNode, birthNodesPos, endNodesPos, cornNodesPos, enemyHandOverPos, allCharacterPos, enemySelfLanPos) {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (birthNodesPos) {
              _this.birthNodesPos = birthNodesPos;
            }

            if (endNodesPos) {
              _this.endNodesPos = endNodesPos;
            }

            if (cornNodesPos) {
              _this.cornNodesPos = cornNodesPos;
            }

            if (enemyHandOverPos) {
              _this.enemyHandOverPos = enemyHandOverPos;
            }

            if (allCharacterPos) {
              _this.allCharacterPos = allCharacterPos;
            }

            if (enemySelfLanPos) {
              _this.enemySelfLanPos = enemySelfLanPos;
            }

            _this.parentNode = parentNode;

            try {
              // 异步加载预制体
              var prefab = yield (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
                error: Error()
              }), ResourceManager) : ResourceManager).instance.loadPrefab((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).characterPrefabPath); // 初始化角色

              for (var i = 0; i < birthNodesPos.length; i++) {
                var characterNode = instantiate(prefab);
                var character = characterNode.getComponent(_crd && Character === void 0 ? (_reportPossibleCrUseOfCharacter({
                  error: Error()
                }), Character) : Character);
                character.handOverNode = parentNode.getChildByName("treeHandOver");
                character.cornHandOverNode = parentNode.getChildByName("cornHandOver");

                if (!character) {
                  console.error("\u89D2\u8272\u9884\u5236\u4F53\u7F3A\u5C11Character\u7EC4\u4EF6: " + (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).characterPrefabPath);
                  continue;
                } // 设置角色数据


                character.setData(String(i), // ID
                "player" + (i + 1), // 名称
                _this.hp, // 生命值
                _this.attack, // 攻击力
                (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
                  error: Error()
                }), CharacterType) : CharacterType).CHARACTER // 类型
                ); // 设置角色位置

                character.entitySetPosition(_this.birthNodesPos[i].position); // 添加到角色列表和场景

                _this.characterList.push(character);

                _this.parentNode.addChild(characterNode); // character.idle(character);
                // 触发角色初始化动画
                //character.playInitAnimation();

              }

              _this.createCharacter(prefab);

              console.log("\u6210\u529F\u521D\u59CB\u5316 " + _this.characterList.length + " \u4E2A\u89D2\u8272");
            } catch (error) {
              console.error("角色初始化失败:", error);
            }
          })();
        } // 人物移动


        squenceMove(target, behaviourType) {
          console.log("squenceMove == " + target.node.name, "===========>", target.node.position); // 记录初始索引，用于判断是否循环了一轮

          var initialIndex = this.curCharacterIndex;
          console.log("initialIndex == " + initialIndex);
          console.log("this.curCharacterIndex == " + this.curCharacterIndex); // 循环查找可用角色

          for (var i = 0; i < this.characterList.length; i++) {
            var characterIndex = (initialIndex + i) % this.characterList.length;
            var character = this.characterList[characterIndex]; // 找到未在寻找目标的角色

            if (!character.getFindTarget()) {
              console.log("initialIndex111111 == " + initialIndex); //console.log("this.curCharacterIndex1111111 == " + this.curCharacterIndex)

              this.curCharacterIndex = (characterIndex + 1) % this.characterList.length;
              character.setFindTarget(true);
              character.setBehaviour(behaviourType);
              character.target = target;
              character.moveTargetWorldPos = target.node.worldPosition.clone();
              character.strtMoveTree();
              console.log("initialIndex222222222 == " + this.curCharacterIndex);
              return; // 找到合适角色后退出函数
            }
          } // 如果循环结束后没有找到可用角色，则输出提示


          console.log("没有找到可用的角色");
        } //人物移动到交付点


        squenceHandOver(target, behaviourType) {
          for (var i = 0; i < this.characterListPos.length; i++) {
            var character = this.characterListPos[i];
            character.entitySetPosition(new Vec3(19.5, 0, 19.8));
            character.node.active = false;
          }

          console.log("initialIndex squenceHandOver == " + this.curCharacterIndex); // 记录初始索引，用于判断是否循环了一轮
          // const initialIndex = this.curCharacterHandOverIndex;
          // 循环查找可用角色

          for (var _i = 0; _i < this.characterList.length; _i++) {
            //const characterIndex = (initialIndex + i) % this.characterList.length;
            var _character = this.characterList[_i]; // 找到未在寻找目标的角色//!character.getFindTarget() &&

            if (_character.woodNum > 0) {
              _character.idle();

              _character.setFindTarget(false);

              _character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                error: Error()
              }), BehaviourType) : BehaviourType).Idel); // this.scheduleOnce(() => {


              _character.setFindTarget(true);

              _character.curHanOverType = 1;

              _character.setBehaviour(behaviourType);

              _character.target = this.birthNodesPos[Number(_character.getId())];
              _character.moveTargetWorldPos = _character.target.worldPosition.clone();

              _character.strtMoveHandOver(); // }, 0.1)


              console.log("initialIndex squenceHandOver 1111111== " + this.curCharacterIndex); //return; // 找到合适角色后退出函数
            }
          }
        } // 到达传送点
        // moveTransmitPos() {
        //     for (let i = 0; i < this.characterList.length; i++) {
        //         const character = this.characterList[i];
        //         // 找到未在寻找目标的角色
        //         character.setFindTarget(true);
        //         character.setBehaviour(BehaviourType.Transmit);
        //         character.target = this.endNodesPos[Number(character.getId())];
        //         character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
        //         character.moveTransmit();
        //     }
        // }
        // 到达收割玉米点


        moveCornPos() {
          var _this2 = this;

          var fun = character => {
            character.idle();
            character.setFindTarget(false);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).Idel); // 找到未在寻找目标的角色

            character.setFindTarget(true);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).ConrPost);
            character.target = this.cornNodesPos[Number(character.getId())];
            character.moveTargetWorldPos = character.target.worldPosition.clone();
            character.moveCornPos();
          };

          var _loop = function _loop() {
            var character = _this2.characterList[i];

            if (character.getBehaviour() == (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).CutTree) {
              _this2.scheduleOnce(() => {
                fun(character);
              }, 2);
            } else {
              fun(character);
            }
          };

          for (var i = 0; i < this.characterList.length; i++) {
            _loop();
          }
        } // // 寻找怪物的位置
        // moveFindEnemyPos(enemyParent: Node) {
        //     enemyParent.active = true;
        //     let enemyParentNode = enemyParent;
        //     for (let i = 0; i < this.characterList.length; i++) {
        //         const character = this.characterList[i];
        //         // 寻找目标的角色
        //         character.setFindTarget(true);
        //         character.setBehaviour(BehaviourType.FindEnemy);
        //         let enemy = enemyParentNode.getChildByName("enmey_" + character.getId());
        //         character.target = enemy.getComponent(enemyCharacter);
        //         // character.getComponent(goodsDrop).initGoods();
        //         character.moveTargetWorldPos = (character.target as enemyCharacter).node.worldPosition.clone();
        //         character.findEnemy();
        //         //敌人 寻找人物
        //         let enemyScrpt = enemy.getComponent(enemyCharacter);
        //         enemyScrpt.target = character
        //         enemyScrpt.moveTargetWorldPos = character.node.worldPosition.clone();
        //         enemyScrpt.isFindCharacter = true;
        //     }
        // }
        // 寻找怪物地块自己站的位置


        moveFindEnemyLandPos(enemyParent) {
          // enemyParent.active = true;
          // let enemyParentNode = enemyParent;
          for (var i = 0; i < this.characterList.length; i++) {
            var character = this.characterList[i];
            character.target = null;
            character.moveTargetWorldPos = null; // 寻找目标的角色

            character.setFindTarget(true);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).FindLandPos);
            character.target = this.enemySelfLanPos[Number(character.getId())];
            character.moveTargetWorldPos = character.target.worldPosition.clone();
            var enemyParentNode = enemyParent;
            var enemy = enemyParentNode.getChildByName("SangshiPrefab_" + character.getId());
            var enemyScrpt = enemy.getComponent(_crd && enemyCharacter === void 0 ? (_reportPossibleCrUseOfenemyCharacter({
              error: Error()
            }), enemyCharacter) : enemyCharacter);
            character.findEnemyPos(enemyScrpt, enemyParentNode); //character.findEnemy();
            //敌人 寻找人物

            enemyScrpt.target = character;
            enemyScrpt.moveTargetWorldPos = character.node.worldPosition.clone();
            enemyScrpt.isFindCharacter = true;
          }
        } //攻击敌人


        attackEnemy(cahracter, enemy) {
          if (cahracter.getMachineName() == "attack") {
            return;
          }

          if (enemy.hp <= 0) {
            return;
          }

          cahracter.target = enemy;
          cahracter.setFindTarget(true);
          cahracter.useSkill(() => {// this.enemyDieNum++;
            // if (this.enemyDieNum >= 4) {
            //     eventMgr.emit(EventType.ENTITY_ENEMY_DIE, this);
            // }
          }); //敌人全部四万
        } // 寻找敌人交付点位置


        moveFindEnemHandOver() {
          var _this3 = this;

          var fun = character => {
            character.idle();
            character.setFindTarget(false);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).Idel); // 找到未在寻找目标的角色

            character.setFindTarget(true);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).EnemyHnadOverPos);
            character.target = this.enemyHandOverPos[Number(character.getId())];
            character.moveTargetWorldPos = character.target.worldPosition.clone();
            character.findEnemyHandOver();
          };

          var _loop2 = function _loop2() {
            var character = _this3.characterList[i];

            if (character.getBehaviour() == (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).CutTree) {
              _this3.scheduleOnce(() => {
                fun(character);
              }, 2);
            } else {
              fun(character);
            }
          };

          for (var i = 0; i < this.characterList.length; i++) {
            _loop2();
          } // //let enemyParentNode = enemyParent;
          // for (let i = 0; i < this.characterList.length; i++) {
          //     const character = this.characterList[i];
          //     // 寻找目标的角色
          //     character.setFindTarget(true);
          //     character.setBehaviour(BehaviourType.EnemyHnadOverPos);
          //     character.target = this.enemyHandOverPos[Number(character.getId())];
          //     character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
          //     character.findEnemyHandOver();
          // }

        } //重置人物状态


        resetState() {
          for (var i = 0; i < this.characterList.length; i++) {
            var character = this.characterList[i]; // 找到未在寻找目标的角色

            character.woodNum = 0;
            character.node.getChildByName("backpack").removeAllChildren();
            character.setFindTarget(false);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).Idel); // character.target = this.endNodesPos[Number(character.getId())];
            // character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();

            character.idle();
          }
        } //只重置人物行为状态 和可操作


        resetBehaviour() {
          for (var i = 0; i < this.characterList.length; i++) {
            var character = this.characterList[i];
            character.setFindTarget(false);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).Idel); // character.target = this.endNodesPos[Number(character.getId())];
            // character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();

            character.idle();
          }
        }

        allCharacterHanover() {
          var num = 0;

          for (var i = 0; i < this.characterList.length; i++) {
            var character = this.characterList[i];
            character.setFindTarget(false);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).Idel);
            character.getComponent(_crd && goodsDrop === void 0 ? (_reportPossibleCrUseOfgoodsDrop({
              error: Error()
            }), goodsDrop) : goodsDrop).restoreItemsInAllBackpacks();
            num++; // character.target = this.endNodesPos[Number(character.getId())];
            // character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
            //character.idle()
          }

          if (num >= 4) {
            (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
              error: Error()
            }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).ENTITY_ENEMY_DIE, this);
          }
        } // 开始收割玉米


        cutCornController(selfNode, groundEffect) {
          var _arrowIds$selfNode$na;

          var arrowIds = {
            'Arrow1': 0,
            'Arrow2': 1,
            'Arrow3': 2,
            'Arrow4': 3
          };
          var id = (_arrowIds$selfNode$na = arrowIds[selfNode.name]) != null ? _arrowIds$selfNode$na : -1; // 默认值设为-1表示未匹配

          var character = this.characterList[id];

          if (character.getFindTarget()) {
            console.log("在收割玉米的状态");
            return;
          } else {
            //渐变消失效果
            if (selfNode.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
              error: Error()
            }), BubbleFead) : BubbleFead)) {
              selfNode.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                error: Error()
              }), BubbleFead) : BubbleFead).hideFead();
            }

            character.groundEffect = groundEffect;
            character.setFindTarget(true);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).CutCorn);
            character.cutCorn(() => {});
          }
        } // // 开始寻找怪物
        // findEnemyPos() {
        //     for (let i = 0; i < this.characterList.length; i++) {
        //         const character = this.characterList[i];
        //         // 找到未在寻找目标的角色
        //         character.setFindTarget(true);
        //         character.setBehaviour(BehaviourType.Transmit);
        //         character.target = this.endNodesPos[Number(character.getId())];
        //         character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();
        //         character.moveTransmit();
        //     }
        // }
        //人物不可在操作


        lockState() {
          for (var i = 0; i < this.characterList.length; i++) {
            var character = this.characterList[i]; // 找到未在寻找目标的角色

            character.woodNum = 0;
            character.cornNum = 0;
            character.node.getChildByName("backpack").removeAllChildren();
            character.node.getChildByName("backpack1").removeAllChildren();
            character.setFindTarget(true);
            character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).Idel); // character.target = this.endNodesPos[Number(character.getId())];
            // character.moveTargetWorldPos = (character.target as Node).worldPosition.clone();

            character.idle();
          }
        }

        GameHandOverComplate() {
          var _this4 = this;

          this.lockState();
          var index = 0; //操作的四个人位置

          for (var i = 0; i < this.characterList.length; i++) {
            var character = this.characterList[i];
            character.moveTargetWorldPos = this.allCharacterPos[index].worldPosition.clone();
            index++;
            character.move(character => {
              character.setFindTarget(true);
              character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                error: Error()
              }), BehaviourType) : BehaviourType).Idel);
              character.idle();
            });
          } //


          var _loop3 = function _loop3(_i2) {
            _this4.scheduleOnce(() => {
              var character = _this4.characterListPos[_i2];
              character.node.active = true;
              character.moveTargetWorldPos = _this4.allCharacterPos[index - 1].worldPosition.clone();
              index++;
              character.move(character => {
                character.setFindTarget(true);
                character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                  error: Error()
                }), BehaviourType) : BehaviourType).Idel);
                character.idle();
              });
            }, _i2 * 0.2); // const character =  this.parentNode.children[i].getComponent(Character)
            // character.move()

          };

          for (var _i2 = 0; _i2 < this.characterListPos.length; _i2++) {
            _loop3(_i2);
          }
        }

        createCharacter(prefab1) {
          var prefab = prefab1; // 初始化角色

          for (var i = 0; i < 8; i++) {
            var characterNode = instantiate(prefab);
            var character = characterNode.getComponent(_crd && Character === void 0 ? (_reportPossibleCrUseOfCharacter({
              error: Error()
            }), Character) : Character);

            if (!character) {
              console.error("\u89D2\u8272\u9884\u5236\u4F53\u7F3A\u5C11Character\u7EC4\u4EF6: " + (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).characterPrefabPath);
              continue;
            } // 设置角色数据


            character.setData(String(4 + i), // ID
            "player" + (i + 1 + 4), // 名称
            this.hp, // 生命值
            this.attack, // 攻击力
            (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
              error: Error()
            }), CharacterType) : CharacterType).CHARACTER // 类型
            ); // 设置角色位置

            character.entitySetPosition(new Vec3(24, 0, 180));
            this.characterListPos.push(character);
            this.parentNode.addChild(characterNode);
          }
        } // 获取角色列表


        getCharacters() {
          return this.characterList;
        } // 根据ID获取角色


        getCharacterById(id) {
          return this.characterList.find(character => character.getId() === id) || null;
        } // 清理所有角色


        clearCharacters() {
          this.characterList.forEach(character => {
            if (character.node && character.node.isValid) {
              character.node.destroy();
            }
          });
          this.characterList = [];
        }

      }, _class2._instance = null, _class2)) || _class)); // 导出全局单例


      _export("playerController", playerController = PlayerController.Instance);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a3a24eb5d7869b5e0250a2f7869ea4949fbebab6.js.map