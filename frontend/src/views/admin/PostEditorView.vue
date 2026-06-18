<template>
  <div class="admin-page">
    <div class="page-heading">
      <h1>{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
      <el-button @click="$router.push('/admin/posts')">返回</el-button>
    </div>

    <el-form :model="form" label-position="top" class="editor-form">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="URL Slug">
        <el-input v-model="form.slug" placeholder="留空时后端会根据标题生成" />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.summary" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="封面 URL">
        <el-input v-model="form.cover" />
      </el-form-item>
      <el-form-item label="SEO 标题">
        <el-input v-model="form.seoTitle" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.categoryId" clearable placeholder="选择分类">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="form.tagIds" multiple clearable placeholder="选择标签">
          <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="正文 Markdown">
        <el-input v-model="form.content" type="textarea" :rows="18" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio-button label="DRAFT">草稿</el-radio-button>
          <el-radio-button label="PUBLISHED">发布</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-button type="primary" :loading="saving" @click="save">保存</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { blogApi } from '../../api/client'
import type { Category, PostStatus, Tag } from '../../api/types'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => Boolean(route.params.id))
const saving = ref(false)
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])

const form = reactive({
  id: '',
  title: '',
  slug: '',
  summary: '',
  cover: '',
  seoTitle: '',
  content: '',
  status: 'DRAFT' as PostStatus,
  categoryId: '',
  tagIds: [] as string[],
})

async function save() {
  saving.value = true
  try {
    await blogApi.savePost({
      ...form,
      categoryId: form.categoryId || undefined,
    })
    ElMessage.success('文章已保存')
    await router.push('/admin/posts')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const [categoryList, tagList] = await Promise.all([blogApi.getCategories(), blogApi.getTags()])
  categories.value = categoryList
  tags.value = tagList

  if (isEdit.value) {
    const post = await blogApi.getAdminPost(String(route.params.id))
    Object.assign(form, {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary || '',
      cover: post.cover || '',
      seoTitle: post.seoTitle || '',
      content: post.content,
      status: post.status,
      categoryId: post.category?.id || '',
      tagIds: post.tags.map((tag) => tag.id),
    })
  }
})
</script>
