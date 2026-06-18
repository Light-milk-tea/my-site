<template>
  <div class="admin-page taxonomy-page">
    <h1>分类标签</h1>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-card>
          <template #header>分类</template>
          <el-form :model="categoryForm" inline>
            <el-form-item>
              <el-input v-model="categoryForm.name" placeholder="分类名称" />
            </el-form-item>
            <el-button type="primary" @click="saveCategory">保存</el-button>
          </el-form>
          <el-table :data="categories">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="slug" label="Slug" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button text @click="categoryForm = { ...row }">编辑</el-button>
                <el-button text type="danger" @click="deleteCategory(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>标签</template>
          <el-form :model="tagForm" inline>
            <el-form-item>
              <el-input v-model="tagForm.name" placeholder="标签名称" />
            </el-form-item>
            <el-button type="primary" @click="saveTag">保存</el-button>
          </el-form>
          <el-table :data="tags">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="slug" label="Slug" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button text @click="tagForm = { ...row }">编辑</el-button>
                <el-button text type="danger" @click="deleteTag(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { blogApi } from '../../api/client'
import type { Category, Tag } from '../../api/types'

const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const categoryForm = ref<Partial<Category>>({ name: '' })
const tagForm = ref<Partial<Tag>>({ name: '' })

async function load() {
  const [categoryList, tagList] = await Promise.all([blogApi.getCategories(), blogApi.getTags()])
  categories.value = categoryList
  tags.value = tagList
}

async function saveCategory() {
  await blogApi.saveCategory(categoryForm.value)
  categoryForm.value = { name: '' }
  ElMessage.success('分类已保存')
  await load()
}

async function deleteCategory(id: string) {
  await blogApi.deleteCategory(id)
  await load()
}

async function saveTag() {
  await blogApi.saveTag(tagForm.value)
  tagForm.value = { name: '' }
  ElMessage.success('标签已保存')
  await load()
}

async function deleteTag(id: string) {
  await blogApi.deleteTag(id)
  await load()
}

onMounted(load)
</script>
