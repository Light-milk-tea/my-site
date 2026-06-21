<template>
  <section class="about-view">
    <section class="about-main">
      <h1 class="about-title">About</h1>
      <article class="about-article">
        <p>你好，我是轻茗。</p>
        <p>喜欢前端开发和 AI coding，是杭州电子科技大学的一名本科生。</p>
        <p>我会把这个独立博客作为长期记录的写作空间，慢慢积累技术笔记、学习过程和一些值得反复回看的想法。</p>
        <div class="about-tags" aria-label="关于我的标签">
          <span
            v-for="tag in aboutTags"
            :key="tag.label"
            class="about-tag"
            :class="`about-tag--${tag.variant}`"
          >
            {{ tag.label }}
          </span>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useSeo } from '../../utils/seo'

const aboutTags = [
  { label: '轻茗', variant: 'rose' },
  { label: '前端开发', variant: 'sky' },
  { label: 'AI coding', variant: 'violet' },
  { label: '杭电本科生', variant: 'mint' },
  { label: '长期写作', variant: 'amber' },
]

useSeo({
  title: '关于轻茗',
  description: '了解轻茗：热爱前端开发与 AI coding 的杭电本科生，正在把独立博客当作长期写作空间。',
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
  position: relative;
  display: inline-block;
  margin: 0 0 20px;
  font-size: clamp(42px, 8vw, 68px);
  line-height: 1.02;
  font-weight: 850;
  letter-spacing: -0.04em;
  color: transparent;
  background: linear-gradient(115deg, #2f2926 0%, #6f5660 42%, #c4788b 100%);
  background-clip: text;
  -webkit-background-clip: text;
}

.about-title::after {
  position: absolute;
  right: 2px;
  bottom: -10px;
  left: 2px;
  height: 2px;
  content: '';
  background: linear-gradient(90deg, rgba(196, 120, 139, 0), rgba(196, 120, 139, 0.45), rgba(196, 120, 139, 0));
  border-radius: 999px;
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
    margin-bottom: 18px;
  }
}

.about-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  margin-top: 6px;
  align-items: flex-start;
}

.about-tag {
  --tag-accent: rgba(143, 127, 121, 0.55);
  --tag-border: rgba(122, 104, 96, 0.12);
  --tag-border-strong: rgba(122, 104, 96, 0.18);
  --tag-bg-top: rgba(255, 253, 251, 0.98);
  --tag-bg-bottom: rgba(247, 242, 238, 0.95);
  --tag-text: #564b46;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  gap: 12px;
  padding: 10px 16px 10px 13px;
  border-radius: 18px;
  overflow: hidden;
  color: var(--tag-text);
  font-size: 0.91rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.02em;
  border: 1px solid var(--tag-border);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0) 38%),
    linear-gradient(180deg, var(--tag-bg-top), var(--tag-bg-bottom));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.84),
    inset 0 -1px 0 rgba(196, 120, 139, 0.04),
    0 8px 20px rgba(95, 84, 79, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.about-tag::before {
  width: 3px;
  height: 14px;
  flex: none;
  content: '';
  background: var(--tag-accent);
  border-radius: 999px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.about-tag::after {
  position: absolute;
  inset: 1px;
  content: '';
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent 58%);
  pointer-events: none;
}

.about-tag:hover {
  transform: translateY(-1px);
  border-color: var(--tag-border-strong);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    inset 0 -1px 0 rgba(196, 120, 139, 0.05),
    0 12px 24px rgba(95, 84, 79, 0.08);
}

.about-tag--rose {
  --tag-accent: rgba(155, 128, 131, 0.58);
  --tag-border: rgba(136, 112, 114, 0.11);
  --tag-border-strong: rgba(136, 112, 114, 0.17);
  --tag-bg-top: rgba(253, 250, 249, 0.98);
  --tag-bg-bottom: rgba(246, 240, 238, 0.95);
  --tag-text: #5f5350;
}

.about-tag--sky {
  --tag-accent: rgba(129, 142, 153, 0.56);
  --tag-border: rgba(116, 128, 138, 0.11);
  --tag-border-strong: rgba(116, 128, 138, 0.17);
  --tag-bg-top: rgba(252, 252, 251, 0.98);
  --tag-bg-bottom: rgba(243, 245, 244, 0.95);
  --tag-text: #585452;
}

.about-tag--violet {
  --tag-accent: rgba(137, 129, 149, 0.56);
  --tag-border: rgba(124, 116, 136, 0.11);
  --tag-border-strong: rgba(124, 116, 136, 0.17);
  --tag-bg-top: rgba(252, 251, 252, 0.98);
  --tag-bg-bottom: rgba(244, 241, 243, 0.95);
  --tag-text: #595250;
}

.about-tag--mint {
  --tag-accent: rgba(129, 144, 134, 0.56);
  --tag-border: rgba(116, 129, 120, 0.11);
  --tag-border-strong: rgba(116, 129, 120, 0.17);
  --tag-bg-top: rgba(252, 252, 250, 0.98);
  --tag-bg-bottom: rgba(242, 245, 241, 0.95);
  --tag-text: #57534f;
}

.about-tag--amber {
  --tag-accent: rgba(156, 140, 117, 0.58);
  --tag-border: rgba(141, 126, 105, 0.11);
  --tag-border-strong: rgba(141, 126, 105, 0.17);
  --tag-bg-top: rgba(253, 251, 248, 0.98);
  --tag-bg-bottom: rgba(246, 242, 236, 0.95);
  --tag-text: #5d544e;
}

@media (max-width: 620px) {
  .about-article {
    padding: 18px;
    border-radius: 20px;
  }

  .about-tags {
    gap: 8px 10px;
  }

  .about-tag {
    min-height: 38px;
    gap: 10px;
    padding: 8px 14px 8px 11px;
    font-size: 0.88rem;
  }

  .about-tag::before {
    height: 12px;
  }

  .about-view {
    margin: 20px auto 48px;
  }
}
</style>
