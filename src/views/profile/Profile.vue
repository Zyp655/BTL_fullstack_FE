<template>
  <div class="space-y-gutter animate-fade-in">
    <!-- Header banner -->
    <div class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-on-tertiary-container/10 rounded-full blur-2xl"></div>
      
      <!-- Avatar Section with Edit button -->
      <div class="relative group cursor-pointer shrink-0" @click="triggerAvatarSelect">
        <div class="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-primary-container text-white flex items-center justify-center font-bold text-[48px] shrink-0 overflow-hidden relative">
          <img v-if="authStore.avatar" :src="authStore.avatar" class="w-full h-full object-cover" alt="User Avatar" />
          <span v-else>{{ (authStore.currentUser?.fullName || 'N').charAt(0).toUpperCase() }}</span>
          
          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span class="material-symbols-outlined text-white text-[28px]">photo_camera</span>
          </div>
        </div>
        
        <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="onAvatarChange" />
      </div>

      <!-- User Details Header -->
      <div class="flex-1 text-center md:text-left space-y-2">
        <div class="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
          <h2 class="font-headline-lg text-headline-lg text-primary">{{ authStore.currentUser?.fullName }}</h2>
          <span class="bg-primary-container/10 text-primary-container rounded-full px-3 py-1 text-body-sm font-semibold self-center md:self-auto uppercase">
            {{ getRoleLabel(authStore.currentUser?.role) }}
          </span>
        </div>
        <p class="text-body-sm text-on-surface-variant font-medium">Tên đăng nhập: <span class="font-mono font-bold">{{ authStore.currentUser?.username }}</span></p>
        <p class="text-body-xs text-on-surface-variant/70">Thành viên từ: {{ formatDate(authStore.currentUser?.createdAt) }}</p>
      </div>
    </div>

    <!-- Forms Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
      <!-- Left side: avatar controls & stats summary -->
      <div class="space-y-gutter">
        <div class="glass-panel p-6 rounded-2xl space-y-4">
          <h3 class="font-title-md text-body-lg font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-on-tertiary-container">portrait</span>
            Ảnh đại diện
          </h3>
          <p class="text-body-sm text-on-surface-variant">Chọn một bức ảnh chân dung rõ nét để làm ảnh đại diện tài khoản của bạn.</p>
          <div class="flex flex-col gap-2">
            <button @click="triggerAvatarSelect" class="w-full py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">upload</span>
              Tải ảnh lên
            </button>
            <button v-if="authStore.avatar" @click="removeAvatar" class="w-full py-2.5 rounded-lg border border-error/25 text-error font-semibold text-body-sm hover:bg-error/5 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">delete</span>
              Xóa ảnh hiện tại
            </button>
          </div>
        </div>
      </div>

      <!-- Right side: profile info form & password form -->
      <div class="lg:col-span-2 space-y-gutter">
        <!-- Personal info form -->
        <div class="glass-panel p-6 rounded-2xl space-y-6">
          <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2 border-b border-white/40 pb-3">
            <span class="material-symbols-outlined text-on-tertiary-container">edit</span>
            Cập nhật thông tin cá nhân
          </h3>

          <form @submit.prevent="saveProfile" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Full Name -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary block">Họ và tên *</label>
                <input v-model="profileForm.fullName" type="text" required class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary" placeholder="Nhập họ và tên" />
              </div>

              <!-- Email -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary block">Địa chỉ Email</label>
                <input v-model="profileForm.email" type="email" class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary" placeholder="name@example.com" />
              </div>

              <!-- Phone -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary block">Số điện thoại</label>
                <input v-model="profileForm.phone" type="tel" class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary" placeholder="Nhập số điện thoại" />
              </div>

              <!-- If HocVien, show additional student profile fields -->
              <template v-if="authStore.isStudent">
                <!-- Gender -->
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary block">Giới tính</label>
                  <select v-model="profileForm.gender" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container cursor-pointer transition-all">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <!-- Date of Birth -->
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary block">Ngày sinh</label>
                  <input v-model="profileForm.dateOfBirth" type="date" class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary" />
                </div>

                <!-- Address -->
                <div class="space-y-1 sm:col-span-2">
                  <label class="text-body-sm font-semibold text-primary block">Địa chỉ thường trú</label>
                  <textarea v-model="profileForm.address" rows="2" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2 text-body-sm text-primary placeholder-on-surface-variant/50 focus:outline-none focus:border-on-tertiary-container transition-all resize-none" placeholder="Nhập địa chỉ của bạn"></textarea>
                </div>
              </template>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-2">
              <button type="submit" :disabled="savingProfile" class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer active:scale-95">
                <span v-if="savingProfile" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span class="material-symbols-outlined text-[18px]">save</span>
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password form -->
        <div class="glass-panel p-6 rounded-2xl space-y-6">
          <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2 border-b border-white/40 pb-3">
            <span class="material-symbols-outlined text-on-tertiary-container">key</span>
            Đổi mật khẩu bảo mật
          </h3>

          <form @submit.prevent="changePassword" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Current Password -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary block">Mật khẩu hiện tại *</label>
                <input v-model="passwordForm.oldPassword" type="password" required class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary" placeholder="Mật khẩu hiện tại" />
              </div>

              <!-- New Password -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary block">Mật khẩu mới *</label>
                <input v-model="passwordForm.newPassword" type="password" required class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary" placeholder="Tối thiểu 6 ký tự" />
              </div>

              <!-- Confirm New Password -->
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary block">Xác nhận mật khẩu mới *</label>
                <input v-model="passwordForm.confirmPassword" type="password" required class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary" placeholder="Nhập lại mật khẩu mới" />
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-2">
              <button type="submit" :disabled="changingPassword" class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer active:scale-95">
                <span v-if="changingPassword" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span class="material-symbols-outlined text-[18px]">lock</span>
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useAuthStore } from '../../stores'
import api from '../../services/api'

