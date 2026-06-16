<template>
  <div class="space-y-stack-lg">
    <!-- Filters -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-4 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative flex-1 w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          :value="filters.search"
          @input="$emit('update-filter', { key: 'search', value: $event.target.value })"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-10 py-2.5 text-body-sm text-primary placeholder:text-on-surface-variant/60 focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
          placeholder="Tìm giảng viên theo tên, tài khoản, chuyên môn, bằng cấp..."
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

      <div class="relative w-full sm:w-64">
        <select
          :value="filters.isActive"
          @change="$emit('update-filter', { key: 'isActive', value: $event.target.value === 'true' ? true : ($event.target.value === 'false' ? false : null) })"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary bg-transparent cursor-pointer focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Đang khóa</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </section>

    <!-- Data Table -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] overflow-hidden">
      <div v-if="loading" class="p-12 space-y-4 animate-pulse">
        <div class="h-8 bg-surface-container-high rounded w-full"></div>
        <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 5" :key="i"></div>
      </div>

      <div v-else-if="teachers.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-high">
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Mã GV</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Tên đăng nhập</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Họ và tên</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Chuyên môn</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Học vị</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Email</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Số điện thoại</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Trạng thái</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="font-body-sm text-body-sm">
            <tr
              v-for="teacher in teachers"
              :key="teacher.userId"
              class="border-t border-white/40 hover:bg-primary-container/[0.03] transition-colors group cursor-pointer"
              @click="$emit('open-edit-dialog', teacher)"
            >
              <td class="py-4 px-6 font-semibold text-primary">GV-{{ String(teacher.userId).padStart(4, '0') }}</td>
              <td class="py-4 px-6 font-mono text-on-surface-variant text-[13px]">@{{ teacher.username }}</td>
              <td class="py-4 px-6 font-semibold text-primary">{{ teacher.fullName }}</td>
              <td class="py-4 px-6">
                <span v-if="teacher.specialization" :class="[getSpecializationClass(teacher.specialization), 'px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border']">
                  {{ getSpecializationLabel(teacher.specialization) }}
                </span>
                <span v-else class="text-on-surface-variant/50">—</span>
              </td>
              <td class="py-4 px-6">
                <span v-if="teacher.degree" class="px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-700 text-[11px] font-semibold border border-purple-500/20">
                  {{ teacher.degree }}
                </span>
                <span v-else class="text-on-surface-variant/50">—</span>
              </td>
              <td class="py-4 px-6 text-on-surface-variant">{{ teacher.email || '—' }}</td>
              <td class="py-4 px-6 font-semibold">{{ teacher.phone || '—' }}</td>
              <td class="py-4 px-6">
                <span :class="[teacher.isActive ? 'text-emerald-600' : 'text-error']" class="flex items-center gap-1.5 font-semibold text-[13px]">
                  <span :class="[teacher.isActive ? 'bg-emerald-500' : 'bg-error', 'w-1.5 h-1.5 rounded-full']"></span>
                  {{ teacher.isActive ? 'Hoạt động' : 'Đang khóa' }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click.stop="$emit('open-edit-dialog', teacher)"
                    class="w-8 h-8 rounded-lg bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container flex items-center justify-center transition-colors cursor-pointer"
                    title="Sửa thông tin"
                  >
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    @click.stop="$emit('toggle-active', teacher)"
                    :class="[
                      teacher.isActive ? 'text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-error bg-error/10 hover:bg-error/20',
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer'
                    ]"
                    :title="teacher.isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'"
                  >
                    <span class="material-symbols-outlined text-[18px]">
                      {{ teacher.isActive ? 'lock_open' : 'lock' }}
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="p-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-primary-container/30 text-[64px] mb-4">co_present</span>
        <p class="text-body-lg text-on-surface-variant font-medium">Không tìm thấy giảng viên nào phù hợp</p>
      </div>

      <!-- Pagination Footer -->
      <div v-if="teachers.length > 0" class="p-4 border-t border-white/40 flex justify-between items-center text-body-sm text-on-surface-variant bg-surface/50">
        <span>Hiển thị {{ (pagination.page - 1) * pagination.pageSize + 1 }} - {{ Math.min(pagination.page * pagination.pageSize, totalCount) }} trong số {{ totalCount }} giảng viên</span>
        <div class="flex items-center gap-2">
          <button
            @click="$emit('prev-page')"
            :disabled="pagination.page === 1"
            class="px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white border border-outline-variant/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <span class="px-3 font-semibold text-primary">Trang {{ pagination.page }} / {{ totalPages }}</span>
          <button
            @click="$emit('next-page')"
            :disabled="pagination.page >= totalPages"
            class="px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white border border-outline-variant/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  teachers: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  totalCount: { type: Number, required: true },
  pagination: { type: Object, required: true },
  totalPages: { type: Number, required: true },
  filters: { type: Object, required: true }
})

defineEmits([
  'update-filter',
  'open-edit-dialog',
  'toggle-active',
  'prev-page',
  'next-page'
])

function getSpecializationLabel(spec) {
  const map = {
    TinHoc: 'Tin học',
    NgoaiNgu: 'Ngoại ngữ',
    KyNang: 'Kỹ năng'
  }
  return map[spec] || spec
}

function getSpecializationClass(spec) {
  const map = {
    TinHoc: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
    NgoaiNgu: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    KyNang: 'bg-amber-500/10 text-amber-700 border-amber-500/20'
  }
  return map[spec] || 'bg-slate-500/10 text-slate-700 border-slate-500/20'
}
</script>
