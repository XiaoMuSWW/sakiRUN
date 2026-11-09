import {
  SPAWN_INTERVAL,
  SPAWN_INTERVAL_LATE,
  SPAWN_LATE_AFTER_SECONDS,
} from './constants'
import { randomIntInclusive } from './random'

/** 生成器只记录「下一次该在第几秒生成」 */
export interface SpawnerState {
  nextSpawnAtSecond: number
}

export function createSpawner(): SpawnerState {
  return { nextSpawnAtSecond: 0 }
}

/** 安排下一次生成：随游戏进行，间隔会逐渐缩短 */
export function scheduleNextSpawn(spawner: SpawnerState, currentSecond: number): void {
  const interval =
    currentSecond > SPAWN_LATE_AFTER_SECONDS ? SPAWN_INTERVAL_LATE : SPAWN_INTERVAL
  spawner.nextSpawnAtSecond = currentSecond + randomIntInclusive(interval.min, interval.max)
}

export function isSpawnDue(spawner: SpawnerState, currentSecond: number): boolean {
  return currentSecond >= spawner.nextSpawnAtSecond
}
