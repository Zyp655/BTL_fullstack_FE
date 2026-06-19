<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
          <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">rate_review</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg font-bold text-on-background tracking-tight">
            {{ pageTitle }}
          </h2>
          <p class="font-body-sm text-body-sm text-secondary mt-1">{{ pageDesc }}</p>
        </div>
      </div>
      <div v-if="activeTab === 'criteria'">
        <button
          @click="openCreateCriterionDialog"
          class="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold text-[13px] hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer active:scale-95 border-0"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Thêm tiêu chí
        </button>
      </div>
    </section>

    <!-- Loading state -->
    <div v-if="loading" class="glass-panel p-12 rounded-xl text-center flex flex-col items-center justify-center">
      <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
      <p class="text-sm font-semibold text-slate-600">Đang tải dữ liệu...</p>
    </div>

    <!-- Content Sections based on Active Tab Query -->
    <div v-else class="space-y-6">
      
      <!-- 1. TAB: Results (Kết quả đánh giá) -->
      <div v-if="activeTab === 'results'" class="space-y-6 animate-fade-in">
        <!-- Sub-tabs for Results (Teacher vs Course) -->
        <div class="flex gap-2 p-1 bg-slate-100/80 backdrop-blur-md rounded-xl w-fit border border-slate-200/50">
          <button
            @click="activeResultSubTab = 'teachers'"
            :class="[
              'px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
              activeResultSubTab === 'teachers'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 bg-transparent'
            ]"
          >
            Đánh giá Giảng viên
          </button>
          <button
            @click="activeResultSubTab = 'courses'"
            :class="[
              'px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
              activeResultSubTab === 'courses'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 bg-transparent'
            ]"
          >
            Đánh giá Môn học
          </button>
        </div>

        <!-- Search & Filter bar -->
        <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div class="relative flex-1 w-full">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              v-model="filters.search"
              class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-body-sm text-body-sm text-on-surface placeholder:text-slate-400 transition-all"
              placeholder="Tìm theo tên học viên, lớp học, môn học, giáo viên hoặc nhận xét..."
              type="text"
            />
            <button
              v-if="filters.search"
              @click="filters.search = ''"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-slate-100 border-0 bg-transparent"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div class="relative w-full sm:w-48">
            <select
              v-model="filters.rating"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg appearance-none pl-3 pr-8 py-2.5 text-body-sm font-semibold text-slate-700 bg-transparent cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">Tất cả mức sao</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao trở lên</option>
              <option value="3">3 sao trở lên</option>
              <option value="2">Dưới 3 sao</option>
            </select>
            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
          </div>
        </section>

        <!-- Results Table -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <!-- 1. Table for Teacher Evaluations -->
            <table v-if="activeResultSubTab === 'teachers' && filteredEvaluations.length > 0" class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50/50">
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs w-16 text-center">STT</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Học viên</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Môn học & Lớp</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Giảng viên</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center">ĐTB Sao</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Ý kiến phản hồi</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                <tr v-for="(evalObj, idx) in filteredEvaluations" :key="evalObj.id" class="hover:bg-slate-50/40 transition-colors">
                  <td class="py-4 px-4 text-center text-slate-400">{{ idx + 1 }}</td>
                  <td class="py-4 px-4 font-bold text-slate-800">
                    {{ evalObj.studentName }}
                    <span class="block text-[10px] text-slate-400 font-medium">Mã HV: HV-{{ String(evalObj.studentId).padStart(4, '0') }}</span>
                  </td>
                  <td class="py-4 px-4">
                    <span class="font-semibold text-slate-700">{{ evalObj.className }}</span>
                    <span class="block text-[11px] text-slate-400 italic">Môn: {{ evalObj.className }}</span>
                  </td>
                  <td class="py-4 px-4 font-medium text-indigo-600">
                    {{ teachersMap[evalObj.teacherId] || 'Đang tải...' }}
                  </td>
                  <td class="py-4 px-4 text-center">
                    <span class="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-700 font-extrabold text-xs">
                      {{ evalObj.rating?.toFixed(1) || '0.0' }}
                      <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-amber-500">star</span>
                    </span>
                  </td>
                  <td class="py-4 px-4 max-w-xs truncate italic text-slate-600">
                    {{ evalObj.comment ? `"${evalObj.comment}"` : '— Không có ý kiến khác' }}
                  </td>
                  <td class="py-4 px-4 text-center">
                    <button
                      @click="viewDetail(evalObj, 'teacher')"
                      class="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/60 text-indigo-600 text-[12px] font-bold transition-all cursor-pointer"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 2. Table for Course Evaluations -->
            <table v-else-if="activeResultSubTab === 'courses' && filteredCourseEvaluations.length > 0" class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50/50">
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs w-16 text-center">STT</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Học viên</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Môn học</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center">Đánh giá Sao</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Ý kiến phản hồi</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                <tr v-for="(evalObj, idx) in filteredCourseEvaluations" :key="evalObj.id" class="hover:bg-slate-50/40 transition-colors">
                  <td class="py-4 px-4 text-center text-slate-400">{{ idx + 1 }}</td>
                  <td class="py-4 px-4 font-bold text-slate-800">
                    {{ evalObj.studentName }}
                    <span class="block text-[10px] text-slate-400 font-medium">Mã HV: HV-{{ String(evalObj.studentId).padStart(4, '0') }}</span>
                  </td>
                  <td class="py-4 px-4">
                    <span class="font-semibold text-slate-700">{{ evalObj.courseName || '—' }}</span>
                    <span class="block text-[10px] text-slate-400 font-medium">Mã môn: MH-{{ String(evalObj.courseId).padStart(3, '0') }}</span>
                  </td>
                  <td class="py-4 px-4 text-center">
                    <span class="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-700 font-extrabold text-xs">
                      {{ evalObj.rating?.toFixed(1) || '0.0' }}
                      <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-amber-500">star</span>
                    </span>
                  </td>
                  <td class="py-4 px-4 max-w-xs truncate italic text-slate-600">
                    {{ evalObj.comment ? `"${evalObj.comment}"` : '— Không có ý kiến khác' }}
                  </td>
                  <td class="py-4 px-4 text-center">
                    <button
                      @click="viewDetail(evalObj, 'course')"
                      class="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/60 text-indigo-600 text-[12px] font-bold transition-all cursor-pointer"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="p-12 text-center flex flex-col items-center justify-center bg-white/30">
              <span class="material-symbols-outlined text-slate-300 text-[64px] mb-4">rate_review</span>
              <p class="text-base text-slate-600 font-medium">Không tìm thấy khảo sát đánh giá nào</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. TAB: Criteria (Tiêu chí đánh giá) -->
      <div v-if="activeTab === 'criteria'" class="space-y-4 animate-fade-in">
        <!-- Criteria Search filter -->
        <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl p-4 flex items-center justify-between">
          <div class="relative w-full max-w-md">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              v-model="criteriaSearchQuery"
              class="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-body-sm text-body-sm text-on-surface placeholder:text-slate-400 transition-all"
              placeholder="Tìm kiếm tiêu chí theo tên hoặc mô tả..."
              type="text"
            />
            <button
              v-if="criteriaSearchQuery"
              @click="criteriaSearchQuery = ''"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-center w-5 h-5 rounded-full hover:bg-slate-100 border-0 bg-transparent"
            >
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </section>

        <!-- Criteria Table -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50/50">
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs w-16 text-center">STT</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs w-24 text-center">Mã tiêu chí</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs w-64">Tên tiêu chí</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Mô tả</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center w-40">Trạng thái</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                <tr v-for="(crit, idx) in filteredCriteria" :key="crit.id" class="hover:bg-slate-50/40 transition-colors">
                  <td class="py-4 px-4 text-center text-slate-400">{{ idx + 1 }}</td>
                  <td class="py-4 px-4 text-center font-mono font-semibold text-slate-500">CRIT-{{ String(crit.id).padStart(2, '0') }}</td>
                  <td class="py-4 px-4 font-bold text-slate-800">{{ crit.name }}</td>
                  <td class="py-4 px-4 text-slate-500 leading-relaxed">{{ crit.description || '— Không có mô tả chi tiết' }}</td>
                  <td class="py-4 px-4 text-center">
                    <span :class="[crit.isActive ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-300/20 text-slate-500 border border-slate-300/30', 'status-badge text-[10px] font-bold px-2.5 py-0.5 rounded-full']">
                      {{ crit.isActive ? 'Đang hoạt động' : 'Tạm ngưng' }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        @click="openEditCriterionDialog(crit)"
                        class="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer"
                        title="Sửa tiêu chí"
                      >
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        @click="toggleCriterionStatus(crit)"
                        class="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                        :class="crit.isActive ? 'text-amber-600 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50/20' : 'text-emerald-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/20'"
                        :title="crit.isActive ? 'Tạm ngưng tiêu chí' : 'Kích hoạt tiêu chí'"
                      >
                        <span class="material-symbols-outlined text-[18px]">{{ crit.isActive ? 'pause_circle' : 'play_circle' }}</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCriteria.length === 0">
                  <td colspan="6" class="p-8 text-center text-slate-400">Không tìm thấy tiêu chí nào phù hợp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 3. TAB: Lock Settings (Khóa đánh giá lớp học) -->
      <div v-if="activeTab === 'lock-settings'" class="space-y-6 animate-fade-in">
        <!-- Global Evaluation Toggle -->
        <div class="glass-panel p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/40 bg-white/80">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[32px] shrink-0" :class="isEvaluationEnabled ? 'text-emerald-600' : 'text-slate-400'">
              {{ isEvaluationEnabled ? 'lock_open' : 'lock' }}
            </span>
            <div>
              <h3 class="font-bold text-slate-850 text-base">Tổng đài cổng đánh giá (Master Switch)</h3>
              <p class="text-xs text-slate-500 mt-0.5">Bật hoặc khóa toàn bộ tất cả khảo sát trên hệ thống. Tắt master switch sẽ khóa mọi lớp học.</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer select-none shrink-0">
            <input 
              type="checkbox" 
              v-model="isEvaluationEnabled" 
              @change="updateEvaluationStatus"
              class="sr-only peer"
            />
            <div class="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            <span class="ml-3 text-sm font-bold uppercase tracking-wider" :class="isEvaluationEnabled ? 'text-emerald-600' : 'text-slate-500'">
              {{ isEvaluationEnabled ? 'MỞ HỆ THỐNG' : 'KHÓA HỆ THỐNG' }}
            </span>
          </label>
        </div>

        <!-- Class Search & Settings header -->
        <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div class="relative flex-1 w-full">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              v-model="classSearchQuery"
              class="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-body-sm text-body-sm text-on-surface placeholder:text-slate-400 transition-all"
              placeholder="Tìm kiếm lớp học, môn học hoặc giảng viên..."
              type="text"
            />
            <button
              v-if="classSearchQuery"
              @click="classSearchQuery = ''"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-center w-5 h-5 rounded-full hover:bg-slate-100 border-0 bg-transparent"
            >
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center">
            <button
              @click="toggleAllClasses(true)"
              class="px-3.5 py-2 text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100/60 rounded-lg transition-colors cursor-pointer border border-indigo-100"
            >
              Mở tất cả lớp
            </button>
            <button
              @click="toggleAllClasses(false)"
              class="px-3.5 py-2 text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
            >
              Khóa tất cả lớp
            </button>
          </div>
        </section>

        <!-- Classes table with checkbox switches -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm rounded-xl overflow-hidden" :class="{ 'opacity-60 pointer-events-none': !isEvaluationEnabled }">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50/50">
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs w-16 text-center">STT</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs w-28">Mã lớp</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Tên lớp học</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Môn học</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs">Giảng viên</th>
                  <th class="py-3 px-4 font-bold text-slate-500 text-xs text-center w-40">Được phép đánh giá</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
                <tr v-for="(cls, idx) in filteredClasses" :key="cls.classId" class="hover:bg-slate-50/40 transition-colors">
                  <td class="py-4 px-4 text-center text-slate-400">{{ idx + 1 }}</td>
                  <td class="py-4 px-4 font-mono font-semibold text-slate-500">{{ cls.classCode }}</td>
                  <td class="py-4 px-4 font-bold text-slate-800">{{ cls.className }}</td>
                  <td class="py-4 px-4 text-slate-655 font-medium">{{ cls.courseName }}</td>
                  <td class="py-4 px-4 text-indigo-600 font-semibold">{{ cls.teacherName || '— Chưa phân công' }}</td>
                  <td class="py-4 px-4 text-center">
                    <label class="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        :checked="enabledClassIds.includes(cls.classId)" 
                        @change="toggleClassEvaluation(cls.classId)"
                        class="sr-only peer"
                      />
                      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </td>
                </tr>
                <tr v-if="filteredClasses.length === 0">
                  <td colspan="6" class="p-8 text-center text-slate-400">Không tìm thấy lớp học nào phù hợp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Criterion Add/Edit -->
    <teleport to="body">
      <div v-if="showCriterionModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white/95 backdrop-blur-[32px] border border-white/60 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] overflow-hidden flex flex-col animate-scale-in">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 class="font-title-md text-[18px] font-bold text-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-indigo-600">tune</span>
              {{ isEditCriterion ? 'Chỉnh sửa tiêu chí' : 'Thêm tiêu chí mới' }}
            </h3>
            <button @click="showCriterionModal = false" class="text-slate-400 hover:text-slate-800 cursor-pointer border-0 bg-transparent flex items-center">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <form @submit.prevent="saveCriterion" class="space-y-4">
              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tên tiêu chí *</label>
                <input
                  v-model="criterionForm.name"
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Ví dụ: Kỹ năng sư phạm, Môi trường học tập..."
                  type="text"
                  required
                />
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả nội dung</label>
                <textarea
                  v-model="criterionForm.description"
                  rows="3"
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  placeholder="Mô tả chi tiết nội dung tiêu chí để học viên dễ đánh giá..."
                ></textarea>
              </div>
              <div class="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  v-model="criterionForm.isActive"
                  class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label for="isActive" class="text-sm font-semibold text-slate-700 select-none cursor-pointer">Kích hoạt hoạt động lập tức</label>
              </div>
            </form>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              @click="showCriterionModal = false"
              class="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border-0 cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="saveCriterion"
              :disabled="savingCriterion || !criterionForm.name.trim()"
              class="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1 border-0 cursor-pointer"
            >
              <span v-if="savingCriterion" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Lưu lại
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Modal Evaluation Details View -->
    <teleport to="body">
      <div v-if="showDetailModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white/95 backdrop-blur-[32px] border border-white/60 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] overflow-hidden flex flex-col animate-scale-in">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 class="font-title-md text-[18px] font-bold text-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-indigo-600">rate_review</span>
              Chi tiết đánh giá của học viên
            </h3>
            <button @click="showDetailModal = false" class="text-slate-400 hover:text-slate-800 cursor-pointer border-0 bg-transparent flex items-center">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            <!-- Submission Info -->
            <div class="bg-indigo-50/40 p-4 rounded-xl border border-indigo-50/80 space-y-2">
              <div class="text-xs text-slate-500 font-semibold flex justify-between">
                <span>Học viên:</span>
                <span class="text-slate-800 font-bold">{{ activeEval.studentName }}</span>
              </div>
              <div v-if="activeEvalType === 'teacher'" class="text-xs text-slate-500 font-semibold flex justify-between">
                <span>Lớp học:</span>
                <span class="text-slate-800 font-bold">{{ activeEval.className }}</span>
              </div>
              <div v-if="activeEvalType === 'course'" class="text-xs text-slate-500 font-semibold flex justify-between">
                <span>Môn học:</span>
                <span class="text-slate-800 font-bold">{{ activeEval.courseName || '—' }}</span>
              </div>
              <div v-if="activeEvalType === 'teacher'" class="text-xs text-slate-500 font-semibold flex justify-between">
                <span>Giảng viên:</span>
                <span class="text-indigo-600 font-bold">{{ teachersMap[activeEval.teacherId] || 'Đang tải...' }}</span>
              </div>
              <div class="text-xs text-slate-500 font-semibold flex justify-between">
                <span>Thời gian:</span>
                <span class="text-slate-600 font-medium">{{ formatDateTime(activeEval.createdAt) }}</span>
              </div>
            </div>

            <!-- Score overview -->
            <div class="flex items-center justify-between border-y border-slate-100 py-3">
              <span class="text-sm font-bold text-slate-700">Điểm đánh giá:</span>
              <span class="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded text-amber-700 font-extrabold text-sm">
                {{ activeEval.rating?.toFixed(1) || '0.0' }}
                <span class="material-symbols-outlined text-[14px] font-variation-settings-fill text-amber-500">star</span>
              </span>
            </div>

            <!-- Dynamic Criteria Scores (Only for Teacher) -->
            <div v-if="activeEvalType === 'teacher'" class="space-y-3">
              <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm chi tiết theo tiêu chí</h4>
              <div class="space-y-2">
                <div
                  v-for="critScore in getDetailedScoresList(activeEval)"
                  :key="critScore.name"
                  class="flex items-center justify-between bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-200/50"
                >
                  <span class="text-sm font-semibold text-slate-700">{{ critScore.name }}</span>
                  <span class="flex items-center gap-0.5 text-amber-600 font-black">
                    {{ critScore.score }}
                    <span class="material-symbols-outlined text-[14px] font-variation-settings-fill text-amber-500">star</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Comments -->
            <div class="space-y-2 pt-1">
              <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Ý kiến phản hồi khác</h4>
              <div class="bg-slate-50 p-3.5 rounded-lg border border-slate-200/50 text-sm text-slate-600 italic">
                {{ activeEval.comment ? `"${activeEval.comment}"` : '— Học viên không để lại ý kiến phản hồi khác' }}
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end">
            <button
              @click="showDetailModal = false"
              class="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border-0 cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../services/api'

const route = useRoute()
const showSnackbar = inject('showSnackbar')

const loading = ref(true)
const evaluations = ref([])
const courseEvaluations = ref([])
const criteria = ref([])
const teachersMap = ref({})
const classes = ref([])
const enabledClassIds = ref([])

const activeResultSubTab = ref('teachers')
const activeEvalType = ref('teacher')

// Active Tab query calculation
const activeTab = computed(() => route.query.tab || 'results')

// Page Header metadata
const pageTitle = computed(() => {
  if (activeTab.value === 'criteria') return 'Thiết lập tiêu chí đánh giá'
  if (activeTab.value === 'lock-settings') return 'Quản lý khóa cổng đánh giá'
  return 'Kết quả Khảo sát & Đánh giá'
})

const pageDesc = computed(() => {
  if (activeTab.value === 'criteria') return 'Quản lý và điều chỉnh các tiêu chí chấm điểm chất lượng giảng dạy.'
  if (activeTab.value === 'lock-settings') return 'Kiểm soát quyền làm khảo sát theo từng lớp học riêng lẻ.'
  return 'Xem danh sách và ý kiến phản hồi chi tiết từ học viên.'
})

// Search queries
const criteriaSearchQuery = ref('')
const classSearchQuery = ref('')

// Toggle state
const isEvaluationEnabled = ref(true)

// Filters
const filters = ref({
  search: '',
  rating: 'all'
})

// Modals state
const showCriterionModal = ref(false)
const isEditCriterion = ref(false)
const savingCriterion = ref(false)
const criterionForm = ref({
  id: null,
  name: '',
  description: '',
  isActive: true
})

const showDetailModal = ref(false)
const activeEval = ref({})

// Fetch lists
async function loadData() {
  loading.value = true
  try {
    const [evalsRes, courseEvalsRes, critRes, teachersRes, statusRes, classesRes, enabledClassesRes] = await Promise.all([
      api.get('/api/v1/teacher-evaluations/all'),
      api.get('/api/v1/course-evaluations/all'),
      api.get('/api/v1/teacher-evaluations/criteria/all'),
      api.get('/api/v1/teachers'),
      api.get('/api/v1/teacher-evaluations/status'),
      api.get('/api/v1/classes', { params: { pageSize: 100 } }),
      api.get('/api/v1/teacher-evaluations/enabled-classes')
    ])

    evaluations.value = evalsRes.data || []
    courseEvaluations.value = courseEvalsRes.data || []
    criteria.value = critRes.data || []
    isEvaluationEnabled.value = statusRes.data?.isEvaluationEnabled ?? true
    classes.value = classesRes.data?.items || []
    enabledClassIds.value = enabledClassesRes.data?.classIds || []

    const map = {}
    if (teachersRes.data?.items) {
      teachersRes.data.items.forEach(t => {
        map[t.teacherId] = t.name
      })
    }
    teachersMap.value = map
  } catch (e) {
    console.error('Error loading evaluations data:', e)
    showSnackbar('Không thể tải dữ liệu liên quan', 'error')
  } finally {
    loading.value = false
  }
}

// Watch routing query tab parameter changes
watch(() => route.query.tab, () => {
  // Reset search queries
  criteriaSearchQuery.value = ''
  classSearchQuery.value = ''
  filters.value.search = ''
  filters.value.rating = 'all'
})

// Update evaluation global status
async function updateEvaluationStatus() {
  try {
    await api.post('/api/v1/teacher-evaluations/status', {
      isEvaluationEnabled: isEvaluationEnabled.value
    })
    showSnackbar(
      `Đã ${isEvaluationEnabled.value ? 'MỞ' : 'KHÓA'} tổng cổng đánh giá thành công`,
      isEvaluationEnabled.value ? 'success' : 'warning'
    )
  } catch (e) {
    showSnackbar('Không thể thay đổi trạng thái tổng cổng đánh giá', 'error')
    isEvaluationEnabled.value = !isEvaluationEnabled.value // revert
  }
}

// Toggle class-level evaluation checked status
async function toggleClassEvaluation(classId) {
  const index = enabledClassIds.value.indexOf(classId)
  let newIds = [...enabledClassIds.value]
  if (index > -1) {
    newIds.splice(index, 1)
  } else {
    newIds.push(classId)
  }
  
  try {
    await api.post('/api/v1/teacher-evaluations/enabled-classes', { classIds: newIds })
    enabledClassIds.value = newIds
    showSnackbar('Cập nhật quyền đánh giá lớp học thành công', 'success')
  } catch (e) {
    showSnackbar('Không thể cập nhật quyền đánh giá lớp học', 'error')
  }
}

// Toggle all classes at once
async function toggleAllClasses(enableAll) {
  let newIds = []
  if (enableAll) {
    newIds = classes.value.map(c => c.classId)
  }
  
  try {
    await api.post('/api/v1/teacher-evaluations/enabled-classes', { classIds: newIds })
    enabledClassIds.value = newIds
    showSnackbar(
      enableAll ? 'Đã cho phép tất cả các lớp thực hiện đánh giá' : 'Đã khóa đánh giá tất cả các lớp học',
      enableAll ? 'success' : 'warning'
    )
  } catch (e) {
    showSnackbar('Không thể cập nhật cấu hình cho các lớp học', 'error')
  }
}

// Client-side filtering of criteria
const filteredCriteria = computed(() => {
  const query = criteriaSearchQuery.value.trim().toLowerCase()
  if (!query) return criteria.value
  return criteria.value.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.description?.toLowerCase().includes(query)
  )
})

