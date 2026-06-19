<template>
  <div class="login-page">
    <RouterLink to="/" class="login-home-link">回到首页</RouterLink>
    <div class="login-orb login-orb-left" aria-hidden="true" />
    <div class="login-orb login-orb-right" aria-hidden="true" />
    <el-card class="login-card">
      <div class="login-card__header">
        <p class="login-kicker">Admin Access</p>
        <h1>登录博客后台</h1>
        <p class="login-subtitle">使用管理员账号进入后台，管理文章、分类与标签内容。</p>
      </div>
      <el-form :model="form" label-position="top" class="login-form" @submit.prevent="submit">
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" show-password autocomplete="current-password" />
        </el-form-item>
        <div class="login-actions">
          <el-button type="primary" class="login-submit" :loading="loading" @click="submit">登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const form = reactive({
  email: '',
  password: '',
})

async function submit() {
  loading.value = true
  try {
    await auth.login(form.email, form.password)
    await router.push(String(route.query.redirect || '/admin/posts'))
  } catch {
    ElMessage.error('登录失败，请检查邮箱和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  display: grid;
  min-height: 100vh;
  padding: 32px 16px;
  overflow: hidden;
  place-items: center;
  background:
    radial-gradient(circle at top left, rgba(240, 167, 181, 0.18), transparent 28%),
    radial-gradient(circle at bottom right, rgba(196, 120, 139, 0.16), transparent 24%),
    linear-gradient(180deg, #fcf8f4 0%, #f8f2ec 100%);
}

.login-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.9;
  pointer-events: none;
}

.login-orb-left {
  top: 12%;
  left: -72px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(240, 167, 181, 0.3), transparent 68%);
}

.login-orb-right {
  right: -88px;
  bottom: 10%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(196, 120, 139, 0.24), transparent 70%);
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(468px, 100%);
  overflow: hidden;
  border: 1px solid rgba(196, 120, 139, 0.16);
  border-radius: 28px;
  background: rgba(255, 250, 248, 0.88);
  box-shadow:
    0 24px 80px rgba(80, 53, 46, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);

  :deep(.el-card__body) {
    padding: 34px 32px 30px;
  }
}

.login-card__header {
  margin-bottom: 26px;
}

.login-kicker {
  margin: 0 0 10px;
  color: var(--primary-dark);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.login-card__header h1 {
  margin: 0 0 12px;
  color: #2f2724;
  font-size: clamp(30px, 5vw, 38px);
  line-height: 1.08;
}

.login-subtitle {
  margin: 0;
  color: var(--muted);
  line-height: 1.85;
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    color: #5f524d;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  :deep(.el-input__wrapper) {
    min-height: 48px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.94);
    box-shadow:
      0 0 0 1px rgba(196, 120, 139, 0.1) inset,
      0 8px 20px rgba(73, 47, 28, 0.04);
    transition:
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  :deep(.el-input__wrapper.is-focus) {
    box-shadow:
      0 0 0 1px rgba(196, 120, 139, 0.34) inset,
      0 0 0 4px rgba(196, 120, 139, 0.1);
    transform: translateY(-1px);
  }
}

.login-submit {
  width: 100%;
  min-height: 46px;
  font-weight: 700;
  letter-spacing: 0.08em;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  box-shadow: 0 14px 28px rgba(168, 92, 112, 0.28);
}

.login-actions {
  display: grid;
  gap: 12px;
  margin-top: 8px;
}

.login-home-link {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  color: #6a5852;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(196, 120, 139, 0.14);
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(73, 47, 28, 0.04);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    background 180ms ease;

  &:hover {
    color: var(--primary-dark);
    background: rgba(255, 248, 245, 0.96);
    border-color: rgba(196, 120, 139, 0.26);
    transform: translateY(-1px);
  }
}

@media (max-width: 560px) {
  .login-home-link {
    top: 16px;
    left: 16px;
  }

  .login-card {
    border-radius: 22px;

    :deep(.el-card__body) {
      padding: 26px 22px 24px;
    }
  }

  .login-card__header h1 {
    font-size: 1.8rem;
  }
}
</style>
