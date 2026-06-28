<template>
  <div class="space-y-gutter animate-fade-in">
    <!-- Student Selector (Admin Only) -->
    <div v-if="authStore.isAdmin" class="glass-panel rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-[28px] text-on-tertiary-container">person_search</span>
        <div>
          <h3 class="font-title-md text-body-lg font-bold text-primary-container">Chế độ Quản trị viên</h3>
          <p class="text-body-sm text-on-surface-variant">Xem và quản lý cổng học tập của học viên</p>
        </div>
      </div>
      <div class="relative w-full sm:w-80">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">search</span>
          <input
            type="text"
            v-model="studentSearchText"
            class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-9 pr-16 py-2.5 text-body-sm text-primary placeholder-on-surface-variant/50 focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
            placeholder="Tìm theo tên, email, SĐT hoặc mã..."
            @focus="onSearchFocus"
            @blur="onSearchBlur"
          />
          <button
            v-if="selectedStudentId"
            @click="clearStudentSelection"
            class="absolute right-9 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
        </div>
        
        <!-- Dropdown List -->
        <div v-show="isDropdownOpen" class="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-outline-variant/30 rounded-lg shadow-lg py-1">
          <div
            v-for="student in filteredStudentsForSearch"
            :key="student.studentId"
            @mousedown="selectStudent(student)"
            class="px-4 py-2 hover:bg-primary-container/10 cursor-pointer text-body-sm text-primary flex flex-col transition-colors"
            :class="{ 'bg-primary-container/5 font-semibold': student.studentId === selectedStudentId }"
          >
            <span class="font-semibold text-primary-container">{{ student.fullName }}</span>
            <span class="text-[11px] text-on-surface-variant">
              Mã HV: HV-{{ String(student.studentId).padStart(4, '0') }} 
              <span v-if="student.phone"> | SĐT: {{ student.phone }}</span>
              <span v-if="student.email"> | {{ student.email }}</span>
            </span>
          </div>
          <div v-if="filteredStudentsForSearch.length === 0" class="px-4 py-3 text-body-sm text-on-surface-variant text-center">
            Không tìm thấy học viên
          </div>
        </div>
      </div>
    </div>

    <template v-if="studentProfile">


      <!-- Stats Row -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <!-- Stat 1 -->
        <div class="glass-panel rounded-lg p-4 flex items-center gap-4 glass-panel-hover">
          <div class="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">menu_book</span>
          </div>
          <div>
            <p class="text-slate-600 text-body-sm font-semibold">Lớp đang học</p>
            <p class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">{{ enrolledClasses.length }} lớp</p>
          </div>
        </div>
        <!-- Stat 2 -->
        <div class="glass-panel rounded-lg p-4 flex items-center gap-4 glass-panel-hover">
          <div class="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
          </div>
          <div>
            <p class="text-slate-600 text-body-sm font-semibold">Điểm trung bình</p>
            <p class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
              {{ averageGrade > 0 ? averageGrade.toFixed(2) : '—' }}
            </p>
          </div>
        </div>
        <!-- Stat 3 (formerly 4) -->
        <div class="glass-panel rounded-lg p-4 flex items-center gap-4 glass-panel-hover">
          <div class="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">payments</span>
          </div>
          <div>
            <p class="text-slate-600 text-body-sm font-semibold">Học phí cần đóng</p>
            <p class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">{{ formatCurrency(totalDebt) }}</p>
          </div>
        </div>
        <!-- Stat 4 (formerly 5) -->
        <div class="glass-panel rounded-lg p-4 flex items-center gap-4 glass-panel-hover">
          <div class="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
          </div>
          <div>
            <p class="text-slate-600 text-body-sm font-semibold">Số dư bảo lưu</p>
            <p class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
              {{ formatCurrency(creditSummary?.totalAvailable || 0) }}
            </p>
          </div>
        </div>
      </section>

      <!-- Navigation Tabs -->
      <div class="border-b border-outline-variant/30 overflow-x-auto hide-scrollbar">
        <nav class="flex gap-6 min-w-max px-2">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="selectTab(tab.value)"
            :class="[
              activeTab === tab.value
                ? 'border-primary-container text-primary-container font-bold'
                : 'border-transparent text-readable-secondary hover:text-readable-primary hover:border-slate-300 font-semibold',
              'pb-3 border-b-2 font-title-md text-title-md flex items-center gap-2 transition-colors cursor-pointer'
            ]"
          >
            <span class="material-symbols-outlined" :class="{ 'text-error animate-pulse': tab.value === 'conflicts' && currentConflicts.length > 0 }" :style="activeTab === tab.value ? 'font-variation-settings: \'FILL\' 1;' : ''">{{ tab.icon }}</span>
            {{ tab.label }}
            <span v-if="tab.value === 'conflicts' && currentConflicts.length > 0" class="px-1.5 py-0.5 text-[10px] font-bold bg-error text-white rounded-full animate-bounce">
              {{ currentConflicts.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Loading screen -->
      <div v-if="loading" class="glass-panel p-12 rounded-xl text-center flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-primary-container/30 border-t-primary-container rounded-full animate-spin mb-4"></div>
        <p class="text-body-sm font-semibold text-primary-container">Đang tải dữ liệu học tập...</p>
      </div>

      <!-- Content Sections based on Active Tab -->
      <div v-else class="space-y-gutter">
        <TabClassesSchedules
          v-slot="{ cls }"
          v-if="activeTab === 'classes'"
          :enrolled-classes="enrolledClasses"
          :selected-class="selectedClass"
          :schedules="schedules"
          :loading-schedules="loadingSchedules"
          :payments="payments"
          :current-conflicts="currentConflicts"
          :attendance-summaries="attendanceSummaries"
          :exam-results="examResults"
          :selected-class-details="selectedClassDetails"
          :my-support-messages="mySupportMessages"
          @select-class="selectClass"
          @open-support-conflict="({ targetClass, conflictClass }) => handleOpenSupportConflict(targetClass, conflictClass)"
          @open-transfer-modal="openTransferModal"
          @change-enrollment-status="({ cls, newStatus }) => changeEnrollmentStatus(cls, newStatus)"
          @switch-tab="selectTab"
          @change-attendance-status="({ session, newStatus }) => changeAttendanceStatus(session, newStatus)"
        />

        <TabCalendar
          v-if="activeTab === 'calendar'"
          :enrolled-classes="enrolledClasses"
          :enrolled-schedules-map="enrolledSchedulesMap"
          :my-support-messages="mySupportMessages"
          @open-support-conflict="({ targetClass, conflictClass }) => handleOpenSupportConflict(targetClass, conflictClass)"
        />

        <TabPayments
          v-slot="{ pay }"
          v-if="activeTab === 'payments'"
          :payments="payments"
          :student-profile="studentProfile"
          :auto-pay-course-name="route.query.courseName"
          :auto-pay-course-id="route.query.courseId"
          @open-payment-modal="openPaymentModal"
          @refresh-payments="loadPortalData(true)"
        />

        <TabCredits
          v-slot="{ credit }"
          v-if="activeTab === 'credits'"
          :credit-summary="creditSummary"
        />

        <TabRegisterCourse
          v-slot="{ register }"
          v-if="activeTab === 'register'"
          :student-profile="studentProfile"
          :enrolled-classes="enrolledClasses"
          @refresh-portal="loadPortalData(true)"
        />

        <TabConflicts
          v-slot="{ conflict }"
          v-if="activeTab === 'conflicts'"
          :current-conflicts="currentConflicts"
          :enrolled-classes="enrolledClasses"
          @open-support-conflict="({ targetClass, conflictClass }) => handleOpenSupportConflict(targetClass, conflictClass)"
          @view-in-calendar="(classId) => handleViewInCalendar(classId)"
        />

      </div>



      <!-- Modal: Admin Nhập/Sửa điểm -->
      <ModalGrading
        :show="adminGradingModal"
        :grading-class="gradingClass"
        :exam-results="examResults"
        :student-profile="studentProfile"
        @close="adminGradingModal = false"
        @success="async () => { adminGradingModal = false; await loadPortalDataForStudent(studentProfile.studentId, studentProfile.userId); }"
      />

      <!-- Modal: Admin Ghi nhận thanh toán -->
      <ModalPaymentRecord
        :show="adminPaymentModal"
        :payment-bill="paymentBill"
        :student-profile="studentProfile"
        @close="adminPaymentModal = false"
        @success="async () => { adminPaymentModal = false; await loadPortalDataForStudent(studentProfile.studentId, studentProfile.userId); }"
      />
    </template>

    <!-- No Student Selected State -->
    <div v-else-if="!loading" class="glass-panel p-12 rounded-xl text-center flex flex-col items-center justify-center">
      <span class="material-symbols-outlined text-primary-container/30 text-[64px] mb-4">school</span>
      <h3 class="font-title-md text-headline-sm text-primary-container mb-2">
        {{ authStore.isAdmin ? 'Chưa chọn học viên' : 'Chưa có hồ sơ học tập' }}
      </h3>
      <p class="text-body-md text-on-surface-variant max-w-md">
        {{ authStore.isAdmin 
          ? 'Vui lòng chọn một học viên từ danh sách ở trên để xem thời khóa biểu, điểm số, chuyên cần và học phí của họ.' 
          : 'Hồ sơ học viên của bạn chưa được liên kết với tài khoản này. Vui lòng liên hệ Quản trị viên để được hỗ trợ liên kết tài khoản học viên.' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, useStudentStore } from '../../stores'
import api from '../../services/api'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

import TabClassesSchedules from './components/TabClassesSchedules.vue'
import TabPayments from './components/TabPayments.vue'
import TabCredits from './components/TabCredits.vue'
import TabConflicts from './components/TabConflicts.vue'
import TabCalendar from './components/TabCalendar.vue'
import TabRegisterCourse from './components/TabRegisterCourse.vue'
import ModalGrading from './components/ModalGrading.vue'
import ModalPaymentRecord from './components/ModalPaymentRecord.vue'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const studentStore = useStudentStore()
const showSnackbar = inject('showSnackbar')

const students = ref([])
const selectedStudentId = ref(null)

const isDropdownOpen = ref(false)
const studentSearchText = ref('')

const selectedStudent = computed(() => {
  return students.value.find(s => s.studentId === selectedStudentId.value)
})

watch(selectedStudent, (newVal) => {
  if (newVal) {
    studentSearchText.value = `${newVal.fullName} (HV-${String(newVal.studentId).padStart(4, '0')})`
  } else {
    studentSearchText.value = ''
  }
}, { immediate: true })

const filteredStudentsForSearch = computed(() => {
  const query = studentSearchText.value.toLowerCase().trim()
  const currentLabel = selectedStudent.value 
    ? `${selectedStudent.value.fullName} (HV-${String(selectedStudent.value.studentId).padStart(4, '0')})`.toLowerCase() 
    : ''
  if (!query || query === currentLabel) {
    return students.value
  }
  return students.value.filter(s => {
    const nameMatch = s.fullName?.toLowerCase().includes(query)
    const idMatch = `hv-${String(s.studentId).padStart(4, '0')}`.includes(query) || String(s.studentId).includes(query)
    const emailMatch = s.email?.toLowerCase().includes(query)
    const phoneMatch = s.phone?.includes(query)
    return nameMatch || idMatch || emailMatch || phoneMatch
  })
})

function onSearchFocus(e) {
  isDropdownOpen.value = true
  e.target.select()
}

function onSearchBlur() {
  setTimeout(() => {
    isDropdownOpen.value = false
    if (selectedStudent.value) {
      studentSearchText.value = `${selectedStudent.value.fullName} (HV-${String(selectedStudent.value.studentId).padStart(4, '0')})`
    } else {
      studentSearchText.value = ''
    }
  }, 200)
}

function selectStudent(student) {
  selectedStudentId.value = student.studentId
  isDropdownOpen.value = false
}

function clearStudentSelection() {
  selectedStudentId.value = null
  studentSearchText.value = ''
}

const loading = ref(true)
const studentProfile = ref(null)
const enrolledClasses = ref([])
const selectedClass = ref(null)
const selectedClassDetails = ref(null)
const schedules = ref([])
const loadingSchedules = ref(false)
const examResults = ref({}) // mapped by enrollmentId
const attendanceSummaries = ref([])
const payments = ref([])
const creditSummary = ref(null)

const studentAvatar = computed(() => {
  const uId = studentProfile.value?.userId || authStore.currentUser?.userId
  if (!uId) return null
  if (uId === authStore.currentUser?.userId) {
    return authStore.avatar
  }
  return localStorage.getItem('avatar_' + uId)
})

const enrolledSchedulesMap = ref({})
const supportMessageText = ref('')
const submittingSupport = ref(false)
const mySupportMessages = ref([])

// Support Request dialog state
const supportDialog = ref(false)
const supportFromClassId = ref(null)
const supportToClassId = ref(null)
const supportAlternativeClasses = ref([])
const loadingSupportAlternativeClasses = ref(false)

const activeTab = ref(route.query.tab || 'classes')
const tabs = computed(() => {
  const list = [
    { label: 'Lớp học & Lịch học', value: 'classes', icon: 'school' },
    { label: 'Đăng ký môn học', value: 'register', icon: 'import_contacts' },
    { label: 'Lịch học tuần', value: 'calendar', icon: 'calendar_month' },
    { label: 'Học phí & Thanh toán', value: 'payments', icon: 'receipt_long' },
    { label: 'Ví bảo lưu', value: 'credits', icon: 'account_balance_wallet' }
  ]
  return list
})

const selectTab = (tabValue) => {
  activeTab.value = tabValue
  router.replace({ path: route.path, query: { tab: tabValue } })
}

function handleViewInCalendar(classId) {
  activeTab.value = 'calendar'
  router.push({ path: route.path, query: { ...route.query, tab: 'calendar', highlight: classId } })
}

watch(() => route.query.tab, (newTab) => {
  if (newTab && tabs.value.some(t => t.value === newTab)) {
    activeTab.value = newTab
  } else if (!newTab) {
    activeTab.value = 'classes'
  }
})

async function loadStudentsList() {
  try {
    const res = await api.get('/api/v1/students', { params: { pageSize: 1000 } })
    students.value = res.data.items || []
  } catch (err) {
    console.error('Error fetching students list for admin:', err)
  }
}

watch(selectedStudentId, async (newVal) => {
  if (newVal) {
    router.replace({ path: route.path, query: { ...route.query, studentId: newVal } })
    const student = students.value.find(s => s.studentId === newVal)
    if (student) {
      studentProfile.value = student
      await loadPortalDataForStudent(newVal, student.userId)
    } else {
      try {
        const res = await api.get(`/api/v1/students/${newVal}`)
        studentProfile.value = res.data
        await loadPortalDataForStudent(newVal, res.data.userId)
      } catch (e) {
        console.error('Error fetching student details:', e)
      }
    }
  } else {
    studentProfile.value = null
    enrolledClasses.value = []
    selectedClass.value = null
    schedules.value = []
    examResults.value = {}
    attendanceSummaries.value = []
    payments.value = []
    creditSummary.value = null
    mySupportMessages.value = []
    // Remove studentId from query
    const newQuery = { ...route.query }
    delete newQuery.studentId
    router.replace({ path: route.path, query: newQuery })
  }
})

// Fetch data
async function loadPortalData(isBackground = false) {
  const isBg = isBackground === true
  if (!isBg) {
    loading.value = true
  }
  try {
    if (authStore.isAdmin) {
      await loadStudentsList()
      
      const queryStudentId = route.query.studentId ? parseInt(route.query.studentId, 10) : null
      if (queryStudentId) {
        selectedStudentId.value = queryStudentId
      } else {
        studentProfile.value = null
        if (!isBg) {
          loading.value = false
        }
      }
      return
    }

    const userId = authStore.currentUser?.userId
    if (!userId) {
      if (!isBg) {
        loading.value = false
      }
      return
    }

    // 1. Fetch aggregated student summary from API Gateway
    try {
      const summaryRes = await api.get(`/api/v1/portal/student-summary/${userId}`)
      const summary = summaryRes.data
      
      studentProfile.value = summary.profile
      payments.value = summary.payments || []
      enrolledClasses.value = summary.enrollments || []
      attendanceSummaries.value = summary.attendanceSummary || []
      creditSummary.value = summary.creditSummary || null

      const studentId = studentProfile.value.studentId

      // Load class schedules and scores which depend on enrolled classes
      if (enrolledClasses.value.length > 0) {
        const queryClassId = route.query.openClassId ? parseInt(route.query.openClassId, 10) : null
        const targetClass = queryClassId 
          ? enrolledClasses.value.find(c => c.classId === queryClassId) 
          : null
        selectedClass.value = targetClass || enrolledClasses.value[0]
        
        if (!isClassUnpaid(selectedClass.value.classId)) {
          fetchClassDetails(selectedClass.value.classId)
        } else {
          selectedClassDetails.value = null
        }

        const schedulesPromise = !isClassUnpaid(selectedClass.value.classId)
          ? fetchClassSchedules(selectedClass.value.classId)
          : Promise.resolve(schedules.value = [])

        if (!isBg) {
          examResults.value = {}
        }
        const scorePromises = enrolledClasses.value.map(async (cls) => {
          try {
            const scoreRes = await api.get(`/api/v1/results/enrollment/${cls.enrollmentId}`)
            examResults.value[cls.enrollmentId] = scoreRes.data || []
          } catch (e) {
            console.error(`Error loading score for enrollment ${cls.enrollmentId}:`, e)
          }
        })

        const tempSchedulesMap = {}
        const conflictSchedulesPromises = enrolledClasses.value
          .filter(cls => !isClassUnpaid(cls.classId) && cls.status === 'DangHoc')
          .map(async (cls) => {
            try {
              const schedRes = await api.get(`/api/v1/classes/${cls.classId}/schedules`)
              tempSchedulesMap[cls.classId] = schedRes.data || []
            } catch (e) {
              console.error(`Error loading schedules for class ${cls.classId}:`, e)
            }
          })

        const msgPromise = api.get('/api/v1/support-messages/my-messages').then(res => {
          mySupportMessages.value = res.data || []
        }).catch(e => {
          console.error('Error fetching support messages:', e)
          mySupportMessages.value = []
        })

        await Promise.all([
          schedulesPromise,
          msgPromise,
          ...scorePromises,
          ...conflictSchedulesPromises
        ])
        
        enrolledSchedulesMap.value = tempSchedulesMap
      } else {
        selectedClass.value = null
        schedules.value = []
        examResults.value = {}
        enrolledSchedulesMap.value = {}
        
        try {
          const msgRes = await api.get('/api/v1/support-messages/my-messages')
          mySupportMessages.value = msgRes.data || []
        } catch (e) {
          console.error('Error fetching support messages:', e)
        }
      }

      // Initialize WebSockets
      setupSignalR()

    } catch (err) {
      console.error('Error fetching student summary:', err)
      if (!isBg) {
        showSnackbar('Hồ sơ học tập của bạn chưa được tạo hoặc lỗi liên kết.', 'error')
      }
    } finally {
      if (!isBg) {
        loading.value = false
      }
    }
  } catch (err) {
    console.error('Error loading portal:', err)
    if (!isBg) {
      showSnackbar('Có lỗi xảy ra khi tải thông tin học vụ.', 'error')
    }
    if (!isBg) {
      loading.value = false
    }
  }
}

async function loadPortalDataForStudent(studentId, userId) {
  loading.value = true
  try {
    // 1. Fetch independent data in parallel
    const payPromise = api.get(`/api/v1/payments/student/${userId}`).catch(e => {
      console.error('Error fetching payments:', e)
      return { data: [] }
    })
    const classPromise = api.get(`/api/v1/students/${studentId}/enrollments`)
    const attPromise = api.get(`/api/v1/attendances/student/${studentId}/summary`).catch(e => {
      console.error('Error fetching attendance:', e)
      return { data: [] }
    })
    const creditPromise = api.get(`/api/v1/enrollments/student-credits/${studentId}`).catch(e => {
      console.error('Error fetching student credits:', e)
      return { data: null }
    })
    const msgPromise = (authStore.isAdmin 
      ? api.get('/api/v1/support-messages')
      : api.get('/api/v1/support-messages/my-messages')
    ).catch(e => {
      console.error('Error fetching support messages:', e)
      return { data: [] }
    })

    const [payRes, classRes, attRes, creditRes, msgRes] = await Promise.all([
      payPromise,
      classPromise,
      attPromise,
      creditPromise,
      msgPromise
    ])

    payments.value = payRes.data || []
    enrolledClasses.value = classRes.data || []
    attendanceSummaries.value = attRes.data || []
    creditSummary.value = creditRes.data

    if (authStore.isAdmin) {
      mySupportMessages.value = (msgRes.data || []).filter(m => m.studentId === studentId)
    } else {
      mySupportMessages.value = msgRes.data || []
    }

    // 2. Fetch dependent class schedules and scores in parallel
    if (enrolledClasses.value.length > 0) {
      selectedClass.value = enrolledClasses.value[0]
      
      if (!isClassUnpaid(selectedClass.value.classId)) {
        fetchClassDetails(selectedClass.value.classId)
      } else {
        selectedClassDetails.value = null
      }

      const schedulesPromise = !isClassUnpaid(selectedClass.value.classId)
        ? fetchClassSchedules(selectedClass.value.classId)
        : Promise.resolve(schedules.value = [])

      examResults.value = {}
      const scorePromises = enrolledClasses.value.map(async (cls) => {
        try {
          const scoreRes = await api.get(`/api/v1/results/enrollment/${cls.enrollmentId}`)
          examResults.value[cls.enrollmentId] = scoreRes.data || []
        } catch (e) {
          console.error(`Error loading score for enrollment ${cls.enrollmentId}:`, e)
        }
      })

      const tempSchedulesMap = {}
      const conflictSchedulesPromises = enrolledClasses.value
        .filter(cls => !isClassUnpaid(cls.classId) && cls.status === 'DangHoc')
        .map(async (cls) => {
          try {
            const schedRes = await api.get(`/api/v1/classes/${cls.classId}/schedules`)
            tempSchedulesMap[cls.classId] = schedRes.data || []
          } catch (e) {
            console.error(`Error loading schedules for class ${cls.classId}:`, e)
          }
        })

      await Promise.all([
        schedulesPromise,
        ...scorePromises,
        ...conflictSchedulesPromises
      ])

      enrolledSchedulesMap.value = tempSchedulesMap
    } else {
      selectedClass.value = null
      schedules.value = []
      examResults.value = {}
      enrolledSchedulesMap.value = {}
    }

    // Initialize WebSockets
    if (!authStore.isAdmin) {
      setupSignalR()
    }

  } catch (err) {
    console.error('Error loading student data:', err)
    showSnackbar('Có lỗi xảy ra khi tải dữ liệu học tập.', 'error')
  } finally {
    loading.value = false
  }
}

// Check if a class has unpaid status
function isClassUnpaid(classId) {
  if (!payments.value) return false
  const payment = payments.value.find(p => p.classId === classId)
  return payment && payment.status === 'ChuaTT'
}

// Select class and load schedules
async function selectClass(cls) {
  selectedClass.value = cls
  if (!isClassUnpaid(cls.classId)) {
    await Promise.all([
      fetchClassSchedules(cls.classId),
      fetchClassDetails(cls.classId)
    ])
  } else {
    schedules.value = []
    selectedClassDetails.value = null
  }
}

async function fetchClassSchedules(classId) {
  loadingSchedules.value = true
  try {
    const res = await api.get(`/api/v1/classes/${classId}/schedules`)
    schedules.value = res.data || []
  } catch (e) {
    console.error('Error fetching class schedules:', e)
    schedules.value = []
  } finally {
    loadingSchedules.value = false
  }
}

async function fetchClassDetails(classId) {
  try {
    const res = await api.get(`/api/v1/classes/${classId}`)
    selectedClassDetails.value = res.data
  } catch (e) {
    console.error('Error fetching class details:', e)
    selectedClassDetails.value = null
  }
}

// Calculate summary stats
const averageGrade = computed(() => {
  let totalScore = 0
  let count = 0
  
  Object.values(examResults.value).forEach(resultsList => {
    resultsList.forEach(res => {
      totalScore += res.score
      count++
    })
  })
  
  return count > 0 ? totalScore / count : 0
})

function getAverageScoreForClass(enrollmentId) {
  const scores = examResults.value[enrollmentId] || []
  if (scores.length === 0) return 0
  let total = 0
  scores.forEach(s => {
    total += s.score
  })
  return total / scores.length
}

const totalDebt = computed(() => {
  if (payments.value.length === 0) return 0
  return payments.value.reduce((acc, curr) => acc + curr.remainingAmount, 0)
})

// Helpers
function formatDate(dateStr) {
  if (!dateStr) return '—'
  let normalizedStr = dateStr
  if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
    normalizedStr = dateStr + 'Z'
  }
  const d = new Date(normalizedStr)
  return d.toLocaleDateString('vi-VN')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  let normalizedStr = dateStr
  if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
    normalizedStr = dateStr + 'Z'
  }
  const d = new Date(normalizedStr)
  return d.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}

function formatDayOfWeek(day) {
  const map = { 1: 'Hai', 2: 'Ba', 3: 'Tư', 4: 'Năm', 5: 'Sáu', 6: 'Bảy', 0: 'Chủ Nhật' }
  return map[day] || day
}

function getEnrollmentStatusClass(status) {
  const map = { DangHoc: 'status-inprogress', DaXong: 'status-completed', BoHoc: 'status-cancelled' }
  return map[status] || 'status-opened'
}

function getEnrollmentStatusLabel(status) {
  const map = { DangHoc: 'Đang học', DaXong: 'Hoàn thành', BoHoc: 'Đã bỏ học' }
  return map[status] || status
}

// Helpers for schedule conflicts
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0
  const parts = timeStr.split(':')
  const hours = parseInt(parts[0], 10) || 0
  const minutes = parseInt(parts[1], 10) || 0
  return hours * 60 + minutes
}

