<template>
  <div class="space-y-6 animate-fade-in pb-16">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary-container/10 pb-5">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
          <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">leaderboard</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg font-bold text-on-background tracking-tight">
            Bảng Xếp Hạng Giảng Viên
          </h2>
          <p class="font-body-sm text-body-sm text-secondary mt-1">Thống kê điểm số đánh giá và xếp hạng chất lượng giảng dạy của đội ngũ giảng viên.</p>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="glass-panel p-12 rounded-xl text-center flex flex-col items-center justify-center">
      <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
      <p class="text-sm font-semibold text-slate-600">Đang tổng hợp dữ liệu xếp hạng...</p>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- 1. KPI Summaries -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Card 1: Total Reviews -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">rate_review</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số lượt đánh giá</div>
            <div class="text-headline-sm font-bold text-slate-800 truncate mt-0.5">
              {{ filteredEvaluations.length }} lượt
            </div>
          </div>
        </div>

        <!-- Card 2: Average Center Rating -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">star</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Điểm trung bình hệ thống</div>
            <div class="text-headline-sm font-bold text-slate-800 truncate mt-0.5 flex items-center gap-1.5">
              {{ centerAverageRating.toFixed(2) }}
              <span class="text-xs text-amber-500 font-extrabold flex items-center">/ 5.0 ★</span>
            </div>
          </div>
        </div>

        <!-- Card 3: Best Teacher -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Giảng viên dẫn đầu</div>
            <div class="text-body-md font-bold text-emerald-600 truncate mt-0.5" :title="topTeacherName">
              {{ topTeacherName }}
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Filters Bar -->
      <section class="glass-panel p-5 rounded-xl border border-white/40 bg-white/80 space-y-4">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">tune</span>
          Bộ lọc thống kê xếp hạng
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Search input -->
          <div class="relative lg:col-span-2">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              v-model="filters.search"
              class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-body-sm text-body-sm text-on-surface placeholder:text-slate-400 transition-all"
              placeholder="Tìm theo tên giảng viên..."
              type="text"
            />
            <button
              v-if="filters.search"
              @click="filters.search = ''"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-slate-100 border-0 bg-transparent"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <!-- Course filter -->
          <div class="relative">
            <select
              v-model="filters.courseId"
              @change="handleCourseChange"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg appearance-none pl-3 pr-8 py-2.5 text-body-sm font-semibold text-slate-700 bg-transparent cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">Tất cả môn học</option>
              <option v-for="c in courses" :key="c.courseId" :value="c.courseId">
                {{ c.courseName }}
              </option>
            </select>
            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
          </div>

          <!-- Class filter -->
          <div class="relative">
            <select
              v-model="filters.classId"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg appearance-none pl-3 pr-8 py-2.5 text-body-sm font-semibold text-slate-700 bg-transparent cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">Tất cả lớp học</option>
              <option v-for="cls in filteredClassesList" :key="cls.classId" :value="cls.classId">
                {{ cls.className }}
              </option>
            </select>
            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
          </div>

          <!-- Quick date filter -->
          <div class="relative">
            <select
              v-model="filters.timePeriod"
              @change="handleTimePeriodChange"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg appearance-none pl-3 pr-8 py-2.5 text-body-sm font-semibold text-slate-700 bg-transparent cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="thisMonth">Tháng này</option>
              <option value="last3Months">3 tháng gần đây</option>
              <option value="thisYear">Trong năm nay</option>
              <option value="custom">Tùy chọn...</option>
            </select>
            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
          </div>
        </div>

        <!-- Custom Date range selection -->
        <div v-if="filters.timePeriod === 'custom'" class="flex flex-col sm:flex-row gap-4 items-center animate-fade-in border-t border-slate-100 pt-3">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <span class="text-xs font-bold text-slate-500 uppercase shrink-0">Từ ngày:</span>
            <input
              type="date"
              v-model="filters.startDate"
              class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <span class="text-xs font-bold text-slate-500 uppercase shrink-0">Đến ngày:</span>
            <input
              type="date"
              v-model="filters.endDate"
              class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            @click="resetDateFilter"
            class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 rounded-lg border-0 cursor-pointer transition-colors"
          >
            Đặt lại ngày
          </button>
        </div>
      </section>

      <!-- 3. Visualization Charts -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Ranked Teacher Comparison -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col hover-shadow gap-4">
          <div>
            <h3 class="font-title-md text-title-md font-bold text-indigo-950 flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-indigo-600">bar_chart</span>
              So sánh điểm số của Giảng viên
            </h3>
            <p class="text-body-sm text-slate-500">Biểu đồ so sánh điểm trung bình tổng quát của các giảng viên đứng lớp.</p>
          </div>
          <div class="relative min-h-[300px] flex items-center justify-center w-full bg-white/10 rounded-xl p-2">
            <canvas ref="rankingChartCanvas"></canvas>
            <div v-if="rankedTeachers.length === 0" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
              <p class="text-sm font-semibold text-slate-500">Không có dữ liệu biểu diễn</p>
            </div>
          </div>
        </div>

        <!-- Chart 2: Criteria Performance Radar -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col hover-shadow gap-4">
          <div>
            <h3 class="font-title-md text-title-md font-bold text-indigo-950 flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-indigo-600">radar</span>
              Phân tích tiêu chí chất lượng
            </h3>
            <p class="text-body-sm text-slate-500">Biểu diễn thế mạnh giảng dạy chi tiết theo 4 tiêu chí cốt lõi.</p>
          </div>
          <div class="relative min-h-[300px] flex items-center justify-center w-full bg-white/10 rounded-xl p-2">
            <canvas ref="criteriaChartCanvas"></canvas>
            <div v-if="rankedTeachers.length === 0" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
              <p class="text-sm font-semibold text-slate-500">Không có dữ liệu biểu diễn</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Ranking Data Table -->
      <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 class="font-title-md text-title-md font-bold text-slate-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-600">list_alt</span>
            Danh sách xếp hạng hiệu quả giảng dạy
          </h3>
          <span class="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            {{ rankedTeachers.length }} Giảng viên được xếp hạng
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50">
                <th class="py-3 px-4 font-bold text-slate-500 text-xs w-16 text-center">Hạng</th>
                <th class="py-3 px-4 font-bold text-slate-500 text-xs">Giảng viên</th>
                <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center w-28">ĐTB Đánh giá</th>
                <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center w-28">Lượt đánh giá</th>
                <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center hidden md:table-cell">Kỹ năng sư phạm</th>
                <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center hidden md:table-cell">Thái độ & Hỗ trợ</th>
                <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center hidden md:table-cell">Tài liệu học tập</th>
                <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center hidden md:table-cell">Tác phong lên lớp</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
              <tr v-for="(t, idx) in rankedTeachers" :key="t.teacherId" class="hover:bg-slate-50/40 transition-colors">
                <!-- Rank medal / number -->
                <td class="py-4 px-4 text-center">
                  <span v-if="idx === 0" class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white font-bold shadow-sm" title="Hạng Nhất">1</span>
                  <span v-else-if="idx === 1" class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-400 text-white font-bold shadow-sm" title="Hạng Nhì">2</span>
                  <span v-else-if="idx === 2" class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-bold shadow-sm" title="Hạng Ba">3</span>
                  <span v-else class="text-slate-400 font-semibold">{{ idx + 1 }}</span>
                </td>
                
                <!-- Teacher Details -->
                <td class="py-4 px-4 font-bold text-slate-800">
                  {{ t.teacherName }}
                  <span class="block text-[10px] text-slate-400 font-medium">Mã GV: GV-{{ String(t.teacherId).padStart(4, '0') }}</span>
                </td>

                <!-- Overall Average Score -->
                <td class="py-4 px-4 text-center">
                  <span class="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded text-indigo-700 font-extrabold text-xs">
                    {{ t.averageRating.toFixed(2) }}
                    <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-indigo-500">star</span>
                  </span>
                </td>

                <!-- Total reviews count -->
                <td class="py-4 px-4 text-center text-slate-655 font-bold">
                  {{ t.reviewCount }}
                </td>

                <!-- Core Criteria 1 -->
                <td class="py-4 px-4 text-center hidden md:table-cell">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold text-slate-700">{{ t.teachingQuality.toFixed(1) }}</span>
                    <span class="material-symbols-outlined text-[11px] font-variation-settings-fill text-amber-500">star</span>
                  </div>
                </td>

                <!-- Core Criteria 2 -->
                <td class="py-4 px-4 text-center hidden md:table-cell">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold text-slate-700">{{ t.support.toFixed(1) }}</span>
                    <span class="material-symbols-outlined text-[11px] font-variation-settings-fill text-amber-500">star</span>
                  </div>
                </td>

                <!-- Core Criteria 3 -->
                <td class="py-4 px-4 text-center hidden md:table-cell">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold text-slate-700">{{ t.curriculum.toFixed(1) }}</span>
                    <span class="material-symbols-outlined text-[11px] font-variation-settings-fill text-amber-500">star</span>
                  </div>
                </td>

                <!-- Core Criteria 4 -->
                <td class="py-4 px-4 text-center hidden md:table-cell">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold text-slate-700">{{ t.punctuality.toFixed(1) }}</span>
                    <span class="material-symbols-outlined text-[11px] font-variation-settings-fill text-amber-500">star</span>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="rankedTeachers.length === 0">
                <td colspan="8" class="p-8 text-center text-slate-400">
                  Không tìm thấy dữ liệu xếp hạng phù hợp
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import api from '../../services/api'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const loading = ref(true)

