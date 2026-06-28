<template>
  <div class="space-y-gutter animate-fade-in">
    <!-- Student Selector (Admin Only) -->
    <div v-if="authStore.isAdmin" class="glass-panel rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-[28px] text-on-tertiary-container">person_search</span>
        <div>
          <h3 class="font-title-md text-body-lg font-bold text-primary-container">Chế độ Quản trị viên (Hỗ trợ & Khảo sát)</h3>
          <p class="text-body-sm text-on-surface-variant">Xem và quản lý yêu cầu hỗ trợ, khảo sát của học viên</p>
        </div>
      </div>
      <div class="relative w-full sm:w-80">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">search</span>
          <input
            type="text"
            v-model="studentSearchText"
            class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-9 pr-16 py-2.5 text-body-sm text-primary placeholder-on-surface-variant/50 focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
            placeholder="Tìm theo tên, email, SĐT hoặc mã..."
            @focus="onSearchFocus"
            @blur="onSearchBlur"
          />
          <button
            v-if="selectedStudentId"
            @click="clearStudentSelection"
            class="absolute right-9 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
        </div>
        
        <!-- Dropdown List -->
        <div v-show="isDropdownOpen" class="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-outline-variant/30 rounded-lg shadow-lg py-1">
          <div
            v-for="student in filteredStudentsForSearch"
            :key="student.studentId"
            @mousedown="selectStudent(student)"
            class="px-4 py-2 hover:bg-primary-container/10 cursor-pointer text-body-sm text-primary flex flex-col transition-colors"
            :class="{ 'bg-primary-container/5 font-semibold': student.studentId === selectedStudentId }"
          >
            <span class="font-semibold text-primary-container">{{ student.fullName }}</span>
            <span class="text-[11px] text-on-surface-variant">
              Mã HV: HV-{{ String(student.studentId).padStart(4, '0') }} 
              <span v-if="student.phone"> | SĐT: {{ student.phone }}</span>
              <span v-if="student.email"> | {{ student.email }}</span>
            </span>
          </div>
          <div v-if="filteredStudentsForSearch.length === 0" class="px-4 py-3 text-body-sm text-on-surface-variant text-center">
            Không tìm thấy học viên
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content for Student Profile -->
    <template v-if="studentProfile">
      <!-- Navigation Tabs -->
      <div class="border-b border-outline-variant/30 overflow-x-auto hide-scrollbar">
        <nav class="flex gap-6 min-w-max px-2">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="selectTab(tab.value)"
            :class="[
              activeTab === tab.value
                ? 'border-primary-container text-primary-container font-bold'
                : 'border-transparent text-readable-secondary hover:text-readable-primary hover:border-slate-300 font-semibold',
              'pb-3 border-b-2 font-title-md text-title-md flex items-center gap-2 transition-colors cursor-pointer'
            ]"
          >
            <span class="material-symbols-outlined" :style="activeTab === tab.value ? 'font-variation-settings: \'FILL\' 1;' : ''">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="glass-panel p-12 rounded-xl text-center flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-primary-container/30 border-t-primary-container rounded-full animate-spin mb-4"></div>
        <p class="text-body-sm font-semibold text-primary-container">Đang tải dữ liệu hỗ trợ...</p>
      </div>

      <!-- Content sections -->
      <div v-else class="space-y-gutter">
        <!-- 1. TAB: Yêu cầu hỗ trợ -->
        <div v-if="activeTab === 'support'" class="space-y-6">
          <!-- Header Banner -->
          <div class="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-indigo-600 text-[26px]">support_agent</span>
              </div>
              <div>
                <h3 class="font-title-md text-body-lg font-bold text-primary-container">Trung tâm hỗ trợ</h3>
                <p class="text-body-sm text-readable-secondary mt-1">
                  Bạn cần hỏi đáp học phí, hỗ trợ kỹ thuật hoặc góp ý kiến? Hãy gửi yêu cầu trực tiếp cho Ban quản lý đào tạo.
                </p>
              </div>
            </div>
            <button
              @click="openSupportDialog"
              class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-body-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md shadow-indigo-100 shrink-0 self-stretch md:self-auto"
            >
              <span class="material-symbols-outlined text-[18px]">add_comment</span>
              Gửi yêu cầu hỗ trợ mới
            </button>
          </div>

          <!-- Main: Unified History (Full Width) -->
          <div class="glass-panel p-6 rounded-xl space-y-4">
            <h4 class="font-title-md text-body-lg font-bold text-primary-container border-b border-slate-100 pb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">history</span>
              Lịch sử yêu cầu &amp; thắc mắc
            </h4>

            <!-- Unified Search & Filter -->
            <div v-if="unifiedHistoryItems.length > 0" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">search</span>
                <input
                  v-model="unifiedSearchQuery"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-9 pr-9 py-2 text-body-sm text-primary placeholder-on-surface-variant/50 focus:outline-none focus:border-on-tertiary-container/30 transition-colors"
                  placeholder="Tìm nội dung yêu cầu, thắc mắc, bài thi..."
                  type="text"
                />
                <button
                  v-if="unifiedSearchQuery"
                  @click="unifiedSearchQuery = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-5 h-5 rounded-full hover:bg-primary-container/10"
                >
                  <span class="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
              <div class="relative min-w-[170px]">
                <select
                  v-model="unifiedTypeFilter"
                  class="w-full bg-primary-container/[0.03] border border-outline-variant/30 rounded-lg appearance-none pl-3 pr-8 py-2 text-body-sm text-primary-container bg-transparent cursor-pointer focus:outline-none focus:border-on-tertiary-container/30 transition-colors font-semibold"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="support">Yêu cầu hỗ trợ</option>
                  <option value="doubt">Thắc mắc bài thi</option>
                </select>
                <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[16px]">expand_more</span>
              </div>
              <div class="relative min-w-[155px]">
                <select
                  v-model="unifiedStatusFilter"
                  class="w-full bg-primary-container/[0.03] border border-outline-variant/30 rounded-lg appearance-none pl-3 pr-8 py-2 text-body-sm text-primary-container bg-transparent cursor-pointer focus:outline-none focus:border-on-tertiary-container/30 transition-colors font-semibold"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="resolved">Đã xử lý / Giải đáp</option>
                  <option value="rejected">Từ chối</option>
                </select>
                <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[16px]">expand_more</span>
              </div>
            </div>

            <!-- Empty States -->
            <div v-if="unifiedHistoryItems.length === 0" class="text-center py-12 text-on-surface-variant flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-[48px] text-primary-container/20 mb-2">chat_bubble_outline</span>
              <p class="font-medium text-body-sm text-readable-muted">Bạn chưa gửi yêu cầu hỗ trợ hoặc thắc mắc nào.</p>
            </div>

            <div v-else-if="filteredUnifiedHistory.length === 0" class="text-center py-8 text-on-surface-variant flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-[40px] text-primary-container/20 mb-2">search_off</span>
              <p class="font-medium text-body-sm text-readable-muted">Không tìm thấy mục nào khớp với bộ lọc.</p>
            </div>

            <!-- Unified Table -->
            <div v-else class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="bg-primary-container/[0.05] border-b border-primary-container/10 text-primary-container font-semibold text-body-xs uppercase tracking-wider">
                    <th class="py-4 px-6">Thời gian</th>
                    <th class="py-4 px-4">Loại</th>
                    <th class="py-4 px-4">Nội dung</th>
                    <th class="py-4 px-4 text-center">Trạng thái</th>
                    <th class="py-4 px-6 text-center w-[80px]">Chi tiết</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <template v-for="item in filteredUnifiedHistory" :key="item._uid">
                    <!-- Main Row -->
                    <tr 
                      @click="toggleUnifiedExpansion(item._uid)" 
                      class="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      :class="[
                        expandedUnifiedId === item._uid ? 'bg-slate-50/70' : '',
                        item._itemType === 'support' 
                          ? (item.status === 'Pending' ? 'border-l-2 border-l-amber-500' : item.status === 'Resolved' ? 'border-l-2 border-l-emerald-500' : 'border-l-2 border-l-rose-500')
                          : (item.answerText ? 'border-l-2 border-l-emerald-500' : 'border-l-2 border-l-amber-500')
                      ]"
                    >
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-1 text-body-xs text-readable-secondary font-medium">
                          <span class="material-symbols-outlined text-[14px]">schedule</span>
                          <span>{{ formatDateTime(item.createdAt) }}</span>
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <span v-if="item._itemType === 'support'" class="bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1 w-fit">
                          <span class="material-symbols-outlined text-[13px]">
                            {{ item.fromClassId ? 'swap_horiz' : 'help_center' }}
                          </span>
                          {{ item.fromClassId ? 'Chuyển lớp' : 'Hỗ trợ khác' }}
                        </span>
                        <span v-else class="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1 w-fit">
                          <span class="material-symbols-outlined text-[13px]">quiz</span>
                          Thắc mắc bài thi
                        </span>
                      </td>
                      <td class="py-4 px-4 max-w-[320px]">
                        <div class="text-body-xs text-primary font-medium truncate" :title="item._itemType === 'support' ? item.message : item.questionText">
                          {{ item._itemType === 'support' ? item.message : item.questionText }}
                        </div>
                        <div v-if="item._itemType === 'doubt' && item.quizTitle" class="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                          Bài: {{ item.quizTitle }}
                        </div>
                      </td>
                      <td class="py-4 px-4 text-center">
                        <span v-if="item._itemType === 'support'" :class="[getStatusClass(item.status), 'status-badge text-[10px] font-bold']">
                          {{ getStatusLabel(item.status) }}
                        </span>
                        <span v-else :class="[item.answerText ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20', 'px-2.5 py-0.5 rounded text-[10px] font-bold']">
                          {{ item.answerText ? 'Đã giải đáp' : 'Chờ phản hồi' }}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-center">
                        <span class="material-symbols-outlined text-primary-container/60 group-hover:text-primary transition-transform duration-300" :class="{'rotate-180': expandedUnifiedId === item._uid}">
                          keyboard_arrow_down
                        </span>
                      </td>
                    </tr>

                    <!-- Expanded Detail Row (Support) -->
                    <tr v-if="expandedUnifiedId === item._uid && item._itemType === 'support'" class="bg-slate-50/40">
                      <td colspan="5" class="p-6 border-t border-slate-100">
                        <div class="space-y-4 max-w-3xl mx-auto">
                          <!-- Message Body -->
                          <div class="space-y-1">
                            <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Chi tiết nội dung yêu cầu</div>
                            <div class="bg-white p-4 rounded-xl border border-slate-150 text-body-sm text-readable-primary font-medium italic shadow-xs">
                              "{{ item.message }}"
                            </div>
                          </div>

                          <!-- Transfer Info -->
                          <div v-if="item.fromClassId" class="text-body-sm bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div class="flex-1 min-w-0">
                              <div class="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">Lớp hiện tại</div>
                              <div class="font-bold text-indigo-950 truncate">{{ item.fromClassName }}</div>
                            </div>
                            <div v-if="item.toClassId" class="flex items-center justify-center text-slate-400 shrink-0">
                              <span class="material-symbols-outlined text-[24px] rotate-90 sm:rotate-0">double_arrow</span>
                            </div>
                            <div v-if="item.toClassId" class="flex-1 min-w-0">
                              <div class="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">Lớp chuyển đến</div>
                              <div class="font-bold text-indigo-950 truncate">{{ item.toClassName }}</div>
                            </div>
                          </div>

                          <!-- Admin Response -->
                          <div v-if="item.adminResponse" class="bg-white p-4 rounded-xl border border-slate-150 text-body-sm text-readable-secondary flex items-start gap-2.5 shadow-xs">
                            <span class="material-symbols-outlined text-[18px] text-indigo-600 mt-0.5 shrink-0">chat</span>
                            <div>
                              <div class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Phản hồi từ Admin</div>
                              <div class="font-semibold text-readable-primary leading-relaxed">
                                {{ item.adminResponse }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!-- Expanded Detail Row (Quiz Doubt) -->
                    <tr v-if="expandedUnifiedId === item._uid && item._itemType === 'doubt'" class="bg-slate-50/40">
                      <td colspan="5" class="p-6 border-t border-slate-100">
                        <div class="space-y-4 max-w-3xl mx-auto">
                          <!-- Question Content -->
                          <div class="space-y-1">
                            <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nội dung câu hỏi thắc mắc</div>
                            <div class="bg-white p-4 rounded-xl border border-slate-150 text-body-sm text-readable-primary font-medium italic shadow-xs">
                              "{{ item.questionText }}"
                            </div>
                          </div>

                          <!-- Teacher Response -->
                          <div v-if="item.answerText" class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/40 text-body-sm flex items-start gap-2.5 shadow-xs">
                            <span class="material-symbols-outlined text-[18px] text-emerald-600 mt-0.5 shrink-0">chat</span>
                            <div>
                              <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Giải đáp của giảng viên</div>
                              <div class="font-semibold text-emerald-900 leading-relaxed">
                                {{ item.answerText }}
                              </div>
                              <div class="text-[10px] text-slate-400 font-medium mt-1">
                                {{ formatDateTime(item.answeredAt) }}
                              </div>
                            </div>
                          </div>
                          <div v-else class="bg-amber-50/30 p-3 rounded-xl border border-amber-100/30 text-body-xs text-amber-700 font-semibold flex items-center gap-2">
                            <span class="material-symbols-outlined text-[16px]">hourglass_top</span>
                            Giảng viên chưa phản hồi thắc mắc này.
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
          </div>
        </div>
      </div>

        <!-- 2. TAB: Đánh giá & Khảo sát -->
        <div v-if="activeTab === 'evaluation'" class="space-y-6">
          
          <!-- Section 2A: Awaiting Evaluations (Lớp học chờ đánh giá) -->
          <div class="glass-panel p-6 rounded-xl space-y-5">
            <div class="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 class="font-title-md text-body-lg font-bold text-primary-container flex items-center gap-2">
                  <span class="material-symbols-outlined text-[24px] text-indigo-600">rate_review</span>
                  Lớp học chờ đánh giá
                </h3>
                <p class="text-body-sm text-readable-secondary mt-1">Các lớp học đang mở cổng đánh giá giảng viên. Hãy chia sẻ ý kiến của bạn.</p>
              </div>
            </div>

            <div v-if="awaitingEvaluations.length === 0" class="text-center py-12 text-on-surface-variant flex flex-col items-center justify-center bg-slate-50/30 rounded-xl border border-slate-100">
              <span class="material-symbols-outlined text-[48px] text-slate-300 mb-2">school</span>
              <p class="font-medium text-body-sm text-readable-muted">Không có lớp học nào đang mở cổng đánh giá giảng viên tại thời điểm này.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-gutter animate-fade-in">
              <div 
                v-for="cls in awaitingEvaluations" 
                :key="cls.classId" 
                class="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between gap-4"
              >
                <div class="space-y-3">
                  <div class="flex justify-between items-start gap-2">
                    <div class="flex-1 min-w-0">
                      <h4 class="font-extrabold text-primary-container text-[17px] leading-snug line-clamp-2" :title="cls.courseName">
                        {{ cls.courseName }}
                      </h4>
                      <p class="text-body-xs text-slate-400 font-semibold mt-0.5">{{ cls.className }}</p>
                    </div>
                    <span :class="[getEnrollmentStatusClass(cls.status), 'status-badge text-[10px] font-bold shrink-0']">
                      {{ getEnrollmentStatusLabel(cls.status) }}
                    </span>
                  </div>
                  <div class="h-[1px] bg-slate-100 w-full"></div>
                  <div class="space-y-2 text-body-sm">
                    <div class="flex items-center gap-2" v-if="cls.teacherName">
                      <span class="material-symbols-outlined text-[16px] text-slate-400 shrink-0">person</span>
                      <span class="font-bold text-slate-600 shrink-0">Giảng viên:</span>
                      <span class="text-readable-secondary font-bold text-indigo-600">{{ cls.teacherName }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button 
                    @click="openEvaluationModal(cls)"
                    class="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-body-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs border-0"
                  >
                    <span class="material-symbols-outlined text-[18px]">rate_review</span>
                    Đánh giá
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2B: Evaluation History (Lịch sử đã đánh giá) -->
          <div class="glass-panel p-6 rounded-xl space-y-5">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="font-title-md text-body-lg font-bold text-primary-container flex items-center gap-2">
                <span class="material-symbols-outlined text-[24px] text-emerald-600">history</span>
                Lịch sử đánh giá của bạn
              </h3>
              <p class="text-body-sm text-readable-secondary mt-1">Các ý kiến phản hồi bạn đã gửi thành công trước đó.</p>
            </div>

            <div v-if="evaluationHistory.length === 0" class="text-center py-12 text-on-surface-variant flex flex-col items-center justify-center bg-slate-50/30 rounded-xl border border-slate-100">
              <span class="material-symbols-outlined text-[48px] text-slate-300 mb-2">history</span>
              <p class="font-medium text-body-sm text-readable-muted">Bạn chưa thực hiện đánh giá nào.</p>
            </div>

            <div v-else class="bg-white/70 backdrop-blur-[24px] border border-slate-200/50 rounded-xl shadow-[0_8px_16px_rgba(0,31,63,0.03)] overflow-hidden animate-fade-in">
              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left">
                  <thead>
                    <tr class="bg-primary-container/[0.05] border-b border-primary-container/10 text-primary-container font-semibold text-body-xs uppercase tracking-wider">
                      <th class="py-4 px-6">Môn học / Lớp học</th>
                      <th class="py-4 px-4">Giảng viên</th>
                      <th class="py-4 px-4">Điểm trung bình</th>
                      <th class="py-4 px-4">Thời gian</th>
                      <th class="py-4 px-6 text-center w-[80px]">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <template v-for="cls in evaluationHistory" :key="cls.classId">
                      <!-- Main Row -->
                      <tr 
                        @click="toggleEvaluationExpansion(cls.classId)" 
                        class="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        :class="expandedEvaluationClassId === cls.classId ? 'bg-slate-50/70' : ''"
                      >
                        <td class="py-4 px-6">
                          <div class="flex flex-col">
                            <span class="font-bold text-primary text-body-sm">{{ cls.courseName }}</span>
                            <span class="text-slate-400 text-[10px] font-semibold mt-0.5">{{ cls.className }}</span>
                          </div>
                        </td>
                        <td class="py-4 px-4">
                          <div class="flex items-center gap-1.5 text-body-sm text-readable-secondary" v-if="cls.teacherName">
                            <span class="material-symbols-outlined text-[16px] text-slate-400">person</span>
                            <span class="font-bold text-indigo-600">{{ cls.teacherName }}</span>
                          </div>
                          <span v-else class="text-slate-400 text-xs italic">Chưa phân công</span>
                        </td>
                        <td class="py-4 px-4">
                          <span class="bg-amber-400/15 text-amber-700 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-400/20 inline-flex items-center gap-1">
                            {{ getClassEvaluation(cls.classId).rating?.toFixed(1) || '0.0' }}
                            <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-amber-500" style="font-variation-settings: 'FILL' 1;">star</span>
                          </span>
                        </td>
                        <td class="py-4 px-4">
                          <div class="flex items-center gap-1 text-body-xs text-on-surface-variant">
                            <span class="material-symbols-outlined text-[14px]">schedule</span>
                            <span>{{ formatDateTime(getClassEvaluation(cls.classId).createdAt) }}</span>
                          </div>
                        </td>
                        <td class="py-4 px-6 text-center">
                          <span class="material-symbols-outlined text-primary-container/60 group-hover:text-primary transition-transform duration-300" :class="{'rotate-180': expandedEvaluationClassId === cls.classId}">
                            keyboard_arrow_down
                          </span>
                        </td>
                      </tr>

                      <!-- Expanded Detail Row -->
                      <tr v-if="expandedEvaluationClassId === cls.classId" class="bg-slate-50/40">
                        <td colspan="5" class="p-6 border-t border-slate-100">
                          <div class="space-y-4 max-w-4xl mx-auto">
                            <!-- Ratings Banner / Box -->
                            <div class="w-full space-y-4 bg-emerald-50/20 p-5 rounded-xl border border-emerald-100/50">
                              <div class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                                <span class="material-symbols-outlined text-[18px]">rate_review</span>
                                Điểm đánh giá chi tiết
                              </div>

                              <!-- Dynamic ratings layout with little star bars -->
                              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-body-xs font-semibold text-slate-600">
                                <div 
                                  v-for="scoreObj in getEvaluationScores(getClassEvaluation(cls.classId))"
                                  :key="scoreObj.name"
                                  class="flex flex-col bg-white p-3 rounded-lg border border-slate-200/60 shadow-xs gap-1.5"
                                >
                                  <div class="flex items-center justify-between text-slate-500 font-bold">
                                    <span class="truncate">{{ scoreObj.name }}</span>
                                    <span class="text-indigo-600 font-black text-body-sm">{{ scoreObj.score }}★</span>
                                  </div>
                                  <div class="flex gap-0.5 text-amber-400">
                                    <span 
                                      v-for="s in 5" 
                                      :key="s" 
                                      class="material-symbols-outlined text-[12px]"
                                      :style="s <= scoreObj.score ? 'font-variation-settings: \'FILL\' 1;' : ''"
                                    >
                                      star
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <!-- Review comment -->
                              <div v-if="getClassEvaluation(cls.classId).comment" class="space-y-1">
                                <div class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Ý kiến phản hồi / Góp ý</div>
                                <p class="text-body-sm text-readable-secondary italic bg-white p-3.5 rounded-lg border border-emerald-100/50 shadow-xs">
                                  "{{ getClassEvaluation(cls.classId).comment }}"
                                </p>
                              </div>
                              
                              <div class="text-[10px] text-slate-400 font-semibold text-right">
                                Ngày gửi đánh giá: {{ formatDateTime(getClassEvaluation(cls.classId).createdAt) }}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>

    <!-- No Student Selected State -->
    <div v-else-if="!loading" class="glass-panel p-12 rounded-xl text-center flex flex-col items-center justify-center">
      <span class="material-symbols-outlined text-primary-container/30 text-[64px] mb-4">school</span>
      <h3 class="font-title-md text-headline-sm text-primary-container mb-2">
        {{ authStore.isAdmin ? 'Chưa chọn học viên' : 'Chưa có hồ sơ học tập' }}
      </h3>
      <p class="text-body-md text-on-surface-variant max-w-md">
        {{ authStore.isAdmin 
          ? 'Vui lòng chọn một học viên từ danh sách ở trên để xem yêu cầu hỗ trợ và tình trạng đánh giá giảng viên của họ.' 
          : 'Hồ sơ học viên của bạn chưa được liên kết với tài khoản này. Vui lòng liên hệ Quản trị viên để được hỗ trợ liên kết tài khoản học viên.' }}
      </p>
    </div>

    <!-- Support dialog modal -->
    <teleport to="body">
      <div v-if="supportDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full p-6 space-y-4 animate-scale-in flex flex-col">
          <div class="flex items-center gap-3 text-primary-container border-b border-white/40 pb-3 justify-between">
            <h3 class="font-title-md text-[18px] font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-[24px] text-on-tertiary-container">chat</span>
              Gửi yêu cầu hỗ trợ mới
            </h3>
            <button @click="supportDialog = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Loại yêu cầu hỗ trợ *</label>
              <select
                v-model="supportType"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container transition-all cursor-pointer"
              >
                <option value="Tuition">💰 Hỏi đáp học phí</option>
                <option value="Technical">💻 Hỗ trợ kỹ thuật</option>
                <option value="Other">📝 Ý kiến đóng góp / Khác</option>
              </select>
            </div>



            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Nội dung yêu cầu hỗ trợ *</label>
              <textarea
                v-model="supportMessageText"
                rows="3"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm text-primary placeholder-on-surface-variant/50 focus:outline-none focus:border-on-tertiary-container transition-all resize-none"
                placeholder="Nhập lý do hoặc tin nhắn cho Admin..."
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-white/40">
            <button
              @click="supportDialog = false"
              class="px-4 py-2 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="submitSupportMessage"
              :disabled="submittingSupport || !supportMessageText.trim()"
              class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="submittingSupport" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Gửi yêu cầu
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Teacher Evaluation Modal -->
    <ModalTeacherEvaluation
      :show="showEvaluationModal"
      :class-obj="activeClassForEvaluation"
      @close="showEvaluationModal = false"
      @success="handleEvaluationSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores'
import api from '../../services/api'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import ModalTeacherEvaluation from './components/ModalTeacherEvaluation.vue'

const route = useRoute()
const router = useRouter()

function getEvaluationScores(evalObj) {
  if (evalObj?.detailedRatings && evalObj.detailedRatings.length > 0) {
    return evalObj.detailedRatings.map(r => ({
      name: r.criterionName.replace(' & ', '/').split(' ')[0],
      score: r.rating
    }))
  }
  return [
    { name: 'Dạy', score: evalObj?.teachingQualityRating || 0 },
    { name: 'Hỗ trợ', score: evalObj?.supportRating || 0 },
    { name: 'G.Trình', score: evalObj?.curriculumRating || 0 },
    { name: 'T.Phong', score: evalObj?.punctualityRating || 0 }
  ]
}

const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')

// Student lists & selectors for admin
const students = ref([])
const selectedStudentId = ref(null)
const isDropdownOpen = ref(false)
const studentSearchText = ref('')

const selectedStudent = computed(() => {
  return students.value.find(s => s.studentId === selectedStudentId.value)
})

watch(selectedStudent, (newVal) => {
  if (newVal) {
    studentSearchText.value = `${newVal.fullName} (HV-${String(newVal.studentId).padStart(4, '0')})`
  } else {
    studentSearchText.value = ''
  }
}, { immediate: true })

const filteredStudentsForSearch = computed(() => {
  const query = studentSearchText.value.toLowerCase().trim()
  const currentLabel = selectedStudent.value 
    ? `${selectedStudent.value.fullName} (HV-${String(selectedStudent.value.studentId).padStart(4, '0')})`.toLowerCase() 
    : ''
  if (!query || query === currentLabel) {
    return students.value
  }
  return students.value.filter(s => {
    const nameMatch = s.fullName?.toLowerCase().includes(query)
    const idMatch = `hv-${String(s.studentId).padStart(4, '0')}`.includes(query) || String(s.studentId).includes(query)
    const emailMatch = s.email?.toLowerCase().includes(query)
    const phoneMatch = s.phone?.includes(query)
    return nameMatch || idMatch || emailMatch || phoneMatch
  })
})

function onSearchFocus(e) {
  isDropdownOpen.value = true
  e.target.select()
}

function onSearchBlur() {
  setTimeout(() => {
    isDropdownOpen.value = false
    if (selectedStudent.value) {
      studentSearchText.value = `${selectedStudent.value.fullName} (HV-${String(selectedStudent.value.studentId).padStart(4, '0')})`
    } else {
      studentSearchText.value = ''
    }
  }, 200)
}

function selectStudent(student) {
  selectedStudentId.value = student.studentId
  isDropdownOpen.value = false
}

function clearStudentSelection() {
  selectedStudentId.value = null
  studentSearchText.value = ''
}

// Data loading states
const loading = ref(true)
const studentProfile = ref(null)
const enrolledClasses = ref([])
const mySupportMessages = ref([])
const myEvaluations = ref([])
const myQuizQuestions = ref([])

const expandedMessageId = ref(null)
function toggleMessageExpansion(id) {
  if (expandedMessageId.value === id) {
    expandedMessageId.value = null
  } else {
    expandedMessageId.value = id
  }
}
const isEvaluationSystemEnabled = ref(true)
const enabledEvaluationClassIds = ref([])

// Tab configuration
const activeTab = ref(route.query.tab || 'support')
const tabs = [
  { label: 'Yêu cầu hỗ trợ', value: 'support', icon: 'chat' },
  { label: 'Đánh giá & Khảo sát', value: 'evaluation', icon: 'rate_review' }
]

const selectTab = (tabValue) => {
  activeTab.value = tabValue
  router.replace({ path: route.path, query: { ...route.query, tab: tabValue } })
}

watch(() => route.query.tab, (newTab) => {
  if (newTab && tabs.some(t => t.value === newTab)) {
    activeTab.value = newTab
  } else if (!newTab) {
    activeTab.value = 'support'
  }
})

// Dialog: Support Request State
const supportDialog = ref(false)
const supportType = ref('Tuition')
const supportMessageText = ref('')
const submittingSupport = ref(false)

function formatDayOfWeek(day) {
  const map = { 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 0: 'Chủ Nhật' }
  return map[day] || day
}

function formatSchedulesBrief(schedules) {
  if (!schedules || schedules.length === 0) return 'Chưa xếp lịch'
  return schedules.map(s => {
    const day = s.dayOfWeek === 0 ? 'CN' : `T${s.dayOfWeek}`
    return `${day} (${s.startTime.substring(0, 5)}-${s.endTime.substring(0, 5)})`
  }).join(', ')
}

// Unified History Search & Filters
const unifiedSearchQuery = ref('')
const unifiedTypeFilter = ref('all')
const unifiedStatusFilter = ref('all')
const expandedUnifiedId = ref(null)

function toggleUnifiedExpansion(uid) {
  if (expandedUnifiedId.value === uid) {
    expandedUnifiedId.value = null
  } else {
    expandedUnifiedId.value = uid
  }
}

// Search & Filter state for Evaluation tab
const evalSearchQuery = ref('')
const evalStatusFilter = ref('all')
const expandedEvaluationClassId = ref(null)

function toggleEvaluationExpansion(classId) {
  if (expandedEvaluationClassId.value === classId) {
    expandedEvaluationClassId.value = null
  } else {
    expandedEvaluationClassId.value = classId
  }
}

// Computed: unified history items
const unifiedHistoryItems = computed(() => {
  const items = []
  // 1. Add support messages
  mySupportMessages.value.forEach(msg => {
    items.push({
      ...msg,
      _uid: 'support_' + msg.id,
      _itemType: 'support',
      _time: msg.createdAt ? new Date(msg.createdAt) : new Date(0)
    })
  })
  // 2. Add quiz doubts
  myQuizQuestions.value.forEach(d => {
    items.push({
      ...d,
      _uid: 'doubt_' + d.id,
      _itemType: 'doubt',
      _time: d.createdAt ? new Date(d.createdAt) : new Date(0)
    })
  })
  // Sort by time descending
  return items.sort((a, b) => b._time - a._time)
})

// Computed: filtered unified history
const filteredUnifiedHistory = computed(() => {
  let list = unifiedHistoryItems.value

  // Type filter
  if (unifiedTypeFilter.value !== 'all') {
    list = list.filter(item => item._itemType === unifiedTypeFilter.value)
  }

  // Status filter
  if (unifiedStatusFilter.value !== 'all') {
    list = list.filter(item => {
      if (item._itemType === 'support') {
        const statusLower = item.status?.toLowerCase()
        if (unifiedStatusFilter.value === 'pending') return statusLower === 'pending'
        if (unifiedStatusFilter.value === 'resolved') return statusLower === 'resolved'
        if (unifiedStatusFilter.value === 'rejected') return statusLower === 'rejected'
      } else {
        const hasAnswer = !!item.answerText
        if (unifiedStatusFilter.value === 'pending') return !hasAnswer
        if (unifiedStatusFilter.value === 'resolved') return hasAnswer
        if (unifiedStatusFilter.value === 'rejected') return false // doubts cannot be rejected
      }
      return true
    })
  }

  // Search text
  if (unifiedSearchQuery.value.trim()) {
    const q = unifiedSearchQuery.value.toLowerCase()
    list = list.filter(item => {
      if (item._itemType === 'support') {
        return (item.message?.toLowerCase().includes(q) ||
                item.fromClassName?.toLowerCase().includes(q) ||
                item.toClassName?.toLowerCase().includes(q) ||
                item.adminResponse?.toLowerCase().includes(q))
      } else {
        return (item.questionText?.toLowerCase().includes(q) ||
                item.quizTitle?.toLowerCase().includes(q) ||
                item.answerText?.toLowerCase().includes(q))
      }
    })
  }

  return list
})

// Computed: evaluable classes (classes with status DangHoc/DaXong/HoanThanh)
const evaluableClasses = computed(() => {
  return enrolledClasses.value.filter(c => c.status === 'DangHoc' || c.status === 'DaXong' || c.status === 'HoanThanh')
})

// Computed: awaiting evaluations (open for evaluations, not completed yet)
const awaitingEvaluations = computed(() => {
  let list = evaluableClasses.value.filter(cls => !isClassEvaluated(cls.classId))
  // Filter open only
  list = list.filter(cls => isEvaluationSystemEnabled.value && enabledEvaluationClassIds.value.includes(cls.classId))
  // Filter by search query
  if (evalSearchQuery.value.trim()) {
    const q = evalSearchQuery.value.toLowerCase()
    list = list.filter(cls =>
      cls.courseName?.toLowerCase().includes(q) ||
      cls.className?.toLowerCase().includes(q) ||
      cls.teacherName?.toLowerCase().includes(q)
    )
  }
  return list
})

// Computed: evaluation history (evaluated classes)
const evaluationHistory = computed(() => {
  let list = evaluableClasses.value.filter(cls => isClassEvaluated(cls.classId))
  // Filter by search query
  if (evalSearchQuery.value.trim()) {
    const q = evalSearchQuery.value.toLowerCase()
    list = list.filter(cls =>
      cls.courseName?.toLowerCase().includes(q) ||
      cls.className?.toLowerCase().includes(q) ||
      cls.teacherName?.toLowerCase().includes(q)
    )
  }
  return list
})

// Evaluation Modal state
const showEvaluationModal = ref(false)
const activeClassForEvaluation = ref(null)

async function loadStudentsList() {
  try {
    const res = await api.get('/api/v1/students', { params: { pageSize: 1000 } })
    students.value = res.data.items || []
  } catch (err) {
    console.error('Error fetching students list for admin:', err)
  }
}

watch(selectedStudentId, async (newVal) => {
  if (newVal) {
    router.replace({ path: route.path, query: { ...route.query, studentId: newVal } })
    const student = students.value.find(s => s.studentId === newVal)
    if (student) {
      studentProfile.value = student
      await loadServicesDataForStudent(newVal, student.userId)
    } else {
      try {
        const res = await api.get(`/api/v1/students/${newVal}`)
        studentProfile.value = res.data
        await loadServicesDataForStudent(newVal, res.data.userId)
      } catch (e) {
        console.error('Error fetching student details:', e)
      }
    }
  } else {
    studentProfile.value = null
    enrolledClasses.value = []
    mySupportMessages.value = []
    myEvaluations.value = []
    myQuizQuestions.value = []
    const newQuery = { ...route.query }
    delete newQuery.studentId
    router.replace({ path: route.path, query: newQuery })
  }
})

// Main data loaders
async function loadPortalData(isBackground = false) {
  const isBg = isBackground === true
  if (!isBg) {
    loading.value = true
  }
  try {
    if (authStore.isAdmin) {
      await loadStudentsList()
      
      const queryStudentId = route.query.studentId ? parseInt(route.query.studentId, 10) : null
      if (queryStudentId) {
        selectedStudentId.value = queryStudentId
      } else {
        studentProfile.value = null
        if (!isBg) {
          loading.value = false
        }
      }
      return
    }

    const userId = authStore.currentUser?.userId
    if (!userId) {
      if (!isBg) {
        loading.value = false
      }
      return
    }

    // Load Student Profile summary
    try {
      const summaryRes = await api.get(`/api/v1/portal/student-summary/${userId}`)
      const summary = summaryRes.data
      
      studentProfile.value = summary.profile
      enrolledClasses.value = summary.enrollments || []
      
      const studentId = studentProfile.value.studentId
      await loadServicesDataForStudent(studentId, userId, isBg)

      // Setup websocket updates
      setupSignalR()
    } catch (err) {
      console.error('Error fetching student summary:', err)
      if (!isBg) {
        showSnackbar('Hồ sơ học tập của bạn chưa được tạo hoặc lỗi liên kết.', 'error')
      }
    } finally {
      if (!isBg) {
        loading.value = false
      }
    }
  } catch (err) {
    console.error('Error loading other services portal:', err)
    if (!isBg) {
      loading.value = false
    }
  }
}

async function loadServicesDataForStudent(studentId, userId, isBg = false) {
  if (!isBg) {
    loading.value = true
  }
  try {
    const classPromise = api.get(`/api/v1/students/${studentId}/enrollments`)
    
    const msgPromise = (authStore.isAdmin 
      ? api.get('/api/v1/support-messages')
      : api.get('/api/v1/support-messages/my-messages')
    ).catch(e => {
      console.error('Error fetching support messages:', e)
      return { data: [] }
    })

    const doubtsPromise = (authStore.isAdmin
      ? api.get('/api/v1/quizzes/student-questions/all')
      : api.get('/api/v1/quizzes/student-questions/my-all')
    ).catch(e => {
      console.error('Error fetching student doubts:', e)
      return { data: [] }
    })

    const statusPromise = api.get('/api/v1/teacher-evaluations/status').catch(() => ({ data: { isEvaluationEnabled: true } }))
    const enabledClassesPromise = api.get('/api/v1/teacher-evaluations/enabled-classes').catch(() => ({ data: { classIds: [] } }))

    const [classRes, msgRes, statusRes, enabledRes, doubtsRes] = await Promise.all([
      classPromise, 
      msgPromise,
      statusPromise,
      enabledClassesPromise,
      doubtsPromise
    ])

    enrolledClasses.value = classRes.data || []
    isEvaluationSystemEnabled.value = statusRes.data?.isEvaluationEnabled ?? true
    enabledEvaluationClassIds.value = enabledRes.data?.classIds || []
    
    if (authStore.isAdmin) {
      mySupportMessages.value = (msgRes.data || []).filter(m => m.studentId === studentId)
      myQuizQuestions.value = (doubtsRes.data || []).filter(d => d.studentId === studentId)
    } else {
      mySupportMessages.value = msgRes.data || []
      myQuizQuestions.value = doubtsRes.data || []
    }

    // Fetch Evaluations
    await loadEvaluations(isBg)

  } catch (err) {
    console.error('Error fetching services details:', err)
  } finally {
    if (!isBg) {
      loading.value = false
    }
  }
}

async function loadEvaluations(isBg = false) {
  try {
    if (!authStore.isAdmin) {
      const res = await api.get('/api/v1/teacher-evaluations/my-evaluations')
      myEvaluations.value = res.data || []
    } else {
      myEvaluations.value = []
      // If admin, check evaluations for each enrolled class of the student
      for (const cls of enrolledClasses.value) {
        try {
          const res = await api.get(`/api/v1/teacher-evaluations/class/${cls.classId}`)
          const studentEval = (res.data || []).find(e => e.studentId === studentProfile.value?.studentId)
          if (studentEval) {
            myEvaluations.value.push(studentEval)
          }
        } catch (e) {
          console.error(`Error loading evaluations for class ${cls.classId}:`, e)
        }
      }
    }
  } catch (err) {
    console.error('Error loading evaluations list:', err)
  }
}

function handleQueryPreFills() {
  const openDoubtId = route.query.openDoubtId

  if (openDoubtId) {
    activeTab.value = 'support'
    expandedUnifiedId.value = 'doubt_' + openDoubtId
    
    // Clean URL queries without reloading page
    const url = new URL(window.location)
    url.searchParams.delete('openDoubtId')
    window.history.replaceState({}, '', url)
  }
}



function openSupportDialog() {
  supportType.value = 'Tuition'
  supportMessageText.value = ''
  supportDialog.value = true
}

async function submitSupportMessage() {
  if (!supportMessageText.value.trim() || !studentProfile.value) return
  submittingSupport.value = true
  try {
    let finalMessage = supportMessageText.value.trim()

    const prefixMap = {
      Tuition: '[Hỏi đáp học phí]',
      Technical: '[Hỗ trợ kỹ thuật]',
      Other: '[Ý kiến khác]'
    }
    const prefix = prefixMap[supportType.value] || '[Ý kiến khác]'
    finalMessage = `${prefix} ${finalMessage}`

    await api.post('/api/v1/support-messages', {
      studentId: studentProfile.value.studentId,
      message: finalMessage,
      fromClassId: null,
      fromClassName: null,
      toClassId: null,
      toClassName: null
    })

    showSnackbar('Đã gửi tin nhắn yêu cầu hỗ trợ tới Admin!', 'success')
    supportMessageText.value = ''
    supportDialog.value = false
    
    // Refresh support messages list
    await loadServicesDataForStudent(studentProfile.value.studentId, studentProfile.value.userId, true)
  } catch (e) {
    console.error('Error submitting support request:', e)
    showSnackbar(e.response?.data?.message || 'Lỗi khi gửi yêu cầu hỗ trợ', 'error')
  } finally {
    submittingSupport.value = false
  }
}

// Evaluation Modal logic
function openEvaluationModal(cls) {
  activeClassForEvaluation.value = cls
  showEvaluationModal.value = true
}

async function handleEvaluationSuccess() {
  showEvaluationModal.value = false
  showSnackbar('Gửi đánh giá giảng viên thành công!', 'success')
  await loadEvaluations(true)
}

function isClassEvaluated(classId) {
  return myEvaluations.value.some(e => e.classId === classId)
}

function getClassEvaluation(classId) {
  return myEvaluations.value.find(e => e.classId === classId) || {}
}

// Websocket updates (SignalR)
let signalrConnection = null

function setupSignalR() {
  if (signalrConnection) return
  
  const token = authStore.token || authStore.currentUser?.token
  if (!token) return
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const hubUrl = baseUrl.endsWith('/') ? `${baseUrl}hubs/support` : `${baseUrl}/hubs/support`;

  signalrConnection = new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build()
    
  signalrConnection.on('SupportMessageStatusChanged', async (msg) => {
    try {
      if (authStore.isAdmin) {
        const msgRes = await api.get('/api/v1/support-messages')
        mySupportMessages.value = (msgRes.data || []).filter(m => m.studentId === studentProfile.value?.studentId)
      } else {
        const msgRes = await api.get('/api/v1/support-messages/my-messages')
        mySupportMessages.value = msgRes.data || []
      }
      
      if (msg.status === 'Resolved') {
        showSnackbar(`Yêu cầu đổi lớp của bạn đã được phê duyệt!`, 'success')
        if (studentProfile.value) {
          await loadServicesDataForStudent(studentProfile.value.studentId, studentProfile.value.userId, true)
        }
      } else if (msg.status === 'Rejected') {
        showSnackbar(`Yêu cầu đổi lớp của bạn đã bị từ chối.`, 'info')
      }
    } catch (err) {
      console.error('Error handling WebSocket message status change:', err)
    }
  })
  
  signalrConnection.start()
    .then(() => console.log('Connected to SupportHub WebSocket in OtherServices!'))
    .catch(err => console.error('Error starting SupportHub connection:', err))
}

// Display helper methods
function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  let normalizedStr = dateStr
  if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
    normalizedStr = dateStr + 'Z'
  }
  const date = new Date(normalizedStr)
  return date.toLocaleString('vi-VN')
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
    Resolved: 'status-completed',
    Rejected: 'status-cancelled'
  }
  return map[status] || 'bg-outline/10 text-on-surface'
}

function getStatusLabel(status) {
  const map = {
    Pending: 'Chờ duyệt',
    Resolved: 'Đã duyệt',
    Rejected: 'Từ chối'
  }
  return map[status] || status
}

onMounted(async () => {
  await loadPortalData()
  handleQueryPreFills()
})

// React when route queries change (e.g. redirected with fromClassId)
watch(() => route.query, () => {
  handleQueryPreFills()
})

onUnmounted(() => {
  if (signalrConnection) {
    signalrConnection.stop()
    signalrConnection = null
  }
})
</script>

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
