import { Vec2 } from "cc";
import { Agent } from "./Agent";
import { Obstacle, RVOMath, Vector2 } from "./Common";
import { KdTree } from "./kdtree";

export class Simulator {
    private agentId: number = 0;
    private agentIdLst: number[] = [];
    aid2agent: { [key: string]: Agent } = Object.create(null);

    obstacles: Obstacle[] = [];
    kdTree: KdTree = new KdTree();


    defaultAgent: Agent; // Agent
    time: number = 0.0;

    private static _inst: Simulator;
    static get instance(): Simulator {
        if (!Simulator._inst) {
            Simulator._inst = new Simulator();
        }
        return Simulator._inst;
    }

    getAgent(idx: number) {
        return this.aid2agent[this.agentIdLst[idx]];
    }

    getAgentByAid(aid: number) {
        return this.aid2agent[aid];
    }

    getGlobalTime() {
        return this.time;
    };

    getNumAgents() {
        // console.log("getNumAgents ::", this.agentIdLst.length, this.agentIdLst)
        return this.agentIdLst.length;
    };

    getAgentAidByIdx(idx: number) {
        return this.agentIdLst[idx]
    }


    setAgentPrefVelocity(aid: number, velocity: Vector2 | Vec2) {
        this.aid2agent[aid].prefVelocity_.copy(velocity);
    }

    getAgentPosition(aid: number) {
        if (this.aid2agent[aid]) {//为什么移除了 还会进入这个aid的检测
            return this.aid2agent[aid].position_;
        }
        return null

    }

    getAgentPrefVelocity(aid: number) {
        return this.aid2agent[aid].prefVelocity_;
    }

    getAgentVelocity(aid: number) {
        return this.aid2agent[aid].velocity_;
    }

    getAgentRadius(aid: number) {
        return this.aid2agent[aid].radius_;
    }

    getAgentOrcaLines(aid: number) {
        return this.aid2agent[aid].orcaLines_;
    }

    /**
   * 添加动态避障管理对象
   * @param position 初始位置
   * @param radius   检测半径（碰撞半径）
   * @param maxSpeed 最大速度
   * @param velocity 初始线速度(向量)
   * @param mass     转向质量
   * @param opts     （可选）额外RVO参数覆盖：{ neighborDist, timeHorizon, maxNeighbors, timeHorizonObst }
   */
    addAgent(
        position: Vector2 | Vec2,
        radius: number = null,
        maxSpeed: number = null,
        velocity: Vector2 = null,
        mass: number = null,
        opts?: {
            neighborDist?: number;
            timeHorizon?: number;
            maxNeighbors?: number;
            timeHorizonObst?: number;
        }
    ) {
        if (!this.defaultAgent) {
            throw new Error("no default agent");
        }

        const agent = new Agent();

        // —— 基础属性 —— //
        agent.position_.copy(position);

        // 半径 / 速度
        const r = (radius != null ? radius : this.defaultAgent.radius_);
        const ms = (maxSpeed != null ? maxSpeed : this.defaultAgent.maxSpeed_);

        agent.radius_ = r;
        agent.maxSpeed_ = ms;

        // 初速度
        agent.velocity_.copy(velocity || this.defaultAgent.velocity_);

        // —— RVO 关键参数（给出更稳的默认值，并允许 opts 覆盖） —— //
        // 看邻居距离：至少能覆盖左右/纵向插槽间距。经验：>= 4*radius 或 >= 3.0
        const neighborDistDefault = Math.max(3.0, r * 4);
        agent.neighborDist = (opts?.neighborDist != null)
            ? opts.neighborDist
            : (this.defaultAgent.neighborDist != null
                ? Math.max(this.defaultAgent.neighborDist, neighborDistDefault)
                : neighborDistDefault);

        // 预测时间（人/人互避）
        const timeHorizonDefault = 1.5; // 1.0~2.0 更灵活
        agent.timeHorizon = (opts?.timeHorizon != null)
            ? opts.timeHorizon
            : (this.defaultAgent.timeHorizon != null
                ? this.defaultAgent.timeHorizon
                : timeHorizonDefault);

        // 障碍物预测时间（保持默认或可覆盖）
        agent.timeHorizonObst = (opts?.timeHorizonObst != null)
            ? opts.timeHorizonObst
            : (this.defaultAgent.timeHorizonObst != null
                ? this.defaultAgent.timeHorizonObst
                : 1.5);

        // 可见邻居数量上限
        const maxNeighborsDefault = 20;
        agent.maxNeighbors_ = (opts?.maxNeighbors != null)
            ? opts.maxNeighbors
            : (this.defaultAgent.maxNeighbors_ != null
                ? Math.max(this.defaultAgent.maxNeighbors_, maxNeighborsDefault)
                : maxNeighborsDefault);

        // 质量
        if (mass != null && mass >= 0) {
            agent.mass = mass;
        }

        // ID与注册
        agent.id = this.agentId++;
        this.aid2agent[agent.id] = agent;
        this.agentIdLst.push(agent.id);

        return agent.id;
    }

