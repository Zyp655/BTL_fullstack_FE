<template>
  <div class="flex min-h-screen text-on-surface font-body-lg text-body-lg">
    <!-- Sidebar Navigation -->
    <nav 
      v-if="!route.meta.public" 
      @mouseenter="isSidebarHovered = true"
      @mouseleave="isSidebarHovered = false"
      :class="[
        mobileMenuOpen ? 'left-0' : '-left-60 md:left-0', 
        isSidebarExpanded ? 'w-60' : 'w-[76px]',
        'h-screen fixed top-0 bg-primary-container shadow-[0px_12px_24px_rgba(0,0,0,0.15)] flex flex-col py-base z-50 transition-all duration-300 md:flex'
      ]"
    >

      <!-- Brand/Header -->
      <div 
        class="mb-4 flex items-center border-b border-white/10 transition-all duration-300 py-6"
        :class="isSidebarExpanded ? 'px-6 gap-4' : 'px-4 justify-center'"
      >
        <div class="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
          <span class="material-symbols-outlined text-white text-[24px]">school</span>
        </div>
        <div 
          :class="[
            isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none overflow-hidden',
            'transition-all duration-300 origin-left flex flex-col shrink-0'
          ]"
        >
          <h1 class="font-headline-lg text-[18px] leading-tight font-bold text-white whitespace-nowrap">EduManager Pro</h1>
          <p class="font-body-sm text-[12px] text-white/60 whitespace-nowrap">Hệ thống quản lý</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <div 
        class="flex-1 overflow-y-auto space-y-1 transition-all duration-300"
        :class="isSidebarExpanded ? 'px-4' : 'px-2'"
      >
        <template v-for="item in navItems" :key="item.title">
          <!-- Parent Item -->
          <router-link
            :to="item.query ? { path: item.path, query: item.query } : item.path"
            @click="mobileMenuOpen = false; if (item.children) toggleMenu(item.title)"
            v-slot="{ isActive }"
          >
            <div
              :class="[
                'flex items-center rounded-lg transition-all duration-200 cursor-pointer py-3',
                isSidebarExpanded ? 'gap-3 px-4' : 'justify-center px-1',
                isItemActive(item, isActive) && !item.children
                  ? 'bg-white/15 text-white font-bold border-l-2 border-purple-300 shadow-sm'
                  : (isActive && item.children)
                    ? 'bg-white/5 text-purple-200 font-bold border-l-2 border-purple-300/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
            >
              <span class="material-symbols-outlined shrink-0" :style="isActive ? 'font-variation-settings: \'FILL\' 1;' : ''">{{ item.icon }}</span>
              <span 
                :class="[
                  isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none overflow-hidden',
                  'font-title-md text-[14px] flex-1 whitespace-nowrap transition-all duration-300'
                ]"
              >
                {{ item.title }}
              </span>
              <span 
                v-if="item.children" 
                :class="[
                  isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none overflow-hidden',
                  'material-symbols-outlined text-[18px] transition-transform duration-200'
                ]"
                :style="openMenus[item.title] ? 'transform: rotate(180deg);' : ''"
              >
                expand_more
              </span>
            </div>
          </router-link>

          <!-- Sub-items -->
          <div v-if="item.children && openMenus[item.title] && isSidebarExpanded" class="pl-5 mt-1 mb-2 space-y-1 border-l border-white/10 ml-6">
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
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
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

      <!-- Profile Section (Bottom of Sidebar) -->
      <div 
        class="border-t border-white/10 mt-auto relative transition-all duration-300"
        :class="isSidebarExpanded ? 'p-4' : 'p-2'"
      >
        <!-- Profile Dropdown Menu Backdrop -->
        <div
          v-if="profileDropdownOpen"
          @click="profileDropdownOpen = false"
          class="fixed inset-0 z-40 bg-transparent"
        ></div>

        <div
          @click="toggleProfileDropdown"
          class="flex items-center rounded-lg hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer select-none group py-2.5"
          :class="isSidebarExpanded ? 'gap-3 px-3' : 'justify-center px-1'"
        >
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full border-2 border-white/20 shadow-sm bg-white/10 flex items-center justify-center font-bold text-white transition-transform overflow-hidden shrink-0">
            <img v-if="authStore.avatar" :src="authStore.avatar" class="w-full h-full object-cover" alt="Avatar" />
            <template v-else>
              {{ (authStore.currentUser?.fullName || 'N').charAt(0).toUpperCase() }}
            </template>
          </div>
          <!-- Info -->
          <div 
            :class="[
              isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none overflow-hidden',
              'flex-1 text-left min-w-0 transition-all duration-300'
            ]"
          >
            <p class="font-title-md text-[14px] text-white font-semibold truncate group-hover:text-purple-200 transition-colors whitespace-nowrap" :title="authStore.currentUser?.fullName">
              {{ authStore.currentUser?.fullName || 'Người dùng' }}
            </p>
            <p class="font-body-sm text-[11px] text-white/50 truncate whitespace-nowrap">
              {{ getRoleLabel(authStore.currentUser?.role) }}
            </p>
          </div>
          <!-- Dropdown Icon -->
          <span 
            :class="[
              isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none overflow-hidden',
              'material-symbols-outlined text-white/50 group-hover:text-white transition-all duration-300 text-[20px] shrink-0'
            ]"
            :style="profileDropdownOpen ? 'transform: rotate(180deg);' : ''"
          >
            unfold_more
          </span>
        </div>

        <!-- Profile Dropdown Menu -->
        <transition name="fade">
          <div
            v-if="profileDropdownOpen"
            class="absolute left-4 bottom-20 w-[208px] bg-white border border-outline-variant/60 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] py-2 z-50 animate-scale-in"
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

      <!-- Pin / Expand Toggle Button (Desktop Only, Rendered Last for DOM Stacking Order) -->
      <button 
        @click="toggleSidebarPin"
        class="hidden md:flex absolute -right-3 top-6 w-6 h-6 rounded-full bg-white text-primary-container border border-slate-200 shadow-md items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        style="z-index: 999;"
        :title="isSidebarPinned ? 'Thu nhỏ menu' : 'Ghim mở rộng menu'"
      >
        <span 
          class="material-symbols-outlined text-[16px] transition-transform duration-300"
          :class="isSidebarPinned ? 'animate-nudge-left' : 'animate-nudge-right'"
        >
          chevron_left
        </span>
      </button>

    </nav>

    <!-- Mobile Drawer Overlay -->
    <div v-if="mobileMenuOpen && !route.meta.public" @click="mobileMenuOpen = false" class="fixed inset-0 bg-[#000613]/40 backdrop-blur-xs z-40 md:hidden"></div>

    <!-- Main Content Wrapper -->
    <div :class="[route.meta.public ? 'ml-0' : (isSidebarExpanded ? 'main-content-layout-pinned' : 'main-content-layout-collapsed'), 'flex-1 flex flex-col min-h-screen transition-all duration-300']">
      <!-- TopNavBar -->
      <header v-if="!route.meta.public" class="flex md:hidden justify-between items-center px-container-padding h-16 bg-white/70 backdrop-blur-[20px] border-b border-white/40 shadow-sm sticky top-0 z-40 w-full">
        <!-- Title / Page Name -->
        <div class="flex items-center">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-on-surface-variant hover:text-on-tertiary-container mr-3 flex items-center" title="Menu">
            <span class="material-symbols-outlined text-[26px]">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
          <h2 class="text-xl font-bold text-primary">{{ currentTitle }}</h2>
        </div>
      </header>

      <!-- Main Canvas -->
      <main :class="[route.meta.public ? 'p-0' : 'p-container-padding pb-20', 'flex-1']">
        <div :class="[route.meta.public ? 'max-w-none' : 'max-w-[1400px]', 'mx-auto']">
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

    <!-- Global Notification Bell (Desktop & Mobile) -->
    <div v-if="!route.meta.public && authStore.isAuthenticated" class="fixed top-3 right-4 z-[999]">
      <div class="relative">
        <button
          @click="toggleNotificationDropdown"
          class="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-indigo-600 transition-all cursor-pointer active:scale-95 relative group hover:shadow-lg"
          title="Thông báo"
        >
          <!-- Bell icon -->
          <span class="material-symbols-outlined text-[22px] group-hover:animate-bounce">notifications</span>
          <!-- Unread count badge -->
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center border border-white animate-pulse">
            {{ unreadCount }}
          </span>
        </button>

        <!-- Notification Dropdown Menu Backdrop -->
        <div
          v-if="notificationDropdownOpen"
          @click="notificationDropdownOpen = false"
          class="fixed inset-0 z-[998] bg-transparent"
        ></div>

        <!-- Notification List Dropdown -->
        <transition name="fade">
          <div
            v-if="notificationDropdownOpen"
            class="absolute right-0 mt-2 w-80 bg-white border border-outline-variant/60 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden z-[1000] flex flex-col max-h-[480px] animate-scale-in"
          >
            <!-- Header -->
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span class="font-bold text-slate-800 text-body-md flex items-center gap-1.5">
                <span class="material-symbols-outlined text-indigo-600 text-[20px]">notifications</span>
                Thông báo mới
              </span>
              <button
                v-if="unreadCount > 0"
                @click="markAllAsRead"
                class="text-[11px] text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Đọc tất cả
              </button>
            </div>

            <!-- Search & Filters -->
            <div class="px-3 py-2 border-b border-slate-100 bg-white space-y-2">
              <!-- Search Input -->
              <div class="relative">
                <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                <input
                  type="text"
                  v-model="notificationSearch"
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  placeholder="Tìm kiếm thông báo..."
                />
                <button
                  v-if="notificationSearch"
                  @click="notificationSearch = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
              
              <!-- Chips Filters (Horizontal Scrollable) -->
              <div class="flex gap-1 overflow-x-auto py-0.5 hide-scrollbar -mx-1 px-1">
                <button
                  v-for="chip in [
                    { label: 'Tất cả', value: 'all' },
                    { label: 'Chưa đọc', value: 'unread' },
                    { label: 'Học tập', value: 'grade' },
                    { label: 'Học phí', value: 'payment' },
                    { label: 'Hỗ trợ', value: 'support' }
                  ]"
                  :key="chip.value"
                  @click="notificationFilter = chip.value"
                  :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer border',
                    notificationFilter === chip.value
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  ]"
                >
                  {{ chip.label }}
                </button>
              </div>
            </div>

            <!-- List -->
            <div class="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[360px] no-scrollbar">
              <div
                v-for="item in filteredNotifications"
                :key="item.id"
                @click="clickNotification(item)"
                class="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 text-left relative"
                :class="{ 'bg-indigo-50/10 font-medium': !readNotificationIds.includes(item.id) }"
              >
                <!-- Dot for unread -->
                <span v-if="!readNotificationIds.includes(item.id)" class="absolute top-4 right-3 w-2 h-2 rounded-full bg-indigo-600"></span>
 
                <!-- Icon -->
                <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="item.color">
                  <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
                </div>
 
                <!-- Text -->
                <div class="space-y-0.5 flex-1 min-w-0 pr-2">
                  <div class="text-[12px] font-bold text-slate-800 pr-3 leading-snug">{{ item.title }}</div>
                  <div class="text-[11px] text-slate-655 leading-relaxed">{{ item.message }}</div>
                  <div class="text-[9px] text-slate-400 font-bold font-mono pt-1">{{ formatTimeAgo(item.time) }}</div>
                </div>
              </div>
 
              <!-- Empty state -->
              <div v-if="filteredNotifications.length === 0" class="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[36px] text-slate-300">notifications_off</span>
                <span class="text-xs font-semibold">Không tìm thấy thông báo nào</span>
              </div>
            </div>
          </div>
        </transition>
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
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import api from './services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const isSidebarPinned = ref(localStorage.getItem('sidebar_pinned') === 'true')
const isSidebarHovered = ref(false)

