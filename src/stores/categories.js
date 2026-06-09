import { defineStore } from 'pinia'
import api from '../services/api'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/categories')
        this.categories = data
        return data
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCategory(category) {
      try {
        const { data } = await api.post('/api/v1/categories', category)
        return data
      } catch (error) {
        console.error('Error creating category:', error)
        throw error
      }
    },

    async updateCategory(id, category) {
      try {
        const { data } = await api.put(`/api/v1/categories/${id}`, category)
        return data
      } catch (error) {
        console.error('Error updating category:', error)
        throw error
      }
    },

    async deleteCategory(id) {
      try {
        await api.delete(`/api/v1/categories/${id}`)
      } catch (error) {
        console.error('Error deleting category:', error)
        throw error
      }
    }
  }
})
