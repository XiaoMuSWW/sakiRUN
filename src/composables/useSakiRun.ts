import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'

import { createBlock, moveBlocks } from '@/game/blocks'
import { clockSeconds, formatClock } from '@/game/clock'
import { isHitByBlock } from '@/game/collision'
import { MAX_FRAME_DELTA, MAX_HEARTS } from '@/game/constants'
import { createSaki, resetSaki, startJump, stepSaki } from '@/game/saki'
import { createSpawner, isSpawnDue, scheduleNextSpawn } from '@/game/spawner'
import type { DebugSpriteKind, GameState } from '@/game/types'

/**
 * sakiRUN 的运行时。
 *
 * 设计要点：
 * - 只有一个 requestAnimationFrame 循环，由 `phase` 决定是否推进；
 *   暂停 = 停止循环，因此跳跃、障碍物、计时会同时冻结（修掉了原版
 *   「暂停时跳跃动画还在继续」的问题）。
 * - 状态是 `reactive` 的，模板只负责渲染，游戏规则全部在 `src/game/`
 *   的纯函数里，方便单独测试。
 * - 逻辑坐标固定为 1000 × 500，缩放交给舞台的 CSS transform。
 */
export function useSakiRun() {
  const state = reactive<GameState>({
    phase: 'idle',
    elapsedMs: 0,
    hearts: MAX_HEARTS,
    saki: createSaki(),
    blocks: [],
    spawner: createSpawner(),
    debugSprites: [],
    testMenuOpen: false,
  })

  let rafId: number | null = null
  let lastTimestamp = 0
  let blockSequence = 0
  let debugSequence = 0

  /** 顶部计时器显示文本；依赖整秒数，因而每秒才重算一次 */
  const elapsedSeconds = computed(() => clockSeconds(state.elapsedMs))
  const clockText = computed(() => formatClock(elapsedSeconds.value * 1000))
  const isPlaying = computed(() => state.phase === 'playing')

  function spawnBlock(): void {
    blockSequence += 1
    state.blocks.push(createBlock(blockSequence))
  }

  function resolveCollisions(): void {
    if (state.blocks.length === 0) return

    const survivors = state.blocks.filter((block) => {
      if (!isHitByBlock(state.saki, block)) return true
      state.hearts = Math.max(0, state.hearts - 1)
      return false
    })

    state.blocks = survivors
    if (state.hearts === 0) finish()
  }

  function update(deltaMs: number): void {
    state.elapsedMs += deltaMs
    stepSaki(state.saki, deltaMs)
    state.blocks = moveBlocks(state.blocks, deltaMs)
    resolveCollisions()

    if (state.phase !== 'playing') return

    const seconds = clockSeconds(state.elapsedMs)
    if (isSpawnDue(state.spawner, seconds)) {
      spawnBlock()
      scheduleNextSpawn(state.spawner, seconds)
    }
  }

  function tick(timestamp: number): void {
    if (state.phase !== 'playing') {
      rafId = null
      return
    }

    const deltaMs = Math.min(Math.max(timestamp - lastTimestamp, 0), MAX_FRAME_DELTA)
    lastTimestamp = timestamp
    update(deltaMs)

    rafId = state.phase === 'playing' ? requestAnimationFrame(tick) : null
  }

  function startLoop(): void {
    if (rafId !== null) return
    lastTimestamp = performance.now()
    rafId = requestAnimationFrame(tick)
  }

  function stopLoop(): void {
    if (rafId === null) return
    cancelAnimationFrame(rafId)
    rafId = null
  }

  function resetWorld(): void {
    state.elapsedMs = 0
    state.hearts = MAX_HEARTS
    state.blocks = []
    state.debugSprites = []
    resetSaki(state.saki)
    scheduleNextSpawn(state.spawner, 0)
  }

  /** 开始一局新游戏 */
  function start(): void {
    resetWorld()
    state.phase = 'playing'
    startLoop()
  }

  /** 重新开始（与 start 一致，保留独立入口便于以后扩展） */
  function restart(): void {
    start()
  }

  function pause(): void {
    if (state.phase !== 'playing') return
    state.phase = 'paused'
    stopLoop()
  }

  function resume(): void {
    if (state.phase !== 'paused') return
    state.phase = 'playing'
    startLoop()
  }

  function togglePause(): void {
    if (state.phase === 'playing') pause()
    else if (state.phase === 'paused') resume()
  }

  /** 生命值耗尽 */
  function finish(): void {
    if (state.phase === 'over') return
    state.phase = 'over'
    stopLoop()
  }

  /** 跳跃：只有游戏进行中才响应输入 */
  function jump(): void {
    if (state.phase !== 'playing') return
    startJump(state.saki)
  }

  function toggleTestMenu(): void {
    state.testMenuOpen = !state.testMenuOpen
  }

  function closeTestMenu(): void {
    state.testMenuOpen = false
  }

  function addDebugSprite(kind: DebugSpriteKind): void {
    debugSequence += 1
    state.debugSprites.push({ id: debugSequence, kind })
  }

  function isTextInput(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.code !== 'Space' || isTextInput(event.target)) return
    if (state.phase !== 'playing') return
    event.preventDefault()
    jump()
  }

  function handlePointerDown(event: PointerEvent): void {
    if (event.button !== 0) return
    jump()
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
    stopLoop()
  })

  return {
    state,
    clockText,
    isPlaying,
    start,
    restart,
    pause,
    resume,
    togglePause,
    jump,
    toggleTestMenu,
    closeTestMenu,
    addDebugSprite,
    handlePointerDown,
  }
}
