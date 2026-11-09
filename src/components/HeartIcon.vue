<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** true = 满心，false = 空心槽 */
    filled?: boolean
  }>(),
  { filled: true },
)
</script>

<template>
  <svg
    class="heart-icon"
    :class="{ 'heart-icon--empty': !props.filled }"
    viewBox="0 0 48 48"
    aria-hidden="true"
    focusable="false"
  >
    <path
      class="heart-icon__shape"
      d="M24 42C20 39 5 27 5 16.5C5 10 10 5 16.6 5C20 5 22.7 6.7 24 9.2C25.3 6.7 28 5 31.4 5C38 5 43 10 43 16.5C43 27 28 39 24 42Z"
    />
    <ellipse
      v-if="props.filled"
      class="heart-icon__glint"
      cx="15.5"
      cy="14.4"
      rx="3.4"
      ry="2.1"
      transform="rotate(-35 15.5 14.4)"
    />
  </svg>
</template>

<style scoped>
.heart-icon {
  display: block;
  overflow: visible;
}

.heart-icon__shape {
  fill: #e5383b;
  stroke: #14161a;
  stroke-width: 4;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.heart-icon--empty .heart-icon__shape {
  fill: none;
}

.heart-icon__glint {
  fill: #ffc9c9;
  opacity: 0.9;
}
</style>
