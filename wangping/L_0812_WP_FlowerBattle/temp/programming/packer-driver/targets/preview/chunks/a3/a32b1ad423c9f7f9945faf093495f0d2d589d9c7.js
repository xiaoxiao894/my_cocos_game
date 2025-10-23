System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, resources, _dec, _class, _class2, _crd, ccclass, DataManager;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfCharacterDataJson(extras) {
    _reporterNs.report("CharacterDataJson", "./CharacterDataJson", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterData(extras) {
    _reporterNs.report("MonsterData", "./MonsterData", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      resources = _cc.resources;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2fb728aKutEK4RloRDMHAkn", "DataManager", undefined);

      __checkObsolete__(['_decorator', 'resources']);

      // 注意这里修正了导入路径的拼写错误
      ({
        ccclass
      } = _decorator); // 数据缓存接口

      _export("DataManager", DataManager = (_dec = ccclass('DataManager'), _dec(_class = (_class2 = class DataManager {
        constructor() {
          // 数据缓存
          this.dataCache = {
            monsters: new Map(),
            characters: new Map()
          };
        }

        static get Instance() {
          if (!this._instance) {
            this._instance = new DataManager();
          }

          return this._instance;
        }

        // 初始化所有数据
        init() {
          var _this = this;

          return _asyncToGenerator(function* () {
            try {
              yield Promise.all([_this.loadMonsterData(), _this.loadCharacterData()]);
              console.log('所有数据加载完成');
              return true;
            } catch (error) {
              console.error('数据加载失败:', error);
              return false;
            }
          })();
        } // 加载怪物数据


        loadMonsterData() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            return new Promise((resolve, reject) => {
              resources.load('config/monsters', (err, asset) => {
                if (err) {
                  reject(err);
                  return;
                }

                var jsonData = asset instanceof Object && 'json' in asset ? asset.json : asset;
                var ss = asset;
                console.log(jsonData);

                if (jsonData && Array.isArray(jsonData)) {
                  jsonData.forEach(data => {
                    _this2.dataCache.monsters.set(data.id, data);
                  });
                  console.log("\u5DF2\u52A0\u8F7D\u602A\u7269\u6570\u636E: " + _this2.dataCache.monsters.size + " \u6761");
                  resolve();
                } else {
                  reject(new Error('怪物数据格式不正确'));
                }
              });
            });
          })();
        } // 加载人物数据


        loadCharacterData() {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            return new Promise((resolve, reject) => {
              resources.load('config/characters', (err, asset) => {
                if (err) {
                  reject(err);
                  return;
                }

                var jsonData = asset instanceof Object && 'json' in asset ? asset.json : asset;
                var ss = asset;
                console.log(jsonData);

                if (jsonData && Array.isArray(jsonData)) {
                  jsonData.forEach(data => {
                    _this3.dataCache.characters.set(data.id, data);
                  });
                  console.log("\u5DF2\u52A0\u8F7D\u4EBA\u7269\u6570\u636E: " + _this3.dataCache.characters.size + " \u6761");
                  resolve();
                } else {
                  reject(new Error('人物数据格式不正确'));
                }
              });
            });
          })();
        } // 获取怪物数据


        getMonsterById(id) {
          return this.dataCache.monsters.get(id) || null;
        } // 获取所有怪物数据


        getAllMonsters() {
          return Array.from(this.dataCache.monsters.values());
        } // 获取人物数据


        getCharacterById(id) {
          return this.dataCache.characters.get(id) || null;
        } // 获取所有人物数据


        getAllCharacters() {
          return Array.from(this.dataCache.characters.values());
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a32b1ad423c9f7f9945faf093495f0d2d589d9c7.js.map