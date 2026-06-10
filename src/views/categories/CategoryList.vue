<template>
  <div class="space-y-stack-lg animate-fade-in pb-16">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-sm">
          <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">category</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg font-bold text-on-background tracking-tight">Quản lý danh mục</h2>
          <p class="font-body-sm text-body-sm text-secondary mt-1">Thiết lập và quản lý các nhóm môn học của trung tâm.</p>
        </div>
      </div>
      <div>
        <button
          @click="openCreateDialog"
          class="flex items-center gap-2 bg-on-tertiary-container text-white px-5 py-2.5 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity shadow-sm shadow-on-tertiary-container/20 cursor-pointer active:scale-95"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Thêm danh mục
        </button>
      </div>
    </section>

    <!-- Stats Cards -->
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

    <!-- Search bar -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm shadow-primary/5 rounded-xl p-4">
      <div class="relative w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input
          v-model="filters.search"
          class="w-full pl-10 pr-4 py-2 bg-primary-container/[0.05] border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-sm text-body-sm text-on-surface placeholder:text-outline transition-all"
          placeholder="Tìm kiếm danh mục theo tên hoặc mã..."
          type="text"
        />
      </div>
    </section>

    <!-- Data Table Card -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-md shadow-primary/5 rounded-xl overflow-hidden flex flex-col relative">
      <div class="absolute inset-x-0 top-0 h-px bg-white/80 z-10 pointer-events-none"></div>
      
      <div class="overflow-x-auto">
        <div v-if="categoryStore.loading" class="p-12 space-y-4 animate-pulse">
          <div class="h-8 bg-surface-container-high rounded w-full"></div>
          <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 4" :key="i"></div>
        </div>

        <table v-else-if="filteredCategories.length > 0" class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-outline-variant/20 bg-surface-container-low/50">
              <th class="py-3.5 px-4 font-label-caps text-label-caps text-on-surface-variant w-16 text-center">STT</th>
              <th class="py-3.5 px-4 font-label-caps text-label-caps text-on-surface-variant">Tên danh mục</th>
              <th class="py-3.5 px-4 font-label-caps text-label-caps text-on-surface-variant">Mã danh mục</th>
              <th class="py-3.5 px-4 font-label-caps text-label-caps text-on-surface-variant w-44 text-center">Số môn học</th>
              <th class="py-3.5 px-4 font-label-caps text-label-caps text-on-surface-variant w-24 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10 font-body-sm text-body-sm text-on-surface">
            <tr
              v-for="(cat, index) in filteredCategories"
              :key="cat.categoryId"
              class="hover:bg-primary-fixed/5 transition-colors group"
            >
              <td class="py-3.5 px-4 text-center text-secondary">{{ index + 1 }}</td>
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div :class="[getCategoryBgClass(cat.categoryCode, index), 'w-9 h-9 rounded-lg flex items-center justify-center shrink-0']">
                    <span class="material-symbols-outlined text-[20px]">{{ getCategoryIcon(cat.categoryCode, index) }}</span>
                  </div>
                  <span class="font-bold text-primary">{{ cat.categoryName }}</span>
                </div>
              </td>
              <td class="py-3.5 px-4 font-mono font-semibold text-secondary">
                <span class="bg-primary-container/[0.05] border border-primary-container/10 px-2 py-0.5 rounded text-[12px]">{{ cat.categoryCode }}</span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-on-tertiary-container/10 text-on-tertiary-container border border-on-tertiary-container/20">
                  {{ getCourseCount(cat.categoryCode) }} môn học
                </span>
              </td>
              <td class="py-3.5 px-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openEditDialog(cat)"
                    class="w-8 h-8 rounded-md bg-white/50 border border-outline-variant/20 flex items-center justify-center text-on-tertiary-container hover:border-on-tertiary-container/40 hover:bg-on-tertiary-container/5 transition-all cursor-pointer"
                    title="Sửa danh mục"
                  >
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    @click="confirmDelete(cat)"
                    class="w-8 h-8 rounded-md bg-white/50 border border-outline-variant/20 flex items-center justify-center text-error hover:border-error/40 hover:bg-error/5 transition-all cursor-pointer"
                    title="Xóa danh mục"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-else class="p-12 text-center flex flex-col items-center justify-center bg-white/30">
          <span class="material-symbols-outlined text-primary-container/20 text-[64px] mb-4">category</span>
          <p class="text-body-lg text-on-surface-variant font-medium">Không tìm thấy danh mục nào</p>
        </div>
      </div>
    </div>

    <!-- Modal Form Overlay: Thêm/Sửa danh mục -->
    <teleport to="body">
      <div v-if="dialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <!-- Glass Modal Container -->
        <div class="w-full max-w-lg bg-white/95 backdrop-blur-[32px] border border-white/60 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] overflow-hidden flex flex-col transform scale-100 opacity-100 transition-all duration-300">
          <!-- Dialog Header -->
          <div class="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'edit_note' : 'category' }}</span>
              {{ isEdit ? 'Cập nhật thông tin danh mục' : 'Thêm danh mục mới' }}
            </h3>
            <button @click="dialog = false" class="text-on-surface-variant hover:text-primary cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Dialog Body -->
          <div class="p-6 space-y-4">
            <form class="space-y-4" @submit.prevent>
              <div class="space-y-1">
                <label class="block font-label-caps text-label-caps text-on-surface-variant ml-1 mb-1">Tên danh mục *</label>
                <input
                  v-model="formData.categoryName"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg py-2.5 px-4 font-body-sm text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                  placeholder="Ví dụ: Ngoại ngữ, Công nghệ thông tin..."
                  type="text"
                />
                <span v-if="validationErrors.categoryName" class="text-[11px] text-error font-semibold block mt-0.5 ml-1">
                  {{ validationErrors.categoryName }}
                </span>
              </div>
              <div class="space-y-1">
                <label class="block font-label-caps text-label-caps text-on-surface-variant ml-1 mb-1">Mã danh mục *</label>
                <input
                  v-model="formData.categoryCode"
                  :disabled="isEdit"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg py-2.5 px-4 font-body-sm text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Ví dụ: NgoaiNgu, TinHoc (chữ và số liền nhau)"
                  type="text"
                />
                <span v-if="validationErrors.categoryCode" class="text-[11px] text-error font-semibold block mt-0.5 ml-1">
                  {{ validationErrors.categoryCode }}
                </span>
                <p v-if="!isEdit" class="text-[11px] text-on-surface-variant ml-1">Mã danh mục dùng làm mã code hệ thống, không sửa được sau khi tạo.</p>
              </div>
            </form>
          </div>

          <!-- Dialog Footer -->
          <div class="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface/30">
            <button
              @click="dialog = false"
              class="px-5 py-2 rounded-lg font-title-md text-[13px] font-semibold text-on-surface-variant bg-white/50 border border-white/40 hover:bg-white/80 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="saveForm"
              :disabled="saving || !isFormValid"
              class="px-5 py-2 rounded-lg font-title-md text-[13px] font-semibold text-white bg-on-tertiary-container hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Delete Confirmation Dialog -->
    <teleport to="body">
      <div v-if="deleteDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/95 backdrop-blur-[24px] border border-white/50 shadow-[0_20px_40px_rgba(0,31,63,0.12)] w-full max-w-sm rounded-xl overflow-hidden animate-scale-in">
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-[36px]">warning</span>
            </div>
            <h3 class="font-title-md text-title-md font-bold text-primary mb-2">Xác nhận xóa danh mục</h3>
            <p class="text-body-sm text-on-surface-variant leading-relaxed">
              Bạn có chắc chắn muốn xóa danh mục <strong class="text-primary">"{{ deleteTarget?.categoryName }}"</strong>? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface/30">
            <button
              @click="deleteDialog = false"
              class="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="doDelete"
              :disabled="deleting"
              class="px-4 py-2 rounded-lg bg-error text-white font-semibold text-[13px] hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span v-if="deleting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xóa danh mục
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useCategoryStore, useCourseStore } from '../../stores'

