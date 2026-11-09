/** 计时器：只保存累计毫秒数，显示时再格式化为 HH:MM:SS */
export function clockSeconds(elapsedMs: number): number {
  return Math.floor(elapsedMs / 1000)
}

export function formatClock(elapsedMs: number): string {
  const total = clockSeconds(elapsedMs)
  const hours = Math.floor(total / 3600) % 24
  const minutes = Math.floor(total / 60) % 60
  const seconds = total % 60
  const pad = (value: number) => value.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}
