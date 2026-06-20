<template>
  <section class="notes-page">
    <section class="notes-layout">
      <main class="notes-main">
        <header class="notes-hero">
          <p class="notes-kicker">Notes</p>
          <p class="notes-intro">整理技术、生活与长期思考，按笔记目录的方式来浏览与归档。</p>
          <div class="notes-status">
            <span>{{ loading ? '正在同步内容...' : `当前共 ${posts.length} 篇文章` }}</span>
            <span v-if="activeCategoryName">分类：{{ activeCategoryName }}</span>
            <span v-if="activeTagName">标签：# {{ activeTagName }}</span>
          </div>
        </header>

        <section class="notes-list" aria-label="文章列表">
          <article v-for="post in posts" :key="post.id" class="note-card">
            <div class="note-meta">
              <span>{{ formatDate(post.publishedAt || post.createdAt) }}</span>
              <span v-if="post.category">{{ post.category.name }}</span>
            </div>

            <RouterLink :to="`/posts/${post.slug}`" class="note-title">
              <h2>{{ post.title }}</h2>
            </RouterLink>

            <p class="note-summary">{{ post.summary || '这篇文章还没有摘要。' }}</p>

            <div v-if="post.tags.length" class="note-tags">
              <span v-for="item in post.tags" :key="item.id"># {{ item.name }}</span>
            </div>
          </article>

          <section v-if="!loading && posts.length === 0" class="notes-empty">
            <el-empty description="暂无文章" />
          </section>
        </section>
      </main>

      <aside class="notes-sidebar">
        <div class="notes-search-panel">
          <p class="notes-kicker">Search</p>
          <h2>快速检索</h2>
          <el-input v-model="keyword" clearable placeholder="搜索文章标题或关键词" class="notes-search" />
        </div>

        <div class="notes-filter-group">
          <div class="notes-filter-header">
            <p class="notes-kicker">Category</p>
            <h3>分类</h3>
          </div>
          <div class="notes-chips">
            <button :class="{ active: !category }" @click="category = ''">全部</button>
            <button
              v-for="item in categories"
              :key="item.id"
              :class="{ active: category === item.slug }"
              @click="category = item.slug"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <div class="notes-filter-group">
          <div class="notes-filter-header">
            <p class="notes-kicker">Tag</p>
            <h3>标签</h3>
          </div>
          <div class="notes-chips">
            <button :class="{ active: !tag }" @click="tag = ''">全部</button>
            <button
              v-for="item in tags"
              :key="item.id"
              :class="{ active: tag === item.slug }"
              @click="tag = item.slug"
            >
              # {{ item.name }}
            </button>
          </div>
        </div>
      </aside>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogApi } from '../../api/client'
import type { Category, Post, Tag } from '../../api/types'
import { useSeo } from '../../utils/seo'

const route = useRoute()
const router = useRouter()
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const loading = ref(false)
const category = ref(typeof route.query.category === 'string' ? route.query.category : '')
const tag = ref(typeof route.query.tag === 'string' ? route.query.tag : '')
const keyword = ref(typeof route.query.keyword === 'string' ? route.query.keyword : '')
const activeCategoryName = computed(() => categories.value.find((item) => item.slug === category.value)?.name || '')
const activeTagName = computed(() => tags.value.find((item) => item.slug === tag.value)?.name || '')
let searchTimer: number | undefined

useSeo({
  title: '文章',
  description: '浏览轻茗的技术、生活与长期思考笔记，可按分类、标签和关键词检索。',
  path: '/posts',
})

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

function syncQuery() {
  const query = {
    ...(category.value ? { category: category.value } : {}),
    ...(tag.value ? { tag: tag.value } : {}),
    ...(keyword.value ? { keyword: keyword.value } : {}),
  }

  void router.replace({ path: '/posts', query }).catch(() => undefined)
}

