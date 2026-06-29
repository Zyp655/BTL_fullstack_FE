<template>
  <div class="p-gutter min-h-screen bg-slate-900 text-slate-100 flex flex-col gap-6">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-md">
          <span class="material-symbols-outlined text-white text-[32px]">code_blocks</span>
        </div>
        <div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">AI Coding Playground</h2>
          <p class="text-indigo-100 text-body-sm mt-1">Luyện tập lập trình không giới hạn với đề bài và chấm điểm tự động sinh bởi Google Gemini AI.</p>
        </div>
      </div>
    </div>

    <!-- AI Config & Controls -->
    <div class="bg-slate-800/80 border border-slate-700/50 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row items-end gap-4 shadow-lg">
      <div class="flex-1 w-full space-y-1.5">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chủ đề lập trình</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">terminal</span>
          <input
            v-model="topic"
            class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-body-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Ví dụ: Vòng lặp, Đệ quy, Sắp xếp mảng, Chuỗi..."
            type="text"
            :disabled="generating"
          />
        </div>
      </div>

      <div class="w-full sm:w-[180px] space-y-1.5">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ngôn ngữ</label>
        <div class="relative">
          <select
            v-model="language"
            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-body-sm text-slate-100 cursor-pointer focus:outline-none focus:border-indigo-500 appearance-none font-semibold transition-colors"
            :disabled="generating"
          >
            <option value="JavaScript">JavaScript (ES6)</option>
            <option value="Python">Python 3</option>
            <option value="C#">C# (Csharp)</option>
          </select>
          <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-[18px]">expand_more</span>
        </div>
      </div>

      <button
        @click="generateChallenge"
        :disabled="generating || !topic.trim()"
        class="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-body-sm rounded-xl transition-all cursor-pointer active:scale-95 shadow-md shadow-indigo-950 flex items-center justify-center gap-2 border-0"
      >
        <span v-if="generating" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
        <span v-else class="material-symbols-outlined text-[18px]">auto_awesome</span>
        Tạo đề bài bằng AI
      </button>
    </div>

    <!-- Main Workspace (Split View) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
      
      <!-- Left Panel: Problem Description -->
      <div class="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-6 flex flex-col gap-4 shadow-md overflow-y-auto max-h-[700px]">
        <div class="border-b border-slate-700 pb-3 flex justify-between items-center">
          <h3 class="text-lg font-bold text-indigo-400 flex items-center gap-2">
            <span class="material-symbols-outlined">description</span>
            Chi tiết đề bài
          </h3>
          <span v-if="currentChallenge" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {{ language }}
          </span>
        </div>

        <!-- Empty State -->
        <div v-if="!currentChallenge && !generating" class="flex-1 flex flex-col items-center justify-center text-center py-16 text-slate-500">
          <span class="material-symbols-outlined text-[64px] text-slate-600/50 mb-3 animate-pulse">code</span>
          <p class="font-bold text-slate-400">Chưa có đề bài nào được tạo</p>
          <p class="text-xs text-slate-500 mt-1 max-w-xs">Nhập chủ đề bạn muốn luyện tập ở trên và ấn nút "Tạo đề bài bằng AI" để bắt đầu học lập trình.</p>
        </div>

        <!-- Generating Shimmer -->
        <div v-else-if="generating" class="space-y-4 animate-pulse">
          <div class="h-6 bg-slate-700/50 rounded-md w-3/4"></div>
          <div class="space-y-2">
            <div class="h-4 bg-slate-700/50 rounded-md"></div>
            <div class="h-4 bg-slate-700/50 rounded-md w-5/6"></div>
            <div class="h-4 bg-slate-700/50 rounded-md w-2/3"></div>
          </div>
          <div class="h-28 bg-slate-700/30 rounded-xl"></div>
        </div>

        <!-- Problem Details -->
        <div v-else class="space-y-4 prose prose-invert max-w-none text-slate-200">
          <h1 class="text-xl font-extrabold text-slate-100 border-l-4 border-indigo-500 pl-3 py-0.5">
            {{ currentChallenge.title }}
          </h1>
          <div class="markdown-body text-body-sm leading-relaxed" v-html="renderedDescription"></div>
        </div>
      </div>

      <!-- Right Panel: Code Editor & Results -->
      <div class="flex flex-col gap-6">
        <!-- Text Code Editor -->
        <div class="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1 min-h-[400px]">
          <div class="bg-slate-800 px-5 py-3 border-b border-slate-700/80 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span class="w-3 h-3 rounded-full bg-green-500"></span>
              <span class="text-xs text-slate-400 font-bold ml-2 font-mono">editor.{{ fileExtension }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="resetStarterCode"
                class="px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-1"
                :disabled="!currentChallenge"
              >
                <span class="material-symbols-outlined text-[14px]">restart_alt</span>
                Reset
              </button>
            </div>
          </div>

          <!-- Code Input Box -->
          <div class="relative flex-1 flex">
            <!-- Line Numbers (Gutter) -->
            <div class="w-12 bg-slate-950 border-r border-slate-800 text-right pr-3 py-4 text-xs font-mono text-slate-600 select-none leading-normal">
              <div v-for="n in lineCount" :key="n">{{ n }}</div>
            </div>
            
            <!-- Code Text Area -->
            <textarea
              v-model="solutionCode"
              class="flex-1 bg-transparent text-emerald-400 font-mono text-body-sm p-4 focus:outline-none resize-none leading-normal placeholder-slate-700"
              placeholder="// Viết mã nguồn bài giải của bạn tại đây..."
              spellcheck="false"
              @keydown.tab.prevent="insertTab"
              :disabled="!currentChallenge || grading"
            ></textarea>
          </div>

          <!-- Editor Footer Status -->
          <div class="bg-slate-950 px-4 py-2 text-[10px] text-slate-500 font-mono flex justify-between border-t border-slate-800">
            <span>Dòng: {{ lineCount }}</span>
            <span>Ký tự: {{ solutionCode.length }}</span>
          </div>
        </div>

        <!-- Grade & Feedback Section -->
        <div class="flex flex-col gap-4">
          <button
            @click="submitSolution"
            :disabled="grading || !currentChallenge || !solutionCode.trim()"
            class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-extrabold text-body-md rounded-2xl shadow-lg transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 border-0"
          >
            <span v-if="grading" class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else class="material-symbols-outlined">publish</span>
            Nộp bài &amp; Chấm điểm tự động
          </button>

          <!-- Result & Review Feedback Panel -->
          <div v-if="gradingResult || grading" class="bg-slate-800/80 border border-slate-700/50 backdrop-blur-md rounded-2xl p-5 shadow-lg space-y-4">
            <h4 class="font-bold text-slate-300 text-body-sm border-b border-slate-700 pb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-indigo-400">analytics</span>
              Kết quả đánh giá từ AI
            </h4>

            <div v-if="grading" class="flex flex-col items-center justify-center py-8 text-slate-400 gap-3">
              <div class="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <p class="font-semibold text-body-sm text-indigo-400 animate-pulse">AI đang phân tích và chạy thử mã nguồn bài giải...</p>
            </div>

            <div v-else class="space-y-4">
              <!-- Score Circle Banner -->
              <div class="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                <div 
                  class="w-16 h-16 rounded-full flex flex-col items-center justify-center border-4"
                  :class="[
                    gradingResult.isCorrect 
                      ? 'border-emerald-500 text-emerald-400' 
                      : gradingResult.score >= 5 
                        ? 'border-yellow-500 text-yellow-400' 
                        : 'border-rose-500 text-rose-400'
                  ]"
                >
                  <span class="text-lg font-extrabold font-mono">{{ gradingResult.score.toFixed(1) }}</span>
                  <span class="text-[8px] font-bold text-slate-400 uppercase">Điểm</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span 
                      class="text-xs font-bold px-2 py-0.5 rounded"
                      :class="gradingResult.isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'"
                    >
                      {{ gradingResult.isCorrect ? 'ĐẠT YÊU CẦU' : 'CHƯA ĐẠT' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mt-1">Bài làm được phân tích cấu trúc, thuật toán và độ tối ưu bởi hệ thống.</p>
                </div>
              </div>

              <!-- Detailed Feedback Markdown -->
              <div class="bg-slate-900/40 p-4 rounded-xl border border-slate-700/20 text-body-xs leading-normal">
                <div class="prose prose-invert prose-xs text-slate-300 font-medium" v-html="renderedFeedback"></div>
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
import api from '../../services/api'
import { marked } from 'marked'

const topic = ref('Vòng lặp')
const language = ref('JavaScript')
const generating = ref(false)
const currentChallenge = ref(null)
const solutionCode = ref('')
const grading = ref(false)
const gradingResult = ref(null)

const fileExtension = computed(() => {
  const map = { JavaScript: 'js', Python: 'py', 'C#': 'cs' }
  return map[language.value] || 'txt'
})

const lineCount = computed(() => {
  return solutionCode.value.split('\n').length
})

const renderedDescription = computed(() => {
  if (!currentChallenge.value?.description) return ''
  return marked(currentChallenge.value.description)
})

const renderedFeedback = computed(() => {
  if (!gradingResult.value?.feedback) return ''
  return marked(gradingResult.value.feedback)
})

async function generateChallenge() {
  if (!topic.value.trim()) return
  generating.value = true
  currentChallenge.value = null
  solutionCode.value = ''
  gradingResult.value = null
  try {
    const res = await api.get('/api/v1/aiplayground/challenge', {
      params: { topic: topic.value, language: language.value }
    })
    currentChallenge.value = res.data
    solutionCode.value = currentChallenge.value.starterCode || ''
  } catch (err) {
    console.error('Error generating AI coding challenge:', err)
    alert(err.response?.data?.message || 'Có lỗi khi kết nối với máy chủ AI.')
  } finally {
    generating.value = false
  }
}

function resetStarterCode() {
  if (currentChallenge.value) {
    solutionCode.value = currentChallenge.value.starterCode || ''
  }
}

function insertTab(e) {
  const start = e.target.selectionStart
  const end = e.target.selectionEnd
  solutionCode.value = solutionCode.value.substring(0, start) + '  ' + solutionCode.value.substring(end)
  e.target.selectionStart = e.target.selectionEnd = start + 2
}

async function submitSolution() {
  if (!currentChallenge.value || !solutionCode.value.trim()) return
  grading.value = true
  gradingResult.value = null
  try {
    const res = await api.post('/api/v1/aiplayground/grade', {
      problemDescription: currentChallenge.value.description,
      solutionCode: solutionCode.value,
      language: language.value
    })
    gradingResult.value = res.data
  } catch (err) {
    console.error('Error submitting AI solution:', err)
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi bài chấm điểm.')
  } finally {
    grading.value = false
  }
}
</script>

<style scoped>
textarea {
  tab-size: 2;
}

/* Custom styling for rendered markdown content in dark mode */
:deep(.markdown-body) {
  font-family: inherit;
  color: #cbd5e1;
}
:deep(.markdown-body h2), :deep(.markdown-body h3) {
  color: #f1f5f9;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
:deep(.markdown-body p) {
  margin-bottom: 0.75rem;
}
:deep(.markdown-body pre) {
  background-color: #0f172a;
  border: 1px border #334155;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85em;
  color: #38bdf8;
  margin: 0.75rem 0;
}
:deep(.markdown-body code) {
  background-color: #1e293b;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
  color: #f43f5e;
}
:deep(.markdown-body ul), :deep(.markdown-body ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  list-style-type: disc;
}
:deep(.markdown-body li) {
  margin-bottom: 0.25rem;
}
</style>
