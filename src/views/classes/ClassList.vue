<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Header -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-primary-container">Quản lý lớp học</h1>
        <p class="font-body-lg text-on-surface-variant mt-1">Mở lớp, phân công giáo viên và theo dõi tiến độ sĩ số học viên.</p>
      </div>
      <button
        v-if="authStore.isAdmin"
        @click="openCreateDialog"
        class="bg-primary-container text-white px-6 py-3 rounded-lg font-title-md shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
      >
        <span class="material-symbols-outlined text-[20px]">add</span>
        Mở lớp mới
      </button>
    </section>

    <!-- Stats Row -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      <div v-for="stat in stats" :key="stat.label" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div :class="[stat.bgColor, stat.textColor, 'w-12 h-12 rounded-lg flex items-center justify-center shrink-0']">
          <span class="material-symbols-outlined">{{ stat.icon }}</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary-container">{{ stat.value }}</div>
          <div class="text-[12px] text-on-surface-variant font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-4 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative flex-1 w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          v-model="filters.search"
          @input="debouncedFetch"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-4 py-2.5 text-body-sm text-primary placeholder:text-outline-variant focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
          placeholder="Tìm kiếm lớp, giáo viên..."
          type="text"
        />
      </div>
      <div class="relative w-full sm:w-64">
        <select
          v-model="filters.courseId"
          @change="fetchData"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
        >
          <option :value="null">Tất cả môn học</option>
          <option v-for="c in courseStore.courses" :key="c.courseId" :value="c.courseId">{{ c.courseName }}</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
      <div class="relative w-full sm:w-64">
        <select
          v-model="filters.status"
          @change="fetchData"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none pl-4 pr-10 py-2.5 text-body-sm text-primary cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
        >
          <option :value="null">Tất cả trạng thái</option>
          <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.title }}</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </section>

    <!-- Class Cards Grid -->
    <div v-if="classStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      <div v-for="i in 3" :key="i" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-5 space-y-4 animate-pulse">
        <div class="flex justify-between items-center">
          <div class="h-6 bg-surface-container-high rounded w-1/3"></div>
          <div class="h-6 bg-surface-container-high rounded w-1/4"></div>
        </div>
        <div class="h-8 bg-surface-container-high rounded w-3/4"></div>
        <div class="space-y-2">
          <div class="h-4 bg-surface-container-high rounded w-1/2"></div>
          <div class="h-4 bg-surface-container-high rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <div v-else-if="classStore.classes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      <div
        v-for="cls in classStore.classes"
        :key="cls.classId"
        class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-5 flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative cursor-pointer"
        @click="onCardClick(cls)"
      >
        <!-- Card Header -->
        <div class="flex justify-between items-start gap-2 mb-3">
          <span class="px-2.5 py-1 rounded bg-primary-container/5 text-primary-container font-semibold text-[11px] truncate max-w-[180px]" :title="cls.courseName">
            {{ cls.courseName }}
          </span>
          <span :class="['status-badge', getStatusBadgeClass(cls.status)]">
            {{ getStatusLabel(cls.status) }}
          </span>
        </div>

        <!-- Class Title -->
        <h3 class="font-bold text-xl text-primary-container mb-3">{{ cls.className }}</h3>

        <!-- Class Meta Details -->
        <div class="flex flex-col gap-2.5 mb-4 text-body-sm text-on-surface-variant">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">account_circle</span>
            <span>Giáo viên: <strong class="text-primary-container font-semibold">{{ cls.teacherName || 'Chưa phân công' }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">meeting_room</span>
            <span>Phòng: <strong class="text-primary-container font-semibold">{{ cls.room || 'Chưa xếp phòng' }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">group</span>
            <span>Học viên: <strong class="text-primary-container font-semibold">{{ cls.currentStudents }} / {{ cls.maxStudents }}</strong></span>
          </div>
          <div v-if="cls.startDate" class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>Lịch: {{ formatDate(cls.startDate) }} &rarr; {{ formatDate(cls.endDate) }}</span>
          </div>
        </div>

        <!-- Schedules Chips List -->
        <div v-if="cls.schedules && cls.schedules.length > 0" class="mb-4">
          <div class="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wide mb-1">Thời khóa biểu:</div>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="s in cls.schedules" :key="s.scheduleId" class="px-2 py-0.5 rounded bg-on-tertiary-container/10 text-on-tertiary-container text-[11px] font-semibold">
              {{ s.dayOfWeekName }} {{ s.startTime }} - {{ s.endTime }}
            </span>
          </div>
        </div>

        <!-- Under-enrolled warning alert -->
        <div v-if="authStore.isAdmin && isUnderEnrolled(cls)" class="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 rounded-xl text-body-sm flex flex-col gap-2 relative z-10" @click.stop>
          <div class="flex items-start gap-1.5 font-bold">
            <span class="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">warning</span>
            <span>Chưa đủ 5 học viên sau ngày khai giảng!</span>
          </div>
          <button
            @click.stop="openResolveModal(cls)"
            class="self-end px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[12px] shadow-sm hover:shadow transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">cancel_schedule_send</span>
            Hủy lớp &amp; Giải quyết
          </button>
        </div>

        <!-- Progress bar of Capacity -->
        <div class="mb-5 space-y-1">
          <div class="flex justify-between items-center text-[11px] font-bold text-on-surface-variant">
            <span>Tỷ lệ lấp đầy</span>
            <span>{{ Math.round((cls.currentStudents / cls.maxStudents) * 100) }}%</span>
          </div>
          <div class="w-full bg-white/40 h-2 rounded-full overflow-hidden border border-white/60">
            <div
              :style="{ width: `${Math.min((cls.currentStudents / cls.maxStudents) * 100, 100)}%` }"
              :class="[
                cls.currentStudents >= cls.maxStudents ? 'bg-rose-500' : 'bg-emerald-500',
                'h-full rounded-full transition-all duration-500'
              ]"
            ></div>
          </div>
        </div>

        <!-- Footer Actions row -->
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/30 relative gap-1 flex-wrap" @click.stop>
          <div class="flex items-center gap-1.5">
            <button
              @click.stop="$router.push({ path: `/classes/${cls.classId}/students`, query: { tab: 'attendance' } })"
              class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px] transition-all flex items-center gap-1 active:scale-95 cursor-pointer shadow-sm"
              :title="authStore.isAdmin ? 'Xem chuyên cần học viên' : 'Điểm danh học viên'"
            >
              <span class="material-symbols-outlined text-[16px]">fact_check</span>
              {{ authStore.isAdmin ? 'Xem chuyên cần' : 'Điểm danh' }}
            </button>
            <button
              @click.stop="$router.push({ path: `/classes/${cls.classId}/students`, query: { tab: 'grades' } })"
              class="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[13px] transition-all flex items-center gap-1 active:scale-95 cursor-pointer shadow-sm"
              :title="authStore.isAdmin ? 'Xem điểm số thi' : 'Nhập điểm thi'"
            >
              <span class="material-symbols-outlined text-[16px]">edit_note</span>
              {{ authStore.isAdmin ? 'Xem điểm số' : 'Nhập điểm' }}
            </button>
            <button
              @click.stop="$router.push(`/classes/${cls.classId}/schedules`)"
              class="px-2.5 py-1.5 rounded-lg bg-primary-container/10 hover:bg-primary-container/20 text-primary font-semibold text-[13px] transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              title="Thời khóa biểu"
            >
              <span class="material-symbols-outlined text-[16px]">calendar_today</span>
              Lịch học
            </button>
          </div>
          
          <div class="flex items-center gap-1" v-if="authStore.isAdmin">
            <button
              @click.stop="openEditDialog(cls)"
              class="w-8.5 h-8.5 rounded-lg text-on-tertiary-container hover:bg-on-tertiary-container/10 flex items-center justify-center transition-colors cursor-pointer"
              title="Sửa lớp học"
            >
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>

            <!-- Custom Dropdown Button -->
            <div class="relative">
              <button
                @click.stop="toggleDropdown(cls.classId)"
                class="w-8.5 h-8.5 rounded-lg text-on-surface-variant hover:bg-primary-container/[0.05] flex items-center justify-center transition-colors cursor-pointer"
                title="Thay đổi trạng thái / Xóa"
              >
                <span class="material-symbols-outlined text-[18px]">more_vert</span>
              </button>

              <!-- Dropdown Items Menu -->
              <div v-if="activeDropdownId === cls.classId" class="absolute right-0 bottom-10 w-44 rounded-xl bg-white/90 backdrop-blur-[24px] border border-white/50 shadow-[0_20px_40px_rgba(0,31,63,0.12)] py-2 z-30 animate-scale-in">
                <div class="px-3 py-1 text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wide border-b border-white/40 mb-1">
                  Đổi trạng thái
                </div>
                <button
                  v-for="statusOpt in statusOptions"
                  :key="statusOpt.value"
                  @click.stop="changeStatus(cls.classId, statusOpt.value)"
                  class="w-full text-left px-4 py-2 text-body-sm text-primary-container hover:bg-on-tertiary-container/10 transition-colors font-medium cursor-pointer"
                >
                  {{ statusOpt.title }}
                </button>
                <div class="border-t border-white/40 my-1.5"></div>
                <button
                  @click.stop="openAssignTeacherDialog(cls)"
                  class="w-full text-left px-4 py-2 text-body-sm text-primary-container hover:bg-on-tertiary-container/10 transition-colors font-medium cursor-pointer flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-[16px]">assignment_ind</span>
                  Phân công GV
                </button>
                <div class="border-t border-white/40 my-1.5"></div>
                <button
                  @click.stop="confirmDelete(cls)"
                  class="w-full text-left px-4 py-2 text-body-sm text-error hover:bg-error/10 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[16px]">delete</span>
                  Xóa lớp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-12 text-center flex flex-col items-center justify-center">
      <span class="material-symbols-outlined text-primary-container/30 text-[64px] mb-4">groups</span>
      <p class="text-body-1 text-on-surface-variant font-medium">Chưa có lớp học nào</p>
      <button @click="openCreateDialog" class="mt-4 px-6 py-2 bg-on-tertiary-container/10 text-on-tertiary-container border border-on-tertiary-container/20 rounded-lg font-semibold hover:bg-on-tertiary-container/20 transition-all cursor-pointer">
        Mở lớp học đầu tiên
      </button>
    </div>

    <!-- Resolution Modal -->
    <teleport to="body">
      <div v-if="resolveDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-2xl w-full overflow-hidden animate-scale-in flex flex-col">
          <!-- Title -->
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-600">warning</span>
              Giải quyết hủy lớp chưa đủ sĩ số: {{ resolveTargetClass?.className }}
            </h3>
            <button @click="resolveDialog = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Mode Tabs -->
          <div class="flex border-b border-white/30 bg-primary-container/[0.02]">
            <button
              @click="resolveMode = 'individual'"
              :class="['flex-1 py-3 text-body-sm font-semibold border-b-2 transition-all cursor-pointer', resolveMode === 'individual' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary-container']"
            >
              Giải quyết từng học viên
            </button>
            <button
              @click="resolveMode = 'vip'"
              :class="['flex-1 py-3 text-body-sm font-semibold border-b-2 transition-all cursor-pointer', resolveMode === 'vip' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary-container']"
            >
              Tách / Tạo lớp VIP (Chuyển cả nhóm & Thu nhỏ số buổi)
            </button>
          </div>

          <!-- Form Body -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            <div v-if="loadingResolveStudents" class="flex flex-col items-center justify-center py-12 space-y-2">
              <span class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></span>
              <span class="text-body-sm text-on-surface-variant">Đang tải danh sách học viên...</span>
            </div>

            <div v-else-if="resolveStudents.length === 0" class="text-center py-8">
              <p class="text-body-sm text-on-surface-variant">Không tìm thấy học viên trong lớp học này.</p>
            </div>

            <!-- Individual resolutions -->
            <div v-else-if="resolveMode === 'individual'" class="space-y-4">
              <div class="p-3 bg-amber-500/5 border border-amber-500/20 text-amber-800 rounded-xl text-[12px] leading-relaxed">
                Lớp học này sẽ bị <strong>Hủy bỏ</strong>. Hãy chọn phương án xử lý học phí cho từng học viên dưới đây:
              </div>

              <div class="divide-y divide-white/40">
                <div v-for="(student, index) in resolveStudents" :key="student.studentId" class="py-3.5 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold text-primary-container">
                      {{ student.fullName }}
                      <span class="text-body-xs font-normal text-on-surface-variant">(Mã HV: {{ student.studentId }})</span>
                    </div>
                    <div class="text-[12px] text-on-surface-variant">SĐT: {{ student.phone || 'N/A' }}</div>
                  </div>

                  <div class="flex flex-wrap gap-4 items-center mt-1">
                    <label class="flex items-center gap-1.5 cursor-pointer text-body-sm text-primary font-medium">
                      <input
                        type="radio"
                        :name="'action-' + student.studentId"
                        value="BaoLuu"
                        v-model="resolveForm.resolutions[index].action"
                        class="w-4 h-4 text-primary focus:ring-0 cursor-pointer"
                      />
                      Bảo lưu học phí
                    </label>

                    <label class="flex items-center gap-1.5 cursor-pointer text-body-sm text-primary font-medium">
                      <input
                        type="radio"
                        :name="'action-' + student.studentId"
                        value="ChuyenLop"
                        v-model="resolveForm.resolutions[index].action"
                        class="w-4 h-4 text-primary focus:ring-0 cursor-pointer"
                      />
                      Chuyển lớp học
                    </label>

                    <label class="flex items-center gap-1.5 cursor-pointer text-body-sm text-primary font-medium">
                      <input
                        type="radio"
                        :name="'action-' + student.studentId"
                        value="HoanTien"
                        v-model="resolveForm.resolutions[index].action"
                        class="w-4 h-4 text-primary focus:ring-0 cursor-pointer"
                      />
                      Hoàn trả học phí
                    </label>
                  </div>

                  <!-- Choose class to transfer -->
                  <div v-if="resolveForm.resolutions[index].action === 'ChuyenLop'" class="mt-2 pl-6">
                    <label class="text-[11px] font-bold text-primary-container uppercase tracking-wide block mb-1">Chọn lớp học mới thay thế *</label>
                    <div v-if="classesOfSameCourse.length === 0" class="text-error text-body-xs font-semibold">
                      Không tìm thấy lớp học thay thế nào khác của khóa này.
                    </div>
                    <div v-else class="relative max-w-md">
                      <select
                        v-model="resolveForm.resolutions[index].newClassId"
                        class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2 text-body-sm text-primary-container focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all cursor-pointer"
                      >
                        <option :value="null" disabled>-- Chọn lớp học --</option>
                        <option v-for="c in classesOfSameCourse" :key="c.classId" :value="c.classId">
                          {{ c.className }} (Sĩ số: {{ c.currentStudents }}/{{ c.maxStudents }} - Phòng: {{ c.room || 'N/A' }})
                        </option>
                      </select>
                      <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VIP Class Creation -->
            <div v-else-if="resolveMode === 'vip'" class="space-y-4">
              <div class="p-3 bg-primary-container/5 border border-primary-container/10 text-primary-container rounded-xl text-[12px] leading-relaxed">
                <strong>Tự tạo lớp VIP quy mô nhỏ:</strong> Lớp học này chỉ có <strong>{{ resolveStudents.length }} học viên</strong>. Hệ thống sẽ tự động tạo một lớp mới và chuyển tất cả học viên sang lớp đó.
                <br/>Số buổi học được thu nhỏ tương ứng:
                <span class="font-bold text-on-tertiary-container">
                  {{ resolveTargetCourseDuration }} buổi &times; ({{ resolveStudents.length }} học viên / 5) = {{ calculatedVipSessions }} buổi
                </span> (làm tròn).
              </div>

              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Tên lớp VIP mới *</label>
                <input
                  v-model="vipFormData.className"
                  type="text"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary placeholder:text-outline-variant focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary">Giáo viên phụ trách</label>
                  <div class="relative">
                    <select
                      v-model="vipFormData.teacherId"
                      @change="onVipTeacherSelect"
                      class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                    >
                      <option :value="null">Chưa phân công</option>
                      <option v-for="t in teachers" :key="t.userId" :value="t.userId">
                        {{ t.fullName }} (@{{ t.username }})
                      </option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary">Phòng học</label>
                  <input
                    v-model="vipFormData.room"
                    type="text"
                    class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary placeholder:text-outline-variant focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                    placeholder="Ví dụ: Phòng VIP 1"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary">Thời lượng học (buổi)</label>
                  <input
                    v-model.number="vipFormData.totalSessions"
                    type="number"
                    class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:border-primary-container/40 focus:outline-none transition-all"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-body-sm font-semibold text-primary">Ngày khai giảng mới</label>
                  <input
                    v-model="vipFormData.startDate"
                    type="date"
                    class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="resolveDialog = false"
              class="px-5 py-2.5 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              @click="submitResolutions"
              :disabled="savingResolutions || loadingResolveStudents || !isResolveFormValid"
              class="px-5 py-2.5 rounded-lg bg-amber-600 text-white font-semibold text-[13px] hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="savingResolutions" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận &amp; Hủy lớp
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Create/Edit Dialog Modal -->
    <teleport to="body">
      <div v-if="dialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-lg w-full overflow-hidden animate-scale-in flex flex-col">
          <!-- Title -->
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'edit' : 'add_circle' }}</span>
              {{ isEdit ? 'Cập nhật thông tin lớp' : 'Mở lớp học mới' }}
            </h3>
            <button @click="dialog = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Form Body -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Môn học đào tạo *</label>
              <div class="relative">
                <select
                  v-model="formData.courseId"
                  :disabled="isEdit"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary-container focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all disabled:opacity-60"
                >
                  <option :value="null" disabled>Chọn môn học...</option>
                  <option v-for="opt in courseOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
              <p v-if="validationErrors.courseId" class="text-error text-[11px] font-semibold">{{ validationErrors.courseId }}</p>
            </div>

            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Tên lớp học *</label>
              <input
                v-model="formData.className"
                type="text"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary-container placeholder:text-outline-variant focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                placeholder="Nhập mã/tên lớp học (ví dụ: ENG-GTI-01)"
              />
              <p v-if="validationErrors.className" class="text-error text-[11px] font-semibold">{{ validationErrors.className }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary-container">Giáo viên phụ trách</label>
                <div class="relative">
                  <select
                    v-model="formData.teacherId"
                    @change="onTeacherSelect"
                    class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary-container cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                  >
                    <option :value="null">Chưa phân công</option>
                    <option v-for="t in teachers" :key="t.userId" :value="t.userId">
                      {{ t.fullName }} (@{{ t.username }})
                    </option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary-container">Phòng học</label>
                <input
                  v-model="formData.room"
                  type="text"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary-container placeholder:text-outline-variant focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                  placeholder="Ví dụ: Phòng 101, Lab A"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Sĩ số tối đa học viên *</label>
              <input
                v-model.number="formData.maxStudents"
                type="number"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary-container placeholder:text-outline-variant focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                placeholder="Sĩ số giới hạn"
              />
              <p v-if="validationErrors.maxStudents" class="text-error text-[11px] font-semibold">{{ validationErrors.maxStudents }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary-container">Ngày bắt đầu</label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary-container focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                />
              </div>
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary-container">Ngày kết thúc</label>
                <input
                  v-model="formData.endDate"
                  type="date"
                  class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-4 py-2.5 text-body-sm text-primary-container focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-white/40 flex justify-between gap-3 bg-white/20">
            <div>
              <button
                v-if="isEdit"
                @click="confirmDelete(formData)"
                class="px-5 py-2.5 rounded-lg bg-error text-white font-semibold text-[13px] hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
                Xóa lớp
              </button>
            </div>
            <div class="flex gap-3">
              <button
                @click="dialog = false"
                class="px-5 py-2.5 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                @click="saveForm"
                :disabled="saving || !isFormValid"
                class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                {{ isEdit ? 'Cập nhật' : 'Mở lớp' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <div v-if="deleteDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center gap-3 text-error">
            <span class="material-symbols-outlined text-[32px]">warning</span>
            <h3 class="font-title-md text-[18px] font-bold">Xác nhận xóa lớp học</h3>
          </div>
          <p class="text-body-sm text-on-surface-variant leading-relaxed">
            Bạn có chắc chắn muốn xóa lớp học <strong class="text-primary-container">{{ deleteTarget?.className }}</strong> không? Toàn bộ lịch trình lớp học này cũng sẽ bị xóa bỏ.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <button
              @click="deleteDialog = false"
              class="px-4 py-2 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="doDelete"
              :disabled="deleting"
              class="px-4 py-2 rounded-lg bg-error text-white font-semibold text-[13px] hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span v-if="deleting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xóa bỏ
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Assign Teacher Modal -->
    <teleport to="body">
      <div v-if="assignTeacherDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full p-6 space-y-4 animate-scale-in">
          <div class="flex items-center gap-3 text-primary">
            <span class="material-symbols-outlined text-[32px] text-on-tertiary-container">assignment_ind</span>
            <h3 class="font-title-md text-[18px] font-bold text-primary-container">Phân công giáo viên</h3>
          </div>
          <p class="text-body-sm text-on-surface-variant leading-relaxed">
            Chọn giáo viên phụ trách cho lớp <strong class="text-primary-container">{{ assignTeacherTargetClass?.className }}</strong>:
          </p>
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Giáo viên phụ trách *</label>
            <div class="relative">
              <select
                v-model="selectedTeacherId"
                class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-primary-container cursor-pointer focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
              >
                <option :value="null">Chưa phân công</option>
                <option v-for="t in teachers" :key="t.userId" :value="t.userId">
                  {{ t.fullName }} (@{{ t.username }})
                </option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button
              @click="assignTeacherDialog = false"
              class="px-4 py-2 rounded-lg border border-white/60 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="saveTeacherAssignment"
              :disabled="savingAssignment"
              class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span v-if="savingAssignment" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Lưu phân công
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClassStore, useCourseStore, useAuthStore } from '../../stores'
import api from '../../services/api'

const router = useRouter()
const classStore = useClassStore()
const courseStore = useCourseStore()
const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')

const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)
const activeDropdownId = ref(null)

const assignTeacherDialog = ref(false)
const assignTeacherTargetClass = ref(null)
const selectedTeacherId = ref(null)
const savingAssignment = ref(false)

function openAssignTeacherDialog(cls) {
  activeDropdownId.value = null
  assignTeacherTargetClass.value = cls
  selectedTeacherId.value = cls.teacherId || null
  assignTeacherDialog.value = true
}

async function saveTeacherAssignment() {
  if (!assignTeacherTargetClass.value) return
  savingAssignment.value = true
  try {
    const classId = assignTeacherTargetClass.value.classId
    const teacherId = selectedTeacherId.value
    const selected = teachers.value.find(t => t.userId === teacherId)
    const teacherName = selected ? selected.fullName : ''
    
    await classStore.updateClass(classId, {
      ...assignTeacherTargetClass.value,
      teacherId,
      teacherName
    })
    
    showSnackbar('Phân công giáo viên thành công', 'success')
    assignTeacherDialog.value = false
    fetchData()
  } catch (error) {
    showSnackbar('Lỗi phân công giáo viên', 'error')
  } finally {
    savingAssignment.value = false
  }
}

// Resolution Modal state refs
const resolveDialog = ref(false)
const resolveTargetClass = ref(null)
const resolveStudents = ref([])
const loadingResolveStudents = ref(false)
const savingResolutions = ref(false)
const resolveMode = ref('individual') // 'individual' or 'vip'
const classesOfSameCourse = ref([])
const resolveTargetCourseDuration = ref(30)

const resolveForm = ref({
  resolutions: []
})

const vipFormData = ref({
  className: '',
  teacherId: null,
  teacherName: '',
  room: '',
  totalSessions: 15,
  maxStudents: 5,
  startDate: null,
})

const teachers = ref([])

const formData = ref({
  courseId: null,
  className: '',
  teacherId: null,
  teacherName: '',
  room: '',
  maxStudents: 30,
  startDate: null,
  endDate: null,
})

const filters = ref({
  search: '',
  courseId: null,
  status: null,
})

const statusOptions = [
  { title: 'Đang tuyển sinh', value: 'Opened' },
  { title: 'Đang học', value: 'InProgress' },
  { title: 'Hoàn thành', value: 'Completed' },
  { title: 'Đã hủy', value: 'Cancelled' },
]

const validationErrors = ref({
  courseId: '',
  className: '',
  maxStudents: '',
})

const isFormValid = computed(() => {
  return formData.value.courseId !== null &&
         formData.value.className.trim().length > 0 &&
         formData.value.maxStudents > 0
})

watch(() => formData.value.courseId, (val) => {
  validationErrors.value.courseId = val === null ? 'Vui lòng chọn môn học tương ứng' : ''
})

watch(() => formData.value.className, (val) => {
  validationErrors.value.className = val.trim().length === 0 ? 'Tên lớp học không được để trống' : ''
})

watch(() => formData.value.maxStudents, (val) => {
  validationErrors.value.maxStudents = val <= 0 ? 'Sĩ số giới hạn phải lớn hơn 0 học viên' : ''
})

// Resolution computed properties and methods
const calculatedVipSessions = computed(() => {
  if (!resolveTargetClass.value) return 15
  const N = resolveStudents.value.length || 1
  return Math.round(resolveTargetCourseDuration.value * (N / 5.0))
})

const isResolveFormValid = computed(() => {
  if (resolveMode.value === 'individual') {
    if (resolveForm.value.resolutions.length === 0) return false
    return resolveForm.value.resolutions.every(res => {
      if (!res.action) return false
      if (res.action === 'ChuyenLop' && !res.newClassId) return false
      return true
    })
  } else {
    return vipFormData.value.className.trim().length > 0 && vipFormData.value.totalSessions > 0
  }
})

const isUnderEnrolled = (cls) => {
  if (!cls.startDate || cls.status !== 'Opened') return false
  const start = new Date(cls.startDate)
  const today = new Date()
  start.setHours(0,0,0,0)
  today.setHours(0,0,0,0)
  return start < today && cls.currentStudents < 5
}

const onVipTeacherSelect = () => {
  const selected = teachers.value.find(t => t.userId === vipFormData.value.teacherId)
  vipFormData.value.teacherName = selected ? selected.fullName : ''
}

const openResolveModal = async (cls) => {
  resolveTargetClass.value = cls
  resolveMode.value = 'individual'
  resolveDialog.value = true
  loadingResolveStudents.value = true
  resolveStudents.value = []
  
  // Find course duration
  const course = courseStore.courses.find(c => c.courseId === cls.courseId)
  resolveTargetCourseDuration.value = course ? course.totalSessions : 30

  // Init VIP form data
  vipFormData.value = {
    className: `Lớp ${cls.courseName} - VIP nhóm nhỏ`,
    teacherId: cls.teacherId || null,
    teacherName: cls.teacherName || '',
    room: cls.room || 'Phòng VIP 1',
    totalSessions: 15,
    maxStudents: 5,
    startDate: cls.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
  }

  try {
    // 1. Fetch Students in Class
    const resStudents = await api.get(`/api/v1/enrollments/class/${cls.classId}/students`)
    resolveStudents.value = resStudents.data || []
    
    // Set calculated sessions based on loaded count
    vipFormData.value.totalSessions = Math.round(resolveTargetCourseDuration.value * (resolveStudents.value.length / 5.0)) || 15

    // 2. Initialize resolutions form
    resolveForm.value.resolutions = resolveStudents.value.map(s => ({
      studentId: s.studentId,
      action: 'BaoLuu',
      newClassId: null
    }))

    // 3. Fetch active classes of the same course
    const resClasses = await api.get('/api/v1/classes', { params: { courseId: cls.courseId, pageSize: 100 } })
    classesOfSameCourse.value = (resClasses.data?.items || []).filter(c => c.classId !== cls.classId && c.status !== 'Cancelled')
  } catch (error) {
    showSnackbar('Lỗi tải thông tin giải quyết lớp học', 'error')
    resolveDialog.value = false
  } finally {
    loadingResolveStudents.value = false
  }
}

const submitResolutions = async () => {
  savingResolutions.value = true
  try {
    const classId = resolveTargetClass.value.classId
    
    if (resolveMode.value === 'individual') {
      // 1. Save resolutions to backend StudentService
      await api.post('/api/v1/enrollments/resolve-cancelled-class', {
        classId: classId,
        resolutions: resolveForm.value.resolutions
      })

      // 2. Update status of the original class to Cancelled in CourseService
      await classStore.updateClassStatus(classId, 'Cancelled')
      
      showSnackbar('Đã hủy lớp và giải quyết thành công cho các học viên', 'success')
    } else {
      // VIP Mode:
      // 1. Create a new VIP class in CourseService
      const newClassPayload = {
        courseId: resolveTargetClass.value.courseId,
        className: vipFormData.value.className,
        teacherId: vipFormData.value.teacherId,
        teacherName: vipFormData.value.teacherName,
        room: vipFormData.value.room,
        maxStudents: vipFormData.value.maxStudents,
        totalSessions: vipFormData.value.totalSessions,
        startDate: vipFormData.value.startDate,
        endDate: null
      }
      
      const newCls = await classStore.createClass(newClassPayload)
      const newClassId = newCls.classId
      
      // 2. Build resolutions where everyone transfers to the new class
      const vipResolutions = resolveStudents.value.map(s => ({
        studentId: s.studentId,
        action: 'ChuyenLop',
        newClassId: newClassId
      }))
      
      // Save resolutions to StudentService
      await api.post('/api/v1/enrollments/resolve-cancelled-class', {
        classId: classId,
        resolutions: vipResolutions
      })
      
      // 3. Cancel the original class
      await classStore.updateClassStatus(classId, 'Cancelled')
      
      showSnackbar(`Đã hủy lớp cũ và tự động chuyển học viên sang lớp VIP mới: ${vipFormData.value.className} (${vipFormData.value.totalSessions} buổi)`, 'success')
    }

    // Close dialog and refresh data
    resolveDialog.value = false
    fetchData()
  } catch (error) {
    showSnackbar(error.response?.data?.message || 'Lỗi khi thực hiện giải quyết lớp học', 'error')
  } finally {
    savingResolutions.value = false
  }
}

const courseOptions = computed(() =>
  courseStore.courses.map(c => ({ title: c.courseName, value: c.courseId }))
)

const stats = computed(() => [
  { label: 'Tổng lớp học', value: classStore.totalCount, icon: 'groups', bgColor: 'bg-primary-container/10', textColor: 'text-primary-container' },
  { label: 'Tuyển sinh', value: classStore.classes.filter(c => c.status === 'Opened').length, icon: 'campaign', bgColor: 'bg-sky-500/10', textColor: 'text-sky-600' },
  { label: 'Đang học', value: classStore.classes.filter(c => c.status === 'InProgress').length, icon: 'play_circle', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600' },
  { label: 'Đã hoàn thành', value: classStore.classes.filter(c => c.status === 'Completed').length, icon: 'task_alt', bgColor: 'bg-purple-500/10', textColor: 'text-purple-600' },
])

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchData, 300)
}

async function fetchData() {
  try {
    const params = {
      search: filters.value.search || undefined,
      courseId: filters.value.courseId || undefined,
      status: filters.value.status || undefined,
      pageSize: 50,
    }
    if (authStore.currentUser?.role === 'GiaoVien') {
      params.teacherId = authStore.currentUser.userId
    }
    await classStore.fetchClasses(params)
  } catch (e) {
    showSnackbar('Lỗi tải danh sách lớp học', 'error')
  }
}

function onCardClick(cls) {
  if (authStore.isAdmin) {
    openEditDialog(cls)
  } else if (authStore.isTeacher || authStore.currentUser?.role === 'GiaoVien') {
    router.push(`/classes/${cls.classId}/students`)
  }
}

async function fetchTeachers() {
  try {
    const { data } = await api.get('/api/v1/users/teachers')
    teachers.value = data || []
  } catch (error) {
    console.error('Error fetching teachers:', error)
  }
}

function onTeacherSelect() {
  const selected = teachers.value.find(t => t.userId === formData.value.teacherId)
  if (selected) {
    formData.value.teacherName = selected.fullName
  } else {
    formData.value.teacherName = ''
  }
}

function toggleDropdown(classId) {
  if (activeDropdownId.value === classId) {
    activeDropdownId.value = null
  } else {
    activeDropdownId.value = classId
  }
}

// Close dropdown on click outside
function closeAllDropdowns(e) {
  if (activeDropdownId.value !== null && !e.target.closest('.relative')) {
    activeDropdownId.value = null
  }
}

onMounted(() => {
  window.addEventListener('click', closeAllDropdowns)
})

function openCreateDialog() {
  isEdit.value = false
  validationErrors.value = { courseId: '', className: '', maxStudents: '' }
  formData.value = { courseId: null, className: '', teacherId: null, teacherName: '', room: '', maxStudents: 30, startDate: null, endDate: null }
  dialog.value = true
}

function openEditDialog(cls) {
  isEdit.value = true
  validationErrors.value = { courseId: '', className: '', maxStudents: '' }
  formData.value = {
    classId: cls.classId,
    courseId: cls.courseId,
    className: cls.className,
    teacherId: cls.teacherId || null,
    teacherName: cls.teacherName || '',
    room: cls.room || '',
    maxStudents: cls.maxStudents,
    startDate: cls.startDate?.split('T')[0] || null,
    endDate: cls.endDate?.split('T')[0] || null,
  }
  dialog.value = true
}

async function saveForm() {
  if (!isFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      await classStore.updateClass(formData.value.classId, formData.value)
      showSnackbar('Cập nhật lớp thành công', 'success')
    } else {
      await classStore.createClass(formData.value)
      showSnackbar('Mở lớp mới thành công', 'success')
    }
    dialog.value = false
    fetchData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin lớp', 'error')
  } finally {
    saving.value = false
  }
}

