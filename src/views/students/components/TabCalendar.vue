<template>
  <div class="space-y-4 animate-fade-in">
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-6 shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
      <div class="flex items-center justify-between border-b border-white/40 pb-4 mb-5 flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container">
            <span class="material-symbols-outlined text-[24px]" style="font-variation-settings: 'FILL' 1;">calendar_month</span>
          </div>
          <div>
            <h3 class="font-title-md text-body-lg font-bold text-primary-container">
              Lịch học tuần tổng quát
            </h3>
            <p class="text-body-sm text-on-surface-variant">Thời khóa biểu tổng hợp tất cả các lớp đang học trong tuần</p>
          </div>
        </div>

        <!-- Week Switcher Controls -->
        <div class="flex flex-wrap items-center gap-2 bg-white/60 border border-outline-variant/30 px-3 py-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <button @click="prevWeek" class="w-8 h-8 rounded-lg hover:bg-primary-container/5 text-primary-container flex items-center justify-center cursor-pointer transition-colors active:scale-90" title="Tuần trước">
            <span class="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          
          <div class="flex items-center gap-1.5 bg-primary-container/[0.03] border border-outline-variant/20 rounded-lg px-2 py-1 hover:bg-primary-container/[0.07] transition-all cursor-pointer">
            <span class="material-symbols-outlined text-[16px] text-primary-container">event</span>
            <input 
              type="date" 
              v-model="selectedDatePickerDate" 
              class="bg-transparent text-[11px] font-bold text-primary-container outline-none border-none cursor-pointer font-mono p-0"
              style="color-scheme: light;"
              title="Chọn ngày"
            />
          </div>

          <span class="text-[12px] font-bold text-primary-container px-2 min-w-[170px] text-center tracking-wide font-mono">
            {{ formattedWeekRange }}
          </span>

          <button @click="nextWeek" class="w-8 h-8 rounded-lg hover:bg-primary-container/5 text-primary-container flex items-center justify-center cursor-pointer transition-colors active:scale-90" title="Tuần sau">
            <span class="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>

          <button @click="goToToday" class="ml-1 px-3 py-1.5 rounded-lg bg-primary-container text-white text-[10px] font-extrabold uppercase hover:bg-primary transition-colors cursor-pointer active:scale-95 flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px] text-white">today</span>
            {{ todayLabel }}
          </button>
        </div>

        <!-- Quick stats -->
        <span class="px-3 py-1 bg-primary-container/10 text-primary-container border border-primary-container/20 rounded-full text-body-xs font-semibold">
          Tổng cộng: {{ combinedSchedules.length }} buổi học / tuần
        </span>
      </div>

      <!-- Desktop View: Timetable Grid -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full border-collapse border border-slate-300 text-body-sm bg-white rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.03)]">
          <thead>
            <tr class="bg-[#237f94] text-white">
              <th class="border border-slate-300/40 p-3 text-center font-bold w-28 text-xs uppercase tracking-wider">
                BUỔI
              </th>
              <th 
                v-for="day in weekDays" 
                :key="day.value" 
                class="border border-slate-300/40 p-3 text-center w-40"
              >
                <div class="font-bold text-xs uppercase tracking-wider">{{ day.label }}</div>
                <div class="text-[10px] text-white/85 font-medium mt-0.5">({{ getDayDateString(day.value) }})</div>
              </th>
              <th class="border border-slate-300/40 p-3 text-center font-bold w-24 text-xs uppercase tracking-wider">
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in ['Sáng', 'Chiều', 'Tối']" :key="session" class="hover:bg-slate-50/30">
              <!-- Session Header Cell -->
              <td class="border border-slate-300 p-4 font-bold text-center align-middle bg-slate-50/80 text-slate-800 w-28 uppercase">
                <div class="font-bold text-slate-800 text-[12px] tracking-wide">{{ session }}</div>
                <div class="text-[10px] text-slate-500 font-medium normal-case mt-1">(4 Tiết)</div>
              </td>
              
               <!-- Days Cells -->
              <td 
                v-for="day in weekDays" 
                :key="day.value" 
                class="border border-slate-300 p-3 align-top min-w-[150px] bg-white transition-colors"
              >
                <div class="space-y-2.5 h-full flex flex-col justify-start">
                  <!-- Schedule blocks -->
                  <div
                    v-for="s in getSchedulesForDayAndSession(day.value, session)"
                    :key="s.scheduleId"
                    class="p-2.5 rounded-lg border text-left flex flex-col justify-between relative overflow-hidden transition-all shadow-sm"
                    :class="[
                      isConflicted(s)
                        ? 'border-error/30 bg-error/[0.04]'
                        : 'border-slate-200 bg-[#f8fafc]/85 hover:bg-[#f1f5f9]'
                    ]"
                  >
                    <!-- Alert indicator badge for conflict -->
                    <div 
                      v-if="isConflicted(s)" 
                      class="absolute right-1 top-1 text-error bg-error/10 p-1 rounded-full border border-error/20 z-10 flex items-center justify-center cursor-help transition-all hover:bg-error/20 hover:scale-110" 
                      title="Trùng lịch học"
                    >
                      <span class="material-symbols-outlined text-[11px] animate-pulse" style="font-variation-settings: 'FILL' 1;">warning</span>
                    </div>

                    <div class="space-y-1 text-body-xs">
                      <div class="font-bold text-slate-900 leading-snug line-clamp-2" :class="{ 'text-error': isConflicted(s) }">
                        {{ s.courseName || s.className }}
                      </div>
                      <div class="text-[10px] text-slate-600 font-medium">
                        Phòng: {{ s.room }}
                      </div>
                      <div class="text-[10px] text-slate-650 font-semibold flex items-center gap-0.5">
                        Tiết: {{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }}
                      </div>
                      <div v-if="s.startDate && s.endDate" class="text-[9px] text-slate-500 font-medium">
                        ({{ formatDateRange(s.startDate, s.endDate) }})
                      </div>
                      <div v-if="s.teacherName" class="text-[10px] text-slate-700 font-semibold mt-1">
                        GV: {{ s.teacherName }}
                      </div>
                    </div>
                  </div>

                  <!-- Empty spacer -->
                  <div 
                    v-if="getSchedulesForDayAndSession(day.value, session).length === 0" 
                    class="h-12"
                  ></div>
                </div>
              </td>

              <!-- Ghi chú cell -->
              <td class="border border-slate-300 p-3 bg-white"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile / Tablet View: Vertical List of Days -->
      <div class="lg:hidden space-y-4">
        <div
          v-for="day in weekDays"
          :key="day.value"
          class="border border-white/20 rounded-xl bg-white/25 p-4 space-y-3"
        >
          <div class="flex items-center justify-between border-b border-white/30 pb-2">
            <span class="text-body-md font-bold text-blue-600 uppercase">{{ day.label }} ({{ getDayDateString(day.value) }})</span>
            <span v-if="getSchedulesForDay(day.value).length === 0" class="text-body-xs text-on-surface-variant/60 font-medium">Nghỉ học</span>
            <span v-else class="px-2.5 py-0.5 bg-primary-container/10 text-primary-container rounded-full text-body-xs font-bold border border-primary-container/20">
              {{ getSchedulesForDay(day.value).length }} buổi học
            </span>
          </div>

          <div v-if="getSchedulesForDay(day.value).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="s in getSchedulesForDay(day.value)"
              :key="s.scheduleId"
              class="p-4 rounded-xl border shadow-sm flex items-center justify-between gap-3 transition-colors relative overflow-hidden"
              :class="[
                isConflicted(s)
                  ? 'border-error/30 bg-error/[0.08] hover:bg-error/[0.14]'
                  : 'border-primary-container/10 bg-white/80 hover:bg-white'
              ]"
            >
              <div class="space-y-1">
                <div class="text-body-sm font-bold flex items-center gap-2" :class="isConflicted(s) ? 'text-error' : 'text-primary-container'">
                  {{ s.className }}
                  <span 
                    v-if="isConflicted(s)" 
                    class="p-1 rounded-full bg-error/10 text-error border border-error/25 flex items-center justify-center cursor-help"
                    title="Trùng lịch học"
                  >
                    <span class="material-symbols-outlined text-[11px] animate-pulse" style="font-variation-settings: 'FILL' 1;">warning</span>
                  </span>
                  <span 
                    v-else
                    :class="[getSessionClass(s.startTime), 'px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider shrink-0']"
                  >
                    {{ getSessionLabel(s.startTime) }}
                  </span>
                </div>
                <div class="text-body-xs font-medium" :class="isConflicted(s) ? 'text-error/80' : 'text-on-surface-variant/80'">{{ s.courseName }}</div>
                <div class="text-body-xs flex items-center gap-1.5 mt-1" :class="isConflicted(s) ? 'text-error/70' : 'text-on-surface-variant'">
                  Phòng: {{ s.room }}
                </div>
              </div>
              <div class="text-right shrink-0">
                <span 
                  class="inline-block px-3 py-1.5 text-body-xs font-bold rounded-lg"
                  :class="isConflicted(s) ? 'bg-error/15 text-error' : 'bg-on-tertiary-container/10 text-on-tertiary-container'"
                >
                  {{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  enrolledClasses: { type: Array, required: true },
  enrolledSchedulesMap: { type: Object, required: true }
})