    removeAgent(aid: number) {
        if (this.hasAgent(aid)) {

            let idx = this.agentIdLst.indexOf(aid);
            if (idx >= 0) {
                // this.agentIdLst.splice(idx, 1) //用高效伪移除
                this.agentIdLst[idx] = this.agentIdLst[this.agentIdLst.length - 1];
                this.agentIdLst.length--;
            }
            delete this.aid2agent[aid];
        }
    }

    hasAgent(aid: number) {
        return !!this.aid2agent[aid];
    }

    setAgentMass(agentNo: number, mass: number) {
        this.aid2agent[agentNo].mass = mass;
    }

    getAgentMass(agentNo: number) {
        return this.aid2agent[agentNo].mass;
    }

    setAgentRadius(agentNo: number, radius: number) {
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
    setAgentDefaults(neighborDist: number, maxNeighbors: number, timeHorizon: number, timeHorizonObst: number, radius: number, maxSpeed: number, velocity: Vector2) {
        if (!this.defaultAgent) {
            this.defaultAgent = new Agent();
        }

        this.defaultAgent.maxNeighbors_ = maxNeighbors;
        this.defaultAgent.maxSpeed_ = maxSpeed;
        this.defaultAgent.neighborDist = neighborDist;
        this.defaultAgent.radius_ = radius;
        this.defaultAgent.timeHorizon = timeHorizon;
        this.defaultAgent.timeHorizonObst = timeHorizonObst;
        this.defaultAgent.velocity_ = velocity;
    }

    run(dt: number) {
        this.kdTree.buildAgentTree(this.getNumAgents());
        let agentNum = this.agentIdLst.length;
        for (let i = 0; i < agentNum; i++) {
            this.aid2agent[this.agentIdLst[i]].computeNeighbors(this);
            this.aid2agent[this.agentIdLst[i]].computeNewVelocity(dt);
        }
        for (let i = 0; i < agentNum; i++) {
            this.aid2agent[this.agentIdLst[i]].update(dt);
        }

        this.time += dt;
    }


    addObstacle(vertices: Vector2[]) {
        if (vertices.length < 2) {
            return -1;
        }

        let obstacleNo = this.obstacles.length;

        for (let i = 0; i < vertices.length; ++i) {
            let obstacle = new Obstacle();
            obstacle.point = vertices[i];
            if (i != 0) {
                obstacle.previous = this.obstacles[this.obstacles.length - 1];
                obstacle.previous.next = obstacle;
            }
            if (i == vertices.length - 1) {
                obstacle.next = this.obstacles[obstacleNo];
                obstacle.next.previous = obstacle;
            }
            obstacle.direction = RVOMath.normalize(vertices[(i == vertices.length - 1 ? 0 : i + 1)].minus(vertices[i]));

            if (vertices.length == 2) {
                obstacle.convex = true;
            }
            else {
                obstacle.convex = (RVOMath.leftOf(vertices[(i == 0 ? vertices.length - 1 : i - 1)], vertices[i], vertices[(i == vertices.length - 1 ? 0 : i + 1)]) >= 0);
            }

            obstacle.id = this.obstacles.length;

            this.obstacles.push(obstacle);
        }

        return obstacleNo;
    }

    processObstacles() {
        this.kdTree.buildObstacleTree();
    };

    queryVisibility(point1: Vector2, point2: Vector2, radius: number) {
        return this.kdTree.queryVisibility(point1, point2, radius);
    };

    getObstacles() {
        return this.obstacles;
    }

    clear() {
        this.agentIdLst.length = 0;
        this.agentId = 0;
        this.aid2agent = Object.create(null);
        this.defaultAgent = null;
        this.kdTree = new KdTree();
        this.obstacles.length = 0;
    }
}