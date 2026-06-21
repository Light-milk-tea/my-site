import axios from 'axios'
import type { Category, LoginResponse, PagedPosts, Post, Tag } from './types'

type UploadImageResponse = {
  filename: string
  url: string
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blog-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const blogApi = {
  login(email: string, password: string) {
    return api.post<LoginResponse>('/auth/login', { email, password }).then((res) => res.data)
  },
  getPosts(params?: Record<string, string | number | undefined>) {
    return api.get<PagedPosts>('/posts', { params }).then((res) => res.data)
  },
  getPost(slug: string) {
    return api.get<Post>(`/posts/${slug}`).then((res) => res.data)
  },
  getAdminPosts() {
    return api.get<Post[]>('/posts/admin').then((res) => res.data)
  },
  getAdminPost(id: string) {
    return api.get<Post>(`/posts/admin/${id}`).then((res) => res.data)
  },
  savePost(payload: Partial<Post> & { categoryId?: string; tagIds?: string[] }) {
    if (payload.id) {
      return api.put<Post>(`/posts/${payload.id}`, payload).then((res) => res.data)
    }
    return api.post<Post>('/posts', payload).then((res) => res.data)
  },
  deletePost(id: string) {
    return api.delete(`/posts/${id}`).then((res) => res.data)
  },
  uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post<UploadImageResponse>('/uploads/images', formData)
      .then((res) => res.data)
  },
  getCategories() {
    return api.get<Category[]>('/categories').then((res) => res.data)
  },
  saveCategory(payload: Partial<Category>) {
    if (payload.id) {
      return api.put<Category>(`/categories/${payload.id}`, payload).then((res) => res.data)
    }
    return api.post<Category>('/categories', payload).then((res) => res.data)
  },
  deleteCategory(id: string) {
    return api.delete(`/categories/${id}`).then((res) => res.data)
  },
  getTags() {
    return api.get<Tag[]>('/tags').then((res) => res.data)
  },
  saveTag(payload: Partial<Tag>) {
    if (payload.id) {
      return api.put<Tag>(`/tags/${payload.id}`, payload).then((res) => res.data)
    }
    return api.post<Tag>('/tags', payload).then((res) => res.data)
  },
  deleteTag(id: string) {
    return api.delete(`/tags/${id}`).then((res) => res.data)
  },
}