function isScheduleConflict(s1, s2) {
  if (s1.dayOfWeek !== s2.dayOfWeek) return false
  const start1 = parseTimeToMinutes(s1.startTime)
  const end1 = parseTimeToMinutes(s1.endTime)
  const start2 = parseTimeToMinutes(s2.startTime)
  const end2 = parseTimeToMinutes(s2.endTime)
  return start1 < end2 && start2 < end1
}

function classesConflictOnDay(classA, classB, dayOfWeek) {
  const startA = new Date(classA.startDate)
  startA.setHours(0,0,0,0)
  const endA = classA.endDate ? new Date(classA.endDate) : new Date(2100, 0, 1)
  endA.setHours(23,59,59,999)
  
  const startB = new Date(classB.startDate)
  startB.setHours(0,0,0,0)
  const endB = classB.endDate ? new Date(classB.endDate) : new Date(2100, 0, 1)
  endB.setHours(23,59,59,999)
  
  const startIntersect = new Date(Math.max(startA, startB))
  const endIntersect = new Date(Math.min(endA, endB))
  
  if (startIntersect > endIntersect) return false
  
  const check = new Date(startIntersect)
  for (let i = 0; i < 7; i++) {
    const jsDay = check.getDay()
    const targetDay = jsDay === 0 ? 0 : jsDay + 1
    if (targetDay === dayOfWeek) {
      return check <= endIntersect
    }
    check.setDate(check.getDate() + 1)
  }
  return false
}

