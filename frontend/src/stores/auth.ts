import { defineStore } from 'pinia'
import { blogApi } from '../api/client'

type AuthUser = {
  id: string
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('blog-token') || '',
    user: JSON.parse(localStorage.getItem('blog-user') || 'null') as AuthUser | null,
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
  },
  actions: {
    async login(email: string, password: string) {
      const result = await blogApi.login(email, password)
      this.token = result.accessToken
      this.user = result.user
      localStorage.setItem('blog-token', result.accessToken)
      localStorage.setItem('blog-user', JSON.stringify(result.user))
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('blog-token')
      localStorage.removeItem('blog-user')
    },
  },
})
