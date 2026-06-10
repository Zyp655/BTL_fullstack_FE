<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary-container">category</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg text-primary-container tracking-tight">Quản lý danh mục</h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-1">Thiết lập và quản lý các danh mục môn học của trung tâm.</p>
        </div>
      </div>
      <div>
        <button
          @click="openCreateDialog"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-semibold text-[14px] shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[20px]">add</span>
          Thêm danh mục
        </button>
      </div>
    </section>

    <!-- Stats Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      <div v-for="stat in stats" :key="stat.label" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div :class="[stat.bgColor, stat.textColor, 'w-12 h-12 rounded-lg flex items-center justify-center shrink-0']">
          <span class="material-symbols-outlined">{{ stat.icon }}</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-label-caps font-label-caps text-on-surface-variant">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative flex-1 w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          v-model="filters.search"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
          placeholder="Tìm kiếm danh mục theo tên hoặc mã..."
          type="text"
        />
      </div>
    </section>

    <!-- Categories Table -->
    <section>
      <!-- Loading State -->
      <div v-if="categoryStore.loading" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
        <div class="p-12 space-y-4 animate-pulse">
          <div class="h-8 bg-surface-container-high rounded w-full"></div>
          <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 4" :key="i"></div>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else-if="filteredCategories.length > 0" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-high">
                <th class="py-3.5 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">#</th>
                <th class="py-3.5 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Danh mục</th>
                <th class="py-3.5 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Mã danh mục</th>
                <th class="py-3.5 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Số môn học</th>
                <th class="py-3.5 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="font-body-sm text-body-sm">
              <tr
                v-for="(cat, index) in filteredCategories"
                :key="cat.categoryId"
                class="border-t border-white/40 hover:bg-white/30 transition-colors group"
              >
                <td class="py-4 px-6 text-on-surface-variant font-semibold">{{ index + 1 }}</td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div :class="[getCategoryBgClass(cat.categoryCode, index), 'w-9 h-9 rounded-lg flex items-center justify-center shrink-0']">
                      <span class="material-symbols-outlined text-[20px]">{{ getCategoryIcon(cat.categoryCode, index) }}</span>
                    </div>
                    <span class="font-semibold text-primary" :title="cat.categoryName">{{ cat.categoryName }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span class="font-mono text-on-surface-variant font-semibold bg-primary-container/[0.05] px-2 py-0.5 rounded text-[12px]">{{ cat.categoryCode }}</span>
                </td>
                <td class="py-4 px-6">
                  <span class="bg-on-tertiary-container/10 text-on-tertiary-container font-semibold px-2.5 py-0.5 rounded-full text-[12px] border border-on-tertiary-container/20">
                    {{ getCourseCount(cat.categoryCode) }} môn học
                  </span>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openEditDialog(cat)"
                      class="w-8 h-8 rounded-lg bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container flex items-center justify-center transition-colors cursor-pointer"
                      title="Sửa danh mục"
                    >
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      @click="confirmDelete(cat)"
                      class="w-8 h-8 rounded-lg bg-error/10 hover:bg-error/20 text-error flex items-center justify-center transition-colors cursor-pointer"
                      title="Xóa danh mục"
                    >
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-primary/30 text-[64px] mb-4">category</span>
        <h3 class="font-title-md text-title-md font-bold text-primary mt-2">Không tìm thấy danh mục</h3>
        <p class="text-body-sm text-on-surface-variant mt-2">
          Thử tìm kiếm với từ khóa khác.
        </p>
      </div>
    </section>

    <!-- Create/Edit Dialog -->
    <teleport to="body">
      <div v-if="dialog" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 glass-backdrop">
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] w-full max-w-md rounded-2xl overflow-hidden animate-scale-in">
          <!-- Dialog Header -->
          <div class="px-6 py-4 border-b border-white/40 flex justify-between items-center">
            <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'edit' : 'category' }}</span>
              {{ isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục mới' }}
            </h3>
            <button @click="dialog = false" class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Dialog Body -->
          <div class="p-6 space-y-4">
            <!-- Category Name -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Tên danh mục *</label>
              <input
                v-model="formData.categoryName"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                placeholder="Ví dụ: Ngoại ngữ, Công nghệ thông tin..."
                type="text"
              />
              <span v-if="validationErrors.categoryName" class="text-[11px] text-error font-semibold block mt-0.5 ml-1">
                {{ validationErrors.categoryName }}
              </span>
            </div>

            <!-- Category Code -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Mã danh mục *</label>
              <input
                v-model="formData.categoryCode"
                :disabled="isEdit"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Ví dụ: NgoaiNgu, TinHoc (chỉ chữ và số)"
                type="text"
              />
              <span v-if="validationErrors.categoryCode" class="text-[11px] text-error font-semibold block mt-0.5 ml-1">
                {{ validationErrors.categoryCode }}
              </span>
              <p v-if="!isEdit" class="text-[11px] text-on-surface-variant ml-1">Mã danh mục dùng để định danh kỹ thuật, không thể thay đổi sau khi tạo.</p>
            </div>
          </div>

          <!-- Dialog Footer -->
          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="dialog = false"
              class="px-5 py-2.5 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              @click="saveForm"
              :disabled="saving || !isFormValid"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Delete Confirmation Dialog -->
    <teleport to="body">
      <div v-if="deleteDialog" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 glass-backdrop">
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in">
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-[36px]">warning</span>
            </div>
            <h3 class="font-title-md text-title-md font-bold text-primary mb-2">Xác nhận xóa danh mục</h3>
            <p class="text-body-sm text-on-surface-variant">
              Bạn có chắc chắn muốn xóa danh mục <strong class="text-primary">"{{ deleteTarget?.categoryName }}"</strong>? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="deleteDialog = false"
              class="px-4 py-2 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="doDelete"
              :disabled="deleting"
              class="px-4 py-2 rounded-lg bg-error text-white font-semibold text-[13px] hover:bg-error/90 transition-colors flex items-center gap-1 cursor-pointer"
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

// Validate code to be alphanumeric only (regex: ^[a-zA-Z0-9]+$)
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
    validationErrors.value.categoryCode = 'Mã danh mục chỉ được chứa chữ cái và chữ số (không khoảng trắng, dấu tiếng Việt hoặc ký tự đặc biệt)'
  } else {
    validationErrors.value.categoryCode = ''
  }
})

// Filter categories locally
const filteredCategories = computed(() => {
  const query = filters.value.search.trim().toLowerCase()
  if (!query) return categoryStore.categories
  return categoryStore.categories.filter(c => 
    c.categoryName.toLowerCase().includes(query) || 
    c.categoryCode.toLowerCase().includes(query)
  )
})

// Compute statistics
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
    // Also load courses to count them
    await courseStore.fetchCourses({ pageSize: 500 })
  } catch (e) {
    showSnackbar('Lỗi tải danh sách danh mục', 'error')
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
    showSnackbar(e.response?.data?.message || 'Lỗi khi xóa danh mục. Vui lòng kiểm tra nếu danh mục đang được sử dụng.', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadData()
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
