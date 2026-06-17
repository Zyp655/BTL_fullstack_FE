<template>
  <div class="space-y-4">
    <!-- Loading screen -->
    <div v-if="loading" class="bg-white/70 backdrop-blur-[20px] p-12 rounded-xl text-center flex flex-col items-center justify-center border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
      <div class="w-12 h-12 border-4 border-primary-container/30 border-t-primary-container rounded-full animate-spin mb-4"></div>
      <p class="text-body-sm font-semibold text-primary-container">Đang tải dữ liệu môn học...</p>
    </div>

    <!-- Courses Grid -->
    <div v-else class="space-y-4">
      <!-- Search and Filters row -->
      <div v-if="courses.length > 0" class="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between bg-white/70 backdrop-blur-[20px] p-4 rounded-xl border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
        <!-- Search input -->
        <div class="relative flex-1 max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            v-model="searchQuery"
            class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-10 py-2 text-body-sm text-primary placeholder-on-surface-variant/50 focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
            placeholder="Tìm kiếm môn học theo tên hoặc mô tả..."
            type="text"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <!-- Filters (Category & Status) -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Filter by Category -->
          <div class="relative min-w-[150px]">
            <select
              v-model="selectedCategory"
              class="w-full bg-primary-container/[0.03] border border-outline-variant/30 rounded-lg appearance-none pl-3 pr-9 py-2 text-body-sm text-primary-container bg-transparent cursor-pointer focus:outline-none focus:border-on-tertiary-container/30 transition-colors font-semibold"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="NgoaiNgu">Ngoại ngữ</option>
              <option value="TinHoc">Tin học</option>
              <option value="KyNang">Kỹ năng</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
          </div>

          <!-- Filter by Status -->
          <div class="relative min-w-[170px]">
            <select
              v-model="selectedStatus"
              class="w-full bg-primary-container/[0.03] border border-outline-variant/30 rounded-lg appearance-none pl-3 pr-9 py-2 text-body-sm text-primary-container bg-transparent cursor-pointer focus:outline-none focus:border-on-tertiary-container/30 transition-colors font-semibold"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="DangHoc">Đang học</option>
              <option value="PendingPayment">Chờ thanh toán</option>
              <option value="InQueue">Chờ xếp lớp</option>
              <option value="NotRegistered">Chưa đăng ký</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
          </div>
        </div>
      </div>

      <div v-if="courses.length === 0" class="bg-white/70 backdrop-blur-[20px] p-8 text-center rounded-xl border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] text-on-surface-variant">
        Hiện tại trung tâm chưa mở môn học nào.
      </div>
      <div v-else-if="filteredCourses.length === 0" class="bg-white/70 backdrop-blur-[20px] p-8 text-center rounded-xl border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] text-on-surface-variant">
        Không tìm thấy môn học nào khớp với từ khóa tìm kiếm.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        <div
          v-for="course in filteredCourses"
          :key="course.courseId"
          class="glass-panel rounded-xl flex flex-col overflow-hidden border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all group"
        >
          <!-- Course Image Slider Banner -->
          <div class="h-44 overflow-hidden relative bg-slate-100 flex items-center justify-center">
            <template v-if="getCourseImages(course.imageUrl, course.category).length > 0">
              <div class="w-full h-full relative">
                <div 
                  class="flex h-full transition-transform duration-300 ease-in-out" 
                  :style="{ transform: `translateX(-${(activeImageIndices[course.courseId] || 0) * 100}%)` }"
                >
                  <img
                    v-for="(img, idx) in getCourseImages(course.imageUrl, course.category)"
                    :key="idx"
                    :src="img"
                    class="w-full h-full object-cover flex-shrink-0"
                    alt="Course Image"
                  />
                </div>
                <!-- Navigation Arrows on Hover (only if > 1 image) -->
                <template v-if="getCourseImages(course.imageUrl, course.category).length > 1">
                  <button
                    @click.stop="prevImage(course.courseId, getCourseImages(course.imageUrl, course.category).length)"
                    class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none cursor-pointer border-0"
                  >
                    <span class="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button
                    @click.stop="nextImage(course.courseId, getCourseImages(course.imageUrl, course.category).length)"
                    class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none cursor-pointer border-0"
                  >
                    <span class="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                  <!-- Slide Dots Indicator -->
                  <div class="absolute bottom-2 right-2 bg-black/45 px-2 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wider flex gap-1">
                    {{ (activeImageIndices[course.courseId] || 0) + 1 }}/{{ getCourseImages(course.imageUrl, course.category).length }}
                  </div>
                </template>
              </div>
            </template>
            <div class="absolute top-3 left-3 flex gap-2">
              <span 
                class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1"
                :class="getCategoryBgClass(course.category)"
              >
                <span class="material-symbols-outlined text-[12px] pointer-events-none">{{ getCategoryIcon(course.category) }}</span>
                {{ getCategoryLabel(course.category) }}
              </span>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 text-white border border-white/20 backdrop-blur-sm">
                {{ getLevelLabel(course.level) }}
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h4 class="font-headline-sm text-title-md text-primary-container line-clamp-1 group-hover:text-primary transition-colors">{{ course.courseName }}</h4>
              <p class="text-body-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">{{ course.description }}</p>
            </div>

            <!-- Stats Row -->
            <div class="flex items-center justify-between border-y border-outline-variant/30 py-3 text-body-xs font-semibold text-on-surface-variant">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] text-primary">schedule</span>
                {{ course.durationWeeks || Math.ceil(course.totalSessions / 2) }} tuần
              </div>
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] text-primary">group</span>
                Ghi danh: {{ getCourseQueueCount(course.courseId) }} HV
              </div>
              <div class="text-[14px] font-black text-indigo-700 bg-indigo-50/70 px-2.5 py-0.5 rounded-md border border-indigo-100/80 shadow-sm">
                {{ formatCurrency(course.fee) }}
              </div>
            </div>

            <!-- Card Action Footer -->
            <div class="flex items-center gap-2">
              <button
                @click="openCourseDetail(course)"
                class="flex-1 px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-semibold text-primary hover:bg-primary-container/10 hover:border-primary-container/20 transition-all cursor-pointer text-center"
              >
                Chi tiết
              </button>

              <template v-if="isEnrolledActive(course.courseId, course.courseName)">
                <div class="flex-1 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold rounded-lg text-body-sm text-center flex items-center justify-center gap-1 cursor-default">
                  <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                  Đang học
                </div>
              </template>
              <template v-else-if="isPendingPayment(course.courseId, course.courseName)">
                <router-link
                  :to="{ path: '/student-portal', query: { tab: 'payments', courseId: course.courseId, courseName: course.courseName, ...(studentProfile?.studentId ? { studentId: studentProfile.studentId } : {}) } }"
                  @click.stop
                  class="flex-1 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold rounded-lg text-body-sm text-center flex items-center justify-center gap-1 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[16px] animate-pulse">credit_card</span>
                  Chờ học phí
                </router-link>
              </template>
              <template v-else-if="isInQueue(course.courseId)">
                <div class="flex-1 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 font-bold rounded-lg text-body-sm text-center flex items-center justify-center gap-1 cursor-default">
                  <span class="material-symbols-outlined text-[16px]">hourglass_empty</span>
                  Chờ xếp lớp
                </div>
              </template>
              <template v-else>
                <button
                  @click="openEnrollConfirmation(course)"
                  class="flex-1 px-4 py-2 bg-primary-container hover:bg-primary text-white font-bold rounded-lg text-body-sm transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-95 cursor-pointer text-center"
                >
                  Đăng ký học
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Registration Dialog -->
    <teleport to="body">
      <div v-if="enrollModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/95 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center gap-3 text-primary-container border-b border-white/40 pb-3 justify-between">
            <h3 class="font-title-md text-[18px] font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-[24px] text-primary">bookmark_add</span>
              Xác nhận đăng ký môn học
            </h3>
            <button @click="enrollModal = false" class="text-on-surface-variant hover:text-primary cursor-pointer border-0 bg-transparent flex items-center justify-center">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-3">
            <p class="text-body-sm text-on-surface-variant leading-relaxed">
              Bạn có chắc chắn muốn đăng ký môn học sau cho học viên <strong class="text-slate-900">{{ studentProfile?.fullName }}</strong>?
            </p>
            <div class="p-4 bg-primary-container/5 rounded-lg border border-primary-container/10">
              <h4 class="font-semibold text-primary-container text-body-sm">{{ selectedCourseToEnroll?.courseName }}</h4>
              <p class="text-body-xs text-on-surface-variant mt-1 line-clamp-2">{{ selectedCourseToEnroll?.description }}</p>
              <div class="flex justify-between items-center mt-3 pt-3 border-t border-primary-container/10">
                 <span class="text-body-xs font-semibold text-on-surface-variant">Học phí môn học:</span>
                <span class="text-body-sm font-black text-indigo-700 bg-indigo-50/70 px-2.5 py-0.5 rounded-md border border-indigo-100/80 shadow-sm">{{ formatCurrency(selectedCourseToEnroll?.fee) }}</span>
              </div>
            </div>
            <p class="text-[11px] text-on-surface-variant leading-relaxed italic">
              * Sau khi xác nhận đăng ký thành công, học viên sẽ được đưa vào hàng chờ xếp lớp. Phiếu học phí sẽ tự động được khởi tạo ở trạng thái chờ thanh toán.
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-white/40">
            <button
              @click="enrollModal = false"
              class="px-4 py-2 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              @click="submitEnrollment"
              :disabled="submittingEnroll"
              class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="submittingEnroll" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Course Details Dialog -->
    <teleport to="body">
      <div v-if="detailModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/95 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-scale-in">
          <!-- Banner Image Slider -->
          <div class="h-64 rounded-lg overflow-hidden relative bg-slate-100 flex items-center justify-center">
            <template v-if="selectedCourseForDetail && getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length > 0">
              <div class="w-full h-full relative">
                <div 
                  class="flex h-full transition-transform duration-300 ease-in-out" 
                  :style="{ transform: `translateX(-${activeDetailImageIndex * 100}%)` }"
                >
                  <img
                    v-for="(img, idx) in getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category)"
                    :key="idx"
                    :src="img"
                    class="w-full h-full object-cover flex-shrink-0"
                    alt="Course Detail Image"
                  />
                </div>
                <!-- Navigation Arrows on Hover (only if > 1 image) -->
                <template v-if="getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length > 1">
                  <button
                    @click.stop="activeDetailImageIndex = (activeDetailImageIndex - 1 + getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length) % getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer border-0"
                  >
                    <span class="material-symbols-outlined text-[24px]">chevron_left</span>
                  </button>
                  <button
                    @click.stop="activeDetailImageIndex = (activeDetailImageIndex + 1) % getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer border-0"
                  >
                    <span class="material-symbols-outlined text-[24px]">chevron_right</span>
                  </button>
                  <!-- Slide Dots Indicator -->
                  <div class="absolute bottom-3 right-3 bg-black/45 px-3 py-1 rounded-full text-xs font-bold text-white tracking-wider flex gap-1">
                    {{ activeDetailImageIndex + 1 }}/{{ getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length }}
                  </div>
                </template>
              </div>
            </template>
            <!-- Close button -->
            <button @click="detailModal = false" class="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none border-0">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="space-y-4" v-if="selectedCourseForDetail">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1" :class="getCategoryBgClass(selectedCourseForDetail.category)">
                  <span class="material-symbols-outlined text-[12px] pointer-events-none">{{ getCategoryIcon(selectedCourseForDetail.category) }}</span>
                  {{ getCategoryLabel(selectedCourseForDetail.category) }}
                </span>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 text-white border border-white/20 backdrop-blur-sm">
                  {{ getLevelLabel(selectedCourseForDetail.level) }}
                </span>
              </div>
              <h3 class="font-headline-md text-headline-sm text-primary-container">{{ selectedCourseForDetail.courseName }}</h3>
            </div>

            <!-- Spec Grid -->
            <div class="grid grid-cols-3 gap-4 border-y border-outline-variant/30 py-4 text-center">
              <div>
                <p class="text-[11px] font-medium text-on-surface-variant">Thời lượng</p>
                <p class="font-bold text-primary-container text-body-sm mt-0.5">{{ selectedCourseForDetail.durationWeeks || Math.ceil((selectedCourseForDetail.totalSessions || 10) / 2) }} tuần</p>
              </div>
              <div>
                <p class="text-[11px] font-medium text-on-surface-variant">Đang ghi danh</p>
                <p class="font-bold text-primary-container text-body-sm mt-0.5">{{ getCourseQueueCount(selectedCourseForDetail.courseId) }} học viên</p>
              </div>
              <div>
                 <p class="text-[11px] font-medium text-on-surface-variant">Học phí trọn gói</p>
                <p class="font-black text-indigo-700 text-body-sm mt-0.5 bg-indigo-50/70 px-2.5 py-0.5 rounded-md border border-indigo-100/80 shadow-sm inline-block">{{ formatCurrency(selectedCourseForDetail?.fee) }}</p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h4 class="font-title-md text-body-sm font-bold text-primary-container mb-1">Mô tả môn học</h4>
              <p class="text-body-sm text-on-surface-variant leading-relaxed">{{ selectedCourseForDetail.description }}</p>
            </div>

            <!-- Instructors in Charge -->
            <div class="pt-2">
              <h4 class="font-title-md text-body-sm font-bold text-primary-container mb-1.5 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[18px] text-indigo-500">person</span>
                Giảng viên phụ trách
              </h4>
              <div v-if="loadingClasses" class="text-xs text-slate-400 italic flex items-center gap-1.5 py-1">
                <div class="w-3.5 h-3.5 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin"></div>
                Đang tải danh sách giảng viên...
              </div>
              <div v-else-if="courseInstructors.length === 0" class="text-body-sm text-on-surface-variant italic">
                Chưa phân công giảng viên (chưa mở lớp)
              </div>
              <div v-else class="flex flex-wrap gap-2 mt-1">
                <span 
                  v-for="teacher in courseInstructors" 
                  :key="teacher.id"
                  class="px-3 py-1.5 bg-slate-100/80 text-slate-800 font-bold rounded-lg border border-slate-200/50 text-[12px] flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-[16px] text-indigo-500 font-semibold">school</span>
                  <span>{{ teacher.name }}</span>
                  <span class="flex items-center gap-0.5 text-amber-500 font-extrabold ml-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[11px]" title="Điểm đánh giá trung bình của giảng viên">
                    <span class="material-symbols-outlined text-[12px] font-variation-settings-fill text-amber-500" style="font-variation-settings: 'FILL' 1;">star</span>
                    {{ teacherRatings[teacher.id] !== undefined && teacherRatings[teacher.id] > 0 ? teacherRatings[teacher.id].toFixed(1) : 'Chưa có' }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-white/40">
              <button
                @click="detailModal = false"
                class="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-[13px] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
              <template v-if="isEnrolledActive(selectedCourseForDetail.courseId, selectedCourseForDetail.courseName)">
                <div class="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold rounded-lg text-body-sm text-center flex items-center justify-center gap-1 cursor-default">
                  <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                  Học viên đang học môn này
                </div>
              </template>
              <template v-else-if="isPendingPayment(selectedCourseForDetail.courseId, selectedCourseForDetail.courseName)">
                <router-link
                  :to="{ path: '/student-portal', query: { tab: 'payments', courseId: selectedCourseForDetail.courseId, courseName: selectedCourseForDetail.courseName, ...(studentProfile?.studentId ? { studentId: studentProfile.studentId } : {}) } }"
                  @click="detailModal = false"
                  class="px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold rounded-lg text-body-sm text-center flex items-center justify-center gap-1 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px] animate-pulse">credit_card</span>
                  Chờ thanh toán học phí
                </router-link>
              </template>
              <template v-else-if="isInQueue(selectedCourseForDetail.courseId)">
                <div class="px-5 py-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-600 font-bold rounded-lg text-body-sm text-center flex items-center justify-center gap-1 cursor-default">
                  <span class="material-symbols-outlined text-[18px]">hourglass_empty</span>
                  Đang trong hàng chờ xếp lớp
                </div>
              </template>
              <template v-else>
                <button
                  @click="openEnrollConfirmation(selectedCourseForDetail)"
                  class="px-5 py-2.5 bg-primary-container hover:bg-primary text-white font-bold rounded-lg text-body-sm transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-95 cursor-pointer"
                >
                  Đăng ký ghi danh môn học
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed } from 'vue'
import { useCourseStore, useCategoryStore } from '../../../stores'
import api from '../../../services/api'
import foreignLanguageImg from '../../../assets/course_foreign_language.png'
import itImg from '../../../assets/course_it.png'
import skillsImg from '../../../assets/course_skills.png'
import defaultImg from '../../../assets/course_default.png'
import artImg from '../../../assets/course_art.png'
import scienceImg from '../../../assets/course_science.png'

