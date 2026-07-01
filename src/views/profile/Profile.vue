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

              <!-- Bank Accounts Management (Only for GiaoVien) -->
              <div v-if="authStore.isTeacher" class="space-y-3 sm:col-span-2 border-t border-white/40 pt-4 mt-2">
                <div class="flex justify-between items-center">
                  <label class="text-body-sm font-semibold text-primary">Danh sách tài khoản ngân hàng nhận lương</label>
                  <button
                    type="button"
                    @click="showAddBankForm = !showAddBankForm"
                    class="text-xs font-bold text-primary bg-white/50 border border-outline-variant/30 px-3 py-1.5 rounded-lg hover:bg-white/90 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-[16px]">{{ showAddBankForm ? 'remove' : 'add' }}</span>
                    Thêm tài khoản
                  </button>
                </div>

                <!-- Form to Add Bank Account -->
                <div v-if="showAddBankForm" class="p-4 bg-primary-container/[0.03] border border-dashed border-primary-container/20 rounded-xl space-y-3 animate-fade-in">
                  <h4 class="text-xs font-bold text-primary-container">Nhập thông tin tài khoản mới</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-primary uppercase">Tên ngân hàng</label>
                      <input v-model="newBank.bankName" type="text" class="w-full glass-input px-3 py-2 text-xs text-primary" placeholder="Ví dụ: Techcombank" />
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-primary uppercase">Số tài khoản</label>
                      <input v-model="newBank.accountNumber" type="text" class="w-full glass-input px-3 py-2 text-xs text-primary" placeholder="Ví dụ: 1903..." />
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-primary uppercase">Tên chủ tài khoản</label>
                      <input v-model="newBank.accountHolder" type="text" class="w-full glass-input px-3 py-2 text-xs text-primary" placeholder="Ví dụ: NGUYEN VAN A" />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      @click="showAddBankForm = false"
                      class="px-3 py-1.5 rounded-lg border border-outline-variant text-[11px] font-semibold text-on-surface-variant hover:bg-white/40 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      @click="addBankAccount"
                      class="px-3 py-1.5 rounded-lg bg-primary-container text-white text-[11px] font-bold hover:opacity-95 cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                <!-- List of Bank Accounts -->
                <div v-if="bankAccounts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="a in bankAccounts"
                    :key="a.id"
                    class="p-4 rounded-xl border transition-all flex justify-between items-start gap-3 bg-white/50"
                    :class="a.isDefault ? 'border-emerald-500 bg-emerald-500/[0.02] shadow-[0_0_12px_rgba(16,185,129,0.05)]' : 'border-outline-variant/30 hover:border-primary-container/30'"
                  >
                    <div class="space-y-1.5 min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="font-extrabold text-body-sm text-primary truncate" :title="a.bankName">{{ a.bankName }}</span>
                        <span v-if="a.isDefault" class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-extrabold uppercase shrink-0">
                          Nhận lương
                        </span>
                      </div>
                      <div class="text-[13px] font-bold font-mono text-primary-container">{{ a.accountNumber }}</div>
                      <div class="text-[10px] uppercase font-bold text-on-surface-variant/70">{{ a.accountHolder }}</div>
                    </div>

                    <div class="flex items-center gap-1 shrink-0">
                      <!-- Set Default Button -->
                      <button
                        v-if="!a.isDefault"
                        type="button"
                        @click="setDefaultBankAccount(a.id)"
                        class="w-7 h-7 rounded-lg bg-primary-container/5 hover:bg-emerald-500/10 text-on-surface-variant hover:text-emerald-600 flex items-center justify-center cursor-pointer transition-colors"
                        title="Chọn tài khoản này để nhận lương"
                      >
                        <span class="material-symbols-outlined text-[16px]">check_circle</span>
                      </button>
                      
                      <!-- Delete Button -->
                      <button
                        type="button"
                        @click="deleteBankAccount(a.id)"
                        class="w-7 h-7 rounded-lg bg-rose-500/[0.03] hover:bg-rose-500/10 text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
                        title="Xóa tài khoản"
                      >
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="p-8 text-center bg-primary-container/[0.02] border border-dashed border-primary-container/15 rounded-xl flex flex-col items-center justify-center">
                  <span class="material-symbols-outlined text-primary-container/40 text-[32px] mb-1">payments</span>
                  <p class="text-xs font-semibold text-on-surface-variant/70">Chưa có tài khoản ngân hàng nào.</p>
                  <p class="text-[10px] text-on-surface-variant/50 mt-0.5">Vui lòng nhấn nút "Thêm tài khoản" ở góc phải để thêm mới.</p>
                </div>
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

    <!-- My Courses Section -->
    <div v-if="authStore.isStudent" class="glass-panel p-6 rounded-2xl space-y-6">
      <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center justify-between border-b border-white/40 pb-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-on-tertiary-container">school</span>
          Danh sách khóa học của tôi
        </div>
        <div class="text-body-sm font-semibold bg-primary-container/10 text-primary-container px-3 py-1 rounded-full">
          {{ enrollments.length }} khóa học
        </div>
      </h3>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
          <input v-model="searchQuery" type="text" placeholder="Tìm theo tên khóa hoặc lớp học..." class="w-full glass-input pl-10 pr-4 py-2.5 rounded-lg text-body-sm text-primary" />
        </div>
        <div class="w-full sm:w-48">
          <select v-model="statusFilter" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container cursor-pointer transition-all">
            <option value="">Tất cả trạng thái</option>
            <option value="ChoDuyet">Chờ duyệt</option>
            <option value="DangHoc">Đang học</option>
            <option value="HoanThanh">Đã hoàn thành</option>
            <option value="HuyBo">Đã hủy</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingEnrollments" class="py-12 flex justify-center">
        <div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEnrollments.length === 0" class="py-12 text-center bg-primary-container/[0.02] border border-dashed border-primary-container/15 rounded-xl flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-primary-container/40 text-[48px] mb-2">school</span>
        <p class="text-body-sm font-semibold text-on-surface-variant/70">Không tìm thấy khóa học nào phù hợp.</p>
      </div>

      <!-- Data List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="e in filteredEnrollments" :key="e.enrollmentId" class="p-5 rounded-xl border border-outline-variant/30 hover:border-primary-container/40 bg-white/50 transition-all flex flex-col gap-3 group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="flex justify-between items-start gap-2">
            <h4 class="font-bold text-body-lg text-primary line-clamp-2" :title="e.courseName">{{ e.courseName }}</h4>
            <span :class="['px-2 py-1 rounded text-[10px] font-extrabold uppercase shrink-0 border', getStatusColor(e.status)]">
              {{ getStatusLabel(e.status) }}
            </span>
          </div>

          <div class="space-y-1.5 flex-1">
            <div class="flex items-center gap-2 text-body-xs text-on-surface-variant">
              <span class="material-symbols-outlined text-[14px]">class</span>
              <span class="font-semibold text-primary truncate" :title="e.className">{{ e.className }}</span>
            </div>
            <div v-if="e.teacherName" class="flex items-center gap-2 text-body-xs text-on-surface-variant">
              <span class="material-symbols-outlined text-[14px]">person</span>
              <span>GV: {{ e.teacherName }}</span>
            </div>
            <div v-if="e.startDate" class="flex items-center gap-2 text-body-xs text-on-surface-variant">
              <span class="material-symbols-outlined text-[14px]">calendar_month</span>
              <span>Từ: {{ formatDate(e.startDate) }}</span>
            </div>
          </div>
          
          <div class="pt-2 border-t border-outline-variant/20 flex justify-between items-center">
            <span class="text-[11px] text-on-surface-variant/70">Đăng ký lúc: {{ formatDate(e.enrolledAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
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
  bankAccount: '',
  gender: 'Nam',
  dateOfBirth: '',
  address: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const bankAccounts = ref([])
const showAddBankForm = ref(false)
const newBank = ref({
  bankName: '',
  accountNumber: '',
  accountHolder: ''
})

const addBankAccount = () => {
  if (!newBank.value.bankName || !newBank.value.accountNumber || !newBank.value.accountHolder) {
    showSnackbar('Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng.', 'error')
    return
  }
  
  const hasAccounts = bankAccounts.value.length > 0
  const isDefault = !hasAccounts // First account is default
  
  bankAccounts.value.push({
    id: Date.now().toString(),
    bankName: newBank.value.bankName.trim(),
    accountNumber: newBank.value.accountNumber.trim(),
    accountHolder: newBank.value.accountHolder.trim().toUpperCase(),
    isDefault
  })
  
  // Reset form
  newBank.value = {
    bankName: '',
    accountNumber: '',
    accountHolder: profileForm.value.fullName.toUpperCase() || ''
  }
  showAddBankForm.value = false
  showSnackbar('Đã thêm tài khoản ngân hàng mới.', 'success')
}

const deleteBankAccount = (id) => {
  const accountToDelete = bankAccounts.value.find(a => a.id === id)
  if (!accountToDelete) return
  
  bankAccounts.value = bankAccounts.value.filter(a => a.id !== id)
  
  // If we deleted the default account, make the first remaining account default
  if (accountToDelete.isDefault && bankAccounts.value.length > 0) {
    bankAccounts.value[0].isDefault = true
  }
  showSnackbar('Đã xóa tài khoản ngân hàng.', 'success')
}

const setDefaultBankAccount = (id) => {
  bankAccounts.value.forEach(a => {
    a.isDefault = (a.id === id)
  })
  showSnackbar('Đã chọn tài khoản này để nhận lương.', 'success')
}

const studentProfileId = ref(null)

// --- Thêm: Quản lý khóa học của học viên ---
const enrollments = ref([])
const loadingEnrollments = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')

const fetchEnrollments = async (studentId) => {
  loadingEnrollments.value = true
  try {
    const res = await api.get('/api/v1/enrollments', {
      params: { studentId: studentId, pageSize: 100 }
    })
    if (res.data && res.data.items) {
      enrollments.value = res.data.items
    }
  } catch (err) {
    console.error('Error fetching enrollments:', err)
  } finally {
    loadingEnrollments.value = false
  }
}

const filteredEnrollments = computed(() => {
  return enrollments.value.filter(e => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = !query || 
      (e.courseName && e.courseName.toLowerCase().includes(query)) ||
      (e.className && e.className.toLowerCase().includes(query))
      
    const matchesStatus = !statusFilter.value || e.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

const getStatusLabel = (status) => {
  const map = {
    ChoDuyet: 'Chờ duyệt',
    DangHoc: 'Đang học',
    HoanThanh: 'Hoàn thành',
    HuyBo: 'Đã hủy',
    ChoThanhToan: 'Chờ T.Toán'
  }
  return map[status] || status
}

const getStatusColor = (status) => {
  switch(status) {
    case 'DangHoc': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    case 'HoanThanh': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'ChoDuyet': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    case 'ChoThanhToan': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    case 'HuyBo': return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  }
}
// ------------------------------------------

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
    profileForm.value.bankAccount = user.bankAccount || ''
    
    // Parse Bank Account JSON
    bankAccounts.value = []
    if (user.bankAccount) {
      try {
        const parsed = JSON.parse(user.bankAccount)
        if (Array.isArray(parsed)) {
          bankAccounts.value = parsed
        } else {
          bankAccounts.value = [{
            id: Date.now().toString(),
            bankName: 'Mặc định',
            accountNumber: user.bankAccount,
            accountHolder: user.fullName || '',
            isDefault: true
          }]
        }
      } catch (e) {
        bankAccounts.value = [{
          id: Date.now().toString(),
          bankName: 'Mặc định',
          accountNumber: user.bankAccount,
          accountHolder: user.fullName || '',
          isDefault: true
        }]
      }
    }
    
    // Set default name for new bank form
    newBank.value.accountHolder = (user.fullName || '').toUpperCase()

    if (authStore.isStudent) {
      try {
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
          
          // Tải danh sách khóa học
          fetchEnrollments(data.studentId)
        }
      } catch (studentErr) {
        console.warn('Student profile not yet linked or not found:', studentErr)
        studentProfileId.value = null
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
    const bankAccountJson = JSON.stringify(bankAccounts.value)

    // 1. Update general user info in PaymentService
    await api.put('/api/v1/auth/profile', {
      fullName: profileForm.value.fullName,
      email: profileForm.value.email,
      phone: profileForm.value.phone,
      bankAccount: bankAccountJson
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
