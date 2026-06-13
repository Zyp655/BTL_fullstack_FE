<template>
  <div class="space-y-4">
    <!-- Compact Schedule Conflict Warning Banner -->
    <div
      v-if="currentConflicts.length > 0"
      @click="$emit('switch-tab', 'conflicts')"
      class="bg-error/10 hover:bg-error/15 text-error p-4 rounded-xl border border-error/20 flex items-center justify-between gap-3 shadow-sm cursor-pointer transition-colors group animate-scale-in"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-[24px] text-error shrink-0 animate-pulse" style="font-variation-settings: 'FILL' 1;">warning</span>
        <div>
          <p class="font-bold text-body-md">Cảnh báo trùng lịch học!</p>
          <p class="text-body-sm text-on-surface-variant font-medium">
            Có <span class="text-error font-bold">{{ currentConflicts.length }}</span> cặp lớp học đang bị trùng lịch biểu.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 text-body-sm font-semibold text-error shrink-0 group-hover:translate-x-1 transition-transform">
        Xem chi tiết và đổi lớp
        <span class="material-symbols-outlined text-[18px]">chevron_right</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
      <!-- Class List -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <h3 class="font-title-md text-body-lg font-semibold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">school</span>
            Lớp học đã đăng ký
          </h3>
          <button
            v-if="authStore.isAdmin"
            @click="$emit('open-transfer-modal')"
            class="px-3 py-1.5 rounded-lg bg-primary-container/10 hover:bg-primary-container/20 text-primary-container font-semibold text-[12px] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <span class="material-symbols-outlined text-[18px]">swap_horiz</span>
            Chuyển lớp
          </button>
        </div>
        
        <div v-if="enrolledClasses.length === 0" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-8 text-center rounded-xl text-on-surface-variant">
          Bạn chưa đăng ký tham gia lớp học nào.
        </div>

        <div
          v-for="cls in enrolledClasses"
          :key="cls.enrollmentId"
          @click="$emit('select-class', cls)"
          :class="[
            selectedClass?.classId === cls.classId ? 'border-on-tertiary-container bg-white/60 shadow-sm' : 'border-white/40 hover:bg-white/40',
            'bg-white/70 backdrop-blur-[20px] p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center'
          ]"
        >
          <div class="space-y-1 min-w-0 flex-1 mr-3">
            <div class="font-semibold text-primary-container text-body-lg truncate" :title="cls.className">{{ cls.className }}</div>
            <div class="text-body-sm text-on-surface-variant truncate" :title="cls.courseName">Môn học: {{ cls.courseName }}</div>
            <div class="text-body-sm text-on-surface-variant/80">Ngày đăng ký: {{ formatDate(cls.enrolledAt) }}</div>
          </div>
          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <select
              v-if="authStore.isAdmin"
              :value="cls.status"
              @change="$emit('change-enrollment-status', { cls, newStatus: $event.target.value })"
              @click.stop
              class="bg-white/80 border border-outline-variant/30 rounded px-2 py-0.5 text-[11px] font-semibold text-primary cursor-pointer focus:outline-none"
            >
              <option value="DangHoc">Đang học</option>
              <option value="DaXong">Hoàn thành</option>
              <option value="BoHoc">Đã bỏ học</option>
              <option value="PendingPayment">Chờ thanh toán</option>
              <option value="Pending">Chờ duyệt</option>
            </select>
            <span v-else :class="[getEnrollmentStatusClass(cls.status), 'status-badge text-[10px] font-bold']">
              {{ getEnrollmentStatusLabel(cls.status) }}
            </span>
            <span v-if="isClassUnpaid(cls.classId)" class="text-body-sm text-error flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[16px]">lock</span>
              Chưa đóng học phí
            </span>
            <span v-else class="text-body-sm text-on-tertiary-container flex items-center font-semibold">
              Xem lịch học
              <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Details View: Schedule & Attendance for selected class -->
      <div class="space-y-4">
        <!-- 1. Schedule section -->
        <div class="space-y-3">
          <h3 class="font-title-md text-body-lg font-semibold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">calendar_today</span>
            Lịch học chi tiết {{ selectedClass ? `— ${selectedClass.className}` : '' }}
          </h3>

          <div v-if="!selectedClass" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-12 text-center rounded-xl text-on-surface-variant flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-[48px] text-primary-container/30 mb-2">click_to_shrink</span>
            Chọn một lớp bên trái để xem lịch học &amp; chuyên cần.
          </div>

          <!-- Lock schedule if class tuition is unpaid -->
          <div v-else-if="isClassUnpaid(selectedClass.classId)" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-8 text-center rounded-xl text-error flex flex-col items-center justify-center gap-3">
            <span class="material-symbols-outlined text-[48px] text-error/40 animate-pulse">lock</span>
            <div class="font-semibold text-body-lg text-primary-container">Lịch học đã bị khóa</div>
            <p class="text-body-sm text-on-surface-variant max-w-xs mx-auto">
              Bạn chưa hoàn thành đóng học phí cho lớp học này. Vui lòng thanh toán học phí tại tab "Học phí & Thanh toán" để mở khóa xem lịch học.
            </p>
            <button @click="$emit('switch-tab', 'payments')" class="mt-2 px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[18px]">receipt_long</span>
              Đóng học phí ngay
            </button>
          </div>

          <div v-else-if="loadingSchedules" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-12 text-center rounded-xl text-primary-container flex flex-col items-center justify-center">
            <div class="w-8 h-8 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin mb-2"></div>
            Đang tải lịch học...
          </div>

          <div v-else-if="schedules.length === 0" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-8 text-center rounded-xl text-on-surface-variant">
            Không tìm thấy thời khóa biểu cho lớp học này.
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="schedule in schedules"
              :key="schedule.scheduleId"
              class="bg-white/70 backdrop-blur-[20px] border border-white/40 p-3.5 rounded-xl flex justify-between items-center hover:bg-white/50 transition-colors"
            >
              <div class="space-y-1">
                <div class="font-semibold text-primary-container text-body-lg">Thứ {{ formatDayOfWeek(schedule.dayOfWeek) }}</div>
                <div class="text-body-sm text-on-surface-variant">
                  Phòng học: <span class="font-semibold text-primary-container">{{ schedule.classroom }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-on-tertiary-container text-body-sm bg-on-tertiary-container/10 px-2.5 py-1 rounded-lg">
                  {{ schedule.startTime.substring(0, 5) }} - {{ schedule.endTime.substring(0, 5) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Attendance section -->
        <div v-if="selectedClass && !isClassUnpaid(selectedClass.classId) && !loadingSchedules && schedules.length > 0" class="space-y-3 pt-4 border-t border-dashed border-outline-variant/30 animate-fade-in">
          <h3 class="font-title-md text-body-lg font-semibold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-emerald-600">how_to_reg</span>
            Tỷ lệ chuyên cần &amp; Lịch sử điểm danh
          </h3>

          <div v-if="!selectedClassAttendanceSummary" class="bg-white/70 backdrop-blur-[20px] border border-white/40 p-6 text-center rounded-xl text-body-sm text-on-surface-variant">
            Chưa có dữ liệu chuyên cần cho lớp học này.
          </div>

          <div v-else class="bg-white/70 backdrop-blur-[20px] border border-white/40 p-5 rounded-xl space-y-4 shadow-[0_8px_16px_rgba(0,0,0,0.03)]">
            <!-- Attendance Summary Header -->
            <div class="flex justify-between items-center">
              <div>
                <p class="text-body-sm text-on-surface-variant">Tổng số buổi đã học: <strong class="text-primary-container">{{ selectedClassAttendanceSummary.totalSessions }} buổi</strong></p>
              </div>
              <div>
                <span :class="[selectedClassAttendanceSummary.attendanceRate >= 80 ? 'status-inprogress' : 'status-cancelled', 'status-badge text-[11px] font-extrabold']">
                  {{ selectedClassAttendanceSummary.attendanceRate.toFixed(1) }}%
                </span>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden border border-outline-variant/15">
              <div
                :class="[selectedClassAttendanceSummary.attendanceRate >= 80 ? 'bg-emerald-500' : 'bg-red-500', 'h-full rounded-full']"
                :style="`width: ${selectedClassAttendanceSummary.attendanceRate}%`"
              ></div>
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-4 gap-2 text-center text-body-sm">
              <div class="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-600">
                <div class="font-extrabold text-[15px]">{{ selectedClassAttendanceSummary.present }}</div>
                <div class="text-[9px] font-bold">Đi học</div>
              </div>
              <div class="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-600">
                <div class="font-extrabold text-[15px]">{{ selectedClassAttendanceSummary.late }}</div>
                <div class="text-[9px] font-bold">Đi muộn</div>
              </div>
              <div class="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-600">
                <div class="font-extrabold text-[15px]">{{ selectedClassAttendanceSummary.excused }}</div>
                <div class="text-[9px] font-bold">Có phép</div>
              </div>
              <div class="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-500">
                <div class="font-extrabold text-[15px]">{{ selectedClassAttendanceSummary.absent }}</div>
                <div class="text-[9px] font-bold">Vắng mặt</div>
              </div>
            </div>

            <!-- Session details list -->
            <div class="pt-3.5 border-t border-outline-variant/20 space-y-2">
              <div class="text-body-sm font-semibold text-primary-container flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-on-tertiary-container">history</span>
                Nhật ký điểm danh chi tiết
              </div>

              <div v-if="!selectedClassAttendanceSummary.sessions || selectedClassAttendanceSummary.sessions.length === 0" class="text-center py-4 text-body-sm text-on-surface-variant/70 italic">
                Chưa có lịch sử điểm danh nào.
              </div>

              <div v-else class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <div 
                  v-for="session in selectedClassAttendanceSummary.sessions" 
                  :key="session.attendanceId"
                  class="flex justify-between items-center bg-white/40 p-2 rounded-lg text-body-sm border border-white/20 hover:bg-white/60 transition-colors"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="material-symbols-outlined text-[15px] text-on-surface-variant/70 shrink-0">calendar_today</span>
                    <span class="font-semibold text-primary-container shrink-0">{{ formatDate(session.sessionDate) }}</span>
                    <span v-if="session.note" class="text-body-xs text-on-surface-variant/70 italic truncate" :title="session.note">
                      - {{ session.note }}
                    </span>
                  </div>
                  <select
                    v-if="authStore.isAdmin"
                    :value="session.status"
                    @change="$emit('change-attendance-status', { session, newStatus: $event.target.value })"
                    class="bg-white/80 border border-outline-variant/30 rounded px-1.5 py-0.5 text-[11px] font-semibold text-primary cursor-pointer focus:outline-none"
                  >
                    <option value="CoMat">Đi học</option>
                    <option value="Vang">Vắng mặt</option>
                    <option value="DiTre">Đi muộn</option>
                    <option value="CoPhep">Có phép</option>
                  </select>
                  <span v-else :class="[getAttendanceStatusClass(session.status), 'px-2 py-0.5 rounded text-[9px] font-bold shrink-0']">
                    {{ getAttendanceStatusLabel(session.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Support and Transfer Requests List for Student -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-6 rounded-xl space-y-4">
      <div class="flex justify-between items-center border-b border-white/40 pb-2">
        <h4 class="font-title-md text-body-lg font-bold text-primary-container flex items-center gap-2">
          <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">forum</span>
          Yêu cầu hỗ trợ &amp; đổi lớp đã gửi
        </h4>
        <button
          @click="$emit('open-support-dialog')"
          class="px-3 py-1.5 rounded-lg bg-primary-container/10 hover:bg-primary-container/20 text-primary-container font-semibold text-[12px] transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
        >
          <span class="material-symbols-outlined text-[16px]">add</span>
          Gửi yêu cầu mới
        </button>
      </div>
      <div v-if="mySupportMessages.length === 0" class="text-center py-4 text-body-sm text-on-surface-variant font-medium">
        Bạn chưa gửi yêu cầu hỗ trợ nào.
      </div>
      <div v-else class="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        <div v-for="msg in mySupportMessages" :key="msg.id" class="bg-white/50 p-4 rounded-xl border border-white/40 flex flex-col sm:flex-row justify-between gap-3 text-body-sm">
          <div class="space-y-2 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span :class="[getStatusClass(msg.status), 'status-badge text-[10px] font-bold']">
                {{ getStatusLabel(msg.status) }}
              </span>
              <span class="text-body-xs text-on-surface-variant">{{ formatDateTime(msg.createdAt) }}</span>
            </div>
            <div class="text-primary font-medium italic">"{{ msg.message }}"</div>
            <div v-if="msg.fromClassId && msg.toClassId" class="text-body-xs bg-primary-container/5 px-2.5 py-1.5 rounded-lg border border-primary-container/10 inline-flex items-center gap-1.5">
              <strong>{{ msg.fromClassName }}</strong> 
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span> 
              <strong>{{ msg.toClassName }}</strong>
            </div>
            <!-- Rejection Reason (Admin Response) -->
            <div v-if="msg.status === 'Rejected' && msg.adminResponse" class="mt-2 bg-error/5 p-3 rounded-lg border border-error/10 text-body-xs text-error flex items-start gap-2">
              <span class="material-symbols-outlined text-[16px] mt-0.5 shrink-0">info</span>
              <div>
                <span class="font-bold">Lý do từ chối:</span> {{ msg.adminResponse }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../../stores'

const authStore = useAuthStore()

const props = defineProps({
  enrolledClasses: { type: Array, required: true },
  selectedClass: { type: Object, default: null },
  schedules: { type: Array, required: true },
  loadingSchedules: { type: Boolean, default: false },
  payments: { type: Array, required: true },
  mySupportMessages: { type: Array, required: true },
  currentConflicts: { type: Array, required: true },
  attendanceSummaries: { type: Array, default: () => [] }
})

defineEmits([
  'select-class',
  'open-support-conflict',
  'open-transfer-modal',
  'change-enrollment-status',
  'open-support-dialog',
  'switch-tab',
  'change-attendance-status'
])

const selectedClassAttendanceSummary = computed(() => {
  if (!props.selectedClass || !props.attendanceSummaries) return null
  return props.attendanceSummaries.find(s => s.classId === props.selectedClass.classId)
})

function getAttendanceStatusClass(status) {
  const map = {
    CoMat: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    Vang: 'bg-red-500/10 text-red-500 border border-red-500/20',
    DiTre: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    CoPhep: 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
  }
  return map[status] || 'bg-outline-variant/10 text-on-surface-variant'
}

function getAttendanceStatusLabel(status) {
  const map = {
    CoMat: 'Đi học',
    Vang: 'Vắng mặt',
    DiTre: 'Đi muộn',
    CoPhep: 'Có phép'
  }
  return map[status] || status
}

function isClassUnpaid(classId) {
  if (!props.payments) return false
  const payment = props.payments.find(p => p.classId === classId)
  return payment && payment.status === 'ChuaTT'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleString('vi-VN')
}

function formatDayOfWeek(day) {
  const map = { 1: 'Chủ Nhật', 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu', 7: 'Bảy' }
  return map[day] || day
}

function getEnrollmentStatusClass(status) {
  const map = {
    DangHoc: 'status-inprogress',
    DaXong: 'status-completed',
    BoHoc: 'status-cancelled',
    PendingPayment: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    Pending: 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
  }
  return map[status] || 'bg-outline/10 text-on-surface'
}

function getEnrollmentStatusLabel(status) {
  const map = {
    DangHoc: 'Đang học',
    DaXong: 'Hoàn thành',
    BoHoc: 'Đã bỏ học',
    PendingPayment: 'Chờ học phí',
    Pending: 'Chờ duyệt'
  }
  return map[status] || status
}

function getStatusClass(status) {
  const map = {
    Pending: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    Approved: 'status-completed',
    Rejected: 'status-cancelled'
  }
  return map[status] || 'bg-outline/10 text-on-surface'
}

function getStatusLabel(status) {
  const map = {
    Pending: 'Chờ duyệt',
    Approved: 'Đã duyệt',
    Rejected: 'Từ chối'
  }
  return map[status] || status
}
</script>
