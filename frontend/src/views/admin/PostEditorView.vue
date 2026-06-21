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
        <div class="markdown-editor" @paste.capture="handleContentPaste">
          <div class="markdown-editor__toolbar">
            <div class="markdown-editor__hint">
              可上传已有 Markdown 文件，也可直接粘贴截图或图片。
              <span v-if="imageUploading">图片上传中...</span>
            </div>
            <el-button plain size="small" @click="markdownFileInput?.click()">
              上传 Markdown 文件
            </el-button>
            <input
              ref="markdownFileInput"
              class="markdown-file-input"
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              @change="handleMarkdownFileChange"
            />
          </div>
          <el-input ref="contentInput" v-model="form.content" type="textarea" :rows="18" />
        </div>
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
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { InputInstance } from 'element-plus'
import { blogApi } from '../../api/client'
import type { Category, PostStatus, Tag } from '../../api/types'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => Boolean(route.params.id))
const saving = ref(false)
const imageUploading = ref(false)
const contentInput = ref<InputInstance>()
const markdownFileInput = ref<HTMLInputElement>()
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

async function handleContentPaste(event: ClipboardEvent) {
  const imageFile = Array.from(event.clipboardData?.items || [])
    .find((item) => item.kind === 'file' && item.type.startsWith('image/'))
    ?.getAsFile()

  if (!imageFile) {
    return
  }

  event.preventDefault()

  const textarea = getContentTextarea(event)
  const selectionStart = textarea?.selectionStart ?? form.content.length
  const selectionEnd = textarea?.selectionEnd ?? form.content.length

  imageUploading.value = true
  try {
    const { url } = await blogApi.uploadImage(imageFile)
    const markdown = `![图片](${url})`
    form.content =
      form.content.slice(0, selectionStart) + markdown + form.content.slice(selectionEnd)

    await nextTick()
    const cursor = selectionStart + markdown.length
    const updatedTextarea = textarea || getContentTextarea()
    updatedTextarea?.focus()
    updatedTextarea?.setSelectionRange(cursor, cursor)
    ElMessage.success('图片已插入')
  } catch {
    ElMessage.error('图片上传失败，请稍后重试')
  } finally {
    imageUploading.value = false
  }
}

async function handleMarkdownFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) {
    return
  }

  if (!isMarkdownFile(file)) {
    ElMessage.error('请选择 .md 或 .markdown 文件')
    return
  }

  try {
    const content = await file.text()
    form.content = content

    if (!form.title) {
      form.title = getTitleFromMarkdownFile(file.name, content)
    }

    await nextTick()
    getContentTextarea()?.focus()
    ElMessage.success('Markdown 文件已导入')
  } catch {
    ElMessage.error('Markdown 文件读取失败')
  }
}

function isMarkdownFile(file: File) {
  const name = file.name.toLowerCase()
  return (
    name.endsWith('.md') ||
    name.endsWith('.markdown') ||
    file.type === 'text/markdown' ||
    file.type === 'text/plain'
  )
}

function getTitleFromMarkdownFile(filename: string, content: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  if (heading) {
    return heading
  }

  return filename.replace(/\.(md|markdown)$/i, '').replace(/[-_]+/g, ' ')
}

function getContentTextarea(event?: ClipboardEvent) {
  if (event?.target instanceof HTMLTextAreaElement) {
    return event.target
  }

  return contentInput.value?.textarea
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
