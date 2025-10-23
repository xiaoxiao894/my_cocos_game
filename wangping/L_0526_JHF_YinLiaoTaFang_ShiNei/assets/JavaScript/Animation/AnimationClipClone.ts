// SafeClipClone.ts
import { AnimationClip } from 'cc';

// 安全的“值拷贝”（避免函数/原型丢失）
function deepCopyJSON<T>(obj: T): T {
  // @ts-ignore
  if (typeof structuredClone === 'function') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 安全克隆 AnimationClip：
 * - 公开数据拷贝
 * - 私有 _exoticAnimation 只做“引用拷贝”（不能 JSON 深拷贝）
 */
export function cloneAnimationClipSafe(src: AnimationClip, nameSuffix = '_inst'): AnimationClip {
  const dst = new AnimationClip();
  dst.name = (src.name || 'clip') + nameSuffix;

  // 基础属性
  dst.duration = src.duration;
  (dst as any).sample   = (src as any).sample ?? (dst as any).sample;
  (dst as any).speed    = (src as any).speed  ?? (dst as any).speed;
  dst.wrapMode          = src.wrapMode;

  // 事件可以深拷贝（只含数据）
  if (src.events) dst.events = deepCopyJSON(src.events);

  // === 关键点：保留 _exoticAnimation 的“实例引用”，不要深拷贝！ ===
  // 这是 FBX 骨骼动画的真正载体（内部类，带 createEvaluator 方法）
  if ((src as any)._exoticAnimation) {
    (dst as any)._exoticAnimation = (src as any)._exoticAnimation; // 引用复制
  }

  // 对于“节点动画”（非 FBX 骨骼），这些字段可能有值，可以安全深拷贝
  if ((src as any).keys)          (dst as any).keys          = deepCopyJSON((src as any).keys);
  if ((src as any).curves)        (dst as any).curves        = deepCopyJSON((src as any).curves);
  if ((src as any).commonTargets) (dst as any).commonTargets = deepCopyJSON((src as any).commonTargets);

  return dst;
}