const currentConflicts = computed(() => {
  const conflicts = []
  const classes = enrolledClasses.value.filter(c => c.status === 'DangHoc')
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const classA = classes[i]
      const classB = classes[j]
      
      const schedsA = enrolledSchedulesMap.value[classA.classId] || []
      const schedsB = enrolledSchedulesMap.value[classB.classId] || []
      
      let hasOverlap = false
      let overlappingSession = null
      for (const sa of schedsA) {
        for (const sb of schedsB) {
          if (isScheduleConflict(sa, sb)) {
            if (classesConflictOnDay(classA, classB, sa.dayOfWeek)) {
              hasOverlap = true
              overlappingSession = { sa, sb }
              break
            }
          }
        }
        if (hasOverlap) break
      }
      
      if (hasOverlap) {
        conflicts.push({
          classA,
          classB,
          sessionA: overlappingSession.sa,
          sessionB: overlappingSession.sb
        })
      }
    }
  }
  return conflicts
})

// Watch supportFromClassId to fetch alternative classes
watch(supportFromClassId, async (newClassId) => {
  if (!newClassId) {
    supportAlternativeClasses.value = []
    supportToClassId.value = null
    return
  }
  loadingSupportAlternativeClasses.value = true
  try {
    const currentEnrollment = enrolledClasses.value.find(c => c.classId === newClassId)
    if (!currentEnrollment) return
    
    // Auto-update message text to target the selected class if not already custom edited by user
    if (!supportMessageText.value || supportMessageText.value.startsWith('Em bị trùng lịch học') || supportMessageText.value.startsWith('Em muốn đổi lớp')) {
      supportMessageText.value = `Em muốn đổi lớp ${currentEnrollment.className}. Nhờ Admin chuyển lớp giúp em.`
    }
    
    const res = await api.get('/api/v1/classes', {
      params: { courseId: currentEnrollment.courseId, pageSize: 100 }
    })
    supportAlternativeClasses.value = (res.data?.items || []).filter(
      c => c.classId !== newClassId && (c.status === 'Opened' || c.status === 'InProgress')
    )
  } catch (e) {
    console.error('Error fetching support alternative classes:', e)
  } finally {
    loadingSupportAlternativeClasses.value = false
  }
})