// Client-side filtering of classes
const filteredClasses = computed(() => {
  const query = classSearchQuery.value.trim().toLowerCase()
  if (!query) return classes.value
  return classes.value.filter(c =>
    c.className?.toLowerCase().includes(query) ||
    c.classCode?.toLowerCase().includes(query) ||
    c.courseName?.toLowerCase().includes(query) ||
    c.teacherName?.toLowerCase().includes(query)
  )
})

// Client-side filtering of evaluations (teachers)
const filteredEvaluations = computed(() => {
  let list = evaluations.value

  // Rating filter
  if (filters.value.rating !== 'all') {
    const val = parseFloat(filters.value.rating)
    if (val === 5) {
      list = list.filter(e => e.rating === 5)
    } else if (val === 4) {
      list = list.filter(e => e.rating >= 4)
    } else if (val === 3) {
      list = list.filter(e => e.rating >= 3)
    } else if (val === 2) {
      list = list.filter(e => e.rating < 3)
    }
  }

  // Search filter
  const searchVal = filters.value.search.trim().toLowerCase()
  if (searchVal) {
    list = list.filter(e => {
      const teacherName = (teachersMap.value[e.teacherId] || '').toLowerCase()
      return (
        e.studentName?.toLowerCase().includes(searchVal) ||
        e.className?.toLowerCase().includes(searchVal) ||
        e.comment?.toLowerCase().includes(searchVal) ||
        teacherName.includes(searchVal)
      )
    })
  }

  return list
})

