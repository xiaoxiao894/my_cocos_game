export enum StateDefine {

    Attack = "attack",
    Idle = "idle",
    Walk = "walk_f",
    Walk_attack = "walk-attack",
    Die = "Die",

    Attack_CottonSwab = "JZ_attack",
    Run_Attack_CottonSwab = "JZ_run-attack",
    Run_CottonSwab = "JZ_run",

    Attack_Knife = "SGD_attack",
    Run_Attack_Knife = "SGD_run-attack",
    Run_Knife = "SGD_run",

    Attack_Flamethrower = "PHQ_attack",
    Run_Attack_Flamethrower = "PHQ_run-attack",
    Run_Flamethrower = "PHQ_run",
}

export enum MinionStateEnum {
    Attack = "GJ_attack",
    Idle = "idle",
    Walk = "SGD_run",
    initWalk = "JZ_run",
    AttackCloseRange = "SGD_attack",
}

export enum MonsterStateEnum {
    Attack = "attack01_1",
    Idle = "idle",
    Die = "die_1",
    Walk = "walk_f_1",
}

export enum PartnerAttackEnum {
    Attack = "attack"
}