function handleOpenSupportConflict(targetClass, conflictClass) {
  router.push({
    path: '/other-services',
    query: {
      tab: 'support',
      fromClassId: targetClass.classId,
      conflictClassName: conflictClass.className
    }
  })
}

let signalrConnection = null

function setupSignalR() {
  if (signalrConnection) return
  
  const token = authStore.token || authStore.currentUser?.token
  if (!token) return
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const hubUrl = baseUrl.endsWith('/') ? `${baseUrl}hubs/support` : `${baseUrl}/hubs/support`;

  signalrConnection = new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build()
    
  signalrConnection.on('SupportMessageStatusChanged', async (msg) => {
    try {
      if (msg.status === 'Resolved') {
        showSnackbar(`Yêu cầu đổi lớp của bạn đã được phê duyệt! Lịch học đã được cập nhật.`, 'success')
        await loadPortalData()
      } else if (msg.status === 'Rejected') {
        showSnackbar(`Yêu cầu đổi lớp của bạn đã bị từ chối.`, 'info')
      }
    } catch (err) {
      console.error('Error handling WebSocket message status change:', err)
    }
  })
  
  signalrConnection.start()
    .then(() => console.log('Connected to SupportHub WebSocket!'))
    .catch(err => console.error('Error starting SupportHub connection:', err))
}

