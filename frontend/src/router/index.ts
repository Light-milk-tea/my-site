import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminLayout from '../layouts/AdminLayout.vue'
import PublicLayout from '../layouts/PublicLayout.vue'
import AboutView from '../views/public/AboutView.vue'
import CategoriesView from '../views/public/CategoriesView.vue'
import FriendsView from '../views/public/FriendsView.vue'
import HomeView from '../views/public/HomeView.vue'
import PostDetailView from '../views/public/PostDetailView.vue'
import PostsView from '../views/public/PostsView.vue'
import TagsView from '../views/public/TagsView.vue'
import AdminPostsView from '../views/admin/AdminPostsView.vue'
import LoginView from '../views/admin/LoginView.vue'
import PostEditorView from '../views/admin/PostEditorView.vue'
import TaxonomyView from '../views/admin/TaxonomyView.vue'

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
        { path: 'categories', name: 'categories', component: CategoriesView },
        { path: 'tags', name: 'tags', component: TagsView },
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
