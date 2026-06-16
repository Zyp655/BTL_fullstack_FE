<template>
  <div class="space-y-6 animate-fade-in">


    <!-- Student Selector (Admin Only) -->
    <div v-if="authStore.isAdmin" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-5 shadow-[0_12px_24px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-[28px] text-on-tertiary-container">person_search</span>
        <div>
          <h3 class="font-title-md text-body-lg font-bold text-primary-container">Chế độ Quản trị viên</h3>
          <p class="text-body-sm text-on-surface-variant">Đăng ký môn học thay mặt cho học viên</p>
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

    <template v-if="studentProfile">
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
            @click="openCourseDetail(course)"
            class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl overflow-hidden flex flex-col justify-between group hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative cursor-pointer"
          >
            <!-- Card Banner Image Carousel -->
            <div class="h-40 w-full overflow-hidden relative group/carousel">
              <div class="w-full h-full flex transition-transform duration-300" :style="{ transform: `translateX(-${(activeImageIndices[course.courseId] || 0) * 100}%)` }">
                <div v-for="(img, idx) in getCourseImages(course.imageUrl, course.category)" :key="idx" class="w-full h-full flex-shrink-0">
                  <img :src="img" class="w-full h-full object-cover" alt="Course image" />
                </div>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
              
              <!-- Floating Category Badge -->
              <div class="absolute left-4 bottom-3 flex items-center gap-1.5 z-10">
                <div :class="[getCategoryBgClass(course.category), 'w-8 h-8 rounded-lg flex items-center justify-center border shadow-md backdrop-blur-sm bg-white/70']">
                  <span class="material-symbols-outlined text-[18px]">{{ getCategoryIcon(course.category) }}</span>
                </div>
                <span class="text-white text-[13px] font-bold drop-shadow-md">
                  {{ getCategoryLabel(course.category) }}
                </span>
              </div>

              <!-- Left/Right navigation arrows (only show if images length > 1) -->
              <button 
                v-if="getCourseImages(course.imageUrl, course.category).length > 1"
                @click.stop="prevImage(course.courseId, getCourseImages(course.imageUrl, course.category).length)"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer z-10"
              >
                <span class="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button 
                v-if="getCourseImages(course.imageUrl, course.category).length > 1"
                @click.stop="nextImage(course.courseId, getCourseImages(course.imageUrl, course.category).length)"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer z-10"
              >
                <span class="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>

              <!-- Dots indicators -->
              <div v-if="getCourseImages(course.imageUrl, course.category).length > 1" class="absolute bottom-3 right-4 flex gap-1 z-10 pointer-events-auto">
                <span 
                  v-for="(img, idx) in getCourseImages(course.imageUrl, course.category)" 
                  :key="idx"
                  @click.stop="activeImageIndices[course.courseId] = idx"
                  :class="[(activeImageIndices[course.courseId] || 0) === idx ? 'bg-white w-4' : 'bg-white/50 w-1.5']"
                  class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                ></span>
              </div>
            </div>

            <!-- Card Content Body -->
            <div class="p-gutter flex-1 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex justify-between items-start gap-2">
                  <h4 class="font-bold text-lg text-primary-container truncate" :title="course.courseName">{{ course.courseName }}</h4>
                  <span class="bg-on-tertiary-container/10 text-on-tertiary-container rounded-full px-2 py-0.5 text-label-caps whitespace-nowrap">
                    {{ course.totalSessions }} buổi
                  </span>
                </div>
                <p class="text-body-sm text-on-surface-variant line-clamp-3 min-h-[50px]">{{ course.description || 'Chưa có mô tả chi tiết cho môn học này.' }}</p>
                <div class="pt-3 border-t border-outline-variant/20 flex justify-between items-center">
                  <span class="text-body-sm text-on-surface-variant">Học phí khóa:</span>
                  <span class="text-on-tertiary-container font-semibold text-body-lg">{{ formatCurrency(course.fee) }}</span>
                </div>
              </div>

              <div class="mt-4 space-y-2">
                <!-- Queue progress bar -->
                <div v-if="getCourseQueueCount(course.courseId) > 0 && !isEnrolledActive(course.courseId, course.courseName)" class="space-y-1">
                  <div class="flex justify-between items-center">
                    <span class="text-body-sm text-on-surface-variant">Hàng chờ</span>
                    <span class="text-body-sm font-semibold text-on-tertiary-container">{{ getCourseQueueCount(course.courseId) }}/5</span>
                  </div>
                  <div class="w-full h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="isInQueue(course.courseId) ? 'bg-amber-500' : 'bg-on-tertiary-container'"
                      :style="{ width: (getCourseQueueCount(course.courseId) / 5 * 100) + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Active Enrollment -->
                <button
                  v-if="isEnrolledActive(course.courseId, course.courseName)"
                  disabled
                  @click.stop
                  class="w-full py-2 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-semibold text-body-sm flex items-center justify-center gap-1.5 cursor-default"
                >
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  Đang học khóa này
                </button>

                <!-- Pending Payment -->
                <router-link
                  v-else-if="isPendingPayment(course.courseId, course.courseName)"
                  :to="{ path: '/student-portal', query: { tab: 'payments', courseId: course.courseId, courseName: course.courseName, ...(selectedStudentId ? { studentId: selectedStudentId } : {}) } }"
                  @click.stop
                  class="w-full py-2 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20 font-semibold text-body-sm flex items-center justify-center gap-1.5 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[16px]">payment</span>
                  Chờ thanh toán học phí
                </router-link>

                <!-- In Queue Waitlist -->
                <button
                  v-else-if="isInQueue(course.courseId)"
                  disabled
                  @click.stop
                  class="w-full py-2 rounded-lg bg-blue-500/10 text-blue-700 border border-blue-500/20 font-semibold text-body-sm flex items-center justify-center gap-1.5 cursor-default"
                >
                  <span class="material-symbols-outlined text-[16px]">hourglass_empty</span>
                  Đang chờ ghép lớp
                </button>

                <!-- Regular Register -->
                <button
                  v-else
                  @click.stop="openEnrollConfirmation(course)"
                  :disabled="submittingEnroll"
                  class="w-full py-2 rounded-lg bg-sky-500 text-white font-semibold text-body-sm hover:bg-sky-600 transition-colors active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
                  Đăng ký vào hàng chờ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Enrollment Modal -->
      <teleport to="body">
        <div v-if="enrollModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
            <div class="px-gutter py-4 border-b border-white/40 flex items-center justify-between">
              <h3 class="font-title-md text-title-md text-primary-container flex items-center gap-2">
                <span class="material-symbols-outlined text-on-tertiary-container">info</span>
                Xác nhận đăng ký môn học
              </h3>
              <button @click="enrollModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="p-gutter space-y-3">
              <p class="text-body-sm text-on-surface">Bạn có chắc chắn muốn đăng ký vào danh sách hàng chờ của môn học:</p>
              <div class="p-4 rounded-xl bg-on-tertiary-container/5 border border-on-tertiary-container/15">
                <div class="font-title-md text-title-md text-primary-container">{{ selectedCourseToEnroll?.courseName }}</div>
                <div class="text-body-sm text-on-surface-variant mt-1">Học phí: <span class="font-semibold text-on-tertiary-container">{{ formatCurrency(selectedCourseToEnroll?.fee) }}</span></div>
                <div class="text-body-sm text-on-surface-variant">Thời gian: {{ selectedCourseToEnroll?.totalSessions }} buổi</div>
              </div>
              <p class="text-body-sm text-on-surface-variant italic">
                * Sau khi đăng ký hàng chờ thành công, hệ thống sẽ tạo hóa đơn học phí. Bạn cần hoàn thành thanh toán trong mục "Học phí & Thanh toán" ở Cổng học tập để chính thức được đưa vào danh sách chờ ghép lớp.
              </p>
            </div>

            <div class="px-gutter py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
              <button
                @click="enrollModal = false"
                class="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant font-semibold text-body-sm hover:bg-white/40 transition-colors cursor-pointer"
              >
                Hủy bộ
              </button>
              <button
                @click="submitEnrollment"
                :disabled="submittingEnroll"
                class="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold text-body-sm hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                <span v-if="submittingEnroll" class="animate-spin w-4.5 h-4.5 border-2 border-on-primary border-t-transparent rounded-full mr-1"></span>
                Đăng ký ghi danh
              </button>
            </div>
          </div>
        </div>
      </teleport>

      <!-- Course Detail Modal -->
      <teleport to="body">
        <div v-if="detailModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
          <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-lg w-full overflow-hidden animate-scale-in flex flex-col">
            <!-- Modal Banner Carousel -->
            <div class="h-56 w-full overflow-hidden relative group/modal-carousel">
              <div class="w-full h-full flex transition-transform duration-300" :style="{ transform: `translateX(-${activeDetailImageIndex * 100}%)` }">
                <div v-for="(img, idx) in getCourseImages(selectedCourseForDetail?.imageUrl, selectedCourseForDetail?.category)" :key="idx" class="w-full h-full flex-shrink-0">
                  <img :src="img" class="w-full h-full object-cover" alt="Course image" />
                </div>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
              
              <!-- Category Badge inside Banner -->
              <div class="absolute left-6 bottom-4 flex items-center gap-2 z-10">
                <div :class="[getCategoryBgClass(selectedCourseForDetail?.category), 'w-9 h-9 rounded-xl flex items-center justify-center border shadow-md bg-white/90']">
                  <span class="material-symbols-outlined text-[20px]">{{ getCategoryIcon(selectedCourseForDetail?.category) }}</span>
                </div>
                <span class="text-white text-[15px] font-bold drop-shadow-md">
                  {{ getCategoryLabel(selectedCourseForDetail?.category) }}
                </span>
              </div>

              <!-- Close Button -->
              <button
                @click="detailModal = false"
                class="absolute right-4 top-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              >
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>

              <!-- Left/Right navigation arrows (only show if images length > 1) -->
              <button 
                v-if="selectedCourseForDetail && getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length > 1"
                @click.stop="activeDetailImageIndex = (activeDetailImageIndex - 1 + getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length) % getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <span class="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button 
                v-if="selectedCourseForDetail && getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length > 1"
                @click.stop="activeDetailImageIndex = (activeDetailImageIndex + 1) % getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <span class="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>

              <!-- Dots indicators -->
              <div v-if="selectedCourseForDetail && getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category).length > 1" class="absolute bottom-4 right-6 flex gap-1.5 z-10">
                <span 
                  v-for="(img, idx) in getCourseImages(selectedCourseForDetail.imageUrl, selectedCourseForDetail.category)" 
                  :key="idx"
                  @click.stop="activeDetailImageIndex = idx"
                  :class="[activeDetailImageIndex === idx ? 'bg-white w-5' : 'bg-white/50 w-2']"
                  class="h-2 rounded-full transition-all duration-300 cursor-pointer"
                ></span>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-5">
              <div class="space-y-1">
                <div class="flex justify-between items-start gap-3 flex-wrap">
                  <h3 class="font-headline-sm text-headline-sm text-primary-container font-bold">{{ selectedCourseForDetail?.courseName }}</h3>
                  <span class="bg-primary-container/10 text-primary-container border border-primary-container/20 rounded-full px-3 py-1 text-body-sm font-semibold">
                    Trình độ: {{ getLevelLabel(selectedCourseForDetail?.level) }}
                  </span>
                </div>
                <p class="text-body-sm text-on-surface-variant font-medium">Mã môn học: <span class="font-mono text-primary">CS-{{ String(selectedCourseForDetail?.courseId).padStart(4, '0') }}</span></p>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-2 gap-4 bg-primary-container/[0.03] p-4 rounded-xl border border-primary-container/5">
                <div class="space-y-0.5">
                  <div class="text-[11px] font-bold text-on-surface-variant/70 uppercase">Tổng số buổi học</div>
                  <div class="text-body-lg font-bold text-primary-container flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">menu_book</span>
                    {{ selectedCourseForDetail?.totalSessions }} buổi
                  </div>
                </div>
                <div class="space-y-0.5">
                  <div class="text-[11px] font-bold text-on-surface-variant/70 uppercase">Học phí khóa học</div>
                  <div class="text-body-lg font-bold text-on-tertiary-container flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">payments</span>
                    {{ formatCurrency(selectedCourseForDetail?.fee) }}
                  </div>
                </div>
              </div>

              <!-- Detailed Description -->
              <div class="space-y-2">
                <h4 class="text-body-md font-bold text-primary-container flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[18px]">description</span>
                  Mô tả môn học
                </h4>
                <div class="text-body-sm text-on-surface-variant leading-relaxed max-h-40 overflow-y-auto pr-1">
                  {{ selectedCourseForDetail?.description || 'Chưa có mô tả chi tiết cho môn học này.' }}
                </div>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="px-6 py-4 border-t border-white/40 flex justify-between items-center bg-white/20">
              <!-- Waitlist Count if any -->
              <div class="text-body-xs text-on-surface-variant font-medium">
                Số học viên đang chờ ghép lớp: <strong class="text-on-tertiary-container">{{ getCourseQueueCount(selectedCourseForDetail?.courseId) }}</strong>
              </div>
              <button
                @click="detailModal = false"
                class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-colors cursor-pointer active:scale-95 shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </teleport>
    </template>

    <!-- No Student Selected State -->
    <div v-else-if="!loading" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-12 rounded-xl text-center flex flex-col items-center justify-center">
      <span class="material-symbols-outlined text-primary-container/30 text-[64px] mb-4">import_contacts</span>
      <h3 class="font-title-md text-headline-sm text-primary-container mb-2">Chưa chọn học viên</h3>
      <p class="text-body-md text-on-surface-variant max-w-md">Vui lòng chọn một học viên từ danh sách ở trên để đăng ký môn học cho họ.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, useCourseStore, useCategoryStore } from '../../stores'
