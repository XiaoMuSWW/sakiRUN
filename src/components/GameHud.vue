<script setup lang="ts">
import { HEART_SIZE, MAX_HEARTS } from '@/game/constants'

const props = defineProps<{
  hearts: number
  time: string
}>()

const heartSlots = Array.from({ length: MAX_HEARTS }, (_, index) => index)
const heartStyle = { width: `${HEART_SIZE}px`, height: `${HEART_SIZE}px` }
</script>

<template>
  <div class="hud">
    <div class="hud__hearts" role="img" :aria-label="`剩余生命 ${props.hearts} / ${MAX_HEARTS}`">
      <span
        v-for="slot in heartSlots"
        :key="slot"
        class="heart"
        :class="{ 'heart--empty': slot >= props.hearts }"
        :style="heartStyle"
        aria-hidden="true"
      />
    </div>
    <div class="hud__clock" aria-live="off">{{ props.time }}</div>
  </div>
</template>