// Sunday value mapped to 1 in database
const weekDays = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 1 }
]

const currentDate = ref(new Date())

// Navigation controls
function prevWeek() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() - 7)
  currentDate.value = d
}

function nextWeek() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + 7)
  currentDate.value = d
}

function goToToday() {
  currentDate.value = new Date()
}

const selectedDatePickerDate = computed({
  get() {
    const d = currentDate.value
    const formatNum = (num) => String(num).padStart(2, '0')
    return `${d.getFullYear()}-${formatNum(d.getMonth() + 1)}-${formatNum(d.getDate())}`
  },
  set(val) {
    if (val) {
      currentDate.value = new Date(val)
    }
  }
})

const todayLabel = computed(() => {
  const today = new Date()
  const formatNum = (num) => String(num).padStart(2, '0')
  return `Hôm nay: ${formatNum(today.getDate())}/${formatNum(today.getMonth() + 1)}/${today.getFullYear()}`
})

const currentWeekRange = computed(() => {
  const today = new Date(currentDate.value)
  const day = today.getDay() // 0 (Sunday) to 6 (Saturday)
  
  // Calculate offset to Monday (index 1) of current week
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diffToMonday)
  
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  
  return { monday, sunday }
})

const formattedWeekRange = computed(() => {
  const mon = currentWeekRange.value.monday
  const sun = currentWeekRange.value.sunday
  const formatNum = (num) => String(num).padStart(2, '0')
  return `Tuần: ${formatNum(mon.getDate())}/${formatNum(mon.getMonth() + 1)} - ${formatNum(sun.getDate())}/${formatNum(sun.getMonth() + 1)}/${sun.getFullYear()}`
})

