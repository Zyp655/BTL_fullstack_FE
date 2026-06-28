<template>
  <div class="space-y-6 animate-fade-in text-[14px]">
    <!-- Header -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary-container/10 pb-5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary-container">menu_book</span>
        </div>
        <div>
          <h1 class="text-display-sm font-bold tracking-tight text-primary-container">Lịch dạy & Bài giảng</h1>
          <p class="text-body-md text-on-surface-variant/80 mt-1">
            Tra cứu lịch dạy, cập nhật tài liệu học tập và quản lý bài kiểm tra theo ngày học.
          </p>
        </div>
      </div>
    </section>

    <!-- Tab Navigation -->
    <div class="border-b border-outline-variant/30 overflow-x-auto hide-scrollbar">
      <nav class="flex gap-6 min-w-max px-2 pb-1.5">
        <button
          @click="activeTab = 'lessons'"
          :class="[
            activeTab === 'lessons'
              ? 'border-primary-container text-primary-container font-bold'
              : 'border-transparent text-readable-secondary hover:text-readable-primary hover:border-slate-300 font-semibold',
            'pb-3 border-b-2 font-title-md text-title-md flex items-center gap-2 transition-colors cursor-pointer'
          ]"
        >
          <span class="material-symbols-outlined">menu_book</span>
          Lớp học & Bài giảng
        </button>
        <button
          @click="activeTab = 'timetable'"
          :class="[
            activeTab === 'timetable'
              ? 'border-primary-container text-primary-container font-bold'
              : 'border-transparent text-readable-secondary hover:text-readable-primary hover:border-slate-300 font-semibold',
            'pb-3 border-b-2 font-title-md text-title-md flex items-center gap-2 transition-colors cursor-pointer'
          ]"
        >
          <span class="material-symbols-outlined">calendar_month</span>
          Thời khóa biểu tuần
        </button>
        <button
          @click="activeTab = 'support'"
          :class="[
            activeTab === 'support'
              ? 'border-primary-container text-primary-container font-bold'
              : 'border-transparent text-readable-secondary hover:text-readable-primary hover:border-slate-300 font-semibold',
            'pb-3 border-b-2 font-title-md text-title-md flex items-center gap-2 transition-colors cursor-pointer'
          ]"
        >
          <span class="material-symbols-outlined">support_agent</span>
          Yêu cầu hỗ trợ & Đổi lịch
        </button>
      </nav>
    </div>

    <!-- Tab 1: Lớp học & Bài giảng -->
    <div v-if="activeTab === 'lessons'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- Left column: List of Schedules/Classes (col-span-2) -->
      <div class="lg:col-span-2 space-y-4">
        
        <!-- Filter Card -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-4">
          <h3 class="font-bold text-primary-container mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">filter_alt</span>
            Bộ lọc tìm kiếm
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <!-- Search Text -->
            <div class="relative w-full">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                v-model="filters.search"
                @input="debouncedFetch"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-4 py-2 text-body-sm text-primary placeholder:text-outline-variant focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                placeholder="Tìm lớp học..."
                type="text"
              />
            </div>

            <!-- Course Filter -->
            <div class="relative w-full">
              <select
                v-model="filters.courseId"
                @change="fetchClasses"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2 text-body-sm text-primary cursor-pointer focus:outline-none transition-all"
              >
                <option :value="null">Tất cả môn học</option>
                <option v-for="c in courseStore.courses" :key="c.courseId" :value="c.courseId">{{ c.courseName }}</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
            </div>

            <!-- Teacher Filter (Admin only) -->
            <div class="relative w-full" v-if="isAdmin">
              <select
                v-model="filters.teacherId"
                @change="fetchClasses"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2 text-body-sm text-primary cursor-pointer focus:outline-none transition-all"
              >
                <option :value="null">Tất cả giảng viên</option>
                <option v-for="t in teachers" :key="t.userId" :value="t.userId">{{ t.fullName }}</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
            </div>

            <!-- Teacher Lock Indicator (Teacher only) -->
            <div class="bg-primary-container/5 border border-primary-container/10 rounded-lg px-4 py-2 text-body-xs font-semibold text-primary flex items-center gap-1.5" v-else>
              <span class="material-symbols-outlined text-[16px]">lock</span>
              Lọc theo lịch dạy của bạn
            </div>

          </div>
        </div>

        <!-- Classes/Schedule Table List -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
          <div class="p-4 border-b border-white/40 flex justify-between items-center">
            <h2 class="font-bold text-primary-container text-body-lg flex items-center gap-1.5">
              <span class="material-symbols-outlined">class</span>
              Danh sách lớp & Lịch học ({{ classes.length }})
            </h2>
            <span v-if="loadingClasses" class="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-55 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-slate-100">
                  <th class="py-3 px-4">Lớp học</th>
                  <th class="py-3 px-4">Môn học</th>
                  <th class="py-3 px-4" v-if="isAdmin">Giảng viên</th>
                  <th class="py-3 px-4">Lịch học</th>
                  <th class="py-3 px-4">Phòng</th>
                  <th class="py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-body-sm">
                <tr
                  v-for="record in classes"
                  :key="record.classId"
                  @click="selectClass(record)"
                  :class="[
                    'hover:bg-primary-container/[0.03] transition-all cursor-pointer select-none',
                    selectedClass?.classId === record.classId ? 'bg-primary-container/[0.06] font-medium border-l-4 border-l-primary-container' : ''
                  ]"
                >
                  <td class="py-3 px-4 font-bold text-primary-container">{{ record.className }}</td>
                  <td class="py-3 px-4">{{ record.courseName }}</td>
                  <td class="py-3 px-4 font-semibold" v-if="isAdmin">{{ record.teacherName || 'Chưa phân công' }}</td>
                  <td class="py-3 px-4">
                    <div v-if="record.schedules && record.schedules.length > 0" class="flex flex-col gap-1 max-w-[180px]">
                      <span v-for="s in record.schedules" :key="s.scheduleId" class="px-2 py-0.5 rounded bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold truncate block">
                        {{ s.dayOfWeekName }}: {{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }}
                      </span>
                    </div>
                    <span v-else class="text-body-xs text-on-surface-variant italic">Chưa xếp lịch</span>
                  </td>
                  <td class="py-3 px-4 font-semibold text-slate-600">{{ record.room || '-' }}</td>
                  <td class="py-3 px-4">
                    <span :class="['status-badge text-[11px] inline-flex px-2 py-0.5 rounded-full font-bold', getStatusBadgeClass(record.status)]">
                      {{ getStatusLabel(record.status) }}
                    </span>
                  </td>
                </tr>
                
                <tr v-if="classes.length === 0 && !loadingClasses">
                  <td :colspan="isAdmin ? 6 : 5" class="py-12 text-center text-on-surface-variant font-medium">
                    <span class="material-symbols-outlined text-outline/30 text-[48px] mb-2 block">sentiment_dissatisfied</span>
                    Không tìm thấy lớp học nào phù hợp.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Right column: Today's Lessons & Quizzes (col-span-1) -->
      <div class="space-y-4">
        
        <!-- Detail Panel -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 min-h-[400px] flex flex-col">
          
          <div v-if="!selectedClass" class="flex-1 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
            <span class="material-symbols-outlined text-[64px] text-primary-container/20 mb-3 animate-bounce">import_contacts</span>
            <h3 class="font-bold text-primary-container text-body-lg mb-1">Tra cứu bài học theo ngày</h3>
            <p class="text-body-xs max-w-[250px]">Vui lòng chọn một lớp học trong danh sách bên trái để quản lý bài giảng & đề kiểm tra.</p>
          </div>

          <div v-else class="space-y-5 flex-1 flex flex-col">
            <!-- Header of Selected Class -->
            <div class="border-b border-slate-200/60 pb-3.5 space-y-1">
              <div class="flex justify-between items-start">
                <span class="px-2 py-0.5 rounded bg-primary-container text-white font-bold text-[10px] uppercase">
                  LỚP: {{ selectedClass.className }}
                </span>
                <span class="text-body-xs text-on-surface-variant font-bold">Phòng: {{ selectedClass.room || 'N/A' }}</span>
              </div>
              <h3 class="font-bold text-primary-container text-body-lg leading-tight">{{ selectedClass.courseName }}</h3>
            </div>

            <!-- Date Selector -->
            <div class="space-y-1 bg-primary-container/[0.03] p-3 rounded-lg border border-primary-container/10">
              <label class="block text-body-xs font-bold text-slate-700 uppercase">Ngày dạy học:</label>
              <div class="relative">
                <input
                  v-model="selectedDate"
                  type="date"
                  @click="$event.target.showPicker?.()"
                  @focus="$event.target.showPicker?.()"
                  class="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3 py-1.5 text-body-sm font-semibold focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer"
                />
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">calendar_month</span>
              </div>
            </div>

            <!-- Today's Lesson Content Section -->
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <h4 class="font-bold text-primary-container text-body-md flex items-center gap-1">
                  <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">description</span>
                  Nội dung bài học
                </h4>
                <button
                  v-if="!todayLesson && !loadingTodayLesson"
                  @click="openAddLessonModal"
                  class="text-[12px] bg-primary-container hover:bg-primary text-white font-bold px-2.5 py-1 rounded flex items-center gap-0.5 active:scale-95 transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[14px]">add</span> Đăng tải
                </button>
              </div>

              <!-- Loading State -->
              <div v-if="loadingTodayLesson" class="py-6 text-center text-body-xs text-on-surface-variant flex items-center justify-center gap-1.5">
                <span class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></span>
                Đang tìm bài học...
              </div>

              <!-- Lesson Card -->
              <div v-else-if="todayLesson" class="p-3.5 bg-indigo-50/30 border border-indigo-100 rounded-xl space-y-2.5 relative group">
                <div class="pr-8">
                  <h5 class="font-bold text-indigo-950 text-body-sm leading-tight">{{ todayLesson.title }}</h5>
                  <p class="text-[11px] text-slate-400 font-bold mt-1">Đăng lúc: {{ formatDate(todayLesson.createdAt) }}</p>
                </div>
                
                <!-- Action Buttons -->
                <div class="absolute top-2.5 right-2 flex items-center gap-1">
                  <button @click="openEditLessonModal(todayLesson)" class="p-1 rounded hover:bg-indigo-100 text-primary-container cursor-pointer" title="Sửa bài giảng">
                    <span class="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button @click="deleteLesson(todayLesson.lessonId)" class="p-1 rounded hover:bg-indigo-100 text-rose-600 cursor-pointer" title="Xóa bài giảng">
                    <span class="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>

                <div v-if="todayLesson.fileName" class="pt-1">
                  <button
                    @click="downloadLessonFile(todayLesson)"
                    :disabled="downloadingFileId === todayLesson.lessonId"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/10 hover:bg-primary-container/20 text-primary-container rounded-lg text-body-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span v-if="downloadingFileId === todayLesson.lessonId" class="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    <span v-else class="material-symbols-outlined text-[16px]">download</span>
                    Tải về: {{ todayLesson.fileName }}
                  </button>
                </div>
                <p v-else class="text-body-xs text-on-surface-variant whitespace-pre-line bg-white/50 p-2.5 rounded-lg border border-slate-200/50">{{ todayLesson.content }}</p>
              </div>

              <!-- Empty state -->
              <div v-else class="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-on-surface-variant text-body-xs flex flex-col items-center justify-center p-4">
                <span class="material-symbols-outlined text-[32px] text-slate-300 mb-1">book</span>
                <span>Ngày học này chưa đăng tải bài giảng nào.</span>
              </div>
            </div>

            <!-- Today's Quizzes Section -->
            <div class="space-y-3 flex-1 flex flex-col">
              <div class="flex justify-between items-center">
                <h4 class="font-bold text-primary-container text-body-md flex items-center gap-1">
                  <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">assignment</span>
                  Bài kiểm tra ngày học
                </h4>
                <button
                  @click="openAddQuizModal"
                  class="text-[12px] bg-primary-container hover:bg-primary text-white font-bold px-2.5 py-1 rounded flex items-center gap-0.5 active:scale-95 transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[14px]">add</span> Tạo đề
                </button>
              </div>

              <!-- Loading State -->
              <div v-if="loadingClassQuizzes" class="py-6 text-center text-body-xs text-on-surface-variant flex items-center justify-center gap-1.5">
                <span class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></span>
                Đang tải đề thi...
              </div>

              <!-- Quizzes list -->
              <div v-else-if="filteredTodayQuizzes.length > 0" class="space-y-2 overflow-y-auto max-h-[220px] pr-1">
                <div v-for="quiz in filteredTodayQuizzes" :key="quiz.quizId" class="p-3 bg-emerald-50/20 border border-emerald-100 rounded-xl flex items-center justify-between gap-3 hover:bg-emerald-50/40 transition-colors">
                  <div class="min-w-0 flex-1">
                    <h5 class="font-bold text-emerald-950 text-body-xs truncate" :title="quiz.title">{{ quiz.title }}</h5>
                    <div class="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-semibold">
                      <span :class="['px-1 rounded font-bold', quiz.quizType === 'TracNghiem' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800']">
                        {{ quiz.quizType === 'TracNghiem' ? 'Trắc nghiệm' : 'Tự luận' }}
                      </span>
                      <span>• {{ quiz.durationMinutes }} phút</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 shrink-0">
                    <button @click="openSubmissionsModal(quiz)" class="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center cursor-pointer" title="Xem bài làm học sinh">
                      <span class="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                    <button @click="deleteQuiz(quiz.quizId)" class="p-1.5 rounded hover:bg-slate-100 text-rose-600 flex items-center justify-center cursor-pointer" title="Xóa đề">
                      <span class="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div v-else class="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-on-surface-variant text-body-xs flex flex-col items-center justify-center p-4">
                <span class="material-symbols-outlined text-[32px] text-slate-300 mb-1">assignment_late</span>
                <span>Chưa tạo đề kiểm tra nào cho ngày này.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>

    <!-- DIALOG: THÊM/SỬA BÀI HỌC -->
    <teleport to="body">
      <div v-if="lessonModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container">
              {{ isEditingLesson ? 'Chỉnh sửa bài giảng' : 'Thêm bài giảng mới' }}
            </h3>
            <button @click="lessonModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="space-y-3 text-[14px]">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Ngày giảng dạy</label>
              <div class="relative">
                <input
                  v-model="lessonForm.lessonDate"
                  type="date"
                  @click="$event.target.showPicker?.()"
                  @focus="$event.target.showPicker?.()"
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-body-sm focus:outline-none focus:border-primary-container cursor-pointer font-semibold"
                />
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">calendar_month</span>
              </div>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tiêu đề bài học</label>
              <input v-model="lessonForm.title" type="text" placeholder="Nhập tiêu đề..." class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tài liệu học tập (File)</label>
              <div class="relative border-2 border-dashed border-primary-container/20 hover:border-primary-container/50 rounded-xl p-4 bg-primary-container/[0.02] hover:bg-primary-container/[0.05] transition-all flex flex-col items-center justify-center text-center cursor-pointer group">
                <input
                  type="file"
                  @change="onLessonFileUpload"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  ref="lessonFileInput"
                />
                <span class="material-symbols-outlined text-[36px] text-primary-container/40 group-hover:text-primary-container/70 mb-2 transition-colors">cloud_upload</span>
                <span class="font-semibold text-body-sm text-primary-container">Nhấp chọn hoặc kéo thả file vào đây</span>
                <span class="text-[11px] text-on-surface-variant mt-1">Dung lượng tối đa: 10MB (PDF, Word, Excel, Slide, ZIP, Image...)</span>
              </div>
              <!-- Selected file label -->
              <div v-if="lessonForm.fileName" class="mt-2.5 flex items-center justify-between bg-primary-container/5 border border-primary-container/10 p-2.5 rounded-lg text-body-xs font-semibold text-primary">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="material-symbols-outlined text-[18px]">attachment</span>
                  <span class="truncate">{{ lessonForm.fileName }}</span>
                </div>
                <button @click="clearSelectedFile" class="text-rose-600 hover:text-rose-800 p-0.5 hover:bg-rose-50 rounded" title="Xóa file đã chọn">
                  <span class="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-200 pt-3">
            <button
              @click="lessonModal = false"
              class="px-4 py-2 border border-outline-variant rounded-lg font-semibold text-body-sm text-on-surface-variant hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              @click="saveLesson"
              :disabled="submittingLesson"
              class="px-4 py-2 bg-primary-container text-white rounded-lg font-semibold text-body-sm hover:bg-primary transition-all disabled:opacity-50 flex items-center gap-1"
            >
              <span v-if="submittingLesson" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              {{ isEditingLesson ? 'Lưu chỉnh sửa' : 'Đăng bài giảng' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: TẠO ĐỀ KIỂM TRA -->
    <teleport to="body">
      <div v-if="quizModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-scale-in flex flex-col max-h-[90vh]">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container">
              Tạo bài kiểm tra học tập
            </h3>
            <button @click="quizModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-4 overflow-y-auto flex-1 pr-1 text-[14px]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tiêu đề bài kiểm tra *</label>
                <input v-model="quizForm.title" type="text" placeholder="Ví dụ: Kiểm tra 15 phút bài số 2" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary-container/30" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Thời lượng (Phút) *</label>
                <input v-model.number="quizForm.durationMinutes" type="number" min="5" max="180" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary-container/30" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Hình thức kiểm tra</label>
                <select v-model="quizForm.quizType" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm focus:outline-none">
                  <option value="TracNghiem">Trắc nghiệm</option>
                  <option value="TuLuan">Tự luận</option>
                  <option value="LapTrinh">Bài tập Lập trình (AI chấm)</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Số lần làm lại tối đa *</label>
                <input v-model.number="quizForm.maxAttempts" type="number" min="1" max="100" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary-container/30" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Ngày áp dụng kiểm tra</label>
                <div class="relative">
                  <input
                    v-model="quizForm.lessonDate"
                    type="date"
                    @click="$event.target.showPicker?.()"
                    @focus="$event.target.showPicker?.()"
                    class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-body-sm focus:outline-none focus:border-primary-container cursor-pointer font-semibold"
                  />
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">calendar_month</span>
                </div>
              </div>
            </div>

            <!-- AI Quiz Generator Panel -->
            <div class="p-4 bg-purple-50/50 border border-purple-100 rounded-xl space-y-3 shrink-0">
              <div class="flex items-center justify-between">
                <span class="font-bold text-purple-800 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[20px] animate-pulse">auto_awesome</span>
                  Tạo câu hỏi bằng AI (Gemini)
                </span>
                <button 
                  type="button"
                  @click="showAiGeneratePanel = !showAiGeneratePanel" 
                  class="text-[12px] bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {{ showAiGeneratePanel ? 'Đóng bảng AI' : 'Mở bảng AI' }}
                </button>
              </div>

              <div v-if="showAiGeneratePanel" class="space-y-3 pt-2 border-t border-purple-100 text-[13px]">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Nguồn nội dung</label>
                    <select v-model="aiContentSource" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-body-sm focus:outline-none focus:border-purple-500">
                      <option value="lesson">Nội dung bài học ngày đã chọn</option>
                      <option value="custom">Chủ đề tự chọn / Yêu cầu riêng</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Số lượng câu hỏi</label>
                    <input 
                      v-model.number="aiQuestionCount" 
                      type="number" 
                      min="1" 
                      max="50" 
                      class="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-body-sm focus:outline-none focus:border-purple-500 font-semibold"
                    />
                  </div>
                </div>

                <div v-if="aiContentSource === 'custom'">
                  <label class="block font-semibold text-slate-700 mb-1">Chủ đề hoặc nội dung cần kiểm tra</label>
                  <textarea 
                    v-model="aiCustomTopic" 
                    rows="3" 
                    placeholder="Ví dụ: Lập trình hướng đối tượng C#, tính kế thừa và đa hình..." 
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-purple-500"
                  ></textarea>
                </div>

                <div class="flex justify-end pt-1">
                  <button 
                    type="button"
                    @click="generateAiQuestions" 
                    :disabled="generatingAiQuiz"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-body-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="generatingAiQuiz" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span class="material-symbols-outlined text-[16px]" v-else>auto_awesome</span>
                    Tạo đề bằng AI
                  </button>
                </div>
              </div>
            </div>

            <!-- Questions Editor -->
            <div v-if="quizForm.quizType !== 'LapTrinh'" class="space-y-3 pt-3 border-t border-slate-100">
              <div class="flex justify-between items-center">
                <h4 class="font-bold text-slate-800 text-body-md">Danh sách câu hỏi ({{ quizForm.questions.length }})</h4>
                <button
                  @click="addQuestion"
                  class="text-[12px] bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-100 transition-colors"
                >
                  <span class="material-symbols-outlined text-[14px]">add</span> Thêm câu hỏi
                </button>
              </div>

              <div class="space-y-4">
                <div v-for="(q, idx) in quizForm.questions" :key="idx" class="p-4 bg-primary-container/[0.02] border border-slate-200/80 rounded-xl space-y-3 relative">
                  <!-- Remove button -->
                  <button
                    @click="removeQuestion(idx)"
                    class="absolute top-2 right-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded p-1"
                    title="Xóa câu hỏi này"
                    v-if="quizForm.questions.length > 1"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>

                  <div class="font-bold text-primary-container text-body-xs uppercase">Câu hỏi số {{ idx + 1 }}</div>
                  
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Nội dung câu hỏi *</label>
                    <textarea v-model="q.questionText" rows="2" placeholder="Ví dụ: Đâu là thẻ HTML dùng để tạo liên kết?" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none"></textarea>
                  </div>

                  <!-- Options inputs (Only for MCQs) -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3" v-if="quizForm.quizType === 'TracNghiem'">
                    <div class="md:col-span-2">
                      <label class="block font-semibold text-slate-700 mb-1">Các phương án lựa chọn (Mỗi dòng một phương án) *</label>
                      <textarea
                        v-model="q.options"
                        rows="4"
                        placeholder="Ví dụ:&#10;A. <a>&#10;B. <link>&#10;C. href&#10;D. <url>"
                        class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm font-mono focus:outline-none"
                      ></textarea>
                    </div>
                    <div>
                      <label class="block font-semibold text-slate-700 mb-1">Đáp án đúng</label>
                      <select v-model="q.correctAnswer" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Coding Editor (LapTrinh) -->
            <div v-else class="space-y-4 pt-3 border-t border-slate-100">
              <div class="p-4 bg-purple-50/20 border border-purple-100/50 rounded-xl space-y-3">
                <div class="font-bold text-purple-800 text-body-xs uppercase">Cấu hình bài tập lập trình AI</div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Ngôn ngữ yêu cầu *</label>
                  <select v-model="quizForm.questions[0].correctAnswer" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none font-bold text-slate-700">
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="C#">C#</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Nội dung đề bài (Markdown) *</label>
                  <textarea v-model="quizForm.questions[0].questionText" rows="6" placeholder="Nhập đề bài chi tiết, ví dụ, ràng buộc..." class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none"></textarea>
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Mã nguồn khởi đầu (Starter Code) *</label>
                  <textarea v-model="quizForm.questions[0].options" rows="6" placeholder="function solve() {&#10;  // Viết mã nguồn ban đầu tại đây&#10;}" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm font-mono focus:outline-none"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-200 pt-3 shrink-0">
            <button
              @click="quizModal = false"
              class="px-4 py-2 border border-outline-variant rounded-lg font-semibold text-body-sm text-on-surface-variant hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              @click="saveQuiz"
              class="px-4 py-2 bg-primary-container text-white rounded-lg font-semibold text-body-sm hover:bg-primary transition-all flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[16px]">check</span>
              Xác nhận tạo đề
            </button>
          </div>

        </div>
      </div>
    </teleport>

    <!-- DIALOG: DANH SÁCH BÀI LÀM -->
    <teleport to="body">
      <div v-if="submissionsModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-4xl w-full p-6 space-y-4 animate-scale-in flex flex-col max-h-[85vh]">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container">
              Quản lý bài kiểm tra: {{ activeQuiz?.title }}
            </h3>
            <button @click="submissionsModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Tab Navigation -->
          <div class="flex border-b border-slate-200 shrink-0 text-body-sm font-semibold">
            <button 
              @click="submissionsActiveTab = 'list'"
              :class="['px-4 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5', submissionsActiveTab === 'list' ? 'border-primary-container text-primary-container font-bold' : 'border-transparent text-slate-500 hover:text-slate-800']"
            >
              <span class="material-symbols-outlined text-[18px]">list_alt</span>
              Danh sách bài làm ({{ submissions.length }})
            </button>
            <button 
              @click="submissionsActiveTab = 'stats'"
              :class="['px-4 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5', submissionsActiveTab === 'stats' ? 'border-primary-container text-primary-container font-bold' : 'border-transparent text-slate-500 hover:text-slate-800']"
            >
              <span class="material-symbols-outlined text-[18px]">monitoring</span>
              Phân tích & AI
            </button>
            <button 
              @click="submissionsActiveTab = 'questions'"
              :class="['px-4 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5', submissionsActiveTab === 'questions' ? 'border-primary-container text-primary-container font-bold' : 'border-transparent text-slate-500 hover:text-slate-800']"
            >
              <span class="material-symbols-outlined text-[18px]">help_outline</span>
              Thắc mắc học viên ({{ studentQuestions.length }})
            </button>
          </div>

          <!-- Tab content area -->
          <div class="overflow-y-auto flex-1 pr-1">
            
            <!-- TAB 1: SUBMISSIONS LIST -->
            <div v-if="submissionsActiveTab === 'list'" class="space-y-4">
              <div v-if="loadingSubmissions" class="text-center py-12">
                <span class="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2"></span>
                <p class="text-body-sm text-on-surface-variant">Đang tải danh sách bài làm...</p>
              </div>
              
              <div v-else-if="studentSubmissionsGrouped.length > 0" class="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <th class="py-2.5 px-4 w-12 text-center"></th>
                      <th class="py-2.5 px-4">Mã học viên</th>
                      <th class="py-2.5 px-4">Tên học viên</th>
                      <th class="py-2.5 px-4 text-center">Số lượt nộp</th>
                      <th class="py-2.5 px-4 text-center">Điểm cao nhất</th>
                      <th class="py-2.5 px-4 text-center">Điểm gần nhất</th>
                      <th class="py-2.5 px-4 text-right">Lưu điểm chính thức</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-body-sm">
                    <template v-for="g in studentSubmissionsGrouped" :key="g.studentId">
                      <tr class="hover:bg-slate-50/50 transition-colors">
                        <td class="py-3 px-4 text-center">
                          <button 
                            @click="toggleStudentExpand(g.studentId)" 
                            class="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-transform cursor-pointer"
                            :class="{ 'rotate-90': expandedStudentIds.includes(g.studentId) }"
                          >
                            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                          </button>
                        </td>
                        <td class="py-3 px-4 font-mono font-bold text-slate-500">HV-{{ String(g.studentId).padStart(4, '0') }}</td>
                        <td class="py-3 px-4 font-semibold text-primary-container">
                          {{ g.studentName }}
                        </td>
                        <td class="py-3 px-4 text-center font-bold text-slate-600">
                          {{ g.attempts.length }} lượt
                        </td>
                        <td class="py-3 px-4 text-center font-extrabold text-emerald-600 bg-emerald-500/[0.02]">
                          {{ g.bestScore.toFixed(1) }}
                        </td>
                        <td class="py-3 px-4 text-center font-semibold text-slate-500">
                          {{ g.attempts[0]?.score !== null ? g.attempts[0]?.score.toFixed(1) : '-' }}
                        </td>
                        <td class="py-3 px-4 text-right">
                          <button
                            @click="saveOfficialScore(g.studentId, g.bestScore)"
                            :disabled="savingOfficialScore[g.studentId]"
                            class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-[11px] cursor-pointer inline-flex items-center gap-1 active:scale-95 shadow-sm transition-all"
                          >
                            <span class="material-symbols-outlined text-[14px]">save</span>
                            Lưu điểm cao nhất
                          </button>
                        </td>
                      </tr>

                      <tr v-if="expandedStudentIds.includes(g.studentId)">
                        <td colspan="7" class="bg-slate-50/50 p-4 border-l-4 border-indigo-500">
                          <div class="space-y-2">
                            <div class="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                              <span class="material-symbols-outlined text-[14px]">history</span>
                              Chi tiết các lượt nộp bài
                            </div>
                            <table class="w-full text-left border border-slate-200/60 rounded-lg overflow-hidden bg-white shadow-sm">
                              <thead>
                                <tr class="bg-slate-100/70 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                                  <th class="py-2 px-3 text-center w-16">Lần làm</th>
                                  <th class="py-2 px-3">Thời gian nộp</th>
                                  <th class="py-2 px-3 text-center w-24">Điểm số</th>
                                  <th class="py-2 px-3">Gợi ý bài làm</th>
                                  <th class="py-2 px-3 text-right">Thao tác</th>
                                </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100 text-[12px]">
                                <tr v-for="(att, idx) in g.attempts" :key="att.submissionId" class="hover:bg-slate-50/30">
                                  <td class="py-2 px-3 text-center font-bold text-slate-500">
                                    Lần {{ g.attempts.length - idx }}
                                  </td>
                                  <td class="py-2 px-3 text-slate-500 font-semibold">
                                    {{ formatDate(att.submittedAt) }} {{ new Date(att.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }}
                                  </td>
                                  <td class="py-2 px-3 text-center font-extrabold" :class="att.score >= 5 ? 'text-indigo-650' : 'text-rose-500'">
                                    {{ att.score !== null ? att.score.toFixed(1) : '-' }}
                                  </td>
                                  <td class="py-2 px-3 text-slate-550 italic truncate max-w-[200px]" :title="att.teacherNote">
                                    {{ att.teacherNote || '-' }}
                                  </td>
                                  <td class="py-2 px-3 text-right space-x-1.5">
                                    <button
                                      @click="openGradingModal(att)"
                                      class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer transition-colors"
                                    >
                                      Sửa nhận xét
                                    </button>
                                    <button
                                      @click="saveOfficialScore(g.studentId, att.score)"
                                      :disabled="savingOfficialScore[g.studentId]"
                                      class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded cursor-pointer transition-colors"
                                    >
                                      Lưu điểm này
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>

              <div v-else class="text-center py-12 text-on-surface-variant/70 font-semibold flex flex-col items-center justify-center">
                <span class="material-symbols-outlined text-[36px] text-slate-300 mb-1">group</span>
                <p>Chưa có học viên nào nộp bài kiểm tra này!</p>
              </div>
            </div>

            <!-- TAB 2: STATISTICS & AI -->
            <div v-else-if="submissionsActiveTab === 'stats'" class="space-y-6">
              <div v-if="loadingStats" class="text-center py-12">
                <span class="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2"></span>
                <p class="text-body-sm text-on-surface-variant">Đang tải thống kê...</p>
              </div>

              <div v-else-if="statsData" class="space-y-6">
                <!-- Overall Stats Cards -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                    <div class="text-[11px] font-bold text-slate-500 uppercase">Lượt làm bài</div>
                    <div class="text-display-xs font-bold text-primary-container mt-1">{{ statsData.submissionCount }}</div>
                  </div>
                  <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                    <div class="text-[11px] font-bold text-slate-500 uppercase">Điểm trung bình</div>
                    <div class="text-display-xs font-bold text-primary-container mt-1">{{ statsData.averageScore?.toFixed(1) || '0.0' }}</div>
                  </div>
                  <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                    <div class="text-[11px] font-bold text-slate-500 uppercase">Điểm cao nhất</div>
                    <div class="text-display-xs font-bold text-emerald-600 mt-1">{{ statsData.maxScore?.toFixed(1) || '0.0' }}</div>
                  </div>
                  <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                    <div class="text-[11px] font-bold text-slate-500 uppercase">Điểm thấp nhất</div>
                    <div class="text-display-xs font-bold text-rose-500 mt-1">{{ statsData.minScore?.toFixed(1) || '0.0' }}</div>
                  </div>
                </div>

                <!-- AI Analysis Card -->
                <div class="p-5 bg-purple-50/40 border border-purple-100 rounded-2xl space-y-4">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100/55 pb-3">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-purple-700 animate-pulse text-[22px]">auto_awesome</span>
                      <h4 class="font-bold text-purple-950 text-body-md">Trợ lý Phân tích AI (Gemini)</h4>
                    </div>
                    <button
                      @click="generateAiSummary"
                      :disabled="generatingAiSummary || statsData.submissionCount === 0"
                      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-body-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(147,51,234,0.15)] active:scale-95 cursor-pointer"
                    >
                      <span v-if="generatingAiSummary" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                      <span v-else class="material-symbols-outlined text-[16px]">psychology</span>
                      Phân tích kết quả bằng AI
                    </button>
                  </div>

                  <div v-if="aiSummary" class="text-body-sm text-slate-800 whitespace-pre-line leading-relaxed bg-white/60 p-4 rounded-xl border border-purple-100/70 font-semibold">
                    {{ aiSummary }}
                  </div>
                  <div v-else class="text-center py-6 text-body-xs text-slate-400 font-semibold italic">
                    Nhấp vào nút "Phân tích kết quả bằng AI" ở trên để AI thống kê các điểm yếu, tỷ lệ sai lệch và đề xuất giảng giải lại cho học sinh.
                  </div>
                </div>

                <!-- Detailed Question Performance Table -->
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <h4 class="font-bold text-slate-800 text-body-sm flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-slate-500">list_alt</span>
                      Phân tích chi tiết từng câu hỏi
                    </h4>
                    <button 
                      @click="openAddQuestion" 
                      class="px-3 py-1.5 bg-primary-container hover:bg-primary text-white font-bold text-body-xs rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-[14px]">add</span>
                      Thêm câu hỏi mới
                    </button>
                  </div>

                  <div class="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                    <table class="w-full text-left border-collapse text-body-sm">
                      <thead>
                        <tr class="bg-slate-55 border-b border-slate-200/60 font-bold text-slate-600">
                          <th class="py-2.5 px-4 w-12 text-center">STT</th>
                          <th class="py-2.5 px-4">Nội dung câu hỏi</th>
                          <th class="py-2.5 px-4 text-center">Số lượt làm</th>
                          <th class="py-2.5 px-4 text-center" v-if="activeQuiz?.quizType === 'TracNghiem'">Đúng / Sai</th>
                          <th class="py-2.5 px-4 text-center" v-if="activeQuiz?.quizType === 'TracNghiem'">Tỷ lệ đúng</th>
                          <th class="py-2.5 px-4 text-right w-20">Kiểm soát</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr v-for="(qStat, index) in statsData.questionStats" :key="qStat.questionId" class="hover:bg-slate-50/50">
                          <td class="py-3 px-4 text-center font-bold text-slate-400">{{ index + 1 }}</td>
                          <td class="py-3 px-4">
                            <div class="font-semibold text-slate-800 leading-tight">{{ qStat.questionText }}</div>
                            <div v-if="qStat.options" class="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-body-xs text-slate-500 font-medium">
                              <span v-for="opt in qStat.options.split('|')" :key="opt" :class="{'text-emerald-600 font-bold': qStat.correctAnswer && opt.startsWith(qStat.correctAnswer)}">
                                {{ opt }}
                              </span>
                            </div>
                            
                            <!-- Selection breakdown of student answers -->
                            <div v-if="qStat.optionBreakdown && activeQuiz?.quizType === 'TracNghiem'" class="mt-2 p-2 bg-slate-50 border border-slate-100 rounded-lg text-body-xs font-semibold text-slate-500 space-y-1">
                              <span class="font-bold text-slate-600 block mb-0.5">Phân tích đáp án học sinh chọn:</span>
                              <div class="flex gap-4">
                                <span v-for="(count, key) in qStat.optionBreakdown" :key="key" :class="{'text-emerald-600 font-bold': key === qStat.correctAnswer}">
                                  Lựa chọn {{ key }}: {{ count }} lượt ({{ qStat.attemptCount > 0 ? Math.round((count / qStat.attemptCount) * 100) : 0 }}%)
                                </span>
                              </div>
                            </div>
                          </td>
                          <td class="py-3 px-4 text-center font-semibold text-slate-600">{{ qStat.attemptCount }}</td>
                          <td class="py-3 px-4 text-center" v-if="activeQuiz?.quizType === 'TracNghiem'">
                            <span class="text-emerald-600 font-bold">{{ qStat.correctCount }}</span>
                            <span class="text-slate-300 mx-1">/</span>
                            <span class="text-rose-500 font-bold">{{ qStat.incorrectCount }}</span>
                          </td>
                          <td class="py-3 px-4 text-center font-bold" v-if="activeQuiz?.quizType === 'TracNghiem'">
                            <span :class="[
                              qStat.successRate >= 80 ? 'text-emerald-600' :
                              qStat.successRate >= 50 ? 'text-amber-500' : 'text-rose-500'
                            ]">{{ qStat.successRate }}%</span>
                          </td>
                          <td class="py-3 px-4 text-right">
                            <div class="flex justify-end gap-1">
                              <button 
                                @click="openEditQuestion(qStat)"
                                class="p-1 text-primary-container hover:bg-slate-100 rounded cursor-pointer"
                                title="Chỉnh sửa câu hỏi"
                              >
                                <span class="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button 
                                @click="deleteQuestion(qStat.questionId)"
                                class="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                                title="Xóa câu hỏi"
                              >
                                <span class="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12 text-slate-400 font-semibold italic">
                Chưa có dữ liệu thống kê.
              </div>
            </div>

            <!-- TAB 3: STUDENT QUESTIONS -->
            <div v-else-if="submissionsActiveTab === 'questions'" class="space-y-4">
              <div v-if="loadingQuestions" class="text-center py-12">
                <span class="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2"></span>
                <p class="text-body-sm text-on-surface-variant">Đang tải thắc mắc học viên...</p>
              </div>

              <div v-else-if="studentQuestions.length > 0" class="space-y-3">
                <div 
                  v-for="q in studentQuestions" 
                  :key="q.id" 
                  class="p-4 bg-amber-50/25 border border-amber-100 rounded-xl space-y-2 relative hover:bg-amber-50/45 transition-colors"
                >
                  <div class="flex items-center justify-between text-body-xs font-bold">
                    <span class="text-amber-900 flex items-center gap-1">
                      <span class="material-symbols-outlined text-[16px]">account_circle</span>
                      {{ q.studentName }}
                    </span>
                    <span class="text-slate-400 font-semibold">{{ formatDate(q.createdAt) }}</span>
                  </div>
                  <p class="text-body-sm text-slate-800 bg-white/60 p-3 rounded-lg border border-amber-100/50 leading-relaxed font-semibold">
                    {{ q.questionText }}
                  </p>

                  <!-- Existing Answer Text -->
                  <div v-if="q.answerText" class="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-body-sm text-emerald-800 leading-normal relative font-semibold">
                    <span class="absolute top-2 right-2 flex items-center text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Đã trả lời</span>
                    <div class="font-bold text-emerald-950 flex items-center gap-1 mb-1">
                      <span class="material-symbols-outlined text-[16px]">chat</span> Phản hồi của bạn:
                    </div>
                    <p class="italic">"{{ q.answerText }}"</p>
                    <button 
                      v-if="activeReplyDoubtId !== q.id"
                      @click="openReplyDoubt(q)" 
                      class="mt-2 text-indigo-600 hover:text-indigo-800 text-[11px] font-bold underline cursor-pointer flex items-center gap-0.5 transition-colors"
                    >
                      <span class="material-symbols-outlined text-[12px]">edit</span> Sửa phản hồi
                    </button>
                  </div>

                  <!-- Reply Button if not answered -->
                  <div v-if="!q.answerText && activeReplyDoubtId !== q.id" class="mt-2 flex justify-start">
                    <button 
                      @click="openReplyDoubt(q)" 
                      class="px-3 py-1.5 bg-primary-container hover:bg-primary text-white font-bold text-body-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <span class="material-symbols-outlined text-[14px]">reply</span> Phản hồi thắc mắc
                    </button>
                  </div>

                  <!-- Reply Input Form -->
                  <div v-if="activeReplyDoubtId === q.id" class="mt-2.5 p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                    <label class="block font-bold text-slate-700 text-[11px]">Nội dung phản hồi học viên:</label>
                    <textarea 
                      v-model="replyTexts[q.id]" 
                      rows="2" 
                      class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-semibold" 
                      placeholder="Nhập phản hồi câu hỏi thắc mắc này..."
                    ></textarea>
                    <div class="flex justify-end gap-2 pt-1 border-t border-slate-100">
                      <button 
                        @click="activeReplyDoubtId = null" 
                        class="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-body-xs rounded-lg cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button 
                        @click="submitReplyDoubt(q)" 
                        :disabled="submittingReply[q.id] || !replyTexts[q.id]?.trim()" 
                        class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-body-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                      >
                        <span v-if="submittingReply[q.id]" class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                        <span class="material-symbols-outlined text-[14px]" v-else>send</span>
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12 text-slate-400 font-semibold italic flex flex-col items-center justify-center p-4">
                <span class="material-symbols-outlined text-[36px] text-amber-200 mb-1">sentiment_satisfied</span>
                <p>Học viên chưa gửi thắc mắc hay câu hỏi nào về bài kiểm tra này.</p>
              </div>
            </div>

          </div>

          <div class="flex justify-end pt-3 border-t border-slate-200 shrink-0">
            <button
              @click="submissionsModal = false"
              class="px-5 py-2.5 bg-transparent border border-outline-variant text-on-surface-variant font-semibold rounded-lg text-body-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Đóng lại
            </button>
          </div>

        </div>
      </div>
    </teleport>



    <!-- Tab 2: Thời khóa biểu tuần -->
    <div v-if="activeTab === 'timetable'" class="space-y-4 animate-fade-in">
      <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-6 shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
        <!-- Week Switcher Controls -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container">
              <span class="material-symbols-outlined text-[24px]">calendar_month</span>
            </div>
            <div>
              <h3 class="font-title-md text-body-lg font-bold text-primary-container">Lịch dạy tuần tổng quát</h3>
              <p class="text-body-sm text-on-surface-variant">Lịch dạy tổng hợp tất cả các lớp đang phụ trách trong tuần</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 bg-white/60 border border-outline-variant/30 px-3 py-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <button @click="prevWeek" class="w-8 h-8 rounded-lg hover:bg-primary-container/5 text-primary-container flex items-center justify-center cursor-pointer transition-colors active:scale-95" title="Tuần trước">
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

            <button @click="nextWeek" class="w-8 h-8 rounded-lg hover:bg-primary-container/5 text-primary-container flex items-center justify-center cursor-pointer transition-colors active:scale-95" title="Tuần sau">
              <span class="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>

            <button @click="goToToday" class="ml-1 px-3 py-1.5 rounded-lg bg-primary-container text-white text-[10px] font-extrabold uppercase hover:bg-primary transition-colors cursor-pointer active:scale-95 flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px] text-white">today</span>
              {{ todayLabel }}
            </button>
          </div>

          <span class="px-3 py-1 bg-primary-container/10 text-primary-container border border-primary-container/20 rounded-full text-body-xs font-semibold">
            Tổng cộng: {{ combinedSchedules.length }} buổi dạy / tuần
          </span>
        </div>

        <!-- Desktop View: Timetable Grid -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="calendar-grid-table w-full border-collapse border border-slate-300 text-body-sm bg-white rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
            <thead>
              <tr class="bg-[#281545] text-white">
                <th class="border border-slate-300 p-3.5 text-center font-bold w-28 text-[11px] uppercase tracking-wider bg-slate-900/90">BUỔI</th>
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
                <th class="border border-slate-300 p-3.5 text-center font-bold w-24 text-[11px] uppercase tracking-wider bg-slate-900/90">GHI CHÚ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              <tr v-for="session in ['Sáng', 'Chiều', 'Tối']" :key="session" class="hover:bg-slate-50/20">
                <td class="border border-slate-300 p-4 font-bold text-center align-middle bg-slate-50/60 text-slate-800 w-28 uppercase">
                  <div class="font-extrabold text-slate-800 text-[11px] tracking-wider flex items-center justify-center gap-1">
                    {{ session }}
                  </div>
                </td>
                
                <td 
                  v-for="day in weekDays" 
                  :key="day.value" 
                  :class="[
                    isToday(day.value) ? 'bg-indigo-50/10 border-x-2 border-x-indigo-400/30 shadow-inner' : 'bg-white',
                    'border border-slate-300 p-2.5 align-top min-w-[170px]'
                  ]"
                >
                  <div class="h-full min-h-[120px] flex flex-col justify-start items-stretch gap-2.5">
                    <div
                      v-for="s in getSchedulesForDayAndSession(day.value, session)"
                      :key="s.scheduleId"
                      @click="showDetailsModal(s, day.value)"
                      class="bg-indigo-50/40 border-l-4 border-l-indigo-500 border-indigo-400 text-indigo-900 shadow-sm w-full p-3 rounded-lg border-2 text-left space-y-1.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
                    >
                      <div class="text-[12px] font-extrabold leading-tight text-slate-800">
                        {{ s.courseName }}
                      </div>
                      <div class="text-[10px] opacity-75 font-semibold truncate text-slate-500" :title="s.className">
                        {{ s.className }}
                      </div>
                      <div class="text-[10px] opacity-75 font-semibold flex items-center gap-1 text-slate-600">
                        <span class="material-symbols-outlined text-[12px] shrink-0">meeting_room</span>
                        <span>{{ formatRoom(s.room) }}</span>
                      </div>
                      <div class="text-[10px] opacity-75 font-semibold flex items-center gap-1 text-slate-600">
                        <span class="material-symbols-outlined text-[12px] shrink-0">schedule</span>
                        <span>{{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="border border-slate-300 p-3 bg-white"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile View -->
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
              <span v-if="getSchedulesForDay(day.value).length === 0" class="text-body-xs text-on-surface-variant/60 font-medium">Nghỉ dạy</span>
              <span v-else class="px-2.5 py-0.5 bg-primary-container/10 text-primary-container rounded-full text-body-xs font-bold border border-primary-container/20">
                {{ getSchedulesForDay(day.value).length }} buổi dạy
              </span>
            </div>

            <div v-if="getSchedulesForDay(day.value).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="s in getSchedulesForDay(day.value)"
                :key="s.scheduleId"
                @click="showDetailsModal(s, day.value)"
                class="bg-indigo-50/50 border-l-4 border-l-indigo-500 border-indigo-400 text-indigo-900 shadow-sm p-4 rounded-xl border-2 flex flex-col justify-between gap-3 transition-colors cursor-pointer"
              >
                <div class="space-y-1 flex-1">
                  <div class="text-body-sm font-bold text-slate-800">
                    {{ s.courseName }}
                  </div>
                  <div class="text-body-xs font-semibold opacity-85 text-slate-500">{{ s.className }}</div>
                  <div class="text-body-xs flex items-center gap-1 opacity-75 mt-1 font-semibold text-slate-600">
                    <span class="material-symbols-outlined text-[14px]">meeting_room</span>
                    <span>{{ formatRoom(s.room) }}</span>
                  </div>
                  <div class="text-body-xs flex items-center gap-1 opacity-75 font-semibold text-slate-600">
                    <span class="material-symbols-outlined text-[14px]">schedule</span>
                    <span>{{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Tab 3: Yêu cầu hỗ trợ -->
    <div v-if="activeTab === 'support'" class="space-y-6 animate-fade-in">
      <div class="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 border border-slate-200/50 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-indigo-600 text-[26px]">support_agent</span>
          </div>
          <div>
            <h3 class="font-title-md text-body-lg font-bold text-primary-container">Trung tâm hỗ trợ Giảng viên</h3>
            <p class="text-body-sm text-readable-secondary mt-1">
              Gửi yêu cầu đổi lịch dạy, báo sự cố phòng học hoặc các yêu cầu kỹ thuật trực tiếp cho Ban quản lý.
            </p>
          </div>
        </div>
        <button
          @click="supportDialog = true"
          class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-body-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md shrink-0"
        >
          <span class="material-symbols-outlined text-[18px]">add_comment</span>
          Gửi yêu cầu hỗ trợ mới
        </button>
      </div>

      <!-- Unified History -->
      <div class="bg-white/70 border border-slate-200/50 shadow-sm rounded-xl overflow-hidden p-6 space-y-4">
        <h3 class="font-bold text-primary-container text-body-lg flex items-center gap-2 border-b pb-3 border-slate-100">
          <span class="material-symbols-outlined text-[20px]">history</span>
          Lịch sử gửi yêu cầu
        </h3>

        <div v-if="loadingSupport" class="text-center py-12">
          <span class="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2"></span>
          <p class="text-body-sm text-on-surface-variant">Đang tải lịch sử yêu cầu...</p>
        </div>

        <div v-else-if="supportMessages.length === 0" class="text-center py-12 text-on-surface-variant font-medium">
          Chưa có yêu cầu hỗ trợ nào được tạo.
        </div>

        <div v-else class="space-y-4 divide-y divide-slate-100">
          <div v-for="item in supportMessages" :key="item.id" class="pt-4 first:pt-0 space-y-2">
            <div class="flex items-center justify-between text-body-xs font-bold">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border" :class="[
                item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                item.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              ]">{{ item.status === 'Resolved' ? 'Đã duyệt' : item.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt' }}</span>
              <span class="text-slate-400 font-semibold">{{ formatDate(item.createdAt) }}</span>
            </div>

            <p class="text-body-sm text-slate-800 bg-slate-50 p-4 rounded-xl leading-relaxed font-semibold">
              {{ item.message }}
            </p>

            <div v-if="item.adminResponse" class="p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-body-sm text-indigo-950 font-semibold leading-relaxed">
              <div class="font-bold flex items-center gap-1 mb-1 text-indigo-900">
                <span class="material-symbols-outlined text-[16px]">reply</span>
                Phản hồi từ Admin:
              </div>
              <p class="italic">"{{ item.adminResponse }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <teleport to="body">
      <div v-if="detailsModalOpen" class="fixed inset-0 glass-backdrop z-[99999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="font-bold text-primary-container text-[16px] flex items-center gap-1.5">
              <span class="material-symbols-outlined">info</span>
              Chi tiết buổi học
            </h3>
            <button @click="closeDetailsModal" class="text-on-surface-variant hover:text-primary-container cursor-pointer flex items-center justify-center">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-3 text-[14px]">
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div class="font-bold text-slate-800">{{ activeDetailsSchedule?.courseName }}</div>
              <div class="text-body-xs font-semibold text-slate-500">{{ activeDetailsSchedule?.className }}</div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2 text-slate-650">
                <span class="material-symbols-outlined text-[18px]">meeting_room</span>
                <span><strong>Phòng học:</strong> {{ formatRoom(activeDetailsSchedule?.room) }}</span>
              </div>
              <div class="flex items-center gap-2 text-slate-650">
                <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                <span><strong>Ngày dạy:</strong> {{ activeDetailsScheduleDate }}</span>
              </div>
              <div class="flex items-center gap-2 text-slate-650">
                <span class="material-symbols-outlined text-[18px]">schedule</span>
                <span><strong>Khung giờ:</strong> {{ activeDetailsSchedule?.startTime.substring(0, 5) }} - {{ activeDetailsSchedule?.endTime.substring(0, 5) }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              @click="goToClassLessons(activeDetailsSchedule)"
              class="px-4 py-2 bg-primary-container text-white rounded-lg font-semibold text-body-sm hover:bg-primary transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              Xem nội dung bài dạy
            </button>
            <button
              @click="requestSupportForSession(activeDetailsSchedule, activeDetailsScheduleDate)"
              class="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg font-semibold text-body-sm hover:bg-indigo-100 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span class="material-symbols-outlined text-[16px]">chat</span>
              Yêu cầu hỗ trợ
            </button>
            <button
              @click="closeDetailsModal"
              class="px-4 py-2 border border-outline-variant rounded-lg font-semibold text-body-sm text-on-surface-variant hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Dialog: Support Request Modal -->
    <teleport to="body">
      <div v-if="supportDialog" class="fixed inset-0 glass-backdrop z-[99999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full p-6 space-y-4 animate-scale-in flex flex-col">
          <div class="flex items-center gap-3 text-primary-container border-b border-white/40 pb-3 justify-between">
            <h3 class="font-title-md text-[18px] font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-[24px] text-indigo-600">chat</span>
              Gửi yêu cầu hỗ trợ mới
            </h3>
            <button @click="supportDialog = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Chọn lớp học cần hỗ trợ *</label>
              <select
                v-model="supportForm.classId"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container transition-all cursor-pointer font-semibold text-slate-700"
              >
                <option :value="null" disabled>-- Chọn lớp học --</option>
                <option v-for="cls in classes" :key="cls.classId" :value="cls.classId">
                  {{ cls.courseName }} ({{ cls.className }})
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Loại yêu cầu hỗ trợ *</label>
              <select
                v-model="supportForm.supportType"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container transition-all cursor-pointer font-semibold text-slate-700"
              >
                <option value="Reschedule">🔄 Yêu cầu đổi lịch dạy</option>
                <option value="Technical">💻 Hỗ trợ kỹ thuật / Phòng học</option>
                <option value="Other">📝 Ý kiến đóng góp / Khác</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container block">Nội dung yêu cầu hỗ trợ *</label>
              <textarea
                v-model="supportForm.message"
                rows="3"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm text-primary placeholder-on-surface-variant/50 focus:outline-none focus:border-on-tertiary-container transition-all resize-none font-semibold text-slate-700"
                placeholder="Nhập lý do đổi lịch hoặc mô tả sự cố kỹ thuật..."
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-white/40">
            <button
              @click="supportDialog = false"
              class="px-4 py-2 rounded-lg border border-slate-200 text-on-surface-variant font-semibold text-[13px] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="submitSupportMessage"
              :disabled="submittingSupport || !supportForm.message.trim() || !supportForm.classId"
              class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="submittingSupport" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Gửi yêu cầu
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: CHẤM ĐIỂM CHI TIẾT BÀI NỘP -->
    <teleport to="body">
      <div v-if="gradingSubmissionModal" class="fixed inset-0 glass-backdrop z-[99999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="font-bold text-primary-container text-[16px] flex items-center gap-1">
              <span class="material-symbols-outlined text-on-tertiary-container">edit_note</span>
              Chấm điểm: {{ activeSubmission?.studentName }}
            </h3>
            <button @click="gradingSubmissionModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-3 text-[14px]">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Điểm số (0 - 10) *</label>
              <input v-model.number="gradeForm.score" type="number" min="0" max="10" step="0.1" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm font-bold text-primary-container text-center" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nhận xét của giáo viên</label>
              <textarea v-model="gradeForm.teacherNote" rows="3" placeholder="Nhập lời phê, nhận xét bài làm..." class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm focus:outline-none"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              @click="gradingSubmissionModal = false"
              class="px-4 py-2 border border-outline-variant rounded-lg font-semibold text-body-sm text-on-surface-variant hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              @click="submitGrade"
              class="px-4 py-2 bg-primary-container text-white rounded-lg font-semibold text-body-sm hover:bg-primary transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              Hoàn tất chấm điểm
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: CHỈNH SỬA CÂU HỎI -->
    <teleport to="body">
      <div v-if="showEditQuestionModal" class="fixed inset-0 glass-backdrop z-[999999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="font-bold text-primary-container text-[16px] flex items-center gap-1">
              <span class="material-symbols-outlined text-primary-container">edit</span>
              Chỉnh sửa câu hỏi
            </h3>
            <button @click="showEditQuestionModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer flex items-center justify-center">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-4 text-[14px]">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nội dung câu hỏi *</label>
              <textarea v-model="editingQuestion.questionText" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-semibold" placeholder="Nhập câu hỏi..."></textarea>
            </div>
            
            <div v-if="activeQuiz?.quizType === 'TracNghiem'">
              <label class="block font-semibold text-slate-700 mb-1">Các lựa chọn đáp án (Mỗi dòng một lựa chọn) *</label>
              <textarea v-model="editingQuestion.options" rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-mono" placeholder="Ví dụ:&#13;A. Lựa chọn 1&#13;B. Lựa chọn 2&#13;C. Lựa chọn 3&#13;D. Lựa chọn 4"></textarea>
              <p class="text-[10px] text-slate-400 mt-1 italic font-semibold">Định dạng khuyên dùng: Bắt đầu mỗi dòng bằng kí tự chữ cái (A., B., C., D.) để hệ thống hiển thị chính xác.</p>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                {{ activeQuiz?.quizType === 'TracNghiem' ? 'Đáp án đúng *' : 'Đáp án gợi ý / Từ khóa *' }}
              </label>
              <select v-if="activeQuiz?.quizType === 'TracNghiem'" v-model="editingQuestion.correctAnswer" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-bold text-slate-700">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <textarea v-else v-model="editingQuestion.correctAnswer" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-semibold" placeholder="Nhập đáp án mẫu gợi ý..."></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              @click="showEditQuestionModal = false"
              class="px-4 py-2 border border-outline-variant rounded-lg font-semibold text-body-sm text-on-surface-variant hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              @click="saveQuestion"
              class="px-4 py-2 bg-primary-container text-white rounded-lg font-semibold text-body-sm hover:bg-primary transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: THÊM CÂU HỎI MỚI -->
    <teleport to="body">
      <div v-if="showAddQuestionModal" class="fixed inset-0 glass-backdrop z-[999999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="font-bold text-primary-container text-[16px] flex items-center gap-1">
              <span class="material-symbols-outlined text-primary-container">add_box</span>
              Thêm câu hỏi mới
            </h3>
            <button @click="showAddQuestionModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer flex items-center justify-center">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-4 text-[14px]">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nội dung câu hỏi *</label>
              <textarea v-model="newQuestionForm.questionText" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-semibold" placeholder="Nhập câu hỏi..."></textarea>
            </div>
            
            <div v-if="activeQuiz?.quizType === 'TracNghiem'">
              <label class="block font-semibold text-slate-700 mb-1">Các lựa chọn đáp án (Mỗi dòng một lựa chọn) *</label>
              <textarea v-model="newQuestionForm.options" rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-mono" placeholder="Ví dụ:&#13;A. Lựa chọn 1&#13;B. Lựa chọn 2&#13;C. Lựa chọn 3&#13;D. Lựa chọn 4"></textarea>
              <p class="text-[10px] text-slate-400 mt-1 italic font-semibold">Định dạng khuyên dùng: Bắt đầu mỗi dòng bằng kí tự chữ cái (A., B., C., D.) để hệ thống hiển thị chính xác.</p>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                {{ activeQuiz?.quizType === 'TracNghiem' ? 'Đáp án đúng *' : 'Đáp án gợi ý / Từ khóa *' }}
              </label>
              <select v-if="activeQuiz?.quizType === 'TracNghiem'" v-model="newQuestionForm.correctAnswer" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-bold text-slate-700">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <textarea v-else v-model="newQuestionForm.correctAnswer" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-container font-semibold" placeholder="Nhập đáp án mẫu gợi ý..."></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              @click="showAddQuestionModal = false"
              class="px-4 py-2 border border-outline-variant rounded-lg font-semibold text-body-sm text-on-surface-variant hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              @click="saveNewQuestion"
              class="px-4 py-2 bg-primary-container text-white rounded-lg font-semibold text-body-sm hover:bg-primary transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              Lưu lại
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
import { useAuthStore, useCourseStore } from '../../stores'
import api from '../../services/api'

const route = useRoute()
const authStore = useAuthStore()
const courseStore = useCourseStore()
const showSnackbar = inject('showSnackbar')

// Role determination helpers
const isTeacher = computed(() => authStore.currentUser?.role === 'GiaoVien' || authStore.isTeacher)
const isAdmin = computed(() => authStore.currentUser?.role === 'Admin' || authStore.isAdmin)

// Filters State
const filters = ref({
  courseId: null,
  teacherId: null,
  search: ''
})

// Lists State
const teachers = ref([])
const classes = ref([])
const loadingClasses = ref(false)

// Selected State
const selectedClass = ref(null)
const selectedDate = ref(new Date().toLocaleDateString('en-CA')) // YYYY-MM-DD local format

// Today's contents State
const todayLesson = ref(null)
const loadingTodayLesson = ref(false)
const classQuizzes = ref([])
const loadingClassQuizzes = ref(false)

// Modals togglers
const lessonModal = ref(false)
const isEditingLesson = ref(false)
const submittingLesson = ref(false)
const lessonFileInput = ref(null)
const lessonForm = ref({
  lessonId: null,
  title: '',
  content: '',
  fileName: '',
  lessonDate: ''
})
const quizModal = ref(false)
const quizForm = ref({
  title: '',
  durationMinutes: 15,
  quizType: 'TracNghiem',
  lessonDate: '',
  questions: [
    { questionText: '', options: '', correctAnswer: 'A' }
  ]
})

watch(() => quizForm.value.quizType, (newType) => {
  if (newType === 'LapTrinh') {
    quizForm.value.questions = [
      { 
        questionText: '# Bài toán cộng hai số\n\nViết hàm sum(a, b) nhận vào hai số nguyên a và b. Trả về tổng của chúng.', 
        options: 'function sum(a, b) {\n  // Viết mã nguồn tại đây\n  \n}', 
        correctAnswer: 'JavaScript' 
      }
    ]
  } else {
    quizForm.value.questions = [
      { questionText: '', options: '', correctAnswer: 'A' }
    ]
  }
})

// AI Quiz generation state
const showAiGeneratePanel = ref(false)
const aiContentSource = ref('lesson')
const aiCustomTopic = ref('')
const aiQuestionCount = ref(5)
const generatingAiQuiz = ref(false)

const submissionsModal = ref(false)
const activeQuiz = ref(null)
const submissions = ref([])
const loadingSubmissions = ref(false)

const expandedStudentIds = ref([])
function toggleStudentExpand(studentId) {
  const index = expandedStudentIds.value.indexOf(studentId)
  if (index > -1) {
    expandedStudentIds.value.splice(index, 1)
  } else {
    expandedStudentIds.value.push(studentId)
  }
}

const studentSubmissionsGrouped = computed(() => {
  const groups = {}
  submissions.value.forEach(sub => {
    if (!groups[sub.studentId]) {
      groups[sub.studentId] = {
        studentId: sub.studentId,
        studentName: sub.studentName,
        attempts: []
      }
    }
    groups[sub.studentId].attempts.push(sub)
  })
  
  // Sort attempts by SubmittedAt descending
  Object.values(groups).forEach(g => {
    g.attempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    
    // Calculate best score
    const scores = g.attempts.map(a => a.score).filter(s => s !== null && s !== undefined)
    g.bestScore = scores.length > 0 ? Math.max(...scores) : 0
  })
  
  return Object.values(groups)
})

const savingOfficialScore = ref({})
async function saveOfficialScore(studentId, score) {
  savingOfficialScore.value[studentId] = true
  try {
    await api.post(`/api/v1/quizzes/${activeQuiz.value.quizId}/save-official-score`, {
      studentId,
      score
    })
    showSnackbar('Lưu điểm chính thức thành công!', 'success')
    // Refresh submissions
    const res = await api.get(`/api/v1/quizzes/${activeQuiz.value.quizId}/submissions`)
    submissions.value = res.data || []
  } catch (e) {
    console.error('Error saving official score:', e)
    showSnackbar(e.response?.data?.message || 'Lỗi khi lưu điểm chính thức', 'error')
  } finally {
    savingOfficialScore.value[studentId] = false
  }
}

const submissionsActiveTab = ref('list')
const statsData = ref(null)
const loadingStats = ref(false)
const studentQuestions = ref([])
const loadingQuestions = ref(false)
const generatingAiSummary = ref(false)
const aiSummary = ref('')

const gradingSubmissionModal = ref(false)
const activeSubmission = ref(null)
const gradeForm = ref({
  score: '',
  teacherNote: ''
})

const showEditQuestionModal = ref(false)
const editingQuestion = ref(null)
const showAddQuestionModal = ref(false)
const newQuestionForm = ref({
  questionText: '',
  options: '',
  correctAnswer: 'A'
})

const activeReplyDoubtId = ref(null)
const replyTexts = ref({})
const submittingReply = ref({})

// Debounce timer for search input
let searchTimeout = null
function debouncedFetch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchClasses()
  }, 350)
}

// Fetch lists
async function fetchTeachers() {
  if (!isAdmin.value) return
  try {
    const { data } = await api.get('/api/v1/users/teachers')
    teachers.value = data || []
  } catch (error) {
    console.error('Error fetching teachers:', error)
  }
}

async function fetchClasses() {
  loadingClasses.value = true
  try {
    let targetTeacherId = filters.value.teacherId
    if (isTeacher.value) {
      targetTeacherId = authStore.currentUser?.userId
    }
    const params = {
      courseId: filters.value.courseId || null,
      teacherId: targetTeacherId || null,
      search: filters.value.search || '',
      pageSize: 100
    }
    const { data } = await api.get('/api/v1/classes', { params })
    classes.value = data.items || []
  } catch (error) {
    console.error('Error fetching classes:', error)
    showSnackbar('Không thể tải danh sách lớp học', 'error')
  } finally {
    loadingClasses.value = false
  }
}

function selectClass(record) {
  selectedClass.value = record
}

// Lessons & Quizzes methods
const filteredTodayQuizzes = computed(() => {
  if (!selectedDate.value) return []
  return classQuizzes.value.filter(q => {
    if (!q.lessonDate) return false
    return q.lessonDate.substring(0, 10) === selectedDate.value
  })
})

async function fetchTodayLessonAndQuizzes() {
  if (!selectedClass.value) return
  const classId = selectedClass.value.classId
  
  // 1. Fetch lesson for selected class & date
  loadingTodayLesson.value = true
  todayLesson.value = null
  try {
    const res = await api.get(`/api/v1/lessons/class/${classId}/date/${selectedDate.value}`)
    todayLesson.value = res.data
  } catch (e) {
    // Expected 404 if no lesson is uploaded for this date
    if (e.response?.status !== 404) {
      console.error('Error fetching today lesson:', e)
    }
  } finally {
    loadingTodayLesson.value = false
  }

  // 2. Fetch all quizzes for this class
  loadingClassQuizzes.value = true
  classQuizzes.value = []
  try {
    const res = await api.get(`/api/v1/quizzes/class/${classId}`)
    classQuizzes.value = res.data || []
  } catch (e) {
    console.error('Error fetching class quizzes:', e)
  } finally {
    loadingClassQuizzes.value = false
  }
}

watch([selectedClass, selectedDate], () => {
  fetchTodayLessonAndQuizzes()
})

// Lesson Modal actions
function openAddLessonModal() {
  isEditingLesson.value = false
  lessonForm.value = {
    lessonId: null,
    title: '',
    content: '',
    fileName: '',
    lessonDate: selectedDate.value
  }
  if (lessonFileInput.value) {
    lessonFileInput.value.value = ''
  }
  lessonModal.value = true
}

function openEditLessonModal(lesson) {
  isEditingLesson.value = true
  const dateObj = new Date(lesson.lessonDate)
  const yyyy = dateObj.getFullYear()
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
  const dd = String(dateObj.getDate()).padStart(2, '0')
  lessonForm.value = {
    lessonId: lesson.lessonId,
    title: lesson.title,
    content: lesson.content || '',
    fileName: lesson.fileName || '',
    lessonDate: `${yyyy}-${mm}-${dd}`
  }
  if (lessonFileInput.value) {
    lessonFileInput.value.value = ''
  }
  lessonModal.value = true
}

async function onLessonFileUpload(e) {
  const files = Array.from(e.target.files)
  if (files.length === 0) return
  const file = files[0]
  if (file.size > 10 * 1024 * 1024) {
    showSnackbar(`File "${file.name}" quá lớn, dung lượng tối đa là 10MB`, 'error')
    if (lessonFileInput.value) lessonFileInput.value.value = ''
    return
  }
  const reader = new FileReader()
  const promise = new Promise((resolve) => {
    reader.onload = () => resolve(reader.result)
  })
  reader.readAsDataURL(file)
  const base64 = await promise
  lessonForm.value.content = base64
  lessonForm.value.fileName = file.name
}

function clearSelectedFile() {
  lessonForm.value.content = ''
  lessonForm.value.fileName = ''
  if (lessonFileInput.value) {
    lessonFileInput.value.value = ''
  }
}

async function saveLesson() {
  if (submittingLesson.value) return

  const titleVal = lessonForm.value.title ? String(lessonForm.value.title).trim() : ''
  if (!titleVal) {
    showSnackbar('Vui lòng nhập tiêu đề bài học', 'warning')
    return
  }
  if (!lessonForm.value.content) {
    showSnackbar('Vui lòng chọn file tài liệu bài học', 'warning')
    return
  }

  submittingLesson.value = true
  try {
    const payload = {
      classId: selectedClass.value.classId,
      lessonDate: lessonForm.value.lessonDate,
      title: titleVal,
      content: lessonForm.value.content,
      fileName: lessonForm.value.fileName
    }
    
    await api.post('/api/v1/lessons', payload, {
      timeout: 120000 // 2 minutes timeout for base64 file upload
    })
    
    showSnackbar('Lưu bài học thành công', 'success')
    lessonModal.value = false
    fetchTodayLessonAndQuizzes()
  } catch (e) {
    console.error("Save lesson error:", e)
    const serverMsg = e.response?.data?.message || e.message || 'Lỗi lưu bài học'
    showSnackbar(`Lỗi lưu bài học: ${serverMsg}`, 'error')
  } finally {
    submittingLesson.value = false
  }
}

async function deleteLesson(id) {
  if (!confirm('Bạn có chắc muốn xóa bài học này?')) return
  try {
    await api.delete(`/api/v1/lessons/${id}`)
    showSnackbar('Xóa bài học thành công', 'success')
    fetchTodayLessonAndQuizzes()
  } catch (e) {
    showSnackbar('Lỗi xóa bài học', 'error')
  }
}

const downloadingFileId = ref(null)
async function downloadLessonFile(lesson) {
  if (downloadingFileId.value) return
  downloadingFileId.value = lesson.lessonId
  try {
    const res = await api.get(`/api/v1/lessons/${lesson.lessonId}`)
    const fullLesson = res.data
    if (!fullLesson || !fullLesson.content) {
      showSnackbar('Không tìm thấy tài liệu bài học', 'error')
      return
    }
    const link = document.createElement('a')
    link.href = fullLesson.content
    link.download = fullLesson.fileName || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    showSnackbar('Lỗi tải tài liệu bài học', 'error')
  } finally {
    downloadingFileId.value = null
  }
}

// Quiz Modal actions
function openAddQuizModal() {
  quizForm.value = {
    title: '',
    durationMinutes: 15,
    quizType: 'TracNghiem',
    maxAttempts: 1,
    lessonDate: selectedDate.value,
    questions: [
      { questionText: '', options: '', correctAnswer: 'A' }
    ]
  }
  showAiGeneratePanel.value = false
  aiCustomTopic.value = ''
  aiContentSource.value = 'lesson'
  aiQuestionCount.value = 5
  quizModal.value = true
}

function addQuestion() {
  quizForm.value.questions.push({
    questionText: '',
    options: '',
    correctAnswer: 'A'
  })
}

function removeQuestion(index) {
  quizForm.value.questions.splice(index, 1)
}

async function generateAiQuestions() {
  if (aiContentSource.value === 'custom' && !aiCustomTopic.value.trim()) {
    showSnackbar('Vui lòng nhập chủ đề sinh câu hỏi', 'error')
    return
  }
  
  generatingAiQuiz.value = true
  try {
    const payload = {
      classId: selectedClass.value.classId,
      lessonDate: aiContentSource.value === 'lesson' ? (quizForm.value.lessonDate || null) : null,
      customTopic: aiContentSource.value === 'custom' ? aiCustomTopic.value : null,
      questionCount: aiQuestionCount.value,
      quizType: quizForm.value.quizType
    }
    
    const res = await api.post('/api/v1/quizzes/generate-ai', payload, {
      timeout: 120000 // 2 minutes timeout for Gemini AI generation
    })
    const questions = res.data || []
    
    if (questions.length === 0) {
      showSnackbar('AI không trả về câu hỏi nào. Vui lòng thử lại.', 'error')
      return
    }
    
    quizForm.value.questions = questions.map(q => {
      let formattedOptions = ''
      if (quizForm.value.quizType === 'TracNghiem' && q.options) {
        formattedOptions = q.options.replace(/\|/g, '\n')
      }
      return {
        questionText: q.questionText || '',
        options: formattedOptions,
        correctAnswer: q.correctAnswer || 'A'
      }
    })
    
    showSnackbar(`Đã tạo thành công ${questions.length} câu hỏi bằng AI!`, 'success')
    showAiGeneratePanel.value = false
  } catch (e) {
    console.error('Error generating AI quiz:', e)
    showSnackbar(e.response?.data?.message || 'Lỗi xảy ra khi sinh đề bằng AI.', 'error')
  } finally {
    generatingAiQuiz.value = false
  }
}

async function saveQuiz() {
  if (!quizForm.value.title.trim()) {
    showSnackbar('Vui lòng nhập tiêu đề bài kiểm tra', 'error')
    return
  }
  if (quizForm.value.questions.length === 0) {
    showSnackbar('Vui lòng thêm ít nhất một câu hỏi', 'error')
    return
  }
  
  const formattedQuestions = quizForm.value.questions.map(q => {
    let optStr = null
    if (quizForm.value.quizType === 'TracNghiem') {
      optStr = (q.options || '').replace(/\r?\n/g, '|')
    }
    return {
      questionText: q.questionText,
      options: optStr,
      correctAnswer: q.correctAnswer
    }
  })
  
  try {
    await api.post('/api/v1/quizzes', {
      classId: selectedClass.value.classId,
      title: quizForm.value.title,
      durationMinutes: quizForm.value.durationMinutes,
      quizType: quizForm.value.quizType,
      maxAttempts: quizForm.value.maxAttempts || 1,
      lessonDate: quizForm.value.lessonDate || null,
      questions: formattedQuestions
    })
    showSnackbar('Tạo đề kiểm tra thành công', 'success')
    quizModal.value = false
    fetchTodayLessonAndQuizzes()
  } catch (e) {
    showSnackbar('Lỗi khi lưu đề thi', 'error')
  }
}

async function deleteQuiz(id) {
  if (!confirm('Bạn có chắc muốn xóa đề thi này?')) return
  try {
    await api.delete(`/api/v1/quizzes/${id}`)
    showSnackbar('Xóa đề thi thành công', 'success')
    fetchTodayLessonAndQuizzes()
  } catch (e) {
    showSnackbar('Lỗi xóa đề thi', 'error')
  }
}

// Submissions lists methods
async function openSubmissionsModal(quiz) {
  activeQuiz.value = quiz
  submissionsModal.value = true
  submissionsActiveTab.value = 'list'
  loadingSubmissions.value = true
  aiSummary.value = ''
  
  try {
    const res = await api.get(`/api/v1/quizzes/${quiz.quizId}/submissions`)
    submissions.value = res.data || []
  } catch (e) {
    showSnackbar('Lỗi tải danh sách bài nộp', 'error')
  } finally {
    loadingSubmissions.value = false
  }

  fetchQuizStatistics(quiz.quizId)
  fetchStudentQuestions(quiz.quizId)
}

async function fetchQuizStatistics(quizId) {
  loadingStats.value = true
  statsData.value = null
  try {
    const res = await api.get(`/api/v1/quizzes/${quizId}/statistics`)
    statsData.value = res.data
  } catch (e) {
    console.error('Error fetching quiz statistics:', e)
  } finally {
    loadingStats.value = false
  }
}

async function fetchStudentQuestions(quizId) {
  loadingQuestions.value = true
  studentQuestions.value = []
  try {
    const res = await api.get(`/api/v1/quizzes/${quizId}/questions`)
    studentQuestions.value = res.data || []
  } catch (e) {
    console.error('Error fetching student questions:', e)
  } finally {
    loadingQuestions.value = false
  }
}

async function generateAiSummary() {
  if (!activeQuiz.value) return
  generatingAiSummary.value = true
  try {
    const res = await api.post(`/api/v1/quizzes/${activeQuiz.value.quizId}/ai-summary`, {}, {
      timeout: 120000 // 2 minutes timeout for Gemini AI summary
    })
    aiSummary.value = res.data?.summary || 'Không thể lấy kết quả phân tích AI.'
    showSnackbar('Tạo tóm tắt phân tích bằng AI thành công!', 'success')
  } catch (e) {
    console.error('Error generating AI summary:', e)
    showSnackbar(e.response?.data?.message || 'Lỗi phân tích AI', 'error')
  } finally {
    generatingAiSummary.value = false
  }
}

function openEditQuestion(qStat) {
  editingQuestion.value = {
    questionId: qStat.questionId,
    questionText: qStat.questionText,
    options: qStat.options ? qStat.options.replace(/\|/g, '\n') : '',
    correctAnswer: qStat.correctAnswer || 'A'
  }
  showEditQuestionModal.value = true
}

async function saveQuestion() {
  if (!editingQuestion.value.questionText.trim()) {
    showSnackbar('Vui lòng nhập nội dung câu hỏi', 'error')
    return
  }
  const optStr = activeQuiz.value.quizType === 'TracNghiem' 
    ? (editingQuestion.value.options || '').replace(/\r?\n/g, '|')
    : null
  try {
    await api.put(`/api/v1/quizzes/questions/${editingQuestion.value.questionId}`, {
      questionText: editingQuestion.value.questionText,
      options: optStr,
      correctAnswer: editingQuestion.value.correctAnswer
    })
    showSnackbar('Cập nhật câu hỏi thành công', 'success')
    showEditQuestionModal.value = false
    fetchQuizStatistics(activeQuiz.value.quizId)
  } catch (e) {
    console.error('Error updating question:', e)
    showSnackbar('Lỗi cập nhật câu hỏi', 'error')
  }
}

async function deleteQuestion(qId) {
  if (!confirm('Bạn có chắc muốn xóa câu hỏi này khỏi đề thi? Kết quả điểm các bài thi cũ sẽ không tự động tính lại.')) return
  try {
    await api.delete(`/api/v1/quizzes/questions/${qId}`)
    showSnackbar('Xóa câu hỏi thành công', 'success')
    fetchQuizStatistics(activeQuiz.value.quizId)
  } catch (e) {
    console.error('Error deleting question:', e)
    showSnackbar('Lỗi xóa câu hỏi', 'error')
  }
}

function openAddQuestion() {
  newQuestionForm.value = {
    questionText: '',
    options: '',
    correctAnswer: 'A'
  }
  showAddQuestionModal.value = true
}

async function saveNewQuestion() {
  if (!newQuestionForm.value.questionText.trim()) {
    showSnackbar('Vui lòng nhập nội dung câu hỏi', 'error')
    return
  }
  const optStr = activeQuiz.value.quizType === 'TracNghiem' 
    ? (newQuestionForm.value.options || '').replace(/\r?\n/g, '|')
    : null
  try {
    await api.post(`/api/v1/quizzes/${activeQuiz.value.quizId}/questions-admin`, {
      questionText: newQuestionForm.value.questionText,
      options: optStr,
      correctAnswer: newQuestionForm.value.correctAnswer
    })
    showSnackbar('Thêm câu hỏi mới thành công', 'success')
    showAddQuestionModal.value = false
    fetchQuizStatistics(activeQuiz.value.quizId)
  } catch (e) {
    console.error('Error adding question:', e)
    showSnackbar('Lỗi thêm câu hỏi mới', 'error')
  }
}


function openReplyDoubt(q) {
  activeReplyDoubtId.value = q.id
  replyTexts.value[q.id] = q.answerText || ''
}

async function submitReplyDoubt(q) {
  const text = replyTexts.value[q.id]?.trim()
  if (!text) return
  submittingReply.value[q.id] = true
  try {
    await api.put(`/api/v1/quizzes/questions/${q.id}/answer`, {
      answerText: text
    })
    showSnackbar('Gửi phản hồi thắc mắc thành công!', 'success')
    activeReplyDoubtId.value = null
    fetchStudentQuestions(activeQuiz.value.quizId)
  } catch (e) {
    console.error('Error answering student question:', e)
    showSnackbar('Lỗi gửi phản hồi thắc mắc', 'error')
  } finally {
    submittingReply.value[q.id] = false
  }
}

async function checkQueryOpenQuiz() {
  const quizId = route.query.openQuizId
  const classId = route.query.openClassId
  if (quizId && classId && classes.value.length > 0) {
    const clsIdInt = parseInt(classId)
    const quizIdInt = parseInt(quizId)
    const foundClass = classes.value.find(c => c.classId === clsIdInt)
    if (foundClass) {
      selectedClass.value = foundClass
      await fetchTodayLessonAndQuizzes()
      const foundQuiz = classQuizzes.value.find(q => q.quizId === quizIdInt)
      if (foundQuiz) {
        await openSubmissionsModal(foundQuiz)
        submissionsActiveTab.value = route.query.openTab || 'questions'
        
        // Clean URL queries
        const url = new URL(window.location)
        url.searchParams.delete('openQuizId')
        url.searchParams.delete('openClassId')
        url.searchParams.delete('openTab')
        window.history.replaceState({}, '', url)
      }
    }
  }
}

watch(() => route.query, () => {
  checkQueryOpenQuiz()
}, { deep: true })

watch(classes, () => {
  checkQueryOpenQuiz()
})


function openGradingModal(sub) {
  activeSubmission.value = sub
  gradeForm.value = {
    score: sub.score !== null ? sub.score : '',
    teacherNote: sub.teacherNote || ''
  }
  gradingSubmissionModal.value = true
}

async function submitGrade() {
  if (gradeForm.value.score === '') {
    showSnackbar('Vui lòng nhập điểm', 'error')
    return
  }
  try {
    await api.post(`/api/v1/quizzes/submissions/${activeSubmission.value.submissionId}/grade`, {
      score: parseFloat(gradeForm.value.score),
      teacherNote: gradeForm.value.teacherNote
    })
    showSnackbar('Chấm điểm thành công', 'success')
    gradingSubmissionModal.value = false
    openSubmissionsModal(activeQuiz.value)
  } catch (e) {
    showSnackbar('Lỗi khi chấm điểm', 'error')
  }
}

// Helper formatting functions
function formatDate(date) {
  if (!date) return ''
  let normalizedStr = date
  if (typeof date === 'string' && !date.endsWith('Z') && !date.includes('+') && !date.match(/-\d{2}:\d{2}$/)) {
    normalizedStr = date + 'Z'
  }
  return new Date(normalizedStr).toLocaleDateString('vi-VN')
}

function getStatusLabel(status) {
  const map = { Opened: 'Mở lớp', InProgress: 'Đang dạy', Completed: 'Kết thúc', Cancelled: 'Đã hủy' }
  return map[status] || status
}

function getStatusBadgeClass(status) {
  const map = {
    Opened: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
    InProgress: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    Completed: 'bg-purple-50 text-purple-700 border-purple-200/50',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200/50'
  }
  return map[status] || 'bg-slate-50 text-slate-700 border-slate-200/50'
}

// --- TAB TIMETABLE & SUPPORT REQUESTS STATE & ACTIONS ---
const activeTab = ref('lessons')

// 1. Weekly calendar state & navigation
const currentDate = ref(new Date())
const weekDays = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 0 }
]

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

