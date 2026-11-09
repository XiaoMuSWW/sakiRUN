<script setup lang="ts">
import HeartIcon from '@/components/HeartIcon.vue'
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
      <HeartIcon
        v-for="slot in heartSlots"
        :key="slot"
        :filled="slot < props.hearts"
        :style="heartStyle"
      />
    </div>
    <div class="hud__clock" aria-live="off">{{ props.time }}</div>
  </div>
</template>
