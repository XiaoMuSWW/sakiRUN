import type { BlockState } from './blocks'
import type { SakiState } from './saki'
import type { SpawnerState } from './spawner'

/** 游戏阶段：待开始 / 进行中 / 暂停 / 结束 */
export type GamePhase = 'idle' | 'playing' | 'paused' | 'over'

/** 调试菜单可以添加的角色类型 */
export type DebugSpriteKind = 'saki' | 'misumi'

/** 调试角色实例（仅用于调试菜单，不参与游戏逻辑） */
export interface DebugSprite {
  id: number
  kind: DebugSpriteKind
}

export interface GameState {
  phase: GamePhase
  /** 本局已经进行的时间（ms），暂停时不增长 */
  elapsedMs: number
  hearts: number
  saki: SakiState
  blocks: BlockState[]
  spawner: SpawnerState
  debugSprites: DebugSprite[]
  testMenuOpen: boolean
}
