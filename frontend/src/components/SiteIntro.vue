<template>
  <Transition name="intro">
    <section v-if="shouldRender" class="site-intro" aria-hidden="true">
      <div class="site-intro__field">
        <span class="site-intro__ring" />
        <span class="site-intro__core" />
        <span v-for="index in dustCount" :key="index" class="site-intro__dust" />
      </div>
    </section>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const shouldRender = ref(false)
const dustCount = 42
let leaveTimer: number | undefined

const isPublicRoute = computed(() => !route.path.startsWith('/admin') && route.name !== 'login')

function clearLeaveTimer() {
  if (leaveTimer) {
    window.clearTimeout(leaveTimer)
    leaveTimer = undefined
  }
}

function startIntro() {
  clearLeaveTimer()
  shouldRender.value = true
  leaveTimer = window.setTimeout(() => {
    shouldRender.value = false
  }, 1180)
}

watch(
  isPublicRoute,
  (visible) => {
    if (visible) {
      startIntro()
      return
    }
    clearLeaveTimer()
    shouldRender.value = false
  },
  { immediate: true },
)

onBeforeUnmount(clearLeaveTimer)
</script>

<style lang="scss" scoped>
@use 'sass:math';

$bg: #f8f3ee;
$ink: #28231f;
$primary: #c4788b;
$accent: #f0a7b5;
$dust-total: 42;

.site-intro {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 50% 50%, rgba($primary, 0.12), transparent 28%),
    linear-gradient(135deg, rgba(#fff, 0.86), rgba($bg, 0.96));
  pointer-events: none;
}

.site-intro__field {
  position: relative;
  width: min(44vw, 360px);
  aspect-ratio: 1;
  transform: translateY(-2vh);
  animation: intro-field 1180ms cubic-bezier(0.2, 0.78, 0.18, 1) both;
}

.site-intro__ring,
.site-intro__core,
.site-intro__dust {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 999px;
}

.site-intro__ring {
  width: 148px;
  height: 148px;
  margin: -74px 0 0 -74px;
  border: 1px solid rgba($ink, 0.16);
  box-shadow:
    0 0 60px rgba($primary, 0.2),
    inset 0 0 32px rgba(#fff, 0.74);
  animation: intro-ring 960ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.site-intro__core {
  width: 18px;
  height: 18px;
  margin: -9px 0 0 -9px;
  background: $ink;
  box-shadow: 0 0 36px rgba($primary, 0.46);
  animation: intro-core 960ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.site-intro__dust {
  $base-delay: 110ms;

  @for $i from 1 through $dust-total {
    &:nth-of-type(#{$i + 2}) {
      $angle: math.div(360deg, $dust-total) * $i;
      $distance: 78px + (($i % 7) * 13px);
      $size: 2px + (($i % 4) * 0.9px);
      $dust-color: $primary;

      @if $i % 3 == 0 {
        $dust-color: $accent;
      }

      width: $size;
      height: $size;
      margin: math.div(-$size, 2) 0 0 math.div(-$size, 2);
      --dust-x: #{math.cos($angle) * $distance};
      --dust-y: #{math.sin($angle) * $distance};
      --dust-out-x: #{math.cos($angle) * $distance * 1.45};
      --dust-out-y: #{math.sin($angle) * $distance * 1.45};
      background: $dust-color;
      box-shadow: 0 0 (12px + $size * 2) rgba($dust-color, 0.58);
      animation: intro-dust 920ms cubic-bezier(0.19, 1, 0.22, 1) #{$base-delay + $i * 8ms} both;
    }
  }
}

.intro-leave-active {
  transition:
    opacity 360ms ease,
    filter 360ms ease;
}

.intro-leave-to {
  opacity: 0;
  filter: blur(10px);
}

.intro-leave-active .site-intro__ring {
  animation: intro-ring-out 360ms ease both;
}

.intro-leave-active .site-intro__core {
  animation: intro-core-out 360ms ease both;
}

.intro-leave-active .site-intro__dust {
  animation: intro-dust-out 360ms ease both;
}

@keyframes intro-field {
  0% {
    transform: translateY(-2vh) scale(0.96);
  }
  100% {
    transform: translateY(-2vh) scale(1);
  }
}

@keyframes intro-ring {
  0% {
    opacity: 0;
    transform: scale(0.62) rotate(-18deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

@keyframes intro-core {
  0% {
    opacity: 0;
    transform: scale(0.35);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes intro-dust {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(0.3);
  }
  55% {
    opacity: 1;
  }
  100% {
    opacity: 0.86;
    transform: translate3d(var(--dust-x), var(--dust-y), 0) scale(1);
  }
}

@keyframes intro-ring-out {
  to {
    opacity: 0;
    transform: scale(1.36);
  }
}

@keyframes intro-core-out {
  to {
    opacity: 0;
    transform: scale(0.4);
  }
}

@keyframes intro-dust-out {
  to {
    opacity: 0;
    transform: translate3d(var(--dust-out-x), var(--dust-out-y), 0) scale(0.72);
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-intro {
    display: none;
  }
}
</style>