function isToday(dayValue) {
  const today = new Date()
  const currentMon = new Date(currentWeekRange.value.monday)
  const offset = dayValue === 0 ? 6 : dayValue - 2
  currentMon.setDate(currentMon.getDate() + offset)
  
  return today.getDate() === currentMon.getDate() &&
         today.getMonth() === currentMon.getMonth() &&
         today.getFullYear() === currentMon.getFullYear()
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
  const day = today.getDay()
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
  const offset = (dayValue === 0 || dayValue === 1) ? 6 : dayValue - 2
  start.setDate(start.getDate() + offset)
  const formatNum = (num) => String(num).padStart(2, '0')
  return `${formatNum(start.getDate())}/${formatNum(start.getMonth() + 1)}`
}

// 2. Timetable combined schedules computed
const combinedSchedules = computed(() => {
  const result = []
  const currentFullName = authStore.currentUser?.fullName
  
  classes.value.forEach(cls => {
    if (cls.status !== 'InProgress' && cls.status !== 'Opened') return
    
    // Nếu là giáo viên, lọc thêm họ tên giảng viên để loại bỏ các lớp trùng ID mẫu của người khác
    if (isTeacher.value && currentFullName) {
      if (cls.teacherName !== currentFullName && cls.teacherName2 !== currentFullName) return
    }
    
    const scheds = cls.schedules || []
    scheds.forEach(s => {
      const sessionDate = new Date(currentWeekRange.value.monday)
      const offset = s.dayOfWeek === 0 ? 6 : s.dayOfWeek - 2
      sessionDate.setDate(sessionDate.getDate() + offset)
      sessionDate.setHours(0, 0, 0, 0)

      if (cls.startDate) {
        const start = new Date(cls.startDate)
        start.setHours(0, 0, 0, 0)
        if (sessionDate < start) return
      }
      if (cls.endDate) {
        const end = new Date(cls.endDate)
        end.setHours(0, 0, 0, 0)
        if (sessionDate > end) return
      }

      result.push({
        ...s,
        classId: cls.classId,
        className: cls.className,
        courseName: cls.courseName,
        courseId: cls.courseId,
        room: cls.room || s.classroom || 'N/A',
        startDate: cls.startDate,
        endDate: cls.endDate
      })
    })
  })
  return result.sort((a, b) => a.startTime.localeCompare(b.startTime))
})