const categoryStore = useCategoryStore()
const courseStore = useCourseStore()
const showSnackbar = inject('showSnackbar')

const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)

const formData = ref({
  categoryName: '',
  categoryCode: '',
})

const filters = ref({
  search: '',
})

const validationErrors = ref({
  categoryName: '',
  categoryCode: '',
})

// Validators
const isFormValid = computed(() => {
  const isNameOk = formData.value.categoryName.trim().length >= 2
  const isCodeOk = /^[a-zA-Z0-9]+$/.test(formData.value.categoryCode.trim()) && formData.value.categoryCode.trim().length >= 2
  return isNameOk && isCodeOk
})

watch(() => formData.value.categoryName, (val) => {
  validationErrors.value.categoryName = val.trim().length < 2 ? 'Tên danh mục phải có ít nhất 2 ký tự' : ''
})

watch(() => formData.value.categoryCode, (val) => {
  const code = val.trim()
  if (code.length < 2) {
    validationErrors.value.categoryCode = 'Mã danh mục phải có ít nhất 2 ký tự'
  } else if (!/^[a-zA-Z0-9]+$/.test(code)) {
    validationErrors.value.categoryCode = 'Mã danh mục chỉ chứa chữ cái và số'
  } else {
    validationErrors.value.categoryCode = ''
  }
})

