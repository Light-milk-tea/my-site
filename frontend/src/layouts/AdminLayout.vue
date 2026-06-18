<template>
  <el-container class="admin-layout">
    <el-aside width="220px">
      <h2>博客后台</h2>
      <el-menu router :default-active="$route.path">
        <el-menu-item index="/admin/posts">文章管理</el-menu-item>
        <el-menu-item index="/admin/taxonomies">分类标签</el-menu-item>
      </el-menu>
      <el-button class="logout" type="danger" plain @click="logout">退出登录</el-button>
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

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
