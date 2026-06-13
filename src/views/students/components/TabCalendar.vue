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
        <div class="flex items-center gap-1.5 bg-white/60 border border-outline-variant/30 px-3 py-1.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <button @click="prevWeek" class="w-8 h-8 rounded-lg hover:bg-primary-container/5 text-primary-container flex items-center justify-center cursor-pointer transition-colors active:scale-90" title="Tuần trước">
            <span class="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span class="text-[12px] font-bold text-primary-container px-2 min-w-[170px] text-center tracking-wide font-mono">
            {{ formattedWeekRange }}
          </span>
          <button @click="nextWeek" class="w-8 h-8 rounded-lg hover:bg-primary-container/5 text-primary-container flex items-center justify-center cursor-pointer transition-colors active:scale-90" title="Tuần sau">
            <span class="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
          <button @click="goToToday" class="ml-1 px-3 py-1 rounded-lg bg-primary-container text-white text-[10px] font-extrabold uppercase hover:bg-primary transition-colors cursor-pointer active:scale-95">
            Hiện tại
          </button>
        </div>

        <!-- Quick stats -->
        <span class="px-3 py-1 bg-primary-container/10 text-primary-container border border-primary-container/20 rounded-full text-body-xs font-semibold">
          Tổng cộng: {{ combinedSchedules.length }} buổi học / tuần
        </span>
      </div>

      <!-- Desktop View: Grid 7 Columns -->
      <div class="hidden lg:grid grid-cols-7 gap-3">
        <div v-for="day in weekDays" :key="day.value" class="flex flex-col min-h-[350px] border border-white/20 rounded-xl bg-white/20 p-2.5">
          <div class="text-center mb-3">
            <span
              :class="[
                getSchedulesForDay(day.value).length > 0 
                  ? 'bg-primary-container text-white font-bold shadow-sm' 
                  : 'bg-primary-container/[0.05] text-on-surface-variant/80 font-semibold',
                'px-2.5 py-1.5 rounded-full text-[10.5px] block uppercase tracking-wide border border-white/40'
              ]"
            >
              {{ day.label }}
              <span class="block text-[8.5px] font-normal opacity-90 mt-0.5">({{ getDayDateString(day.value) }})</span>
            </span>
          </div>

          <div class="flex-1 space-y-2.5 flex flex-col">
            <!-- Schedule blocks -->
            <div
              v-for="s in getSchedulesForDay(day.value)"
              :key="s.scheduleId"
              class="p-3 rounded-xl border border-primary-container/10 bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center justify-between gap-1.5">
                  <div class="text-[11px] font-extrabold text-primary leading-tight line-clamp-1 flex-1" :title="s.className">
                    {{ s.className }}
                  </div>
                  <span :class="[getSessionClass(s.startTime), 'px-1 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider shrink-0']">
                    {{ getSessionLabel(s.startTime) }}
                  </span>
                </div>
                <div class="text-[10px] text-on-surface-variant leading-snug line-clamp-2 mt-1" :title="s.courseName">
                  {{ s.courseName }}
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-outline-variant/30 flex flex-col gap-1">
                <div class="text-body-xs font-bold text-on-tertiary-container flex items-center gap-1">
                  <span class="material-symbols-outlined text-[13px] text-on-tertiary-container">schedule</span>
                  {{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }}
                </div>
                <div class="text-[9px] font-bold text-on-surface-variant/80 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">location_on</span>
                  {{ s.room }}
                </div>
              </div>
            </div>

            <!-- Rest state -->
            <div
              v-if="getSchedulesForDay(day.value).length === 0"
              class="flex-1 flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-outline-variant/40 bg-white/10 select-none"
            >
              <span class="material-symbols-outlined text-on-surface-variant/20 text-[20px] mb-1">hotel</span>
              <span class="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">Nghỉ học</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile / Tablet View: Vertical List of Days -->
      <div class="lg:hidden space-y-4">
        <div
          v-for="day in weekDays"
          :key="day.value"
          class="border border-white/20 rounded-xl bg-white/25 p-4 space-y-3"
        >
          <div class="flex items-center justify-between border-b border-white/30 pb-2">
            <span class="text-body-md font-bold text-primary-container uppercase">{{ day.label }} ({{ getDayDateString(day.value) }})</span>
            <span v-if="getSchedulesForDay(day.value).length === 0" class="text-body-xs text-on-surface-variant/60 font-medium">Nghỉ học</span>
            <span v-else class="px-2.5 py-0.5 bg-primary-container/10 text-primary-container rounded-full text-body-xs font-bold border border-primary-container/20">
              {{ getSchedulesForDay(day.value).length }} buổi học
            </span>
          </div>

          <div v-if="getSchedulesForDay(day.value).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="s in getSchedulesForDay(day.value)"
              :key="s.scheduleId"
              class="p-4 rounded-xl border border-primary-container/10 bg-white/80 shadow-sm flex items-center justify-between gap-3 hover:bg-white transition-colors"
            >
              <div class="space-y-1">
                <div class="text-body-sm font-bold text-primary-container flex items-center gap-2">
                  {{ s.className }}
                  <span :class="[getSessionClass(s.startTime), 'px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider shrink-0']">
                    {{ getSessionLabel(s.startTime) }}
                  </span>
                </div>
                <div class="text-body-xs text-on-surface-variant/80 font-medium">{{ s.courseName }}</div>
                <div class="text-body-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                  <span class="material-symbols-outlined text-[14px]">location_on</span>
                  Phòng: {{ s.room }}
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="inline-block px-3 py-1.5 bg-on-tertiary-container/10 text-on-tertiary-container text-body-xs font-bold rounded-lg">
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
        room: cls.room || s.classroom || 'N/A'
      })
    })
  })
  return result.sort((a, b) => a.startTime.localeCompare(b.startTime))
})

function getSchedulesForDay(dayValue) {
  return combinedSchedules.value.filter(s => s.dayOfWeek === dayValue)
}
</script>