const isSidebarExpanded = computed(() => {
  if (mobileMenuOpen.value) return true
  return isSidebarPinned.value || isSidebarHovered.value
})

const toggleSidebarPin = () => {
  isSidebarPinned.value = !isSidebarPinned.value
  localStorage.setItem('sidebar_pinned', isSidebarPinned.value ? 'true' : 'false')
}

const openMenus = ref({
  'Cổng học tập': true,
  'Hỗ trợ & Khác': true,
  'Khảo sát & Đánh giá': true
})

const toggleMenu = (title) => {
  openMenus.value[title] = !openMenus.value[title]
}

// Global route watcher to reset body overflow styling when navigating between pages
watch(() => route.fullPath, () => {
  document.body.style.overflow = ''
})

const isSubItemActive = (subItem) => {
  if (route.path !== subItem.path) return false
  let defaultTab = 'classes'
  if (route.path === '/other-services') defaultTab = 'support'
  else if (route.path === '/evaluation-management') defaultTab = 'results'
  const currentTab = route.query.tab || defaultTab
  const targetTab = subItem.query?.tab || defaultTab
  return currentTab === targetTab
}

const isItemActive = (item, isActive) => {
  if (item.children) return isActive
  if (route.path !== item.path) return false
  if (item.query) {
    let defaultTab = 'classes'
    if (route.path === '/other-services') defaultTab = 'support'
    else if (route.path === '/evaluation-management') defaultTab = 'results'
    const currentTab = route.query.tab || defaultTab
    const targetTab = item.query.tab || defaultTab
    return currentTab === targetTab
  }
  return true
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
  window.location.href = '/login?logout=success'
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
          { title: 'Đăng ký môn học', icon: 'import_contacts', path: '/student-portal', query: { tab: 'register' } },
          { title: 'Học phí & Thanh toán', icon: 'receipt_long', path: '/student-portal', query: { tab: 'payments' } },
          { title: 'Ví bảo lưu', icon: 'account_balance_wallet', path: '/student-portal', query: { tab: 'credits' } }
        ]
      },
      {
        title: 'Hỗ trợ & Khác',
        icon: 'support_agent',
        path: '/other-services',
        children: [
          { title: 'Yêu cầu hỗ trợ', icon: 'chat', path: '/other-services', query: { tab: 'support' } },
          { title: 'Đánh giá & Khảo sát', icon: 'rate_review', path: '/other-services', query: { tab: 'evaluation' } }
        ]
      }
    ]
  }

  const items = [
    { title: 'Tổng quan', icon: 'dashboard', path: '/dashboard' },
    { title: 'Môn học', icon: 'school', path: '/courses' },
    { title: 'Lớp học', icon: 'groups', path: '/classes' },
    { title: 'Học viên', icon: 'person', path: '/students' }
  ]

  if (authStore.isAdmin) {
    items.push({ title: 'Thanh toán & Báo cáo', icon: 'payments', path: '/payments' })
    items.push({ title: 'Quản lý danh mục', icon: 'category', path: '/categories' })
    items.push({ title: 'Quản lý giảng viên', icon: 'co_present', path: '/teachers' })
    items.push({ title: 'Quản lý lương GV', icon: 'account_balance', path: '/teachers/salary' })
    items.push({ title: 'Quản lý phòng học', icon: 'meeting_room', path: '/classrooms' })
    items.push({ title: 'Quản lý tài khoản', icon: 'manage_accounts', path: '/users' })
    items.push({ title: 'Yêu cầu hỗ trợ', icon: 'chat', path: '/support-messages' })
    items.push({
      title: 'Khảo sát & Đánh giá',
      icon: 'rate_review',
      path: '/evaluation-management',
      children: [
        { title: 'Kết quả đánh giá', icon: 'history', path: '/evaluation-management', query: { tab: 'results' } },
        { title: 'Tiêu chí đánh giá', icon: 'tune', path: '/evaluation-management', query: { tab: 'criteria' } },
        { title: 'Khoá đánh giá (Lớp)', icon: 'lock', path: '/evaluation-management', query: { tab: 'lock-settings' } }
      ]
    })
  }

  if (authStore.isTeacher) {
    items.push({ title: 'Phiếu lương của tôi', icon: 'receipt_long', path: '/teachers/salary' })
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

// --- Notification Bell logic ---
const notificationDropdownOpen = ref(false)
const notifications = ref([])
const readNotificationsExpiry = ref(JSON.parse(localStorage.getItem('read_notifications_expiry') || '{}'))
const notificationSearch = ref('')
const notificationFilter = ref('all')

const readNotificationIds = computed(() => {
  return Object.keys(readNotificationsExpiry.value)
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !readNotificationIds.value.includes(n.id)).length
})