// Raw data storage
const evaluations = ref([])
const criteria = ref([])
const teachers = ref([])
const classes = ref([])
const courses = ref([])

// Filters state
const filters = ref({
  search: '',
  courseId: 'all',
  classId: 'all',
  timePeriod: 'all',
  startDate: '',
  endDate: ''
})

// Chart instances
const rankingChartCanvas = ref(null)
const criteriaChartCanvas = ref(null)
let rankingChartInstance = null
let criteriaChartInstance = null

// Load all related databases from endpoints
async function loadRankingData() {
  loading.value = true
  try {
    const [evalsRes, teachersRes, classesRes, coursesRes, criteriaRes] = await Promise.all([
      api.get('/api/v1/teacher-evaluations/all'),
      api.get('/api/v1/teachers', { params: { pageSize: 100 } }),
      api.get('/api/v1/classes', { params: { pageSize: 100 } }),
      api.get('/api/v1/courses', { params: { pageSize: 100 } }),
      api.get('/api/v1/teacher-evaluations/criteria/all')
    ])

    evaluations.value = evalsRes.data || []
    teachers.value = teachersRes.data?.items || []
    classes.value = classesRes.data?.items || []
    courses.value = coursesRes.data?.items || []
    criteria.value = criteriaRes.data || []
  } catch (error) {
    console.error('Error loading data for ranking dashboard:', error)
  } finally {
    loading.value = false
    await nextTick()
    renderCharts()
  }
}