// --- ADMIN EDIT & ACTION LOGIC ---
const adminGradingModal = ref(false)
const gradingClass = ref(null)
const adminPaymentModal = ref(false)
const paymentBill = ref(null)

async function changeEnrollmentStatus(cls, newStatus) {
  try {
    await api.put(`/api/v1/enrollments/${cls.enrollmentId}/status`, {
      id: cls.enrollmentId,
      status: newStatus
    })
    showSnackbar('Đã cập nhật trạng thái lớp học!', 'success')
    await loadPortalDataForStudent(studentProfile.value.studentId, studentProfile.value.userId)
  } catch (err) {
    console.error('Error changing enrollment status:', err)
    showSnackbar(err.response?.data?.message || 'Không thể cập nhật trạng thái lớp học', 'error')
  }
}



function openGradingDialog(cls) {
  gradingClass.value = cls
  adminGradingModal.value = true
}

async function changeAttendanceStatus(session, newStatus) {
  try {
    await api.put(`/api/v1/attendances/${session.attendanceId}`, {
      id: session.attendanceId,
      status: newStatus,
      note: session.note || null
    })
    showSnackbar('Đã cập nhật trạng thái điểm danh!', 'success')
    await loadPortalDataForStudent(studentProfile.value.studentId, studentProfile.value.userId)
  } catch (err) {
    console.error('Error updating attendance status:', err)
    showSnackbar(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái điểm danh', 'error')
  }
}

function openPaymentModal(pay) {
  paymentBill.value = pay
  adminPaymentModal.value = true
}

onUnmounted(() => {
  if (signalrConnection) {
    signalrConnection.stop()
    signalrConnection = null
  }
})

onMounted(loadPortalData)
</script>
