<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Header & Back Button -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-gutter">
      <div>
        <div class="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
          <router-link to="/classes" class="text-on-tertiary-container hover:underline transition-colors">Quản lý lớp học</router-link>
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          <span class="text-on-surface">{{ currentClass?.className || 'Chi tiết lớp học' }}</span>
        </div>
        <h1 class="font-headline-lg text-headline-lg text-primary-container mt-1">Học viên & Học tập Lớp học</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant mt-0.5">
          Theo dõi danh sách học viên, thực hiện điểm danh và nhập điểm thi cho lớp.
        </p>
      </div>

    </div>

    <!-- Class Detail Overview Panel -->
    <div v-if="loadingClass" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-gutter shadow-[0_12px_24px_rgba(0,0,0,0.05)] animate-pulse space-y-4">
      <div class="h-6 bg-surface-container-high rounded w-1/4"></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="h-10 bg-surface-container-high rounded" v-for="i in 4" :key="i"></div>
      </div>
    </div>
    <div v-else-if="currentClass" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-gutter shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/40 pb-4 mb-4">
        <div>
          <h2 class="font-headline-lg text-headline-lg text-primary-container">{{ currentClass.className }}</h2>
          <p class="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Môn học: <span class="font-semibold text-primary-container">{{ currentClass.courseName }}</span></p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-body-sm text-on-surface-variant font-semibold">Trạng thái lớp:</span>
          <span :class="['status-badge', getStatusBadgeClass(currentClass.status)]">
            {{ getStatusLabel(currentClass.status) }}
          </span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter text-body-sm text-on-surface-variant">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-on-tertiary-container/10 text-on-tertiary-container flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px]">account_circle</span>
          </div>
          <div>
            <div class="font-label-caps text-label-caps text-on-surface-variant/80">Giáo viên</div>
            <div v-if="authStore.isAdmin" class="relative mt-0.5">
              <select
                v-model="currentClassTeacherId"
                @change="assignTeacherFromDetail"
                class="bg-transparent border border-outline-variant rounded px-2 py-0.5 text-body-xs font-semibold text-primary focus:outline-none cursor-pointer"
              >
                <option :value="null">Chưa phân công</option>
                <option v-for="t in teachers" :key="t.userId" :value="t.userId">
                  {{ t.fullName }}
                </option>
              </select>
            </div>
            <div v-else class="font-semibold text-primary-container">
              {{ currentClass.teacherName || 'Chưa phân công' }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px]">meeting_room</span>
          </div>
          <div>
            <div class="font-label-caps text-label-caps text-on-surface-variant/80">Phòng học</div>
            <div class="font-semibold text-primary-container">{{ currentClass.room || 'Chưa xếp phòng' }}</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px]">group</span>
          </div>
          <div>
            <div class="font-label-caps text-label-caps text-on-surface-variant/80">Sĩ số lớp</div>
            <div class="font-semibold text-primary-container">{{ currentClass.currentStudents }} / {{ currentClass.maxStudents }} học viên</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px]">calendar_month</span>
          </div>
          <div>
            <div class="font-label-caps text-label-caps text-on-surface-variant/80">Thời gian học</div>
            <div class="font-semibold text-primary-container" v-if="currentClass.startDate">
              {{ formatDate(currentClass.startDate) }} - {{ formatDate(currentClass.endDate) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar bg-surface-container-high/50 p-1 rounded-xl">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-4 py-2.5 font-title-md text-body-sm transition-all flex items-center gap-2 rounded-lg',
          activeTab === tab.value
            ? 'bg-primary-container text-white font-bold shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-container-high rounded-lg'
        ]"
      >
        <span class="material-symbols-outlined text-[20px]">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- Active Tab Canvas Content -->
    <div class="space-y-gutter">
      <!-- TAB 1: DANH SÁCH HỌC VIÊN -->
      <div v-if="activeTab === 'roster'" class="space-y-gutter">
        <!-- Roster Actions & Filters -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-gutter shadow-[0_12px_24px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div class="relative w-full sm:flex-1">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              v-model="rosterSearch"
              class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-10 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
              placeholder="Tìm học viên trong lớp theo tên..."
              type="text"
            />
            <button
              v-if="rosterSearch"
              @click="rosterSearch = ''"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <button
            v-if="authStore.isAdmin"
            @click="openEnrollModal"
            class="w-full sm:w-auto bg-primary-container text-white px-5 py-2.5 rounded-lg font-semibold text-body-sm shadow-sm hover:bg-primary transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span class="material-symbols-outlined text-[18px]">person_add</span>
            Xếp học viên vào lớp
          </button>
        </div>

        <!-- Roster Ledger Data Table -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
          <div v-if="loadingRoster" class="p-12 space-y-4 animate-pulse">
            <div class="h-8 bg-surface-container-high rounded w-full"></div>
            <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 3" :key="i"></div>
          </div>

          <div v-else-if="filteredRoster.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-container-high text-on-surface-variant font-title-md text-body-sm">
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Mã HV</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Họ và tên</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Số điện thoại</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Ngày đăng ký</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Trạng thái đăng ký</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody class="font-body-sm text-body-sm">
                <tr
                  v-for="en in filteredRoster"
                  :key="en.enrollmentId"
                  class="border-t border-white/40 hover:bg-white/30 transition-colors group"
                >
                  <td class="py-4 px-6 font-semibold text-primary-container">HV-{{ String(en.studentId).padStart(4, '0') }}</td>
                  <td class="py-4 px-6 font-semibold text-on-surface">{{ en.studentName }}</td>
                  <td class="py-4 px-6 text-on-surface-variant">{{ en.phone || '-' }}</td>
                  <td class="py-4 px-6 text-on-surface-variant">{{ formatDate(en.enrolledAt) }}</td>
                  <td class="py-4 px-6">
                    <span :class="['status-badge', getEnrollmentStatusBadgeClass(en.status)]">
                      {{ getEnrollmentStatusLabel(en.status) }}
                    </span>
                  </td>
                  <td class="py-2 px-6 text-right relative">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        @click="toggleRosterDropdown(en.enrollmentId)"
                        class="p-1.5 rounded-lg bg-transparent hover:bg-black/5 text-black transition-colors inline-flex items-center justify-center cursor-pointer active:scale-95"
                        title="Đổi trạng thái học"
                      >
                        <span class="material-symbols-outlined text-[20px]">assignment_ind</span>
                      </button>

                      <!-- Dropdown menu -->
                      <div v-if="activeRosterDropdownId === en.enrollmentId" class="absolute right-24 top-10 w-40 rounded-xl bg-white/95 backdrop-blur-[20px] border border-white/40 shadow-2xl py-2 z-30 animate-scale-in text-left">
                        <button
                          v-for="opt in enrollmentStatusOptions"
                          :key="opt.value"
                          @click="changeEnrollmentStatus(en.enrollmentId, opt.value)"
                          class="w-full text-left px-4 py-2 text-body-sm text-on-surface hover:bg-black/5 transition-colors font-medium cursor-pointer"
                        >
                          {{ opt.label }}
                        </button>
                      </div>

                      <button
                        @click="openAdminTransferModal(en)"
                        class="p-1.5 rounded-lg bg-transparent hover:bg-black/5 text-black transition-colors inline-flex items-center justify-center cursor-pointer active:scale-95"
                        title="Chuyển lớp"
                      >
                        <span class="material-symbols-outlined text-[20px]">sync_alt</span>
                      </button>

                      <button
                        @click="deleteEnrollmentConfirm(en)"
                        class="p-1.5 rounded-lg bg-transparent hover:bg-black/5 text-black transition-colors inline-flex items-center justify-center cursor-pointer active:scale-95"
                        title="Xóa học viên khỏi lớp"
                      >
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="p-12 text-center flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-outline/30 text-[64px] mb-3">group</span>
            <p class="text-body-lg font-body-lg text-on-surface-variant">Chưa có học viên nào được xếp vào lớp học này</p>
          </div>
        </div>
      </div>

      <!-- TAB 2: ĐIỂM DANH HÀNG LOẠT -->
      <div v-if="activeTab === 'attendance'" class="space-y-gutter">
        <!-- Date selector & Controls -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-gutter shadow-[0_12px_24px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
            <div class="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <span class="text-body-sm font-semibold text-on-surface shrink-0">Ngày:</span>
              <input
                v-model="attendanceDate"
                type="date"
                @change="fetchAttendanceForDate"
                class="bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm font-body-sm text-on-surface w-full sm:w-40"
              />
            </div>
            <div class="relative w-full flex-1">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                v-model="attendanceSearch"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-9 pr-8 py-2 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                placeholder="Tìm học viên điểm danh theo tên hoặc mã HV..."
                type="text"
              />
              <button
                v-if="attendanceSearch"
                @click="attendanceSearch = ''"
                type="button"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-5 h-5 rounded-full hover:bg-primary-container/10"
              >
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
            <span class="text-body-sm text-on-surface-variant italic mr-2" v-if="attendanceLoaded">
              {{ attendanceRecordExists ? 'Đã điểm danh' : 'Chưa điểm danh' }}
            </span>
            <button
              v-if="!authStore.isAdmin"
              @click="setAllAttendanceStatus('CoMat')"
              class="px-3 py-1.5 bg-transparent border border-outline-variant hover:bg-surface-container-high text-on-surface-variant rounded-lg font-semibold text-body-sm transition-colors cursor-pointer"
            >
              Chọn Có mặt tất cả
            </button>
          </div>
        </div>

        <!-- Attendance Grid table -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
          <div v-if="loadingAttendance" class="p-12 space-y-4 animate-pulse">
            <div class="h-8 bg-surface-container-high rounded w-full"></div>
            <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 3" :key="i"></div>
          </div>

          <div v-else-if="attendanceList.length > 0" class="overflow-x-auto">
            <table v-if="filteredAttendance.length > 0" class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-container-high text-on-surface-variant font-title-md text-body-sm">
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Mã HV</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Học viên</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Trạng thái điểm danh</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Ghi chú</th>
                </tr>
              </thead>
              <tbody class="font-body-sm text-body-sm">
                <tr
                  v-for="att in filteredAttendance"
                  :key="att.enrollmentId"
                  class="border-t border-white/40 hover:bg-white/30 transition-colors"
                >
                  <td class="py-4 px-6 font-semibold text-primary-container">HV-{{ String(att.studentId).padStart(4, '0') }}</td>
                  <td class="py-4 px-6 font-semibold text-on-surface">{{ att.studentName }}</td>
                  <td class="py-4 px-6">
                    <!-- Custom Segmented Buttons for Attendance Status -->
                    <div class="flex items-center gap-1 bg-primary-container/[0.05] p-1 rounded-lg border border-primary-container/10 w-fit">
                      <button
                        v-for="statusOpt in attendanceStatusOptions"
                        :key="statusOpt.value"
                        :disabled="authStore.isAdmin"
                        @click="att.status = statusOpt.value"
                        :class="[
                          'px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all',
                          att.status === statusOpt.value
                            ? statusOpt.activeClass + ' shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface hover:bg-white/20',
                          authStore.isAdmin ? 'cursor-default pointer-events-none' : 'cursor-pointer'
                        ]"
                      >
                        {{ statusOpt.label }}
                      </button>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <input
                      v-model="att.note"
                      type="text"
                      :disabled="authStore.isAdmin"
                      class="w-full max-w-xs bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-1.5 text-body-sm font-body-sm text-on-surface disabled:opacity-70 disabled:cursor-not-allowed"
                      placeholder="Ghi chú (ốm nghỉ, lò muộn...)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="p-12 text-center flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-outline/30 text-[48px] mb-2">search</span>
              <p class="text-body-sm text-on-surface-variant font-medium">Không tìm thấy học viên nào phù hợp với từ khóa</p>
            </div>
          </div>
          
          <div v-else class="p-12 text-center flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-outline/30 text-[64px] mb-3">fact_check</span>
            <p class="text-body-lg font-body-lg text-on-surface-variant">Không có học viên nào trong lớp để điểm danh</p>
          </div>
        </div>

        <!-- Save Button bar -->
        <div v-if="attendanceList.length > 0 && !authStore.isAdmin" class="flex justify-end pt-2">
          <button
            @click="saveAttendance"
            :disabled="savingAttendance"
            class="bg-primary-container text-white px-6 py-3 rounded-lg font-semibold text-body-sm shadow-sm hover:bg-primary transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="savingAttendance" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span class="material-symbols-outlined text-[20px]" v-else>save</span>
            Lưu bảng điểm danh
          </button>
        </div>
      </div>

      <!-- TAB 3: ĐIỂM SỐ HỌC TẬP -->
      <div v-if="activeTab === 'grades'" class="space-y-gutter">
        <!-- Grades Search -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-gutter shadow-[0_12px_24px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div class="relative w-full flex-1">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              v-model="gradesSearch"
              class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-10 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
              placeholder="Tìm học viên theo tên hoặc mã HV..."
              type="text"
            />
            <button
              v-if="gradesSearch"
              @click="gradesSearch = ''"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <!-- Roster grades report table -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
          <div v-if="loadingGrades" class="p-12 space-y-4 animate-pulse">
            <div class="h-8 bg-surface-container-high rounded w-full"></div>
            <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 3" :key="i"></div>
          </div>

          <div v-else-if="gradesList.length > 0" class="overflow-x-auto">
            <table v-if="filteredGrades.length > 0" class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-container-high text-on-surface-variant font-title-md text-body-sm">
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Mã HV</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap">Họ và tên</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap text-center">Chuyên cần</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap text-center">Kiểm tra</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap text-center">Giữa kỳ</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap text-center">Cuối kỳ</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap text-center">Điểm TB</th>
                  <th class="py-4 px-6 font-semibold whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody class="font-body-sm text-body-sm">
                <tr
                  v-for="st in filteredGrades"
                  :key="st.studentId"
                  class="border-t border-white/40 hover:bg-white/30 transition-colors group"
                >
                  <td class="py-4 px-6 font-semibold text-primary-container">HV-{{ String(st.studentId).padStart(4, '0') }}</td>
                  <td class="py-4 px-6 font-semibold text-on-surface">{{ st.studentName }}</td>
                  <td class="py-2 px-4 text-center">
                    <span class="font-bold text-primary px-2 py-0.5 rounded bg-white/40 border border-white/60 text-[12px]">
                      {{ st.attendanceScore }}
                    </span>
                  </td>
                  <td class="py-2 px-4 text-center">
                    <input
                      v-model.number="st.editKiemTra.score"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      class="w-16 bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-2 py-1 text-body-sm font-bold text-center text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all placeholder-on-surface-variant/40"
                      placeholder="-"
                    />
                  </td>
                  <td class="py-2 px-4 text-center">
                    <input
                      v-model.number="st.editGiuaKy.score"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      class="w-16 bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-2 py-1 text-body-sm font-bold text-center text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all placeholder-on-surface-variant/40"
                      placeholder="-"
                    />
                  </td>
                  <td class="py-2 px-4 text-center">
                    <input
                      v-model.number="st.editCuoiKy.score"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      class="w-16 bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-2 py-1 text-body-sm font-bold text-center text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all placeholder-on-surface-variant/40"
                      placeholder="-"
                    />
                  </td>
                  <td class="py-2 px-4 text-center">
                    <span
                      v-if="st.averageScore !== null"
                      :class="[
                        st.averageScore >= 8.0 ? 'text-emerald-500 font-bold' :
                        st.averageScore >= 5.0 ? 'text-primary-container font-bold' :
                        'text-rose-500 font-bold',
                        'px-2 py-0.5 rounded bg-white/40 border border-white/60 text-[12px]'
                      ]"
                    >
                      {{ st.averageScore }}
                    </span>
                    <span v-else class="text-on-surface-variant">-</span>
                  </td>
                  <td class="py-2 px-6 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        @click="saveStudentGradesInline(st)"
                        :disabled="st.saving"
                        class="p-1.5 rounded-lg bg-transparent hover:bg-black/5 text-black transition-colors inline-flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50"
                        title="Lưu điểm"
                      >
                        <span v-if="st.saving" class="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></span>
                        <span v-else class="material-symbols-outlined text-[20px]">save</span>
                      </button>
                      <button
                        @click="openGradingDialog(st)"
                        class="p-1.5 rounded-lg bg-transparent hover:bg-black/5 text-black transition-colors inline-flex items-center justify-center cursor-pointer active:scale-95"
                        title="Ghi chú chi tiết"
                      >
                        <span class="material-symbols-outlined text-[20px]">edit_note</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="p-12 text-center flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-outline/30 text-[48px] mb-2">search</span>
              <p class="text-body-sm text-on-surface-variant font-medium">Không tìm thấy học viên nào phù hợp với từ khóa</p>
            </div>
          </div>

          <div v-else class="p-12 text-center flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-outline/30 text-[64px] mb-3">school</span>
            <p class="text-body-lg font-body-lg text-on-surface-variant">Không tìm thấy dữ liệu học tập nào</p>
          </div>
        </div>
      </div>

      <!-- TAB 4: BÀI HỌC & ĐỀ THI -->
      <div v-if="activeTab === 'lessons_exams'" class="space-y-gutter animate-fade-in">
        <!-- Sub Tabs for Lessons and Quizzes -->
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-4 shadow-[0_12px_24px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div class="flex gap-2">
            <button
              @click="activeSubTab = 'lessons'"
              :class="['px-4 py-2 rounded-lg font-bold text-body-sm transition-all', activeSubTab === 'lessons' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:bg-black/5']"
            >
              Nội dung bài học
            </button>
            <button
              @click="activeSubTab = 'quizzes'"
              :class="['px-4 py-2 rounded-lg font-bold text-body-sm transition-all', activeSubTab === 'quizzes' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:bg-black/5']"
            >
              Đề thi & Bài kiểm tra
            </button>
          </div>
          <button
            v-if="activeSubTab === 'lessons'"
            @click="openAddLessonModal"
            class="bg-primary-container text-white px-4 py-2 rounded-lg font-semibold text-body-sm hover:bg-primary transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            Thêm bài học
          </button>
          <button
            v-if="activeSubTab === 'quizzes'"
            @click="openAddQuizModal"
            class="bg-primary-container text-white px-4 py-2 rounded-lg font-semibold text-body-sm hover:bg-primary transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            Tạo đề kiểm tra
          </button>
        </div>

        <!-- SUB TAB 1: LESSONS -->
        <div v-if="activeSubTab === 'lessons'" class="space-y-3">
          <div v-if="loadingLessons" class="p-12 text-center bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl">
            <div class="w-8 h-8 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin mx-auto mb-2"></div>
            Đang tải danh sách bài học...
          </div>
          <div v-else-if="lessons.length === 0" class="p-12 text-center bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl">
            <span class="material-symbols-outlined text-outline/30 text-[64px] mb-2">book</span>
            <p class="text-body-lg text-on-surface-variant">Lớp học này chưa có nội dung bài học nào được đăng tải.</p>
          </div>
          <div v-else class="grid grid-cols-1 gap-4">
            <div v-for="lesson in lessons" :key="lesson.lessonId" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between gap-4">
              <div class="space-y-2 flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-body-xs">
                    {{ formatDate(lesson.lessonDate) }}
                  </span>
                </div>
                <h4 class="font-bold text-primary-container text-headline-sm mt-1">{{ lesson.title }}</h4>
                <div v-if="lesson.fileName" class="mt-2">
                  <button
                    @click="downloadLessonFile(lesson)"
                    :disabled="downloadingFileId === lesson.lessonId"
                    class="inline-flex items-center gap-2 px-3 py-2 bg-primary-container/10 hover:bg-primary-container/20 text-primary-container rounded-lg text-body-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span v-if="downloadingFileId === lesson.lessonId" class="w-4 h-4 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin"></span>
                    <span v-else class="material-symbols-outlined text-[20px]">download</span>
                    Tải file: {{ lesson.fileName }}
                  </button>
                </div>
                <p v-else class="text-body-sm text-on-surface-variant whitespace-pre-line">{{ lesson.content }}</p>
              </div>
              <div class="flex items-center gap-2 self-end md:self-center shrink-0">
                <button @click="openEditLessonModal(lesson)" class="p-2 rounded-lg hover:bg-black/5 text-primary-container cursor-pointer" title="Chỉnh sửa">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button @click="deleteLesson(lesson.lessonId)" class="p-2 rounded-lg hover:bg-black/5 text-rose-600 cursor-pointer" title="Xóa">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SUB TAB 2: QUIZZES -->
        <div v-if="activeSubTab === 'quizzes'" class="space-y-3">
          <div v-if="loadingQuizzes" class="p-12 text-center bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl">
            <div class="w-8 h-8 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin mx-auto mb-2"></div>
            Đang tải danh sách bài kiểm tra...
          </div>
          <div v-else-if="quizzes.length === 0" class="p-12 text-center bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl">
            <span class="material-symbols-outlined text-outline/30 text-[64px] mb-2">assignment</span>
            <p class="text-body-lg text-on-surface-variant">Lớp học này chưa có đề kiểm tra nào.</p>
          </div>
          <div v-else class="grid grid-cols-1 gap-4">
            <div v-for="quiz in quizzes" :key="quiz.quizId" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between gap-4">
              <div class="space-y-2 flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span :class="['px-2.5 py-0.5 rounded font-bold text-body-xs', quiz.quizType === 'TracNghiem' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800']">
                    {{ quiz.quizType === 'TracNghiem' ? 'Trắc nghiệm' : 'Tự luận' }}
                  </span>
                  <span class="text-body-xs font-semibold text-on-surface-variant bg-slate-100 px-2 py-0.5 rounded" v-if="quiz.lessonDate">
                    Ngày áp dụng: {{ formatDate(quiz.lessonDate) }}
                  </span>
                  <span class="text-body-xs font-semibold text-on-surface-variant bg-slate-100 px-2 py-0.5 rounded">
                    Thời lượng: {{ quiz.durationMinutes }} phút
                  </span>
                </div>
                <h4 class="font-bold text-primary-container text-headline-sm mt-1">{{ quiz.title }}</h4>
              </div>
              <div class="flex items-center gap-2 self-end md:self-center shrink-0">
                <button @click="openSubmissionsModal(quiz)" class="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-body-sm flex items-center gap-1 cursor-pointer" title="Xem bài làm của học viên">
                  <span class="material-symbols-outlined text-[18px]">visibility</span>
                  Bài làm
                </button>
                <button @click="deleteQuiz(quiz.quizId)" class="p-2 rounded-lg hover:bg-black/5 text-rose-600 cursor-pointer" title="Xóa đề kiểm tra">
                  <span class="material-symbols-outlined">delete</span>
                </button>
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
              <input v-model="lessonForm.lessonDate" type="date" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm" />
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
                <span class="material-symbols-outlined text-[36px] text-primary-container/60 group-hover:text-primary-container group-hover:scale-110 transition-all duration-300">
                  cloud_upload
                </span>
                <p class="mt-2 text-body-sm font-semibold text-primary">
                  {{ lessonForm.fileName ? 'Thay đổi file tài liệu' : 'Kéo thả hoặc Click để tải file' }}
                </p>
                <p class="text-body-xs text-on-surface-variant mt-1">Hỗ trợ PDF, Word, Excel, Slide, Image, v.v. (tối đa 10MB)</p>
              </div>
              <div v-if="lessonForm.fileName" class="mt-3 p-3 bg-primary-container/5 rounded-lg flex items-center justify-between border border-primary-container/10">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="material-symbols-outlined text-primary-container shrink-0">description</span>
                  <span class="text-body-sm font-medium text-slate-800 truncate" :title="lessonForm.fileName">
                    {{ lessonForm.fileName }}
                  </span>
                </div>
                <button @click="clearSelectedFile" type="button" class="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-full transition-colors cursor-pointer shrink-0 z-20">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button :disabled="submittingLesson" @click="lessonModal = false" class="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-body-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Hủy</button>
            <button :disabled="submittingLesson" @click="saveLesson" class="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white font-semibold text-body-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="submittingLesson" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ submittingLesson ? 'Đang lưu...' : 'Lưu bài học' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: TẠO ĐỀ KIỂM TRA -->
    <teleport to="body">
      <div v-if="quizModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8 animate-scale-in flex flex-col max-h-[85vh]">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container">Tạo đề kiểm tra mới</h3>
            <button @click="quizModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="space-y-4 overflow-y-auto flex-1 pr-2 text-[14px]">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tiêu đề bài kiểm tra</label>
                <input v-model="quizForm.title" type="text" placeholder="Ví dụ: Kiểm tra 15 phút - Bài 1" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Thời gian làm bài (phút)</label>
                <input v-model.number="quizForm.durationMinutes" type="number" min="1" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm" />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Loại đề thi</label>
                <select v-model="quizForm.quizType" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none">
                  <option value="TracNghiem">Trắc nghiệm</option>
                  <option value="TuLuan">Tự luận</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Ngày áp dụng (tùy chọn)</label>
                <input v-model="quizForm.lessonDate" type="date" class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm" />
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
                    <select v-model.number="aiQuestionCount" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-body-sm focus:outline-none focus:border-purple-500">
                      <option :value="5">5 câu hỏi</option>
                      <option :value="10">10 câu hỏi</option>
                      <option :value="15">15 câu hỏi</option>
                      <option :value="20">20 câu hỏi</option>
                    </select>
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
            <div class="border-t border-dashed border-slate-200 pt-3 space-y-4">
              <div class="flex justify-between items-center">
                <span class="font-bold text-primary-container text-body-md">Danh sách câu hỏi ({{ quizForm.questions.length }})</span>
                <button @click="addQuestion" class="text-indigo-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer text-body-xs">
                  <span class="material-symbols-outlined text-[16px]">add_circle</span>
                  Thêm câu hỏi
                </button>
              </div>
              
              <div v-for="(q, idx) in quizForm.questions" :key="idx" class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                <button @click="removeQuestion(idx)" class="absolute right-3 top-3 text-rose-500 hover:bg-rose-50 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer" title="Xóa câu hỏi">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
                
                <div class="font-bold text-slate-600 text-body-sm">Câu hỏi {{ idx + 1 }}</div>
                <div>
                  <label class="block font-medium text-slate-600 mb-1">Nội dung câu hỏi</label>
                  <input v-model="q.questionText" type="text" placeholder="Nhập câu hỏi..." class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm" />
                </div>
                
                <!-- Options for multiple choice -->
                <div v-if="quizForm.quizType === 'TracNghiem'" class="space-y-2">
                  <label class="block font-medium text-slate-600">Các phương án trả lời (Nhập mỗi phương án trên 1 dòng)</label>
                  <textarea v-model="q.options" rows="4" placeholder="Ví dụ:&#13;A. Lựa chọn thứ nhất&#13;B. Lựa chọn thứ hai&#13;C. Lựa chọn thứ ba&#13;D. Lựa chọn thứ tư" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm"></textarea>
                  
                  <div class="w-1/2">
                    <label class="block font-medium text-slate-600 mb-1">Đáp án đúng</label>
                    <select v-model="q.correctAnswer" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none">
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>

                <!-- Answer for essay -->
                <div v-if="quizForm.quizType === 'TuLuan'">
                  <label class="block font-medium text-slate-600 mb-1">Đáp án gợi ý / Hướng dẫn chấm bài</label>
                  <textarea v-model="q.correctAnswer" rows="3" placeholder="Ghi chú hướng dẫn..." class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm"></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 shrink-0">
            <button @click="quizModal = false" class="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-body-sm cursor-pointer">Hủy</button>
            <button @click="saveQuiz" class="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white font-semibold text-body-sm cursor-pointer">Lưu đề thi</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: DANH SÁCH BÀI LÀM CỦA HỌC VIÊN -->
    <teleport to="body">
      <div v-if="submissionsModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-scale-in flex flex-col max-h-[80vh]">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container">
              Bài làm của học viên - {{ activeQuiz?.title }}
            </h3>
            <button @click="submissionsModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="overflow-y-auto flex-1 text-[14px]">
            <div v-if="loadingSubmissions" class="p-12 text-center">
              <div class="w-8 h-8 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin mx-auto mb-2"></div>
              Đang tải danh sách bài làm...
            </div>
            <div v-else-if="submissions.length === 0" class="p-12 text-center text-slate-500 italic">
              Chưa có học viên nào nộp bài.
            </div>
            <table v-else class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[13px]">
                  <th class="py-3 px-4">Tên học viên</th>
                  <th class="py-3 px-4">Ngày nộp</th>
                  <th class="py-3 px-4 text-center">Điểm số</th>
                  <th class="py-3 px-4 text-center">Trạng thái</th>
                  <th class="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sub in submissions" :key="sub.submissionId" class="border-b border-slate-100 hover:bg-slate-50">
                  <td class="py-3 px-4 font-semibold text-primary-container">{{ sub.studentName }}</td>
                  <td class="py-3 px-4 text-slate-500">{{ formatDateTime(sub.submittedAt) }}</td>
                  <td class="py-3 px-4 text-center font-bold">
                    {{ sub.score !== null ? sub.score.toFixed(1) : '—' }}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span :class="['px-2 py-0.5 rounded text-[11px] font-bold', sub.isGraded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800']">
                      {{ sub.isGraded ? 'Đã chấm' : 'Chờ chấm' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button @click="openGradingModal(sub)" class="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer text-body-xs">
                      {{ sub.isGraded ? 'Sửa điểm' : 'Chấm điểm' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end pt-3 border-t border-slate-200 shrink-0">
            <button @click="submissionsModal = false" class="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white font-semibold text-body-sm cursor-pointer">Đóng</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG: CHẤM ĐIỂM CHI TIẾT -->
    <teleport to="body">
      <div v-if="gradingSubmissionModal" class="fixed inset-0 glass-backdrop z-[10000] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-in flex flex-col max-h-[85vh]">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
            <h3 class="font-title-md text-[17px] font-bold text-primary-container">
              Chấm điểm bài làm - {{ activeSubmission?.studentName }}
            </h3>
            <button @click="gradingSubmissionModal = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="space-y-4 overflow-y-auto flex-1 text-[14px] pr-1">
            <div class="font-bold text-slate-700">Câu trả lời của học viên:</div>
            
            <div v-for="(question, index) in activeQuiz?.questions" :key="question.questionId" class="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div class="font-bold text-slate-700">Câu {{ index + 1 }}: {{ question.questionText }}</div>
              <div v-if="question.options" class="text-body-sm text-slate-500 whitespace-pre-wrap ml-2">
                {{ question.options.replace(/\|/g, '\n') }}
              </div>
              <div class="text-body-sm font-semibold text-indigo-700 ml-2 mt-1">
                Học viên chọn/trả lời: 
                <span class="text-slate-800 font-bold bg-white px-2 py-0.5 border border-slate-200 rounded">
                  {{ activeSubmission?.answers[question.questionId.toString()] || activeSubmission?.answers[String(question.questionId)] || 'Chưa trả lời' }}
                </span>
              </div>
              <div class="text-body-xs text-emerald-600 font-semibold ml-2" v-if="question.correctAnswer">
                Đáp án đúng/Gợi ý: <span class="font-bold">{{ question.correctAnswer }}</span>
              </div>
            </div>

            <!-- Grade inputs -->
            <div class="border-t border-slate-200 pt-3 space-y-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Điểm số (thang điểm 10)</label>
                <input v-model.number="gradeForm.score" type="number" min="0" max="10" step="0.1" placeholder="Nhập điểm..." class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm font-bold" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Nhận xét của giáo viên</label>
                <textarea v-model="gradeForm.teacherNote" rows="3" placeholder="Nhập nhận xét..." class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-body-sm"></textarea>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 shrink-0">
            <button @click="gradingSubmissionModal = false" class="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-body-sm cursor-pointer">Hủy</button>
            <button @click="submitGrade" class="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white font-semibold text-body-sm cursor-pointer">Lưu kết quả</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG 1: XẾP HỌC VIÊN VÀO LỚP -->
    <teleport to="body">
      <div v-if="enrollModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-2xl max-w-lg w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">person_add</span>
              Xếp học viên vào lớp
            </h3>
            <button @click="enrollModal = false" class="text-on-surface-variant hover:text-on-surface transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <!-- Search input -->
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                v-model="studentSearch"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-10 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
                placeholder="Tìm kiếm học viên theo tên..."
                type="text"
              />
              <button
                v-if="studentSearch"
                @click="studentSearch = ''"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
              >
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <!-- Select Student List box -->
            <div class="border border-white/40 rounded-xl overflow-hidden max-h-60 overflow-y-auto bg-primary-container/[0.05]">
              <div v-if="loadingStudents" class="p-4 text-center text-body-sm font-body-sm text-on-surface-variant">
                Đang tải danh sách học viên...
              </div>
              <div v-else-if="unassignedStudents.length > 0">
                <div
                  v-for="st in unassignedStudents"
                  :key="st.studentId"
                  @click="selectedStudentForEnroll = st"
                  :class="[
                    'p-3 cursor-pointer border-b border-white/10 transition-colors flex justify-between items-center',
                    selectedStudentForEnroll?.studentId === st.studentId
                      ? 'bg-on-tertiary-container/15 border-l-4 border-l-on-tertiary-container'
                      : 'hover:bg-white/10'
                  ]"
                >
                  <div>
                    <div class="font-semibold text-on-surface text-body-sm font-body-sm">{{ st.fullName }}</div>
                    <div class="text-[11px] text-on-surface-variant">SĐT: {{ st.phone || '-' }} | Email: {{ st.email || '-' }}</div>
                  </div>
                  <span
                    class="material-symbols-outlined text-on-tertiary-container"
                    v-if="selectedStudentForEnroll?.studentId === st.studentId"
                  >
                    check_circle
                  </span>
                </div>
              </div>
              <div v-else class="p-6 text-center text-body-sm font-body-sm text-on-surface-variant">
                Không tìm thấy học viên mới nào để xếp lớp
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="enrollModal = false"
              class="px-5 py-2.5 rounded-lg bg-transparent border border-outline-variant text-on-surface-variant font-semibold text-body-sm hover:bg-surface-container-high transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              @click="submitEnrollment"
              :disabled="!selectedStudentForEnroll || enrolling"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span v-if="enrolling" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Xếp vào lớp
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- DIALOG 2: NHẬP ĐIỂM SỐ -->
    <teleport to="body">
      <div v-if="gradingModal" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-2xl max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">edit_note</span>
              Nhập/Sửa điểm: {{ selectedStudentForGrading?.studentName }}
            </h3>
            <button @click="gradingModal = false" class="text-on-surface-variant hover:text-on-surface transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <!-- Score input box for each exam type -->
            <div v-for="type in ['KiemTra', 'GiuaKy', 'CuoiKy']" :key="type" class="space-y-1 bg-primary-container/[0.05] p-3.5 rounded-xl border border-primary-container/10">
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-body-sm font-body-sm font-semibold text-on-surface">{{ getExamTypeLabel(type) }} *</label>
                <span class="text-[11px] text-on-surface-variant" v-if="gradingForm[type].resultId">
                  Đã có điểm (ID: {{ gradingForm[type].resultId }})
                </span>
              </div>
              
              <div class="flex gap-3 items-center">
                <input
                  v-model.number="gradingForm[type].score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  class="w-24 bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm font-body-sm text-on-surface text-center font-bold"
                  placeholder="Điểm"
                />
                <input
                  v-model="gradingForm[type].note"
                  type="text"
                  class="flex-1 bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm font-body-sm text-on-surface"
                  placeholder="Ghi chú (VD: Điểm kiểm tra đợt 1)"
                />
              </div>
            </div>
            <p class="text-[11px] text-on-surface-variant/80 italic">Chú ý: Điểm số bắt buộc từ 0 đến 10. Điểm để trống hoặc không nhập sẽ không ghi nhận.</p>
          </div>

          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="gradingModal = false"
              class="px-5 py-2.5 rounded-lg bg-transparent border border-outline-variant text-on-surface-variant font-semibold text-body-sm hover:bg-surface-container-high transition-colors"
            >
              Hủy
            </button>
            <button
              @click="submitGrades"
              :disabled="savingGrades"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span v-if="savingGrades" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Lưu điểm số
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Dialog: Admin chuyển lớp học cho học viên -->
    <teleport to="body">
      <div v-if="transferDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-2xl max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">sync_alt</span>
              Chuyển lớp cho học viên
            </h3>
            <button @click="transferDialog = false" class="text-on-surface-variant hover:text-on-surface transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="bg-primary-container/5 p-4 rounded-xl border border-primary-container/10 text-body-sm space-y-1">
              <div>Học viên: <span class="font-bold text-primary-container">{{ transferEnrollmentTarget?.studentName }}</span></div>
              <div>Môn học: <span class="font-semibold text-primary-container">{{ currentClass?.courseName }}</span></div>
              <div>Lớp hiện tại: <strong class="text-primary-container">{{ currentClass?.className }}</strong></div>
            </div>

            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Chọn lớp học thay thế *</label>
              <div v-if="loadingAlternativeClasses" class="flex items-center justify-center py-4 gap-2">
                <span class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></span>
                <span class="text-body-xs text-on-surface-variant">Đang tìm lớp học...</span>
              </div>
              <div v-else-if="alternativeClasses.length === 0" class="text-error text-body-sm font-semibold py-2">
                Không tìm thấy lớp học khác nào hoạt động cho khóa này.
              </div>
              <div v-else class="relative">
                <select
                  v-model="selectedAlternativeClassId"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-on-surface bg-transparent cursor-pointer focus:outline-none"
                >
                  <option :value="null" disabled>-- Chọn lớp học mới --</option>
                  <option v-for="c in alternativeClasses" :key="c.classId" :value="c.classId">
                    {{ c.className }} (Sĩ số: {{ c.currentStudents }}/{{ c.maxStudents }} - Phòng: {{ c.room || 'N/A' }})
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <!-- Schedule info of the selected target class to check for conflicts -->
            <div v-if="selectedAlternativeClassSchedules.length > 0" class="bg-on-tertiary-container/5 p-4 rounded-xl border border-on-tertiary-container/10">
              <div class="text-[11px] font-bold text-on-tertiary-container uppercase tracking-wide mb-1.5">Lịch học lớp mới:</div>
              <div class="space-y-1 text-body-xs font-semibold text-primary-container">
                <div v-for="s in selectedAlternativeClassSchedules" :key="s.scheduleId">
                  • Thứ {{ formatDayOfWeek(s.dayOfWeek) }} ({{ s.startTime.substring(0,5) }} - {{ s.endTime.substring(0,5) }})
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="transferDialog = false"
              class="px-5 py-2.5 rounded-lg bg-transparent border border-outline-variant text-on-surface-variant font-semibold text-body-sm hover:bg-surface-container-high transition-colors"
            >
              Hủy
            </button>
            <button
              @click="submitTransfer"
              :disabled="submittingTransfer || !selectedAlternativeClassId"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="submittingTransfer" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận chuyển
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClassStore, useStudentStore, useAuthStore } from '../../stores'
import api from '../../services/api'

function matchSearch(studentName, studentId, phone, searchVal) {
  const query = searchVal.trim().toLowerCase()
  if (!query) return true
  
  const idStr = `hv-${String(studentId).padStart(4, '0')}`
  const idStrNoDash = `hv${String(studentId).padStart(4, '0')}`
  const idShort = String(studentId)
  const idZeroPadded = String(studentId).padStart(4, '0')
  
  const nameMatch = studentName?.toLowerCase().includes(query)
  const idMatch = idStr.includes(query) ||
                  idStrNoDash.includes(query) ||
                  idStrNoDash.includes(query.replace('-', '')) ||
                  idShort.includes(query) ||
                  idZeroPadded.includes(query)
  const phoneMatch = phone?.toLowerCase().includes(query)
  
  return nameMatch || idMatch || phoneMatch
}

const router = useRouter()
const authStore = useAuthStore()

const route = useRoute()
const classId = Number(route.params.id)
const classStore = useClassStore()
const studentStore = useStudentStore()
const showSnackbar = inject('showSnackbar')

const teachers = ref([])
const currentClassTeacherId = ref(null)

async function fetchTeachers() {
  try {
    const { data } = await api.get('/api/v1/users/teachers')
    teachers.value = data || []
  } catch (error) {
    console.error('Error fetching teachers:', error)
  }
}

async function assignTeacherFromDetail() {
  try {
    const selected = teachers.value.find(t => t.userId === currentClassTeacherId.value)
    const teacherName = selected ? selected.fullName : ''
    
    await classStore.updateClass(classId, {
      ...currentClass.value,
      teacherId: currentClassTeacherId.value,
      teacherName: teacherName
    })
    showSnackbar('Cập nhật giáo viên phụ trách thành công', 'success')
    await fetchClassDetails()
  } catch (e) {
    showSnackbar('Lỗi cập nhật giáo viên', 'error')
  }
}

watch(() => classStore.currentClass, (newClass) => {
  if (newClass) {
    currentClassTeacherId.value = newClass.teacherId || null
  }
}, { immediate: true })

// Tabs definition
const activeTab = ref('roster')
const tabs = [
  { label: 'Học viên lớp học', value: 'roster', icon: 'group' },
  { label: 'Điểm danh hàng loạt', value: 'attendance', icon: 'fact_check' },
  { label: 'Bảng điểm lớp học', value: 'grades', icon: 'assignment' }
]

// Fetch class details
const loadingClass = ref(false)
const currentClass = computed(() => classStore.currentClass)

async function fetchClassDetails() {
  loadingClass.value = true
  try {
    const cls = await classStore.getClass(classId)
    // Check if the user is a Teacher and they are not assigned to this class
    if (authStore.currentUser?.role === 'GiaoVien' && cls.teacherId !== authStore.currentUser.userId) {
      showSnackbar('Bạn không có quyền truy cập thông tin lớp học này', 'error')
      router.push('/classes')
    }
  } catch (e) {
    showSnackbar('Không thể tải thông tin chi tiết lớp học', 'error')
  } finally {
    loadingClass.value = false
  }
}

// ----------------------------------------------------
// TAB 1: ROSTER (DANH SÁCH HỌC VIÊN)
// ----------------------------------------------------
const loadingRoster = ref(false)
const roster = ref([])
const rosterSearch = ref('')
const activeRosterDropdownId = ref(null)

const filteredRoster = computed(() => {
  return roster.value.filter(en => matchSearch(en.studentName, en.studentId, en.phone, rosterSearch.value))
})

async function fetchRoster() {
  loadingRoster.value = true
  try {
    const { data } = await api.get('/api/v1/enrollments', {
      params: { classId, page: 1, pageSize: 100 }
    })
    roster.value = data.items || []
  } catch (e) {
    showSnackbar('Lỗi tải danh sách học viên lớp học', 'error')
  } finally {
    loadingRoster.value = false
  }
}

function toggleRosterDropdown(id) {
  activeRosterDropdownId.value = activeRosterDropdownId.value === id ? null : id
}

async function changeEnrollmentStatus(enrollmentId, status) {
  activeRosterDropdownId.value = null
  try {
    await api.put(`/api/v1/enrollments/${enrollmentId}/status`, {
      id: enrollmentId,
      status: status
    })
    showSnackbar('Cập nhật trạng thái đăng ký thành công', 'success')
    fetchRoster()
    fetchClassDetails() // Update fills count
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Lỗi cập nhật trạng thái', 'error')
  }
}

async function deleteEnrollmentConfirm(en) {
  if (confirm(`Bạn có chắc chắn muốn xóa học viên ${en.studentName} khỏi lớp học này?`)) {
    try {
      await api.delete(`/api/v1/enrollments/${en.enrollmentId}`)
      showSnackbar(`Xóa học viên ${en.studentName} khỏi lớp thành công`, 'success')
      await fetchRoster()
      await fetchClassDetails()
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Lỗi khi xóa học viên khỏi lớp', 'error')
    }
  }
}

const enrollmentStatusOptions = [
  { label: 'Đang học', value: 'Active' },
  { label: 'Hoàn thành', value: 'Completed' },
  { label: 'Đã hủy', value: 'Cancelled' },
  { label: 'Chờ duyệt', value: 'Pending' }
]

// Enrollment Modal Actions
const enrollModal = ref(false)
const loadingStudents = ref(false)
const studentSearch = ref('')
const selectedStudentForEnroll = ref(null)
const enrolling = ref(false)

const unassignedStudents = computed(() => {
  // Filter out students already in class roster and apply search filter
  const enrolledStudentIds = roster.value.map(r => r.studentId)
  let list = studentStore.students.filter(s => !enrolledStudentIds.includes(s.studentId))
  
  if (studentSearch.value.trim()) {
    list = list.filter(s => matchSearch(s.fullName, s.studentId, s.phone, studentSearch.value))
  }
  return list
})

async function openEnrollModal() {
  selectedStudentForEnroll.value = null
  studentSearch.value = ''
  enrollModal.value = true
  loadingStudents.value = true
  try {
    await studentStore.fetchStudents({ page: 1, pageSize: 150 })
  } catch (e) {
    showSnackbar('Lỗi tải danh sách học viên hệ thống', 'error')
  } finally {
    loadingStudents.value = false
  }
}

async function submitEnrollment() {
  if (!selectedStudentForEnroll.value) return
  enrolling.value = true
  try {
    await api.post('/api/v1/enrollments', {
      studentId: selectedStudentForEnroll.value.studentId,
      classId: classId
    })
    showSnackbar('Xếp học viên vào lớp thành công', 'success')
    enrollModal.value = false
    fetchRoster()
    fetchClassDetails()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Không thể xếp lớp cho học viên này', 'error')
  } finally {
    enrolling.value = false
  }
}

// ----------------------------------------------------
// TAB 2: ATTENDANCE (ĐIỂM DANH)
// ----------------------------------------------------
const attendanceDate = ref(new Date().toLocaleDateString('en-CA')) // Local YYYY-MM-DD
const loadingAttendance = ref(false)
const savingAttendance = ref(false)
const attendanceList = ref([])
const attendanceRecordExists = ref(false)
const attendanceLoaded = ref(false)
const attendanceSearch = ref('')
const filteredAttendance = computed(() => {
  return attendanceList.value.filter(att => matchSearch(att.studentName, att.studentId, att.phone, attendanceSearch.value))
})

const attendanceStatusOptions = [
  { label: 'Có mặt', value: 'CoMat', activeClass: 'bg-emerald-500 text-white' },
  { label: 'Vắng mặt', value: 'Vang', activeClass: 'bg-rose-500 text-white' },
  { label: 'Có phép', value: 'CoPhep', activeClass: 'bg-amber-500 text-white' },
  { label: 'Đi muộn', value: 'DiTre', activeClass: 'bg-sky-500 text-white' }
]

async function fetchAttendanceForDate() {
  if (!attendanceDate.value) return
  loadingAttendance.value = true
  attendanceLoaded.value = false
  try {
    // 1. Get existing records for date
    const { data: existingRecords } = await api.get(`/api/v1/attendances/class/${classId}/date/${attendanceDate.value}`)
    
    // Map roster students
    if (existingRecords && existingRecords.length > 0) {
      attendanceRecordExists.value = true
      const activeRoster = roster.value.filter(r => r.status === 'DangHoc')
      // Map roster to include attendance details
      attendanceList.value = activeRoster.map(r => {
        const found = existingRecords.find(x => x.enrollmentId === r.enrollmentId)
        return {
          enrollmentId: r.enrollmentId,
          studentId: r.studentId,
          studentName: r.studentName,
          phone: r.phone,
          status: found ? found.status : 'CoMat',
          note: found ? found.note : '',
          attendanceId: found ? found.attendanceId : null
        }
      })
    } else {
      attendanceRecordExists.value = false
      const activeRoster = roster.value.filter(r => r.status === 'DangHoc')
      // Default to "CoMat" for all roster students
      attendanceList.value = activeRoster.map(r => ({
        enrollmentId: r.enrollmentId,
        studentId: r.studentId,
        studentName: r.studentName,
        phone: r.phone,
        status: 'CoMat',
        note: '',
        attendanceId: null
      }))
    }
    attendanceLoaded.value = true
  } catch (e) {
    showSnackbar('Lỗi tải dữ liệu điểm danh', 'error')
  } finally {
    loadingAttendance.value = false
  }
}

function setAllAttendanceStatus(status) {
  attendanceList.value.forEach(x => {
    x.status = status
  })
}

async function saveAttendance() {
  savingAttendance.value = true
  try {
    const listToSave = attendanceList.value.map(x => ({
      enrollmentId: x.enrollmentId,
      status: x.status,
      note: x.note || null
    }))
    
    // API: Batch attendance
    await api.post('/api/v1/attendances', {
      classId: classId,
      sessionDate: attendanceDate.value,
      attendances: listToSave
    })
    
    showSnackbar('Lưu bảng điểm danh thành công', 'success')
    fetchAttendanceForDate()
  } catch (e) {
    showSnackbar('Lỗi khi lưu bảng điểm danh', 'error')
  } finally {
    savingAttendance.value = false
  }
}

// ----------------------------------------------------
// TAB 3: GRADES (ĐIỂM SỐ HỌC TẬP)
// ----------------------------------------------------
const loadingGrades = ref(false)
const gradesList = ref([])
const gradesSearch = ref('')
const filteredGrades = computed(() => {
  return gradesList.value.filter(st => matchSearch(st.studentName, st.studentId, st.phone, gradesSearch.value))
})
const gradingModal = ref(false)
const selectedStudentForGrading = ref(null)
const savingGrades = ref(false)

const gradingForm = ref({
  KiemTra: { resultId: null, score: '', note: '' },
  GiuaKy: { resultId: null, score: '', note: '' },
  CuoiKy: { resultId: null, score: '', note: '' }
})

async function fetchGrades() {
  loadingGrades.value = true
  try {
    const { data } = await api.get(`/api/v1/results/class/${classId}/summary`)
    const students = data.students || []
    gradesList.value = students.map(st => {
      const kiemTraRes = st.results?.find(x => x.examType === 'KiemTra')
      const giuaKyRes = st.results?.find(x => x.examType === 'GiuaKy')
      const cuoiKyRes = st.results?.find(x => x.examType === 'CuoiKy')
      return {
        ...st,
        editKiemTra: {
          resultId: kiemTraRes ? kiemTraRes.resultId : null,
          score: kiemTraRes ? (kiemTraRes.score !== null ? kiemTraRes.score : '') : '',
          note: kiemTraRes ? kiemTraRes.note || '' : ''
        },
        editGiuaKy: {
          resultId: giuaKyRes ? giuaKyRes.resultId : null,
          score: giuaKyRes ? (giuaKyRes.score !== null ? giuaKyRes.score : '') : '',
          note: giuaKyRes ? giuaKyRes.note || '' : ''
        },
        editCuoiKy: {
          resultId: cuoiKyRes ? cuoiKyRes.resultId : null,
          score: cuoiKyRes ? (cuoiKyRes.score !== null ? cuoiKyRes.score : '') : '',
          note: cuoiKyRes ? cuoiKyRes.note || '' : ''
        },
        saving: false
      }
    })
  } catch (e) {
    showSnackbar('Lỗi tải bảng điểm số', 'error')
  } finally {
    loadingGrades.value = false
  }
}

async function saveStudentGradesInline(student) {
  if (student.saving) return
  student.saving = true
  try {
    const promises = []
    
    // Find matching enrollment
    const enrollment = roster.value.find(r => r.studentId === student.studentId)
    if (!enrollment) {
      showSnackbar('Không tìm thấy bản ghi đăng ký học viên', 'error')
      student.saving = false
      return
    }
    
    const examTypes = [
      { key: 'editKiemTra', type: 'KiemTra' },
      { key: 'editGiuaKy', type: 'GiuaKy' },
      { key: 'editCuoiKy', type: 'CuoiKy' }
    ]
    
    for (const item of examTypes) {
      const f = student[item.key]
      if (f.score !== '' && f.score !== null) {
        // Validation check
        if (f.score < 0 || f.score > 10) {
          showSnackbar(`Điểm số ${getExamTypeLabel(item.type)} phải từ 0 đến 10`, 'error')
          student.saving = false
          return
        }
        
        if (f.resultId) {
          // Update
          promises.push(api.put(`/api/v1/results/${f.resultId}`, {
            id: f.resultId,
            score: Number(f.score),
            note: f.note || null
          }))
        } else {
          // Create
          promises.push(api.post('/api/v1/results', {
            enrollmentId: enrollment.enrollmentId,
            examType: item.type,
            score: Number(f.score),
            note: f.note || null,
            examDate: new Date().toISOString()
          }))
        }
      }
    }
    
    if (promises.length > 0) {
      await Promise.all(promises)
      showSnackbar(`Lưu điểm cho học viên ${student.studentName} thành công`, 'success')
      await fetchGrades()
    } else {
      showSnackbar('Không có thay đổi điểm số nào để lưu', 'info')
    }
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi lưu điểm', 'error')
  } finally {
    student.saving = false
  }
}

function getScoreVal(results, type) {
  const r = results?.find(x => x.examType === type)
  return r ? r.score : '-'
}

function openGradingDialog(student) {
  selectedStudentForGrading.value = student
  
  // Reset form
  gradingForm.value = {
    KiemTra: { resultId: null, score: '', note: '' },
    GiuaKy: { resultId: null, score: '', note: '' },
    CuoiKy: { resultId: null, score: '', note: '' }
  }
  
  // Prefill with existing scores
  if (student.results && student.results.length > 0) {
    student.results.forEach(r => {
      if (gradingForm.value[r.examType]) {
        gradingForm.value[r.examType] = {
          resultId: r.resultId,
          score: r.score,
          note: r.note || ''
        }
      }
    })
  }
  
  gradingModal.value = true
}

async function submitGrades() {
  savingGrades.value = true
  try {
    // Collect and run requests
    const promises = []
    
    // Find matching enrollment
    const enrollment = roster.value.find(r => r.studentId === selectedStudentForGrading.value.studentId)
    if (!enrollment) {
      showSnackbar('Không tìm thấy bản ghi đăng ký học viên', 'error')
      return
    }
    
    for (const type of ['KiemTra', 'GiuaKy', 'CuoiKy']) {
      const f = gradingForm.value[type]
      if (f.score !== '' && f.score !== null) {
        // Validation check
        if (f.score < 0 || f.score > 10) {
          showSnackbar(`Điểm số ${getExamTypeLabel(type)} phải từ 0 đến 10`, 'error')
          return
        }
        
        if (f.resultId) {
          // Update
          promises.push(api.put(`/api/v1/results/${f.resultId}`, {
            id: f.resultId,
            score: Number(f.score),
            note: f.note || null
          }))
        } else {
          // Create
          promises.push(api.post('/api/v1/results', {
            enrollmentId: enrollment.enrollmentId,
            examType: type,
            score: Number(f.score),
            note: f.note || null,
            examDate: new Date().toISOString()
          }))
        }
      }
    }
    
    if (promises.length === 0) {
      gradingModal.value = false
      return
    }
    
    await Promise.all(promises)
    showSnackbar('Cập nhật điểm số thành công', 'success')
    gradingModal.value = false
    fetchGrades()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi lưu điểm', 'error')
  } finally {
    savingGrades.value = false
  }
}

function getExamTypeLabel(type) {
  const map = { GiuaKy: 'Giữa kỳ', CuoiKy: 'Cuối kỳ', KiemTra: 'Kiểm tra' }
  return map[type] || type
}

// ----------------------------------------------------
// UTILS
// ----------------------------------------------------
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
    Opened: 'status-opened',
    InProgress: 'status-inprogress',
    Completed: 'status-completed',
    Cancelled: 'status-cancelled'
  }
  return map[status] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'
}

function getEnrollmentStatusLabel(status) {
  const map = { 
    Active: 'Đang học', 
    DangHoc: 'Đang học',
    Completed: 'Hoàn thành', 
    HoanThanh: 'Hoàn thành',
    Cancelled: 'Đã hủy', 
    HuyBo: 'Đã hủy',
    Pending: 'Chờ duyệt' 
  }
  return map[status] || status
}

function getEnrollmentStatusBadgeClass(status) {
  const map = {
    Active: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    DangHoc: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    Completed: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    HoanThanh: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    HuyBo: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    Pending: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  }
  return map[status] || 'bg-slate-500/10 text-slate-700 border-slate-500/20'
}

// Admin Transfer Class State & Logic
const transferDialog = ref(false)
const transferEnrollmentTarget = ref(null)
const alternativeClasses = ref([])
const loadingAlternativeClasses = ref(false)
const selectedAlternativeClassId = ref(null)
const selectedAlternativeClassSchedules = ref([])
const submittingTransfer = ref(false)

async function openAdminTransferModal(en) {
  transferEnrollmentTarget.value = en
  selectedAlternativeClassId.value = null
  selectedAlternativeClassSchedules.value = []
  alternativeClasses.value = []
  transferDialog.value = true
  loadingAlternativeClasses.value = true

  try {
    // Fetch classes of the same course
    const res = await api.get('/api/v1/classes', {
      params: { courseId: currentClass.value.courseId, pageSize: 100 }
    })
    alternativeClasses.value = (res.data?.items || []).filter(
      c => c.classId !== currentClass.value.classId && (c.status === 'Opened' || c.status === 'InProgress')
    )
  } catch (e) {
    showSnackbar('Lỗi tải danh sách lớp học thay thế', 'error')
  } finally {
    loadingAlternativeClasses.value = false
  }
}

// Watch selectedAlternativeClassId to load its schedules
watch(selectedAlternativeClassId, async (newClassId) => {
  if (!newClassId) {
    selectedAlternativeClassSchedules.value = []
    return
  }
  try {
    const res = await api.get(`/api/v1/classes/${newClassId}/schedules`)
    selectedAlternativeClassSchedules.value = res.data || []
  } catch (e) {
    console.error('Error fetching schedules:', e)
    selectedAlternativeClassSchedules.value = []
  }
})

async function submitTransfer() {
  if (!selectedAlternativeClassId.value || !transferEnrollmentTarget.value) return
  submittingTransfer.value = true
  try {
    await api.post('/api/v1/enrollments/transfer', {
      studentId: transferEnrollmentTarget.value.studentId,
      fromClassId: classId, // route classId from params
      toClassId: selectedAlternativeClassId.value
    })
    showSnackbar('Chuyển lớp học thành công cho học viên!', 'success')
    transferDialog.value = false
    
    // Reload roster and class details
    await fetchRoster()
    await fetchClassDetails()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Lỗi khi chuyển lớp học', 'error')
  } finally {
    submittingTransfer.value = false
  }
}

function formatDayOfWeek(day) {
  const map = { 1: 'Hai', 2: 'Ba', 3: 'Tư', 4: 'Năm', 5: 'Sáu', 6: 'Bảy', 0: 'Chủ Nhật' }
  return map[day] || day
}

// ==========================================
// TÍNH NĂNG BÀI HỌC & ĐỀ KIỂM TRA
// ==========================================
const lessons = ref([])
const quizzes = ref([])
const loadingLessons = ref(false)
const loadingQuizzes = ref(false)
const activeSubTab = ref('lessons')

const lessonModal = ref(false)
const isEditingLesson = ref(false)
const submittingLesson = ref(false)
const lessonFileInput = ref(null)
const lessonForm = ref({
  lessonId: null,
  title: '',
  content: '',
  fileName: '',
  lessonDate: new Date().toLocaleDateString('en-CA')
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

const gradingSubmissionModal = ref(false)
const activeSubmission = ref(null)
const gradeForm = ref({
  score: '',
  teacherNote: ''
})

async function fetchLessons() {
  loadingLessons.value = true
  try {
    const res = await api.get(`/api/v1/lessons/class/${classId}`)
    lessons.value = res.data || []
  } catch (e) {
    showSnackbar('Lỗi tải danh sách bài học', 'error')
  } finally {
    loadingLessons.value = false
  }
}

async function fetchQuizzes() {
  loadingQuizzes.value = true
  try {
    const res = await api.get(`/api/v1/quizzes/class/${classId}`)
    quizzes.value = res.data || []
  } catch (e) {
    showSnackbar('Lỗi tải danh sách đề thi', 'error')
  } finally {
    loadingQuizzes.value = false
  }
}

function openAddLessonModal() {
  isEditingLesson.value = false
  lessonForm.value = {
    lessonId: null,
    title: '',
    content: '',
    fileName: '',
    lessonDate: new Date().toLocaleDateString('en-CA')
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
    content: lesson.content,
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

  console.log("saveLesson trigger", {
    title: lessonForm.value.title,
    hasContent: !!lessonForm.value.content,
    fileName: lessonForm.value.fileName,
    lessonDate: lessonForm.value.lessonDate
  })

  const titleVal = lessonForm.value.title ? String(lessonForm.value.title).trim() : ''
  if (!titleVal) {
    if (typeof showSnackbar === 'function') {
      showSnackbar('Vui lòng nhập tiêu đề bài học', 'warning')
    } else {
      alert('Vui lòng nhập tiêu đề bài học')
    }
    return
  }
  if (!lessonForm.value.content) {
    if (typeof showSnackbar === 'function') {
      showSnackbar('Vui lòng chọn file tài liệu bài học', 'warning')
    } else {
      alert('Vui lòng chọn file tài liệu bài học')
    }
    return
  }

  submittingLesson.value = true
  try {
    const payload = {
      classId: classId,
      lessonDate: lessonForm.value.lessonDate,
      title: titleVal,
      content: lessonForm.value.content,
      fileName: lessonForm.value.fileName
    }
    console.log("Sending save lesson payload", { ...payload, content: payload.content.substring(0, 100) + '...' })
    
    const res = await api.post('/api/v1/lessons', payload, {
      timeout: 120000 // 2 minutes timeout for file uploads
    })
    console.log("Save lesson response", res.data)
    
    if (typeof showSnackbar === 'function') {
      showSnackbar('Lưu bài học thành công', 'success')
    } else {
      alert('Lưu bài học thành công')
    }
    lessonModal.value = false
    fetchLessons()
  } catch (e) {
    console.error("Save lesson error detail:", e)
    const serverMsg = e.response?.data?.message || e.message || 'Lỗi lưu bài học'
    if (typeof showSnackbar === 'function') {
      showSnackbar(`Lỗi lưu bài học: ${serverMsg}`, 'error')
    } else {
      alert(`Lỗi lưu bài học: ${serverMsg}`)
    }
  } finally {
    submittingLesson.value = false
  }
}

async function deleteLesson(id) {
  if (!confirm('Bạn có chắc muốn xóa bài học này?')) return
  try {
    await api.delete(`/api/v1/lessons/${id}`)
    showSnackbar('Xóa bài học thành công', 'success')
    fetchLessons()
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

function openAddQuizModal() {
  quizForm.value = {
    title: '',
    durationMinutes: 15,
    quizType: 'TracNghiem',
    lessonDate: '',
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
      classId: classId,
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
      classId: classId,
      title: quizForm.value.title,
      durationMinutes: quizForm.value.durationMinutes,
      quizType: quizForm.value.quizType,
      lessonDate: quizForm.value.lessonDate || null,
      questions: formattedQuestions
    })
    showSnackbar('Tạo đề kiểm tra thành công', 'success')
    quizModal.value = false
    fetchQuizzes()
  } catch (e) {
    showSnackbar('Lỗi khi lưu đề thi', 'error')
  }
}

async function deleteQuiz(id) {
  if (!confirm('Bạn có chắc muốn xóa đề thi này?')) return
  try {
    await api.delete(`/api/v1/quizzes/${id}`)
    showSnackbar('Xóa đề thi thành công', 'success')
    fetchQuizzes()
  } catch (e) {
    showSnackbar('Lỗi xóa đề thi', 'error')
  }
}

async function openSubmissionsModal(quiz) {
  activeQuiz.value = quiz
  submissionsModal.value = true
  loadingSubmissions.value = true
  try {
    const res = await api.get(`/api/v1/quizzes/${quiz.quizId}/submissions`)
    submissions.value = res.data || []
  } catch (e) {
    showSnackbar('Lỗi tải danh sách bài nộp', 'error')
  } finally {
    loadingSubmissions.value = false
  }
}

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
    fetchGrades()
  } catch (e) {
    showSnackbar('Lỗi khi chấm điểm', 'error')
  }
}

// Watch active tabs to load respective data
watch(activeTab, (tab) => {
  if (tab === 'roster') {
    fetchRoster()
  } else if (tab === 'attendance') {
    fetchAttendanceForDate()
  } else if (tab === 'grades') {
    fetchGrades()
  } else if (tab === 'lessons_exams') {
    fetchLessons()
    fetchQuizzes()
  }
})

onMounted(async () => {
  await fetchClassDetails()
  await fetchRoster()
  if (authStore.isAdmin) {
    await fetchTeachers()
  }
  if (route.query.tab && ['roster', 'attendance', 'grades'].includes(route.query.tab)) {
    activeTab.value = route.query.tab
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
