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
              <div v-if="getConflictDatesStr(group.classes, group.dayOfWeek)" class="px-3 py-2.5 bg-rose-50/80 rounded-lg text-rose-800 text-[13px] font-semibold flex items-center gap-2 mt-1 mb-2 border border-rose-100">
                <span class="material-symbols-outlined text-[16px]">date_range</span>
                Ngày trùng lịch: {{ getConflictDatesStr(group.classes, group.dayOfWeek) }}
              </div>

              <!-- Classes list in this slot -->
              <div class="space-y-3">
                <div
                  v-for="cls in group.classes"
                  :key="cls.classId"
                  @click="$emit('view-in-calendar', cls.classId)"
                  class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 pt-6 bg-white/70 border border-slate-200/30 rounded-xl hover:bg-indigo-50/40 hover:border-indigo-200 cursor-pointer transition-all shadow-sm relative group"
                >
                  <div class="absolute top-2 right-3 text-[10px] text-indigo-500/80 font-bold opacity-0 group-hover:opacity-100 transition-opacity">👆 Nhấn để xem trên lịch</div>
                  <div class="space-y-2 min-w-0 flex-1">
                    <div class="space-y-1">
                      <div class="font-bold text-primary-container text-[16px] sm:text-[17px] flex items-center gap-2">
                        <span class="material-symbols-outlined text-[20px] text-indigo-500 font-semibold">class</span>
                        {{ cls.courseName }}
                      </div>
                      <div class="text-[14px] text-on-surface-variant/80 pl-7 font-semibold">
                        Lớp: {{ cls.className }}
                      </div>
                    </div>
                    <div class="ml-7 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">person</span><span><strong>Giảng viên:</strong> {{ cls.teacherName || 'Chưa phân công' }}</span></div>
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">meeting_room</span><span><strong>Phòng học:</strong> {{ getRoom(cls) }}</span></div>
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">calendar_today</span><span><strong>Thời gian:</strong> {{ formatDate(cls.startDate) }} - {{ formatDate(cls.endDate) }}</span></div>
                      <div class="flex items-start gap-1.5 sm:col-span-2"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">schedule</span><span><strong>Lịch học:</strong> {{ formatSchedules(getSchedules(cls)) }}</span></div>
                    </div>
                  </div>
                  

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
              <div v-if="getConflictDatesStr([conf.myClass, ...conf.otherClassObjects], conf.dayOfWeek)" class="px-3 py-2.5 bg-rose-50/80 rounded-lg text-rose-800 text-[13px] font-semibold flex items-center gap-2 mt-1 mb-2 border border-rose-100">
                <span class="material-symbols-outlined text-[16px]">date_range</span>
                Ngày trùng lịch: {{ getConflictDatesStr([conf.myClass, ...conf.otherClassObjects], conf.dayOfWeek) }}
              </div>

              <!-- Classes list -->
              <div class="space-y-3">
                <!-- My Class -->
                <div 
                  @click="$emit('view-in-calendar', conf.myClass.classId)"
                  class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 pt-6 bg-amber-500/[0.02] hover:bg-amber-500/[0.05] border border-amber-200/30 rounded-xl shadow-sm cursor-pointer transition-all relative group"
                >
                  <div class="absolute top-2 right-3 text-[10px] text-amber-600/80 font-bold opacity-0 group-hover:opacity-100 transition-opacity">👆 Nhấn để xem trên lịch</div>
                  <div class="space-y-2 min-w-0 flex-1">
                    <div class="space-y-1">
                      <div class="font-bold text-amber-800 text-[16px] sm:text-[17px] flex items-center gap-2">
                        <span class="material-symbols-outlined text-[20px] text-amber-600 font-semibold">school</span>
                        {{ conf.myClass.className }} <span class="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">Lớp của bạn</span>
                      </div>
                      <div class="text-[14px] text-on-surface-variant/80 pl-7">
                        Môn học: <span class="font-medium text-slate-700">{{ conf.myClass.courseName }}</span>
                      </div>
                    </div>
                    <div class="ml-7 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-slate-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100/60">
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">person</span><span><strong>Giảng viên:</strong> {{ conf.myClass.teacherName || 'Chưa phân công' }}</span></div>
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">meeting_room</span><span><strong>Phòng học:</strong> {{ getRoom(conf.myClass) }}</span></div>
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">calendar_today</span><span><strong>Thời gian:</strong> {{ formatDate(conf.myClass.startDate) }} - {{ formatDate(conf.myClass.endDate) }}</span></div>
                      <div class="flex items-start gap-1.5 sm:col-span-2"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">schedule</span><span><strong>Lịch học:</strong> {{ formatSchedules(getSchedules(conf.myClass)) }}</span></div>
                    </div>
                  </div>
                  

                </div>

                <!-- Opponent Classes Accordion -->
                <details class="group bg-white/70 border border-slate-200/50 rounded-xl overflow-hidden shadow-sm">
                  <summary class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-all select-none list-none [&::-webkit-details-marker]:hidden">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-slate-400 group-open:rotate-90 transition-transform">chevron_right</span>
                      <span class="font-bold text-[14px] text-slate-700">Và <span class="text-rose-600">{{ conf.otherClassObjects.length }} lớp khác</span> đang được xếp trùng vào phòng này</span>
                    </div>
                  </summary>
                  <div class="p-4 pt-0 border-t border-slate-100 space-y-3 bg-slate-50/50">
                    <div
                      v-for="otherCls in conf.otherClassObjects"
                      :key="otherCls.classId"
                      class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm"
                    >
                      <div class="space-y-2 min-w-0 flex-1">
                        <div class="space-y-1">
                          <div class="font-bold text-primary-container text-[16px] sm:text-[17px] flex items-center gap-2">
                            <span class="material-symbols-outlined text-[20px] text-slate-500 font-semibold">meeting_room</span>
                            {{ otherCls.courseName }} <span class="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/50">Lớp trùng phòng</span>
                          </div>
                          <div class="text-[14px] text-on-surface-variant/80 pl-7 font-semibold">
                            Lớp: {{ otherCls.className }}
                          </div>
                        </div>
                        <div class="ml-7 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                          <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">person</span><span><strong>Giảng viên:</strong> {{ otherCls.teacherName || 'Chưa phân công' }}</span></div>
                          <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">meeting_room</span><span><strong>Phòng học:</strong> {{ getRoom(otherCls) }}</span></div>
                          <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">calendar_today</span><span><strong>Thời gian:</strong> {{ formatDate(otherCls.startDate) }} - {{ formatDate(otherCls.endDate) }}</span></div>
                          <div class="flex items-start gap-1.5 sm:col-span-2"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">schedule</span><span><strong>Lịch học:</strong> {{ formatSchedules(getSchedules(otherCls)) }}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
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
              <div v-if="getConflictDatesStr(group.classes)" class="px-3 py-2.5 bg-amber-50/80 rounded-lg text-amber-800 text-[13px] font-semibold flex items-center gap-2 mt-1 mb-2 border border-amber-100/60">
                <span class="material-symbols-outlined text-[16px]">date_range</span>
                Giai đoạn trùng lặp: {{ getConflictDatesStr(group.classes) }}
              </div>

              <!-- Classes list -->
              <div class="space-y-3">
                <div
                  v-for="cls in group.classes"
                  :key="cls.classId"
                  @click="$emit('view-in-calendar', cls.classId)"
                  class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 pt-6 bg-white/70 border border-slate-200/30 rounded-xl hover:bg-amber-50/40 hover:border-amber-200 cursor-pointer transition-all shadow-sm relative group"
                >
                  <div class="absolute top-2 right-3 text-[10px] text-amber-500/80 font-bold opacity-0 group-hover:opacity-100 transition-opacity">👆 Nhấn để xem trên lịch</div>
                  <div class="space-y-2 min-w-0 flex-1">
                    <div class="font-bold text-primary-container text-[16px] sm:text-[17px] flex items-center gap-2">
                      <span class="material-symbols-outlined text-[20px] text-amber-500 font-semibold">class</span>
                      {{ cls.className }}
                    </div>
                    <div class="ml-7 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">person</span><span><strong>Giảng viên:</strong> {{ cls.teacherName || 'Chưa phân công' }}</span></div>
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">meeting_room</span><span><strong>Phòng học:</strong> {{ getRoom(cls) }}</span></div>
                      <div class="flex items-start gap-1.5"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">calendar_today</span><span><strong>Thời gian:</strong> {{ formatDate(cls.startDate) }} - {{ formatDate(cls.endDate) }}</span></div>
                      <div class="flex items-start gap-1.5 sm:col-span-2"><span class="material-symbols-outlined text-[15px] text-slate-400 mt-0.5">schedule</span><span><strong>Lịch học:</strong> {{ formatSchedules(getSchedules(cls)) }}</span></div>
                    </div>
                  </div>
                  

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

