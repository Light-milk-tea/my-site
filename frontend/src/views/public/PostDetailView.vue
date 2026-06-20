<template>
  <article v-if="post" class="post-detail">
    <RouterLink class="back-link" to="/posts">返回文章列表</RouterLink>
    <header class="post-detail-header">
      <p class="eyebrow">Article</p>
      <h1>{{ post.title }}</h1>
      <p class="summary">{{ post.summary }}</p>
      <div class="meta post-meta">
        <span class="meta-pill">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
        <span v-if="post.category" class="meta-pill">{{ post.category.name }}</span>
        <span v-for="tag in post.tags" :key="tag.id" class="meta-pill"># {{ tag.name }}</span>
      </div>
    </header>
    <div class="post-divider" aria-hidden="true" />
    <div class="markdown-shell">
      <div class="markdown-body" v-html="html" />
    </div>
  </article>
  <el-empty v-else-if="!loading" description="文章不存在或尚未发布" />
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi } from '../../api/client'
import type { Post } from '../../api/types'
import { useSeo } from '../../utils/seo'

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })
const defaultLinkOpen = markdown.renderer.rules.link_open
markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const href = token.attrGet('href') || ''
  if (/^https?:\/\//i.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen ? defaultLinkOpen(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
}
const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(false)
const html = computed(() => markdown.render(post.value?.content || ''))

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

onMounted(async () => {
  loading.value = true
  try {
    post.value = await blogApi.getPost(String(route.params.slug))
    useSeo({
      title: post.value.seoTitle || post.value.title,
      description: post.value.summary || `${post.value.title} - 轻茗的个人博客文章。`,
      path: `/posts/${post.value.slug}`,
      image: post.value.cover,
      type: 'article',
    })
  } finally {
    loading.value = false
  }
})
</script>
