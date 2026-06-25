<template>
  <div class="space-y-4">
    <!-- Compact Schedule Conflict Warning Banner -->
    <div
      v-if="currentConflicts.length > 0"
      @click="$emit('switch-tab', 'conflicts')"
      class="bg-error/10 hover:bg-error/15 text-error p-4 rounded-xl border border-error/20 flex items-center justify-between gap-3 shadow-sm cursor-pointer transition-colors group animate-scale-in"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-[24px] text-error shrink-0 animate-pulse" style="font-variation-settings: 'FILL' 1;">warning</span>
        <div>
          <p class="font-bold text-body-md">Cảnh báo trùng lịch học!</p>
          <p class="text-body-sm text-on-surface-variant font-medium">
            Có <span class="text-error font-bold">{{ currentConflicts.length }}</span> cặp lớp học đang bị trùng lịch biểu.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 text-body-sm font-semibold text-error shrink-0 group-hover:translate-x-1 transition-transform">
        Xem chi tiết và đổi lớp
        <span class="material-symbols-outlined text-[18px]">chevron_right</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
      <!-- Class List -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <h3 class="font-title-md text-body-lg font-semibold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">school</span>
            Lớp học đã đăng ký
          </h3>
          <button
            v-if="authStore.isAdmin"
            @click="$emit('open-transfer-modal')"
            class="px-3 py-1.5 rounded-lg bg-primary-container/10 hover:bg-primary-container/20 text-primary-container font-semibold text-[12px] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <span class="material-symbols-outlined text-[18px]">swap_horiz</span>
            Chuyển lớp
          </button>
        </div>
        
        <!-- Search Bar -->
        <div class="relative w-full" v-if="enrolledClasses.length > 0">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">search</span>
          <input
            type="text"
            v-model="searchText"
            class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-9 pr-10 py-2 text-body-sm text-primary placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container/40 transition-colors"
            placeholder="Tìm kiếm lớp học, môn học..."
          />
          <button
            v-if="searchText"
            @click="searchText = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div v-if="enrolledClasses.length === 0" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-8 text-center rounded-xl text-on-surface-variant">
          Bạn chưa đăng ký tham gia lớp học nào.
        </div>

        <div v-if="enrolledClasses.length > 0 && filteredClasses.length === 0" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-8 text-center rounded-xl text-on-surface-variant">
          Không tìm thấy lớp học phù hợp với từ khóa tìm kiếm.
        </div>

        <div
          v-for="cls in paginatedClasses"
          :key="cls.enrollmentId"
          @click="$emit('select-class', cls)"
          :class="[
            selectedClass?.classId === cls.classId ? 'border-2 border-indigo-500 bg-white/80 shadow-lg scale-[1.04]' : 'border-white/40 hover:bg-white/40 hover:scale-[1.01]',
            'bg-white/70 backdrop-blur-[20px] p-4 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-center active:scale-[0.99]'
          ]"
        >
          <div class="space-y-1 min-w-0 flex-1 mr-3">
            <div class="flex items-center gap-1.5 min-w-0">
              <div :class="[selectedClass?.classId === cls.classId ? 'font-extrabold text-indigo-600 text-[17px]' : 'font-bold text-primary-container text-body-lg', 'leading-snug line-clamp-2 transition-all']" :title="cls.courseName">{{ cls.courseName }}</div>
              <span v-if="isClassConflicting(cls.classId)" class="text-error animate-pulse shrink-0 flex items-center" title="Lớp bị trùng lịch/môn học">
                <span class="material-symbols-outlined text-[18px] font-bold" style="font-variation-settings: 'FILL' 1;">warning</span>
              </span>
            </div>
            <div :class="[selectedClass?.classId === cls.classId ? 'font-bold text-indigo-400' : 'text-on-surface-variant/70', 'text-body-xs font-semibold transition-all']" :title="cls.className">{{ cls.className }}</div>
            <div :class="[selectedClass?.classId === cls.classId ? 'font-medium text-slate-500' : 'text-on-surface-variant/80', 'text-body-sm transition-all']">Ngày đăng ký: {{ formatDate(cls.enrolledAt) }}</div>
          </div>
          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <select
              v-if="authStore.isAdmin"
              :value="cls.status"
              @change="$emit('change-enrollment-status', { cls, newStatus: $event.target.value })"
              @click.stop
              class="bg-white/80 border border-outline-variant/30 rounded px-2 py-0.5 text-[11px] font-semibold text-primary cursor-pointer focus:outline-none"
            >
              <option value="DangHoc">Đang học</option>
              <option value="DaXong">Hoàn thành</option>
              <option value="BoHoc">Đã bỏ học</option>
              <option value="PendingPayment">Chờ thanh toán</option>
              <option value="Pending">Chờ duyệt</option>
            </select>
            <span v-else :class="[getEnrollmentStatusClass(cls.status), 'status-badge text-[10px] font-bold']">
              {{ getEnrollmentStatusLabel(cls.status) }}
            </span>
            <span v-if="isClassUnpaid(cls.classId)" class="text-body-sm text-error flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[16px]">lock</span>
              Chưa đóng học phí
            </span>
            <span v-else class="text-body-sm text-on-tertiary-container flex items-center font-semibold">
              Xem lịch học
              <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </span>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-between items-center text-body-sm text-secondary bg-white/50 backdrop-blur-md p-3.5 rounded-xl border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mt-3">
          <span class="text-on-surface-variant/80 font-medium">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
          <div class="flex items-center gap-1.5">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Trang trước"
            >
              <span class="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Trang sau"
            >
              <span class="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Details View: Schedule & Attendance for selected class -->
      <div class="space-y-4">
        <!-- Conflict Warning Banner -->
        <div
          v-if="selectedClass && !isClassUnpaid(selectedClass.classId) && hasConflict"
          class="bg-error/10 border border-error/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm text-error animate-fade-in"
        >
          <div class="flex items-start gap-2.5 min-w-0">
            <span class="material-symbols-outlined text-[24px] text-error shrink-0 mt-0.5 animate-pulse" style="font-variation-settings: 'FILL' 1;">warning</span>
            <div class="text-[14px] leading-relaxed text-error flex-1">
              <span class="font-bold block text-[15px]">Cảnh báo trùng lặp học vụ!</span>
              <span class="text-on-surface-variant font-medium block mt-0.5" v-html="conflictMessage"></span>
            </div>
          </div>
          <button
            @click="$emit('open-support-conflict', { targetClass: selectedClass, conflictClass: conflictTargetForSupport || { className: 'Chưa xác định' } })"
            class="px-4 py-2 rounded-lg bg-error hover:bg-error/90 text-white font-bold text-[13px] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 self-end sm:self-auto shadow-sm animate-pulse"
          >
            <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
            Gửi yêu cầu hỗ trợ đổi lớp
          </button>
        </div>

        <!-- 0. Class & Course Info Section -->
        <div v-if="selectedClass && !isClassUnpaid(selectedClass.classId)" class="space-y-3 pt-1 animate-fade-in">
          <h3 class="text-[17px] sm:text-[19px] font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[22px] text-indigo-600">info</span>
            Thông tin lớp học &amp; môn học
          </h3>
          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 p-5 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.04)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] leading-relaxed animate-fade-in">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-slate-400">school</span>
                <span class="font-medium text-slate-500">Lớp học:</span>
                <span class="font-bold text-slate-800">{{ selectedClass.className }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-slate-400">book</span>
                <span class="font-medium text-slate-500">Môn học:</span>
                <span class="font-bold text-slate-800">{{ selectedClass.courseName }}</span>
              </div>
              <div class="flex items-center gap-2" v-if="selectedClass.teacherName || selectedClassDetails?.teacherName">
                <span class="material-symbols-outlined text-[18px] text-slate-400">person</span>
                <span class="font-medium text-slate-500">Giảng viên chính:</span>
                <span class="font-bold text-slate-800">{{ selectedClass.teacherName || selectedClassDetails?.teacherName }}</span>
              </div>
              <div class="flex items-center gap-2" v-if="selectedClassDetails?.teacherName2">
                <span class="material-symbols-outlined text-[18px] text-slate-400">group</span>
                <span class="font-medium text-slate-500">Trợ giảng:</span>
                <span class="font-bold text-slate-800">{{ selectedClassDetails.teacherName2 }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-slate-400">meeting_room</span>
                <span class="font-medium text-slate-500">Phòng học:</span>
                <span class="font-bold text-slate-800">{{ selectedClassDetails?.room || selectedClass.room || 'Chưa xếp phòng' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-slate-400">date_range</span>
                <span class="font-medium text-slate-500">Thời gian học:</span>
                <span class="font-bold text-slate-800">
                  {{ formatDate(selectedClassDetails?.startDate || selectedClass.startDate) }} - {{ formatDate(selectedClassDetails?.endDate || selectedClass.endDate) }}
                </span>
              </div>
              <div class="flex items-center gap-2" v-if="selectedClassDetails?.totalSessions">
                <span class="material-symbols-outlined text-[18px] text-slate-400">tag</span>
                <span class="font-medium text-slate-500">Tổng số buổi:</span>
                <span class="font-bold text-slate-800">{{ selectedClassDetails.totalSessions }} buổi</span>
              </div>
              <div class="flex items-center gap-2" v-if="selectedClassDetails?.maxStudents">
                <span class="material-symbols-outlined text-[18px] text-slate-400">groups</span>
                <span class="font-medium text-slate-500">Sĩ số lớp:</span>
                <span class="font-bold text-slate-800">{{ selectedClassDetails.currentStudents }} / {{ selectedClassDetails.maxStudents }} học viên</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 1. Schedule section -->
        <div class="space-y-3">
          <h3 class="text-[17px] sm:text-[19px] font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[22px] text-on-tertiary-container">calendar_today</span>
            Lịch học chi tiết {{ selectedClass ? `— ${selectedClass.className}` : '' }}
          </h3>

          <div v-if="!selectedClass" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-12 text-center rounded-xl text-on-surface-variant flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-[48px] text-primary-container/30 mb-2">click_to_shrink</span>
            Chọn một lớp bên trái để xem lịch học &amp; chuyên cần.
          </div>

          <!-- Lock schedule if class tuition is unpaid -->
          <div v-else-if="isClassUnpaid(selectedClass.classId)" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-8 text-center rounded-xl text-error flex flex-col items-center justify-center gap-3">
            <span class="material-symbols-outlined text-[48px] text-error/40 animate-pulse">lock</span>
            <div class="font-semibold text-body-lg text-primary-container">Lịch học đã bị khóa</div>
            <p class="text-body-sm text-on-surface-variant max-w-xs mx-auto">
              Bạn chưa hoàn thành đóng học phí cho lớp học này. Vui lòng thanh toán học phí tại tab "Học phí & Thanh toán" để mở khóa xem lịch học.
            </p>
            <button @click="$emit('switch-tab', 'payments')" class="mt-2 px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[18px]">receipt_long</span>
              Đóng học phí ngay
            </button>
          </div>

          <div v-else-if="loadingSchedules" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-12 text-center rounded-xl text-primary-container flex flex-col items-center justify-center">
            <div class="w-8 h-8 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin mb-2"></div>
            Đang tải lịch học...
          </div>

          <div v-else-if="schedules.length === 0" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-8 text-center rounded-xl text-on-surface-variant">
            Không tìm thấy thời khóa biểu cho lớp học này.
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="schedule in schedules"
              :key="schedule.scheduleId"
              @click="viewScheduleDates(schedule)"
              class="bg-white border border-slate-200 border-l-[6px] border-l-indigo-500/80 p-3.5 rounded-xl flex justify-between items-center hover:bg-indigo-50/10 hover:border-indigo-400 hover:border-l-indigo-600 hover:shadow-md shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all cursor-pointer group"
              title="Click để xem chi tiết lịch sử học tập hôm nay"
            >
              <div class="space-y-1 flex-1 min-w-0">
                <div class="font-semibold text-primary-container text-body-lg flex items-center gap-1.5 group-hover:text-on-tertiary-container transition-colors">
                  Thứ {{ formatDayOfWeek(schedule.dayOfWeek) }}
                  <span class="material-symbols-outlined text-[16px] text-on-tertiary-container/70 opacity-0 group-hover:opacity-100 transition-opacity">info</span>
                </div>
                <div class="text-body-sm text-readable-secondary font-semibold">
                  Phòng học: <span class="font-bold text-primary-container">{{ schedule.classroom || selectedClassDetails?.room || 'Chưa xếp phòng' }}</span>
                </div>
              </div>
              
              <!-- Vertical Divider -->
              <div class="w-[1px] bg-slate-200/60 self-stretch mx-4 hidden sm:block"></div>
              
              <div class="text-right shrink-0">
                <div class="font-semibold text-on-tertiary-container text-body-sm bg-on-tertiary-container/10 px-2.5 py-1 rounded-lg">
                  {{ schedule.startTime.substring(0, 5) }} - {{ schedule.endTime.substring(0, 5) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 1b. Grades section (Table Columns Layout) -->
        <div v-if="selectedClass && !isClassUnpaid(selectedClass.classId)" class="space-y-3 pt-4 border-t border-dashed border-outline-variant/30 animate-fade-in">
          <h3 class="text-[17px] sm:text-[19px] font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[22px] text-purple-600">history_edu</span>
            Kết quả học tập &amp; Điểm số
          </h3>

          <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 p-5 rounded-xl space-y-4 shadow-[0_8px_16px_rgba(0,0,0,0.03)] text-[14px]">
            <div class="flex justify-between items-center gap-2 pb-2 border-b border-slate-200/50">
              <span class="font-bold text-primary-container">Điểm trung bình môn:</span>
              <span :class="[selectedClassAverageScore >= 5 ? 'text-emerald-600' : 'text-red-500', 'font-extrabold text-[18px] bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/40 shadow-sm']">
                {{ selectedClassAverageScore > 0 ? selectedClassAverageScore.toFixed(1) : 'Chưa tổng kết' }}
              </span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="text-slate-500 font-semibold border-b border-slate-200/50 text-[13px]">
                    <th class="pb-2 font-bold text-center">Chuyên cần</th>
                    <th class="pb-2 font-bold text-center">Điểm giữa kỳ</th>
                    <th class="pb-2 font-bold text-center">Điểm cuối kỳ</th>
                    <th class="pb-2 font-bold text-center">Kiểm tra</th>
                    <th v-for="res in getOtherExams()" :key="res.resultId" class="pb-2 font-bold text-center">
                      {{ getExamTypeLabel(res.examType) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="text-[14px]">
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <!-- Chuyên cần -->
                    <td class="py-3 text-center">
                      <div class="flex flex-col items-center justify-center gap-1.5">
                        <span :class="[selectedClassAttendanceScore >= 5 ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20', 'font-extrabold px-3 py-1 rounded border text-[13px] shadow-sm']">
                          {{ selectedClassAttendanceScore }}
                        </span>
                        <span class="text-[11px] text-slate-400 font-semibold" v-if="selectedClassAttendanceSummary">
                          Có mặt: {{ selectedClassAttendanceSummary.present }}/{{ selectedClassAttendanceSummary.totalSessions }}
                        </span>
                      </div>
                    </td>
                    <!-- Giữa kỳ -->
                    <td class="py-3 text-center">
                      <div class="flex flex-col items-center justify-center gap-1.5">
                        <span v-if="getExamScore('GiuaKy') !== null" :class="[getExamScore('GiuaKy') >= 5 ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20', 'font-extrabold px-3 py-1 rounded border text-[13px] shadow-sm']">
                          {{ getExamScore('GiuaKy') }}
                        </span>
                        <span v-else class="text-slate-400 italic text-xs">Chưa có</span>
                        <span class="text-[11px] text-slate-400 font-medium italic" v-if="getExamNote('GiuaKy')">
                          {{ getExamNote('GiuaKy') }}
                        </span>
                      </div>
                    </td>
                    <!-- Cuối kỳ -->
                    <td class="py-3 text-center">
                      <div class="flex flex-col items-center justify-center gap-1.5">
                        <span v-if="getExamScore('CuoiKy') !== null" :class="[getExamScore('CuoiKy') >= 5 ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20', 'font-extrabold px-3 py-1 rounded border text-[13px] shadow-sm']">
                          {{ getExamScore('CuoiKy') }}
                        </span>
                        <span v-else class="text-slate-400 italic text-xs">Chưa có</span>
                        <span class="text-[11px] text-slate-400 font-medium italic" v-if="getExamNote('CuoiKy')">
                          {{ getExamNote('CuoiKy') }}
                        </span>
                      </div>
                    </td>
                    <!-- Kiểm tra -->
                    <td class="py-3 text-center">
                      <div class="flex flex-col items-center justify-center gap-1.5">
                        <span v-if="getExamScore('KiemTra') !== null" :class="[getExamScore('KiemTra') >= 5 ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20', 'font-extrabold px-3 py-1 rounded border text-[13px] shadow-sm']">
                          {{ getExamScore('KiemTra') }}
                        </span>
                        <span v-else class="text-slate-400 italic text-xs">Chưa có</span>
                        <span class="text-[11px] text-slate-400 font-medium italic" v-if="getExamNote('KiemTra')">
                          {{ getExamNote('KiemTra') }}
                        </span>
                      </div>
                    </td>
                    <!-- Other exams -->
                    <td v-for="res in getOtherExams()" :key="res.resultId" class="py-3 text-center">
                      <div class="flex flex-col items-center justify-center gap-1.5">
                        <span :class="[res.score >= 5 ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20', 'font-extrabold px-3 py-1 rounded border text-[13px] shadow-sm']">
                          {{ res.score }}
                        </span>
                        <span class="text-[11px] text-slate-400 font-medium italic" v-if="res.note">
                          {{ res.note }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Schedule Dates Details Modal -->
    <teleport to="body">
      <div v-if="showScheduleModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-3xl w-full p-6 space-y-4 animate-scale-in flex flex-col max-h-[85vh]">
          <div class="flex items-center gap-3 text-primary-container border-b border-white/40 pb-3 justify-between shrink-0">
            <h3 class="font-title-md text-[18px] font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-[24px] text-on-tertiary-container">event_available</span>
              Lịch sử học Thứ {{ formatDayOfWeek(activeSchedule?.dayOfWeek) }}
            </h3>
            <button @click="closeScheduleModal" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="text-body-sm text-on-surface-variant space-y-1 bg-primary-container/[0.02] p-3 rounded-lg border border-primary-container/5 shrink-0">
            <div>Khóa học: <strong class="text-primary-container">{{ selectedClass?.courseName }}</strong></div>
            <div>Lớp: <strong class="text-primary-container">{{ selectedClass?.className }}</strong></div>
            <div>Thời gian: <strong class="text-on-tertiary-container">{{ activeSchedule?.startTime.substring(0, 5) }} - {{ activeSchedule?.endTime.substring(0, 5) }}</strong> (Phòng {{ activeSchedule?.classroom || selectedClassDetails?.room || 'Chưa xếp phòng' }})</div>
          </div>

          <!-- Two Column Content Layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1 min-h-0 text-[14px]">
            <!-- Left Column: Dates List -->
            <div class="space-y-2 pr-2 border-r border-slate-200/50 overflow-y-auto">
              <div class="font-bold text-slate-700 text-body-sm">Danh sách buổi học:</div>
              <div v-if="activeScheduleDates.length === 0" class="text-center py-8 text-on-surface-variant italic">
                Không tìm thấy buổi học nào trong khoảng thời gian của lớp.
              </div>
              <div 
                v-else
                v-for="item in activeScheduleDates"
                :key="item.date.toISOString()"
                @click="selectSessionDate(item.date)"
                :class="['flex justify-between items-center p-3 rounded-lg text-body-sm border transition-all cursor-pointer hover:bg-slate-50', selectedSessionDate?.toDateString() === item.date.toDateString() ? 'border-indigo-500 bg-indigo-50/20 font-semibold' : 'border-slate-200 bg-white/40']"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="material-symbols-outlined text-[16px] text-on-surface-variant/70 shrink-0">calendar_today</span>
                  <span class="font-semibold text-primary-container shrink-0">{{ formatDate(item.date) }}</span>
                </div>
                <span :class="[getScheduleStatusClass(item.status), 'px-2 py-0.5 rounded text-[10px] border shrink-0']">
                  {{ getScheduleStatusLabel(item.status) }}
                </span>
              </div>
            </div>

            <!-- Right Column: Details (Lesson Content & Quizzes) -->
            <div class="overflow-y-auto space-y-4">
              <div v-if="!selectedSessionDate" class="h-full flex flex-col items-center justify-center text-center text-slate-400 italic py-12">
                <span class="material-symbols-outlined text-[48px] mb-2 text-slate-300">import_contacts</span>
                Chọn một ngày học bên trái để xem nội dung bài giảng & bài kiểm tra
              </div>
              <div v-else-if="loadingSessionDetail" class="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <div class="w-8 h-8 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin mb-2"></div>
                Đang tải nội dung buổi học...
              </div>
              <div v-else class="space-y-4">
                <!-- Lesson Content Section -->
                <div class="bg-indigo-50/30 border border-indigo-100 rounded-xl p-4 space-y-2">
                  <h4 class="font-bold text-indigo-900 text-body-md flex items-center gap-1.5 border-b border-indigo-100 pb-1.5">
                    <span class="material-symbols-outlined text-[20px]">book</span>
                    Nội dung bài học
                  </h4>
                  <div v-if="sessionLesson" class="space-y-1">
                    <div class="font-bold text-slate-800 mb-1.5">{{ sessionLesson.title }}</div>
                    <div v-if="sessionLesson.fileName" class="mt-2">
                      <a :href="sessionLesson.content" :download="sessionLesson.fileName" class="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 rounded-lg text-body-sm font-semibold transition-all">
                        <span class="material-symbols-outlined text-[20px]">download</span>
                        Tải file: {{ sessionLesson.fileName }}
                      </a>
                    </div>
                    <p v-else class="text-body-sm text-slate-600 whitespace-pre-line">{{ sessionLesson.content }}</p>
                  </div>
                  <div v-else class="text-slate-400 italic text-body-sm">
                    Giảng viên chưa cập nhật nội dung cho buổi học này.
                  </div>
                </div>

                <!-- Quiz / Exam Section -->
                <div class="bg-purple-50/30 border border-purple-100 rounded-xl p-4 space-y-3">
                  <h4 class="font-bold text-purple-900 text-body-md flex items-center gap-1.5 border-b border-purple-100 pb-1.5">
                    <span class="material-symbols-outlined text-[20px]">assignment</span>
                    Bài kiểm tra buổi học
                  </h4>
                  <div v-if="sessionQuizzes.length === 0" class="text-slate-400 italic text-body-sm">
                    Không có bài kiểm tra nào trong buổi học này.
                  </div>
                  <div v-else class="space-y-3">
                    <div v-for="quiz in sessionQuizzes" :key="quiz.quizId" class="flex items-center justify-between p-3 bg-white border border-purple-100 rounded-lg shadow-sm gap-2">
                      <div class="min-w-0 flex-1">
                        <div class="font-bold text-slate-800 truncate" :title="quiz.title">{{ quiz.title }}</div>
                        <div class="text-[11px] text-slate-400 font-semibold mt-0.5">
                          Thời lượng: {{ quiz.durationMinutes }} phút | {{ quiz.quizType === 'TracNghiem' ? 'Trắc nghiệm' : 'Tự luận' }}
                        </div>
                      </div>
                      <div class="shrink-0">
                        <div v-if="quiz.hasSubmitted" class="flex items-center gap-1.5 text-right">
                          <span :class="['px-2.5 py-1 rounded text-[11px] font-bold border mr-1', quiz.isGraded ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20']">
                            {{ quiz.isGraded ? `Điểm: ${quiz.submissionScore.toFixed(1)}` : 'Đang chờ chấm' }}
                          </span>
                          <button 
                            @click="viewQuizResult(quiz)" 
                            class="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer flex items-center justify-center transition-colors"
                            title="Xem chi tiết & gửi thắc mắc"
                          >
                            <span class="material-symbols-outlined text-[16px]">help_outline</span>
                          </button>
                        </div>
                        <button 
                          v-else-if="quiz.isActive"
                          @click="startQuizTaking(quiz)"
                          class="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-body-xs transition-colors cursor-pointer active:scale-95 shadow-sm"
                        >
                          Làm bài
                        </button>
                        <span v-else class="text-body-xs text-slate-400 italic font-semibold">Đã đóng</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-3 border-t border-white/40 shrink-0">
            <button 
              @click="closeScheduleModal"
              class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-all active:scale-95 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: LÀM BÀI THI TRỰC TUYẾN -->
    <teleport to="body">
      <div v-if="showQuizTakingModal" class="fixed inset-0 glass-backdrop z-[10000] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-scale-in flex flex-col max-h-[85vh]">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
            <div class="min-w-0">
              <h3 class="font-title-md text-[18px] font-bold text-primary-container truncate">{{ takingQuiz?.title }}</h3>
              <p class="text-body-xs text-slate-400 font-semibold mt-0.5">Thời gian còn lại: <strong class="text-rose-500 text-body-sm font-bold">{{ formattedTimeRemaining }}</strong></p>
            </div>
            <!-- Prevent closing by mistake -->
            <button @click="confirmCancelQuiz" class="text-on-surface-variant hover:text-rose-600 cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Progress Bar & Stats -->
          <div class="px-1 shrink-0" v-if="!loadingQuizQuestions && quizQuestions.length > 0">
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{ width: quizProgressPercentage + '%' }"></div>
            </div>
            <div class="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-1">
              <span>Tiến độ: {{ answeredQuestionsCount }} / {{ quizQuestions.length }} câu hỏi</span>
              <span>{{ quizProgressPercentage }}% hoàn thành</span>
            </div>
          </div>

          <div class="overflow-y-auto flex-1 pr-1 space-y-4 text-[14px]">
            <div v-if="loadingQuizQuestions" class="py-12 text-center">
              <div class="w-8 h-8 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin mx-auto mb-2"></div>
              Đang tải đề thi...
            </div>
            <div v-else-if="quizQuestions.length === 0" class="py-12 text-center text-slate-400 font-semibold italic">
              <span class="material-symbols-outlined text-[48px] mb-2 text-slate-300">warning</span>
              <p>Đề thi này chưa có câu hỏi nào được cấu hình.</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="(question, index) in quizQuestions" :key="question.questionId" class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div class="font-bold text-slate-700">Câu {{ index + 1 }}: {{ question.questionText }}</div>
                
                <!-- Trắc nghiệm options -->
                <div v-if="takingQuiz?.quizType === 'TracNghiem'" class="space-y-2 pl-2">
                  <div v-for="(option, oIdx) in question.options?.split('|')" :key="option" class="flex items-start gap-2.5">
                    <input 
                      type="radio" 
                      :id="'opt_' + question.questionId + '_' + oIdx"
                      :name="'question_' + question.questionId" 
                      :value="getOptionCode(oIdx)" 
                      v-model="quizAnswers[question.questionId]"
                      class="mt-1 w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500 cursor-pointer"
                    />
                    <label :for="'opt_' + question.questionId + '_' + oIdx" class="text-body-sm text-slate-600 cursor-pointer hover:text-slate-800 leading-snug">
                      {{ option }}
                    </label>
                  </div>
                </div>

                <!-- Tự luận textarea -->
                <div v-else class="pl-2">
                  <textarea 
                    v-model="quizAnswers[question.questionId]"
                    rows="4" 
                    placeholder="Nhập câu trả lời của bạn ở đây..." 
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 shrink-0">
            <button @click="confirmCancelQuiz" class="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-body-sm cursor-pointer">Thủy</button>
            <button @click="submitQuiz" :disabled="submittingQuiz" class="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-body-sm cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50">
              <span v-if="submittingQuiz" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Nộp bài thi
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: XEM KẾT QUẢ & GỬI THẮC MẮC -->
    <teleport to="body">
      <div v-if="showQuizResultModal" class="fixed inset-0 glass-backdrop z-[10000] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-scale-in flex flex-col max-h-[80vh]">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container">
              Kết quả & Thắc mắc: {{ resultQuiz?.title }}
            </h3>
            <button @click="showQuizResultModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="overflow-y-auto flex-1 pr-1 space-y-5 text-[14px]">
            
            <!-- Result Stats Card -->
            <div class="p-4 bg-purple-50/50 border border-purple-100 rounded-xl space-y-2">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-600">Trạng thái chấm điểm:</span>
                <span :class="['px-2 py-0.5 rounded text-[11px] font-bold border', resultQuiz?.isGraded ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20']">
                  {{ resultQuiz?.isGraded ? 'Đã chấm điểm' : 'Chờ giáo viên chấm' }}
                </span>
              </div>
              
              <div class="flex justify-between items-center border-t border-purple-100/55 pt-2" v-if="resultQuiz?.isGraded">
                <span class="font-bold text-primary-container">Điểm số đạt được:</span>
                <span class="text-display-xs font-bold text-purple-700">{{ resultQuiz?.submissionScore?.toFixed(1) }} / 10.0</span>
              </div>

              <div class="border-t border-purple-100/55 pt-2 space-y-1" v-if="resultQuiz?.teacherNote">
                <span class="font-bold text-slate-700">Lời nhận xét của giáo viên:</span>
                <p class="text-body-sm text-slate-600 italic bg-white/60 p-2.5 rounded-lg border border-purple-100/30">
                  "{{ resultQuiz?.teacherNote }}"
                </p>
              </div>
            </div>

            <!-- doubt submission form -->
            <div class="space-y-3 pt-2 border-t border-slate-200/60">
              <h4 class="font-bold text-slate-800 text-body-sm flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px]">rate_review</span>
                Gửi câu hỏi / thắc mắc cho giáo viên
              </h4>
              
              <textarea 
                v-model="doubtText" 
                rows="3" 
                placeholder="Ví dụ: Thưa thầy/cô, câu hỏi số 3 em chưa hiểu rõ đáp án, nhờ thầy cô giải thích lại..." 
                class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold"
              ></textarea>
              
              <div class="flex justify-end">
                <button
                  @click="submitDoubt"
                  :disabled="submittingDoubt || !doubtText.trim()"
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-body-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.15)] active:scale-95 cursor-pointer"
                >
                  <span v-if="submittingDoubt" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span class="material-symbols-outlined text-[16px]" v-else>send</span>
                  Gửi thắc mắc
                </button>
              </div>
            </div>

            <!-- List of doubts already submitted -->
            <div class="space-y-3 pt-2 border-t border-slate-200/60">
              <h4 class="font-bold text-slate-800 text-body-sm flex items-center gap-1.5">
                <span class="material-symbols-outlined text-slate-500 text-[18px]">history</span>
                Lịch sử thắc mắc đã gửi ({{ quizStudentQuestions.length }})
              </h4>

              <div v-if="loadingQuizStudentQuestions" class="text-center py-6">
                <span class="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></span>
              </div>
              
              <div v-else-if="quizStudentQuestions.length > 0" class="space-y-2.5">
                <div v-for="q in quizStudentQuestions" :key="q.id" class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>Bạn đã hỏi</span>
                    <span>{{ formatDate(q.createdAt) }}</span>
                  </div>
                  <p class="text-body-sm text-slate-700 leading-normal font-semibold">{{ q.questionText }}</p>
                </div>
              </div>

              <div v-else class="text-center py-6 text-slate-400 italic text-body-xs font-semibold">
                Bạn chưa gửi thắc mắc nào cho bài kiểm tra này.
              </div>
            </div>

          </div>

          <div class="flex justify-end pt-3 border-t border-slate-200 shrink-0">
            <button
              @click="showQuizResultModal = false"
              class="px-5 py-2.5 bg-transparent border border-outline-variant text-on-surface-variant font-semibold rounded-lg text-body-sm hover:bg-slate-50 transition-colors cursor-pointer"
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
import { ref, computed, watch, onUnmounted } from 'vue'
import { useAuthStore } from '../../../stores'
import api from '../../../services/api'

const authStore = useAuthStore()

const searchText = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const filteredClasses = computed(() => {
  const query = searchText.value.toLowerCase().trim()
  if (!query) return props.enrolledClasses
  return props.enrolledClasses.filter(c => 
    (c.className && c.className.toLowerCase().includes(query)) ||
    (c.courseName && c.courseName.toLowerCase().includes(query))
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredClasses.value.length / itemsPerPage) || 1
})

const paginatedClasses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredClasses.value.slice(start, end)
})

watch(searchText, () => {
  currentPage.value = 1
})

const props = defineProps({
  enrolledClasses: { type: Array, required: true },
  selectedClass: { type: Object, default: null },
  schedules: { type: Array, required: true },
  loadingSchedules: { type: Boolean, default: false },
  payments: { type: Array, required: true },
  mySupportMessages: { type: Array, required: true },
  currentConflicts: { type: Array, required: true },
  attendanceSummaries: { type: Array, default: () => [] },
  examResults: { type: Object, default: () => ({}) },
  selectedClassDetails: { type: Object, default: null }
})

defineEmits([
  'select-class',
  'open-support-conflict',
  'open-transfer-modal',
  'change-enrollment-status',
  'open-support-dialog',
  'switch-tab',
  'change-attendance-status'
])

// Modal states for clicking schedules
const showScheduleModal = ref(false)
const activeSchedule = ref(null)

const selectedClassExamResults = computed(() => {
  if (!props.selectedClass || !props.examResults) return []
  return props.examResults[props.selectedClass.enrollmentId] || []
})

const selectedClassAttendanceScore = computed(() => {
  const summary = selectedClassAttendanceSummary.value
  if (!summary || !summary.totalSessions) return 10.0
  const total = summary.totalSessions
  const present = summary.present || 0
  const late = summary.late || 0
  const excused = summary.excused || 0
  
  const score = ((present + excused + late) / total) * 10
  return Math.min(10, Math.max(0, Math.round(score * 10) / 10))
})

const selectedClassAverageScore = computed(() => {
  const cc = selectedClassAttendanceScore.value
  const gk = selectedClassExamResults.value.find(r => r.examType === 'GiuaKy')?.score
  const ck = selectedClassExamResults.value.find(r => r.examType === 'CuoiKy')?.score
  
  if (gk === undefined || ck === undefined) {
    return 0
  }
  
  return Math.round((cc * 0.1 + gk * 0.3 + ck * 0.6) * 10) / 10
})

const selectedClassAttendanceSummary = computed(() => {
  if (!props.selectedClass || !props.attendanceSummaries) return null
  return props.attendanceSummaries.find(s => s.classId === props.selectedClass.classId)
})

// Check if a class is conflicting
const isClassConflicting = (classId) => {
  if (!props.currentConflicts) return false
  const hasTimeConflict = props.currentConflicts.some(c => 
    c.classA?.classId === classId || 
    c.classB?.classId === classId
  )
  if (hasTimeConflict) return true

  const cls = props.enrolledClasses.find(c => c.classId === classId)
  if (cls && cls.status === 'DangHoc') {
    const hasCourseConflict = props.enrolledClasses.some(c => 
      c.classId !== classId && 
      c.status === 'DangHoc' && 
      c.courseId === cls.courseId
    )
    if (hasCourseConflict) return true
  }

  return false
}

// Time conflict involving selected class
const selectedClassTimeConflict = computed(() => {
  if (!props.selectedClass || !props.currentConflicts) return null
  return props.currentConflicts.find(c => 
    c.classA?.classId === props.selectedClass.classId || 
    c.classB?.classId === props.selectedClass.classId
  )
})

const conflictingTimeClass = computed(() => {
  const conf = selectedClassTimeConflict.value
  if (!conf) return null
  return conf.classA?.classId === props.selectedClass.classId ? conf.classB : conf.classA
})

// Course conflict involving selected class (more than 1 active class for the same course)
const conflictingCourseClass = computed(() => {
  if (!props.selectedClass || props.selectedClass.status !== 'DangHoc') return null
  return props.enrolledClasses.find(c => 
    c.classId !== props.selectedClass.classId && 
    c.status === 'DangHoc' && 
    c.courseId === props.selectedClass.courseId
  )
})

// Any conflict
const hasConflict = computed(() => {
  return !!selectedClassTimeConflict.value || !!conflictingCourseClass.value
})

const conflictMessage = computed(() => {
  if (selectedClassTimeConflict.value && conflictingTimeClass.value) {
    return `Lớp này đang bị trùng lịch học với lớp <strong class="text-slate-900 font-extrabold">${conflictingTimeClass.value.className}</strong> (Môn: ${conflictingTimeClass.value.courseName || 'Khác'}).`
  }
  if (conflictingCourseClass.value) {
    return `Lớp này đang bị trùng môn học với lớp <strong class="text-slate-900 font-extrabold">${conflictingCourseClass.value.className}</strong> (Cùng môn: ${props.selectedClass.courseName}).`
  }
  return ''
})

const conflictTargetForSupport = computed(() => {
  if (selectedClassTimeConflict.value && conflictingTimeClass.value) {
    return conflictingTimeClass.value
  }
  if (conflictingCourseClass.value) {
    return conflictingCourseClass.value
  }
  return null
})

const activeScheduleDates = computed(() => {
  if (!activeSchedule.value || !props.selectedClassDetails || !props.schedules) return []
  const classDetails = props.selectedClassDetails
  if (!classDetails.startDate || !classDetails.endDate) return []
  
  const start = new Date(classDetails.startDate)
  const end = new Date(classDetails.endDate)
  const targetDayOfWeek = activeSchedule.value.dayOfWeek // e.g. 2 for Monday
  
  const dates = []
  let current = new Date(start)
  current.setHours(0, 0, 0, 0)
  
  const endLimit = new Date(end)
  endLimit.setHours(23, 59, 59, 999)
  
  while (current <= endLimit) {
    const dbDay = current.getDay() + 1 // 1=Sunday, 2=Monday...
    if (dbDay === targetDayOfWeek) {
      dates.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }
  
  // Map dates to attendance status
  const sessions = selectedClassAttendanceSummary.value?.sessions || []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return dates.map(date => {
    const match = sessions.find(s => {
      const sessionDate = new Date(s.sessionDate)
      return sessionDate.getFullYear() === date.getFullYear() &&
             sessionDate.getMonth() === date.getMonth() &&
             sessionDate.getDate() === date.getDate()
    })
    
    let status = 'ChuaDienRa'
    let note = ''
    
    if (match) {
      status = match.status
      note = match.note
    } else {
      if (date <= today) {
        status = 'ChuaDiemDanh'
      }
    }
    
    return {
      date,
      status,
      note
    }
  })
})

function viewScheduleDates(schedule) {
  activeSchedule.value = schedule
  showScheduleModal.value = true
}

function getScheduleStatusLabel(status) {
  const map = {
    CoMat: 'Đi học',
    Vang: 'Vắng mặt',
    DiTre: 'Đi muộn',
    CoPhep: 'Có phép',
    ChuaDiemDanh: 'Vắng mặt (Chưa điểm danh)',
    ChuaDienRa: 'Chưa diễn ra'
  }
  return map[status] || status
}

function getScheduleStatusClass(status) {
  const map = {
    CoMat: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    Vang: 'bg-red-500/10 text-red-500 border border-red-500/20 font-bold',
    DiTre: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    CoPhep: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    ChuaDiemDanh: 'bg-red-500/5 text-red-500/80 border border-red-500/10 italic',
    ChuaDienRa: 'bg-outline-variant/10 text-on-surface-variant/60 border border-outline-variant/20'
  }
  return map[status] || 'bg-outline/10 text-on-surface'
}

function getAttendanceStatusClass(status) {
  const map = {
    CoMat: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    Vang: 'bg-red-500/10 text-red-500 border border-red-500/20',
    DiTre: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    CoPhep: 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
  }
  return map[status] || 'bg-outline-variant/10 text-on-surface-variant'
}

function getAttendanceStatusLabel(status) {
  const map = {
    CoMat: 'Đi học',
    Vang: 'Vắng mặt',
    DiTre: 'Đi muộn',
    CoPhep: 'Có phép'
  }
  return map[status] || status
}

function getExamTypeLabel(type) {
  const map = { GiuaKy: 'Giữa kỳ', CuoiKy: 'Cuối kỳ', KiemTra: 'Kiểm tra' }
  return map[type] || type
}

function getExamScore(examType) {
  if (!selectedClassExamResults.value) return null
  const res = selectedClassExamResults.value.find(r => r.examType === examType)
  return res ? res.score : null
}

function getExamNote(examType) {
  if (!selectedClassExamResults.value) return ''
  const res = selectedClassExamResults.value.find(r => r.examType === examType)
  return res ? res.note : ''
}

function getOtherExams() {
  if (!selectedClassExamResults.value) return []
  return selectedClassExamResults.value.filter(r => r.examType !== 'GiuaKy' && r.examType !== 'CuoiKy' && r.examType !== 'KiemTra')
}

function isClassUnpaid(classId) {
  if (!props.payments) return false
  const payment = props.payments.find(p => p.classId === classId)
  return payment && payment.status === 'ChuaTT'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  let normalizedStr = dateStr
  if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
    normalizedStr = dateStr + 'Z'
  }
  const date = new Date(normalizedStr)
  return date.toLocaleDateString('vi-VN')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  let normalizedStr = dateStr
  if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
    normalizedStr = dateStr + 'Z'
  }
  const date = new Date(normalizedStr)
  return date.toLocaleString('vi-VN')
}

function formatDayOfWeek(day) {
  const map = { 1: 'Chủ Nhật', 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu', 7: 'Bảy' }
  return map[day] || day
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
    Approved: 'status-completed',
    Rejected: 'status-cancelled'
  }
  return map[status] || 'bg-outline/10 text-on-surface'
}

// ==========================================
// HỌC VIÊN XEM BÀI HỌC & LÀM BÀI TẬP
// ==========================================
const selectedSessionDate = ref(null)
const loadingSessionDetail = ref(false)
const sessionLesson = ref(null)
const sessionQuizzes = ref([])

// Quiz Taking
const showQuizTakingModal = ref(false)
const takingQuiz = ref(null)
const quizQuestions = ref([])
const loadingQuizQuestions = ref(false)
const quizAnswers = ref({})
const submittingQuiz = ref(false)

// Quiz Result & Doubts
const showQuizResultModal = ref(false)
const resultQuiz = ref(null)
const doubtText = ref('')
const submittingDoubt = ref(false)
const quizStudentQuestions = ref([])
const loadingQuizStudentQuestions = ref(false)

// Timer
let timerInterval = null
const timeRemainingSeconds = ref(0)

// Progress tracking
const answeredQuestionsCount = computed(() => {
  return quizQuestions.value.filter(q => {
    const ans = quizAnswers.value[q.questionId]
    return ans !== undefined && ans !== null && String(ans).trim() !== ''
  }).length
})

const quizProgressPercentage = computed(() => {
  if (quizQuestions.value.length === 0) return 0
  return Math.round((answeredQuestionsCount.value / quizQuestions.value.length) * 100)
})

const formattedTimeRemaining = computed(() => {
  const mins = Math.floor(timeRemainingSeconds.value / 60)
  const secs = timeRemainingSeconds.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

async function selectSessionDate(date) {
  selectedSessionDate.value = date
  loadingSessionDetail.value = true
  sessionLesson.value = null
  sessionQuizzes.value = []
  
  const dateStr = date.toLocaleDateString('en-CA')
  try {
    // 1. Get lesson
    try {
      const resLesson = await api.get(`/api/v1/lessons/class/${props.selectedClass.classId}/date/${dateStr}`)
      sessionLesson.value = resLesson.data
    } catch (e) {
      if (e.response?.status !== 404) {
        console.error('Error fetching lesson:', e)
      }
    }
    
    // 2. Get quizzes
    const resQuizzes = await api.get(`/api/v1/quizzes/class/${props.selectedClass.classId}`)
    const allQuizzes = resQuizzes.data || []
    sessionQuizzes.value = allQuizzes.filter(q => {
      if (!q.lessonDate) return false
      const qDate = new Date(q.lessonDate).toLocaleDateString('en-CA')
      return qDate === dateStr
    })
  } catch (err) {
    console.error('Error loading session details:', err)
  } finally {
    loadingSessionDetail.value = false
  }
}

function closeScheduleModal() {
  showScheduleModal.value = false
  selectedSessionDate.value = null
  sessionLesson.value = null
  sessionQuizzes.value = []
}

async function startQuizTaking(quiz) {
  takingQuiz.value = quiz
  showQuizTakingModal.value = true
  loadingQuizQuestions.value = true
  quizAnswers.value = {}
  timeRemainingSeconds.value = quiz.durationMinutes * 60
  
  try {
    const res = await api.get(`/api/v1/quizzes/${quiz.quizId}`)
    quizQuestions.value = res.data.Questions || res.data.questions || []
    
    // Initialize answers
    quizQuestions.value.forEach(q => {
      quizAnswers.value[q.questionId] = ''
    })
    
    // Start countdown
    startTimer()
  } catch (e) {
    console.error('Error fetching quiz details:', e)
    alert('Không thể tải chi tiết đề thi.')
    showQuizTakingModal.value = false
  } finally {
    loadingQuizQuestions.value = false
  }
}

function startTimer() {
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeRemainingSeconds.value > 0) {
      timeRemainingSeconds.value--
    } else {
      clearInterval(timerInterval)
      alert('Đã hết thời gian làm bài! Hệ thống sẽ tự động nộp bài làm của bạn.')
      submitQuiz()
    }
  }, 1000)
}

onUnmounted(() => {
  clearInterval(timerInterval)
})

function confirmCancelQuiz() {
  if (confirm('Bạn có chắc muốn thoát? Kết quả làm bài sẽ không được lưu lại.')) {
    clearInterval(timerInterval)
    showQuizTakingModal.value = false
    takingQuiz.value = null
  }
}

async function submitQuiz() {
  submittingQuiz.value = true
  clearInterval(timerInterval)
  
  const answersDict = {}
  Object.keys(quizAnswers.value).forEach(k => {
    answersDict[k] = quizAnswers.value[k]
  })
  
  try {
    const res = await api.post(`/api/v1/quizzes/${takingQuiz.value.quizId}/submit`, {
      answers: answersDict
    })
    
    alert(`Nộp bài thành công! ${res.data.score !== null ? 'Điểm của bạn: ' + res.data.score.toFixed(1) : 'Bài tự luận đã được nộp để giáo viên chấm điểm.'}`)
    showQuizTakingModal.value = false
    takingQuiz.value = null
    
    // Refresh session data
    if (selectedSessionDate.value) {
      selectSessionDate(selectedSessionDate.value)
    }
  } catch (e) {
    console.error('Error submitting quiz answers:', e)
    alert(e.response?.data?.message || 'Có lỗi xảy ra khi nộp bài.')
  } finally {
    submittingQuiz.value = false
  }
}

async function viewQuizResult(quiz) {
  resultQuiz.value = quiz
  showQuizResultModal.value = true
  doubtText.value = ''
  fetchQuizStudentQuestions(quiz.quizId)
}

async function fetchQuizStudentQuestions(quizId) {
  loadingQuizStudentQuestions.value = true
  quizStudentQuestions.value = []
  try {
    const res = await api.get(`/api/v1/quizzes/${quizId}/questions`)
    quizStudentQuestions.value = res.data || []
  } catch (e) {
    console.error('Error fetching student doubts:', e)
  } finally {
    loadingQuizStudentQuestions.value = false
  }
}

async function submitDoubt() {
  if (!doubtText.value.trim()) return
  submittingDoubt.value = true
  try {
    await api.post(`/api/v1/quizzes/${resultQuiz.value.quizId}/questions`, {
      questionText: doubtText.value.trim()
    })
    doubtText.value = ''
    alert('Gửi thắc mắc thành công!')
    fetchQuizStudentQuestions(resultQuiz.value.quizId)
  } catch (e) {
    console.error('Error submitting doubt:', e)
    alert('Không thể gửi thắc mắc. Vui lòng thử lại.')
  } finally {
    submittingDoubt.value = false
  }
}

function getOptionCode(idx) {
  return ['A', 'B', 'C', 'D', 'E'][idx] || 'A'
}

function getStatusLabel(status) {
  const map = {
    Pending: 'Chờ duyệt',
    Approved: 'Đã duyệt',
    Rejected: 'Từ chối'
  }
  return map[status] || status
}
</script>
