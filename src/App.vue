<template>
  <div class="flex min-h-screen text-on-surface font-body-lg text-body-lg">
    <!-- Sidebar Navigation -->
    <nav v-if="route.name !== 'Login'" :class="[mobileMenuOpen ? 'left-0' : '-left-72 md:left-0', 'w-72 h-screen fixed top-0 bg-primary-container shadow-[0px_12px_24px_rgba(0,0,0,0.15)] flex flex-col py-base z-50 transition-all duration-300 md:flex']">
      <!-- Brand/Header -->
      <div class="px-6 py-6 mb-4 flex items-center gap-4 border-b border-white/10">
        <div class="w-10 h-10 rounded-lg bg-on-tertiary-container flex items-center justify-center shadow-inner overflow-hidden shrink-0">
          <span class="material-symbols-outlined text-white text-[24px]">school</span>
        </div>
        <div>
          <h1 class="font-headline-lg text-[18px] leading-tight font-bold text-white">EduManager Pro</h1>
          <p class="font-body-sm text-[12px] text-white/60">Executive Dashboard</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto px-4 space-y-1">
        <template v-for="item in navItems" :key="item.title">
          <!-- Parent Item -->
          <router-link
            :to="item.path"
            @click="mobileMenuOpen = false"
            v-slot="{ isActive }"
          >
            <div
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer',
                isActive && !item.children
                  ? 'bg-white/10 text-on-tertiary-container font-bold border-l-2 border-on-tertiary-container shadow-sm'
                  : (isActive && item.children)
                    ? 'bg-white/5 text-on-tertiary-container font-bold border-l-2 border-on-tertiary-container/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
            >
              <span class="material-symbols-outlined" :style="isActive ? 'font-variation-settings: \'FILL\' 1;' : ''">{{ item.icon }}</span>
              <span class="font-title-md text-[14px] flex-1">{{ item.title }}</span>
              <span v-if="item.children" class="material-symbols-outlined text-[18px] transition-transform duration-200" :class="{ 'rotate-180': isActive }">
                expand_more
              </span>
            </div>
          </router-link>

          <!-- Sub-items -->
          <div v-if="item.children && route.path === item.path" class="pl-5 mt-1 mb-2 space-y-1 border-l border-white/10 ml-6">
            <router-link
              v-for="subItem in item.children"
              :key="subItem.title"
              :to="{ path: subItem.path, query: subItem.query }"
              v-slot="{ href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="(e) => { navigate(e); mobileMenuOpen = false; }"
                :class="[
                  'flex items-center gap-2.5 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer text-left',
                  isSubItemActive(subItem)
                    ? 'bg-white/10 text-on-tertiary-container font-semibold shadow-sm'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                ]"
              >
                <span class="material-symbols-outlined text-[18px]" :style="isSubItemActive(subItem) ? 'font-variation-settings: \'FILL\' 1;' : ''">
                  {{ subItem.icon }}
                </span>
                <span class="font-body-sm text-[13px]">{{ subItem.title }}</span>
              </a>
            </router-link>
          </div>
        </template>
      </div>

      <!-- Footer CTA -->
      <div class="px-4 mt-auto pt-4 border-t border-white/10">
        <button class="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors font-title-md text-[14px]">
          <span class="material-symbols-outlined text-[20px]">help_center</span>
          Help Center
        </button>
      </div>
    </nav>

    <!-- Mobile Drawer Overlay -->
    <div v-if="mobileMenuOpen && route.name !== 'Login'" @click="mobileMenuOpen = false" class="fixed inset-0 bg-[#000613]/40 backdrop-blur-xs z-40 md:hidden"></div>

    <!-- Main Content Wrapper -->
    <div :class="[route.name === 'Login' ? 'ml-0' : 'main-content-layout', 'flex-1 flex flex-col min-h-screen']">
      <!-- TopNavBar -->
      <header v-if="route.name !== 'Login'" class="flex justify-between items-center px-container-padding h-20 bg-white/70 backdrop-blur-[20px] border-b border-white/40 shadow-sm sticky top-0 z-40 w-full">
        <!-- Title / Page Name -->
        <div class="flex items-center">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-on-surface-variant hover:text-on-tertiary-container mr-3 flex items-center" title="Menu">
            <span class="material-symbols-outlined text-[26px]">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
          <h2 class="text-xl font-bold text-primary">{{ currentTitle }}</h2>
        </div>

        <!-- Actions (Right) -->
        <div class="flex items-center gap-6">
          <!-- Profile -->
          <div class="relative flex items-center gap-3">
            <div
              @click="toggleProfileDropdown"
              class="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div class="text-right hidden sm:block">
                <p class="font-title-md text-[14px] text-primary group-hover:text-on-tertiary-container transition-colors">{{ authStore.currentUser?.fullName || 'Người dùng' }}</p>
                <p class="font-body-sm text-[12px] text-on-surface-variant">{{ getRoleLabel(authStore.currentUser?.role) }}</p>
              </div>
              <div class="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-primary-container/20 flex items-center justify-center font-bold text-primary transition-transform group-active:scale-95 overflow-hidden">
                <img v-if="authStore.avatar" :src="authStore.avatar" class="w-full h-full object-cover" alt="Avatar" />
                <template v-else>
                  {{ (authStore.currentUser?.fullName || 'N').charAt(0).toUpperCase() }}
                </template>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">expand_more</span>
            </div>

            <!-- Profile Dropdown Menu Backdrop -->
            <div
              v-if="profileDropdownOpen"
              @click="profileDropdownOpen = false"
              class="fixed inset-0 z-40 bg-transparent"
            ></div>

            <!-- Profile Dropdown Menu -->
            <transition name="fade">
              <div
                v-if="profileDropdownOpen"
                class="absolute right-0 top-12 mt-2 w-48 bg-white border border-outline-variant/60 rounded-xl shadow-lg py-2 z-50 animate-scale-in"
              >
                <router-link
                  to="/profile"
                  @click="profileDropdownOpen = false"
                  class="w-full px-4 py-2.5 text-left text-body-sm font-semibold text-primary hover:bg-primary-container/10 transition-colors flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">person</span>
                  Trang cá nhân
                </router-link>
                <div class="border-t border-outline-variant/40 my-1"></div>
                <button
                  @click="openChangePasswordModal"
                  class="w-full px-4 py-2.5 text-left text-body-sm font-semibold text-primary hover:bg-primary-container/10 transition-colors flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px] text-on-tertiary-container">key</span>
                  Đổi mật khẩu
                </button>
                <div class="border-t border-outline-variant/40 my-1"></div>
                <button
                  @click="triggerLogout"
                  class="w-full px-4 py-2.5 text-left text-body-sm font-semibold text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]">logout</span>
                  Đăng xuất
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Main Canvas -->
      <main :class="[route.name === 'Login' ? 'p-0' : 'p-container-padding pb-20', 'flex-1']">
        <div :class="[route.name === 'Login' ? 'max-w-none' : 'max-w-[1400px]', 'mx-auto']">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="glass-panel max-w-md w-full rounded-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col">
        <!-- Title -->
        <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
          <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-on-tertiary-container">key</span>
            Đổi mật khẩu
          </h3>
          <button @click="closeChangePasswordModal" class="text-on-surface-variant hover:text-primary">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4">
          <!-- Current Password -->
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary">Mật khẩu hiện tại *</label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary"
              placeholder="Nhập mật khẩu hiện tại"
              @input="validatePasswordForm"
            />
            <p v-if="passwordErrors.oldPassword" class="text-error text-[11px] font-semibold">{{ passwordErrors.oldPassword }}</p>
          </div>

          <!-- New Password -->
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary">Mật khẩu mới *</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary"
              placeholder="Tối thiểu 6 ký tự"
              @input="validatePasswordForm"
            />
            <p v-if="passwordErrors.newPassword" class="text-error text-[11px] font-semibold">{{ passwordErrors.newPassword }}</p>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary">Xác nhận mật khẩu mới *</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-primary"
              placeholder="Nhập lại mật khẩu mới"
              @input="validatePasswordForm"
            />
            <p v-if="passwordErrors.confirmPassword" class="text-error text-[11px] font-semibold">{{ passwordErrors.confirmPassword }}</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
          <button
            @click="closeChangePasswordModal"
            class="px-5 py-2.5 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            @click="submitChangePassword"
            :disabled="changingPassword || !isPasswordFormValid"
            class="px-5 py-2.5 rounded-lg bg-on-tertiary-container text-white font-semibold text-[13px] hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span v-if="changingPassword" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>

    <!-- Global Snackbar Notification -->
    <transition name="fade">
      <div v-if="snackbar.show" class="fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl glass-panel shadow-lg border-l-4 border-on-tertiary-container">
        <span class="material-symbols-outlined text-[#2e7d32]" v-if="snackbar.color === 'success'">check_circle</span>
        <span class="material-symbols-outlined text-error" v-else-if="snackbar.color === 'error'">error</span>
        <span class="material-symbols-outlined text-[#f57f17]" v-else-if="snackbar.color === 'warning'">warning</span>
        <span class="material-symbols-outlined text-on-tertiary-container" v-else>info</span>
        
        <div class="text-body-sm font-semibold text-primary pr-2">{{ snackbar.text }}</div>
        
        <button @click="snackbar.show = false" class="text-on-surface-variant hover:text-primary flex items-center">
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const isSubItemActive = (subItem) => {
  if (route.path !== subItem.path) return false
  const currentTab = route.query.tab || 'classes'
  const targetTab = subItem.query?.tab || 'classes'
  return currentTab === targetTab
}