// Client-side filtering of course evaluations
const filteredCourseEvaluations = computed(() => {
  let list = courseEvaluations.value

  // Rating filter
  if (filters.value.rating !== 'all') {
    const val = parseFloat(filters.value.rating)
    if (val === 5) {
      list = list.filter(e => e.rating === 5)
    } else if (val === 4) {
      list = list.filter(e => e.rating >= 4)
    } else if (val === 3) {
      list = list.filter(e => e.rating >= 3)
    } else if (val === 2) {
      list = list.filter(e => e.rating < 3)
    }
  }

  // Search filter
  const searchVal = filters.value.search.trim().toLowerCase()
  if (searchVal) {
    list = list.filter(e => {
      return (
        e.studentName?.toLowerCase().includes(searchVal) ||
        e.courseName?.toLowerCase().includes(searchVal) ||
        e.comment?.toLowerCase().includes(searchVal)
      )
    })
  }

  return list
})

// Criterion Dialog helper
function openCreateCriterionDialog() {
  isEditCriterion.value = false
  criterionForm.value = {
    id: null,
    name: '',
    description: '',
    isActive: true
  }
  showCriterionModal.value = true
}

function openEditCriterionDialog(crit) {
  isEditCriterion.value = true
  criterionForm.value = {
    id: crit.id,
    name: crit.name,
    description: crit.description,
    isActive: crit.isActive
  }
  showCriterionModal.value = true
}

