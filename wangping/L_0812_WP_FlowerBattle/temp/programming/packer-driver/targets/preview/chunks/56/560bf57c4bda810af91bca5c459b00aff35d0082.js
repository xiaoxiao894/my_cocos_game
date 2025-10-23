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

            for (var i = 0; i < this.agents.length; i++) {
              this.agents[i] = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.getAgent(i);
            }

            this.agentTree = new Array(2 * this.agents.length);

            for (var _i = 0; _i < this.agentTree.length; _i++) {
              this.agentTree[_i] = new AgentTreeNode();
            }
          }

          if (this.agents.length != 0) {
            this.buildAgentTreeRecursive(0, this.agents.length, 0);
          }
        }

        buildObstacleTree() {
          this.obstacleTree = new ObstacleTreeNode();
          var obstacles = new Array((_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.obstacles.length);

          for (var i = 0; i < obstacles.length; i++) {
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

          for (var i = begin + 1; i < end; ++i) {
            this.agentTree[node].maxX = Math.max(this.agentTree[node].maxX, this.agents[i].position_.x);
            this.agentTree[node].minX = Math.min(this.agentTree[node].minX, this.agents[i].position_.x);
            this.agentTree[node].maxY = Math.max(this.agentTree[node].maxY, this.agents[i].position_.y);
            this.agentTree[node].minY = Math.min(this.agentTree[node].minY, this.agents[i].position_.y);
          }

          if (end - begin > this.MAX_LEAF_SIZE) {
            // no leaf node
            var isVertical = this.agentTree[node].maxX - this.agentTree[node].minX > this.agentTree[node].maxY - this.agentTree[node].minY;
            var splitValue = 0.5 * (isVertical ? this.agentTree[node].maxX + this.agentTree[node].minX : this.agentTree[node].maxY + this.agentTree[node].minY);
            var left = begin;
            var right = end;

            while (left < right) {
              while (left < right && (isVertical ? this.agents[left].position_.x : this.agents[left].position_.y) < splitValue) {
                ++left;
              }

              while (right > left && (isVertical ? this.agents[right - 1].position_.x : this.agents[right - 1].position_.y) >= splitValue) {
                --right;
              }

              if (left < right) {
                var tmp = this.agents[left];
                this.agents[left] = this.agents[right - 1];
                this.agents[right - 1] = tmp;
                ++left;
                --right;
              }
            }

            var leftSize = left - begin;

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
            var node = new ObstacleTreeNode();
            var optimalSplit = 0;
            var minLeft = obstacles.length;
            var minRight = minLeft;

            for (var i = 0; i < obstacles.length; ++i) {
              var leftSize = 0;
              var rightSize = 0;
              var obstacleI1 = obstacles[i];
              var obstacleI2 = obstacleI1.next;

              for (var j = 0; j < obstacles.length; j++) {
                if (i == j) {
                  continue;
                }

                var obstacleJ1 = obstacles[j];
                var obstacleJ2 = obstacleJ1.next;
                var j1LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point);
                var j2LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
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

                var _fp = new FloatPair(Math.max(leftSize, rightSize), Math.min(leftSize, rightSize));

                var _fp2 = new FloatPair(Math.max(minLeft, minRight), Math.min(minLeft, minRight));

                if (_fp.bigEqualThan(_fp2)) {
                  break;
                }
              }

              var fp1 = new FloatPair(Math.max(leftSize, rightSize), Math.min(leftSize, rightSize));
              var fp2 = new FloatPair(Math.max(minLeft, minRight), Math.min(minLeft, minRight));

              if (fp1.lessThan(fp2)) {
                minLeft = leftSize;
                minRight = rightSize;
                optimalSplit = i;
              }
            }

            {
              /* Build split node. */
              var leftObstacles = [];

              for (var n = 0; n < minLeft; ++n) leftObstacles.push(null);

              var rightObstacles = [];

              for (var _n = 0; _n < minRight; ++_n) rightObstacles.push(null);

              var leftCounter = 0;
              var rightCounter = 0;
              var _i2 = optimalSplit;
              var _obstacleI = obstacles[_i2];
              var _obstacleI2 = _obstacleI.next;

              for (var _j = 0; _j < obstacles.length; ++_j) {
                if (_i2 == _j) {
                  continue;
                }

                var _obstacleJ = obstacles[_j];
                var _obstacleJ2 = _obstacleJ.next;

                var _j1LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).leftOf(_obstacleI.point, _obstacleI2.point, _obstacleJ.point);

                var _j2LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).leftOf(_obstacleI.point, _obstacleI2.point, _obstacleJ2.point);

                if (_j1LeftOfI >= -(_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON && _j2LeftOfI >= -(_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON) {
                  leftObstacles[leftCounter++] = obstacles[_j];
                } else if (_j1LeftOfI <= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON && _j2LeftOfI <= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON) {
                  rightObstacles[rightCounter++] = obstacles[_j];
                } else {
                  /* Split obstacle j. */
                  var t = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                    error: Error()
                  }), RVOMath) : RVOMath).det(_obstacleI2.point.minus(_obstacleI.point), _obstacleJ.point.minus(_obstacleI.point)) / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                    error: Error()
                  }), RVOMath) : RVOMath).det(_obstacleI2.point.minus(_obstacleI.point), _obstacleJ.point.minus(_obstacleJ2.point));

                  var splitpoint = _obstacleJ.point.plus(_obstacleJ2.point.minus(_obstacleJ.point).scale(t));

                  var newObstacle = new (_crd && Obstacle === void 0 ? (_reportPossibleCrUseOfObstacle({
                    error: Error()
                  }), Obstacle) : Obstacle)();
                  newObstacle.point = splitpoint;
                  newObstacle.previous = _obstacleJ;
                  newObstacle.next = _obstacleJ2;
                  newObstacle.convex = true;
                  newObstacle.direction = _obstacleJ.direction;
                  newObstacle.id = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                    error: Error()
                  }), Simulator) : Simulator).instance.obstacles.length;
                  (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                    error: Error()
                  }), Simulator) : Simulator).instance.obstacles.push(newObstacle);
                  _obstacleJ.next = newObstacle;
                  _obstacleJ2.previous = newObstacle;

                  if (_j1LeftOfI > 0.0) {
                    leftObstacles[leftCounter++] = _obstacleJ;
                    rightObstacles[rightCounter++] = newObstacle;
                  } else {
                    rightObstacles[rightCounter++] = _obstacleJ;
                    leftObstacles[leftCounter++] = newObstacle;
                  }
                }
              }

              node.obstacle = _obstacleI;
              node.left = this.buildObstacleTreeRecursive(leftObstacles);
              node.right = this.buildObstacleTreeRecursive(rightObstacles);
              return node;
            }
          }
        }

        queryAgentTreeRecursive(agent, rangeSq, node) {
          if (this.agentTree[node].end - this.agentTree[node].begin <= this.MAX_LEAF_SIZE) {
            for (var i = this.agentTree[node].begin; i < this.agentTree[node].end; ++i) {
              rangeSq = agent.insertAgentNeighbor(this.agents[i], rangeSq);
            }
          } else {
            var distSqLeft = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, this.agentTree[this.agentTree[node].left].minX - agent.position_.x)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, agent.position_.x - this.agentTree[this.agentTree[node].left].maxX)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, this.agentTree[this.agentTree[node].left].minY - agent.position_.y)) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(Math.max(0, agent.position_.y - this.agentTree[this.agentTree[node].left].maxY));
            var distSqRight = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
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
            var obstacle1 = node.obstacle;
            var obstacle2 = obstacle1.next;
            var agentLeftOfLine = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).leftOf(obstacle1.point, obstacle2.point, agent.position_);
            rangeSq = this.queryObstacleTreeRecursive(agent, rangeSq, agentLeftOfLine >= 0 ? node.left : node.right);
            var distSqLine = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
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
            var obstacle1 = node.obstacle;
            var obstacle2 = obstacle1.next;
            var q1LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).leftOf(obstacle1.point, obstacle2.point, q1);
            var q2LeftOfI = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).leftOf(obstacle1.point, obstacle2.point, q2);
            var invLengthI = 1.0 / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
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
              var point1LeftOfQ = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).leftOf(q1, q2, obstacle1.point);
              var point2LeftOfQ = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).leftOf(q1, q2, obstacle2.point);
              var invLengthQ = 1.0 / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
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
//# sourceMappingURL=560bf57c4bda810af91bca5c459b00aff35d0082.js.map