const currentTitle = computed(() => {
  return route.meta?.title || 'EduManager Pro'
})

const getRoleLabel = (role) => {
  const map = { Admin: 'Quản trị viên', GiaoVien: 'Giáo viên', HocVien: 'Học viên' }
  return map[role] || role || 'Khách hàng'
}

const logout = () => {
  authStore.logout()
  router.push('/login')
  showSnackbar('Đăng xuất thành công', 'success')
}

const navItems = computed(() => {
  if (authStore.isStudent) {
    return [
      {
        title: 'Cổng học tập',
        icon: 'dashboard',
        path: '/student-portal',
        children: [
          { title: 'Lớp học & Lịch học', icon: 'school', path: '/student-portal', query: { tab: 'classes' } },
          { title: 'Bảng điểm của tôi', icon: 'history_edu', path: '/student-portal', query: { tab: 'grades' } },
          { title: 'Nhật ký chuyên cần', icon: 'how_to_reg', path: '/student-portal', query: { tab: 'attendance' } },
          { title: 'Học phí & Thanh toán', icon: 'receipt_long', path: '/student-portal', query: { tab: 'payments' } },
          { title: 'Ví bảo lưu', icon: 'account_balance_wallet', path: '/student-portal', query: { tab: 'credits' } }
        ]
      },
      { title: 'Đăng ký khóa học', icon: 'import_contacts', path: '/register-course' }
    ]
  }

  const items = [
    { title: 'Khóa học', icon: 'school', path: '/courses' },
    { title: 'Lớp học', icon: 'groups', path: '/classes' },
    { title: 'Học viên', icon: 'person', path: '/students' }
  ]

  if (authStore.isAdmin) {
    items.push({
      title: 'Cổng học tập (HV)',
      icon: 'dashboard',
      path: '/student-portal',
      children: [
        { title: 'Lớp học & Lịch học', icon: 'school', path: '/student-portal', query: { tab: 'classes' } },
        { title: 'Bảng điểm của tôi', icon: 'history_edu', path: '/student-portal', query: { tab: 'grades' } },
        { title: 'Nhật ký chuyên cần', icon: 'how_to_reg', path: '/student-portal', query: { tab: 'attendance' } },
        { title: 'Học phí & Thanh toán', icon: 'receipt_long', path: '/student-portal', query: { tab: 'payments' } },
        { title: 'Ví bảo lưu', icon: 'account_balance_wallet', path: '/student-portal', query: { tab: 'credits' } }
      ]
    })
    items.push({ title: 'Đăng ký khóa học (HV)', icon: 'import_contacts', path: '/register-course' })
    items.push({ title: 'Thanh toán & Báo cáo', icon: 'payments', path: '/payments' })
    items.push({ title: 'Quản lý danh mục', icon: 'category', path: '/categories' })
    items.push({ title: 'Quản lý tài khoản', icon: 'manage_accounts', path: '/users' })
    items.push({ title: 'Yêu cầu hỗ trợ', icon: 'chat', path: '/support-messages' })
  }

  return items
})

