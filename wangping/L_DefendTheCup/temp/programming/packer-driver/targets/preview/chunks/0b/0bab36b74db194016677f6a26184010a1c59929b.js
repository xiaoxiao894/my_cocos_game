System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Agent, Obstacle, RVOMath, KdTree, Simulator, _crd;

  function _reportPossibleCrUseOfAgent(extras) {
    _reporterNs.report("Agent", "./Agent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObstacle(extras) {
    _reporterNs.report("Obstacle", "./Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOMath(extras) {
    _reporterNs.report("RVOMath", "./Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector2", "./Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfKdTree(extras) {
    _reporterNs.report("KdTree", "./kdtree", _context.meta, extras);
  }

  _export("Simulator", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }, function (_unresolved_2) {
      Agent = _unresolved_2.Agent;
    }, function (_unresolved_3) {
      Obstacle = _unresolved_3.Obstacle;
      RVOMath = _unresolved_3.RVOMath;
    }, function (_unresolved_4) {
      KdTree = _unresolved_4.KdTree;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "75cc9/dH6FEGZPLYf/qJkdP", "Simulator", undefined);

      __checkObsolete__(['Vec2']);

      _export("Simulator", Simulator = class Simulator {
        constructor() {
          this.agentId = 0;
          this.agentIdLst = [];
          this.aid2agent = Object.create(null);
          this.obstacles = [];
          this.kdTree = new (_crd && KdTree === void 0 ? (_reportPossibleCrUseOfKdTree({
            error: Error()
          }), KdTree) : KdTree)();
          this.defaultAgent = void 0;
          // Agent
          this.time = 0.0;
        }

        static get instance() {
          if (!Simulator._inst) {
            Simulator._inst = new Simulator();
          }

          return Simulator._inst;
        }

        getAgent(idx) {
          return this.aid2agent[this.agentIdLst[idx]];
        }

        getAgentByAid(aid) {
          return this.aid2agent[aid];
        }

        getGlobalTime() {
          return this.time;
        }

        getNumAgents() {
          // console.log("getNumAgents ::", this.agentIdLst.length, this.agentIdLst)
          return this.agentIdLst.length;
        }

        getAgentAidByIdx(idx) {
          return this.agentIdLst[idx];
        }

        setAgentPrefVelocity(aid, velocity) {
          this.aid2agent[aid].prefVelocity_.copy(velocity);
        }

        getAgentPosition(aid) {
          if (this.aid2agent[aid]) {
            //为什么移除了 还会进入这个aid的检测
            return this.aid2agent[aid].position_;
          }

          return null;
        }

        getAgentPrefVelocity(aid) {
          return this.aid2agent[aid].prefVelocity_;
        }

        getAgentVelocity(aid) {
          return this.aid2agent[aid].velocity_;
        }

        getAgentRadius(aid) {
          return this.aid2agent[aid].radius_;
        }

        getAgentOrcaLines(aid) {
          return this.aid2agent[aid].orcaLines_;
        }
        /**
         * 添加动态避障管理对象
         * @param position 初始位置
         * @param radius  检测半径
         * @param maxSpeed  最大速度
         * @param velocity 初始线速度(向量)
         * @param mass 转向质量
         * @returns 
         */


        addAgent(position, radius, maxSpeed, velocity, mass) {
          if (radius === void 0) {
            radius = null;
          }

          if (maxSpeed === void 0) {
            maxSpeed = null;
          }

          if (velocity === void 0) {
            velocity = null;
          }

          if (mass === void 0) {
            mass = null;
          }

          if (!this.defaultAgent) {
            throw new Error("no default agent");
          }

          var agent = new (_crd && Agent === void 0 ? (_reportPossibleCrUseOfAgent({
            error: Error()
          }), Agent) : Agent)();
          agent.position_.copy(position);
          agent.maxNeighbors_ = this.defaultAgent.maxNeighbors_;
          agent.maxSpeed_ = maxSpeed || this.defaultAgent.maxSpeed_;
          agent.neighborDist = this.defaultAgent.neighborDist;
          agent.radius_ = radius || this.defaultAgent.radius_;
          agent.timeHorizon = this.defaultAgent.timeHorizon;
          agent.timeHorizonObst = this.defaultAgent.timeHorizonObst;
          agent.velocity_.copy(velocity || this.defaultAgent.velocity_);
          agent.id = this.agentId++;

          if (mass && mass >= 0) {
            agent.mass = mass;
          }

          this.aid2agent[agent.id] = agent;
          this.agentIdLst.push(agent.id);
          return agent.id;
        }

        removeAgent(aid) {
          if (this.hasAgent(aid)) {
            var idx = this.agentIdLst.indexOf(aid);

            if (idx >= 0) {
              // this.agentIdLst.splice(idx, 1) //用高效伪移除
              this.agentIdLst[idx] = this.agentIdLst[this.agentIdLst.length - 1];
              this.agentIdLst.length--;
            }

            delete this.aid2agent[aid];
          }
        }

        hasAgent(aid) {
          return !!this.aid2agent[aid];
        }

        setAgentMass(agentNo, mass) {
          this.aid2agent[agentNo].mass = mass;
        }

        getAgentMass(agentNo) {
          return this.aid2agent[agentNo].mass;
        }

        setAgentRadius(agentNo, radius) {
          this.aid2agent[agentNo].radius_ = radius;
        }
        /**
         * 
         * @param neighborDist 在寻找周围邻居的搜索距离，这个值设置过大，会让小球在很远距离时做出避障行为
         * @param maxNeighbors 寻找周围邻居的最大数目，这个值设置越大，最终计算的速度越精确，但会增大计算量
         * @param timeHorizon 代表计算动态的物体时的时间窗口
         * @param timeHorizonObst 代表计算静态的物体时的时间窗口，比如在RTS游戏中，小兵向城墙移动时，没必要做出避障，这个值需要 设置得很小
         * @param radius 代表计算ORCA时的小球的半径，这个值不一定与小球实际显示的半径一样，偏小有利于小球移动顺畅
         * @param maxSpeed 小球最大速度值
         * @param velocity 小球初始速度
         */


        setAgentDefaults(neighborDist, maxNeighbors, timeHorizon, timeHorizonObst, radius, maxSpeed, velocity) {
          if (!this.defaultAgent) {
            this.defaultAgent = new (_crd && Agent === void 0 ? (_reportPossibleCrUseOfAgent({
              error: Error()
            }), Agent) : Agent)();
          }

          this.defaultAgent.maxNeighbors_ = maxNeighbors;
          this.defaultAgent.maxSpeed_ = maxSpeed;
          this.defaultAgent.neighborDist = neighborDist;
          this.defaultAgent.radius_ = radius;
          this.defaultAgent.timeHorizon = timeHorizon;
          this.defaultAgent.timeHorizonObst = timeHorizonObst;
          this.defaultAgent.velocity_ = velocity;
        }

        run(dt) {
          this.kdTree.buildAgentTree(this.getNumAgents());
          var agentNum = this.agentIdLst.length;

          for (var i = 0; i < agentNum; i++) {
            this.aid2agent[this.agentIdLst[i]].computeNeighbors(this);
            this.aid2agent[this.agentIdLst[i]].computeNewVelocity(dt);
          }

          for (var _i = 0; _i < agentNum; _i++) {
            this.aid2agent[this.agentIdLst[_i]].update(dt);
          }

          this.time += dt;
        }

        addObstacle(vertices) {
          if (vertices.length < 2) {
            return -1;
          }

          var obstacleNo = this.obstacles.length;

          for (var i = 0; i < vertices.length; ++i) {
            var obstacle = new (_crd && Obstacle === void 0 ? (_reportPossibleCrUseOfObstacle({
              error: Error()
            }), Obstacle) : Obstacle)();
            obstacle.point = vertices[i];

            if (i != 0) {
              obstacle.previous = this.obstacles[this.obstacles.length - 1];
              obstacle.previous.next = obstacle;
            }

            if (i == vertices.length - 1) {
              obstacle.next = this.obstacles[obstacleNo];
              obstacle.next.previous = obstacle;
            }

            obstacle.direction = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).normalize(vertices[i == vertices.length - 1 ? 0 : i + 1].minus(vertices[i]));

            if (vertices.length == 2) {
              obstacle.convex = true;
            } else {
              obstacle.convex = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).leftOf(vertices[i == 0 ? vertices.length - 1 : i - 1], vertices[i], vertices[i == vertices.length - 1 ? 0 : i + 1]) >= 0;
            }

            obstacle.id = this.obstacles.length;
            this.obstacles.push(obstacle);
          }

          return obstacleNo;
        }

        processObstacles() {
          this.kdTree.buildObstacleTree();
        }

        queryVisibility(point1, point2, radius) {
          return this.kdTree.queryVisibility(point1, point2, radius);
        }

        getObstacles() {
          return this.obstacles;
        }

        clear() {
          this.agentIdLst.length = 0;
          this.agentId = 0;
          this.aid2agent = Object.create(null);
          this.defaultAgent = null;
          this.kdTree = new (_crd && KdTree === void 0 ? (_reportPossibleCrUseOfKdTree({
            error: Error()
          }), KdTree) : KdTree)();
          this.obstacles.length = 0;
        }

      });

      Simulator._inst = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0bab36b74db194016677f6a26184010a1c59929b.js.map