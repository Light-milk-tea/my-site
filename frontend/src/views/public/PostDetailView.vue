<template>
  <article v-if="post" class="post-detail">
    <RouterLink class="back-link" to="/">返回文章列表</RouterLink>
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

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })
const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(false)
const html = computed(() => markdown.render(post.value?.content || ''))

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

onMounted(async () => {
  loading.value = true
  try {
    post.value = await blogApi.getPost(String(route.params.slug))
    document.title = post.value.seoTitle || post.value.title
  } finally {
    loading.value = false
  }
})
</script>
