import { defineStore } from 'pinia'
import api from '../services/api'

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    teachers: [],
    totalCount: 0,
    loading: false,
    teacherStats: null,
  }),

  actions: {
    async fetchTeachers(params = {}) {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/teachers', { params })
        this.teachers = data.items
        this.totalCount = data.totalCount
      } catch (error) {
        console.error('Error fetching teachers:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTeacherById(id) {
      try {
        const { data } = await api.get(`/api/v1/teachers/${id}`)
        return data
      } catch (error) {
        console.error('Error getting teacher details:', error)
        throw error
      }
    },

    async createTeacher(teacher) {
      try {
        const { data } = await api.post('/api/v1/teachers', teacher)
        return data
      } catch (error) {
        console.error('Error creating teacher:', error)
        throw error
      }
    },

    async updateTeacher(id, teacher) {
      try {
        const { data } = await api.put(`/api/v1/teachers/${id}`, teacher)
        return data
      } catch (error) {
        console.error('Error updating teacher:', error)
        throw error
      }
    },

    async toggleTeacherActive(id) {
      try {
        const { data } = await api.put(`/api/v1/teachers/${id}/toggle-active`)
        return data
      } catch (error) {
        console.error('Error toggling teacher active status:', error)
        throw error
      }
    }
  }
})