async function saveCriterion() {
  if (!criterionForm.value.name.trim()) return
  savingCriterion.value = true
  try {
    const payload = {
      name: criterionForm.value.name.trim(),
      description: criterionForm.value.description?.trim(),
      isActive: criterionForm.value.isActive
    }

    if (isEditCriterion.value) {
      await api.put(`/api/v1/teacher-evaluations/criteria/${criterionForm.value.id}`, payload)
      showSnackbar('Cập nhật tiêu chí đánh giá thành công', 'success')
    } else {
      await api.post('/api/v1/teacher-evaluations/criteria', payload)
      showSnackbar('Thêm tiêu chí đánh giá thành công', 'success')
    }
    showCriterionModal.value = false
    await loadData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Không thể lưu tiêu chí đánh giá', 'error')
  } finally {
    savingCriterion.value = false
  }
}

async function toggleCriterionStatus(crit) {
  try {
    await api.delete(`/api/v1/teacher-evaluations/criteria/${crit.id}`)
    showSnackbar(`Thay đổi trạng thái tiêu chí "${crit.name}" thành công`, 'success')
    await loadData()
  } catch (e) {
    showSnackbar('Không thể thay đổi trạng thái tiêu chí', 'error')
  }
}

// Evaluation detail helper
function viewDetail(evalObj, type = 'teacher') {
  activeEval.value = evalObj
  activeEvalType.value = type
  showDetailModal.value = true
}

// Get criteria scores list
function getDetailedScoresList(evalObj) {
  if (evalObj.detailedRatings && evalObj.detailedRatings.length > 0) {
    return evalObj.detailedRatings.map(r => ({
      name: r.criterionName,
      score: r.rating
    }))
  }

  // Fallback to legacy fields
  return [
    { name: 'Chất lượng giảng dạy', score: evalObj.teachingQualityRating },
    { name: 'Thái độ & Hỗ trợ', score: evalObj.supportRating },
    { name: 'Tài liệu & Giáo trình', score: evalObj.curriculumRating },
    { name: 'Tác phong & Đúng giờ', score: evalObj.punctualityRating }
  ]
}

// Formatters
function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleString('vi-VN')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
.glass-backdrop {
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
}
.status-badge {
  padding: 2px 10px;
  font-size: 11px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
}
</style>
