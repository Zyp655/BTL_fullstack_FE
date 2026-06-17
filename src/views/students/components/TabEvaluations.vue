<template>
  <div class="space-y-gutter animate-fade-in">
    <!-- Header Banner -->
    <div class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/40">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
          <span class="material-symbols-outlined text-[32px]">rate_review</span>
        </div>
        <div>
          <h3 class="font-bold text-headline-sm text-slate-800">Khảo sát &amp; Đánh giá Giảng viên</h3>
          <p class="text-body-sm text-slate-500 font-medium mt-0.5">Ý kiến đóng góp của bạn giúp chúng tôi cải thiện chất lượng dịch vụ đào tạo.</p>
        </div>
      </div>
      <div class="flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2 text-xs font-bold text-indigo-600">
        <span class="material-symbols-outlined text-[16px]">verified_user</span>
        Thông tin bảo mật &amp; Đánh giá ẩn danh
      </div>
    </div>

    <!-- Loading Screen -->
    <div v-if="loadingEvaluations" class="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center">
      <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
      <p class="text-sm font-semibold text-slate-600">Đang tải lịch sử đánh giá...</p>
    </div>

    <!-- Class Grid -->
    <div v-else-if="enrolledClasses.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
      <div 
        v-for="cls in enrolledClasses" 
        :key="cls.classId"
        class="glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between"
        :class="[
          getEvaluationForClass(cls.classId)
            ? 'border-emerald-100 bg-emerald-50/[0.04] hover:shadow-md'
            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg hover:scale-[1.01]'
        ]"
      >
        <div class="space-y-4">
          <!-- Class Title and Status -->
          <div class="flex justify-between items-start gap-3">
            <div class="space-y-1">
              <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Môn học</span>
              <h4 class="font-bold text-slate-800 text-body-lg truncate" :title="cls.courseName">
                {{ cls.courseName }}
              </h4>
            </div>
            <span :class="[getEnrollmentStatusClass(cls.status), 'status-badge text-[10px] font-bold']">
              {{ getEnrollmentStatusLabel(cls.status) }}
            </span>
          </div>

          <!-- Course & Register Date -->
          <div class="space-y-2 text-xs font-semibold text-slate-600">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-slate-400">school</span>
              Lớp học: <span class="text-slate-700 font-bold">{{ cls.className }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
              Ngày đăng ký: <span class="text-slate-500 font-bold">{{ formatDate(cls.enrolledAt) }}</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-[1px] bg-slate-100 w-full"></div>

          <!-- Evaluation State -->
          <div v-if="getEvaluationForClass(cls.classId)" class="space-y-3 bg-emerald-50/20 border border-emerald-100/30 rounded-xl p-3.5 animate-fade-in">
            <div class="flex items-center justify-between">
              <span class="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] font-variation-settings-fill text-emerald-600">check_circle</span>
                Đã gửi đánh giá
              </span>
              <!-- Overall rating badge -->
              <span class="bg-amber-400/15 text-amber-700 font-bold text-xs px-2.5 py-0.5 rounded flex items-center gap-1 border border-amber-400/20">
                {{ getEvaluationForClass(cls.classId).rating?.toFixed(1) || '0.0' }}
                <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-amber-500">star</span>
              </span>
            </div>

            <!-- Detailed criteria ratings -->
            <div class="grid grid-cols-2 gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-[11px] font-semibold text-slate-600">
              <div class="flex items-center justify-between bg-white/80 px-2 py-1 rounded border border-slate-100/60">
                <span>Chất lượng dạy:</span>
                <span class="text-amber-600 font-bold flex items-center gap-0.5">
                  {{ getEvaluationForClass(cls.classId).teachingQualityRating }}
                  <span class="material-symbols-outlined text-[11px] font-variation-settings-fill text-amber-500">star</span>
                </span>
              </div>
              <div class="flex items-center justify-between bg-white/80 px-2 py-1 rounded border border-slate-100/60">
                <span>Thái độ hỗ trợ:</span>
                <span class="text-amber-600 font-bold flex items-center gap-0.5">
                  {{ getEvaluationForClass(cls.classId).supportRating }}
                  <span class="material-symbols-outlined text-[11px] font-variation-settings-fill text-amber-500">star</span>
                </span>
              </div>
              <div class="flex items-center justify-between bg-white/80 px-2 py-1 rounded border border-slate-100/60">
                <span>Giáo trình:</span>
                <span class="text-amber-600 font-bold flex items-center gap-0.5">
                  {{ getEvaluationForClass(cls.classId).curriculumRating }}
                  <span class="material-symbols-outlined text-[11px] font-variation-settings-fill text-amber-500">star</span>
                </span>
              </div>
              <div class="flex items-center justify-between bg-white/80 px-2 py-1 rounded border border-slate-100/60">
                <span>Đúng giờ/Tác phong:</span>
                <span class="text-amber-600 font-bold flex items-center gap-0.5">
                  {{ getEvaluationForClass(cls.classId).punctualityRating }}
                  <span class="material-symbols-outlined text-[11px] font-variation-settings-fill text-amber-500">star</span>
                </span>
              </div>
            </div>

            <p v-if="getEvaluationForClass(cls.classId).comment" class="text-xs text-slate-600 font-medium italic bg-white/70 p-2.5 rounded-lg border border-emerald-50">
              "{{ getEvaluationForClass(cls.classId).comment }}"
            </p>
            <div class="text-[10px] text-slate-400 font-semibold text-right">
              Ngày đánh giá: {{ formatDateTime(getEvaluationForClass(cls.classId).createdAt) }}
            </div>
          </div>
          
          <div v-else class="text-center py-2.5 text-xs text-slate-500 font-medium italic">
            Chưa thực hiện khảo sát đánh giá giảng viên cho lớp học này.
          </div>
        </div>

        <!-- Action Button -->
        <div v-if="!getEvaluationForClass(cls.classId)" class="pt-4 flex justify-end">
          <button 
            @click="handleStartEvaluation(cls)"
            :disabled="loadingClassId === cls.classId"
            class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span v-if="loadingClassId === cls.classId" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else class="material-symbols-outlined text-[16px]">rate_review</span>
            Đánh giá
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center border border-white/40">
      <span class="material-symbols-outlined text-[64px] text-slate-300 mb-3">school</span>
      <h4 class="font-bold text-slate-800 text-body-lg">Không có lớp học nào</h4>
      <p class="text-sm text-slate-500 max-w-sm mx-auto mt-1">
        Bạn chưa đăng ký tham gia lớp học nào nên chưa thể thực hiện khảo sát đánh giá giảng viên.
      </p>
    </div>

    <!-- Teacher Evaluation Modal -->
    <ModalTeacherEvaluation
      :show="showEvalModal"
      :class-obj="activeClassObj"
      @close="showEvalModal = false"
      @success="onEvaluationSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../../services/api'
import ModalTeacherEvaluation from './ModalTeacherEvaluation.vue'

const props = defineProps({
  enrolledClasses: { type: Array, required: true }
})

const myEvaluations = ref([])
const loadingEvaluations = ref(false)
const loadingClassId = ref(0)

const showEvalModal = ref(false)
const activeClassObj = ref(null)

onMounted(async () => {
  await loadMyEvaluations()
})

async function loadMyEvaluations() {
  loadingEvaluations.value = true
  try {
    const res = await api.get('/api/v1/teacher-evaluations/my-evaluations')
    myEvaluations.value = res.data || []
  } catch (err) {
    console.error('Error loading my evaluations:', err)
  } finally {
    loadingEvaluations.value = false
  }
}

function getEvaluationForClass(classId) {
  return myEvaluations.value.find(e => e.classId === classId)
}

async function handleStartEvaluation(cls) {
  loadingClassId.value = cls.classId
  try {
    // Fetch class details to get TeacherName
    const res = await api.get(`/api/v1/classes/${cls.classId}`)
    activeClassObj.value = {
      ...cls,
      teacherName: res.data?.teacherName || 'Chưa phân công',
      teacherId: res.data?.teacherId
    }
    showEvalModal.value = true
  } catch (err) {
    console.error('Error fetching class details for evaluation:', err)
  } finally {
    loadingClassId.value = 0
  }
}

function onEvaluationSuccess() {
  showEvalModal.value = false
  loadMyEvaluations()
}

// Helpers
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
</script>

<style scoped>
.font-variation-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