function scheduleLoadPosts() {
  if (searchTimer) {
    window.clearTimeout(searchTimer)
  }
  searchTimer = window.setTimeout(() => {
    void loadPosts()
  }, 300)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

watch([category, tag], () => {
  syncQuery()
  void loadPosts()
})

watch(keyword, () => {
  syncQuery()
  scheduleLoadPosts()
})

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

onBeforeUnmount(() => {
  if (searchTimer) {
    window.clearTimeout(searchTimer)
  }
})
</script>

<style scoped lang="scss">
.notes-page {
  width: min(1120px, 100%);
  margin: 32px auto 64px;
}

.notes-kicker {
  margin: 0;
  color: var(--muted);
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.notes-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 44px;
  align-items: start;
}

.notes-main {
  min-width: 0;
}

.notes-sidebar {
  position: sticky;
  top: 32px;
  display: grid;
  gap: 18px;
}

.notes-intro {
  max-width: 680px;
  margin: 0;
  color: var(--muted);
  font-size: 1.03rem;
  line-height: 1.9;
}

.notes-hero {
  margin-bottom: 18px;
  padding: 8px 0 28px;
  border-bottom: 1px solid rgba(196, 120, 139, 0.18);
}

.notes-status {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;

  span {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 14px;
    color: #5a4b45;
    font-size: 0.92rem;
    background: rgba(255, 250, 248, 0.92);
    border: 1px solid rgba(196, 120, 139, 0.15);
    border-radius: 999px;
  }
}

.notes-search-panel,
.notes-filter-group {
  padding: 22px 24px;
  background: rgba(255, 250, 248, 0.72);
  border: 1px solid rgba(196, 120, 139, 0.16);
  border-radius: 22px;
  box-shadow: 0 16px 42px rgba(73, 47, 28, 0.05);
}

.notes-search-panel {
  h2 {
    margin: 8px 0 14px;
    font-size: 1.3rem;
  }
}

.notes-search {
  :deep(.el-input__wrapper) {
    min-height: 46px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0 1px rgba(196, 120, 139, 0.08) inset;
    border-radius: 14px;
  }
}

.notes-filter-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h3 {
    margin: 0;
    font-size: 1.15rem;
  }
}

.notes-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  button {
    padding: 8px 14px;
    color: #705f58;
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid rgba(196, 120, 139, 0.14);
    border-radius: 999px;
    cursor: pointer;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      color 180ms ease,
      background 180ms ease;

    &:hover,
    &.active {
      color: #fff;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border-color: transparent;
      transform: translateY(-1px);
    }
  }
}

.notes-list {
  display: grid;
  gap: 18px;
  min-width: 0;
}

.note-card {
  padding: 28px 0 26px;
  border-bottom: 1px solid rgba(196, 120, 139, 0.14);

  &:first-child {
    padding-top: 4px;
  }
}

.note-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
  color: var(--muted);
  font-size: 0.92rem;

  span {
    position: relative;
  }

  span + span::before {
    margin-right: 12px;
    content: '·';
    color: rgba(123, 112, 106, 0.7);
  }
}

.note-title {
  display: inline-block;
  margin-bottom: 10px;

  h2 {
    margin: 0;
    font-size: clamp(28px, 4vw, 34px);
    line-height: 1.18;
    letter-spacing: -0.02em;
    transition: color 180ms ease;
  }

  &:hover h2 {
    color: var(--primary-dark);
  }
}

.note-summary {
  margin: 0;
  color: #5f544f;
  line-height: 1.95;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;

  span {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    color: #705f58;
    font-size: 0.9rem;
    background: rgba(255, 250, 248, 0.88);
    border: 1px solid rgba(196, 120, 139, 0.12);
    border-radius: 999px;
  }
}

.notes-empty {
  padding: 30px 0 10px;
}

@media (max-width: 720px) {
  .notes-page {
    margin: 20px auto 48px;
  }

  .notes-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .notes-sidebar {
    position: static;
    order: -1;
  }

  .notes-search-panel,
  .notes-filter-group {
    padding: 18px;
    border-radius: 18px;
  }

  .notes-filter-header {
    align-items: start;
    flex-direction: column;
  }

  .note-card {
    padding: 24px 0 22px;
  }

  .note-title h2 {
    font-size: 1.7rem;
  }
}
</style>
