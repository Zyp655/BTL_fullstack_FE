<template>
  <div v-if="show" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
    <div class="bg-white/95 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-[0_20px_50px_rgba(0,31,63,0.15)] max-w-lg w-full p-6 space-y-5 animate-scale-in flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-bold text-[18px] text-slate-800 flex items-center gap-2">
          <span class="material-symbols-outlined text-indigo-600 text-[26px]">rate_review</span>
          Khảo sát &amp; Đánh giá Giảng viên
        </h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Class Info Banner -->
      <div class="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-3.5 space-y-1">
        <div class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Thông tin lớp học</div>
        <div class="text-sm font-bold text-slate-800">{{ classObj?.className }}</div>
        <div class="text-xs text-slate-500 font-semibold">Môn học: {{ classObj?.courseName }}</div>
        <div class="text-xs text-slate-600 font-bold flex items-center gap-1.5 mt-1.5 bg-white/80 px-2.5 py-1.5 rounded-lg border border-indigo-50/80 inline-flex" v-if="classObj?.teacherName">
          <span class="material-symbols-outlined text-[14px] text-indigo-500">person</span>
          Giảng viên: <span class="text-indigo-600">{{ classObj.teacherName }}</span>
        </div>
      </div>

      <!-- Warning Banner if Locked -->
      <div v-if="!isEvaluationSystemEnabled" class="bg-amber-500/10 border border-amber-500/20 text-amber-700 p-4 rounded-xl flex items-start gap-2.5 animate-fade-in">
        <span class="material-symbols-outlined text-[20px] mt-0.5 shrink-0">lock</span>
        <div>
          <span class="font-bold text-sm">Cổng đánh giá lớp học đang khóa</span>
          <p class="text-xs text-amber-600/95 mt-0.5">Hiện tại lớp học này đang tạm khóa chức năng đánh giá bởi Ban quản lý. Học viên chỉ có thể xem nội dung đánh giá.</p>
        </div>
      </div>

      <!-- Evaluation Form Content (Always rendered, blurred and disabled when locked) -->
      <div :class="[!isEvaluationSystemEnabled ? 'opacity-40 blur-[2px] pointer-events-none select-none' : '', 'space-y-4 flex-1 flex flex-col']">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn số sao cho từng tiêu chí đánh giá *</div>
        
        <div class="space-y-3">
          <div 
            v-for="criterion in criteria" 
            :key="criterion.id" 
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all"
          >
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-700">{{ criterion.label }} *</span>
              <span class="text-[11px] text-slate-400 font-medium leading-relaxed">{{ criterion.desc }}</span>
            </div>
            
            <div class="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
              <!-- Stars -->
              <div class="flex items-center gap-1">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  type="button"
                  @click="criterion.value = star"
                  @mouseover="criterion.hover = star"
                  @mouseleave="criterion.hover = 0"
                  class="text-amber-400 hover:scale-115 active:scale-90 transition-all cursor-pointer p-0.5 focus:outline-none"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    :fill="star <= (criterion.hover || criterion.value) ? 'currentColor' : 'none'" 
                    stroke="currentColor" 
                    stroke-width="1.5" 
                    class="w-6 h-6 transition-colors duration-150"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c.195-.39.743-.39.938 0l2.164 4.329 4.862.68c.433.06.606.582.302.884l-3.535 3.454.846 4.792c.075.428-.386.757-.775.545l-4.394-2.262-4.394 2.262c-.39.212-.85-.117-.775-.545l.846-4.792-3.535-3.454c-.304-.302-.131-.824.302-.884l4.862-.68 2.164-4.329Z" />
                  </svg>
                </button>
              </div>
              
              <!-- Label -->
              <span class="text-xs font-bold text-slate-500 w-24 text-left">
                {{ getRatingLabelShort(criterion.hover || criterion.value) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Real-time Summary Average Rating -->
        <div 
          v-if="averageRating > 0" 
          class="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100/50 rounded-xl p-4 flex items-center justify-between gap-4 animate-fade-in"
        >
          <div class="space-y-0.5">
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Điểm đánh giá trung bình</span>
            <div class="text-[13px] text-slate-500 font-semibold">Tự động tính từ các tiêu chí trên</div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="flex flex-col items-end">
              <span class="text-2xl font-black text-indigo-700 leading-none">{{ averageRating }}</span>
              <span class="text-[10px] font-bold text-slate-400">trên 5.0</span>
            </div>
            <div class="flex items-center justify-center bg-amber-400 text-white rounded-lg p-2 font-bold text-sm shadow-sm">
              <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
            </div>
          </div>
        </div>

        <!-- Comment Textarea -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-700 block">Ý kiến đóng góp khác (tối đa 1000 ký tự)</label>
          <textarea
            v-model="comment"
            rows="3"
            maxlength="1000"
            class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none shadow-inner"
            placeholder="Hãy chia sẻ thêm cảm nghĩ của bạn để trung tâm cải thiện dịch vụ giảng dạy tốt hơn..."
          ></textarea>
          <div class="text-[11px] text-slate-400 text-right font-medium">
            {{ comment.length }}/1000 ký tự
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="text-xs text-red-500 font-bold bg-red-50 border border-red-100 p-2.5 rounded-lg flex items-center gap-1.5 animate-fade-in">
        <span class="material-symbols-outlined text-[16px] shrink-0">error</span>
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          @click="$emit('close')"
          :disabled="submitting"
          class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
        >
          Hủy
        </button>
        <button
          @click="submitEvaluation"
          :disabled="submitting || hasUnratedCriteria || !isEvaluationSystemEnabled"
          class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span v-if="submitting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-0.5"></span>
          Gửi đánh giá
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import api from '../../../services/api'

const props = defineProps({
  show: { type: Boolean, required: true },
  classObj: { type: Object, default: null }
})

const emit = defineEmits(['close', 'success'])

const comment = ref('')
const submitting = ref(false)
const error = ref('')
const criteria = ref([])
const isEvaluationSystemEnabled = ref(true)

async function fetchActiveCriteria() {
  if (!props.classObj?.classId) return
  
  try {
    const [criteriaRes, statusRes] = await Promise.all([
      api.get('/api/v1/teacher-evaluations/criteria'),
      api.get('/api/v1/teacher-evaluations/status', { params: { classId: props.classObj.classId } })
    ])
    
    isEvaluationSystemEnabled.value = statusRes.data?.isEvaluationEnabled ?? true
    criteria.value = (criteriaRes.data || []).map(c => ({
      id: c.id,
      label: c.name,
      desc: c.description,
      value: 0,
      hover: 0
    }))
  } catch (err) {
    console.error('Error fetching active criteria:', err)
    // Fallback if API fails
    criteria.value = [
      { id: 1, label: 'Chất lượng giảng dạy', desc: 'Truyền tải kiến thức, dễ hiểu, nhiệt huyết', value: 0, hover: 0 },
      { id: 2, label: 'Thái độ & Hỗ trợ', desc: 'Tận tình hỗ trợ học viên, giải đáp thắc mắc', value: 0, hover: 0 },
      { id: 3, label: 'Tài liệu & Giáo trình', desc: 'Đầy đủ tài liệu học tập, bài tập, slide', value: 0, hover: 0 },
      { id: 4, label: 'Tác phong & Đúng giờ', desc: 'Vào lớp đúng giờ, chuyên nghiệp, chuẩn mực', value: 0, hover: 0 }
    ]
  }
}

// Calculate real-time average
const averageRating = computed(() => {
  const rated = criteria.value.filter(c => c.value > 0)
  if (rated.length === 0) return 0
  const sum = rated.reduce((acc, c) => acc + c.value, 0)
  return Math.round((sum / rated.length) * 100) / 100
})

const hasUnratedCriteria = computed(() => {
  return criteria.value.length === 0 || criteria.value.some(c => c.value === 0)
})

// Reset state on modal open
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await fetchActiveCriteria()
    comment.value = ''
    error.value = ''
  }
})

function getRatingLabelShort(val) {
  const labels = {
    1: 'Rất tệ (1★)',
    2: 'Tệ (2★)',
    3: 'Bình thường (3★)',
    4: 'Tốt (4★)',
    5: 'Rất tốt (5★)'
  }
  return labels[val] || 'Chưa đánh giá'
}

async function submitEvaluation() {
  if (hasUnratedCriteria.value) {
    error.value = 'Vui lòng hoàn thành đánh giá cho tất cả các tiêu chí.'
    return
  }

  submitting.value = true
  error.value = ''
  
  try {
    const payload = {
      classId: props.classObj.classId,
      comment: comment.value.trim(),
      detailedRatings: criteria.value.map(c => ({
        criterionId: c.id,
        criterionName: c.label,
        rating: c.value
      }))
    }
    
    await api.post('/api/v1/teacher-evaluations', payload)
    emit('success')
  } catch (err) {
    console.error('Error submitting teacher evaluation:', err)
    error.value = err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.glass-backdrop {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
}
</style>
