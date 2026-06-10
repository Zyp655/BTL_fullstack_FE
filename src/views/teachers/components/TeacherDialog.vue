<template>
  <teleport to="body">
    <div v-if="show" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-lg w-full overflow-hidden animate-scale-in flex flex-col">
        <!-- Title -->
        <div class="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'edit_note' : 'person_add' }}</span>
            {{ isEdit ? 'Cập nhật thông tin giảng viên' : 'Đăng ký giảng viên mới' }}
          </h3>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          
          <!-- Username (Readonly on edit) -->
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary">Tên đăng nhập (Username) *</label>
            <input
              v-model="formData.username"
              type="text"
              :disabled="isEdit"
              class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary disabled:bg-slate-100/50 disabled:text-on-surface-variant/70 disabled:cursor-not-allowed focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
              placeholder="Nhập tên đăng nhập để giáo viên đăng nhập"
              maxlength="50"
            />
            <p v-if="validationErrors.username" class="text-error text-[11px] font-semibold">{{ validationErrors.username }}</p>
          </div>

          <!-- Password (Required on create, optional on edit) -->
          <div class="space-y-1" v-if="!isEdit">
            <label class="text-body-sm font-semibold text-primary">Mật khẩu *</label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            />
            <p v-if="validationErrors.password" class="text-error text-[11px] font-semibold">{{ validationErrors.password }}</p>
          </div>

          <!-- Full Name -->
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary">Họ và tên giảng viên *</label>
            <input
              v-model="formData.fullName"
              type="text"
              class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary placeholder:text-on-surface-variant/60 focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
              placeholder="Ví dụ: Nguyễn Văn An"
              maxlength="100"
            />
            <p v-if="validationErrors.fullName" class="text-error text-[11px] font-semibold">{{ validationErrors.fullName }}</p>
          </div>

          <!-- Contact details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Số điện thoại</label>
              <input
                v-model="formData.phone"
                type="text"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary placeholder:text-on-surface-variant/60 focus:outline-none"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Email</label>
              <input
                v-model="formData.email"
                type="email"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary placeholder:text-on-surface-variant/60 focus:outline-none"
                placeholder="email@example.com"
              />
              <p v-if="validationErrors.email" class="text-error text-[11px] font-semibold">{{ validationErrors.email }}</p>
            </div>
          </div>

          <!-- Professional profile: Specialization & Degree -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Chuyên môn giảng dạy</label>
              <input
                v-model="formData.specialization"
                type="text"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary placeholder:text-on-surface-variant/60 focus:outline-none"
                placeholder="Ví dụ: Tiếng Anh, Python, React..."
              />
            </div>
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary">Bằng cấp / Học vị</label>
              <input
                v-model="formData.degree"
                type="text"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary placeholder:text-on-surface-variant/60 focus:outline-none"
                placeholder="Ví dụ: Thạc sĩ, Cử nhân, Tiến sĩ..."
              />
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface/30">
          <button
            @click="$emit('close')"
            class="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            @click="saveForm"
            :disabled="saving || !isFormValid"
            class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, computed, inject } from 'vue'
import { useTeacherStore } from '../../../stores'

const props = defineProps({
  show: { type: Boolean, required: true },
  teacher: { type: Object, default: null }
})

const emit = defineEmits(['close', 'success'])
const showSnackbar = inject('showSnackbar')
const store = useTeacherStore()

const isEdit = computed(() => !!props.teacher)
const saving = ref(false)

const formData = ref({
  username: '',
  password: '',
  fullName: '',
  phone: '',
  email: '',
  specialization: '',
  degree: ''
})

const validationErrors = ref({
  username: '',
  password: '',
  fullName: '',
  email: ''
})

const isFormValid = computed(() => {
  const isUsernameOk = isEdit.value || (formData.value.username.trim().length >= 3)
  const isPasswordOk = isEdit.value || (formData.value.password && formData.value.password.length >= 6)
  const isNameOk = formData.value.fullName.trim().length > 0
  const isEmailOk = formData.value.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
  
  return isUsernameOk && isPasswordOk && isNameOk && isEmailOk
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    validationErrors.value = { username: '', password: '', fullName: '', email: '' }
    if (props.teacher) {
      formData.value = {
        userId: props.teacher.userId,
        username: props.teacher.username,
        password: '',
        fullName: props.teacher.fullName,
        phone: props.teacher.phone || '',
        email: props.teacher.email || '',
        specialization: props.teacher.specialization || '',
        degree: props.teacher.degree || ''
      }
    } else {
      formData.value = {
        username: '',
        password: '',
        fullName: '',
        phone: '',
        email: '',
        specialization: '',
        degree: ''
      }
    }
  }
})

watch(() => formData.value.username, (val) => {
  if (!isEdit.value) {
    validationErrors.value.username = val.trim().length < 3 ? 'Tên đăng nhập phải có ít nhất 3 ký tự' : ''
  }
})

watch(() => formData.value.password, (val) => {
  if (!isEdit.value) {
    validationErrors.value.password = !val || val.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : ''
  }
})

watch(() => formData.value.fullName, (val) => {
  validationErrors.value.fullName = val.trim().length === 0 ? 'Họ tên không được để trống' : ''
})

watch(() => formData.value.email, (val) => {
  if (val !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    validationErrors.value.email = 'Email không đúng định dạng'
  } else {
    validationErrors.value.email = ''
  }
})

async function saveForm() {
  if (!isFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      await store.updateTeacher(props.teacher.userId, {
        fullName: formData.value.fullName,
        phone: formData.value.phone || null,
        email: formData.value.email || null,
        specialization: formData.value.specialization || null,
        degree: formData.value.degree || null
      })
      showSnackbar('Cập nhật thông tin giảng viên thành công', 'success')
    } else {
      await store.createTeacher({
        username: formData.value.username,
        password: formData.value.password,
        fullName: formData.value.fullName,
        phone: formData.value.phone || null,
        email: formData.value.email || null,
        specialization: formData.value.specialization || null,
        degree: formData.value.degree || null
      })
      showSnackbar('Thêm giảng viên mới thành công', 'success')
    }
    emit('success')
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi lưu giảng viên', 'error')
  } finally {
    saving.value = false
  }
}
</script>
