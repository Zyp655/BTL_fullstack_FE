import { defineStore } from 'pinia'
import api from '../services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    totalCount: 0,
    loading: false,
    currentUser: null,
    userStats: null,
  }),

  actions: {
    async fetchUserStats() {
      try {
        const { data } = await api.get('/api/v1/users/stats')
        this.userStats = data
        return data
      } catch (error) {
        console.error('Error fetching user stats:', error)
        throw error
      }
    },

    async fetchUsers(params = {}) {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/users', { params })
        this.users = data.items
        this.totalCount = data.totalCount
      } catch (error) {
        console.error('Error fetching users:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getUser(id) {
      try {
        const { data } = await api.get(`/api/v1/users/${id}`)
        this.currentUser = data
        return data
      } catch (error) {
        console.error('Error getting user:', error)
        throw error
      }
    },

    async createUser(user) {
      try {
        const { data } = await api.post('/api/v1/auth/register', user)
        return data
      } catch (error) {
        console.error('Error creating user:', error)
        throw error
      }
    },

    async updateUser(id, user) {
      try {
        const { data } = await api.put(`/api/v1/users/${id}`, user)
        return data
      } catch (error) {
        console.error('Error updating user:', error)
        throw error
      }
    },

    async toggleUserActive(id) {
      try {
        const { data } = await api.put(`/api/v1/users/${id}/toggle-active`)
        // Update user state locally
        const idx = this.users.findIndex(u => u.userId === id)
        if (idx !== -1) {
          this.users[idx].isActive = data.isActive
        }
        return data
      } catch (error) {
        console.error('Error toggling user active status:', error)
        throw error
      }
    }
  }
})