const filteredNotifications = computed(() => {
  let list = notifications.value

  const q = notificationSearch.value.trim().toLowerCase()
  if (q) {
    list = list.filter(n => 
      (n.title && n.title.toLowerCase().includes(q)) || 
      (n.message && n.message.toLowerCase().includes(q))
    )
  }

  if (notificationFilter.value === 'unread') {
    list = list.filter(n => !readNotificationIds.value.includes(n.id))
  } else if (notificationFilter.value === 'grade') {
    list = list.filter(n => n.type === 'grade' || n.type === 'conflict')
  } else if (notificationFilter.value === 'payment') {
    list = list.filter(n => n.type === 'payment' || n.type === 'credit')
  } else if (notificationFilter.value === 'support') {
    list = list.filter(n => n.type === 'support' || n.type === 'evaluation')
  }

  return list
})

function formatCurrency(val) {
  if (val === undefined || val === null) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val).trim()
}

function formatTimeAgo(dateVal) {
  if (!dateVal) return 'Vừa xong'
  const date = new Date(dateVal)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  if (seconds < 60) return 'Vừa xong'
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút trước`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Hôm qua'
  if (days < 7) return `${days} ngày trước`
  
  const formatNum = (num) => String(num).padStart(2, '0')
  return `${formatNum(date.getDate())}/${formatNum(date.getMonth() + 1)}/${date.getFullYear()}`
}

async function fetchNotifications() {
  if (!authStore.isAuthenticated || !authStore.currentUser?.userId || authStore.currentUser?.role !== 'HocVien') {
    notifications.value = []
    return
  }
  try {
    const summaryRes = await api.get(`/api/v1/portal/student-summary/${authStore.currentUser.userId}`)
    const summary = summaryRes.data
    const enrollments = summary.enrollments || []
    const payments = summary.payments || []
    const credit = summary.creditSummary || null
    
    const items = []
    
    // 1. Paid / unpaid tuition notifications
    payments.forEach(p => {
      if (p.status === 'Completed' || p.status === 'Paid') {
        items.push({
          id: `pay_success_${p.paymentId}`,
          title: 'Thanh toán học phí thành công',
          message: `Đã đóng học phí lớp ${p.className || ''} số tiền ${formatCurrency(p.amount)}.`,
          time: p.paymentDate ? new Date(p.paymentDate) : new Date(Date.now() - 3600000 * 2),
          type: 'payment',
          icon: 'payments',
          color: 'text-emerald-600 bg-emerald-50'
        })
      } else if (p.status === 'Pending' || p.status === 'Unpaid') {
        items.push({
          id: `pay_pending_${p.paymentId}`,
          title: 'Thông báo học phí chưa đóng',
          message: `Lớp ${p.className || ''} đang có học phí chưa hoàn thành (${formatCurrency(p.amount)}).`,
          time: new Date(Date.now() - 3600000 * 24),
          type: 'payment',
          icon: 'credit_card',
          color: 'text-amber-600 bg-amber-50'
        })
      }
    })
    
    // 2. Credit balance / bảo lưu notifications
    if (credit && credit.totalAvailable > 0) {
      items.push({
        id: `credit_avail_${credit.studentId}`,
        title: 'Ví bảo lưu học phí',
        message: `Tài khoản của bạn đang có ${formatCurrency(credit.totalAvailable)} bảo lưu khả dụng.`,
        time: new Date(),
        type: 'credit',
        icon: 'account_balance_wallet',
        color: 'text-blue-600 bg-blue-50'
      })
    }
    
    // 3. Dynamic grades update notification
    for (const e of enrollments) {
      if (e.status === 'DangHoc' || e.status === 'HoanThanh') {
        try {
          const scoreRes = await api.get(`/api/v1/results/enrollment/${e.enrollmentId}`)
          const scores = scoreRes.data || []
          scores.forEach(sc => {
            const labelMap = { ChuyenCan: 'Chuyên cần', GiuaKy: 'Giữa kỳ', CuoiKy: 'Cuối kỳ' }
            items.push({
              id: `grade_${e.enrollmentId}_${sc.examType}`,
              title: 'Cập nhật điểm số mới',
              message: `Môn ${e.courseName || ''} đã có điểm ${labelMap[sc.examType] || sc.examType}: ${sc.score}/10.`,
              time: sc.createdAt ? new Date(sc.createdAt) : new Date(Date.now() - 3600000 * 4),
              type: 'grade',
              icon: 'workspace_premium',
              color: 'text-indigo-600 bg-indigo-50'
            })
          })
        } catch (err) {
          // ignore
        }
      }
    }
    
    // 4. Conflicts & schedule warnings
    const schedulesMap = {}
    const activeEnrollments = enrollments.filter(e => e.status === 'DangHoc')
    await Promise.all(activeEnrollments.map(async (e) => {
      try {
        const schedRes = await api.get(`/api/v1/classes/${e.classId}/schedules`)
        schedulesMap[e.classId] = schedRes.data || []
      } catch (err) {}
    }))
    
    const conflictPairs = []
    for (let i = 0; i < activeEnrollments.length; i++) {
      for (let j = i + 1; j < activeEnrollments.length; j++) {
        const clsA = activeEnrollments[i]
        const clsB = activeEnrollments[j]
        const schedsA = schedulesMap[clsA.classId] || []
        const schedsB = schedulesMap[clsB.classId] || []
        
        schedsA.forEach(sa => {
          schedsB.forEach(sb => {
            if (sa.dayOfWeek === sb.dayOfWeek) {
              const startA = sa.startTime
              const endA = sa.endTime
              const startB = sb.startTime
              const endB = sb.endTime
              if (startA < endB && startB < endA) {
                conflictPairs.push({ clsA, clsB, day: sa.dayOfWeek })
              }
            }
          })
        })
      }
    }
    
    conflictPairs.forEach(c => {
      const map = { 1: 'Chủ Nhật', 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7' }
      items.push({
        id: `conflict_${c.clsA.classId}_${c.clsB.classId}_${c.day}`,
        title: 'Cảnh báo trùng lịch học!',
        message: `Lớp ${c.clsA.className || ''} và ${c.clsB.className || ''} đang trùng lịch vào ${map[c.day] || c.day}.`,
        time: new Date(),
        type: 'conflict',
        icon: 'warning',
        color: 'text-red-600 bg-red-50'
      })
    })

    // 5. Support request notifications & Admin replies
    try {
      const msgRes = await api.get('/api/v1/support-messages/my-messages')
      const myMessages = msgRes.data || []
      myMessages.forEach(msg => {
        // A. Thank you for sending support request
        items.push({
          id: `support_sent_${msg.id}`,
          title: 'Yêu cầu hỗ trợ đã gửi',
          message: `Cảm ơn bạn đã gửi yêu cầu. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.`,
          time: msg.createdAt ? new Date(msg.createdAt) : new Date(),
          type: 'support',
          icon: 'chat',
          color: 'text-indigo-600 bg-indigo-50'
        })
        
        // B. Admin response reply notification if Resolved or Rejected
        if (msg.status === 'Resolved' || msg.status === 'Rejected') {
          const statusText = msg.status === 'Resolved' ? 'phê duyệt' : 'từ chối'
          const detailText = msg.adminResponse ? `Phản hồi: "${msg.adminResponse}"` : `Yêu cầu của bạn đã được ${statusText}.`
          items.push({
            id: `support_reply_${msg.id}`,
            title: msg.status === 'Resolved' ? 'Yêu cầu hỗ trợ đã được duyệt' : 'Yêu cầu hỗ trợ bị từ chối',
            message: detailText,
            time: msg.createdAt ? new Date(new Date(msg.createdAt).getTime() + 1000) : new Date(), // slight offset to order after thank you
            type: 'support',
            icon: msg.status === 'Resolved' ? 'task_alt' : 'cancel',
            color: msg.status === 'Resolved' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
          })
        }
      })
    } catch (err) {
      console.error('Error fetching support messages for notifications:', err)
    }

    // 6. Teacher evaluation feedback thank you
    try {
      const evalRes = await api.get('/api/v1/teacher-evaluations/my-evaluations')
      const myEvals = evalRes.data || []
      myEvals.forEach(ev => {
        items.push({
          id: `eval_thank_${ev.id}`,
          title: 'Cảm ơn bạn đã gửi đánh giá',
          message: `Cảm ơn ý kiến đóng góp của bạn cho lớp ${ev.className || 'học'}.`,
          time: ev.createdAt ? new Date(ev.createdAt) : new Date(),
          type: 'evaluation',
          icon: 'rate_review',
          color: 'text-emerald-600 bg-emerald-50'
        })
      })
    } catch (err) {
      console.error('Error fetching evaluations for notifications:', err)
    }

    // Filter based on 24h click expiry for visibility, but keep read status in memory for 30 days
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    
    // Cleanup expired records in localStorage after 30 days (instead of 1 day)
    // to prevent notifications from popping back up as unread.
    let changed = false
    Object.keys(readNotificationsExpiry.value).forEach(id => {
      const clickTime = readNotificationsExpiry.value[id]
      if (now - clickTime > thirtyDaysMs) {
        delete readNotificationsExpiry.value[id]
        changed = true
      }
    })
    if (changed) {
      localStorage.setItem('read_notifications_expiry', JSON.stringify(readNotificationsExpiry.value))
    }

    notifications.value = items
      .filter(item => {
        const clickTime = readNotificationsExpiry.value[item.id]
        if (clickTime) {
          // If clicked, only show if it was clicked within the last 24h
          return (now - clickTime) <= oneDayMs
        }
        // If not clicked, keep forever
        return true
      })
      .sort((a, b) => b.time - a.time)
  } catch (err) {
    console.error('Error loading notifications:', err)
  }
}

function toggleNotificationDropdown() {
  notificationDropdownOpen.value = !notificationDropdownOpen.value
  if (notificationDropdownOpen.value) {
    fetchNotifications()
  }
}

function markAllAsRead() {
  const nowTime = Date.now()
  const updated = { ...readNotificationsExpiry.value }
  notifications.value.forEach(n => {
    if (!updated[n.id]) {
      updated[n.id] = nowTime
    }
  })
  readNotificationsExpiry.value = updated
  localStorage.setItem('read_notifications_expiry', JSON.stringify(updated))
}

function clickNotification(item) {
  const nowTime = Date.now()
  if (!readNotificationsExpiry.value[item.id]) {
    readNotificationsExpiry.value = { ...readNotificationsExpiry.value, [item.id]: nowTime }
    localStorage.setItem('read_notifications_expiry', JSON.stringify(readNotificationsExpiry.value))
  }
  notificationDropdownOpen.value = false
  
  if (item.type === 'payment') {
    router.push({ path: '/student-portal', query: { tab: 'payments' } })
  } else if (item.type === 'credit') {
    router.push({ path: '/student-portal', query: { tab: 'credits' } })
  } else if (item.type === 'grade') {
    router.push({ path: '/student-portal', query: { tab: 'classes' } })
  } else if (item.type === 'conflict') {
    router.push({ path: '/student-portal', query: { tab: 'conflicts' } })
  } else if (item.type === 'support') {
    router.push({ path: '/other-services', query: { tab: 'support' } })
  } else if (item.type === 'evaluation') {
    router.push({ path: '/other-services', query: { tab: 'evaluation' } })
  }
}

let notificationInterval = null

onMounted(() => {
  fetchNotifications()
  notificationInterval = setInterval(fetchNotifications, 30000)
})

onUnmounted(() => {
  if (notificationInterval) clearInterval(notificationInterval)
})

watch(() => authStore.currentUser, () => {
  fetchNotifications()
})
</script>

<style scoped>
@media (min-width: 768px) {
  .main-content-layout-pinned {
    margin-left: 240px !important;
  }
  .main-content-layout-collapsed {
    margin-left: 76px !important;
  }
}

@keyframes nudge-left {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-3px); }
}

@keyframes nudge-right {
  0%, 100% { transform: translateX(0) rotate(180deg); }
  50% { transform: translateX(3px) rotate(180deg); }
}

.animate-nudge-left {
  animation: nudge-left 2s infinite ease-in-out;
}

.animate-nudge-right {
  animation: nudge-right 2s infinite ease-in-out;
}
</style>
