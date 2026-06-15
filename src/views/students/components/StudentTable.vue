<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Filters -->
    <section class="glass-panel rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative flex-1 w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
        <input
          :value="filters.search"
          @input="$emit('update-filter', { key: 'search', value: $event.target.value })"
          class="w-full pl-10 pr-10 py-2.5 rounded-lg glass-input font-body-sm text-body-sm text-on-surface"
          placeholder="Tìm theo tên, email, SĐT..."
          type="text"
        />
        <button
          v-if="filters.search"
          @click="$emit('update-filter', { key: 'search', value: '' })"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <!-- Class Filter -->
      <div class="relative w-full sm:w-64">
        <select
          :value="filters.classId"
          @change="$emit('update-filter', { key: 'classId', value: $event.target.value ? Number($event.target.value) : null })"
          class="w-full glass-input rounded-lg pl-4 pr-10 py-2.5 font-body-sm text-body-sm text-on-surface appearance-none cursor-pointer bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]"
          style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
        >
          <option :value="null">Tất cả lớp học</option>
          <option v-for="cls in classes" :key="cls.classId" :value="cls.classId">
            {{ cls.className }}
          </option>
        </select>
        <span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-secondary">expand_more</span>
      </div>

      <div class="relative w-full sm:w-64">
        <select
          :value="filters.gender"
          @change="$emit('update-filter', { key: 'gender', value: $event.target.value || null })"
          class="w-full glass-input rounded-lg pl-4 pr-10 py-2.5 font-body-sm text-body-sm text-on-surface appearance-none cursor-pointer bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]"
          style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
        >
          <option :value="null">Giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        <span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-secondary">expand_more</span>
      </div>
    </section>

    <!-- Data Table -->
    <div class="glass-panel rounded-xl overflow-hidden flex-1 flex flex-col shadow-sm">
      <div v-if="loading" class="p-12 space-y-4 animate-pulse">
        <div class="h-8 bg-surface-container-high rounded w-full"></div>
        <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 5" :key="i"></div>
      </div>

      <div v-else-if="students.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-primary/5 border-b border-outline-variant/30">
              <th class="py-4 px-6 font-bold text-slate-950 font-label-caps uppercase whitespace-nowrap">Mã HV</th>
              <th class="py-4 px-6 font-bold text-slate-950 font-label-caps uppercase whitespace-nowrap">Họ tên</th>
              <th class="py-4 px-6 font-bold text-slate-950 font-label-caps uppercase whitespace-nowrap">Giới tính</th>
              <th class="py-4 px-6 font-bold text-slate-950 font-label-caps uppercase whitespace-nowrap">Ngày sinh</th>
              <th class="py-4 px-6 font-bold text-slate-950 font-label-caps uppercase whitespace-nowrap">SĐT</th>
              <th class="py-4 px-6 font-bold text-slate-950 font-label-caps uppercase whitespace-nowrap">Email</th>
              <th class="py-4 px-6 font-bold text-slate-950 font-label-caps uppercase whitespace-nowrap">Địa chỉ</th>
              <th class="py-4 px-6 font-bold text-slate-950 font-label-caps uppercase whitespace-nowrap text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20">
            <tr
              v-for="student in students"
              :key="student.studentId"
              class="hover:bg-primary/5 transition-colors group cursor-pointer"
              @click="authStore.isAdmin ? $emit('open-edit-dialog', student) : $emit('view-enrollments', student)"
            >
              <td class="py-4 px-6 font-bold text-slate-950">HV-{{ String(student.studentId).padStart(4, '0') }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold">
                    {{ (student.fullName || 'H').substring(0, 2).toUpperCase() }}
                  </div>
                  <span class="font-bold text-slate-950">{{ student.fullName }}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    student.gender === 'Nam' ? 'bg-blue-100 text-blue-800' : 
                    student.gender === 'Nữ' ? 'bg-pink-100 text-pink-800' : 
                    'bg-slate-100 text-slate-800',
                    'inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-semibold'
                  ]"
                >
                  {{ student.gender }}
                </span>
              </td>
              <td class="py-4 px-6 text-slate-950">{{ formatDate(student.dateOfBirth) }}</td>
              <td class="py-4 px-6 text-slate-950 font-semibold">{{ student.phone || '-' }}</td>
              <td class="py-4 px-6 text-slate-950">{{ student.email || '-' }}</td>
              <td class="py-4 px-6 text-slate-950 truncate max-w-[150px]" :title="student.address">
                {{ student.address || '-' }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click.stop="$emit('view-enrollments', student)"
                    class="w-8 h-8 rounded-lg hover:bg-primary/10 text-primary flex items-center justify-center transition-colors"
                    title="Môn học & lớp học đăng ký"
                  >
                    <span class="material-symbols-outlined text-[20px]">school</span>
                  </button>
                  <router-link
                    v-if="authStore.isAdmin"
                    :to="`/student-portal?studentId=${student.studentId}`"
                    @click.stop
                    class="w-8 h-8 rounded-lg hover:bg-primary/10 text-primary flex items-center justify-center transition-colors"
                    title="Xem Cổng học tập"
                  >
                    <span class="material-symbols-outlined text-[20px]">visibility</span>
                  </router-link>
                  <button
                    v-if="authStore.isAdmin"
                    @click.stop="$emit('open-edit-dialog', student)"
                    class="w-8 h-8 rounded-lg hover:bg-primary/10 text-primary flex items-center justify-center transition-colors"
                    title="Sửa thông tin"
                  >
                    <span class="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="p-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-primary-container/30 text-[64px] mb-4">person</span>
        <p class="text-body-lg text-on-surface-variant font-medium">Không tìm thấy học viên nào phù hợp</p>
        <router-link
          v-if="authStore.isAdmin"
          to="/users"
          class="mt-4 px-6 py-2 bg-on-tertiary-container/10 text-on-tertiary-container border border-on-tertiary-container/20 rounded-lg font-semibold hover:bg-on-tertiary-container/20 transition-all inline-block cursor-pointer"
        >
          Đi tới Quản lý tài khoản để thêm học viên mới
        </router-link>
      </div>

      <!-- Pagination Footer -->
      <div v-if="students.length > 0" class="mt-auto px-6 py-4 border-t border-white/40 flex justify-between items-center text-body-sm text-secondary bg-white/30">
        <span>Hiển thị {{ (pagination.page - 1) * pagination.pageSize + 1 }} - {{ Math.min(pagination.page * pagination.pageSize, totalCount) }} trong số {{ totalCount }} học viên</span>
        <div class="flex items-center gap-1">
          <button
            @click="$emit('prev-page')"
            :disabled="pagination.page === 1"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span class="px-3 font-semibold text-primary">Trang {{ pagination.page }} / {{ totalPages }}</span>
          <button
            @click="$emit('next-page')"
            :disabled="pagination.page >= totalPages"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../../stores'

const authStore = useAuthStore()

defineProps({
  students: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  totalCount: { type: Number, required: true },
  pagination: { type: Object, required: true },
  totalPages: { type: Number, required: true },
  filters: { type: Object, required: true },
  classes: { type: Array, required: true }
})

defineEmits([
  'update-filter',
  'open-edit-dialog',
  'view-enrollments',
  'prev-page',
  'next-page'
])

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}
</script>

<style scoped>
.space-y-stack-lg,
table,
th,
td,
span,
div {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
}
</style>
