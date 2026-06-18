<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-primary-container/10 pb-5">
      <div>
        <h1 class="text-display-sm font-bold tracking-tight text-primary-container flex items-center gap-2">
          <span class="material-symbols-outlined text-[32px] text-on-tertiary-container animate-pulse">dashboard</span>
          Chào mừng trở lại, {{ authStore.currentUser?.fullName }}!
        </h1>
        <p class="text-body-md text-on-surface-variant/80 mt-1">
          Hôm nay là {{ todayString }}. Dưới đây là tổng quan tình hình hoạt động của bạn.
        </p>
      </div>
    </div>

    <!-- --------------------------------------------------------------------- -->
    <!-- 1. ADMIN DASHBOARD VIEW -->
    <!-- --------------------------------------------------------------------- -->
    <div v-if="authStore.isAdmin" class="space-y-6">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1: Total Revenue -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">monetization_on</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Tổng doanh thu</div>
            <div class="text-headline-sm font-bold text-primary-container truncate mt-0.5" :title="formatCurrency(adminStats.totalRevenue)">
              {{ formatShortCurrency(adminStats.totalRevenue) }}
            </div>
          </div>
        </div>

        <!-- Card 2: Total Debt -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">money_off</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Học phí chưa thu</div>
            <div class="text-headline-sm font-bold text-rose-600 truncate mt-0.5" :title="formatCurrency(adminStats.totalDebt)">
              {{ formatShortCurrency(adminStats.totalDebt) }}
            </div>
          </div>
        </div>

        <!-- Card 3: Active Students -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">school</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Học viên hoạt động</div>
            <div class="text-headline-sm font-bold text-primary-container truncate mt-0.5">
              {{ adminStats.totalStudents }}
            </div>
          </div>
        </div>

        <!-- Card 4: Teachers -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">co_present</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Giảng viên đứng lớp</div>
            <div class="text-headline-sm font-bold text-primary-container truncate mt-0.5">
              {{ adminStats.totalTeachers }}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts & Tables Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Revenue Line Chart -->
        <div class="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col hover-shadow gap-4">
          <div>
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-on-tertiary-container">trending_up</span>
              Biểu Đồ Doanh Thu 12 Tháng Qua
            </h3>
            <p class="text-body-sm text-on-surface-variant/70 mb-4">Biểu diễn dòng tiền học phí thực tế đóng theo từng tháng trong năm {{ selectedYear }}</p>
          </div>
          <div class="relative min-h-[300px] flex items-center justify-center">
            <div v-if="loadingAdminCharts" class="animate-pulse flex flex-col items-center justify-center space-y-2">
              <span class="animate-spin inline-block w-8 h-8 border-4 border-on-tertiary-container border-t-transparent rounded-full"></span>
              <span class="text-body-sm text-on-surface-variant">Đang dựng biểu đồ...</span>
            </div>
            <canvas ref="revenueChartCanvas" v-show="!loadingAdminCharts"></canvas>
          </div>
        </div>

        <!-- Class Fill Rates -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col hover-shadow gap-4">
          <div>
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-on-tertiary-container">groups</span>
              Lớp Học Điển Hình
            </h3>
            <p class="text-body-sm text-on-surface-variant/70 mb-4">Danh sách lớp học có tỷ lệ lấp đầy cao nhất</p>
          </div>
          <div class="overflow-y-auto max-h-[300px] space-y-3 flex-1 pr-1">
            <div v-if="loadingClassStats" class="space-y-3 animate-pulse">
              <div v-for="i in 4" :key="i" class="h-10 bg-primary-container/5 rounded"></div>
            </div>
            <div v-else-if="classFillRates.length > 0" class="space-y-3">
              <div v-for="c in classFillRates.slice(0, 5)" :key="c.classId" class="p-3 bg-primary-container/[0.02] border border-primary-container/10 rounded-xl space-y-2 hover:bg-primary-container/[0.05] transition-colors">
                <div class="flex justify-between items-center text-body-xs font-semibold">
                  <span class="text-primary-container truncate max-w-[150px]">{{ c.className }}</span>
                  <span class="text-on-surface-variant">{{ c.currentStudents }} / {{ c.maxStudents }} học viên</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div :class="['h-full rounded-full', getProgressColor(c.fillRate)]" :style="{ width: (c.fillRate * 100) + '%' }"></div>
                  </div>
                  <span class="font-bold text-[10px]" :class="getTextColor(c.fillRate)">{{ Math.round(c.fillRate * 100) }}%</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-[36px] text-on-surface-variant/30">school</span>
              <p class="text-body-sm text-on-surface-variant/60 mt-1">Chưa có thông tin lớp học</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions and Operations Warnings -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Support Requests / Warnings -->
        <div class="glass-panel p-6 rounded-2xl lg:col-span-2 hover-shadow flex flex-col gap-4">
          <div>
            <h3 class="font-title-md text-title-md font-bold text-rose-600 flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-rose-600">warning</span>
              Cảnh Báo Chuyên Cần
            </h3>
            <p class="text-body-sm text-on-surface-variant/70 mb-4">Các học viên nghỉ nhiều cần giáo vụ can thiệp hỗ trợ</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse" v-if="academicWarnings.length > 0">
              <thead>
                <tr class="bg-primary-container/[0.05] text-[11px] font-bold text-on-surface-variant uppercase">
                  <th class="py-2.5 px-4 rounded-l-lg">Học viên</th>
                  <th class="py-2.5 px-4">Lớp</th>
                  <th class="py-2.5 px-4 text-center">Nghỉ học</th>
                  <th class="py-2.5 px-4 text-right rounded-r-lg">Tỉ lệ đi học</th>
                </tr>
              </thead>
              <tbody class="text-body-sm text-on-surface divide-y divide-primary-container/5">
                <tr v-for="w in academicWarnings.slice(0, 4)" :key="w.studentId + '-' + w.classId" class="hover:bg-primary-container/[0.02] transition-colors">
                  <td class="py-2.5 px-4 font-semibold">{{ w.studentName }}</td>
                  <td class="py-2.5 px-4 text-on-surface-variant">{{ w.className }}</td>
                  <td class="py-2.5 px-4 text-center">
                    <span class="bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2 py-0.5 rounded text-[11px] font-bold">
                      {{ w.absentCount }} buổi
                    </span>
                  </td>
                  <td class="py-2.5 px-4 text-right font-bold text-rose-600">
                    {{ Math.round(w.attendanceRate) }}%
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-10 flex flex-col items-center justify-center text-emerald-600 font-semibold">
              <span class="material-symbols-outlined text-[36px] text-emerald-500 mb-1">check_circle</span>
              <p class="text-body-sm">Không có học viên nào nghỉ quá giới hạn!</p>
            </div>
          </div>
        </div>

        <!-- Quick Access -->
        <div class="glass-panel p-6 rounded-2xl hover-shadow flex flex-col">
          <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-on-tertiary-container">near_me</span>
            Lối Tắt Thao Tác
          </h3>
          <div class="grid grid-cols-1 gap-3 flex-1">
            <router-link to="/classes" class="flex items-center gap-3 p-3 bg-primary-container/[0.03] border border-primary-container/10 rounded-xl hover:bg-primary-container/10 transition-all group">
              <span class="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">groups</span>
              <div>
                <div class="text-body-sm font-semibold text-primary-container">Xem danh sách lớp học</div>
                <div class="text-[11px] text-on-surface-variant">Thêm mới, gán giáo viên & xếp phòng</div>
              </div>
            </router-link>
            <router-link to="/payments" class="flex items-center gap-3 p-3 bg-primary-container/[0.03] border border-primary-container/10 rounded-xl hover:bg-primary-container/10 transition-all group">
              <span class="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">payments</span>
              <div>
                <div class="text-body-sm font-semibold text-primary-container">Đối soát hóa đơn & thanh toán</div>
                <div class="text-[11px] text-on-surface-variant">Thu học phí, báo cáo tài chính</div>
              </div>
            </router-link>
            <router-link to="/teachers/salary" class="flex items-center gap-3 p-3 bg-primary-container/[0.03] border border-primary-container/10 rounded-xl hover:bg-primary-container/10 transition-all group">
              <span class="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">account_balance</span>
              <div>
                <div class="text-body-sm font-semibold text-primary-container">Tính lương giảng viên</div>
                <div class="text-[11px] text-on-surface-variant">Lập bảng lương tháng, hợp đồng giảng dạy</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- --------------------------------------------------------------------- -->
    <!-- 2. TEACHER (GIAO VIEN) DASHBOARD VIEW -->
    <!-- --------------------------------------------------------------------- -->
    <div v-else-if="authStore.isTeacher" class="space-y-6">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1: Assigned Classes -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">groups</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Lớp học phụ trách</div>
            <div class="text-headline-sm font-bold text-primary-container mt-0.5">
              {{ teacherStats.classCount }} lớp
            </div>
          </div>
        </div>

        <!-- Card 2: Managed Students -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">person</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Học sinh quản lý</div>
            <div class="text-headline-sm font-bold text-primary-container mt-0.5">
              {{ teacherStats.totalStudentsTaught }} HS
            </div>
          </div>
        </div>

        <!-- Card 3: Sessions Taught This Month -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">menu_book</span>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Số buổi dạy tháng này</div>
            <div class="text-headline-sm font-bold text-primary-container mt-0.5">
              {{ teacherStats.sessionsTaughtThisMonth }} buổi
            </div>
          </div>
        </div>

        <!-- Card 4: Estimated Salary -->
        <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover-scale shadow-sm transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">payments</span>
          </div>
          <div class="min-w-0 font-body-lg">
            <div class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Lương tạm tính tháng này</div>
            <div class="text-headline-sm font-bold text-success truncate mt-0.5" :title="formatCurrency(teacherStats.estimatedSalaryThisMonth)">
              {{ formatCurrency(teacherStats.estimatedSalaryThisMonth) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule and Classes Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Today's Schedule -->
        <div class="glass-panel p-6 rounded-2xl lg:col-span-2 hover-shadow flex flex-col gap-4">
          <div>
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-on-tertiary-container">calendar_today</span>
              Lịch Dạy Hôm Nay
            </h3>
            <p class="text-body-sm text-on-surface-variant/70 mb-4">Các ca dạy được phân công đứng lớp trong ngày hôm nay</p>
          </div>
          <div class="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
            <div v-if="loadingTeacherDashboard" class="space-y-3 animate-pulse">
              <div v-for="i in 3" :key="i" class="h-14 bg-primary-container/5 rounded"></div>
            </div>
            <div v-else-if="todaySchedules.length > 0" class="space-y-3">
              <div v-for="s in todaySchedules" :key="s.scheduleId" class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-primary-container/[0.02] border border-primary-container/10 rounded-xl hover:bg-primary-container/[0.05] transition-all gap-4">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-[32px] text-primary-container shrink-0">schedule</span>
                  <div>
                    <h4 class="font-bold text-body-sm text-primary-container">Lớp: {{ s.className }}</h4>
                    <p class="text-body-xs text-on-surface-variant">Môn học: {{ s.courseName }}</p>
                    <p class="text-[11px] text-on-surface-variant/70 mt-0.5">Giờ học: {{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }} | Phòng: {{ s.class?.room || '303' }}</p>
                  </div>
                </div>
                <router-link :to="`/classes/${s.classId}/students`" class="bg-primary-container text-white px-3.5 py-1.5 rounded-lg text-body-xs font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 shrink-0">
                  <span class="material-symbols-outlined text-[16px]">edit_note</span>
                  Điểm danh & Điểm số
                </router-link>
              </div>
            </div>
            <div v-else class="text-center py-16 flex flex-col items-center justify-center text-on-surface-variant/60">
              <span class="material-symbols-outlined text-[48px] text-on-surface-variant/30">event_busy</span>
              <h4 class="font-bold text-body-lg text-primary-container mt-2">Hôm nay bạn được nghỉ!</h4>
              <p class="text-body-sm max-w-xs mt-1">Không có ca dạy nào được xếp lịch biểu trong hôm nay.</p>
            </div>
          </div>
        </div>

        <!-- Assigned Classes List -->
        <div class="glass-panel p-6 rounded-2xl hover-shadow flex flex-col gap-4">
          <div>
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-on-tertiary-container">school</span>
              Lớp Phụ Trách
            </h3>
            <p class="text-body-sm text-on-surface-variant/70 mb-4">Các lớp học đang giảng dạy trong hệ thống</p>
          </div>
          <div class="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
            <div v-if="loadingTeacherDashboard" class="space-y-3 animate-pulse">
              <div v-for="i in 4" :key="i" class="h-12 bg-primary-container/5 rounded"></div>
            </div>
            <div v-else-if="teacherStats.classes && teacherStats.classes.length > 0" class="space-y-3">
              <div v-for="c in teacherStats.classes" :key="c.classId" class="p-3.5 bg-primary-container/[0.02] border border-primary-container/10 rounded-xl space-y-2 hover:bg-primary-container/[0.05] transition-colors">
                <div class="flex justify-between items-center text-body-xs">
                  <span class="font-bold text-primary-container truncate max-w-[150px]">{{ c.className }}</span>
                  <span class="text-on-surface-variant font-medium">{{ c.currentStudents }} học sinh</span>
                </div>
                <div class="flex items-center justify-between text-[10px] text-on-surface-variant/70">
                  <span class="truncate max-w-[170px]">{{ c.courseName }}</span>
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border"
                    :class="c.status === 'InProgress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'">
                    {{ c.status === 'InProgress' ? 'Đang học' : 'Hoàn thành' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-16 flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-[36px] text-on-surface-variant/30">school</span>
              <p class="text-body-sm text-on-surface-variant/60 mt-1">Chưa được gán lớp học nào.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Pay Slips -->
      <div class="glass-panel p-6 rounded-2xl hover-shadow">
        <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2 mb-1">
          <span class="material-symbols-outlined text-on-tertiary-container">receipt_long</span>
          Phiếu Lương Gần Đây
        </h3>
        <p class="text-body-sm text-on-surface-variant/70 mb-4">Lịch sử thu nhập các tháng gần nhất của bạn</p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse" v-if="teacherStats.recentSlips && teacherStats.recentSlips.length > 0">
            <thead>
              <tr class="bg-primary-container/[0.05] text-[11px] font-bold text-on-surface-variant uppercase">
                <th class="py-3 px-4 rounded-l-lg">Tháng / Năm</th>
                <th class="py-3 px-4 text-center">Số buổi đứng lớp</th>
                <th class="py-3 px-4 text-right">Lương cứng</th>
                <th class="py-3 px-4 text-right font-bold">Thực lĩnh</th>
                <th class="py-3 px-4 text-center rounded-r-lg">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="text-body-sm text-on-surface divide-y divide-primary-container/5">
              <tr v-for="s in teacherStats.recentSlips" :key="s.salarySlipId" class="hover:bg-primary-container/[0.02] transition-colors">
                <td class="py-3 px-4 font-semibold text-primary-container">Tháng {{ s.month }} / {{ s.year }}</td>
                <td class="py-3 px-4 text-center">{{ s.sessionsTaught }} buổi</td>
                <td class="py-3 px-4 text-right">{{ formatCurrency(s.baseSalary) }}</td>
                <td class="py-3 px-4 text-right font-bold text-success">{{ formatCurrency(s.totalAmount) }}</td>
                <td class="py-3 px-4 text-center">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                    :class="s.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'">
                    {{ s.status === 'Paid' ? 'Đã chi trả' : 'Chờ chi trả' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-10 flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-[36px] text-on-surface-variant/30">payments</span>
            <p class="text-body-sm text-on-surface-variant/60 mt-1">Chưa phát hành phiếu lương nào.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../../stores'
import api from '../../services/api'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const authStore = useAuthStore()

// Datetime helper
const todayString = computed(() => {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// ----------------------------------------------------
// 1. ADMIN DASHBOARD LOGIC
// ----------------------------------------------------
const loadingAdminCharts = ref(false)
const loadingClassStats = ref(false)
const adminStats = ref({
  totalRevenue: 0,
  totalDebt: 0,
  totalStudents: 0,
  totalTeachers: 0
})

const selectedYear = ref(new Date().getFullYear())
const classFillRates = ref([])
const academicWarnings = ref([])
const revenueChartCanvas = ref(null)
let revenueChart = null

const loadAdminDashboard = async () => {
  if (!authStore.isAdmin) return
  loadingClassStats.value = true
  try {
    // 1. Fetch dashboard metrics
    const { data: dbData } = await api.get('/api/v1/reports/dashboard')
    adminStats.value = {
      totalRevenue: dbData.totalRevenue || 0,
      totalDebt: dbData.totalDebt || 0,
      totalStudents: dbData.totalStudents || 0,
      totalTeachers: dbData.totalTeachers || 0
    }

    // 2. Fetch class analytics
    const { data: classAna } = await api.get('/api/v1/classes/analytics')
    classFillRates.value = classAna.classFillRates || []

    // 3. Fetch academic warnings
    const { data: warnAna } = await api.get('/api/v1/enrollments/analytics')
    academicWarnings.value = warnAna.academicWarnings || []

    // 4. Render Chart
    await nextTick()
    renderRevenueChart(dbData.recentRevenues || [])
  } catch (error) {
    console.error('Error loading admin dashboard:', error)
  } finally {
    loadingClassStats.value = false
  }
}

const renderRevenueChart = (recentRevenues) => {
  if (!revenueChartCanvas.value) return
  if (revenueChart) {
    revenueChart.destroy()
  }

  // Pre-fill 12 months
  const monthlyValues = Array(12).fill(0)
  recentRevenues.forEach(item => {
    const idx = item.month - 1
    if (idx >= 0 && idx < 12) {
      monthlyValues[idx] = item.revenue
    }
  })

  const ctx = revenueChartCanvas.value.getContext('2d')
  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5', 'Th.6', 'Th.7', 'Th.8', 'Th.9', 'Th.10', 'Th.11', 'Th.12'],
      datasets: [
        {
          label: 'Doanh thu (VND)',
          data: monthlyValues,
          fill: true,
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          borderColor: '#16a34a',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#16a34a'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: {
            callback: function(value) {
              if (value >= 1000000) return (value / 1000000).toFixed(0) + 'M'
              if (value >= 1000) return (value / 1000).toFixed(0) + 'K'
              return value
            }
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

// Progress bars coloring helper
const getProgressColor = (rate) => {
  if (rate >= 0.8) return 'bg-emerald-500'
  if (rate >= 0.5) return 'bg-blue-500'
  return 'bg-amber-500'
}

const getTextColor = (rate) => {
  if (rate >= 0.8) return 'text-emerald-600'
  if (rate >= 0.5) return 'text-blue-600'
  return 'text-amber-600'
}

// ----------------------------------------------------
// 2. TEACHER DASHBOARD LOGIC
// ----------------------------------------------------
const loadingTeacherDashboard = ref(false)
const teacherStats = ref({
  classCount: 0,
  totalStudentsTaught: 0,
  sessionsTaughtThisMonth: 0,
  estimatedSalaryThisMonth: 0,
  classes: [],
  recentSlips: []
})
const todaySchedules = ref([])

const loadTeacherDashboard = async () => {
  if (!authStore.isTeacher) return
  loadingTeacherDashboard.value = true
  try {
    const { data } = await api.get('/api/v1/teachers/salary/dashboard-summary')
    teacherStats.value = data

    if (data.classes && data.classes.length > 0) {
      await loadTeacherSchedules(data.classes)
    }
  } catch (error) {
    console.error('Error loading teacher dashboard:', error)
  } finally {
    loadingTeacherDashboard.value = false
  }
}

const loadTeacherSchedules = async (classesList) => {
  try {
    const todayDay = new Date().getDay() // 0 = CN, 1 = T2...
    const promises = classesList.map(c => 
      api.get(`/api/v1/classes/${c.classId}/schedules`)
        .then(res => res.data.map(s => ({ ...s, className: c.className, courseName: c.courseName })))
        .catch(() => [])
    )
    const results = await Promise.all(promises)
    const allSchedules = results.flat()
    todaySchedules.value = allSchedules.filter(s => s.dayOfWeek === todayDay)
  } catch (error) {
    console.error('Error loading schedules:', error)
  }
}

// ----------------------------------------------------
// UTILITIES
// ----------------------------------------------------
const formatCurrency = (val) => {
  if (val === undefined || val === null) return '0 đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const formatShortCurrency = (val) => {
  if (val === undefined || val === null) return '0 đ'
  if (val >= 1000000000) return (val / 1000000000).toFixed(1) + ' tỷ đ'
  if (val >= 1000000) return (val / 1000000).toFixed(1) + ' triệu đ'
  return formatCurrency(val)
}

onMounted(() => {
  loadAdminDashboard()
  loadTeacherDashboard()
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 12px 24px rgba(0, 6, 19, 0.05);
}
.hover-scale {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.hover-scale:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 32px rgba(0, 6, 19, 0.08);
}
.hover-shadow:hover {
  box-shadow: 0 20px 32px rgba(0, 6, 19, 0.08);
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
