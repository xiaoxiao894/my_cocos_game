System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, EventManager, _crd, eventMgr;

  _export("EventManager", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5e21dR9bTxLUL8+N1+ljG8T", "EventManager", undefined); // assets/scripts/framework/EventManager.ts


      /**
       * Cocos Creator 3.8.0 事件管理系统
       * 功能：
       * 1. 全局事件监听与派发
       * 2. 自动清理绑定
       * 3. 一次性事件监听
       */
      _export("EventManager", EventManager = class EventManager {
        constructor() {
          this._eventMap = new Map();
        }

        /**
         * 获取单例
         */
        static get instance() {
          if (!this._instance) {
            this._instance = new EventManager();
          }

          return this._instance;
        }
        /**
         * 监听事件
         * @param eventName 事件名称
         * @param callback 回调函数
         * @param target 绑定对象(用于自动移除监听)
         */


        on(eventName, callback, target) {
          if (!this._eventMap.has(eventName)) {
            this._eventMap.set(eventName, []);
          }

          this._eventMap.get(eventName).push({
            callback: callback,
            target: target
          });
        }
        /**
         * 一次性监听
         * @param eventName 事件名称
         * @param callback 回调函数
         * @param target 绑定对象
         */


        once(eventName, callback, target) {
          var _this = this;

          var wrapper = function wrapper() {
            _this.off(eventName, wrapper, target);

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            callback.apply(target, args);
          };

          this.on(eventName, wrapper, target);
        }
        /**
         * 取消监听
         * @param eventName 事件名称
         * @param callback 回调函数
         * @param target 绑定对象
         */


        off(eventName, callback, target) {
          if (!this._eventMap.has(eventName)) {
            return;
          }

          var listeners = this._eventMap.get(eventName); // 如果没有指定callback，移除该事件所有监听


          if (!callback) {
            listeners.length = 0;
            return;
          } // 移除指定监听


          for (var i = listeners.length - 1; i >= 0; i--) {
            var listener = listeners[i];

            if ((!callback || listener.callback === callback) && (!target || listener.target === target)) {
              listeners.splice(i, 1);
            }
          }
        }
        /**
         * 派发事件
         * @param eventName 事件名称
         * @param args 事件参数
         */


        emit(eventName) {
          if (!this._eventMap.has(eventName)) {
            return;
          }

          var listeners = this._eventMap.get(eventName).slice(); // 创建副本以防回调中修改原数组


          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          for (var listener of listeners) {
            try {
              listener.callback.apply(listener.target, args);
            } catch (e) {
              console.error("EventManager emit error: " + eventName, e);
            }
          }
        }
        /**
         * 移除对象所有事件监听
         * @param target 要移除的对象
         */


        removeAll(target) {
          this._eventMap.forEach((listeners, eventName) => {
            this.off(eventName, null, target);
          });
        }

      }); // 导出全局单例


      EventManager._instance = null;

      _export("eventMgr", eventMgr = EventManager.instance);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b16e8eb50e6f8f103717552749eaa6a9f2351ce1.js.map