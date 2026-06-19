<template>
  <section class="profile-home" aria-labelledby="profile-name">
    <div class="profile-orbit" aria-hidden="true" />
    <div class="profile-avatar">
      <img :src="avatarUrl" alt="个人头像" />
    </div>
    <p class="eyebrow">Personal Blog</p>
    <h1 id="profile-name">{{ profileName }}</h1>
    <p class="profile-tagline">{{ profileTagline }}</p>
    <div class="profile-actions" aria-label="快速导航">
      <RouterLink to="/posts">阅读文章</RouterLink>
      <RouterLink to="/friends">友情链接</RouterLink>
      <RouterLink to="/about">关于我</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import avatarUrl from '../../assets/avatar.jpg'

const profileName = '轻茗'
const profileTagline = '在技术、生活与长期思考之间，留下缓慢但真实的记录。'
</script>