function getSchedulesForDayAndSession(dayValue, session) {
  return combinedSchedules.value.filter(s => {
    if (s.dayOfWeek !== dayValue) return false
    const hour = parseInt(s.startTime.split(':')[0], 10)
    let sLabel = 'Tối'
    if (hour < 12) sLabel = 'Sáng'
    else if (hour < 18) sLabel = 'Chiều'
    return sLabel === session
  })
}

function getSchedulesForDay(dayValue) {
  return combinedSchedules.value.filter(s => s.dayOfWeek === dayValue)
}

// Details Modal state
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

function getScheduleDate(dayValue) {
  const start = new Date(currentWeekRange.value.monday)
  const offset = (dayValue === 0 || dayValue === 1) ? 6 : dayValue - 2
  start.setDate(start.getDate() + offset)
  const formatNum = (num) => String(num).padStart(2, '0')
  return `${formatNum(start.getDate())}/${formatNum(start.getMonth() + 1)}/${start.getFullYear()}`
}

function formatRoom(roomStr) {
  if (!roomStr || roomStr === 'N/A') return 'Chưa xếp phòng'
  const trimmed = roomStr.trim()
  if (trimmed.startsWith('Phòng') || trimmed.startsWith('P.') || trimmed.startsWith('R.')) {
    return trimmed
  }
  return 'Phòng ' + trimmed
}