import api from '../../services/api'
import foreignLanguageImg from '../../assets/course_foreign_language.png'
import itImg from '../../assets/course_it.png'
import skillsImg from '../../assets/course_skills.png'
import defaultImg from '../../assets/course_default.png'
import artImg from '../../assets/course_art.png'
import scienceImg from '../../assets/course_science.png'

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

function getCourseImage(imageUrl, cat) {
  if (!imageUrl) {
    const map = {
      NgoaiNgu: foreignLanguageImg,
      TinHoc: itImg,
      KyNang: skillsImg
    }
    return map[cat] || defaultImg
  }
  
  const firstUrl = imageUrl.split('|')[0]
  if (firstUrl === 'preset_foreign_language') return foreignLanguageImg
  if (firstUrl === 'preset_it') return itImg
  if (firstUrl === 'preset_skills') return skillsImg
  if (firstUrl === 'preset_art') return artImg
  if (firstUrl === 'preset_science') return scienceImg
  if (firstUrl === 'preset_default') return defaultImg
  
  if (firstUrl && firstUrl.trim().length > 0) {
    return firstUrl
  }

  const map = {
    NgoaiNgu: foreignLanguageImg,
    TinHoc: itImg,
    KyNang: skillsImg
  }
  return map[cat] || defaultImg
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

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const courseStore = useCourseStore()
const categoryStore = useCategoryStore()
const showSnackbar = inject('showSnackbar')

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

const loading = ref(true)
const studentProfile = ref(null)
const enrolledClasses = ref([])
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

const filteredCourses = computed(() => {
  let list = courses.value

  // 1. Search Query filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.courseName?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    )
  }

  // 2. Category filter
  if (selectedCategory.value !== 'all') {
    list = list.filter(c => c.category === selectedCategory.value)
  }

  // 3. Status filter
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
}

function getLevelLabel(level) {
  const map = { Beginner: 'Cơ bản', Intermediate: 'Trung cấp', Advanced: 'Nâng cao' }
  return map[level] || level
}

async function loadStudentsList() {
  try {
    const res = await api.get('/api/v1/students', { params: { pageSize: 1000 } })
    students.value = res.data.items || []
  } catch (err) {
    console.error('Error fetching students list for admin:', err)
  }
}

watch(selectedStudentId, async (newVal) => {
  selectedCategory.value = 'all'
  selectedStatus.value = 'all'
  if (newVal) {
    router.replace({ path: route.path, query: { ...route.query, studentId: newVal } })
    const student = students.value.find(s => s.studentId === newVal)
    if (student) {
      studentProfile.value = student
      await loadRegistrationDataForStudent(newVal)
    } else {
      try {
        const res = await api.get(`/api/v1/students/${newVal}`)
        studentProfile.value = res.data
        await loadRegistrationDataForStudent(newVal)
      } catch (e) {
        console.error('Error fetching student details:', e)
      }
    }
  } else {
    studentProfile.value = null
    enrolledClasses.value = []
    studentQueueCourseIds.value = []
    // Remove studentId from query
    const newQuery = { ...route.query }
    delete newQuery.studentId
    router.replace({ path: route.path, query: newQuery })
  }
})

async function loadRegistrationData() {
  loading.value = true
  try {
    // 0. Fetch categories
    try {
      await categoryStore.fetchCategories()
    } catch (e) {
      console.error('Error fetching categories:', e)
    }
    // 1. Fetch all courses for registrations
    try {
      await courseStore.fetchCourses({ page: 1, pageSize: 1000 })
      courses.value = courseStore.courses || []
    } catch (e) {
      console.error('Error fetching courses:', e)
    }

    if (authStore.isAdmin) {
      await loadStudentsList()
      
      const queryStudentId = route.query.studentId ? parseInt(route.query.studentId, 10) : null
      if (queryStudentId) {
        selectedStudentId.value = queryStudentId
      } else {
        studentProfile.value = null
        loading.value = false
      }
      return
    }

    const userId = authStore.currentUser?.userId
    if (!userId) {
      loading.value = false
      return
    }

    // 2. Fetch student profile details from StudentService using UserId
    try {
      const response = await api.get(`/api/v1/students/by-user/${userId}`)
      studentProfile.value = response.data
    } catch (err) {
      console.error('Error fetching student profile:', err)
      showSnackbar('Hồ sơ học tập của bạn chưa được tạo hoặc lỗi liên kết.', 'error')
      loading.value = false
      return
    }

    const studentId = studentProfile.value.studentId
    await loadRegistrationDataForStudent(studentId)

  } catch (err) {
    console.error('Error loading registration data:', err)
    showSnackbar('Có lỗi xảy ra khi tải danh sách môn học.', 'error')
    loading.value = false
  }
}

async function loadRegistrationDataForStudent(studentId) {
  loading.value = true
  try {
    // 1. Fetch enrolled classes
    const classRes = await api.get(`/api/v1/students/${studentId}/enrollments`)
    enrolledClasses.value = classRes.data || []

    // 2. Fetch student waitlisted course IDs and overall queue status
    try {
      const queueRes = await api.get(`/api/v1/enrollments/course-queue/student/${studentId}`)
      studentQueueCourseIds.value = queueRes.data || []
      await courseStore.fetchCourseQueueStatus()
    } catch (e) {
      console.error('Error fetching course queue data:', e)
    }

  } catch (err) {
    console.error('Error loading registration data for student:', err)
    showSnackbar('Có lỗi xảy ra khi tải thông tin đăng ký.', 'error')
  } finally {
    loading.value = false
  }
}

function openEnrollConfirmation(course) {
  selectedCourseToEnroll.value = course
  enrollModal.value = true
}

async function submitEnrollment() {
  const studentId = studentProfile.value?.studentId
  if (!selectedCourseToEnroll.value || !studentId) return
  submittingEnroll.value = true
  try {
    await api.post('/api/v1/enrollments/course-queue', {
      studentId: studentId,
      courseId: selectedCourseToEnroll.value.courseId
    })
    showSnackbar(`Đã đăng ký ghi danh hàng chờ khóa "${selectedCourseToEnroll.value.courseName}" thành công!`, 'success')
    
    // Refresh student waitlisted course IDs, enrolled classes, and overall queue status
    const classRes = await api.get(`/api/v1/students/${studentId}/enrollments`)
    enrolledClasses.value = classRes.data || []
    
    const queueRes = await api.get(`/api/v1/enrollments/course-queue/student/${studentId}`)
    studentQueueCourseIds.value = queueRes.data || []
    
    await courseStore.fetchCourseQueueStatus()
    
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
  return enrolledClasses.value.some(cls => 
    cls.courseId === courseId && 
    cls.classId > 0 && 
    cls.status === 'DangHoc'
  )
}

// Check if student has a registration that is pending payment (either in queue or class)
function isPendingPayment(courseId, courseName) {
  return enrolledClasses.value.some(cls => 
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

onMounted(loadRegistrationData)
</script>
