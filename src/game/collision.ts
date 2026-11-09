import type { BlockState } from './blocks'
import { blockBounds } from './blocks'
import type { SakiState } from './saki'
import { sakiBounds } from './saki'

/** 轴对齐矩形，使用舞台逻辑坐标；bottom 为底边到舞台底部的距离 */
export interface Bounds {
  left: number
  right: number
  bottom: number
  top: number
}

/** 两个矩形是否相交（边缘相接也算命中，和原实现保持一致） */
export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return !(a.right < b.left || a.left > b.right || a.top < b.bottom || a.bottom > b.top)
}

/** 主角与某个障碍物是否相撞 */
export function isHitByBlock(saki: SakiState, block: BlockState): boolean {
  return boundsIntersect(sakiBounds(saki), blockBounds(block))
}