// Global snackbar
const snackbar = ref({ show: false, text: '', color: 'success' })

const showSnackbar = (text, color = 'success') => {
  snackbar.value = { show: true, text, color }
  setTimeout(() => {
    if (snackbar.value.text === text) {
      snackbar.value.show = false
    }
  }, 4000)
}

// Profile Dropdown logic
const profileDropdownOpen = ref(false)
const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value
}
const triggerLogout = () => {
  profileDropdownOpen.value = false
  logout()
}

// Change Password logic
const showChangePasswordModal = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordErrors = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const changingPassword = ref(false)

const openChangePasswordModal = () => {
  profileDropdownOpen.value = false
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  passwordErrors.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  showChangePasswordModal.value = true
}

const closeChangePasswordModal = () => {
  showChangePasswordModal.value = false
}

const validatePasswordForm = () => {
  let valid = true
  if (!passwordForm.value.oldPassword) {
    passwordErrors.value.oldPassword = 'Mật khẩu hiện tại không được để trống'
    valid = false
  } else {
    passwordErrors.value.oldPassword = ''
  }

  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'Mật khẩu mới không được để trống'
    valid = false
  } else if (passwordForm.value.newPassword.length < 6) {
    passwordErrors.value.newPassword = 'Mật khẩu mới phải từ 6 ký tự trở lên'
    valid = false
  } else {
    passwordErrors.value.newPassword = ''
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Xác nhận mật khẩu mới không khớp'
    valid = false
  } else {
    passwordErrors.value.confirmPassword = ''
  }

  return valid
}

const isPasswordFormValid = computed(() => {
  return passwordForm.value.oldPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.newPassword.length >= 6 &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

const submitChangePassword = async () => {
  if (!isPasswordFormValid.value) return
  changingPassword.value = true
  try {
    await authStore.changePassword(passwordForm.value.oldPassword, passwordForm.value.newPassword)
    showSnackbar('Đổi mật khẩu thành công', 'success')
    showChangePasswordModal.value = false
  } catch (err) {
    showSnackbar(err.response?.data?.message || 'Lỗi khi đổi mật khẩu', 'error')
  } finally {
    changingPassword.value = false
  }
}

provide('showSnackbar', showSnackbar)
</script>

<style scoped>
@media (min-width: 768px) {
  .main-content-layout {
    margin-left: 288px !important;
  }
}
</style>
