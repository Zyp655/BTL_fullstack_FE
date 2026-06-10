<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Back Navigation Link -->
    <router-link
      :to="`/classes`"
      class="text-on-tertiary-container hover:underline font-body-sm flex items-center gap-1 w-fit"
    >
      <span class="material-symbols-outlined text-[18px]">arrow_back</span>
      Quay lại danh sách lớp học
    </router-link>

    <!-- Page Header -->
    <div class="flex items-center flex-wrap gap-4 justify-between">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-primary-container">Thời khóa biểu</h1>
        <p class="font-body-lg text-on-surface-variant mt-1" v-if="classInfo">
          Lớp: <strong class="text-primary-container font-semibold">{{ classInfo.className }}</strong> &mdash; Môn học: {{ classInfo.courseName }}
        </p>
      </div>
      <div>
        <button
          @click="openCreateDialog"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-semibold text-[14px] shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          <span class="material-symbols-outlined text-[20px]">add</span>
          Thêm lịch học
        </button>
      </div>
    </div>

    <!-- Class Info Card -->
    <div v-if="classInfo" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm">
        <div class="space-y-1">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Mã lớp học</div>
          <div class="text-[16px] font-bold text-primary-container">{{ classInfo.className }}</div>
        </div>
        <div class="space-y-1">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Giáo viên phụ trách</div>
          <div class="text-[15px] font-semibold text-primary-container">{{ classInfo.teacherName || 'Chưa phân công' }}</div>
        </div>
        <div class="space-y-1">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Phòng học / Link</div>
          <div class="text-[15px] font-semibold text-primary-container">{{ classInfo.room || 'Chưa xếp phòng' }}</div>
        </div>
        <div class="space-y-1">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Trạng thái lớp</div>
          <div class="pt-0.5">
            <span :class="['status-badge', getStatusBadgeClass(classInfo.status)]">
              {{ getStatusLabel(classInfo.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Schedule Table List -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-high text-label-caps font-label-caps text-on-surface-variant uppercase">
              <th class="py-4 px-6 whitespace-nowrap">Thứ</th>
              <th class="py-4 px-6 whitespace-nowrap">Buổi</th>
              <th class="py-4 px-6 whitespace-nowrap">Thời gian học</th>
              <th class="py-4 px-6 whitespace-nowrap text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="font-body-sm text-body-sm divide-y divide-outline-variant/30">
            <tr
              v-for="item in scheduleStore.schedules"
              :key="item.scheduleId"
              class="hover:bg-primary-container/[0.03] transition-colors group cursor-pointer"
              @click="openEditDialog(item)"
            >
              <td class="py-4 px-6">
                <span :class="[getDayBgColor(item.dayOfWeek), 'px-3 py-1 rounded-full text-[12px] font-bold']">
                  {{ item.dayOfWeekName }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span :class="[getSessionBgColor(item.session), 'px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 w-fit']">
                  <span class="material-symbols-outlined text-[14px]">{{ getSessionIcon(item.session) }}</span>
                  {{ getSessionLabel(item.session) }}
                </span>
              </td>
              <td class="py-4 px-6 font-bold text-primary-container">
                {{ item.startTime }} &mdash; {{ item.endTime }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-1.5">
                  <button
                    @click.stop="openEditDialog(item)"
                    class="w-8 h-8 rounded-lg bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container flex items-center justify-center transition-colors cursor-pointer"
                    title="Sửa lịch"
                  >
                    <span class="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button
                    @click.stop="confirmDelete(item)"
                    class="w-8 h-8 rounded-lg bg-error/10 hover:bg-error/20 text-error flex items-center justify-center transition-colors cursor-pointer"
                    title="Xóa lịch"
                  >
                    <span class="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!scheduleStore.loading && scheduleStore.schedules.length === 0">
              <td colspan="4" class="py-12 text-center text-on-surface-variant font-medium">
                <span class="material-symbols-outlined text-primary-container/30 text-[48px] mb-2 block">calendar_today</span>
                Chưa có lịch học nào được thêm cho lớp này.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Weekly View Calendar Grid -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter" v-if="scheduleStore.schedules.length > 0">
      <h3 class="font-bold text-xl text-primary-container mb-5 flex items-center gap-2">
        <span class="material-symbols-outlined text-on-tertiary-container">calendar_view_week</span>
        Lịch tuần học tập
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        <div v-for="day in weekDays" :key="day.value" class="flex flex-col h-full min-h-[120px]">
          <div class="text-center mb-2.5">
            <span
              :class="[
                hasSchedule(day.value) ? 'bg-on-tertiary-container/10 text-on-tertiary-container border border-on-tertiary-container/20 font-bold' : 'bg-primary-container/[0.05] text-on-surface-variant/80 border border-transparent',
                'px-3 py-1 rounded-full text-xs font-semibold block'
              ]"
            >
              {{ day.label }}
            </span>
          </div>
          
          <div class="flex-1 space-y-2">
            <!-- Schedule blocks -->
            <div
              v-for="s in getSchedulesByDay(day.value)"
              :key="s.scheduleId"
              class="p-2.5 rounded-lg border border-on-tertiary-container/15 bg-on-tertiary-container/[0.05] shadow-sm text-center"
            >
              <div class="text-xs font-bold text-primary-container">{{ s.startTime }} - {{ s.endTime }}</div>
              <div class="text-[10px] font-semibold text-on-surface-variant mt-0.5 flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-[12px]">{{ getSessionIcon(s.session) }}</span>
                {{ getSessionLabel(s.session) }}
              </div>
            </div>

            <!-- Rest state -->
            <div
              v-if="!hasSchedule(day.value)"
              class="h-full flex items-center justify-center p-4 rounded-lg border border-dashed border-outline-variant/40 bg-white/20 select-none"
            >
              <span class="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Nghỉ học</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Schedule Dialog Modal -->
    <div v-if="dialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] max-w-md w-full rounded-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col">
        <!-- Title -->
        <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
          <h3 class="font-title-md text-[18px] font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'edit' : 'add_circle' }}</span>
            {{ isEdit ? 'Cập nhật lịch học' : 'Thêm lịch học mới' }}
          </h3>
          <button @click="dialog = false" class="text-on-surface-variant hover:text-primary-container transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Ngày học trong tuần *</label>
            <div class="relative">
              <select
                v-model="formData.dayOfWeek"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary-container bg-transparent focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
              >
                <option v-for="d in weekDays" :key="d.value" :value="d.value">{{ d.label }}</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Buổi học *</label>
            <div class="relative">
              <select
                v-model="formData.session"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary-container bg-transparent focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
              >
                <option v-for="opt in sessionOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Giờ bắt đầu *</label>
              <input
                v-model="formData.startTime"
                type="time"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary-container bg-transparent focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
              />
              <p v-if="validationErrors.startTime" class="text-error text-[11px] font-semibold">{{ validationErrors.startTime }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Giờ kết thúc *</label>
              <input
                v-model="formData.endTime"
                type="time"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary-container bg-transparent focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
              />
              <p v-if="validationErrors.endTime" class="text-error text-[11px] font-semibold">{{ validationErrors.endTime }}</p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
          <button
            @click="dialog = false"
            class="px-5 py-2.5 rounded-lg border border-outline-variant/40 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            @click="saveForm"
            :disabled="saving || !isFormValid"
            class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            {{ isEdit ? 'Cập nhật' : 'Thêm lịch' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-in">
        <div class="flex items-center gap-3 text-error">
          <span class="material-symbols-outlined text-[32px]">warning</span>
          <h3 class="font-title-md text-[18px] font-bold">Xác nhận xóa lịch học</h3>
        </div>
        <p class="text-body-sm text-on-surface-variant leading-relaxed">
          Bạn có chắc chắn muốn xóa buổi lịch học này không? Hành động này sẽ loại bỏ buổi học khỏi thời khóa biểu lớp.
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <button
            @click="deleteDialog = false"
            class="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors"
          >
            Hủy
          </button>
          <button
            @click="doDelete"
            :disabled="deleting"
            class="px-4 py-2 rounded-lg bg-error text-white font-semibold text-[13px] hover:opacity-90 transition-all flex items-center gap-1"
          >
            <span v-if="deleting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            Xóa bỏ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useScheduleStore, useClassStore } from '../../stores'

const route = useRoute()
const scheduleStore = useScheduleStore()
const classStore = useClassStore()
const showSnackbar = inject('showSnackbar')

const classId = parseInt(route.params.id)
const classInfo = ref(null)

const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)

const formData = ref({
  dayOfWeek: 2,
  session: 'Sang',
  startTime: '08:00',
  endTime: '10:00',
})

const weekDays = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 0 },
]

const sessionOptions = [
  { title: '🌅 Sáng', value: 'Sang' },
  { title: '☀️ Chiều', value: 'Chieu' },
  { title: '🌙 Tối', value: 'Toi' },
]

const validationErrors = ref({
  startTime: '',
  endTime: '',
})

const isFormValid = computed(() => {
  return formData.value.startTime.trim().length > 0 &&
         formData.value.endTime.trim().length > 0 &&
         formData.value.startTime < formData.value.endTime
})

watch(() => formData.value.startTime, (val) => {
  validationErrors.value.startTime = val.trim().length === 0 ? 'Giờ bắt đầu không được để trống' : ''
  validateTimeRange()
})

watch(() => formData.value.endTime, (val) => {
  validationErrors.value.endTime = val.trim().length === 0 ? 'Giờ kết thúc không được để trống' : ''
  validateTimeRange()
})

function validateTimeRange() {
  if (formData.value.startTime && formData.value.endTime && formData.value.startTime >= formData.value.endTime) {
    validationErrors.value.endTime = 'Giờ kết thúc phải sau giờ bắt đầu'
  } else if (formData.value.endTime) {
    validationErrors.value.endTime = ''
  }
}

function hasSchedule(day) {
  return scheduleStore.schedules.some(s => s.dayOfWeek === day)
}

function getSchedulesByDay(day) {
  return scheduleStore.schedules.filter(s => s.dayOfWeek === day)
}

function getDayBgColor(day) {
  const colors = {
    0: 'bg-rose-500/10 text-rose-600',
    2: 'bg-primary-container/10 text-primary-container',
    3: 'bg-sky-500/10 text-sky-600',
    4: 'bg-emerald-500/10 text-emerald-600',
    5: 'bg-amber-500/10 text-amber-600',
    6: 'bg-purple-500/10 text-purple-600',
    7: 'bg-teal-500/10 text-teal-600'
  }
  return colors[day] || 'bg-primary-container/10 text-primary-container'
}

function getSessionLabel(session) {
  const map = { Sang: 'Sáng', Chieu: 'Chiều', Toi: 'Tối' }
  return map[session] || session
}

function getSessionIcon(session) {
  const map = { Sang: 'wb_sunny', Chieu: 'cloud_queue', Toi: 'dark_mode' }
  return map[session] || 'schedule'
}

function getSessionBgColor(session) {
  const map = {
    Sang: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    Chieu: 'bg-sky-500/10 text-sky-600 border border-sky-500/20',
    Toi: 'bg-primary-container/10 text-primary-container border border-primary-container/20'
  }
  return map[session] || 'bg-white/40 text-on-surface-variant'
}

function getStatusLabel(status) {
  const map = { Opened: 'Đang tuyển sinh', InProgress: 'Đang học', Completed: 'Hoàn thành', Cancelled: 'Đã hủy' }
  return map[status] || status
}

function getStatusBadgeClass(status) {
  const map = { Opened: 'status-opened', InProgress: 'status-inprogress', Completed: 'status-completed', Cancelled: 'status-cancelled' }
  return map[status] || 'bg-white/40 text-on-surface-variant border border-white/60'
}

function openCreateDialog() {
  isEdit.value = false
  validationErrors.value = { startTime: '', endTime: '' }
  formData.value = { dayOfWeek: 2, session: 'Sang', startTime: '08:00', endTime: '10:00' }
  dialog.value = true
}

function openEditDialog(item) {
  isEdit.value = true
  validationErrors.value = { startTime: '', endTime: '' }
  formData.value = {
    scheduleId: item.scheduleId,
    dayOfWeek: item.dayOfWeek,
    session: item.session,
    startTime: item.startTime,
    endTime: item.endTime,
  }
  dialog.value = true
}

async function saveForm() {
  if (!isFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      await scheduleStore.updateSchedule(classId, formData.value.scheduleId, formData.value)
      showSnackbar('Cập nhật lịch học thành công', 'success')
    } else {
      await scheduleStore.createSchedule(classId, formData.value)
      showSnackbar('Thêm lịch học thành công', 'success')
    }
    dialog.value = false
    await scheduleStore.fetchSchedules(classId)
  } catch (e) {
    showSnackbar('Có lỗi xảy ra khi lưu lịch học', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(item) {
  deleteTarget.value = item
  deleteDialog.value = true
}

async function doDelete() {
  deleting.value = true
  try {
    await scheduleStore.deleteSchedule(classId, deleteTarget.value.scheduleId)
    showSnackbar('Đã xóa lịch học thành công', 'success')
    deleteDialog.value = false
    await scheduleStore.fetchSchedules(classId)
  } catch (e) {
    showSnackbar('Lỗi khi xóa lịch học', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  try {
    classInfo.value = await classStore.getClass(classId)
    await scheduleStore.fetchSchedules(classId)
  } catch (e) {
    showSnackbar('Lỗi tải thông tin lịch học', 'error')
  }
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