defineEmits(['open-support-conflict', 'view-in-calendar'])

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

function formatDate(dateStr) {
  if (!dateStr) return 'Chưa xác định'
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

function getConflictDatesStr(classes, dayOfWeek) {
  if (!classes || classes.length < 2) return null;
  
  let maxStart = new Date(classes[0].startDate);
  maxStart.setHours(0,0,0,0);
  
  let minEnd = classes[0].endDate ? new Date(classes[0].endDate) : new Date(2100, 0, 1);
  minEnd.setHours(0,0,0,0);
  
  for (let i = 1; i < classes.length; i++) {
    const s = new Date(classes[i].startDate);
    s.setHours(0,0,0,0);
    if (s > maxStart) maxStart = s;
    
    if (classes[i].endDate) {
      const e = new Date(classes[i].endDate);
      e.setHours(0,0,0,0);
      if (e < minEnd) minEnd = e;
    }
  }
  
  if (maxStart > minEnd) return null; 
  
  const dates = [];
  let d = new Date(maxStart);
  
  if (dayOfWeek !== undefined) {
    while (d <= minEnd) {
      const jsDay = d.getDay();
      const mappedDay = jsDay === 0 ? 0 : jsDay + 1; // 0=Sun, 1=Mon->2...
      if (mappedDay === dayOfWeek) {
        while (d <= minEnd) {
          const formatNum = (num) => String(num).padStart(2, '0');
          dates.push(`${formatNum(d.getDate())}/${formatNum(d.getMonth() + 1)}`);
          d.setDate(d.getDate() + 7);
        }
        break;
      }
      d.setDate(d.getDate() + 1);
    }
    if (dates.length === 0) return null; // If no occurrences of dayOfWeek exist in the intersection, there is no conflict
  }
  
  if (dates.length > 0) {
    return dates.join(', ');
  }
  
  const weeks = Math.ceil((minEnd - maxStart) / (7 * 24 * 60 * 60 * 1000));
  return `Từ ${maxStart.toLocaleDateString('vi-VN')} đến ${minEnd.getFullYear() === 2100 ? 'vô thời hạn' : minEnd.toLocaleDateString('vi-VN')} (Khoảng ${weeks > 0 ? weeks : 1} tuần)`;
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

function getRoom(cls) {
  if (cls.room) return cls.room
  const sysClass = allSystemClasses.value.find(c => c.classId === cls.classId)
  return sysClass?.room || 'Chưa xếp phòng'
}

function getSchedules(cls) {
  if (cls.schedules && cls.schedules.length > 0) return cls.schedules
  const sysClass = allSystemClasses.value.find(c => c.classId === cls.classId)
  return sysClass?.schedules || []
}

function formatSchedules(schedules) {
  if (!schedules || schedules.length === 0) return 'Chưa xếp lịch'
  return schedules.map(s => `Thứ ${formatDayOfWeek(s.dayOfWeek)} (${s.startTime.substring(0,5)} - ${s.endTime.substring(0,5)})`).join(', ')
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
      classes: g.classObjects,
      dayOfWeek: g.dayOfWeek
    }
  })
})

