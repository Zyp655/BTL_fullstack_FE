<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-primary-container flex items-center gap-3">
          <span class="material-symbols-outlined text-on-tertiary-container text-[32px]">payments</span>
          Thanh toán & Báo cáo tài chính
        </h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Quản lý hóa đơn học phí, ghi nhận giao dịch thanh toán và xem báo cáo doanh thu công nợ.
        </p>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex border-b border-outline-variant/30 gap-6 mb-6">
      <button
        @click="activeTab = 'invoices'"
        :class="['pb-3 px-1 font-title-sm text-title-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2', activeTab === 'invoices' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface-variant hover:text-primary-container']"
      >
        <span class="material-symbols-outlined text-[20px]">receipt_long</span>
        Danh sách hóa đơn
      </button>
      <button
        @click="activeTab = 'charts'"
        :class="['pb-3 px-1 font-title-sm text-title-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2', activeTab === 'charts' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface-variant hover:text-primary-container']"
      >
        <span class="material-symbols-outlined text-[20px]">monitoring</span>
        Báo cáo doanh thu
      </button>
      <button
        @click="activeTab = 'analytics'"
        :class="['pb-3 px-1 font-title-sm text-title-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2', activeTab === 'analytics' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface-variant hover:text-primary-container']"
      >
        <span class="material-symbols-outlined text-[20px]">analytics</span>
        Thống kê vận hành & Học tập
      </button>
    </div>

    <!-- Financial Stats Dashboard Cards -->
    <template v-if="activeTab === 'invoices'">
      <div v-if="loadingStats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter animate-pulse">
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter h-24" v-for="i in 4" :key="i"></div>
      </div>
      <PaymentKPIs
        v-else
        :dashboard-stats="dashboardStats"
        :payment-completion-rate="paymentCompletionRate"
      />
    </template>

    <!-- Financial Charts Section -->
    <template v-if="activeTab === 'charts'">
      <PaymentCharts
        :monthly-values="monthlyValues"
        :courses-list="coursesList"
        :loading="loadingCharts"
        :selected-year="selectedYear"
        :available-years="availableYears"
        @year-changed="handleYearChanged"
      />
    </template>

    <!-- Invoices List -->
    <template v-if="activeTab === 'invoices'">
      <PaymentTable
        :filters="filters"
        :payments-list="paymentsList"
        :loading="loadingPayments"
        :pagination="pagination"
        :total-payments-count="totalPaymentsCount"
        :total-invoices-pages="totalInvoicesPages"
        @update-filter="handleUpdateFilter"
        @open-history-modal="openTransactionHistoryModal"
        @open-manual-payment-modal="openManualPaymentModal"
        @prev-page="prevPage"
        @next-page="nextPage"
      />
    </template>

    <!-- Analytics Dashboard Tab Content -->
    <div v-else-if="activeTab === 'analytics'" class="space-y-stack-lg">
      <div v-if="loadingOps" class="flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl">
        <span class="animate-spin inline-block w-8 h-8 border-4 border-on-tertiary-container border-t-transparent rounded-full"></span>
        <p class="mt-4 text-body-lg text-on-surface-variant font-medium">Đang tải dữ liệu thống kê vận hành & học tập...</p>
      </div>
      <div v-else class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <!-- Avg Class Fill Rate -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 xl:p-gutter flex items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px]">groups</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-bold text-lg sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl text-primary-container truncate" :title="Math.round(courseAnalytics.averageClassFillRate * 100) + '%'">{{ Math.round(courseAnalytics.averageClassFillRate * 100) }}%</div>
              <div class="text-body-sm text-on-surface-variant font-medium truncate">Tỷ lệ lấp đầy lớp học TB</div>
            </div>
          </div>
          <!-- Credits Available -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 xl:p-gutter flex items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-bold text-lg sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl text-primary-container truncate" :title="formatCurrency(studentAnalytics.totalCreditsAvailable)">{{ formatCurrency(studentAnalytics.totalCreditsAvailable) }}</div>
              <div class="text-body-sm text-on-surface-variant font-medium truncate">Số dư tín chỉ khả dụng</div>
            </div>
          </div>
          <!-- Credits Used -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 xl:p-gutter flex items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px]">shopping_bag</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-bold text-lg sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl text-primary-container truncate" :title="formatCurrency(studentAnalytics.totalCreditsUsed)">{{ formatCurrency(studentAnalytics.totalCreditsUsed) }}</div>
              <div class="text-body-sm text-on-surface-variant font-medium truncate">Tín chỉ đã tiêu dùng</div>
            </div>
          </div>
          <!-- Total Waitlists Queue -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 xl:p-gutter flex items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-bold text-lg sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl text-primary-container truncate" :title="totalWaitlistQueueCount">{{ totalWaitlistQueueCount }}</div>
              <div class="text-body-sm text-on-surface-variant font-medium truncate">Học viên chờ xếp lớp</div>
            </div>
          </div>
        </div>

        <!-- Class Fill Rates & Waitlist Queue -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <!-- Class Fill Rates List -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter lg:col-span-2 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
            <div>
              <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-on-tertiary-container">done_all</span>
                Tỷ lệ lấp đầy của các lớp học
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-4">Sĩ số thực tế so với sĩ số tối đa của các lớp học</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse" v-if="courseAnalytics.classFillRates.length > 0">
                <thead>
                  <tr class="bg-surface-container-high text-body-xs font-semibold text-on-surface-variant uppercase">
                    <th class="py-3 px-4 rounded-l-lg">Tên lớp</th>
                    <th class="py-3 px-4">Môn học</th>
                    <th class="py-3 px-4 text-center">Sĩ số (Học viên)</th>
                    <th class="py-3 px-4 text-right rounded-r-lg" style="width: 180px;">Tỷ lệ lấp đầy</th>
                  </tr>
                </thead>
                <tbody class="text-body-sm text-on-surface">
                  <tr v-for="c in courseAnalytics.classFillRates" :key="c.classId" class="border-t border-outline-variant/20 hover:bg-white/40 transition-colors">
                    <td class="py-3 px-4 font-semibold text-primary-container">Lớp {{ c.classId }} - {{ c.className }}</td>
                    <td class="py-3 px-4 text-on-surface-variant">{{ c.courseName }}</td>
                    <td class="py-3 px-4 text-center font-bold">{{ c.currentStudents }} / {{ c.maxStudents }}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2 justify-end">
                        <div class="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div :class="['h-full rounded-full', getFillRateProgressColor(c.fillRate)]" :style="{ width: (c.fillRate * 100) + '%' }"></div>
                        </div>
                        <span class="font-bold text-xs" :class="getFillRateTextColor(c.fillRate)">{{ Math.round(c.fillRate * 100) }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="text-center py-8">
                <p class="text-body-sm text-on-surface-variant">Không có dữ liệu lớp học nào.</p>
              </div>
            </div>
          </div>

          <!-- Waitlist Queue -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter flex flex-col transition-all duration-300 hover:shadow-lg">
            <div>
              <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-amber-500">hourglass_top</span>
                Hàng chờ môn học
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-4">Số lượng học viên đang đợi đủ điều kiện mở lớp</p>
            </div>
            <div class="overflow-y-auto max-h-[300px] flex-1">
              <div v-if="studentAnalytics.waitlists.length > 0" class="divide-y divide-outline-variant/20">
                <div v-for="w in studentAnalytics.waitlists" :key="w.courseId" class="py-3 flex justify-between items-center">
                  <div>
                    <div class="font-semibold text-body-sm text-on-surface">{{ w.courseName }}</div>
                    <div class="text-[11px] text-on-surface-variant">Môn học #{{ w.courseId }}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                      {{ w.queueCount }} học viên
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12 flex flex-col items-center">
                <span class="material-symbols-outlined text-slate-300 text-[48px] mb-2">check_circle</span>
                <p class="text-body-sm text-on-surface-variant">Không có học viên nào trong hàng chờ.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Teacher Workload & Academic Warnings -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <!-- Teacher Workload -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter flex flex-col transition-all duration-300 hover:shadow-lg">
            <div>
              <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-purple-600">work</span>
                Tải công việc giáo viên
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-4">Số lượng lớp phụ trách và tổng số buổi dạy</p>
            </div>
            <div class="overflow-y-auto max-h-[350px] flex-1">
              <table class="w-full text-left border-collapse" v-if="courseAnalytics.teacherWorkloads.length > 0">
                <thead>
                  <tr class="bg-surface-container-high text-body-xs font-semibold text-on-surface-variant uppercase">
                    <th class="py-2 px-3 rounded-l-lg">Giáo viên</th>
                    <th class="py-2 px-3 text-center">Số lớp</th>
                    <th class="py-2 px-3 text-right rounded-r-lg">Số buổi</th>
                  </tr>
                </thead>
                <tbody class="text-body-sm text-on-surface">
                  <tr v-for="t in courseAnalytics.teacherWorkloads" :key="t.teacherId" class="border-t border-outline-variant/15 hover:bg-white/30 transition-colors">
                    <td class="py-3 px-3 font-semibold text-on-surface">{{ t.teacherName }}</td>
                    <td class="py-3 px-3 text-center font-bold text-purple-600">{{ t.classCount }} lớp</td>
                    <td class="py-3 px-3 text-right font-bold text-primary-container">{{ t.totalSessions }} buổi</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="text-center py-8">
                <p class="text-body-sm text-on-surface-variant">Không có dữ liệu giáo viên.</p>
              </div>
            </div>
          </div>

          <!-- Academic Warnings -->
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter lg:col-span-2 flex flex-col transition-all duration-300 hover:shadow-lg">
            <div>
              <h3 class="font-title-md text-title-md font-bold text-rose-600 flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-rose-600">warning</span>
                Cảnh báo học tập (Chuyên cần thấp)
              </h3>
              <p class="text-body-sm text-on-surface-variant mb-4">Danh sách học viên nghỉ >= 2 buổi hoặc tỉ lệ đi học dưới 80%</p>
            </div>
            <div class="overflow-x-auto flex-1">
              <table class="w-full text-left border-collapse" v-if="studentAnalytics.academicWarnings.length > 0">
                <thead>
                  <tr class="bg-surface-container-high text-body-xs font-semibold text-on-surface-variant uppercase">
                    <th class="py-2 px-3 rounded-l-lg">Học viên</th>
                    <th class="py-2 px-3">Lớp học</th>
                    <th class="py-2 px-3 text-center">Nghỉ học</th>
                    <th class="py-2 px-3 text-center">Đi muộn</th>
                    <th class="py-2 px-3 text-right rounded-r-lg">Tỉ lệ đi học</th>
                  </tr>
                </thead>
                <tbody class="text-body-sm text-on-surface">
                  <tr v-for="w in studentAnalytics.academicWarnings" :key="w.studentId + '-' + w.classId" class="border-t border-outline-variant/15 hover:bg-rose-50/20 transition-colors">
                    <td class="py-3 px-3 font-semibold text-on-surface">{{ w.studentName }}</td>
                    <td class="py-3 px-3 text-on-surface-variant">{{ w.className }}</td>
                    <td class="py-3 px-3 text-center"><span class="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-bold border border-rose-500/20">{{ w.absentCount }} buổi</span></td>
                    <td class="py-3 px-3 text-center font-semibold text-amber-600">{{ w.lateCount }} buổi</td>
                    <td class="py-3 px-3 text-right font-bold text-rose-600">{{ Math.round(w.attendanceRate * 100) }}%</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="text-center py-12 flex flex-col items-center justify-center h-full">
                <span class="material-symbols-outlined text-emerald-500 text-[48px] mb-2">check_circle</span>
                <p class="text-body-sm text-emerald-600 font-medium">Không có học viên nào bị cảnh báo chuyên cần.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <PaymentManualDialog
      :show="manualPaymentModal"
      :payment="selectedPaymentForAction"
      @close="manualPaymentModal = false"
      @success="handlePaymentSuccess"
    />

    <PaymentHistoryDialog
      :show="transactionHistoryModal"
      :payment="selectedPaymentForAction"
      @close="transactionHistoryModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import api from '../../services/api'
import PaymentKPIs from './components/PaymentKPIs.vue'
import PaymentCharts from './components/PaymentCharts.vue'
import PaymentTable from './components/PaymentTable.vue'
import PaymentManualDialog from './components/PaymentManualDialog.vue'
import PaymentHistoryDialog from './components/PaymentHistoryDialog.vue'

const showSnackbar = inject('showSnackbar')

const activeTab = ref('invoices')

// Operations & Academic Analytics State
const loadingOps = ref(false)
const courseAnalytics = ref({
  averageClassFillRate: 0,
  classFillRates: [],
  teacherWorkloads: []
})
const studentAnalytics = ref({
  waitlists: [],
  totalCreditsAvailable: 0,
  totalCreditsUsed: 0,
  totalCreditsRefunded: 0,
  academicWarnings: []
})

const totalWaitlistQueueCount = computed(() => {
  if (!studentAnalytics.value.waitlists) return 0
  return studentAnalytics.value.waitlists.reduce((acc, curr) => acc + (curr.queueCount || 0), 0)
})

function getFillRateProgressColor(rate) {
  if (rate >= 0.8) return 'bg-emerald-500'
  if (rate >= 0.5) return 'bg-blue-500'
  return 'bg-amber-500'
}

function getFillRateTextColor(rate) {
  if (rate >= 0.8) return 'text-emerald-600'
  if (rate >= 0.5) return 'text-blue-600'
  return 'text-amber-600'
}

async function fetchOperationsAnalytics() {
  loadingOps.value = true
  try {
    const [courseRes, studentRes] = await Promise.all([
      api.get('/api/v1/classes/analytics'),
      api.get('/api/v1/enrollments/analytics')
    ])
    courseAnalytics.value = courseRes.data || { averageClassFillRate: 0, classFillRates: [], teacherWorkloads: [] }
    studentAnalytics.value = studentRes.data || { waitlists: [], totalCreditsAvailable: 0, totalCreditsUsed: 0, totalCreditsRefunded: 0, academicWarnings: [] }
  } catch (e) {
    showSnackbar('Lỗi tải dữ liệu thống kê vận hành & học tập', 'error')
    console.error(e)
  } finally {
    loadingOps.value = false
  }
}

// Filters & Pagination
const filters = ref({
  search: '',
  status: null
})

const pagination = ref({
  page: 1,
  pageSize: 10
})

const totalPaymentsCount = ref(0)
const totalInvoicesPages = computed(() => Math.ceil(totalPaymentsCount.value / pagination.value.pageSize) || 1)

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchPayments, 300)
}