// Client-side category filtering
const filteredCategories = computed(() => {
  const query = filters.value.search.trim().toLowerCase()
  if (!query) return categoryStore.categories
  return categoryStore.categories.filter(c => 
    c.categoryName.toLowerCase().includes(query) || 
    c.categoryCode.toLowerCase().includes(query)
  )
})

// Stats display
const stats = computed(() => [
  {
    label: 'Tổng số danh mục',
    value: categoryStore.categories.length,
    icon: 'category',
    bgColor: 'bg-primary-container/10',
    textColor: 'text-primary-container'
  },
  {
    label: 'Môn học Ngoại ngữ',
    value: getCourseCount('NgoaiNgu'),
    icon: 'translate',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-600'
  },
  {
    label: 'Môn học Tin học',
    value: getCourseCount('TinHoc'),
    icon: 'laptop_mac',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600'
  },
  {
    label: 'Môn học Kỹ năng',
    value: getCourseCount('KyNang'),
    icon: 'psychology',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600'
  },
])

function getCourseCount(catCode) {
  return courseStore.courses.filter(c => c.category === catCode).length
}

function getCategoryIcon(code, index) {
  const map = { NgoaiNgu: 'translate', TinHoc: 'laptop_mac', KyNang: 'psychology' }
  if (map[code]) return map[code]
  const icons = ['translate', 'laptop_mac', 'psychology', 'sports_esports', 'menu_book', 'science']
  return icons[index % icons.length]
}

function getCategoryBgClass(code, index) {
  const map = { NgoaiNgu: 'bg-sky-500/10 text-sky-600', TinHoc: 'bg-amber-500/10 text-amber-600', KyNang: 'bg-purple-500/10 text-purple-600' }
  if (map[code]) return map[code]
  const classes = [
    'bg-sky-500/10 text-sky-600',
    'bg-amber-500/10 text-amber-600',
    'bg-purple-500/10 text-purple-600',
    'bg-rose-500/10 text-rose-600',
    'bg-emerald-500/10 text-emerald-600',
    'bg-pink-500/10 text-pink-600'
  ]
  return classes[index % classes.length]
}

async function loadData() {
  try {
    await categoryStore.fetchCategories()
    await courseStore.fetchCourses({ pageSize: 500 })
  } catch (e) {
    showSnackbar('Lỗi tải danh mục và môn học', 'error')
  }
}

function openCreateDialog() {
  isEdit.value = false
  validationErrors.value = { categoryName: '', categoryCode: '' }
  formData.value = {
    categoryName: '',
    categoryCode: '',
  }
  dialog.value = true
}

function openEditDialog(cat) {
  isEdit.value = true
  validationErrors.value = { categoryName: '', categoryCode: '' }
  formData.value = { ...cat }
  dialog.value = true
}

async function saveForm() {
  if (!isFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      await categoryStore.updateCategory(formData.value.categoryId, formData.value)
      showSnackbar('Cập nhật danh mục thành công', 'success')
    } else {
      await categoryStore.createCategory(formData.value)
      showSnackbar('Thêm danh mục thành công', 'success')
    }
    dialog.value = false
    await loadData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(cat) {
  deleteTarget.value = cat
  deleteDialog.value = true
}

async function doDelete() {
  deleting.value = true
  try {
    await categoryStore.deleteCategory(deleteTarget.value.categoryId)
    showSnackbar('Xóa danh mục thành công', 'success')
    deleteDialog.value = false
    await loadData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Lỗi khi xóa danh mục. Vui lòng kiểm tra nếu danh mục đang chứa môn học.', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
.glass-input {
  background: rgba(0, 31, 63, 0.05);
  border: 1px solid rgba(0, 31, 63, 0.1);
}
.glass-input:focus {
  border-color: #2b83ff;
  box-shadow: 0 0 0 2px rgba(43, 131, 255, 0.2);
  outline: none;
}
</style>
