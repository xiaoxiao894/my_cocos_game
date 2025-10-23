System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, RVOMath, Obstacle, Simulator, FloatPair, AgentTreeNode, ObstacleTreeNode, KdTree, _crd;

  function _reportPossibleCrUseOfRVOMath(extras) {
    _reporterNs.report("RVOMath", "./Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObstacle(extras) {
    _reporterNs.report("Obstacle", "./Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector2", "./Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "./Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAgent(extras) {
    _reporterNs.report("Agent", "./Agent", _context.meta, extras);
  }

  _export("KdTree", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      RVOMath = _unresolved_2.RVOMath;
      Obstacle = _unresolved_2.Obstacle;
    }, function (_unresolved_3) {
      Simulator = _unresolved_3.Simulator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a7ee442uqxHILoPf3eaf9Mo", "kdtree", undefined);

      FloatPair = class FloatPair {
        constructor(a, b) {
          this.a = void 0;
          this.b = void 0;
          this.a = a;
          this.b = b;
        }

        lessThan(rhs) {
          return this.a < rhs.a || !(rhs.a < this.a) && this.b < rhs.b;
        }

        lessEqualThan(rhs) {
          return this.a == rhs.a && this.b == rhs.b || this.lessThan(rhs);
        }

        bigThan(rhs) {
          return !this.lessEqualThan(rhs);
        }

        bigEqualThan(rhs) {
          return !this.lessThan(rhs);
        }

      };
      AgentTreeNode = class AgentTreeNode {
        constructor() {
          this.begin = void 0;
          this.end = void 0;
          this.left = void 0;
          this.right = void 0;
          this.maxX = void 0;
          this.maxY = void 0;
          this.minX = void 0;
          this.minY = void 0;
        }

      };
      ObstacleTreeNode = class ObstacleTreeNode {
        constructor() {
          this.obstacle = void 0;
          this.left = void 0;
          this.right = void 0;
        }

      };

      _export("KdTree", KdTree = class KdTree {
        constructor() {
          /**
           * The maximum size of an agent k-D tree leaf.
           */
          this.MAX_LEAF_SIZE = 10;
          this.agents = null;
          this.agentTree = [];
          this.obstacleTree = null;
        }

        buildAgentTree(agentNum) {
          if (!this.agents || this.agents.length != agentNum) {
            this.agents = new Array(agentNum);

            for (let i = 0; i < this.agents.length; i++) {
              this.agents[i] = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.getAgent(i);
            }

            this.agentTree = new Array(2 * this.agents.length);

            for (let i = 0; i < this.agentTree.length; i++) {
              this.agentTree[i] = new AgentTreeNode();
            }
          }

          if (this.agents.length != 0) {
            this.buildAgentTreeRecursive(0, this.agents.length, 0);
          }
        }

        buildObstacleTree() {
          this.obstacleTree = new ObstacleTreeNode();
          let obstacles = new Array((_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.obstacles.length);

          for (let i = 0; i < obstacles.length; i++) {
            obstacles[i] = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.obstacles[i];
          }

          this.obstacleTree = this.buildObstacleTreeRecursive(obstacles);
        }

        computeAgentNeighbors(agent, rangeSq) {
          return this.queryAgentTreeRecursive(agent, rangeSq, 0);
        }

        computeObstacleNeighbors(agent, rangeSq) {
          this.queryObstacleTreeRecursive(agent, rangeSq, this.obstacleTree);
        }

        queryVisibility(q1, q2, radius) {
          return this.queryVisibilityRecursive(q1, q2, radius, this.obstacleTree);
        }

        buildAgentTreeRecursive(begin, end, node) {
          this.agentTree[node].begin = begin;
          this.agentTree[node].end = end;
          this.agentTree[node].minX = this.agentTree[node].maxX = this.agents[begin].position_.x;
          this.agentTree[node].minY = this.agentTree[node].maxY = this.agents[begin].position_.y;

          for (let i = begin + 1; i < end; ++i) {
            this.agentTree[node].maxX = Math.max(this.agentTree[node].maxX, this.agents[i].position_.x);
            this.agentTree[node].minX = Math.min(this.agentTree[node].minX, this.agents[i].position_.x);
            this.agentTree[node].maxY = Math.max(this.agentTree[node].maxY, this.agents[i].position_.y);
            this.agentTree[node].minY = Math.min(this.agentTree[node].minY, this.agents[i].position_.y);
          }

          if (end - begin > this.MAX_LEAF_SIZE) {
            // no leaf node
            let isVertical = this.agentTree[node].maxX - this.agentTree[node].minX > this.agentTree[node].maxY - this.agentTree[node].minY;
            let splitValue = 0.5 * (isVertical ? this.agentTree[node].maxX + this.agentTree[node].minX : this.agentTree[node].maxY + this.agentTree[node].minY);
            let left = begin;
            let right = end;

            while (left < right) {
              while (left < right && (isVertical ? this.agents[left].position_.x : this.agents[left].position_.y) < splitValue) {
                ++left;
              }

              while (right > left && (isVertical ? this.agents[right - 1].position_.x : this.agents[right - 1].position_.y) >= splitValue) {
                --right;
              }

              if (left < right) {
                let tmp = this.agents[left];
                this.agents[left] = this.agents[right - 1];
                this.agents[right - 1] = tmp;
                ++left;
                --right;
              }
            }

            let leftSize = left - begin;

            if (leftSize == 0) {
              ++leftSize;
              ++left;
              ++right;
            }

            this.agentTree[node].left = node + 1;
            this.agentTree[node].right = node + 2 * leftSize;
            this.buildAgentTreeRecursive(begin, left, this.agentTree[node].left);
            this.buildAgentTreeRecursive(left, end, this.agentTree[node].right);
          }
        }

        buildObstacleTreeRecursive(obstacles) {
          if (obstacles.length == 0) {
            return null;
          } else {
            let node = new ObstacleTreeNode();
            let optimalSplit = 0;
            let minLeft = obstacles.length;
            let minRight = minLeft;

            for (let i = 0; i < obstacles.length; ++i) {
              let leftSize = 0;
              let rightSize = 0;
              let obstacleI1 = obstacles[i];
              let obstacleI2 = obstacleI1.next;

              for (let j = 0; j < obstacles.length; j++) {
                if (i == j) {
                  continue;
                }

                let obstacleJ1 = obstacles[j];
                let obstacleJ2 = obstacleJ1.next;
                let j1LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point);
                let j2LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).leftOf(obstacleI1.point, obstacleI2.point, obstacleJ2.point);

                if (j1LeftOfI >= -(_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON && j2LeftOfI >= -(_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON) {
                  ++leftSize;
                } else if (j1LeftOfI <= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON && j2LeftOfI <= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON) {
                  ++rightSize;
                } else {
                  ++leftSize;
                  ++rightSize;
                }

                let fp1 = new FloatPair(Math.max(leftSize, rightSize), Math.min(leftSize, rightSize));
                let fp2 = new FloatPair(Math.max(minLeft, minRight), Math.min(minLeft, minRight));

                if (fp1.bigEqualThan(fp2)) {
                  break;
                }
              }

              let fp1 = new FloatPair(Math.max(leftSize, rightSize), Math.min(leftSize, rightSize));
              let fp2 = new FloatPair(Math.max(minLeft, minRight), Math.min(minLeft, minRight));

              if (fp1.lessThan(fp2)) {
                minLeft = leftSize;
                minRight = rightSize;
                optimalSplit = i;
              }
            }

            {
              /* Build split node. */
              let leftObstacles = [];

              for (let n = 0; n < minLeft; ++n) leftObstacles.push(null);

              let rightObstacles = [];

              for (let n = 0; n < minRight; ++n) rightObstacles.push(null);

              let leftCounter = 0;
              let rightCounter = 0;
              let i = optimalSplit;
              let obstacleI1 = obstacles[i];
              let obstacleI2 = obstacleI1.next;

              for (let j = 0; j < obstacles.length; ++j) {
                if (i == j) {
                  continue;
                }

                let obstacleJ1 = obstacles[j];
                let obstacleJ2 = obstacleJ1.next;
                let j1LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point);
                let j2LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).leftOf(obstacleI1.point, obstacleI2.point, obstacleJ2.point);

                if (j1LeftOfI >= -(_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON && j2LeftOfI >= -(_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON) {
                  leftObstacles[leftCounter++] = obstacles[j];
                } else if (j1LeftOfI <= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON && j2LeftOfI <= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON) {
                  rightObstacles[rightCounter++] = obstacles[j];
                } else {
                  /* Split obstacle j. */
                  let t = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                    error: Error()
                  }), RVOMath) : RVOMath).det(obstacleI2.point.minus(obstacleI1.point), obstacleJ1.point.minus(obstacleI1.point)) / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                    error: Error()
                  }), RVOMath) : RVOMath).det(obstacleI2.point.minus(obstacleI1.point), obstacleJ1.point.minus(obstacleJ2.point));
                  let splitpoint = obstacleJ1.point.plus(obstacleJ2.point.minus(obstacleJ1.point).scale(t));
                  let newObstacle = new (_crd && Obstacle === void 0 ? (_reportPossibleCrUseOfObstacle({
                    error: Error()
                  }), Obstacle) : Obstacle)();
                  newObstacle.point = splitpoint;
                  newObstacle.previous = obstacleJ1;
                  newObstacle.next = obstacleJ2;
                  newObstacle.convex = true;
                  newObstacle.direction = obstacleJ1.direction;
                  newObstacle.id = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                    error: Error()
                  }), Simulator) : Simulator).instance.obstacles.length;
                  (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                    error: Error()
                  }), Simulator) : Simulator).instance.obstacles.push(newObstacle);
                  obstacleJ1.next = newObstacle;
                  obstacleJ2.previous = newObstacle;

                  if (j1LeftOfI > 0.0) {
                    leftObstacles[leftCounter++] = obstacleJ1;
                    rightObstacles[rightCounter++] = newObstacle;
                  } else {
                    rightObstacles[rightCounter++] = obstacleJ1;
                    leftObstacles[leftCounter++] = newObstacle;
                  }
                }
              }

              node.obstacle = obstacleI1;
              node.left = this.buildObstacleTreeRecursive(leftObstacles);
              node.right = this.buildObstacleTreeRecursive(rightObstacles);
              return node;
            }
          }
        }

        queryAgentTreeRecursive(agent, rangeSq, node) {
          if (this.agentTree[node].end - this.agentTree[node].begin <= this.MAX_LEAF_SIZE) {
            for (let i = this.agentTree[node].begin; i < this.agentTree[node].end; ++i) {
              rangeSq = agent.insertAgentNeighbor(this.agents[i], rangeSq);
            }
          } else {
            let distSqLeft = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, this.agentTree[this.agentTree[node].left].minX - agent.position_.x)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, agent.position_.x - this.agentTree[this.agentTree[node].left].maxX)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, this.agentTree[this.agentTree[node].left].minY - agent.position_.y)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, agent.position_.y - this.agentTree[this.agentTree[node].left].maxY));
            let distSqRight = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, this.agentTree[this.agentTree[node].right].minX - agent.position_.x)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, agent.position_.x - this.agentTree[this.agentTree[node].right].maxX)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, this.agentTree[this.agentTree[node].right].minY - agent.position_.y)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, agent.position_.y - this.agentTree[this.agentTree[node].right].maxY));

            if (distSqLeft < distSqRight) {
              if (distSqLeft < rangeSq) {
                rangeSq = this.queryAgentTreeRecursive(agent, rangeSq, this.agentTree[node].left);

                if (distSqRight < rangeSq) {
                  rangeSq = this.queryAgentTreeRecursive(agent, rangeSq, this.agentTree[node].right);
                }
              }
            } else {
              if (distSqRight < rangeSq) {
                rangeSq = this.queryAgentTreeRecursive(agent, rangeSq, this.agentTree[node].right);

                if (distSqLeft < rangeSq) {
                  rangeSq = this.queryAgentTreeRecursive(agent, rangeSq, this.agentTree[node].left);
                }
              }
            }
          }

          return rangeSq;
        } // pass ref range


        queryObstacleTreeRecursive(agent, rangeSq, node) {
          if (node == null) {
            return rangeSq;
          } else {
            let obstacle1 = node.obstacle;
            let obstacle2 = obstacle1.next;
            let agentLeftOfLine = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).leftOf(obstacle1.point, obstacle2.point, agent.position_);
            rangeSq = this.queryObstacleTreeRecursive(agent, rangeSq, agentLeftOfLine >= 0 ? node.left : node.right);
            let distSqLine = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(agentLeftOfLine) / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(obstacle2.point.minus(obstacle1.point));

            if (distSqLine < rangeSq) {
              if (agentLeftOfLine < 0) {
                /*
                 * Try obstacle at this node only if is on right side of
                 * obstacle (and can see obstacle).
                 */
                agent.insertObstacleNeighbor(node.obstacle, rangeSq);
              }
              /* Try other side of line. */


              this.queryObstacleTreeRecursive(agent, rangeSq, agentLeftOfLine >= 0 ? node.right : node.left);
            }

            return rangeSq;
          }
        }

        queryVisibilityRecursive(q1, q2, radius, node) {
          if (node == null) {
            return true;
          } else {
            let obstacle1 = node.obstacle;
            let obstacle2 = obstacle1.next;
            let q1LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).leftOf(obstacle1.point, obstacle2.point, q1);
            let q2LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).leftOf(obstacle1.point, obstacle2.point, q2);
            let invLengthI = 1.0 / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(obstacle2.point.minus(obstacle1.point));

            if (q1LeftOfI >= 0 && q2LeftOfI >= 0) {
              return this.queryVisibilityRecursive(q1, q2, radius, node.left) && ((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(q1LeftOfI) * invLengthI >= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(radius) && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(q2LeftOfI) * invLengthI >= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(radius) || this.queryVisibilityRecursive(q1, q2, radius, node.right));
            } else if (q1LeftOfI <= 0 && q2LeftOfI <= 0) {
              return this.queryVisibilityRecursive(q1, q2, radius, node.right) && ((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(q1LeftOfI) * invLengthI >= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(radius) && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(q2LeftOfI) * invLengthI >= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(radius) || this.queryVisibilityRecursive(q1, q2, radius, node.left));
            } else if (q1LeftOfI >= 0 && q2LeftOfI <= 0) {
              /* One can see through obstacle from left to right. */
              return this.queryVisibilityRecursive(q1, q2, radius, node.left) && this.queryVisibilityRecursive(q1, q2, radius, node.right);
            } else {
              let point1LeftOfQ = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).leftOf(q1, q2, obstacle1.point);
              let point2LeftOfQ = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).leftOf(q1, q2, obstacle2.point);
              let invLengthQ = 1.0 / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).absSq(q2.minus(q1));
              return point1LeftOfQ * point2LeftOfQ >= 0 && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(point1LeftOfQ) * invLengthQ > (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(radius) && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(point2LeftOfQ) * invLengthQ > (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(radius) && this.queryVisibilityRecursive(q1, q2, radius, node.left) && this.queryVisibilityRecursive(q1, q2, radius, node.right);
            }
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=070213af23b9d9d5ee834a7d882863b999001ce4.js.map