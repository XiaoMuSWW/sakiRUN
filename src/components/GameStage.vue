<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import GameHud from '@/components/GameHud.vue'
import GameOverlay from '@/components/GameOverlay.vue'
import StageBackdrop from '@/components/StageBackdrop.vue'
import TestMenu from '@/components/TestMenu.vue'
import { useSakiRun } from '@/composables/useSakiRun'
import type { BlockState } from '@/game/blocks'
import {
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  CHARACTER_HEIGHT,
  CHARACTER_WIDTH,
  MISUMI_BASE_Y,
  MISUMI_X,
  SAKI_BASE_Y,
  SAKI_X,
  STAGE_WIDTH,
} from '@/game/constants'
import type { DebugSpriteKind } from '@/game/types'

const {
  state,
  clockText,
  start,
  restart,
  resume,
  togglePause,
  toggleTestMenu,
  closeTestMenu,
  addDebugSprite,
  handlePointerDown,
} = useSakiRun()

const frameEl = ref<HTMLElement | null>(null)
const scale = ref(1)
let resizeObserver: ResizeObserver | null = null

/** 舞台按容器宽度等比缩放，游戏内部始终保持 1000 × 500 的逻辑坐标 */
function updateScale(): void {
  const width = frameEl.value?.getBoundingClientRect().width ?? 0
  if (width > 0) scale.value = Math.min(width / STAGE_WIDTH, 1)
}

onMounted(() => {
  updateScale()
  if (!frameEl.value) return

  resizeObserver = new ResizeObserver(updateScale)
  resizeObserver.observe(frameEl.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

/** 暂停 / 结束时冻结装饰性 CSS 动画（摇摆等） */
const frozen = computed(() => state.phase === 'paused' || state.phase === 'over')

const sakiStyle = computed(() => ({
  left: `${state.saki.x}px`,
  bottom: `${state.saki.y}px`,
  width: `${CHARACTER_WIDTH}px`,
  height: `${CHARACTER_HEIGHT}px`,
}))

const misumiStyle = {
  left: `${MISUMI_X}px`,
  bottom: `${MISUMI_BASE_Y}px`,
  width: `${CHARACTER_WIDTH}px`,
  height: `${CHARACTER_HEIGHT}px`,
}

function blockStyle(block: BlockState): Record<string, string> {
  return {
    transform: `translate3d(${block.x}px, 0, 0)`,
    width: `${BLOCK_WIDTH}px`,
    height: `${BLOCK_HEIGHT}px`,
  }
}

function debugSpriteStyle(kind: DebugSpriteKind, index: number): Record<string, string> {
  return {
    left: `${(kind === 'saki' ? SAKI_X : MISUMI_X) + index * 24}px`,
    bottom: `${kind === 'saki' ? SAKI_BASE_Y : MISUMI_BASE_Y}px`,
    width: `${CHARACTER_WIDTH}px`,
    height: `${CHARACTER_HEIGHT}px`,
  }
}
</script>

<template>
  <div ref="frameEl" class="stage-frame">
    <div
      class="stage"
      :class="{ 'stage--frozen': frozen }"
      :style="{ transform: `scale(${scale})` }"
      @pointerdown="handlePointerDown"
    >
      <StageBackdrop />

      <!-- 调试菜单创建的角色不参与游戏逻辑 -->
      <div
        v-for="(sprite, index) in state.debugSprites"
        :key="`debug-${sprite.id}`"
        class="sprite"
        :class="sprite.kind === 'saki' ? 'sprite--saki' : 'sprite--misumi'"
        :style="debugSpriteStyle(sprite.kind, index)"
      />

      <template v-if="state.phase !== 'idle'">
        <div class="sprite sprite--misumi" :style="misumiStyle" />
        <div class="sprite sprite--saki" :style="sakiStyle" />

        <div
          v-for="block in state.blocks"
          :key="block.id"
          class="block"
          :style="blockStyle(block)"
        />

        <GameHud :hearts="state.hearts" :time="clockText" />
      </template>

      <button
        class="icon-button icon-button--test"
        type="button"
        title="测试"
        aria-label="打开测试菜单"
        @pointerdown.stop
        @click="toggleTestMenu"
      >
        ?
      </button>
      <button
        class="icon-button icon-button--menu"
        type="button"
        title="菜单"
        aria-label="暂停或继续游戏"
        @pointerdown.stop
        @click="togglePause"
      >
        ≡
      </button>

      <GameOverlay
        v-if="state.phase !== 'playing'"
        :phase="state.phase"
        :time="clockText"
        @start="start"
        @resume="resume"
        @restart="restart"
      />

      <TestMenu
        v-if="state.testMenuOpen"
        @spawn-saki="addDebugSprite('saki')"
        @spawn-misumi="addDebugSprite('misumi')"
        @close="closeTestMenu"
      />
    </div>
  </div>
</template>