const props = defineProps({
  studentProfile: {
    type: Object,
    required: true
  },
  enrolledClasses: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['refresh-portal'])

const activeImageIndices = ref({})
const activeDetailImageIndex = ref(0)

function prevImage(courseId, length) {
  const current = activeImageIndices.value[courseId] || 0
  activeImageIndices.value[courseId] = (current - 1 + length) % length
}

function nextImage(courseId, length) {
  const current = activeImageIndices.value[courseId] || 0
  activeImageIndices.value[courseId] = (current + 1) % length
}

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

function getCategoryIcon(cat) {
  const found = categoryStore.categories.find(c => c.categoryCode === cat)
  if (found && found.categoryName.includes('|')) {
    return found.categoryName.split('|')[1]
  }
  const map = { NgoaiNgu: 'translate', TinHoc: 'laptop_mac', KyNang: 'psychology' }
  return map[cat] || 'school'
}

function getCategoryBgClass(cat) {
  const found = categoryStore.categories.find(c => c.categoryCode === cat)
  if (found && found.categoryName.includes('|')) {
    const icon = found.categoryName.split('|')[1]
    const presets = {
      translate: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
      laptop_mac: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      psychology: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      calculate: 'bg-red-500/10 text-red-600 border-red-500/20',
      palette: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
      music_note: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      sports_esports: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      science: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
      menu_book: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    }
    if (presets[icon]) return presets[icon]
  }
  const map = { 
    NgoaiNgu: 'bg-sky-500/10 text-sky-600 border-sky-500/20', 
    TinHoc: 'bg-amber-500/10 text-amber-600 border-amber-500/20', 
    KyNang: 'bg-purple-500/10 text-purple-600 border-purple-500/20' 
  }
  return map[cat] || 'bg-primary-container/10 text-primary-container border-primary-container/20'
}

function getCategoryLabel(cat) {
  const found = categoryStore.categories.find(c => c.categoryCode === cat)
  if (found) return found.categoryName.split('|')[0]
  const map = { NgoaiNgu: 'Ngoại ngữ', TinHoc: 'Tin học', KyNang: 'Kỹ năng' }
  return map[cat] || cat
}

const courseStore = useCourseStore()
const categoryStore = useCategoryStore()
const showSnackbar = inject('showSnackbar')

const loading = ref(true)
const courses = ref([])
const studentQueueCourseIds = ref([])
const enrollModal = ref(false)
const selectedCourseToEnroll = ref(null)
const submittingEnroll = ref(false)

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStatus = ref('all')
const detailModal = ref(false)
const selectedCourseForDetail = ref(null)
const courseClasses = ref([])
const loadingClasses = ref(false)
const teacherRatings = ref({})

const courseInstructors = computed(() => {
  const teachers = new Map() // teacherId -> teacherName
  courseClasses.value.forEach(cls => {
    if (cls.teacherId && cls.teacherName && cls.teacherName.trim()) {
      teachers.set(cls.teacherId, cls.teacherName.trim())
    }
    if (cls.teacherId2 && cls.teacherName2 && cls.teacherName2.trim()) {
      teachers.set(cls.teacherId2, cls.teacherName2.trim())
    }
  })
  return Array.from(teachers.entries()).map(([id, name]) => ({ id, name }))
})

async function fetchCourseClasses(courseId) {
  loadingClasses.value = true
  try {
    const res = await api.get('/api/v1/classes', {
      params: { courseId, pageSize: 100 }
    })
    courseClasses.value = res.data?.items || []
    
    // Fetch ratings for each unique instructor using Promise.all
    const instructors = courseInstructors.value
    const ratingResults = {}
    await Promise.all(instructors.map(async (teacher) => {
      try {
        const ratingRes = await api.get(`/api/v1/teacher-evaluations/teacher/${teacher.id}/average`)
        ratingResults[teacher.id] = ratingRes.data
      } catch (err) {
        console.error(`Error fetching rating for teacher ${teacher.id}:`, err)
        ratingResults[teacher.id] = 0
      }
    }))
    teacherRatings.value = { ...teacherRatings.value, ...ratingResults }
  } catch (err) {
    console.error('Error fetching classes for course details:', err)
    courseClasses.value = []
  } finally {
    loadingClasses.value = false
  }
}

const filteredCourses = computed(() => {
  let list = courses.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.courseName?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value !== 'all') {
    list = list.filter(c => c.category === selectedCategory.value)
  }

  if (selectedStatus.value !== 'all') {
    list = list.filter(c => {
      const isEnrolled = isEnrolledActive(c.courseId, c.courseName)
      const isPending = isPendingPayment(c.courseId, c.courseName)
      const isQueued = isInQueue(c.courseId)

      if (selectedStatus.value === 'DangHoc') return isEnrolled
      if (selectedStatus.value === 'PendingPayment') return isPending
      if (selectedStatus.value === 'InQueue') return isQueued
      if (selectedStatus.value === 'NotRegistered') return !isEnrolled && !isPending && !isQueued
      
      return true
    })
  }

  return list
})

