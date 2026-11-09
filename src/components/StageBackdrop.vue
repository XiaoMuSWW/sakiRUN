<template>
  <!-- 纯装饰层：四层视差背景，越靠前滚动越快，营造向后退去的速度感 -->
  <div class="backdrop" aria-hidden="true">
    <div class="backdrop__layer backdrop__hills-far" />
    <div class="backdrop__layer backdrop__hills-near" />
    <div class="backdrop__layer backdrop__clouds-far" />
    <div class="backdrop__layer backdrop__clouds-near" />
  </div>
</template>
