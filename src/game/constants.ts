/**
 * 游戏的全局常量。
 *
 * 舞台内部一律使用「逻辑坐标」：舞台固定为 1000 × 500，渲染时再整体等比缩放。
 * 因此这里的数值不受屏幕尺寸影响，物理与碰撞计算可以保持确定性。
 */

/** 舞台逻辑宽度（px） */
export const STAGE_WIDTH = 1000
/** 舞台逻辑高度（px） */
export const STAGE_HEIGHT = 500

/** 主角与助演角色的显示尺寸（px） */
export const CHARACTER_WIDTH = 90
export const CHARACTER_HEIGHT = 200

/** 主角「祥子」的初始位置 */
export const SAKI_X = 400
export const SAKI_BASE_Y = 5

/** 主角跳跃：抛物线在 jumpDuration 内完成一次起落 */
export const SAKI_JUMP_HEIGHT = 300
export const SAKI_JUMP_DURATION = 800

/** 助演「初华」的初始位置 */
export const MISUMI_X = 100
export const MISUMI_BASE_Y = 5

/** 障碍物的生成位置、尺寸与移动速度 */
export const BLOCK_SPAWN_X = 980
export const BLOCK_SPEED = 600 // px / s
export const BLOCK_WIDTH = 20
export const BLOCK_HEIGHT = 50
export const BLOCK_BASE_Y = 0

/** 初始生命值（心） */
export const MAX_HEARTS = 3
/** 心形图标的显示尺寸（px） */
export const HEART_SIZE = 50

/** 障碍物生成间隔（秒），游戏进行 60 秒后改为后期间隔 */
export const SPAWN_INTERVAL = { min: 2, max: 4 } as const
export const SPAWN_INTERVAL_LATE = { min: 1, max: 3 } as const
export const SPAWN_LATE_AFTER_SECONDS = 60

/**
 * 单帧最大步长（ms）。
 * 切到后台再回来时 rAF 的时间差可能非常大，钳制后可以避免角色「瞬移」穿过障碍物。
 */
export const MAX_FRAME_DELTA = 100
