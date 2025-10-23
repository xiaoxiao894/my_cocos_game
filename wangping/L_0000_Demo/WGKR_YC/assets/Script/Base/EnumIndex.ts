import { ccenum } from "cc";

export enum PropEnum {
    null = -1,
    gold,
    meat,
    cookMeat,
}
ccenum(PropEnum)


export enum AttackLevel {
    BOW,
    fire,
    bigKnife,
    knife,
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
export enum BulletEnum {
    arrow,
}
ccenum(BulletEnum);