// Automatically filter class options based on the selected course
const filteredClassesList = computed(() => {
  if (filters.value.courseId === 'all') return classes.value
  return classes.value.filter(c => c.courseId === filters.value.courseId)
})

// Handle course change - reset class selection
function handleCourseChange() {
  filters.value.classId = 'all'
}

// Reset custom date filter ranges
function resetDateFilter() {
  filters.value.startDate = ''
  filters.value.endDate = ''
}

// Predefined quick time period changes
function handleTimePeriodChange() {
  const now = new Date()
  resetDateFilter()
  if (filters.value.timePeriod === 'thisMonth') {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    filters.value.startDate = formatDateString(firstDay)
    filters.value.endDate = formatDateString(now)
  } else if (filters.value.timePeriod === 'last3Months') {
    const pastDay = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    filters.value.startDate = formatDateString(pastDay)
    filters.value.endDate = formatDateString(now)
  } else if (filters.value.timePeriod === 'thisYear') {
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
    filters.value.startDate = formatDateString(firstDayOfYear)
    filters.value.endDate = formatDateString(now)
  }
}

function formatDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 1. FILTER EVALUATIONS
const filteredEvaluations = computed(() => {
  let list = evaluations.value

  // Course Filter
  if (filters.value.courseId !== 'all') {
    const allowedClasses = classes.value
      .filter(c => c.courseId === filters.value.courseId)
      .map(c => c.classId)
    list = list.filter(e => allowedClasses.includes(e.classId))
  }

  // Class Filter
  if (filters.value.classId !== 'all') {
    list = list.filter(e => e.classId === filters.value.classId)
  }

  // Custom Date range Filter
  if (filters.value.startDate) {
    const start = new Date(filters.value.startDate)
    list = list.filter(e => new Date(e.createdAt) >= start)
  }
  if (filters.value.endDate) {
    const end = new Date(filters.value.endDate)
    end.setHours(23, 59, 59, 999) // include whole end day
    list = list.filter(e => new Date(e.createdAt) <= end)
  }

  return list
})

