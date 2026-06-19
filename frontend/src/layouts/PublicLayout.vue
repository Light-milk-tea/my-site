<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">
        {{ siteTitle }}
      </RouterLink>
      <nav>
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/posts">文章</RouterLink>
        <RouterLink to="/categories">分类</RouterLink>
        <RouterLink to="/tags">标签</RouterLink>
        <RouterLink to="/friends">友链</RouterLink>
        <RouterLink to="/about">关于我</RouterLink>
        <RouterLink to="/admin">后台</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
const siteTitle = import.meta.env.VITE_SITE_TITLE || '我的独立博客'
</script>