function getDayDateString(dayValue) {
  const start = new Date(currentWeekRange.value.monday)
  // Monday (2) -> offset 0
  // Tuesday (3) -> offset 1
  // Saturday (7) -> offset 5
  // Sunday (1) -> offset 6
  const offset = dayValue === 1 ? 6 : dayValue - 2
  start.setDate(start.getDate() + offset)
  const formatNum = (num) => String(num).padStart(2, '0')
  return `${formatNum(start.getDate())}/${formatNum(start.getMonth() + 1)}`
}

function getSessionLabel(startTime) {
  if (!startTime) return 'Sáng'
  const hour = parseInt(startTime.split(':')[0], 10)
  if (hour < 12) return 'Sáng'
  if (hour < 18) return 'Chiều'
  return 'Tối'
}

function getSessionClass(startTime) {
  if (!startTime) return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
  const hour = parseInt(startTime.split(':')[0], 10)
  if (hour < 12) {
    return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' // Sáng
  }
  if (hour < 18) {
    return 'bg-amber-500/10 text-amber-600 border border-amber-500/20' // Chiều
  }
  return 'bg-purple-500/10 text-purple-600 border border-purple-500/20' // Tối
}

const combinedSchedules = computed(() => {
  const result = []
  props.enrolledClasses.forEach(cls => {
    if (cls.status !== 'DangHoc') return
    const scheds = props.enrolledSchedulesMap[cls.classId] || []
    scheds.forEach(s => {
      result.push({
        ...s,
        className: cls.className,
        courseName: cls.courseName,
        teacherName: cls.teacherName || '',
        startDate: cls.startDate,
        endDate: cls.endDate,
        room: cls.room || s.classroom || 'N/A'
      })
    })
  })
  return result.sort((a, b) => a.startTime.localeCompare(b.startTime))
})

function getSchedulesForDay(dayValue) {
  return combinedSchedules.value.filter(s => s.dayOfWeek === dayValue)
}

function isConflicted(schedule) {
  const sameDaySchedules = combinedSchedules.value.filter(s => 
    s.dayOfWeek === schedule.dayOfWeek && 
    s !== schedule && 
    s.scheduleId !== schedule.scheduleId
  )
  return sameDaySchedules.some(s => {
    const startA = schedule.startTime
    const endA = schedule.endTime
    const startB = s.startTime
    const endB = s.endTime
    return startA < endB && startB < endA
  })
}

function getSchedulesForDayAndSession(dayValue, sessionKey) {
  return combinedSchedules.value.filter(s => s.dayOfWeek === dayValue && getSessionLabel(s.startTime) === sessionKey)
}

function getSessionIcon(session) {
  if (session === 'Sáng') return 'wb_sunny'
  if (session === 'Chiều') return 'light_mode'
  return 'dark_mode'
}

function getSessionIconClass(session) {
  if (session === 'Sáng') return 'text-emerald-500'
  if (session === 'Chiều') return 'text-amber-500'
  return 'text-purple-500'
}

function getSessionTextColorClass(session) {
  if (session === 'Sáng') return 'text-emerald-700 font-semibold'
  if (session === 'Chiều') return 'text-amber-700 font-semibold'
  return 'text-purple-700 font-semibold'
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return ''
  const formatDateStr = (dateStr) => {
    const date = new Date(dateStr)
    const formatNum = (num) => String(num).padStart(2, '0')
    return `${formatNum(date.getDate())}/${formatNum(date.getMonth() + 1)}/${date.getFullYear()}`
  }
  return `${formatDateStr(startDate)} - ${formatDateStr(endDate)}`
}
</script>
