<template>
  <teleport to="body">
    <div v-if="show" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="glass-panel w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col relative overflow-hidden bg-surface/95">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-white/50">
          <h3 class="font-headline-lg text-title-md font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'edit' : 'person_add' }}</span>
            {{ isEdit ? 'Cập nhật thông tin học viên' : 'Thêm học viên mới' }}
          </h3>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-error/10 hover:text-error transition-colors cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto max-h-[75vh]">
          <form class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Left Column -->
            <div class="space-y-5">
              <!-- Link to User Account -->
              <div>
                <label class="block font-title-md text-body-sm text-on-surface-variant mb-1.5">Liên kết tài khoản người dùng <span class="text-error">*</span></label>
                <div class="relative">
                  <select
                    v-model="formData.userId"
                    class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface appearance-none pr-10 bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]"
                    style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
                    @change="onUserSelect"
                    :disabled="isEdit"
                  >
                    <option :value="null" disabled>-- Chọn tài khoản người dùng --</option>
                    <option v-for="user in users" :key="user.userId" :value="user.userId">
                      {{ user.fullName }} ({{ user.username }}) - {{ user.email }}
                    </option>
                  </select>
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-secondary">expand_more</span>
                </div>
                <p class="text-[12px] text-secondary mt-1">Liên kết để học viên có thể đăng nhập vào portal.</p>
                <p v-if="validationErrors.userId" class="text-error text-[11px] font-semibold">{{ validationErrors.userId }}</p>
              </div>

              <!-- Họ và tên -->
              <div>
                <label class="block font-title-md text-body-sm text-on-surface-variant mb-1.5">Họ tên <span class="text-error">*</span></label>
                <input
                  v-model="formData.fullName"
                  class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface"
                  placeholder="Nhập họ và tên"
                  type="text"
                  maxlength="100"
                />
                <p v-if="validationErrors.fullName" class="text-error text-[11px] font-semibold">{{ validationErrors.fullName }}</p>
              </div>

              <!-- Giới tính & Ngày sinh -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-title-md text-body-sm text-on-surface-variant mb-1.5">Giới tính <span class="text-error">*</span></label>
                  <div class="relative">
                    <select
                      v-model="formData.gender"
                      class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface appearance-none pr-10 bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]"
                      style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-secondary">expand_more</span>
                  </div>
                  <p v-if="validationErrors.gender" class="text-error text-[11px] font-semibold">{{ validationErrors.gender }}</p>
                </div>
                <div>
                  <label class="block font-title-md text-body-sm text-on-surface-variant mb-1.5">Ngày sinh <span class="text-error">*</span></label>
                  <input
                    v-model="formData.dateOfBirth"
                    class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-secondary"
                    type="date"
                  />
                  <p v-if="validationErrors.dateOfBirth" class="text-error text-[11px] font-semibold">{{ validationErrors.dateOfBirth }}</p>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-5">
              <!-- Số điện thoại -->
              <div>
                <label class="block font-title-md text-body-sm text-on-surface-variant mb-1.5">Số điện thoại</label>
                <input
                  v-model="formData.phone"
                  class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface"
                  placeholder="Nhập số điện thoại"
                  type="tel"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block font-title-md text-body-sm text-on-surface-variant mb-1.5">Email</label>
                <input
                  v-model="formData.email"
                  class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface"
                  placeholder="Nhập địa chỉ email"
                  type="email"
                />
                <p v-if="validationErrors.email" class="text-error text-[11px] font-semibold">{{ validationErrors.email }}</p>
              </div>

              <!-- Địa chỉ -->
              <div>
                <label class="block font-title-md text-body-sm text-on-surface-variant mb-1.5">Địa chỉ</label>
                <textarea
                  v-model="formData.address"
                  class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm resize-none h-[104px]"
                  placeholder="Nhập địa chỉ cư trú"
                  maxlength="500"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-white/50">
          <button
            @click="$emit('close')"
            class="px-5 py-2 rounded-lg border border-outline-variant text-secondary font-title-md text-body-sm hover:bg-secondary/10 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            @click="saveForm"
            :disabled="saving || !isFormValid"
            class="px-5 py-2 rounded-lg bg-primary text-white font-title-md text-body-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            {{ isEdit ? 'Cập nhật' : 'Lưu thông tin' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, computed, inject } from 'vue'
