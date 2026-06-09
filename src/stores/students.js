import { defineStore } from 'pinia'
import api from '../services/api'

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [],
    totalCount: 0,
    loading: false,
    users: [], // users with role 'HocVien' for mapping
    loadingUsers: false,
    studentStats: null,
  }),

  actions: {
    async fetchStudentStats() {
      try {
        const { data } = await api.get('/api/v1/students/stats')
        this.studentStats = data
        return data
      } catch (error) {
        console.error('Error fetching student stats:', error)
        throw error
      }
    },

    async fetchStudents(params = {}) {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/students', { params })
        this.students = data.items
        this.totalCount = data.totalCount
      } catch (error) {
        console.error('Error fetching students:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStudentById(id) {
      try {
        const { data } = await api.get(`/api/v1/students/${id}`)
        return data
      } catch (error) {
        console.error('Error getting student details:', error)
        throw error
      }
    },

    async fetchStudentEnrollments(id) {
      try {
        const { data } = await api.get(`/api/v1/students/${id}/enrollments`)
        return data
      } catch (error) {
        console.error('Error getting student enrollments:', error)
        throw error
      }
    },

    async fetchStudentAttendanceSummary(id) {
      try {
        const { data } = await api.get(`/api/v1/attendances/student/${id}/summary`)
        return data
      } catch (error) {
        console.error('Error getting student attendance summary:', error)
        throw error
      }
    },

    async fetchHocVienUsers(params = {}) {
      this.loadingUsers = true
      try {
        // Fetch all users with role "HocVien"
        const { data } = await api.get('/api/v1/users', {
          params: { ...params, role: 'HocVien', pageSize: 100 }
        })
        this.users = data.items
      } catch (error) {
        console.error('Error fetching users:', error)
        throw error
      } finally {
        this.loadingUsers = false
      }
    },

    async createStudent(student) {
      try {
        const { data } = await api.post('/api/v1/students', student)
        return data
      } catch (error) {
        console.error('Error creating student profile:', error)
        throw error
      }
    },

    async updateStudent(id, student) {
      try {
        const { data } = await api.put(`/api/v1/students/${id}`, student)
        return data
      } catch (error) {
        console.error('Error updating student profile:', error)
        throw error
      }
    }
  }
})