// ----------------------------------------------------
// DASHBOARD STATS & CHARTS
// ----------------------------------------------------
const loadingStats = ref(false)
const loadingCharts = ref(false)
const dashboardStats = ref({
  totalRevenue: 0,
  totalDebt: 0,
  totalPayments: 0
})

const paymentCompletionRate = computed(() => {
  const total = Number(dashboardStats.value.totalRevenue) + Number(dashboardStats.value.totalDebt)
  if (total === 0) return 0
  return Math.round((Number(dashboardStats.value.totalRevenue) / total) * 100)
})

async function fetchDashboardStats() {
  loadingStats.value = true
  try {
    const { data } = await api.get('/api/v1/reports/dashboard')
    dashboardStats.value = {
      totalRevenue: data.totalRevenue || 0,
      totalDebt: data.totalDebt || 0,
      totalPayments: data.totalPayments || 0
    }
  } catch (e) {
    showSnackbar('Lỗi tải dữ liệu báo cáo thống kê', 'error')
  } finally {
    loadingStats.value = false
  }
}

const currentYearVal = new Date().getFullYear()
const selectedYear = ref(currentYearVal)
const availableYears = ref([currentYearVal - 2, currentYearVal - 1, currentYearVal, currentYearVal + 1])
const monthlyValues = ref(Array(12).fill(0))
const coursesList = ref([])

