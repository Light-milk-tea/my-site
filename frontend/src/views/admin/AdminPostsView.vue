<template>
  <div class="admin-page">
    <div class="page-heading">
      <h1>文章管理</h1>
      <el-button type="primary" @click="$router.push('/admin/posts/new')">新建文章</el-button>
    </div>

    <el-table :data="posts" v-loading="loading">
      <el-table-column prop="title" label="标题" min-width="220" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { blogApi } from '../../api/client'
import type { Post } from '../../api/types'

const posts = ref<Post[]>([])
const loading = ref(false)

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
