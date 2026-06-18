<template>
  <div class="space-y-4 animate-fade-in">
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-6 space-y-4">
      <div class="flex items-center gap-3 text-error border-b border-white/40 pb-3">
        <span class="material-symbols-outlined text-[28px] font-bold" style="font-variation-settings: 'FILL' 1;">warning</span>
        <h3 class="text-lg sm:text-[20px] font-bold text-primary-container">
          Cảnh báo trùng lặp & xung đột học vụ của học viên
        </h3>
      </div>

      <!-- Conflict Tabs -->
      <div class="flex flex-wrap gap-2.5 mb-5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/40 w-fit">
        <button
          @click="activeConflictType = 'time'"
          :class="[
            'px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer border flex items-center gap-1.5',
            activeConflictType === 'time'
              ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
              : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
          ]"
        >
          <span class="material-symbols-outlined text-[16px]">schedule</span>
          Trùng giờ học ({{ groupedConflicts.length }})
        </button>
        <button
          @click="activeConflictType = 'room'"
          :class="[
            'px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer border flex items-center gap-1.5',
            activeConflictType === 'room'
              ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
              : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
          ]"
        >
          <span class="material-symbols-outlined text-[16px]">meeting_room</span>
          Trùng phòng học ({{ roomConflicts.length }})
        </button>
        <button
          @click="activeConflictType = 'course'"
          :class="[
            'px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer border flex items-center gap-1.5',
            activeConflictType === 'course'
              ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
              : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
          ]"
        >
          <span class="material-symbols-outlined text-[16px]">menu_book</span>
          Trùng môn học ({{ courseConflicts.length }})
        </button>
      </div>

      <!-- Tab 1: Trùng giờ học -->
      <div v-if="activeConflictType === 'time'">
        <div v-if="groupedConflicts.length === 0" class="text-center py-8 text-on-surface-variant font-medium text-[15px]">
          Tuyệt vời! Hiện tại bạn không có lịch học nào bị trùng giờ nhau.
        </div>
        <div v-else class="space-y-4">
          <p class="text-[15px] text-on-surface-variant leading-relaxed mb-1">
            Hệ thống phát hiện các lớp dưới đây đang bị trùng khung giờ học với nhau (trùng chéo thời gian từ 1 phút trở lên). Vui lòng bấm <strong>Yêu cầu đổi lớp</strong> bên cạnh lớp học bạn muốn chuyển để Admin hỗ trợ sắp xếp.
          </p>

          <div class="space-y-4">
            <div
              v-for="(group, idx) in groupedConflicts"
              :key="idx"
              class="p-5 bg-rose-500/[0.02] border border-rose-200/50 rounded-xl space-y-4 shadow-sm animate-fade-in"
            >
              <!-- Group Header -->
              <div class="flex items-center justify-between border-b border-rose-100/50 pb-3 flex-wrap gap-2">
                <div class="flex items-center gap-2 text-rose-700">
                  <span class="material-symbols-outlined text-[22px] text-rose-500 font-bold animate-pulse">warning</span>
                  <span class="font-bold text-[16px] sm:text-[17px]">Khung giờ bị trùng: {{ group.slotLabel }}</span>
                </div>
                <span class="bg-rose-100/70 text-rose-800 text-[12px] font-bold px-3 py-1 rounded-full border border-rose-200/50 shadow-sm shrink-0">
                  {{ group.classes.length }} lớp trùng lịch
                </span>
              </div>

              <!-- Classes list in this slot -->
              <div class="space-y-3">
                <div
                  v-for="cls in group.classes"
                  :key="cls.classId"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/70 border border-slate-200/30 rounded-xl hover:bg-white transition-all shadow-sm"
                >
                  <div class="space-y-1 min-w-0">
                    <div class="font-bold text-primary-container text-[16px] sm:text-[17px] flex items-center gap-2">
                      <span class="material-symbols-outlined text-[20px] text-indigo-500 font-semibold">class</span>
                      {{ cls.courseName }}
                    </div>
                    <div class="text-[13px] text-on-surface-variant/70 pl-7 font-semibold">
                      {{ cls.className }}
                    </div>
                  </div>
                  
                  <button
                    @click="$emit('open-support-conflict', { targetClass: cls, conflictClass: { className: getConflictClassNames(cls, group.classes) } })"
                    class="sm:w-auto px-5 py-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 hover:text-indigo-800 font-bold text-[13px] border border-indigo-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                    Yêu cầu đổi lớp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Trùng phòng học -->
      <div v-else-if="activeConflictType === 'room'">
        <div v-if="loadingRoomConflicts" class="flex flex-col items-center justify-center py-12 space-y-2">
          <div class="w-8 h-8 border-4 border-rose-500/30 border-t-rose-600 rounded-full animate-spin"></div>
          <p class="text-body-xs font-semibold text-slate-500">Đang đối soát phòng học toàn hệ thống...</p>
        </div>
        <div v-else-if="roomConflicts.length === 0" class="text-center py-8 text-on-surface-variant font-medium text-[15px]">
          Tuyệt vời! Không có lớp học nào của bạn bị trùng phòng học với lớp khác.
        </div>
        <div v-else class="space-y-4">
          <p class="text-[15px] text-on-surface-variant leading-relaxed mb-1">
            Hệ thống phát hiện lớp học của bạn đang bị xếp trùng phòng học (trùng thời gian và cùng phòng học) với lớp học khác trên hệ thống. Vui lòng báo Admin kiểm tra hoặc bấm <strong>Yêu cầu đổi lớp</strong> để chuyển sang phòng/lớp học khác.
          </p>

          <div class="space-y-4">
            <div
              v-for="(conf, idx) in roomConflicts"
              :key="idx"
              class="p-5 bg-rose-500/[0.02] border border-rose-200/50 rounded-xl space-y-4 shadow-sm animate-fade-in"
            >
              <!-- Group Header -->
              <div class="flex items-center justify-between border-b border-rose-100/50 pb-3 flex-wrap gap-2">
                <div class="flex items-center gap-2 text-rose-800">
                  <span class="material-symbols-outlined text-[22px] text-rose-600 font-bold">meeting_room</span>
                  <span class="font-bold text-[16px] sm:text-[17px]">Trùng tại Phòng: {{ conf.room }} ({{ conf.slotLabel }})</span>
                </div>
                <span class="bg-rose-100/70 text-rose-900 text-[12px] font-bold px-3 py-1 rounded-full border border-rose-200/50 shadow-sm shrink-0">
                  Xung đột phòng
                </span>
              </div>

              <!-- Classes list -->
              <div class="space-y-3">
                <!-- My Class -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-500/[0.02] border border-amber-200/30 rounded-xl shadow-sm">
                  <div class="space-y-1 min-w-0">
                    <div class="font-bold text-amber-800 text-[16px] sm:text-[17px] flex items-center gap-2">
                      <span class="material-symbols-outlined text-[20px] text-amber-600 font-semibold">school</span>
                      {{ conf.myClass.className }} <span class="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">Lớp của bạn</span>
                    </div>
                    <div class="text-[14px] text-on-surface-variant/80 pl-7">
                      Môn học: <span class="font-medium text-slate-700">{{ conf.myClass.courseName }}</span>
                    </div>
                  </div>
                  
                  <button
                    @click="$emit('open-support-conflict', { targetClass: conf.myClass, conflictClass: { className: conf.otherClassObjects.map(o => o.className).join(', ') } })"
                    class="sm:w-auto px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[13px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                    Yêu cầu đổi lớp này
                  </button>
                </div>

                <!-- Opponent Classes -->
                <div
                  v-for="otherCls in conf.otherClassObjects"
                  :key="otherCls.classId"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/70 border border-slate-200/30 rounded-xl hover:bg-white transition-all shadow-sm"
                >
                  <div class="space-y-1 min-w-0">
                    <div class="font-bold text-primary-container text-[16px] sm:text-[17px] flex items-center gap-2">
                      <span class="material-symbols-outlined text-[20px] text-slate-500 font-semibold">meeting_room</span>
                      {{ otherCls.courseName }} <span class="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/50">Lớp trùng phòng</span>
                    </div>
                    <div class="text-[13px] text-on-surface-variant/70 pl-7 font-semibold">
                      {{ otherCls.className }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Trùng môn học -->
      <div v-else-if="activeConflictType === 'course'">
        <div v-if="courseConflicts.length === 0" class="text-center py-8 text-on-surface-variant font-medium text-[15px]">
          Tuyệt vời! Hiện tại bạn không đăng ký trùng môn học nào.
        </div>
        <div v-else class="space-y-4">
          <p class="text-[15px] text-on-surface-variant leading-relaxed mb-1">
            Hệ thống phát hiện bạn đang đăng ký học song song nhiều lớp của cùng một môn học. Vui lòng bấm <strong>Yêu cầu đổi lớp</strong> hoặc liên hệ Admin nếu muốn điều chỉnh.
          </p>

          <div class="space-y-4">
            <div
              v-for="(group, idx) in courseConflicts"
              :key="idx"
              class="p-5 bg-amber-500/[0.02] border border-amber-200/50 rounded-xl space-y-4 shadow-sm animate-fade-in"
            >
              <!-- Group Header -->
              <div class="flex items-center justify-between border-b border-amber-100/50 pb-3 flex-wrap gap-2">
                <div class="flex items-center gap-2 text-amber-850">
                  <span class="material-symbols-outlined text-[22px] text-amber-600 font-bold">menu_book</span>
                  <span class="font-bold text-[16px] sm:text-[17px]">Môn trùng đăng ký: {{ group.courseName }}</span>
                </div>
                <span class="bg-amber-100/70 text-amber-900 text-[12px] font-bold px-3 py-1 rounded-full border border-amber-200/50 shadow-sm shrink-0">
                  {{ group.classes.length }} lớp hoạt động
                </span>
              </div>

              <!-- Classes list -->
              <div class="space-y-3">
                <div
                  v-for="cls in group.classes"
                  :key="cls.classId"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/70 border border-slate-200/30 rounded-xl hover:bg-white transition-all shadow-sm"
                >
                  <div class="space-y-1 min-w-0">
                    <div class="font-bold text-primary-container text-[16px] sm:text-[17px] flex items-center gap-2">
                      <span class="material-symbols-outlined text-[20px] text-amber-500 font-semibold">class</span>
                      {{ cls.className }}
                    </div>
                    <div class="text-[13px] text-on-surface-variant/70 pl-7 font-semibold" v-if="cls.teacherName">
                      Giảng viên: <span class="font-medium text-slate-700">{{ cls.teacherName }}</span>
                    </div>
                  </div>
                  
                  <button
                    @click="$emit('open-support-conflict', { targetClass: cls, conflictClass: { className: getConflictClassNames(cls, group.classes) } })"
                    class="sm:w-auto px-5 py-2.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 text-amber-800 font-bold text-[13px] border border-amber-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                    Yêu cầu đổi lớp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../../services/api'

const props = defineProps({
  currentConflicts: { type: Array, required: true },
  enrolledClasses: { type: Array, required: true }
})

defineEmits(['open-support-conflict'])

const activeConflictType = ref('time')
const allSystemClasses = ref([])
const loadingRoomConflicts = ref(false)

async function fetchAllClasses() {
  loadingRoomConflicts.value = true
  try {
    const res = await api.get('/api/v1/classes', {
      params: { pageSize: 1000 }
    })
    allSystemClasses.value = res.data?.items || []
  } catch (err) {
    console.error('Error fetching all classes for room conflict check:', err)
  } finally {
    loadingRoomConflicts.value = false
  }
}

onMounted(() => {
  fetchAllClasses()
})

function formatDayOfWeek(day) {
  const map = { 1: 'Chủ Nhật', 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu', 7: 'Bảy' }
  return map[day] || day
}

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
  
  const overlapMinutes = Math.min(end1, end2) - Math.max(start1, start2)
  return overlapMinutes >= 1
}

const groupedConflicts = computed(() => {
  const groups = {}
  
  props.currentConflicts.forEach(conf => {
    const day = conf.sessionA.dayOfWeek
    const start = conf.sessionA.startTime.substring(0, 5)
    const end = conf.sessionA.endTime.substring(0, 5)
    const slotStr = `Thứ ${formatDayOfWeek(day)} (${start} - ${end})`
    
    if (!groups[slotStr]) {
      groups[slotStr] = {
        slotLabel: slotStr,
        dayOfWeek: day,
        startTime: start,
        endTime: end,
        classes: new Set(),
        classObjects: []
      }
    }
    
    if (!groups[slotStr].classes.has(conf.classA.classId)) {
      groups[slotStr].classes.add(conf.classA.classId)
      groups[slotStr].classObjects.push(conf.classA)
    }
    if (!groups[slotStr].classes.has(conf.classB.classId)) {
      groups[slotStr].classes.add(conf.classB.classId)
      groups[slotStr].classObjects.push(conf.classB)
    }
  })
  
  return Object.values(groups).map(g => {
    return {
      slotLabel: g.slotLabel,
      classes: g.classObjects
    }
  })
})

const roomConflicts = computed(() => {
  const conflictsMap = {}
  const studentActiveClasses = (props.enrolledClasses || []).filter(c => c.status === 'DangHoc')
  
  studentActiveClasses.forEach(myClass => {
    const sysMyClass = allSystemClasses.value.find(c => c.classId === myClass.classId)
    if (!sysMyClass || !sysMyClass.room || !sysMyClass.schedules || sysMyClass.schedules.length === 0) return
    
    const myRoom = sysMyClass.room.trim()
    if (!myRoom) return
    
    allSystemClasses.value.forEach(otherClass => {
      if (otherClass.classId === myClass.classId) return
      if (otherClass.status !== 'InProgress' && otherClass.status !== 'Opened') return
      if (!otherClass.room || otherClass.room.trim().toLowerCase() !== myRoom.toLowerCase()) return
      if (!otherClass.schedules || otherClass.schedules.length === 0) return
      
      sysMyClass.schedules.forEach(mySched => {
        otherClass.schedules.forEach(otherSched => {
          if (isScheduleConflict(mySched, otherSched)) {
            const day = mySched.dayOfWeek
            const start = mySched.startTime.substring(0, 5)
            const end = mySched.endTime.substring(0, 5)
            const slotStr = `Thứ ${formatDayOfWeek(day)} (${start} - ${end})`
            const key = `${myRoom}-${day}-${start}-${end}`
            
            if (!conflictsMap[key]) {
              conflictsMap[key] = {
                room: myRoom,
                slotLabel: slotStr,
                myClass: sysMyClass,
                otherClasses: new Set(),
                otherClassObjects: []
              }
            }
            
            if (!conflictsMap[key].otherClasses.has(otherClass.classId)) {
              conflictsMap[key].otherClasses.add(otherClass.classId)
              conflictsMap[key].otherClassObjects.push(otherClass)
            }
          }
        })
      })
    })
  })
  
  return Object.values(conflictsMap)
})

const courseConflicts = computed(() => {
  const groups = {}
  const activeClasses = (props.enrolledClasses || []).filter(c => c.status === 'DangHoc')
  
  activeClasses.forEach(cls => {
    if (!cls.courseId) return
    if (!groups[cls.courseId]) {
      groups[cls.courseId] = {
        courseId: cls.courseId,
        courseName: cls.courseName || 'Môn học',
        classes: []
      }
    }
    groups[cls.courseId].classes.push(cls)
  })
  
  return Object.values(groups).filter(g => g.classes.length > 1)
})

function getConflictClassNames(currentClass, allClasses) {
  return allClasses
    .filter(c => c.classId !== currentClass.classId)
    .map(c => c.className)
    .join(', ')
}
</script>
