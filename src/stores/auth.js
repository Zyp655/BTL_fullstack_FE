import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    avatar: localStorage.getItem('avatar_' + (JSON.parse(localStorage.getItem('user'))?.userId || '')) || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || '',
    isAdmin: (state) => state.user?.role === 'Admin',
    isTeacher: (state) => state.user?.role === 'GiaoVien',
    isStudent: (state) => state.user?.role === 'HocVien',
  },

  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/api/v1/auth/login', { username, password })
        this.token = data.token
        this.user = data.user
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        return data.user
      } catch (err) {
        console.error('Login error:', err)
        this.error = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async signup(username, password, fullName, email, phone) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/api/v1/auth/signup', {
          username,
          password,
          fullName,
          email,
          phone
        })
        return data
      } catch (err) {
        console.error('Signup error:', err)
        this.error = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      if (!this.token) return null
      try {
        const { data } = await api.get('/api/v1/auth/profile')
        this.user = data
        localStorage.setItem('user', JSON.stringify(data))
        return data
      } catch (err) {
        console.error('Fetch profile error:', err)
        if (err.response?.status === 401) {
          this.logout()
        }
        throw err
      }
    },

    async changePassword(currentPassword, newPassword) {
      try {
        const userId = this.user?.userId || 1
        const { data } = await api.put('/api/v1/auth/change-password', {
          id: userId,
          currentPassword,
          newPassword
        })
        return data
      } catch (err) {
        console.error('Change password error:', err)
        throw err
      }
    },

    updateAvatar(avatarBase64) {
      this.avatar = avatarBase64
      if (this.user?.userId) {
        if (avatarBase64) {
          localStorage.setItem('avatar_' + this.user.userId, avatarBase64)
        } else {
          localStorage.removeItem('avatar_' + this.user.userId)
        }
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.avatar = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
