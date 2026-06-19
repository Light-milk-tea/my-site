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
        <RouterLink to="/admin">Admin</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
const siteTitle = import.meta.env.VITE_SITE_TITLE || "QingMing's Blog"
</script>