const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')

const fileInput = ref(null)
const savingProfile = ref(false)
const changingPassword = ref(false)

const profileForm = ref({
  fullName: '',
  email: '',
  phone: '',
  gender: 'Nam',
  dateOfBirth: '',
  address: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const studentProfileId = ref(null)

const getRoleLabel = (role) => {
  const map = { Admin: 'Quản trị viên', GiaoVien: 'Giáo viên', HocVien: 'Học viên' }
  return map[role] || role || 'Người dùng'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN')
}

// Trigger avatar file select
const triggerAvatarSelect = () => {
  fileInput.value.click()
}

// Handle avatar image change
const onAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    showSnackbar('Chỉ hỗ trợ tải tệp hình ảnh.', 'error')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    showSnackbar('Dung lượng ảnh tối đa là 2MB.', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    authStore.updateAvatar(reader.result)
    showSnackbar('Cập nhật ảnh đại diện thành công.', 'success')
  }
  reader.readAsDataURL(file)
}

// Remove avatar
const removeAvatar = () => {
  authStore.updateAvatar(null)
  showSnackbar('Đã xóa ảnh đại diện.', 'success')
}

// Load current profile
const loadProfile = async () => {
  try {
    const user = await authStore.fetchProfile()
    profileForm.value.fullName = user.fullName || ''
    profileForm.value.email = user.email || ''
    profileForm.value.phone = user.phone || ''

    if (authStore.isStudent) {
      const { data } = await api.get(`/api/v1/students/by-user/${user.userId}`)
      if (data) {
        studentProfileId.value = data.studentId
        profileForm.value.gender = data.gender || 'Nam'
        profileForm.value.address = data.address || ''
        
        if (data.dateOfBirth) {
          // Format dateOfBirth to YYYY-MM-DD for input type="date"
          const dob = new Date(data.dateOfBirth)
          profileForm.value.dateOfBirth = dob.toISOString().substring(0, 10)
        }
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    showSnackbar('Không thể tải thông tin trang cá nhân.', 'error')
  }
}

// Save profile details
const saveProfile = async () => {
  savingProfile.value = true
  try {
    // 1. Update general user info in PaymentService
    await api.put('/api/v1/auth/profile', {
      fullName: profileForm.value.fullName,
      email: profileForm.value.email,
      phone: profileForm.value.phone
    })

    // 2. If student, update student info in StudentService
    if (authStore.isStudent && studentProfileId.value) {
      await api.put(`/api/v1/students/${studentProfileId.value}`, {
        fullName: profileForm.value.fullName,
        email: profileForm.value.email,
        phone: profileForm.value.phone,
        gender: profileForm.value.gender,
        dateOfBirth: profileForm.value.dateOfBirth ? new Date(profileForm.value.dateOfBirth).toISOString() : new Date().toISOString(),
        address: profileForm.value.address
      })
    }

    // Refresh user state in pinia store
    await authStore.fetchProfile()
    showSnackbar('Cập nhật thông tin cá nhân thành công.', 'success')
  } catch (err) {
    console.error('Error saving profile:', err)
    showSnackbar(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin.', 'error')
  } finally {
    savingProfile.value = false
  }
}

// Change password
const changePassword = async () => {
  if (passwordForm.value.newPassword.length < 6) {
    showSnackbar('Mật khẩu mới phải có ít nhất 6 ký tự.', 'error')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showSnackbar('Xác nhận mật khẩu mới không trùng khớp.', 'error')
    return
  }

  changingPassword.value = true
  try {
    await authStore.changePassword(passwordForm.value.oldPassword, passwordForm.value.newPassword)
    showSnackbar('Đổi mật khẩu thành công.', 'success')
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err) {
    console.error('Error changing password:', err)
    showSnackbar(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.', 'error')
  } finally {
    changingPassword.value = false
  }
}

onMounted(loadProfile)
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
