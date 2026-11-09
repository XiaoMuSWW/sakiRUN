<script setup lang="ts">
import type { GamePhase } from '@/game/types'

const props = defineProps<{
  phase: GamePhase
  time: string
}>()

const emit = defineEmits<{
  start: []
  resume: []
  restart: []
}>()
</script>

<template>
  <div class="overlay" @pointerdown.stop>
    <div v-if="props.phase === 'idle'" class="overlay__card">
      <h1 class="overlay__title">sakiRUN</h1>
      <p class="overlay__subtitle">按空格或点击画面跳跃，躲开迎面而来的方块。</p>
      <div class="overlay__actions">
        <button class="pixel-button" type="button" @click="emit('start')">点击开始</button>
      </div>
    </div>

    <div v-else-if="props.phase === 'paused'" class="overlay__card">
      <h2 class="overlay__title">已暂停</h2>
      <p class="overlay__subtitle">
        用时 <span class="overlay__time">{{ props.time }}</span>
      </p>
      <div class="overlay__actions">
        <button class="pixel-button" type="button" @click="emit('resume')">继续游戏</button>
      </div>
    </div>

    <div v-else class="overlay__card">
      <h2 class="overlay__title">游戏结束</h2>
      <p class="overlay__subtitle">
        坚持了 <span class="overlay__time">{{ props.time }}</span>
      </p>
      <div class="overlay__actions">
        <button class="pixel-button" type="button" @click="emit('restart')">重新开始</button>
      </div>
    </div>
  </div>
</template>
