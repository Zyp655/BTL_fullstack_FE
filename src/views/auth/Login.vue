<template>
  <div class="bg-background text-on-background font-body-lg text-body-lg antialiased min-h-screen flex selection:bg-tertiary-fixed selection:text-on-tertiary-fixed w-full">
    <!-- Split Layout Container -->
    <main class="flex w-full min-h-screen">
      <!-- Left Pane: Brand & Graphic (Hidden on small screens) -->
      <section class="hidden xl:flex xl:w-3/4 bg-primary-container relative overflow-hidden flex-col justify-between p-stack-lg">
        <!-- Graphic Background -->
        <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <img 
            alt="Abstract flowing glowing shapes representing education and connectivity" 
            class="w-full h-full object-cover" 
            src="../../assets/education_login_bg.png"
          />
        </div>
        <!-- Content Overlay -->
        <router-link to="/" class="relative z-10 flex items-center gap-base cursor-pointer hover:opacity-90 transition-all no-underline hover:scale-[1.02] active:scale-[0.98]">
          <span class="material-symbols-outlined text-headline-lg text-on-primary">school</span>
          <span class="font-title-md text-title-md text-on-primary tracking-tight">EduManager Pro</span>
        </router-link>
        <div class="relative z-10 max-w-3xl mb-20">
          <h1 class="font-display-lg text-display-lg text-on-primary mb-stack-md leading-tight drop-shadow-md whitespace-nowrap">
            Kiến tạo Tương lai Giáo dục
          </h1>
          <p class="font-body-lg text-body-lg text-on-primary-container opacity-90 whitespace-nowrap">
            Nền tảng quản lý học vụ tập trung và bảo mật cho giáo dục hiện đại.
          </p>
        </div>
        <!-- Decorative gradient to ensure text readability at bottom -->
        <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary-container to-transparent z-0 pointer-events-none"></div>
      </section>

      <!-- Right Pane: Form Interface -->
      <section class="w-full xl:w-1/4 flex flex-col justify-center items-center bg-surface-container-lowest relative p-container-padding">
        <!-- Mobile Brand Header (Visible only on mobile) -->
        <router-link to="/" class="xl:hidden flex items-center gap-base absolute top-container-padding left-container-padding cursor-pointer hover:opacity-90 transition-all no-underline hover:scale-[1.02] active:scale-[0.98]">
          <span class="material-symbols-outlined text-headline-lg-mobile text-primary">school</span>
          <span class="font-title-md text-title-md text-primary tracking-tight">EduManager Pro</span>
        </router-link>
        
        <!-- Login Container (Glassmorphism) -->
        <div 
          class="glass-panel w-full max-w-[420px] rounded-xl p-stack-md flex flex-col gap-stack-md relative z-10 mt-12 xl:mt-0"
          :class="{ 'shake': shouldShake }"
        >
          <div class="text-center mb-base">
            <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">Welcome Back</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Đăng nhập vào cổng quản trị & học vụ</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="flex flex-col gap-stack-sm">
            <!-- Username/Email Input (Floating Label) -->
            <div class="relative group">
              <input 
                v-model="username"
                class="floating-input peer w-full bg-slate-50/50 border border-slate-300 rounded-lg px-4 pt-6 pb-2 text-body-lg font-body-lg text-on-surface focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:bg-slate-50/85 focus:bg-white transition-all shadow-inner" 
                id="username" 
                name="username" 
                placeholder=" " 
                required 
                type="text"
                autocomplete="username"
                @input="errors.username = ''"
              />
              <label 
                class="floating-label absolute left-4 text-slate-400 text-body-lg transition-all pointer-events-none" 
                for="username"
              >
                Tên đăng nhập / Email
              </label>
              <p v-if="errors.username && errors.username.trim() !== ''" class="error-text">
                <span class="material-symbols-outlined text-[14px]">error</span>
                {{ errors.username }}
              </p>
            </div>

            <!-- Password Input (Floating Label & Toggle) -->
            <div class="relative group">
              <input 
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                class="floating-input peer w-full bg-slate-50/50 border border-slate-300 rounded-lg pl-4 pr-12 pt-6 pb-2 text-body-lg font-body-lg text-on-surface focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:bg-slate-50/85 focus:bg-white transition-all shadow-inner" 
                id="password" 
                name="password" 
                placeholder=" " 
                required 
                autocomplete="current-password"
                @input="errors.password = ''"
              />
              <label 
                class="floating-label absolute left-4 text-slate-400 text-body-lg transition-all pointer-events-none" 
                for="password"
              >
                Mật khẩu
              </label>
              <button 
                aria-label="Toggle password visibility" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 active:text-slate-800 transition-colors focus:outline-none rounded p-1 z-20 cursor-pointer flex items-center justify-center" 
                @click="togglePasswordVisibility" 
                type="button"
              >
                <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 0;">
                  {{ passwordVisible ? 'visibility' : 'visibility_off' }}
                </span>
              </button>
              <p v-if="errors.password && errors.password.trim() !== ''" class="error-text">
                <span class="material-symbols-outlined text-[14px]">error</span>
                {{ errors.password }}
              </p>
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

            <!-- Submit Action -->
            <button 
              class="w-full bg-tertiary text-on-tertiary font-title-md text-title-md py-3 rounded-lg mt-2 hover:bg-primary-container transition-all active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container cursor-pointer flex items-center justify-center gap-2" 
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Đăng nhập</span>
            </button>

            <!-- Forgot Password (Under Login Button) -->
            <div class="flex justify-center items-center mt-3">
              <button 
                type="button"
                @click="openForgotPasswordModal"
                class="font-body-sm text-body-sm text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors focus:outline-none rounded px-1 bg-transparent border-none p-0 cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
          </form>

        </div>

        <!-- Subtle Footer Links -->
        <div class="absolute bottom-container-padding flex gap-stack-md font-body-sm text-body-sm text-on-surface-variant">
          <a class="hover:text-on-surface transition-colors hover:underline focus:outline-none focus:text-on-tertiary-container rounded px-1" href="#">Chính sách bảo mật</a>
          <a class="hover:text-on-surface transition-colors hover:underline focus:outline-none focus:text-on-tertiary-container rounded px-1" href="#">Điều khoản dịch vụ</a>
        </div>
      </section>
    </main>

    <!-- Forgot Password Modal -->
    <teleport to="body">
      <div v-if="forgotPassModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full p-6 space-y-4 animate-scale-in flex flex-col">
          <div class="flex items-center gap-3 text-primary-container border-b border-white/40 pb-3 justify-between">
            <h3 class="font-title-md text-[18px] font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-[24px] text-blue-600">lock_reset</span>
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

            <button
              v-if="otpStep === 1"
              @click="sendOtp"
              :disabled="sendingOtp || !forgotEmail"
              class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="sendingOtp" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Gửi mã OTP
            </button>

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
import { ref, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')

onMounted(() => {
  if (route.query.logout === 'success') {
    showSnackbar('Đăng xuất thành công', 'success')
  }
})

const username = ref('')
const password = ref('')
const passwordVisible = ref(false)
const loading = ref(false)
const error = ref(null)
const shouldShake = ref(false)

const errors = ref({
  username: '',
  password: ''
})

function triggerShake() {
  shouldShake.value = true
  setTimeout(() => {
    shouldShake.value = false
  }, 500)
}

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value
}

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
.bg-background {
  background-color: #f8f9fa;
}

