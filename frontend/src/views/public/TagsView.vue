<template>
  <section class="hero-card compact">
    <p class="eyebrow">Tags</p>
    <h1>标签</h1>
    <p>用更细的关键词连接笔记和文章。</p>
  </section>

  <section class="tag-cloud">
    <RouterLink
      v-for="item in tags"
      :key="item.id"
      class="tag-pill"
      :to="{ path: '/posts', query: { tag: item.slug } }"
    >
      # {{ item.name }}
    </RouterLink>
    <el-empty v-if="!loading && tags.length === 0" description="暂无标签" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { blogApi } from '../../api/client'
import type { Tag } from '../../api/types'
import { useSeo } from '../../utils/seo'

const tags = ref<Tag[]>([])
const loading = ref(false)

useSeo({
  title: '标签',
  description: '按关键词浏览轻茗博客的文章标签，连接不同主题下的笔记和文章。',
  path: '/tags',
})

onMounted(async () => {
  loading.value = true
  try {
    tags.value = await blogApi.getTags()
  } catch {
    tags.value = []
  } finally {
    loading.value = false
  }
})
</script>
