/**
 * 组件通信事件常量
 * 集中管理所有组件间通信的事件名称
 */
export enum ComponentEvent {
    // 健康组件事件
    HURT = 'component:hurt',
    DEAD = 'component:dead',
    HEALTH_CHANGED = 'component:healthChanged',
    
    // 移动组件事件
    MOVE_STATE_UPDATE = 'component:moveStateUpdate',
    TARGET_REACHED = 'component:targetReached',
    MOVE_TO_POSITION = 'component:moveToPosition',
    STOP_MOVING = 'component:stopMoving',
    
    // 减速相关事件
    SLOW_START = 'component:slowStart',
    SLOW_END = 'component:slowEnd',
    SLOW_UPDATED = 'component:slowUpdated',
    
    // 颜色效果相关事件
    APPLY_COLOR_EFFECT = 'component:applyColorEffect',
    CANCEL_COLOR_EFFECT = 'component:cancelColorEffect',
    
    // 攻击组件事件
    ATTACK_START = 'component:attackStart',
    ATTACK_ANI_END = 'component:attackEnd',
    PERFORM_ATTACK = 'component:performAttack',
    REQUEST_ATTACK = 'component:requestAttack',
    
    // 动画组件事件
    ANIMATION_COMPLETE = 'component:animationComplete',
    ATTACK_ANI_COMPLETE = 'component:attackAniComplete',
    PLAY_ANIMATION_START = "component:playAnimationStart",
    
    // 状态组件事件
    STATE_CHANGED = 'component:stateChanged',
    CHANGE_STATE = 'component:changeState',
    
    // 目标追踪组件事件
    SET_TARGET = 'component:setTarget',
    CLEAR_TARGET = 'component:clearTarget',
    UPDATE_FACE_DIRECTION = 'component:updateFaceDirection',
    
    // 路径相关事件
    PATH_COMPLETED = 'path-completed',
    PATH_POINT_REACHED = 'path-point-reached',

    // 设置朝向事件
    SET_FACE_DIRECTION = 'component:setFaceDirection',
    SET_FACE_DIRECTION_FROM_3D = 'component:setFaceDirectionFrom3D',

    // 朝向改变事件
    FACE_DIRECTION_CHANGED = 'component:faceDirectionChanged',
    
    // 击退相关事件
    KNOCKBACK_START = 'component:knockbackStart',
    KNOCKBACK_APPLIED = 'component:knockbackApplied',
    KNOCKBACK_END = 'component:knockbackEnd',
    
    // 击飞相关事件
    KNOCKUP_START = 'component:knockupStart',
    KNOCKUP_END = 'component:knockupEnd',
    
    // 角色控制事件
    CHARACTER_MOVE = 'component:characterMove',
    CHARACTER_ATTACK = 'component:characterAttack',
    CHARACTER_STOP = 'component:characterStop',
    CHARACTER_KNOCKBACK = 'component:characterKnockback',
    CHARACTER_KNOCKUP = 'component:characterKnockup',
    
    // 组件初始化事件
    COMPONENT_INITIALIZED = 'component:initialized',

    // 更新物品数量事件
    UPDATE_ITEM_COUNT = 'component:updateItemCount',

    // ItemLayout 相关事件
    LAYOUT_COUNT_CHANGED = 'component:layoutCountChanged',
} 