function goToClassLessons(sched) {
  if (!sched) return
  const targetClass = classes.value.find(c => c.classId === sched.classId)
  if (targetClass) {
    selectClass(targetClass)
    activeTab.value = 'lessons'
    closeDetailsModal()
  }
}

function requestSupportForSession(sched, dateStr) {
  if (!sched) return
  closeDetailsModal()
  
  supportForm.value.classId = sched.classId
  supportForm.value.supportType = 'Reschedule'
  supportForm.value.message = `Yêu cầu hỗ trợ cho buổi học ngày ${dateStr} (${sched.startTime.substring(0, 5)} - ${sched.endTime.substring(0, 5)}) tại phòng ${formatRoom(sched.room)}: `
  
  supportDialog.value = true
}

// 3. Teacher support messages state & actions
const supportMessages = ref([])
const loadingSupport = ref(false)
const supportDialog = ref(false)
const supportForm = ref({
  classId: null,
  supportType: 'Reschedule',
  message: ''
})
const submittingSupport = ref(false)

async function fetchSupportMessages() {
  loadingSupport.value = true
  try {
    const allMsgs = []
    await Promise.all(classes.value.map(async (cls) => {
      try {
        const res = await api.get(`/api/v1/support-messages/class/${cls.classId}`)
        if (res.data) {
          allMsgs.push(...res.data)
        }
      } catch (err) {
        console.error('Error fetching support messages:', err)
      }
    }))
    supportMessages.value = allMsgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (err) {
    console.error('Error fetching support messages:', err)
  } finally {
    loadingSupport.value = false
  }
}

async function submitSupportMessage() {
  if (!supportForm.value.message.trim() || !supportForm.value.classId) return
  submittingSupport.value = true
  try {
    const classId = supportForm.value.classId
    const selectedClassObj = classes.value.find(c => c.classId === classId)
    
    let studentId = null
    try {
      const enrollRes = await api.get('/api/v1/enrollments', {
        params: { classId, page: 1, pageSize: 1 }
      })
      const firstItem = enrollRes.data?.items?.[0]
      if (firstItem) {
        studentId = firstItem.studentId
      }
    } catch (e) {
      console.error('Error fetching student for support:', e)
    }
    
    if (!studentId) {
      try {
        const studentsRes = await api.get('/api/v1/students', { params: { pageSize: 1 } })
        const firstStudent = studentsRes.data?.items?.[0]
        if (firstStudent) {
          studentId = firstStudent.studentId
        }
      } catch (e) {
        console.error('Error fetching fallback student:', e)
      }
    }
    
    if (!studentId) {
      showSnackbar('Không thể gửi yêu cầu hỗ trợ: Lớp học chưa có học viên nào và hệ thống không có học viên để liên kết.', 'error')
      submittingSupport.value = false
      return
    }

    const senderType = `Giảng viên (${authStore.currentUser?.fullName || 'Giảng viên'})`
    const prefixMap = {
      Reschedule: `[Yêu cầu đổi lịch học từ ${senderType}]`,
      Technical: `[Yêu cầu hỗ trợ kỹ thuật từ ${senderType}]`,
      Other: `[Yêu cầu ý kiến đóng góp từ ${senderType}]`
    }
    const prefix = prefixMap[supportForm.value.supportType] || `[Yêu cầu hỗ trợ từ ${senderType}]`
    const finalMessage = `${prefix} - ${supportForm.value.message.trim()}`

    await api.post('/api/v1/support-messages', {
      studentId: studentId,
      message: finalMessage,
      fromClassId: classId,
      fromClassName: selectedClassObj?.className || null,
      toClassId: null,
      toClassName: null
    })

    showSnackbar('Đã gửi yêu cầu hỗ trợ tới Admin thành công!', 'success')
    supportForm.value.message = ''
    supportDialog.value = false
    await fetchSupportMessages()
  } catch (err) {
    console.error('Error sending support request:', err)
    showSnackbar(err.response?.data?.message || 'Gửi yêu cầu hỗ trợ thất bại', 'error')
  } finally {
    submittingSupport.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'support') {
    fetchSupportMessages()
  }
})

onMounted(async () => {
  await courseStore.fetchCourses({ pageSize: 150 })
  await fetchTeachers()
  await fetchClasses()
  await checkQueryOpenQuiz()
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
.glass-backdrop {
  background-color: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(8px);
}
th, td {
  transition: all 0.2s ease;
}
</style>

<style>
.calendar-grid-table {
  border-collapse: collapse !important;
  border: 2px solid #94a3b8 !important;
  width: 100% !important;
  empty-cells: show !important;
}
.calendar-grid-table th,
.calendar-grid-table td {
  border: 1.5px solid #cbd5e1 !important;
  border-style: solid !important;
}
.calendar-grid-table th {
  border-bottom: 2.5px solid #94a3b8 !important;
}
</style>
