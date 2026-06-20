<template>
  <el-container class="admin-layout">
    <el-aside width="220px">
      <h2>博客后台</h2>
      <el-menu router :default-active="$route.path">
        <el-menu-item index="/admin/posts">文章管理</el-menu-item>
        <el-menu-item index="/admin/taxonomies">分类标签</el-menu-item>
      </el-menu>
      <div class="admin-actions">
        <el-button plain @click="goHome">返回首页</el-button>
        <el-button class="logout" type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </el-aside>

    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function goHome() {
  router.push('/')
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
