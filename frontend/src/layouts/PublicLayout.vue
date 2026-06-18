<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">
        {{ siteTitle }}
      </RouterLink>
      <nav>
        <RouterLink to="/">文章</RouterLink>
        <RouterLink to="/about">关于我</RouterLink>
        <RouterLink to="/admin">后台</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer">
      <span>{{ siteDescription }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
const siteTitle = import.meta.env.VITE_SITE_TITLE || '我的独立博客'
const siteDescription = import.meta.env.VITE_SITE_DESCRIPTION || '记录技术、生活与长期思考。'
</script>