// 2. PROCESS RANKING AND AVERAGE DETAILS
const rankedTeachers = computed(() => {
  const evals = filteredEvaluations.value
  
  // Initialize map for teachers
  const summary = {}
  teachers.value.forEach(t => {
    summary[t.userId] = {
      teacherId: t.userId,
      teacherName: t.fullName,
      totalScore: 0,
      reviewCount: 0,
      teachingQualityTotal: 0,
      supportTotal: 0,
      curriculumTotal: 0,
      punctualityTotal: 0
    }
  })

  // Aggregate evaluations
  evals.forEach(ev => {
    const sObj = summary[ev.teacherId]
    if (sObj) {
      sObj.reviewCount++
      sObj.totalScore += ev.rating
      
      // Look up detailed criteria score
      if (ev.detailedRatings && ev.detailedRatings.length > 0) {
        // Detailed ratings present
        sObj.teachingQualityTotal += ev.detailedRatings[0]?.rating || ev.rating
        sObj.supportTotal += ev.detailedRatings[1]?.rating || ev.rating
        sObj.curriculumTotal += ev.detailedRatings[2]?.rating || ev.rating
        sObj.punctualityTotal += ev.detailedRatings[3]?.rating || ev.rating
      } else {
        // Legacy fallback
        sObj.teachingQualityTotal += ev.teachingQualityRating || 0
        sObj.supportTotal += ev.supportRating || 0
        sObj.curriculumTotal += ev.curriculumRating || 0
        sObj.punctualityTotal += ev.punctualityRating || 0
      }
    }
  })

  // Format and compute averages
  const rankingList = Object.values(summary)
    .map(s => {
      const count = s.reviewCount || 1
      return {
        teacherId: s.teacherId,
        teacherName: s.teacherName,
        reviewCount: s.reviewCount,
        averageRating: s.reviewCount > 0 ? s.totalScore / s.reviewCount : 0,
        teachingQuality: s.reviewCount > 0 ? s.teachingQualityTotal / count : 0,
        support: s.reviewCount > 0 ? s.supportTotal / count : 0,
        curriculum: s.reviewCount > 0 ? s.curriculumTotal / count : 0,
        punctuality: s.reviewCount > 0 ? s.punctualityTotal / count : 0
      }
    })
    // Filter teachers who actually have reviews or show all if search matches
    .filter(t => {
      if (filters.value.search) {
        return t.teacherName.toLowerCase().includes(filters.value.search.trim().toLowerCase())
      }
      return t.reviewCount > 0 // Only show teachers with active ratings
    })
    // Sort descending by average rating, then by review count
    .sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating
      }
      return b.reviewCount - a.reviewCount
    })

  return rankingList
})

