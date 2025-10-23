import { ccenum } from "cc";

export enum PropEnum {
    null = -1,
    gold,
    meat,
    cookMeat,
}
ccenum(PropEnum)


export enum AttackLevel {
    knife,
    bigKnife,
    fire,
}
ccenum(AttackLevel);

export enum EffectEnum {
    hit,
    fire_hit,
    shopOver,
}
ccenum(EffectEnum);
export enum EventEnum {

    Effect_Play_over = "Effect_Play_over",

}