.glass-panel {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0px 12px 24px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

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

.glass-backdrop {
  background: rgba(0, 6, 19, 0.4);
  backdrop-filter: blur(8px);
}

.glass-input {
  background: rgba(0, 31, 63, 0.03);
  border: 1px solid #cbd5e1;
  transition: all 0.2s;
}
.glass-input:focus {
  outline: none;
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* Force autofilled inputs to stay white and have dark text and visible border */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active,
input:-internal-autofill-previewed,
input:-internal-autofill-selected {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
  box-shadow: 0 0 0 1000px #ffffff inset !important;
  -webkit-text-fill-color: #191c1d !important;
  color: #191c1d !important;
  border: 1px solid #cbd5e1 !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Floating Label CSS Engine */
.floating-label {
  top: 18px;
  font-size: 16px;
  color: #94a3b8;
}

/* Float states: focus, non-empty, autofilled */
.floating-input:focus ~ .floating-label,
.floating-input:not(:placeholder-shown) ~ .floating-label,
.floating-input:-webkit-autofill ~ .floating-label {
  top: 6px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  color: #7024c4 !important; /* matches tertiary theme color */
}

/* Normal filled/autofilled but unfocused state is slate color */
.floating-input:not(:focus):not(:placeholder-shown) ~ .floating-label,
.floating-input:not(:focus):-webkit-autofill ~ .floating-label {
  color: #64748b !important;
}
</style>
