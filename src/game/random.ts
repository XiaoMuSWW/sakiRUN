/** 生成 [min, max] 区间内的随机整数（含端点） */
export function randomIntInclusive(min: number, max: number): number {
  const low = Math.ceil(min)
  const high = Math.floor(max)
  return Math.floor(Math.random() * (high - low + 1)) + low
}
