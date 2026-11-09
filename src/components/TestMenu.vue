<script setup lang="ts">
const emit = defineEmits<{
  spawnSaki: []
  spawnMisumi: []
  close: []
}>()
</script>

<template>
  <aside class="test-menu" role="dialog" aria-label="测试菜单" @pointerdown.stop>
    <p class="test-menu__title">测试</p>
    <button class="pixel-button pixel-button--ghost" type="button" @click="emit('spawnSaki')">
      测试祥子
    </button>
    <button class="pixel-button pixel-button--ghost" type="button" @click="emit('spawnMisumi')">
      测试初华
    </button>
    <button class="pixel-button pixel-button--ghost" type="button" @click="emit('close')">
      退出测试
    </button>
  </aside>
</template>
