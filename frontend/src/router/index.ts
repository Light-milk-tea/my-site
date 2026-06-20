import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const PublicLayout = () => import('../layouts/PublicLayout.vue')
const AdminLayout = () => import('../layouts/AdminLayout.vue')
const HomeView = () => import('../views/public/HomeView.vue')
const PostsView = () => import('../views/public/PostsView.vue')
const PostDetailView = () => import('../views/public/PostDetailView.vue')
const FriendsView = () => import('../views/public/FriendsView.vue')
const AboutView = () => import('../views/public/AboutView.vue')
const LoginView = () => import('../views/admin/LoginView.vue')
const AdminPostsView = () => import('../views/admin/AdminPostsView.vue')
const PostEditorView = () => import('../views/admin/PostEditorView.vue')
const TaxonomyView = () => import('../views/admin/TaxonomyView.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'posts', name: 'posts', component: PostsView },
        { path: 'posts/:slug', name: 'post-detail', component: PostDetailView },
        { path: 'friends', name: 'friends', component: FriendsView },
        { path: 'about', name: 'about', component: AboutView },
      ],
    },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/posts' },
        { path: 'posts', name: 'admin-posts', component: AdminPostsView },
        { path: 'posts/new', name: 'admin-post-new', component: PostEditorView },
        { path: 'posts/:id/edit', name: 'admin-post-edit', component: PostEditorView },
        { path: 'taxonomies', name: 'admin-taxonomies', component: TaxonomyView },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
