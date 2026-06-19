<template>
  <section class="about-view">
    <section class="about-main">
      <h1 class="about-title">About</h1>
      <article class="about-article">
        <p>这里是轻茗的个人博客</p>
        <p>希望能留下点什么东西</p>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.about-view {
  width: min(920px, 100%);
  margin: 20px auto 64px;
}

.about-main {
  display: block;
}

.about-title {
  margin: 0 0 20px;
  font-size: clamp(40px, 8vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.about-article {
  width: 100%;
  border: 1px solid rgba(196, 120, 139, 0.14);
  border-radius: 26px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 250, 248, 0.9)),
    var(--panel);
  box-shadow: 0 18px 48px rgba(73, 47, 28, 0.06);
}

.about-article {
  padding: 30px 28px;

  p {
    margin: 0 0 18px;
    color: #5f544f;
    line-height: 1.9;
  }

  p:last-child {
    margin-bottom: 0;
  }
}

@media (max-width: 620px) {
  .about-article {
    padding: 18px;
    border-radius: 20px;
  }

  .about-view {
    margin: 20px auto 48px;
  }
}
</style>
