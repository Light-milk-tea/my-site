<template>
  <section class="hero-card compact">
    <p class="eyebrow">Categories</p>
    <h1>分类</h1>
    <p>从主题进入文章，慢慢翻阅。</p>
  </section>

  <section class="taxonomy-grid">
    <RouterLink
      v-for="item in categories"
      :key="item.id"
      class="taxonomy-card"
      :to="{ path: '/posts', query: { category: item.slug } }"
    >
      <span>{{ item.name }}</span>
      <small>{{ item.description || `${item._count?.posts || 0} 篇文章` }}</small>
    </RouterLink>
    <el-empty v-if="!loading && categories.length === 0" description="暂无分类" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { blogApi } from '../../api/client'
import type { Category } from '../../api/types'
import { useSeo } from '../../utils/seo'

const categories = ref<Category[]>([])
const loading = ref(false)

useSeo({
  title: '分类',
  description: '按主题浏览轻茗博客的文章分类，从更稳定的主题进入文章归档。',
  path: '/categories',
})

onMounted(async () => {
  loading.value = true
  try {
    categories.value = await blogApi.getCategories()
  } catch {
    categories.value = []
  } finally {
    loading.value = false
  }
})
</script>
