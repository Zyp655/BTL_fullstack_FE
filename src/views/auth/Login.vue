<template>
  <div class="bg-background text-on-background font-body-lg text-body-lg antialiased min-h-screen flex selection:bg-tertiary-fixed selection:text-on-tertiary-fixed w-full">
    <!-- Split Layout Container -->
    <main class="flex w-full min-h-screen">
      <!-- Left Pane: Brand & Graphic (Hidden on small screens) -->
      <section class="hidden lg:flex lg:w-1/2 bg-primary-container relative overflow-hidden flex-col justify-between p-stack-lg">
        <!-- Graphic Background -->
        <div class="absolute inset-0 z-0 flex items-center justify-center opacity-80 mix-blend-lighten pointer-events-none">
          <img 
            alt="Abstract flowing glowing shapes representing education and connectivity" 
            class="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADRL12gsKtYemVxwlzlasXb5v2U6faE6-MkjZ--1lDSMp2g_tiEtoVO45Lvxk-JjJ5vCg_9Sy7OttnyRj2586nkeU_pQDszcB6oQNrTXiqOBUYWbBCWIgXrfwBMqvLhQ_VRryd0GlvX1Tcs56w8sxcw9S-aJuOvJRZsDGItn9hcjlXw2oefGyGdMMhm5jSMzuYDNjKDjasa4XRyS1PM-5aj_YXF3rnyFveJDq7mB7k6_GQOfpfJQ3WrCZm2cbqUnfV1mxpOcZ-nYf2"
          />
        </div>
        <!-- Content Overlay -->
        <div class="relative z-10 flex items-center gap-base">
          <span class="material-symbols-outlined text-headline-lg text-on-primary">school</span>
          <span class="font-title-md text-title-md text-on-primary tracking-tight">EduManager Pro</span>
        </div>
        <div class="relative z-10 max-w-lg mb-20">
          <h1 class="font-display-lg text-display-lg text-on-primary mb-stack-md leading-tight drop-shadow-md">
            Empowering the Future of Education
          </h1>
          <p class="font-body-lg text-body-lg text-on-primary-container opacity-90 max-w-md">
            The centralized, secure platform for modern academic administration.
          </p>
        </div>
        <!-- Decorative gradient to ensure text readability at bottom -->
        <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary-container to-transparent z-0 pointer-events-none"></div>
      </section>

      <!-- Right Pane: Form Interface -->
      <section class="w-full lg:w-1/2 flex flex-col justify-center items-center bg-surface-container-lowest relative p-container-padding">
        <!-- Mobile Brand Header (Visible only on mobile) -->
        <div class="lg:hidden flex items-center gap-base absolute top-container-padding left-container-padding">
          <span class="material-symbols-outlined text-headline-lg-mobile text-primary">school</span>
          <span class="font-title-md text-title-md text-primary tracking-tight">EduManager Pro</span>
        </div>
        
        <!-- Login Container (Glassmorphism) -->
        <div 
          class="glass-panel w-full max-w-[420px] rounded-xl p-stack-md flex flex-col gap-stack-md relative z-10 mt-12 lg:mt-0"
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
                class="peer w-full bg-glass-input-bg border border-outline-variant rounded-lg px-4 pt-6 pb-2 text-body-lg font-body-lg text-on-surface placeholder-transparent focus:outline-none focus:ring-2 focus:ring-on-tertiary-container focus:border-transparent transition-all shadow-inner" 
                id="username" 
                name="username" 
                placeholder="Tên đăng nhập / Email" 
                required 
                type="text"
                @input="errors.username = ''"
              />
              <label 
                class="absolute left-4 top-2 text-label-caps font-label-caps text-on-surface-variant transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-lg peer-placeholder-shown:font-body-lg peer-focus:top-2 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-on-tertiary-container pointer-events-none" 
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
                class="peer w-full bg-glass-input-bg border border-outline-variant rounded-lg pl-4 pr-12 pt-6 pb-2 text-body-lg font-body-lg text-on-surface placeholder-transparent focus:outline-none focus:ring-2 focus:ring-on-tertiary-container focus:border-transparent transition-all shadow-inner" 
                id="password" 
                name="password" 
                placeholder="Mật khẩu" 
                required 
                @input="errors.password = ''"
              />
              <label 
                class="absolute left-4 top-2 text-label-caps font-label-caps text-on-surface-variant transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-lg peer-placeholder-shown:font-body-lg peer-focus:top-2 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-on-tertiary-container pointer-events-none" 
                for="password"
              >
                Mật khẩu
              </label>
              <button 
                aria-label="Toggle password visibility" 
                class="absolute right-3 top-4 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none focus:text-on-tertiary-container rounded p-1" 
                @click="togglePasswordVisibility" 
                type="button"
              >
                <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 0;">
                  {{ passwordVisible ? 'visibility' : 'visibility_off' }}
                </span>
              </button>
              <p v-if="errors.password && errors.password.trim() !== ''" class="error-text">
                <span class="material-symbols-outlined text-[14px]">error</span>
                {{ errors.password }}
              </p>
            </div>

            <!-- Options -->
            <div class="flex justify-between items-center mt-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input class="w-4 h-4 rounded border-outline-variant text-on-tertiary-container focus:ring-on-tertiary-container bg-surface cursor-pointer" type="checkbox"/>
                <span class="font-body-sm text-body-sm text-on-surface-variant">Remember me</span>
              </label>
              <button 
                type="button"
                @click="openForgotPasswordModal"
                class="font-body-sm text-body-sm text-on-tertiary-container hover:text-on-tertiary-fixed-variant font-semibold transition-colors focus:outline-none focus:underline rounded px-1 bg-transparent border-none p-0 cursor-pointer"
              >
                Forgot Password?
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

            <!-- Submit Action -->
            <button 
              class="w-full bg-tertiary text-on-tertiary font-title-md text-title-md py-3 rounded-lg mt-2 hover:bg-primary-container transition-all active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container cursor-pointer flex items-center justify-center gap-2" 
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Sign In</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-2">
            <div class="flex-1 h-px bg-outline-variant opacity-50"></div>
            <span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[11px]">Or continue with</span>
            <div class="flex-1 h-px bg-outline-variant opacity-50"></div>
          </div>

          <!-- Social Logins -->
          <div class="flex gap-stack-sm justify-center">
            <button aria-label="Sign in with Google" class="flex-1 flex justify-center items-center py-2.5 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-outline cursor-pointer">
              <svg class="w-5 h-5" fill="none" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
            </button>
            <button aria-label="Sign in with Microsoft" class="flex-1 flex justify-center items-center py-2.5 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-outline cursor-pointer">
              <svg class="w-5 h-5" fill="none" viewbox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect fill="#F25022" height="9" width="9" x="1" y="1"></rect>
                <rect fill="#7FBA00" height="9" width="9" x="11" y="1"></rect>
                <rect fill="#00A4EF" height="9" width="9" x="1" y="11"></rect>
                <rect fill="#FFB900" height="9" width="9" x="11" y="11"></rect>
              </svg>
            </button>
            <button aria-label="Sign in with Facebook" class="flex-1 flex justify-center items-center py-2.5 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-outline cursor-pointer">
              <svg class="w-5 h-5" fill="none" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" fill="#1877F2"></path>
              </svg>
            </button>
          </div>

          <!-- Quick Demo Login Buttons (Integrated for testing) -->
          <div class="space-y-2 mt-4 pt-4 border-t border-outline-variant/20">
            <div class="text-[12px] text-center text-on-surface-variant font-medium">Đăng nhập nhanh tài khoản dùng thử</div>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="fillDemo('admin')"
                class="px-4 py-2.5 rounded-lg border border-primary-container/20 hover:border-primary-container/40 hover:bg-primary-container/5 text-primary-container font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer bg-white/40"
              >
                <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                Admin
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

        <!-- Subtle Footer Links -->
        <div class="absolute bottom-container-padding flex gap-stack-md font-body-sm text-body-sm text-on-surface-variant">
          <a class="hover:text-on-surface transition-colors hover:underline focus:outline-none focus:text-on-tertiary-container rounded px-1" href="#">Privacy Policy</a>
          <a class="hover:text-on-surface transition-colors hover:underline focus:outline-none focus:text-on-tertiary-container rounded px-1" href="#">Terms of Service</a>
        </div>
      </section>
    </main>

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
  background: rgba(0, 31, 63, 0.05);
  border: 1px solid rgba(0, 31, 63, 0.1);
  transition: all 0.2s;
}
.glass-input:focus {
  outline: none;
  border-color: #2b83ff;
  box-shadow: 0 0 0 3px rgba(43, 131, 255, 0.2);
}
</style>