async function changeStatus(classId, status) {
  activeDropdownId.value = null
  try {
    await classStore.updateClassStatus(classId, status)
    showSnackbar('Cập nhật trạng thái lớp học thành công', 'success')
    fetchData()
  } catch (e) {
    showSnackbar('Lỗi cập nhật trạng thái lớp học', 'error')
  }
}

function confirmDelete(cls) {
  dialog.value = false
  activeDropdownId.value = null
  deleteTarget.value = cls
  deleteDialog.value = true
}

async function doDelete() {
  deleting.value = true
  try {
    await classStore.deleteClass(deleteTarget.value.classId)
    showSnackbar('Đã xóa lớp học thành công', 'success')
    deleteDialog.value = false
    fetchData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Lỗi khi xóa lớp học', 'error')
  } finally {
    deleting.value = false
  }
}

function getStatusLabel(status) {
  const map = { Opened: 'Đang tuyển sinh', InProgress: 'Đang học', Completed: 'Hoàn thành', Cancelled: 'Đã hủy' }
  return map[status] || status
}

function getStatusBadgeClass(status) {
  const map = { Opened: 'status-opened', InProgress: 'status-inprogress', Completed: 'status-completed', Cancelled: 'status-cancelled' }
  return map[status] || 'bg-white/40 text-on-surface-variant border border-white/60'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

onMounted(async () => {
  window.addEventListener('click', closeAllDropdowns)
  await courseStore.fetchCourses({ pageSize: 100 })
  await fetchTeachers()
  fetchData()
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
