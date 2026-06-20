<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">
        {{ siteTitle }}
      </RouterLink>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/posts">Posts</RouterLink>
        <RouterLink to="/friends">Friends</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer">
      <span>© {{ currentYear }} {{ siteTitle }}</span>
      <div class="site-footer-links">
        <RouterLink to="/login">Admin</RouterLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const siteTitle = import.meta.env.VITE_SITE_TITLE || "QingMing's Blog"
const currentYear = new Date().getFullYear()
</script>