async function fetchChartsData() {
  loadingCharts.value = true
  try {
    // 1. Fetch Monthly Revenue Reports
    const { data: reportData } = await api.get('/api/v1/reports/revenue', {
      params: { year: selectedYear.value }
    })
    const monthlyRevenues = reportData.monthlyRevenues || []
    const newMonthlyValues = Array(12).fill(0)
    
    monthlyRevenues.forEach(item => {
      const idx = item.month - 1
      if (idx >= 0 && idx < 12) {
        newMonthlyValues[idx] = item.revenue
      }
    })
    monthlyValues.value = newMonthlyValues

    // 2. Fetch all payments to aggregate course stats
    const { data: paymentData } = await api.get('/api/v1/payments', {
      params: { page: 1, pageSize: 1000 }
    })
    const payments = paymentData.items || []
    
    const courseGroups = {}
    payments.forEach(p => {
      const courseName = p.courseName || 'Môn học khác'
      if (!courseGroups[courseName]) {
        courseGroups[courseName] = { revenue: 0, debt: 0 }
      }
      courseGroups[courseName].revenue += Number(p.paidAmount || 0)
      courseGroups[courseName].debt += Number(p.remainingAmount || 0)
    })

    coursesList.value = Object.keys(courseGroups).map(name => ({
      name,
      revenue: courseGroups[name].revenue,
      debt: courseGroups[name].debt
    }))
  } catch (e) {
    console.error('Lỗi khi tải dữ liệu biểu đồ:', e)
  } finally {
    loadingCharts.value = false
  }
}