function openCourseDetail(course) {
  selectedCourseForDetail.value = course
  activeDetailImageIndex.value = 0
  detailModal.value = true
  fetchCourseClasses(course.courseId)
}

function getLevelLabel(level) {
  const map = { Beginner: 'Cơ bản', Intermediate: 'Trung cấp', Advanced: 'Nâng cao' }
  return map[level] || level
}

async function loadRegistrationDataForStudent(studentId) {
  loading.value = true
  try {
    try {
      const queueRes = await api.get(`/api/v1/enrollments/course-queue/student/${studentId}`)
      studentQueueCourseIds.value = queueRes.data || []
      await courseStore.fetchCourseQueueStatus()
    } catch (e) {
      console.error('Error fetching course queue data:', e)
    }
  } catch (err) {
    console.error('Error loading registration data for student:', err)
  } finally {
    loading.value = false
  }
}

async function loadAllCourses() {
  try {
    await categoryStore.fetchCategories()
    await courseStore.fetchCourses({ page: 1, pageSize: 1000 })
    courses.value = courseStore.courses || []
  } catch (e) {
    console.error('Error loading courses catalog:', e)
  }
}

async function openEnrollConfirmation(course) {
  selectedCourseToEnroll.value = course
  enrollModal.value = true
}

async function submitEnrollment() {
  const studentId = props.studentProfile?.studentId
  if (!selectedCourseToEnroll.value || !studentId) return
  submittingEnroll.value = true
  try {
    await api.post('/api/v1/enrollments/course-queue', {
      studentId: studentId,
      courseId: selectedCourseToEnroll.value.courseId
    })
    showSnackbar(`Đã đăng ký ghi danh hàng chờ khóa "${selectedCourseToEnroll.value.courseName}" thành công!`, 'success')
    
    // Refresh student waitlisted course IDs, enrolled classes, and overall queue status in parent
    emit('refresh-portal')
    await loadRegistrationDataForStudent(studentId)
    enrollModal.value = false
  } catch (err) {
    console.error(err)
    showSnackbar(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký ghi danh.', 'error')
  } finally {
    submittingEnroll.value = false
  }
}

// Check if student is actively attending/enrolled in a class of this course
function isEnrolledActive(courseId, courseName) {
  return props.enrolledClasses.some(cls => 
    cls.courseId === courseId && 
    cls.classId > 0 && 
    cls.status === 'DangHoc'
  )
}

// Check if student has a registration that is pending payment (either in queue or class)
function isPendingPayment(courseId, courseName) {
  return props.enrolledClasses.some(cls => 
    (cls.courseId === courseId || cls.classId === -courseId) && 
    (cls.status === 'PendingPayment' || cls.status === 'Pending')
  )
}

// Check if student is currently waitlisted/queued in a course
function isInQueue(courseId) {
  if (!studentQueueCourseIds.value) return false
  return studentQueueCourseIds.value.some(id => {
    if (id === courseId) return true
    if (id && id.courseId === courseId) return true
    if (id == courseId) return true
    return false
  })
}

// Get the count of students currently in queue for a course
function getCourseQueueCount(courseId) {
  const status = courseStore.courseQueueStatuses?.find(s => s.courseId === courseId)
  return status ? status.count : 0
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}

watch(() => props.studentProfile?.studentId, async (newId) => {
  if (newId) {
    await loadRegistrationDataForStudent(newId)
  }
}, { immediate: true })

onMounted(loadAllCourses)
</script>
