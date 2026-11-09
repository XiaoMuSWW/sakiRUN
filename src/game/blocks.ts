import { BLOCK_BASE_Y, BLOCK_HEIGHT, BLOCK_SPAWN_X, BLOCK_SPEED, BLOCK_WIDTH } from './constants'

/** 一个迎面而来的障碍物 */
export interface BlockState {
  id: number
  /** 障碍物左边缘的逻辑坐标 */
  x: number
}

/** 在舞台右侧生成一个障碍物 */
export function createBlock(id: number): BlockState {
  return { id, x: BLOCK_SPAWN_X }
}

/**
 * 推进障碍物移动，并回收已经移出左侧屏幕的障碍物。
 * 返回存活下来的障碍物数组（保持原有顺序）。
 */
export function moveBlocks(blocks: BlockState[], deltaMs: number): BlockState[] {
  const dx = (BLOCK_SPEED * deltaMs) / 1000
  const survivors: BlockState[] = []

  for (const block of blocks) {
    block.x -= dx
    if (block.x + BLOCK_WIDTH > 0) {
      survivors.push(block)
    }
  }

  return survivors
}

/** 障碍物的碰撞盒（舞台逻辑坐标） */
export function blockBounds(block: BlockState) {
  return {
    left: block.x,
    right: block.x + BLOCK_WIDTH,
    bottom: BLOCK_BASE_Y,
    top: BLOCK_BASE_Y + BLOCK_HEIGHT,
  }
}
