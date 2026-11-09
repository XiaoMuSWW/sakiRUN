<script setup lang="ts">
import GameStage from '@/components/GameStage.vue'
</script>

<template>
  <div class="page">
    <GameStage />

    <p class="page__hint">
      <kbd>空格</kbd> 或点击画面跳跃 · 右上角 <span aria-hidden="true">≡</span> 暂停
    </p>
  </div>
</template>