import { useStudentStore } from '../../../stores'

const props = defineProps({
  show: { type: Boolean, required: true },
  student: { type: Object, default: null },
  users: { type: Array, required: true }
})

const emit = defineEmits(['close', 'success'])
const showSnackbar = inject('showSnackbar')
const store = useStudentStore()

const isEdit = computed(() => !!props.student)
const saving = ref(false)

const formData = ref({
  userId: null,
  fullName: '',
  gender: 'Nam',
  dateOfBirth: '',
  phone: '',
  email: '',
  address: '',
})

const validationErrors = ref({
  userId: '',
  fullName: '',
  gender: '',
  dateOfBirth: '',
  email: '',
})

const isFormValid = computed(() => {
  const isUserValid = formData.value.userId !== null
  const isNameValid = formData.value.fullName.trim().length > 0 && formData.value.fullName.length <= 100
  const isGenderValid = ['Nam', 'Nữ', 'Khác'].includes(formData.value.gender)
  const isDobValid = formData.value.dateOfBirth !== ''
  const isEmailValid = formData.value.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
  
  return isUserValid && isNameValid && isGenderValid && isDobValid && isEmailValid
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    validationErrors.value = { userId: '', fullName: '', gender: '', dateOfBirth: '', email: '' }
    if (props.student) {
      formData.value = {
        studentId: props.student.studentId,
        userId: props.student.userId,
        fullName: props.student.fullName,
        gender: props.student.gender || 'Nam',
        dateOfBirth: props.student.dateOfBirth?.split('T')[0] || '',
        phone: props.student.phone || '',
        email: props.student.email || '',
        address: props.student.address || '',
      }
    } else {
      formData.value = {
        userId: null,
        fullName: '',
        gender: 'Nam',
        dateOfBirth: '',
        phone: '',
        email: '',
        address: '',
      }
    }
  }
})

// Watchers for reactive validation
watch(() => formData.value.userId, (val) => {
  if (!isEdit.value) {
    validationErrors.value.userId = val === null ? 'Vui lòng chọn tài khoản để liên kết' : ''
  }
})

watch(() => formData.value.fullName, (val) => {
  if (val.trim().length === 0) {
    validationErrors.value.fullName = 'Họ tên không được để trống'
  } else if (val.length > 100) {
    validationErrors.value.fullName = 'Họ tên tối đa 100 ký tự'
  } else {
    validationErrors.value.fullName = ''
  }
})

watch(() => formData.value.gender, (val) => {
  validationErrors.value.gender = ['Nam', 'Nữ', 'Khác'].includes(val) ? '' : 'Giới tính không hợp lệ'
})

watch(() => formData.value.dateOfBirth, (val) => {
  validationErrors.value.dateOfBirth = val === '' ? 'Ngày sinh không được để trống' : ''
})

watch(() => formData.value.email, (val) => {
  if (val !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    validationErrors.value.email = 'Email không đúng định dạng'
  } else {
    validationErrors.value.email = ''
  }
})

function onUserSelect() {
  const selectedUser = props.users.find(u => u.userId === formData.value.userId)
  if (selectedUser) {
    formData.value.fullName = selectedUser.fullName || ''
    formData.value.email = selectedUser.email || ''
  }
}

async function saveForm() {
  if (!isFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      await store.updateStudent(formData.value.studentId, {
        userId: formData.value.userId,
        fullName: formData.value.fullName,
        dateOfBirth: new Date(formData.value.dateOfBirth).toISOString(),
        gender: formData.value.gender,
        phone: formData.value.phone || null,
        email: formData.value.email || null,
        address: formData.value.address || null
      })
      showSnackbar('Cập nhật thông tin học viên thành công', 'success')
    } else {
      await store.createStudent({
        userId: formData.value.userId,
        fullName: formData.value.fullName,
        dateOfBirth: new Date(formData.value.dateOfBirth).toISOString(),
        gender: formData.value.gender,
        phone: formData.value.phone || null,
        email: formData.value.email || null,
        address: formData.value.address || null
      })
      showSnackbar('Thêm hồ sơ học viên thành công', 'success')
    }
    emit('success')
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Lỗi khi lưu hồ sơ học viên', 'error')
  } finally {
    saving.value = false
  }
}
</script>
