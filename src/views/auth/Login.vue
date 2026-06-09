<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Decorative gradient blobs -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary-fixed-dim/20 rounded-full blur-[100px] opacity-60"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-tertiary-fixed-dim/20 rounded-full blur-[120px] opacity-60"></div>
    </div>

    <div
      class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_32px_rgba(0,31,63,0.08)] p-container-padding w-full max-w-[420px] space-y-6 transition-all duration-300 relative z-10"
      :class="{ 'shake': shouldShake }"
    >
      <!-- Title Header -->
      <div class="text-center space-y-2">
        <div class="w-16 h-16 bg-primary-container text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
          <span class="material-symbols-outlined text-[32px]">school</span>
        </div>
        <h2 class="font-headline-lg text-headline-lg text-primary-container text-center tracking-tight">EduManager Pro</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant text-center mt-base">Đăng nhập cổng quản trị &amp; học vụ</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-stack-sm">
        <!-- Username Field -->
        <div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <span class="material-symbols-outlined text-[20px]">person</span>
            </div>
            <input
              v-model="username"
              type="text"
              class="w-full pl-10 pr-4 py-3 bg-primary-container/[0.05] border border-primary-container/10 rounded-lg text-on-surface font-body-lg text-body-lg placeholder:text-outline-variant focus:outline-none focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 transition-all duration-200"
              :class="{ 'glass-input-error': errors.username }"
              placeholder="Tên đăng nhập"
              @input="errors.username = ''"
            />
          </div>
          <p v-if="errors.username" class="error-text">
            <span class="material-symbols-outlined text-[14px]">error</span>
            {{ errors.username }}
          </p>
        </div>

        <!-- Password Field -->
        <div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <span class="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <input
              v-model="password"
              type="password"
              class="w-full pl-10 pr-4 py-3 bg-primary-container/[0.05] border border-primary-container/10 rounded-lg text-on-surface font-body-lg text-body-lg placeholder:text-outline-variant focus:outline-none focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 transition-all duration-200"
              :class="{ 'glass-input-error': errors.password }"
              placeholder="Mật khẩu"
              @input="errors.password = ''"
            />
          </div>
          <p v-if="errors.password" class="error-text">
            <span class="material-symbols-outlined text-[14px]">error</span>
            {{ errors.password }}
          </p>
        </div>

        <!-- Forgot Password Link -->
        <div class="flex justify-end -mt-2">
          <button
            type="button"
            @click="openForgotPasswordModal"
            class="text-[12px] font-semibold text-on-tertiary-container hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Quên mật khẩu?
          </button>
        </div>

        <!-- Alert -->
        <transition name="fade">
          <div
            v-if="error"
            class="flex items-start gap-2.5 p-3 rounded-lg bg-error-container border border-error/20 text-on-error-container text-body-sm font-medium"
          >
            <span class="material-symbols-outlined text-error text-[18px]">error</span>
            <span>{{ error }}</span>
          </div>
        </transition>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-base bg-primary-container text-white py-3 px-4 rounded-lg font-title-md text-title-md shadow-sm hover:shadow-md hover:bg-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>Đăng nhập</span>
        </button>
      </form>

      <!-- Quick Demo Login Buttons -->
      <div class="space-y-2.5 mt-stack-md pt-4 border-t border-outline-variant/20">
        <div class="text-[12px] text-center text-on-surface-variant font-medium">Đăng nhập nhanh tài khoản dùng thử</div>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="fillDemo('admin')"
            class="px-4 py-2.5 rounded-lg border border-primary-container/20 hover:border-primary-container/40 hover:bg-primary-container/5 text-primary-container font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer bg-white/40"
          >
            <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            Quản trị viên
          </button>
          <button
            type="button"
            @click="fillDemo('student')"
            class="px-4 py-2.5 rounded-lg border border-on-tertiary-container/20 hover:border-on-tertiary-container/40 hover:bg-on-tertiary-container/5 text-on-tertiary-container font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer bg-white/40"
          >
            <span class="material-symbols-outlined text-[16px]">school</span>
            Học viên
          </button>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <teleport to="body">
      <div v-if="forgotPassModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full p-6 space-y-4 animate-scale-in flex flex-col">
          <div class="flex items-center gap-3 text-primary-container border-b border-white/40 pb-3 justify-between">
            <h3 class="font-title-md text-[18px] font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-[24px] text-on-tertiary-container">lock_reset</span>
              Khôi phục mật khẩu
            </h3>
            <button @click="closeForgotPasswordModal" class="text-on-surface-variant hover:text-primary-container cursor-pointer bg-transparent border-none">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div v-if="otpStep === 1" class="space-y-4">
            <p class="text-body-sm text-on-surface-variant">Vui lòng nhập địa chỉ Email đăng ký tài khoản của bạn. Hệ thống sẽ gửi mã OTP gồm 6 chữ số về email này.</p>
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Địa chỉ Email *</label>
              <input
                v-model="forgotEmail"
                type="email"
                required
                class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div v-else class="space-y-4">
            <p class="text-body-sm text-on-surface-variant">Mã OTP đã được gửi về email <strong>{{ forgotEmail }}</strong>. Vui lòng kiểm tra hộp thư (hoặc logs/console) và nhập thông tin dưới đây.</p>
            
            <!-- OTP Code -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Mã OTP (6 chữ số) *</label>
              <input
                v-model="resetOtp"
                type="text"
                maxlength="6"
                required
                class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary tracking-widest font-mono text-center font-bold text-[18px]"
                placeholder="000000"
              />
            </div>

            <!-- New Password -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Mật khẩu mới *</label>
              <input
                v-model="resetNewPassword"
                type="password"
                required
                class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <!-- Confirm New Password -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Xác nhận mật khẩu mới *</label>
              <input
                v-model="resetConfirmPassword"
                type="password"
                required
                class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary"
                placeholder="Xác nhận lại mật khẩu mới"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-white/40">
            <button
              @click="closeForgotPasswordModal"
              class="px-4 py-2 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <!-- Send OTP Button -->
            <button
              v-if="otpStep === 1"
              @click="sendOtp"
              :disabled="sendingOtp || !forgotEmail"
              class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="sendingOtp" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Gửi mã OTP
            </button>

            <!-- Reset Password Button -->
            <button
              v-else
              @click="resetPassword"
              :disabled="resettingPassword || !resetOtp || !resetNewPassword || !resetConfirmPassword"
              class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="resettingPassword" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Đặt lại mật khẩu
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores'
import api from '../../services/api'

