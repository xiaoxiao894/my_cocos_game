System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, KeyValuePair, Line, RVOMath, Vector2, Agent, _crd;

  function _reportPossibleCrUseOfKeyValuePair(extras) {
    _reporterNs.report("KeyValuePair", "./Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLine(extras) {
    _reporterNs.report("Line", "./Common", _context.meta, extras);
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

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "./Simulator", _context.meta, extras);
  }

  _export("Agent", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      KeyValuePair = _unresolved_2.KeyValuePair;
      Line = _unresolved_2.Line;
      RVOMath = _unresolved_2.RVOMath;
      Vector2 = _unresolved_2.Vector2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "99d7fX9+uZBBrp6k8HimNAB", "Agent", undefined);

      _export("Agent", Agent = class Agent {
        constructor() {
          this.agentNeighbors_ = [];
          this.obstaclNeighbors_ = [];
          this.orcaLines_ = [];
          this.position_ = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0);
          this.prefVelocity_ = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0);
          this.velocity_ = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0);
          this.id = 0;
          this.maxNeighbors_ = 0;
          this.maxSpeed_ = 0.0;
          this._neighborDist = 0.0;
          this.radius_ = 0.0;
          this.timeHorizon = 0.0;
          this.timeHorizonObst = 0.0;
          this.newVelocity_ = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0);
          this.mass = 1;
        }

        get neighborDist() {
          return this._neighborDist;
        }

        set neighborDist(value) {
          this._neighborDist = value;
        }

        computeNeighbors(sim) {
          this.obstaclNeighbors_.length = 0;
          var rangeSq = (this.timeHorizonObst * this.maxSpeed_ + this.radius_) ** 2;
          sim.kdTree.computeObstacleNeighbors(this, rangeSq);
          this.agentNeighbors_.length = 0;

          if (this.maxNeighbors_ > 0) {
            rangeSq = this.neighborDist ** 2;
            rangeSq = sim.kdTree.computeAgentNeighbors(this, rangeSq);
          }
        }
        /* Search for the best new velocity. */


        computeNewVelocity(dt) {
          this.orcaLines_.length = 0;
          var orcaLines = this.orcaLines_;
          var invTimeHorizonObst = 1.0 / this.timeHorizonObst;
          /* Create obstacle ORCA lines. */

          for (var i = 0; i < this.obstaclNeighbors_.length; ++i) {
            var obstacle1 = this.obstaclNeighbors_[i].value;
            var obstacle2 = obstacle1.next;
            var relativePosition1 = obstacle1.point.minus(this.position_);
            var relativePosition2 = obstacle2.point.minus(this.position_);
            /* 
             * Check if velocity obstacle of obstacle is already taken care of by
             * previously constructed obstacle ORCA lines.
             */

            var alreadyCovered = false;

            for (var j = 0; j < orcaLines.length; ++j) {
              if ((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).det(relativePosition1.scale(invTimeHorizonObst).minus(orcaLines[j].point), orcaLines[j].direction) - invTimeHorizonObst * this.radius_ >= -(_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).RVO_EPSILON && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).det(relativePosition2.scale(invTimeHorizonObst).minus(orcaLines[j].point), orcaLines[j].direction) - invTimeHorizonObst * this.radius_ >= -(_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).RVO_EPSILON) {
                alreadyCovered = true;
                break;
              }
            }

            if (alreadyCovered) {
              continue;
            }
            /* Not yet covered. Check for collisions. */


            var distSq1 = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(relativePosition1);
            var distSq2 = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(relativePosition2);
            var radiusSq = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(this.radius_);
            var obstacleVector = obstacle2.point.minus(obstacle1.point);
            var s = relativePosition1.scale(-1).multiply(obstacleVector) / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(obstacleVector);
            var distSqLine = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(relativePosition1.scale(-1).minus(obstacleVector.scale(s)));
            var line = new (_crd && Line === void 0 ? (_reportPossibleCrUseOfLine({
              error: Error()
            }), Line) : Line)();

            if (s < 0 && distSq1 <= radiusSq) {
              /* Collision with left vertex. Ignore if non-convex. */
              if (obstacle1.convex) {
                line.point = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                  error: Error()
                }), Vector2) : Vector2)(0, 0);
                line.direction = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).normalize(new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                  error: Error()
                }), Vector2) : Vector2)(-relativePosition1.y, relativePosition1.x));
                orcaLines.push(line);
              }

              continue;
            } else if (s > 1 && distSq2 <= radiusSq) {
              /* Collision with right vertex. Ignore if non-convex 
               * or if it will be taken care of by neighoring obstace */
              if (obstacle2.convex && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).det(relativePosition2, obstacle2.direction) >= 0) {
                line.point = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                  error: Error()
                }), Vector2) : Vector2)(0, 0);
                line.direction = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).normalize(new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                  error: Error()
                }), Vector2) : Vector2)(-relativePosition2.y, relativePosition2.x));
                orcaLines.push(line);
              }

              continue;
            } else if (s >= 0 && s <= 1 && distSqLine <= radiusSq) {
              /* Collision with obstacle segment. */
              line.point = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(0, 0);
              line.direction = obstacle1.direction.scale(-1);
              orcaLines.push(line);
              continue;
            }
            /* 
             * No collision.  
             * Compute legs. When obliquely viewed, both legs can come from a single
             * vertex. Legs extend cut-off line when nonconvex vertex.
             */


            var leftLegDirection = void 0,
                rightLegDirection = void 0;

            if (s < 0 && distSqLine <= radiusSq) {
              /*
               * Obstacle viewed obliquely so that left vertex
               * defines velocity obstacle.
               */
              if (!obstacle1.convex) {
                /* Ignore obstacle. */
                continue;
              }

              obstacle2 = obstacle1;
              var leg1 = Math.sqrt(distSq1 - radiusSq);
              leftLegDirection = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(relativePosition1.x * leg1 - relativePosition1.y * this.radius_, relativePosition1.x * this.radius_ + relativePosition1.y * leg1).scale(1 / distSq1);
              rightLegDirection = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(relativePosition1.x * leg1 + relativePosition1.y * this.radius_, -relativePosition1.x * this.radius_ + relativePosition1.y * leg1).scale(1 / distSq1);
            } else if (s > 1 && distSqLine <= radiusSq) {
              /*
               * Obstacle viewed obliquely so that
               * right vertex defines velocity obstacle.
               */
              if (!obstacle2.convex) {
                /* Ignore obstacle. */
                continue;
              }

              obstacle1 = obstacle2;
              var leg2 = Math.sqrt(distSq2 - radiusSq);
              leftLegDirection = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(relativePosition2.x * leg2 - relativePosition2.y * this.radius_, relativePosition2.x * this.radius_ + relativePosition2.y * leg2).scale(1 / distSq2);
              rightLegDirection = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(relativePosition2.x * leg2 + relativePosition2.y * this.radius_, -relativePosition2.x * this.radius_ + relativePosition2.y * leg2).scale(1 / distSq2);
            } else {
              /* Usual situation. */
              if (obstacle1.convex) {
                var _leg = Math.sqrt(distSq1 - radiusSq);

                leftLegDirection = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                  error: Error()
                }), Vector2) : Vector2)(relativePosition1.x * _leg - relativePosition1.y * this.radius_, relativePosition1.x * this.radius_ + relativePosition1.y * _leg).scale(1 / distSq1);
              } else {
                /* Left vertex non-convex; left leg extends cut-off line. */
                leftLegDirection = obstacle1.direction.scale(-1);
              }

              if (obstacle2.convex) {
                var _leg2 = Math.sqrt(distSq2 - radiusSq);

                rightLegDirection = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                  error: Error()
                }), Vector2) : Vector2)(relativePosition2.x * _leg2 + relativePosition2.y * this.radius_, -relativePosition2.x * this.radius_ + relativePosition2.y * _leg2).scale(1 / distSq2);
              } else {
                /* Right vertex non-convex; right leg extends cut-off line. */
                rightLegDirection = obstacle1.direction;
              }
            }
            /* 
             * Legs can never point into neighboring edge when convex vertex,
             * take cutoff-line of neighboring edge instead. If velocity projected on
             * "foreign" leg, no constraint is added. 
             */


            var leftNeighbor = obstacle1.previous;
            var isLeftLegForeign = false;
            var isRightLegForeign = false;

            if (obstacle1.convex && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).det(leftLegDirection, leftNeighbor.direction.scale(-1)) >= 0.0) {
              /* Left leg points into obstacle. */
              leftLegDirection = leftNeighbor.direction.scale(-1);
              isLeftLegForeign = true;
            }

            if (obstacle2.convex && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).det(rightLegDirection, obstacle2.direction) <= 0.0) {
              /* Right leg points into obstacle. */
              rightLegDirection = obstacle2.direction;
              isRightLegForeign = true;
            }
            /* Compute cut-off centers. */


            var leftCutoff = obstacle1.point.minus(this.position_).scale(invTimeHorizonObst);
            var rightCutoff = obstacle2.point.minus(this.position_).scale(invTimeHorizonObst);
            var cutoffVec = rightCutoff.minus(leftCutoff);
            /* Project current velocity on velocity obstacle. */

            /* Check if current velocity is projected on cutoff circles. */

            var t = obstacle1 == obstacle2 ? 0.5 : this.velocity_.minus(leftCutoff).multiply(cutoffVec) / (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(cutoffVec);
            var tLeft = this.velocity_.minus(leftCutoff).multiply(leftLegDirection);
            var tRight = this.velocity_.minus(rightCutoff).multiply(rightLegDirection);

            if (t < 0.0 && tLeft < 0.0 || obstacle1 == obstacle2 && tLeft < 0.0 && tRight < 0.0) {
              /* Project on left cut-off circle. */
              var unitW = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).normalize(this.velocity_.minus(leftCutoff));
              line.direction = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(unitW.y, -unitW.x);
              line.point = leftCutoff.plus(unitW.scale(this.radius_ * invTimeHorizonObst));
              orcaLines.push(line);
              continue;
            } else if (t > 1.0 && tRight < 0.0) {
              /* Project on right cut-off circle. */
              var _unitW = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).normalize(this.velocity_.minus(rightCutoff));

              line.direction = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(_unitW.y, -_unitW.x);
              line.point = rightCutoff.plus(_unitW.scale(this.radius_ * invTimeHorizonObst));
              orcaLines.push(line);
              continue;
            }
            /* 
             * Project on left leg, right leg, or cut-off line, whichever is closest
             * to velocity.
             */


            var distSqCutoff = t < 0.0 || t > 1.0 || obstacle1 == obstacle2 ? Infinity : (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(this.velocity_.minus(cutoffVec.scale(t).plus(leftCutoff)));
            var distSqLeft = tLeft < 0.0 ? Infinity : (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(this.velocity_.minus(leftLegDirection.scale(tLeft).plus(leftCutoff)));
            var distSqRight = tRight < 0.0 ? Infinity : (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(this.velocity_.minus(rightLegDirection.scale(tRight).plus(rightCutoff)));

            if (distSqCutoff <= distSqLeft && distSqCutoff <= distSqRight) {
              /* Project on cut-off line. */
              line.direction = obstacle1.direction.scale(-1);
              var aux = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(-line.direction.y, line.direction.x);
              line.point = aux.scale(this.radius_ * invTimeHorizonObst).plus(leftCutoff);
              orcaLines.push(line);
              continue;
            } else if (distSqLeft <= distSqRight) {
              /* Project on left leg. */
              if (isLeftLegForeign) {
                continue;
              }

              line.direction = leftLegDirection;

              var _aux = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(-line.direction.y, line.direction.x);

              line.point = _aux.scale(this.radius_ * invTimeHorizonObst).plus(leftCutoff);
              orcaLines.push(line);
              continue;
            } else {
              /* Project on right leg. */
              if (isRightLegForeign) {
                continue;
              }

              line.direction = rightLegDirection.scale(-1);

              var _aux2 = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(-line.direction.y, line.direction.x);

              line.point = _aux2.scale(this.radius_ * invTimeHorizonObst).plus(rightCutoff);
              orcaLines.push(line);
              continue;
            }
          }

          var numObstLines = orcaLines.length;
          var invTimeHorizon = 1.0 / this.timeHorizon;
          /* Create agent ORCA lines. */

          for (var _i = 0; _i < this.agentNeighbors_.length; ++_i) {
            var other = this.agentNeighbors_[_i].value;
            var relativePosition = other.position_.minus(this.position_); // mass

            var massRatio = other.mass / (this.mass + other.mass);
            var neighborMassRatio = this.mass / (this.mass + other.mass);
            var velocityOpt = massRatio >= 0.5 ? this.velocity_.minus(this.velocity_.scale(massRatio)).scale(2) : this.prefVelocity_.plus(this.velocity_.minus(this.prefVelocity_).scale(massRatio * 2));
            var neighborVelocityOpt = neighborMassRatio >= 0.5 ? other.velocity_.scale(2).scale(1 - neighborMassRatio) : other.prefVelocity_.plus(other.velocity_.minus(other.prefVelocity_).scale(2 * neighborMassRatio));
            var relativeVelocity = velocityOpt.minus(neighborVelocityOpt); //this.velocity.minus(other.velocity);

            var distSq = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(relativePosition);
            var combinedRadius = this.radius_ + other.radius_;
            var combinedRadiusSq = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).sqr(combinedRadius);

            var _line = new (_crd && Line === void 0 ? (_reportPossibleCrUseOfLine({
              error: Error()
            }), Line) : Line)();

            var u = void 0;

            if (distSq > combinedRadiusSq) {
              /* No collision. */
              var w = relativeVelocity.minus(relativePosition.scale(invTimeHorizon)); // Vector

              /* Vector from cutoff center to relative velocity. */

              var wLengthSq = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).absSq(w);
              var dotProduct1 = w.multiply(relativePosition);

              if (dotProduct1 < 0.0 && (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).sqr(dotProduct1) > combinedRadiusSq * wLengthSq) {
                /* Project on cut-off circle. */
                var wLength = Math.sqrt(wLengthSq);

                var _unitW2 = w.scale(1 / wLength);

                _line.direction = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                  error: Error()
                }), Vector2) : Vector2)(_unitW2.y, -_unitW2.x);
                u = _unitW2.scale(combinedRadius * invTimeHorizon - wLength);
              } else {
                /* Project on legs. */
                var leg = Math.sqrt(distSq - combinedRadiusSq);

                if ((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).det(relativePosition, w) > 0.0) {
                  /* Project on left leg. */
                  var _aux3 = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                    error: Error()
                  }), Vector2) : Vector2)(relativePosition.x * leg - relativePosition.y * combinedRadius, relativePosition.x * combinedRadius + relativePosition.y * leg);

                  _line.direction = _aux3.scale(1 / distSq);
                } else {
                  /* Project on right leg. */
                  var _aux4 = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                    error: Error()
                  }), Vector2) : Vector2)(relativePosition.x * leg + relativePosition.y * combinedRadius, -relativePosition.x * combinedRadius + relativePosition.y * leg);

                  _line.direction = _aux4.scale(-1 / distSq);
                }

                var dotProduct2 = relativeVelocity.multiply(_line.direction);
                u = _line.direction.scale(dotProduct2).minus(relativeVelocity);
              }
            } else {
              /* Collision. Project on cut-off circle of time timeStep. */
              var invTimeStep = 1.0 / dt;
              /* Vector from cutoff center to relative velocity. */

              var _w = relativeVelocity.minus(relativePosition.scale(invTimeStep));

              var _wLength = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).abs(_w);

              var _unitW3 = _w.scale(1 / _wLength);

              _line.direction = new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(_unitW3.y, -_unitW3.x);
              u = _unitW3.scale(combinedRadius * invTimeStep - _wLength);
            } // line.point = u.scale(0.5).plus(this.velocity);


            _line.point = velocityOpt.plus(u.scale(massRatio));
            orcaLines.push(_line);
          }

          var lineFail = this.linearProgram2(orcaLines, this.maxSpeed_, this.prefVelocity_, false, this.newVelocity_);

          if (lineFail < orcaLines.length) {
            this.linearProgram3(orcaLines, numObstLines, lineFail, this.maxSpeed_, this.newVelocity_);
          }
        }

        insertAgentNeighbor(agent, rangeSq) {
          if (this != agent) {
            var distSq = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).absSq(this.position_.minus(agent.position_));

            if (distSq < rangeSq) {
              if (this.agentNeighbors_.length < this.maxNeighbors_) {
                this.agentNeighbors_.push(new (_crd && KeyValuePair === void 0 ? (_reportPossibleCrUseOfKeyValuePair({
                  error: Error()
                }), KeyValuePair) : KeyValuePair)(distSq, agent));
              }

              var i = this.agentNeighbors_.length - 1;

              while (i != 0 && distSq < this.agentNeighbors_[i - 1].key) {
                this.agentNeighbors_[i] = this.agentNeighbors_[i - 1];
                --i;
              }

              this.agentNeighbors_[i] = new (_crd && KeyValuePair === void 0 ? (_reportPossibleCrUseOfKeyValuePair({
                error: Error()
              }), KeyValuePair) : KeyValuePair)(distSq, agent);

              if (this.agentNeighbors_.length == this.maxNeighbors_) {
                rangeSq = this.agentNeighbors_[this.agentNeighbors_.length - 1].key;
              }
            }
          }

          return rangeSq;
        }

        insertObstacleNeighbor(obstacle, rangeSq) {
          var nextObstacle = obstacle.next;
          var distSq = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
            error: Error()
          }), RVOMath) : RVOMath).distSqPointLineSegment(obstacle.point, nextObstacle.point, this.position_);

          if (distSq < rangeSq) {
            this.obstaclNeighbors_.push(new (_crd && KeyValuePair === void 0 ? (_reportPossibleCrUseOfKeyValuePair({
              error: Error()
            }), KeyValuePair) : KeyValuePair)(distSq, obstacle));
            var i = this.obstaclNeighbors_.length - 1;

            while (i != 0 && distSq < this.obstaclNeighbors_[i - 1].key) {
              this.obstaclNeighbors_[i] = this.obstaclNeighbors_[i - 1];
              --i;
            }

            this.obstaclNeighbors_[i] = new (_crd && KeyValuePair === void 0 ? (_reportPossibleCrUseOfKeyValuePair({
              error: Error()
            }), KeyValuePair) : KeyValuePair)(distSq, obstacle);
          }
        }

        update(dt) {
          this.velocity_.copy(this.newVelocity_);
          this.position_.copy(this.position_.plus(this.velocity_.scale(dt)));
        }

        linearProgram1(lines, lineNo, radius, optVelocity, directionOpt, result) {
          var dotProduct = lines[lineNo].point.multiply(lines[lineNo].direction);
          var discriminant = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
            error: Error()
          }), RVOMath) : RVOMath).sqr(dotProduct) + (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
            error: Error()
          }), RVOMath) : RVOMath).sqr(radius) - (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
            error: Error()
          }), RVOMath) : RVOMath).absSq(lines[lineNo].point);

          if (discriminant < 0.0) {
            /* Max speed circle fully invalidates line lineNo. */
            return false;
          }

          var sqrtDiscriminant = Math.sqrt(discriminant);
          var tLeft = -dotProduct - sqrtDiscriminant;
          var tRight = -dotProduct + sqrtDiscriminant;

          for (var i = 0; i < lineNo; ++i) {
            var denominator = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).det(lines[lineNo].direction, lines[i].direction);
            var numerator = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).det(lines[i].direction, lines[lineNo].point.minus(lines[i].point));

            if (Math.abs(denominator) <= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).RVO_EPSILON) {
              /* Lines lineNo and i are (almost) parallel. */
              if (numerator < 0.0) {
                return false;
              } else {
                continue;
              }
            }

            var t = numerator / denominator;

            if (denominator >= 0.0) {
              /* Line i bounds line lineNo on the right. */
              tRight = Math.min(tRight, t);
            } else {
              /* Line i bounds line lineNo on the left. */
              tLeft = Math.max(tLeft, t);
            }

            if (tLeft > tRight) {
              return false;
            }
          }

          if (directionOpt) {
            if (optVelocity.multiply(lines[lineNo].direction) > 0.0) {
              // Take right extreme
              result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(tRight)));
            } else {
              // Take left extreme.
              result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(tLeft)));
            }
          } else {
            // Optimize closest point
            var _t = lines[lineNo].direction.multiply(optVelocity.minus(lines[lineNo].point));

            if (_t < tLeft) {
              result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(tLeft)));
            } else if (_t > tRight) {
              result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(tRight)));
            } else {
              result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(_t)));
            }
          }

          return true;
        }

        linearProgram2(lines, radius, optVelocity, directionOpt, result) {
          // directionOpt 第一次为false，第二次为true，directionOpt主要用在 linearProgram1 里面
          if (directionOpt) {
            /* 
             * Optimize direction. Note that the optimization velocity is of unit
             * length in this case.
             */
            result.copy(optVelocity.scale(radius));
          } else if ((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
            error: Error()
          }), RVOMath) : RVOMath).absSq(optVelocity) > (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
            error: Error()
          }), RVOMath) : RVOMath).sqr(radius)) {
            /* Optimize closest point and outside circle. */
            result.copy((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).normalize(optVelocity).scale(radius));
          } else {
            /* Optimize closest point and inside circle. */
            result.copy(optVelocity);
          }

          for (var i = 0; i < lines.length; ++i) {
            if ((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).det(lines[i].direction, lines[i].point.minus(result)) > 0.0) {
              /* Result does not satisfy constraint i. Compute new optimal result. */
              var tempResult = result.clone();

              if (!this.linearProgram1(lines, i, radius, optVelocity, directionOpt, result)) {
                result.copy(tempResult);
                return i;
              }
            }
          }

          return lines.length;
        }

        linearProgram3(lines, numObstLines, beginLine, radius, result) {
          var distance = 0.0; // 遍历所有剩余ORCA线

          for (var i = beginLine; i < lines.length; ++i) {
            // 每一条 ORCA 线都需要精确的做出处理，distance 为 最大违规的速度
            if ((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
              error: Error()
            }), RVOMath) : RVOMath).det(lines[i].direction, lines[i].point.minus(result)) > distance) {
              /* Result does not satisfy constraint of line i. */
              //std::vector<Line> projLines(lines.begin(), lines.begin() + numObstLines);
              var projLines = []; // new List<Line>();
              // 1.静态阻挡的orca线直接加到projLines中

              for (var ii = 0; ii < numObstLines; ++ii) {
                projLines.push(lines[ii]);
              } // 2.动态阻挡的orca线需要重新计算line，从第一个非静态阻挡到当前的orca线


              for (var j = numObstLines; j < i; ++j) {
                var line = new (_crd && Line === void 0 ? (_reportPossibleCrUseOfLine({
                  error: Error()
                }), Line) : Line)();
                var determinant = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).det(lines[i].direction, lines[j].direction);

                if (Math.abs(determinant) <= (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).RVO_EPSILON) {
                  /* Line i and line j are parallel. */
                  if (lines[i].direction.multiply(lines[j].direction) > 0.0) {
                    /* Line i and line j point in the same direction. */
                    continue;
                  } else {
                    /* Line i and line j point in opposite direction. */
                    line.point = lines[i].point.plus(lines[j].point).scale(0.5);
                  }
                } else {
                  line.point = lines[i].point.plus(lines[i].direction.scale((_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                    error: Error()
                  }), RVOMath) : RVOMath).det(lines[j].direction, lines[i].point.minus(lines[j].point)) / determinant));
                }

                line.direction = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                  error: Error()
                }), RVOMath) : RVOMath).normalize(lines[j].direction.minus(lines[i].direction));
                projLines.push(line);
              }

              var tempResult = result.clone();

              if (this.linearProgram2(projLines, radius, new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(-lines[i].direction.y, lines[i].direction.x), true, result) < projLines.length) {
                /* This should in principle not happen.  The result is by definition
                 * already in the feasible region of this linear program. If it fails,
                 * it is due to small floating point error, and the current result is
                 * kept.
                 */
                result.copy(tempResult);
              }

              distance = (_crd && RVOMath === void 0 ? (_reportPossibleCrUseOfRVOMath({
                error: Error()
              }), RVOMath) : RVOMath).det(lines[i].direction, lines[i].point.minus(result));
            }
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=25960b58f0aeb91d18a63bf47671dd433bf1e2f2.js.map