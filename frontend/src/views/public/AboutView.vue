<template>
  <section class="about-view">
    <section class="about-main">
      <h1 class="about-title">About</h1>
      <article class="about-article">
        <p>你好，我是轻茗。这里是我的个人独立博客，用来整理技术实践、生活观察和一些需要慢慢想清楚的问题。</p>
        <p>
          我希望这里的文章不是一次性的信息流，而是能被反复翻阅的笔记：记录问题如何出现、方案如何取舍、以及当时为什么这么判断。
        </p>
        <p>
          你可以从文章、分类或标签进入不同主题。如果你也在维护个人站点，欢迎通过友链页交换链接，或在文章中找到共同感兴趣的话题。
        </p>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useSeo } from '../../utils/seo'

useSeo({
  title: '关于轻茗',
  description: '了解轻茗和 QingMing’s Blog 的写作方向：技术实践、生活观察与长期思考。',
  path: '/about',
})
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
