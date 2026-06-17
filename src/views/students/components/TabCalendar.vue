<template>
  <div class="space-y-4 animate-fade-in">
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-6 shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
      <!-- Header Section -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 flex-wrap gap-4">
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

      <!-- Calendar Legend -->
      <div class="flex flex-wrap gap-3 items-center bg-slate-50 border border-slate-200/60 px-4 py-2.5 rounded-xl text-[11px] font-bold text-slate-500 mb-5 shadow-inner">
        <span class="text-slate-400 uppercase text-[9px] font-extrabold tracking-wider shrink-0">Chú thích lịch:</span>
        <div class="flex items-center gap-1.5 bg-white border border-slate-200/50 px-2.5 py-1 rounded-md shadow-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span>
          <span class="text-indigo-900">Lịch thường</span>
        </div>
        <div class="flex items-center gap-1.5 bg-white border border-slate-200/50 px-2.5 py-1 rounded-md shadow-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-pulse"></span>
          <span class="text-red-700 font-bold">Trùng lịch</span>
        </div>
        <div class="flex items-center gap-1.5 bg-white border border-slate-200/50 px-2.5 py-1 rounded-md shadow-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          <span class="text-amber-700 font-bold">Đang xin chuyển</span>
        </div>
      </div>

      <!-- Desktop View: Timetable Grid -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="calendar-grid-table w-full border-collapse border border-slate-300 text-body-sm bg-white rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <thead>
            <tr class="bg-[#281545] text-white">
              <th class="border border-slate-300 p-3.5 text-center font-bold w-28 text-[11px] uppercase tracking-wider bg-slate-900/90">
                BUỔI
              </th>
              <th 
                v-for="day in weekDays" 
                :key="day.value" 
                :class="[
                  isToday(day.value) ? 'bg-indigo-950 text-white font-extrabold border-2 border-indigo-400' : 'border border-slate-300 bg-[#281545]',
                  'p-3.5 text-center w-40'
                ]"
              >
                <div class="font-extrabold text-[12px] uppercase tracking-wider flex items-center justify-center gap-1">
                  {{ day.label.toUpperCase() }}
                  <span v-if="isToday(day.value)" class="px-1.5 py-0.5 rounded bg-indigo-500 text-[8px] uppercase tracking-normal font-sans font-bold">Hôm nay</span>
                </div>
                <div class="text-[10px] text-white/80 font-mono font-bold mt-0.5">({{ getDayDateString(day.value) }})</div>
              </th>
              <th class="border border-slate-300 p-3.5 text-center font-bold w-24 text-[11px] uppercase tracking-wider bg-slate-900/90">
                GHI CHÚ
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-300">
            <tr v-for="session in ['Sáng', 'Chiều', 'Tối']" :key="session" class="hover:bg-slate-50/20">
              <!-- Session Header Cell -->
              <td class="border border-slate-300 p-4 font-bold text-center align-middle bg-slate-50/60 text-slate-800 w-28 uppercase">
                <div class="font-extrabold text-slate-800 text-[11px] tracking-wider flex items-center justify-center gap-1">
                  <span class="material-symbols-outlined text-[16px]" :class="getSessionIconClass(session)">{{ getSessionIcon(session) }}</span>
                  {{ session }}
                </div>
                <div class="text-[9px] text-slate-400 font-bold mt-1">(4 Tiết)</div>
              </td>
              
               <!-- Days Cells -->
              <td 
                v-for="day in weekDays" 
                :key="day.value" 
                :class="[
                  isToday(day.value) ? 'bg-indigo-50/10 border-x-2 border-x-indigo-400/30 shadow-inner' : 'bg-white',
                  'border border-slate-300 p-2.5 align-top min-w-[170px]'
                ]"
              >
                <div class="h-full min-h-[120px] flex flex-col justify-start items-stretch gap-2.5">
                  <!-- Schedule blocks -->
                  <div
                    v-for="s in getSchedulesForDayAndSession(day.value, session)"
                    :key="s.scheduleId"
                    @click="showDetailsModal(s, day.value)"
                    :class="[
                      isPendingTransfer(s)
                        ? 'bg-amber-50/90 border-l-4 border-l-amber-500 border-amber-500 text-amber-900 shadow-sm shadow-amber-100/50'
                        : isConflicted(s)
                          ? 'bg-red-50/90 border-l-4 border-l-red-500 border-red-500 text-red-900 shadow-sm shadow-red-100/50'
                          : isTransferred(s)
                            ? 'bg-emerald-50/90 border-l-4 border-l-emerald-500 border-emerald-500 text-emerald-900 shadow-sm shadow-emerald-100/50'
                            : 'bg-indigo-50/40 border-l-4 border-l-indigo-500 border-indigo-400 text-indigo-900 shadow-sm',
                      'w-full p-3 rounded-lg border-2 text-left space-y-1.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative overflow-hidden'
                    ]"
                  >
                    <!-- Warning / Status Badge -->
                    <div class="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider shrink-0">
                      <span v-if="isPendingTransfer(s)" class="text-amber-600 flex items-center gap-0.5">
                        <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-amber-500">pending_actions</span>
                        Đang chuyển lớp
                      </span>
                      <span v-else-if="isConflicted(s)" class="text-red-600 flex items-center gap-0.5">
                        <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-red-500">warning</span>
                        Trùng lịch!
                      </span>
                      <span v-else-if="isTransferred(s)" class="text-emerald-600 flex items-center gap-0.5">
                        <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-emerald-500">check_circle</span>
                        Đã chuyển đến
                      </span>
                    </div>

                    <!-- Course/Class Name -->
                    <div class="text-[12px] font-extrabold leading-tight text-slate-800">
                      {{ s.courseName }}
                    </div>
                    <div class="text-[10px] opacity-75 font-semibold truncate text-slate-500" :title="s.className">
                      {{ s.className }}
                    </div>

                    <!-- Room & Slot Info -->
                    <div class="text-[10px] opacity-75 font-semibold flex items-center gap-1 text-slate-600">
                      <span class="material-symbols-outlined text-[12px] shrink-0">meeting_room</span>
                      <span>{{ formatRoom(s.room) }}</span>
                    </div>
                    <div class="text-[10px] opacity-75 font-semibold flex items-center gap-1 text-slate-600">
                      <span class="material-symbols-outlined text-[12px] shrink-0">schedule</span>
                      <span>Tiết {{ getLessonRange(s.startTime, s.endTime) }} ({{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }})</span>
                    </div>

                    <!-- Teacher Name -->
                    <div v-if="s.teacherName" class="text-[10px] opacity-85 font-bold text-indigo-950 flex items-center gap-1 border-t border-slate-100 pt-1.5 mt-1">
                      <span class="material-symbols-outlined text-[12px] shrink-0">person</span>
                      <span>GV: {{ s.teacherName }}</span>
                    </div>
                  </div>
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
          :class="[
            isToday(day.value) ? 'border-2 border-indigo-400 bg-indigo-50/10' : 'border border-slate-200 bg-slate-50/40',
            'rounded-xl p-4 space-y-3'
          ]"
        >
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <span class="text-body-md font-bold text-blue-600 uppercase flex items-center gap-1">
              {{ day.label }} ({{ getDayDateString(day.value) }})
              <span v-if="isToday(day.value)" class="px-1.5 py-0.5 rounded bg-indigo-500 text-[8px] text-white uppercase font-sans">Hôm nay</span>
            </span>
            <span v-if="getSchedulesForDay(day.value).length === 0" class="text-body-xs text-on-surface-variant/60 font-medium">Nghỉ học</span>
            <span v-else class="px-2.5 py-0.5 bg-primary-container/10 text-primary-container rounded-full text-body-xs font-bold border border-primary-container/20">
              {{ getSchedulesForDay(day.value).length }} buổi học
            </span>
          </div>

          <div v-if="getSchedulesForDay(day.value).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="s in getSchedulesForDay(day.value)"
              :key="s.scheduleId"
              @click="showDetailsModal(s, day.value)"
              :class="[
                isPendingTransfer(s)
                  ? 'bg-amber-50 border-l-4 border-l-amber-500 border-amber-500 text-amber-900 shadow-sm'
                  : isConflicted(s)
                    ? 'bg-red-50 border-l-4 border-l-red-500 border-red-500 text-red-900 shadow-sm'
                    : isTransferred(s)
                      ? 'bg-emerald-50 border-l-4 border-l-emerald-500 border-emerald-500 text-emerald-900 shadow-sm'
                      : 'bg-indigo-50/50 border-l-4 border-l-indigo-500 border-indigo-400 text-indigo-900 shadow-sm',
                'p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors relative overflow-hidden cursor-pointer'
              ]"
            >
              <div class="space-y-1 flex-1">
                <div class="flex items-center gap-2 flex-wrap text-body-sm font-bold">
                  {{ s.courseName }}
                  <span :class="[getSessionClass(s.startTime), 'px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider shrink-0']">
                    {{ getSessionLabel(s.startTime) }}
                  </span>
                  <!-- Badges for mobile -->
                  <span v-if="isPendingTransfer(s)" class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[8px] font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-0.5 border border-amber-200">
                    ⏳ Chờ chuyển lớp
                  </span>
                  <span v-else-if="isConflicted(s)" class="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[8px] font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-0.5 border border-red-200 animate-pulse">
                    ⚠️ Trùng lịch!
                  </span>
                  <span v-else-if="isTransferred(s)" class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[8px] font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-0.5 border border-emerald-200">
                    ✅ Đã chuyển đến
                  </span>
                </div>
                <div class="text-body-xs font-semibold opacity-85 text-slate-500">{{ s.className }}</div>
                <div class="text-body-xs flex items-center gap-1 opacity-75 mt-1 font-semibold text-slate-600">
                  <span class="material-symbols-outlined text-[14px]">meeting_room</span>
                  <span>{{ formatRoom(s.room) }}</span>
                </div>
                <div v-if="s.teacherName" class="text-body-xs flex items-center gap-1 opacity-75 font-semibold text-slate-650">
                  <span class="material-symbols-outlined text-[14px]">person</span>
                  <span>Giảng viên: {{ s.teacherName }}</span>
                </div>
              </div>
              <div class="text-right shrink-0 flex sm:flex-col justify-between items-center sm:items-end gap-1.5">
                <span class="px-2.5 py-1 text-body-xs font-extrabold rounded-lg bg-white/70 shadow-xs border border-slate-200/50 text-slate-800">
                  {{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }}
                </span>
                <span class="text-[9px] font-bold opacity-60 font-mono">
                  Tiết {{ getLessonRange(s.startTime, s.endTime) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Details Modal -->
    <teleport to="body">
      <div v-if="detailsModalOpen" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/95 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-[0_20px_50px_rgba(0,31,63,0.15)] max-w-md w-full overflow-hidden animate-scale-in flex flex-col">
          <!-- Banner Image Slider/Header -->
          <div class="h-44 overflow-hidden relative bg-slate-100 flex items-center justify-center shrink-0">
            <template v-if="activeCourseDetails && getCourseImages(activeCourseDetails.imageUrl, activeCourseDetails.category).length > 0">
              <img
                :src="getCourseImages(activeCourseDetails.imageUrl, activeCourseDetails.category)[0]"
                class="w-full h-full object-cover"
                alt="Course Banner Image"
              />
            </template>
            <template v-else>
              <img
                :src="defaultImg"
                class="w-full h-full object-cover"
                alt="Course Banner Image Default"
              />
            </template>
            <!-- Close button on top of image -->
            <button @click="closeDetailsModal" class="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 focus:outline-none">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <!-- Content Wrapper -->
          <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <!-- Conflict Warning Banner in Modal -->
            <div
              v-if="activeDetailsSchedule && isConflicted(activeDetailsSchedule)"
              class="bg-error/10 border border-error/20 p-3.5 rounded-xl flex flex-col gap-2.5 shadow-xs text-error animate-fade-in"
            >
              <div class="flex items-start gap-2 min-w-0">
                <span class="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5 animate-pulse" style="font-variation-settings: 'FILL' 1;">warning</span>
                <div class="text-[13px] leading-relaxed text-error flex-1">
                  <span class="font-bold block text-[13.5px]">Lớp bị trùng lịch học!</span>
                  <span class="text-on-surface-variant font-medium text-[12px] block mt-0.5">
                    Lớp này đang bị trùng lịch với lớp khác trong tuần. Bạn có thể gửi yêu cầu hỗ trợ đổi lịch để sắp xếp lại lớp học.
                  </span>
                </div>
              </div>
              <button
                @click="handleSupportConflictFromCalendar"
                class="w-full py-2 rounded-lg bg-error hover:bg-error/90 text-white font-bold text-[12px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm animate-pulse"
              >
                <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
                Gửi yêu cầu hỗ trợ đổi lớp
              </button>
            </div>

            <!-- Class & Course Title -->
            <div class="space-y-1">
              <div class="text-[11px] text-indigo-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">school</span>
                Lớp: {{ activeDetailsSchedule?.className }}
              </div>
              <h3 class="text-base font-black text-slate-800 leading-tight">
                {{ activeDetailsSchedule?.courseName }}
              </h3>
            </div>

            <!-- Course Description if available -->
            <div v-if="activeCourseDetails?.description" class="bg-indigo-50/30 p-3 rounded-lg border border-indigo-100/30 text-body-xs text-slate-600 leading-relaxed">
              <span class="font-bold text-slate-700 block mb-0.5 uppercase text-[10px] tracking-wider">Mô tả môn học</span>
              {{ activeCourseDetails.description }}
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 gap-2.5">
              <!-- Giảng viên -->
              <div class="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <span class="material-symbols-outlined text-indigo-500 text-[20px]">person</span>
                <div class="text-xs">
                  <span class="font-semibold text-slate-400 block text-[9px] uppercase tracking-wider">Giảng viên</span>
                  <span class="font-bold text-slate-800">{{ activeDetailsSchedule?.teacherName || 'Chưa phân công' }}</span>
                </div>
              </div>

              <!-- Ngày học -->
              <div class="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <span class="material-symbols-outlined text-indigo-500 text-[20px]">calendar_today</span>
                <div class="text-xs">
                  <span class="font-semibold text-slate-400 block text-[9px] uppercase tracking-wider">Ngày học</span>
                  <span class="font-bold text-slate-800">Thứ {{ formatDayOfWeek(activeDetailsSchedule?.dayOfWeek) }} ({{ activeDetailsScheduleDate }})</span>
                </div>
              </div>

              <!-- Giờ học -->
              <div class="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <span class="material-symbols-outlined text-indigo-500 text-[20px]">schedule</span>
                <div class="text-xs">
                  <span class="font-semibold text-slate-400 block text-[9px] uppercase tracking-wider">Giờ học</span>
                  <span class="font-bold text-slate-800">
                    {{ activeDetailsSchedule?.startTime.substring(0, 5) }} - {{ activeDetailsSchedule?.endTime.substring(0, 5) }} 
                    <span class="text-slate-400 font-medium">(Tiết {{ getLessonRange(activeDetailsSchedule?.startTime, activeDetailsSchedule?.endTime) }})</span>
                  </span>
                </div>
              </div>

              <!-- Phòng học -->
              <div class="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <span class="material-symbols-outlined text-indigo-500 text-[20px]">meeting_room</span>
                <div class="text-xs">
                  <span class="font-semibold text-slate-400 block text-[9px] uppercase tracking-wider">Phòng học</span>
                  <span class="font-bold text-slate-800">{{ formatRoom(activeDetailsSchedule?.room) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
            <button 
              @click="closeDetailsModal"
              class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs hover:shadow-md transition-all cursor-pointer active:scale-95 border-0"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from '../../../stores'
import foreignLanguageImg from '../../../assets/course_foreign_language.png'
import itImg from '../../../assets/course_it.png'
import skillsImg from '../../../assets/course_skills.png'
import defaultImg from '../../../assets/course_default.png'
import artImg from '../../../assets/course_art.png'
import scienceImg from '../../../assets/course_science.png'

const props = defineProps({
  enrolledClasses: { type: Array, required: true },
  enrolledSchedulesMap: { type: Object, required: true },
  mySupportMessages: { type: Array, default: () => [] }
})

const emit = defineEmits(['open-support-conflict'])

const courseStore = useCourseStore()

onMounted(async () => {
  try {
    await courseStore.fetchCourses({ page: 1, pageSize: 1000 })
  } catch (e) {
    console.error('Error fetching courses for calendar details:', e)
  }
})

const activeCourseDetails = computed(() => {
  if (!activeDetailsSchedule.value || !courseStore.courses) return null
  return courseStore.courses.find(c => c.courseId === activeDetailsSchedule.value.courseId)
})

function getCourseImages(imageUrl, cat) {
  if (!imageUrl) {
    const map = {
      NgoaiNgu: [foreignLanguageImg],
      TinHoc: [itImg],
      KyNang: [skillsImg]
    }
    return map[cat] || [defaultImg]
  }
  return imageUrl.split('|').filter(Boolean).map(url => {
    if (url === 'preset_foreign_language') return foreignLanguageImg
    if (url === 'preset_it') return itImg
    if (url === 'preset_skills') return skillsImg
    if (url === 'preset_art') return artImg
    if (url === 'preset_science') return scienceImg
    if (url === 'preset_default') return defaultImg
    return url
  })
}

// Sunday value mapped to 1 in database
const weekDays = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 0 }
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
  const offset = dayValue === 0 ? 6 : dayValue - 2
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
        classId: cls.classId,
        className: cls.className,
        courseName: cls.courseName,
        courseId: cls.courseId,
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

function isPendingTransfer(schedule) {
  return props.mySupportMessages.some(m => 
    m.fromClassId == schedule.classId && 
    m.status === 'Pending'
  )
}

// Lịch học của lớp đã được chuyển đến thành công
function isTransferred(schedule) {
  return props.mySupportMessages.some(m => 
    m.toClassId == schedule.classId && 
    m.status === 'Resolved'
  )
}

// Kiểm tra xem có phải ngày hôm nay trong tuần được chọn không
function isToday(dayValue) {
  const today = new Date()
  const currentMon = new Date(currentWeekRange.value.monday)
  const offset = dayValue === 0 ? 6 : dayValue - 2
  currentMon.setDate(currentMon.getDate() + offset)
  
  return today.getDate() === currentMon.getDate() &&
         today.getMonth() === currentMon.getMonth() &&
         today.getFullYear() === currentMon.getFullYear()
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

function getLessonRange(startTime, endTime) {
  if (!startTime) return '1 - 5'
  const hour = parseInt(startTime.split(':')[0], 10)
  if (hour < 12) return '1 - 5'
  if (hour < 18) return '6 - 10'
  return '11 - 13'
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

// Details Modal State & Logic
const detailsModalOpen = ref(false)
const activeDetailsSchedule = ref(null)
const activeDetailsScheduleDate = ref('')

function showDetailsModal(schedule, dayValue) {
  activeDetailsSchedule.value = schedule
  activeDetailsScheduleDate.value = getScheduleDate(dayValue)
  detailsModalOpen.value = true
}

function closeDetailsModal() {
  detailsModalOpen.value = false
  activeDetailsSchedule.value = null
  activeDetailsScheduleDate.value = ''
}

function handleSupportConflictFromCalendar() {
  if (!activeDetailsSchedule.value) return
  
  // Find conflicting class
  const sameDaySchedules = combinedSchedules.value.filter(s => 
    s.dayOfWeek === activeDetailsSchedule.value.dayOfWeek && 
    s !== activeDetailsSchedule.value && 
    s.scheduleId !== activeDetailsSchedule.value.scheduleId
  )
  const conflictClass = sameDaySchedules.find(s => {
    const startA = activeDetailsSchedule.value.startTime
    const endA = activeDetailsSchedule.value.endTime
    const startB = s.startTime
    const endB = s.endTime
    return startA < endB && startB < endA
  })
  
  emit('open-support-conflict', { 
    targetClass: activeDetailsSchedule.value, 
    conflictClass: conflictClass || { className: 'Lớp khác' } 
  })
  
  closeDetailsModal()
}

function getScheduleDate(dayValue) {
  const start = new Date(currentWeekRange.value.monday)
  const offset = dayValue === 1 ? 6 : dayValue - 2
  start.setDate(start.getDate() + offset)
  const formatNum = (num) => String(num).padStart(2, '0')
  return `${formatNum(start.getDate())}/${formatNum(start.getMonth() + 1)}/${start.getFullYear()}`
}

function formatDayOfWeek(day) {
  const map = { 1: 'Chủ Nhật', 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu', 7: 'Bảy' }
  return map[day] || day
}

function formatRoom(roomStr) {
  if (!roomStr || roomStr === 'N/A') return 'Chưa xếp phòng'
  const trimmed = roomStr.trim()
  if (trimmed.startsWith('Phòng') || trimmed.startsWith('P.') || trimmed.startsWith('R.')) {
    return trimmed
  }
  return 'Phòng ' + trimmed
}
</script>

<style scoped>
th, td {
  transition: all 0.2s ease;
}
</style>

<style>
/* Global styles for the calendar schedule table to guarantee visible borders in all browsers */
.calendar-grid-table {
  border-collapse: collapse !important;
  border: 2px solid #94a3b8 !important; /* Slate 400 */
  width: 100% !important;
  empty-cells: show !important;
}

.calendar-grid-table th,
.calendar-grid-table td {
  border: 1.5px solid #cbd5e1 !important; /* Slate 300 */
  border-style: solid !important;
}

.calendar-grid-table th {
  border-bottom: 2.5px solid #94a3b8 !important;
}
</style>