// KPI computation properties
const centerAverageRating = computed(() => {
  const evals = filteredEvaluations.value
  if (evals.length === 0) return 0
  return evals.reduce((sum, e) => sum + e.rating, 0) / evals.length
})

const topTeacherName = computed(() => {
  const ranking = rankedTeachers.value
  const top = ranking.find(t => t.reviewCount > 0)
  return top ? `${top.teacherName} (${top.averageRating.toFixed(2)} ★)` : 'Chưa có dữ liệu'
})

// 3. RENDER CHARTS
function renderCharts() {
  renderRankingChart()
  renderCriteriaChart()
}

function renderRankingChart() {
  if (!rankingChartCanvas.value) return
  if (rankingChartInstance) {
    rankingChartInstance.destroy()
  }

  const dataList = rankedTeachers.value.slice(0, 10) // Top 10 teachers
  const labels = dataList.map(t => t.teacherName)
  const ratings = dataList.map(t => Math.round(t.averageRating * 100) / 100)

  const ctx = rankingChartCanvas.value.getContext('2d')
  rankingChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Điểm đánh giá trung bình',
        data: ratings,
        backgroundColor: 'rgba(79, 70, 229, 0.75)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1.5,
        borderRadius: 8,
        barPercentage: 0.55
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Điểm ĐTB: ${context.parsed.y} ★`
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 5,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { stepSize: 1 }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

function renderCriteriaChart() {
  if (!criteriaChartCanvas.value) return
  if (criteriaChartInstance) {
    criteriaChartInstance.destroy()
  }

  const dataList = rankedTeachers.value
  let avgQuality = 0
  let avgSupport = 0
  let avgCurriculum = 0
  let avgPunctuality = 0

  if (dataList.length > 0) {
    const sum = dataList.reduce((acc, t) => {
      acc.q += t.teachingQuality
      acc.s += t.support
      acc.c += t.curriculum
      acc.p += t.punctuality
      return acc
    }, { q: 0, s: 0, c: 0, p: 0 })

    avgQuality = sum.q / dataList.length
    avgSupport = sum.s / dataList.length
    avgCurriculum = sum.c / dataList.length
    avgPunctuality = sum.p / dataList.length
  }

  const ctx = criteriaChartCanvas.value.getContext('2d')
  criteriaChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Kỹ năng sư phạm', 'Thái độ & Hỗ trợ', 'Tài liệu học tập', 'Tác phong lên lớp'],
      datasets: [{
        label: 'Điểm trung bình tiêu chí',
        data: [avgQuality, avgSupport, avgCurriculum, avgPunctuality],
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(14, 165, 233)',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: { stepSize: 1, display: false },
          grid: { color: 'rgba(0, 0, 0, 0.08)' },
          angleLines: { color: 'rgba(0, 0, 0, 0.08)' },
          pointLabels: {
            font: {
              size: 11,
              weight: 'bold'
            },
            color: '#1e293b'
          }
        }
      }
    }
  })
}

// Watch filters to trigger chart redraws dynamically
watch(filters, async () => {
  await nextTick()
  renderCharts()
}, { deep: true })

onMounted(() => {
  loadRankingData()
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
.hover-scale {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.hover-scale:hover {
  transform: translateY(-4px) scale(1.015);
  box-shadow: 0 12px 24px rgba(0, 6, 19, 0.06);
}
.hover-shadow:hover {
  box-shadow: 0 12px 24px rgba(0, 6, 19, 0.06);
}
canvas {
  width: 100% !important;
  height: 100% !important;
  max-height: 300px !important;
}
</style>
