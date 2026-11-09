import {
  CHARACTER_HEIGHT,
  CHARACTER_WIDTH,
  SAKI_BASE_Y,
  SAKI_JUMP_DURATION,
  SAKI_JUMP_HEIGHT,
  SAKI_X,
} from './constants'

/** 主角「祥子」的位置与跳跃状态 */
export interface SakiState {
  x: number
  /** 底部坐标（与 CSS bottom 一致） */
  y: number
  isJumping: boolean
  jumpElapsedMs: number
  jumpStartY: number
}

export function createSaki(): SakiState {
  return {
    x: SAKI_X,
    y: SAKI_BASE_Y,
    isJumping: false,
    jumpElapsedMs: 0,
    jumpStartY: SAKI_BASE_Y,
  }
}

/** 起跳；已在空中时返回 false（不允许二段跳） */
export function startJump(saki: SakiState): boolean {
  if (saki.isJumping) return false

  saki.isJumping = true
  saki.jumpElapsedMs = 0
  saki.jumpStartY = saki.y
  return true
}

/**
 * 推进跳跃动画。
 *
 * 抛物线：y = y0 + 4h·p·(1 - p)，p ∈ [0, 1]。
 * 由于跳跃进度存在状态里，暂停时只要停止调用本函数即可精确冻结。
 */
export function stepSaki(saki: SakiState, deltaMs: number): void {
  if (!saki.isJumping) return

  saki.jumpElapsedMs = Math.min(saki.jumpElapsedMs + deltaMs, SAKI_JUMP_DURATION)
  const progress = saki.jumpElapsedMs / SAKI_JUMP_DURATION
  saki.y = saki.jumpStartY + 4 * SAKI_JUMP_HEIGHT * progress * (1 - progress)

  if (saki.jumpElapsedMs >= SAKI_JUMP_DURATION) {
    saki.isJumping = false
    saki.jumpElapsedMs = 0
    saki.y = saki.jumpStartY
  }
}

/** 回到初始状态（重新开始 / 复位时使用） */
export function resetSaki(saki: SakiState): void {
  saki.y = SAKI_BASE_Y
  saki.isJumping = false
  saki.jumpElapsedMs = 0
  saki.jumpStartY = SAKI_BASE_Y
}

/** 主角的碰撞盒（舞台逻辑坐标） */
export function sakiBounds(saki: SakiState) {
  return {
    left: saki.x,
    right: saki.x + CHARACTER_WIDTH,
    bottom: saki.y,
    top: saki.y + CHARACTER_HEIGHT,
  }
}
