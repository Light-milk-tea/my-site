<template>
  <section class="hero-card">
    <p class="eyebrow">Personal Blog</p>
    <h1>{{ siteTitle }}</h1>
    <p>{{ siteDescription }}</p>
  </section>

  <section class="content-grid">
    <aside class="filters">
      <h3>分类</h3>
      <button :class="{ active: !category }" @click="category = ''">全部</button>
      <button
        v-for="item in categories"
        :key="item.id"
        :class="{ active: category === item.slug }"
        @click="category = item.slug"
      >
        {{ item.name }}
      </button>

      <h3>标签</h3>
      <button :class="{ active: !tag }" @click="tag = ''">全部</button>
      <button
        v-for="item in tags"
        :key="item.id"
        :class="{ active: tag === item.slug }"
        @click="tag = item.slug"
      >
        # {{ item.name }}
      </button>
    </aside>

    <div class="post-list">
      <el-input v-model="keyword" clearable placeholder="搜索文章" />

      <article v-for="post in posts" :key="post.id" class="post-card">
        <RouterLink :to="`/posts/${post.slug}`">
          <h2>{{ post.title }}</h2>
        </RouterLink>
        <p>{{ post.summary || '这篇文章还没有摘要。' }}</p>
        <div class="meta">
          <span>{{ formatDate(post.publishedAt || post.createdAt) }}</span>
          <span v-if="post.category">{{ post.category.name }}</span>
          <span v-for="item in post.tags" :key="item.id"># {{ item.name }}</span>
        </div>
      </article>

      <el-empty v-if="!loading && posts.length === 0" description="暂无文章" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { blogApi } from '../../api/client'
import type { Category, Post, Tag } from '../../api/types'

const siteTitle = import.meta.env.VITE_SITE_TITLE || '我的独立博客'
const siteDescription = import.meta.env.VITE_SITE_DESCRIPTION || '记录技术、生活与长期思考。'
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const loading = ref(false)
const category = ref('')
const tag = ref('')
const keyword = ref('')

async function loadPosts() {
  loading.value = true
  try {
    const result = await blogApi.getPosts({
      category: category.value || undefined,
      tag: tag.value || undefined,
      keyword: keyword.value || undefined,
    })
    posts.value = result.items
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

watch([category, tag, keyword], loadPosts)

onMounted(async () => {
  try {
    const [categoryList, tagList] = await Promise.all([blogApi.getCategories(), blogApi.getTags()])
    categories.value = categoryList
    tags.value = tagList
  } catch {
    categories.value = []
    tags.value = []
  }
  await loadPosts()
})
</script>