function handleYearChanged(year) {
  selectedYear.value = year
  fetchChartsData()
}

// ----------------------------------------------------
// INVOICES LIST & ACTIONS
// ----------------------------------------------------
const loadingPayments = ref(false)
const paymentsList = ref([])

async function fetchPayments() {
  loadingPayments.value = true
  try {
    const { data } = await api.get('/api/v1/payments', {
      params: {
        search: filters.value.search || undefined,
        status: filters.value.status || undefined,
        page: pagination.value.page,
        pageSize: pagination.value.pageSize
      }
    })
    paymentsList.value = data.items || []
    totalPaymentsCount.value = data.totalCount || 0
  } catch (e) {
    showSnackbar('Không thể tải danh sách hóa đơn học phí', 'error')
  } finally {
    loadingPayments.value = false
  }
}

function prevPage() {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchPayments()
  }
}

function nextPage() {
  if (pagination.value.page < totalInvoicesPages.value) {
    pagination.value.page++
    fetchPayments()
  }
}

function handleUpdateFilter({ key, value }) {
  filters.value[key] = value
  pagination.value.page = 1
  if (key === 'search') {
    debouncedFetch()
  } else {
    fetchPayments()
  }
}

// ----------------------------------------------------
// MANUAL TRANSACTION RECORDING
// ----------------------------------------------------
const manualPaymentModal = ref(false)
const selectedPaymentForAction = ref(null)

function openManualPaymentModal(payment) {
  selectedPaymentForAction.value = payment
  manualPaymentModal.value = true
}

function handlePaymentSuccess() {
  manualPaymentModal.value = false
  fetchPayments()
  fetchDashboardStats()
  fetchChartsData()
}

// ----------------------------------------------------
// TRANSACTION HISTORY DRAWER
// ----------------------------------------------------
const transactionHistoryModal = ref(false)

function openTransactionHistoryModal(payment) {
  selectedPaymentForAction.value = payment
  transactionHistoryModal.value = true
}

// ----------------------------------------------------
// UTILS & FORMATTERS
// ----------------------------------------------------
function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

onMounted(() => {
  fetchDashboardStats()
  fetchPayments()
  fetchChartsData()
  fetchOperationsAnalytics()
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
