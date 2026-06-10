<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Header -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-primary-container flex items-center gap-3">
          <span class="material-symbols-outlined text-[32px]">co_present</span>
          Quản lý giảng viên
        </h1>
        <p class="font-body-lg text-on-surface-variant mt-1">Quản lý hồ sơ giảng viên, phân công chuyên môn, học vị và cấp tài khoản dạy học.</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-if="authStore.isAdmin"
          @click="openCreateDialog"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-semibold text-[14px] shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[20px]">person_add</span>
          Thêm giảng viên mới
        </button>
      </div>
    </section>

    <!-- Stats Row -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      <div v-for="stat in stats" :key="stat.label" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div :class="[stat.bgColor, stat.textColor, 'w-12 h-12 rounded-lg flex items-center justify-center shrink-0']">
          <span class="material-symbols-outlined">{{ stat.icon }}</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-[12px] text-on-surface-variant font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Teacher Table -->
    <TeacherTable
      :teachers="store.teachers"
      :loading="store.loading"
      :total-count="store.totalCount"
      :pagination="pagination"
      :total-pages="totalPages"
      :filters="filters"
      @update-filter="updateFilter"
      @open-edit-dialog="openEditDialog"
      @toggle-active="toggleActive"
      @prev-page="prevPage"
      @next-page="nextPage"
    />

    <!-- Teacher Dialog -->
    <TeacherDialog
      :show="teacherDialogModal"
      :teacher="selectedTeacher"
      @close="teacherDialogModal = false"
      @success="onDialogSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useTeacherStore, useAuthStore } from '../../stores'
import TeacherTable from './components/TeacherTable.vue'
import TeacherDialog from './components/TeacherDialog.vue'

const store = useTeacherStore()
const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')

const teacherDialogModal = ref(false)
const selectedTeacher = ref(null)

const filters = ref({
  search: '',
  isActive: null
})

const pagination = ref({
  page: 1,
  pageSize: 10
})

const totalPages = computed(() => Math.ceil(store.totalCount / pagination.value.pageSize) || 1)

// Locally calculated stats from loaded records (for a richer user experience)
const stats = computed(() => {
  const activeCount = store.teachers.filter(t => t.isActive).length
  const inactiveCount = store.teachers.filter(t => !t.isActive).length
  const specCount = store.teachers.filter(t => t.specialization).length

  return [
    {
      label: 'Tổng giảng viên',
      value: store.totalCount,
      icon: 'group',
      bgColor: 'bg-primary-container/10',
      textColor: 'text-primary-container'
    },
    {
      label: 'Đang hoạt động',
      value: activeCount,
      icon: 'check_circle',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-700'
    },
    {
      label: 'Đang khóa',
      value: inactiveCount,
      icon: 'lock',
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-700'
    },
    {
      label: 'Được phân chuyên môn',
      value: specCount,
      icon: 'workspace_premium',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-700'
    }
  ]
})

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchData, 300)
}

async function fetchData() {
  try {
    await store.fetchTeachers({
      search: filters.value.search || undefined,
      isActive: filters.value.isActive ?? undefined,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
  } catch (e) {
    console.error(e)
    showSnackbar('Lỗi tải danh sách giảng viên', 'error')
  }
}

function prevPage() {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchData()
  }
}

function nextPage() {
  if (pagination.value.page < totalPages.value) {
    pagination.value.page++
    fetchData()
  }
}

function updateFilter({ key, value }) {
  filters.value[key] = value
  pagination.value.page = 1
}

function openCreateDialog() {
  selectedTeacher.value = null
  teacherDialogModal.value = true
}

function openEditDialog(teacher) {
  selectedTeacher.value = teacher
  teacherDialogModal.value = true
}

function onDialogSuccess() {
  teacherDialogModal.value = false
  fetchData()
}

async function toggleActive(teacher) {
  try {
    const res = await store.toggleTeacherActive(teacher.userId)
    showSnackbar(res.message, 'success')
    fetchData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Không thể thay đổi trạng thái giảng viên', 'error')
  }
}

watch(() => filters.value.isActive, () => {
  pagination.value.page = 1
  fetchData()
})

watch(() => filters.value.search, () => {
  pagination.value.page = 1
  debouncedFetch()
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
