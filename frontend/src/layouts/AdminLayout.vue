<template>
  <el-container class="admin-layout">
    <el-aside width="220px">
      <div class="admin-brand">
        <span class="admin-brand__mark">B</span>
        <div>
          <p>Blog Studio</p>
          <h2>博客后台</h2>
        </div>
      </div>
      <el-menu router :default-active="$route.path" class="admin-menu">
        <el-menu-item index="/admin/posts">
          <span class="admin-menu__dot" />
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/taxonomies">
          <span class="admin-menu__dot" />
          <span>分类标签</span>
        </el-menu-item>
      </el-menu>
      <div class="admin-actions">
        <el-button plain @click="goHome">返回首页</el-button>
        <el-button class="logout" type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </el-aside>

    <el-main>
      <div class="admin-main-shell">
        <RouterView />
      </div>
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
