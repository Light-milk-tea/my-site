<template>
  <section class="friends-page">
    <header class="friends-hero">
      <h1>friend</h1>
    </header>

    <section class="friends-grid" aria-label="友情链接卡片">
      <article
        v-for="(item, index) in friends"
        :key="item.url || `${item.name}-${index}`"
        class="friend-card"
        :class="{ 'friend-card--link': !!item.url }"
        @click="openFriend(item.url)"
      >
        <div class="friend-card-copy">
          <div class="friend-card-head">
            <img v-if="item.avatar" :src="item.avatar" :alt="item.name" class="friend-card-avatar friend-card-avatar--image" />
            <div v-else class="friend-card-avatar">{{ item.initial }}</div>
            <h3>{{ item.name }}</h3>
          </div>
          <p>{{ item.description }}</p>
          <span>{{ item.domain }}</span>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import avatarUrl from '../../assets/avatar.jpg'

const friends = [
  {
    name: "QingMing's Blog",
    initial: 'Q',
    description: '在技术、生活与长期思考之间，留下缓慢但真实的记录。',
    domain: '175.27.249.38',
    avatar: avatarUrl,
    url: 'http://175.27.249.38/',
  },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
  { name: 'Coming Soon', initial: 'A', description: '这里预留给未来会加入的朋友站点。', domain: 'friend-site.com' },
]

function openFriend(url?: string) {
  if (!url) return
  window.location.assign(url)
}

</script>


<style scoped lang="scss">
.friends-page {
  width: min(1100px, 100%);
  margin: 28px auto 64px;
}

.friends-hero {
  margin-bottom: 30px;
  text-align: center;

  h1 {
    margin: 0;
    font-size: clamp(38px, 7vw, 62px);
    line-height: 1.06;
    letter-spacing: -0.03em;
    text-transform: lowercase;
  }
}

.friend-card {
  display: grid;
  min-height: 190px;
  padding: 18px 18px 16px;
  border: 1px solid rgba(196, 120, 139, 0.14);
  border-radius: 26px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 250, 248, 0.9)),
    var(--panel);
  box-shadow: 0 18px 48px rgba(73, 47, 28, 0.06);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    border-color: rgba(196, 120, 139, 0.28);
    box-shadow: 0 22px 54px rgba(73, 47, 28, 0.08);
    transform: translateY(-3px);
  }
}

.friend-card--link {
  cursor: pointer;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.friend-card-avatar {
  display: grid;
  width: 48px;
  height: 48px;
  flex: none;
  color: var(--primary-dark);
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, rgba(240, 167, 181, 0.26), rgba(255, 255, 255, 0.9));
  border: 1px solid rgba(196, 120, 139, 0.12);
  border-radius: 20px;
  place-items: center;
}

.friend-card-avatar--image {
  object-fit: cover;
  border-radius: 18px;
}

.friend-card-copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;

  h3 {
    margin: 0;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #5f544f;
    line-height: 1.7;
  }

  span {
    display: inline-block;
    margin-top: 8px;
    color: var(--muted);
    font-size: 0.88rem;
  }
}

.friend-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  min-width: 0;
}

@media (max-width: 820px) {
  .friends-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .friends-page {
    margin: 18px auto 48px;
  }

  .friends-grid {
    grid-template-columns: 1fr;
  }

  .friend-card {
    padding: 18px;
    border-radius: 20px;
  }
}
</style>
