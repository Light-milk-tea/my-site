export type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  _count?: { posts: number }
}

export type Tag = {
  id: string
  name: string
  slug: string
  _count?: { posts: number }
}

export type PostStatus = 'DRAFT' | 'PUBLISHED'

export type Post = {
  id: string
  title: string
  slug: string
  summary?: string | null
  cover?: string | null
  content: string
  seoTitle?: string | null
  status: PostStatus
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
  category?: Category | null
  tags: Tag[]
  author: {
    id: string
    name: string
    email: string
  }
}

export type PagedPosts = {
  items: Post[]
  total: number
  page: number
  pageSize: number
}

export type LoginResponse = {
  accessToken: string
  user: {
    id: string
    email: string
    name: string
  }
}
