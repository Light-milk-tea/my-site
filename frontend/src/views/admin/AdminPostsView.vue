<template>
  <div class="admin-page">
    <div class="page-heading">
      <div>
        <p class="page-kicker">Content</p>
        <h1>文章管理</h1>
        <p class="page-subtitle">集中维护博客文章，快速查看发布状态、分类和最近更新时间。</p>
      </div>
      <el-button type="primary" class="admin-primary-button" @click="$router.push('/admin/posts/new')">
        新建文章
      </el-button>
    </div>

    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <span>全部文章</span>
        <strong>{{ posts.length }}</strong>
      </div>
      <div class="admin-stat-card">
        <span>已发布</span>
        <strong>{{ publishedCount }}</strong>
      </div>
      <div class="admin-stat-card">
        <span>草稿</span>
        <strong>{{ draftCount }}</strong>
      </div>
    </div>

    <el-card class="admin-panel">
      <template #header>
        <div class="panel-header">
          <span>文章列表</span>
          <small>{{ loading ? '正在同步数据...' : `共 ${posts.length} 篇` }}</small>
        </div>
      </template>
      <el-table :data="posts" v-loading="loading" class="admin-table">
        <el-table-column prop="title" label="标题" min-width="220" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'" effect="light" round>
              {{ row.status === 'PUBLISHED' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="140">
          <template #default="{ row }">{{ row.category?.name || '-' }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="{ row }">{{ formatDate(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button text type="primary" @click="$router.push(`/admin/posts/${row.id}/edit`)">
              编辑
            </el-button>
            <el-button text type="danger" @click="remove(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { blogApi } from '../../api/client'
import type { Post } from '../../api/types'

const posts = ref<Post[]>([])
const loading = ref(false)
const publishedCount = computed(() => posts.value.filter((post) => post.status === 'PUBLISHED').length)
const draftCount = computed(() => posts.value.filter((post) => post.status === 'DRAFT').length)

async function loadPosts() {
  loading.value = true
  try {
    posts.value = await blogApi.getAdminPosts()
  } finally {
    loading.value = false
  }
}

async function remove(id: string) {
  await ElMessageBox.confirm('确认删除这篇文章吗？', '删除文章', {
    type: 'warning',
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    customClass: 'delete-confirm-dialog',
  })
  await blogApi.deletePost(id)
  ElMessage.success('已删除')
  await loadPosts()
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

onMounted(loadPosts)
</script>