const roomConflicts = computed(() => {
  const conflictsMap = {}
  const studentActiveClasses = (props.enrolledClasses || []).filter(c => c.status === 'DangHoc' || c.status === 'ChoMo')
  
  studentActiveClasses.forEach(myClass => {
    const sysMyClass = allSystemClasses.value.find(c => c.classId === myClass.classId)
    if (!sysMyClass || !sysMyClass.room || !sysMyClass.schedules || sysMyClass.schedules.length === 0) return
    
    const myRoom = sysMyClass.room.trim()
    if (!myRoom) return
    
    allSystemClasses.value.forEach(otherClass => {
      if (otherClass.classId === myClass.classId) return
      if (otherClass.status !== 'InProgress' && otherClass.status !== 'Opened') return
      
      // Date range overlap check for room conflict
      const startMy = new Date(sysMyClass.startDate)
      startMy.setHours(0,0,0,0)
      const endMy = sysMyClass.endDate ? new Date(sysMyClass.endDate) : new Date(2100, 0, 1)
      endMy.setHours(23,59,59,999)
      
      const startOther = new Date(otherClass.startDate)
      startOther.setHours(0,0,0,0)
      const endOther = otherClass.endDate ? new Date(otherClass.endDate) : new Date(2100, 0, 1)
      endOther.setHours(23,59,59,999)
      
      if (startMy > endOther || startOther > endMy) return
      
      if (!otherClass.room || otherClass.room.trim().toLowerCase() !== myRoom.toLowerCase()) return
      if (!otherClass.schedules || otherClass.schedules.length === 0) return
      
      sysMyClass.schedules.forEach(mySched => {
        otherClass.schedules.forEach(otherSched => {
          if (isScheduleConflict(mySched, otherSched)) {
            if (classesConflictOnDay(sysMyClass, otherClass, mySched.dayOfWeek)) {
              const day = mySched.dayOfWeek
              const start = mySched.startTime.substring(0, 5)
              const end = mySched.endTime.substring(0, 5)
              const slotStr = `Thứ ${formatDayOfWeek(day)} (${start} - ${end})`
              const key = `${myRoom}-${day}-${start}-${end}`
              
              if (!conflictsMap[key]) {
                conflictsMap[key] = {
                  room: myRoom,
                  slotLabel: slotStr,
                  dayOfWeek: day,
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
          }
        })
      })
    })
  })
  
  return Object.values(conflictsMap)
})

const courseConflicts = computed(() => {
  const groups = {}
  const activeClasses = (props.enrolledClasses || []).filter(c => c.status === 'DangHoc' || c.status === 'ChoMo')
  
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