const router = useRouter()
const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')

// Login fields (empty by default for standard design)
const username = ref('')
const password = ref('')

const loading = ref(false)
const error = ref(null)

const shouldShake = ref(false)
function triggerShake() {
  shouldShake.value = true
  setTimeout(() => {
    shouldShake.value = false
  }, 500)
}

const errors = ref({
  username: '',
  password: ''
})

function validateLoginForm() {
  let isValid = true
  errors.value.username = ''
  errors.value.password = ''

  if (!username.value || username.value.trim() === '') {
    errors.value.username = 'Tên đăng nhập không được để trống'
    isValid = false
  }

  if (!password.value || password.value === '') {
    errors.value.password = 'Mật khẩu không được để trống'
    isValid = false
  }

  return isValid
}

async function handleLogin() {
  if (!validateLoginForm()) {
    triggerShake()
    return
  }
  loading.value = true
  error.value = null
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (err) {
    console.error(err)
    error.value = 'Tài khoản hoặc mật khẩu sai, vui lòng thử lại'
    errors.value.username = ' '
    errors.value.password = ' '
    triggerShake()
  } finally {
    loading.value = false
  }
}

// Quick fill function
function fillDemo(role) {
  if (role === 'admin') {
    username.value = 'admin'
    password.value = 'admin123'
  } else if (role === 'student') {
    username.value = 'lethip'
    password.value = 'student123'
  }
}

// Forgot Password Flow
const forgotPassModal = ref(false)
const otpStep = ref(1)
const forgotEmail = ref('')
const resetOtp = ref('')
const resetNewPassword = ref('')
const resetConfirmPassword = ref('')
const sendingOtp = ref(false)
const resettingPassword = ref(false)

const openForgotPasswordModal = () => {
  forgotEmail.value = ''
  resetOtp.value = ''
  resetNewPassword.value = ''
  resetConfirmPassword.value = ''
  otpStep.value = 1
  forgotPassModal.value = true
}

const closeForgotPasswordModal = () => {
  forgotPassModal.value = false
}

const sendOtp = async () => {
  if (!forgotEmail.value.trim()) return
  sendingOtp.value = true
  try {
    const res = await api.post('/api/v1/auth/forgot-password', {
      email: forgotEmail.value.trim()
    })
    
    if (res.data?.otp) {
      console.log('DEV ONLY - Reset OTP:', res.data.otp)
      showSnackbar(`Đã gửi OTP! Mã test: ${res.data.otp}`, 'success')
    } else {
      showSnackbar('Mã OTP đã được gửi về email của bạn.', 'success')
    }
    
    otpStep.value = 2
  } catch (err) {
    console.error(err)
    showSnackbar(err.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng kiểm tra lại email.', 'error')
  } finally {
    sendingOtp.value = false
  }
}

const resetPassword = async () => {
  if (resetNewPassword.value.length < 6) {
    showSnackbar('Mật khẩu mới phải có tối thiểu 6 ký tự', 'error')
    return
  }
  if (resetNewPassword.value !== resetConfirmPassword.value) {
    showSnackbar('Xác nhận mật khẩu mới không trùng khớp', 'error')
    return
  }

  resettingPassword.value = true
  try {
    await api.post('/api/v1/auth/reset-password-otp', {
      email: forgotEmail.value.trim(),
      otp: resetOtp.value.trim(),
      newPassword: resetNewPassword.value
    })
    showSnackbar('Đặt lại mật khẩu thành công. Hãy đăng nhập với mật khẩu mới.', 'success')
    forgotPassModal.value = false
  } catch (err) {
    console.error(err)
    showSnackbar(err.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại OTP.', 'error')
  } finally {
    resettingPassword.value = false
  }
}
</script>

<style scoped>
.glass-input-error {
  border-color: #ba1a1a !important;
  background-color: rgba(186, 26, 26, 0.05) !important;
}
.glass-input-error:focus {
  border-color: #ba1a1a !important;
  box-shadow: 0 0 0 3px rgba(186, 26, 26, 0.15) !important;
}
.error-text {
  color: #ba1a1a;
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.shake {
  animation: shake 0.5s ease-in-out;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
</style>

