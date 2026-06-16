<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Back Navigation Link -->
    <router-link
      :to="`/classes`"
      class="text-on-tertiary-container hover:underline font-body-sm flex items-center gap-1 w-fit"
    >
      <span class="material-symbols-outlined text-[18px]">arrow_back</span>
      Quay lại danh sách lớp học
    </router-link>

    <!-- Page Header -->
    <div class="flex items-center flex-wrap gap-4 justify-between">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-primary-container">Thời khóa biểu</h1>
        <p class="font-body-lg text-on-surface-variant mt-1" v-if="classInfo">
          Lớp: <strong class="text-primary-container font-semibold">{{ classInfo.className }}</strong> &mdash; Môn học: {{ classInfo.courseName }}
        </p>
      </div>
      <div>
        <button
          v-if="authStore.isAdmin"
          @click="openCreateDialog"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-semibold text-[14px] shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          <span class="material-symbols-outlined text-[20px]">add</span>
          Thêm lịch học
        </button>
        <button
          v-else
          @click="openRescheduleDialog(null)"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-semibold text-[14px] shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[20px]">calendar_add_on</span>
          Yêu cầu thêm lịch học
        </button>
      </div>
    </div>

    <!-- Class Info Card -->
    <div v-if="classInfo" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm">
        <div class="space-y-1">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Mã lớp học</div>
          <div class="text-[16px] font-bold text-primary-container">{{ classInfo.className }}</div>
        </div>
        <div class="space-y-1">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Giáo viên phụ trách</div>
          <div class="text-[15px] font-semibold text-primary-container">{{ classInfo.teacherName || 'Chưa phân công' }}</div>
        </div>
        <div class="space-y-1">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Phòng học / Link</div>
          <div class="text-[15px] font-semibold text-primary-container">{{ classInfo.room || 'Chưa xếp phòng' }}</div>
        </div>
        <div class="space-y-1">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Trạng thái lớp</div>
          <div class="pt-0.5">
            <span :class="['status-badge', getStatusBadgeClass(classInfo.status)]">
              {{ getStatusLabel(classInfo.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Schedule Table List -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-high text-label-caps font-label-caps text-on-surface-variant uppercase">
              <th class="py-4 px-6 whitespace-nowrap">Thứ</th>
              <th class="py-4 px-6 whitespace-nowrap">Buổi</th>
              <th class="py-4 px-6 whitespace-nowrap">Thời gian học</th>
              <th class="py-4 px-6 whitespace-nowrap text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="font-body-sm text-body-sm divide-y divide-outline-variant/30">
            <tr
              v-for="item in scheduleStore.schedules"
              :key="item.scheduleId"
              class="hover:bg-primary-container/[0.03] transition-colors group cursor-pointer"
              @click="openEditDialog(item)"
            >
              <td class="py-4 px-6">
                <span :class="[getDayBgColor(item.dayOfWeek), 'px-3 py-1 rounded-full text-[12px] font-bold']">
                  {{ item.dayOfWeekName }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span :class="[getSessionBgColor(item.session), 'px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 w-fit']">
                  <span class="material-symbols-outlined text-[14px]">{{ getSessionIcon(item.session) }}</span>
                  {{ getSessionLabel(item.session) }}
                </span>
              </td>
              <td class="py-4 px-6 font-bold text-primary-container">
                {{ item.startTime }} &mdash; {{ item.endTime }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-1.5" v-if="authStore.isAdmin">
                  <button
                    @click.stop="openEditDialog(item)"
                    class="w-8 h-8 rounded-lg bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container flex items-center justify-center transition-colors cursor-pointer"
                    title="Sửa lịch"
                  >
                    <span class="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button
                    @click.stop="confirmDelete(item)"
                    class="w-8 h-8 rounded-lg bg-error/10 hover:bg-error/20 text-error flex items-center justify-center transition-colors cursor-pointer"
                    title="Xóa lịch"
                  >
                    <span class="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
                <div class="flex justify-end gap-1.5" v-else>
                  <button
                    @click.stop="openRescheduleDialog(item)"
                    class="px-3 py-1.5 rounded-lg bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container flex items-center justify-center gap-1 transition-colors cursor-pointer font-semibold text-xs"
                    title="Yêu cầu đổi lịch"
                  >
                    <span class="material-symbols-outlined text-[15px]">swap_horiz</span>
                    Yêu cầu đổi lịch
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!scheduleStore.loading && scheduleStore.schedules.length === 0">
              <td colspan="4" class="py-12 text-center text-on-surface-variant font-medium">
                <span class="material-symbols-outlined text-primary-container/30 text-[48px] mb-2 block">calendar_today</span>
                Chưa có lịch học nào được thêm cho lớp này.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Weekly View Calendar Grid -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter" v-if="scheduleStore.schedules.length > 0">
      <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 class="font-bold text-xl text-primary-container flex items-center gap-2">
          <span class="material-symbols-outlined text-on-tertiary-container">calendar_view_week</span>
          Lịch tuần học tập
        </h3>
        <!-- Total count badge -->
        <span class="bg-[#f0ebf8] text-[#5e35b1] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border border-[#5e35b1]/10">
          Tổng cộng: {{ scheduleStore.schedules.length }} buổi học / tuần
        </span>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200/60 shadow-sm">
        <table class="w-full min-w-[900px] border-collapse text-center">
          <thead>
            <tr class="bg-[#1a7380] text-white">
              <th class="py-3.5 px-4 font-bold text-sm border-r border-[#15626d] first:rounded-tl-xl w-[12%]">
                BUỔI
              </th>
              <th
                v-for="day in weekDaysWithDates"
                :key="day.value"
                class="py-3 px-4 font-bold text-sm border-r border-[#15626d] w-[11%]"
              >
                <div>{{ day.label }}</div>
                <div class="text-[11px] font-normal opacity-90 mt-0.5">({{ day.date }})</div>
              </th>
              <th class="py-3.5 px-4 font-bold text-sm last:rounded-tr-xl w-[11%]">
                GHI CHÚ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="sess in sessions"
              :key="sess.value"
              class="border-b border-slate-200/60 last:border-b-0 hover:bg-slate-50/30 transition-colors"
            >
              <!-- Row headers -->
              <td class="py-6 px-3 border-r border-slate-200/60 bg-slate-50/50 font-bold text-[13px] text-[#1a7380] align-middle">
                <div>{{ sess.label }}</div>
                <div class="text-[11px] font-semibold text-slate-400 mt-1">{{ sess.subLabel }}</div>
              </td>

              <!-- Day cells -->
              <td
                v-for="day in weekDaysWithDates"
                :key="day.value"
                class="py-4 px-3 border-r border-slate-200/60 align-middle min-h-[90px]"
              >
                <div v-if="getSchedulesForCell(day.value, sess.value).length > 0" class="space-y-3">
                  <div
                    v-for="s in getSchedulesForCell(day.value, sess.value)"
                    :key="s.scheduleId"
                    class="p-2.5 rounded-lg border border-slate-200/80 bg-white shadow-sm hover:border-[#1a7380]/40 hover:shadow-md transition-all cursor-pointer text-center group relative active:scale-[0.98]"
                    @click="authStore.isAdmin ? openEditDialog(s) : openRescheduleDialog(s)"
                  >
                    <!-- Course name -->
                    <div class="font-bold text-slate-800 text-[13px] leading-tight">
                      {{ classInfo?.courseName || 'Lớp học' }}
                    </div>
                    <!-- Room -->
                    <div class="text-[11.5px] font-semibold text-slate-500 mt-1.5 flex items-center justify-center gap-0.5">
                      Phòng: {{ classInfo?.room || 'N/A' }}
                    </div>
                    <!-- Periods -->
                    <div class="text-[11.5px] font-semibold text-slate-500 mt-0.5">
                      {{ getPeriodsLabel(sess.value, s.startTime, s.endTime) }}
                    </div>

                    <!-- Admin hover actions -->
                    <div
                      v-if="authStore.isAdmin"
                      class="absolute -top-2 -right-2 hidden group-hover:flex gap-1 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] rounded-lg p-1 z-10 border border-slate-200/80"
                    >
                      <button
                        @click.stop="openEditDialog(s)"
                        class="w-6.5 h-6.5 rounded hover:bg-slate-100 text-[#1a7380] flex items-center justify-center transition-colors"
                        title="Sửa"
                      >
                        <span class="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button
                        @click.stop="confirmDelete(s)"
                        class="w-6.5 h-6.5 rounded hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors"
                        title="Xóa"
                      >
                        <span class="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </td>

              <!-- GHI CHÚ cell -->
              <td class="py-4 px-3 align-middle text-slate-400 text-[12px]">
                <!-- Empty for notes -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Schedule Dialog Modal -->
    <div v-if="dialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/80 backdrop-blur-[20px] border border-white/50 shadow-2xl max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
        <!-- Title -->
        <div class="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-slate-50/50">
          <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">{{ isEdit ? 'edit' : 'add_circle' }}</span>
            {{ isEdit ? 'Cập nhật lịch học' : 'Thêm lịch học mới' }}
          </h3>
          <button @click="dialog = false" class="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-error/10 hover:text-error transition-colors cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4 text-left">
          <div class="space-y-1.5">
            <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">Ngày học trong tuần <span class="text-error">*</span></label>
            <div class="relative">
              <select
                v-model="formData.dayOfWeek"
                class="w-full glass-input rounded-lg pl-4 pr-10 py-2.5 font-body-sm text-body-sm text-on-surface appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] cursor-pointer"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
              >
                <option v-for="d in weekDays" :key="d.value" :value="d.value">{{ d.label }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">Buổi học <span class="text-error">*</span></label>
            <div class="relative">
              <select
                v-model="formData.session"
                class="w-full glass-input rounded-lg pl-4 pr-10 py-2.5 font-body-sm text-body-sm text-on-surface appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] cursor-pointer"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
              >
                <option v-for="opt in sessionOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">Giờ bắt đầu <span class="text-error">*</span></label>
              <input
                v-model="formData.startTime"
                type="time"
                class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface cursor-pointer"
              />
              <p v-if="validationErrors.startTime" class="text-error text-[11px] font-semibold mt-1">{{ validationErrors.startTime }}</p>
            </div>
            <div class="space-y-1.5">
              <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">Giờ kết thúc <span class="text-error">*</span></label>
              <input
                v-model="formData.endTime"
                type="time"
                class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface cursor-pointer"
              />
              <p v-if="validationErrors.endTime" class="text-error text-[11px] font-semibold mt-1">{{ validationErrors.endTime }}</p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-slate-50/50">
          <button
            @click="dialog = false"
            class="px-5 py-2 rounded-lg border border-outline-variant text-secondary font-title-md text-body-sm hover:bg-secondary/10 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            @click="saveForm"
            :disabled="saving || !isFormValid"
            class="px-5 py-2 rounded-lg bg-primary text-white font-title-md text-body-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            {{ isEdit ? 'Cập nhật' : 'Thêm lịch' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/80 backdrop-blur-[20px] border border-white/55 shadow-2xl max-w-md w-full rounded-2xl p-6 space-y-4 animate-scale-in">
        <div class="flex items-center gap-3 text-error">
          <span class="material-symbols-outlined text-[32px]">warning</span>
          <h3 class="font-title-md text-[18px] font-bold">Xác nhận xóa lịch học</h3>
        </div>
        <p class="text-body-sm text-on-surface-variant leading-relaxed">
          Bạn có chắc chắn muốn xóa buổi lịch học này không? Hành động này sẽ loại bỏ buổi học khỏi thời khóa biểu lớp.
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <button
            @click="deleteDialog = false"
            class="px-4 py-2 rounded-lg border border-outline-variant text-secondary font-title-md text-body-sm hover:bg-secondary/10 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            @click="doDelete"
            :disabled="deleting"
            class="px-4 py-2 rounded-lg bg-error text-white font-title-md text-body-sm hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span v-if="deleting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            Xóa bỏ
          </button>
        </div>
      </div>
    </div>

    <!-- Reschedule Request Dialog Modal -->
    <div v-if="rescheduleDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/80 backdrop-blur-[20px] border border-white/50 shadow-2xl max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
        <!-- Title -->
        <div class="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-slate-50/50">
          <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">
              {{ isRequestTypeAdd ? 'calendar_add_on' : 'edit_calendar' }}
            </span>
            {{ isRequestTypeAdd ? 'Yêu cầu thêm lịch học' : 'Yêu cầu đổi lịch học' }}
          </h3>
          <button @click="rescheduleDialog = false" class="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-error/10 hover:text-error transition-colors cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4 text-left">
          <!-- Current Slot Info if selected -->
          <div v-if="!isRequestTypeAdd && selectedRescheduleSlot" class="bg-primary-container/[0.03] border border-primary-container/10 rounded-xl p-4 space-y-1">
            <div class="text-[11px] font-bold text-secondary uppercase tracking-wider">Buổi học cần đổi:</div>
            <div class="font-bold text-primary text-[15px] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
              {{ formatDayOfWeek(selectedRescheduleSlot.dayOfWeek) }} ({{ selectedRescheduleSlot.startTime }} - {{ selectedRescheduleSlot.endTime }})
            </div>
          </div>
          <!-- Otherwise select from current slots dropdown -->
          <div v-else-if="!isRequestTypeAdd" class="space-y-1.5">
            <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">Chọn buổi học cần đổi <span class="text-error">*</span></label>
            <div class="relative">
              <select
                v-model="rescheduleFormData.scheduleId"
                class="w-full glass-input rounded-lg pl-4 pr-10 py-2.5 font-body-sm text-body-sm text-on-surface appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] cursor-pointer"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
              >
                <option v-for="s in scheduleStore.schedules" :key="s.scheduleId" :value="s.scheduleId">
                  {{ formatDayOfWeek(s.dayOfWeek) }} ({{ s.startTime }} - {{ s.endTime }})
                </option>
              </select>
            </div>
          </div>

          <div v-if="!isRequestTypeAdd" class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="flex-shrink mx-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Đề xuất lịch mới</span>
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">
                {{ isRequestTypeAdd ? 'Ngày học đề xuất *' : 'Ngày học mới *' }}
              </label>
              <div class="relative">
                <select
                  v-model="rescheduleFormData.newDayOfWeek"
                  class="w-full glass-input rounded-lg pl-4 pr-10 py-2.5 font-body-sm text-body-sm text-on-surface appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] cursor-pointer"
                  style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
                >
                  <option v-for="d in weekDays" :key="d.value" :value="d.value">{{ d.label }}</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">Buổi học đề xuất <span class="text-error">*</span></label>
              <div class="relative">
                <select
                  v-model="rescheduleFormData.newSession"
                  class="w-full glass-input rounded-lg pl-4 pr-10 py-2.5 font-body-sm text-body-sm text-on-surface appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] cursor-pointer"
                  style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235d5f5f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');"
                >
                  <option v-for="opt in sessionOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">Giờ bắt đầu <span class="text-error">*</span></label>
              <input
                v-model="rescheduleFormData.newStartTime"
                type="time"
                class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface cursor-pointer"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">Giờ kết thúc <span class="text-error">*</span></label>
              <input
                v-model="rescheduleFormData.newEndTime"
                type="time"
                class="w-full glass-input rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface cursor-pointer"
              />
            </div>
          </div>
          <p v-if="rescheduleFormData.newStartTime && rescheduleFormData.newEndTime && rescheduleFormData.newStartTime >= rescheduleFormData.newEndTime" class="text-error text-[11px] font-semibold mt-1">Giờ kết thúc phải sau giờ bắt đầu</p>

          <div class="space-y-1.5">
            <label class="block font-title-md text-body-sm text-on-surface-variant font-semibold">
              {{ isRequestTypeAdd ? 'Lý do thêm lịch *' : 'Lý do đổi lịch *' }}
            </label>
            <textarea
              v-model="rescheduleFormData.reason"
              rows="3"
              placeholder="Nhập lý do chi tiết..."
              class="w-full glass-input rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-on-surface resize-none focus:outline-none transition-colors"
            ></textarea>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-slate-50/50">
          <button
            @click="rescheduleDialog = false"
            class="px-5 py-2 rounded-lg border border-outline-variant text-secondary font-title-md text-body-sm hover:bg-secondary/10 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            @click="submitRescheduleRequest"
            :disabled="submittingReschedule || !isRescheduleFormValid"
            class="px-5 py-2 rounded-lg bg-primary text-white font-title-md text-body-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <span v-if="submittingReschedule" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useScheduleStore, useClassStore, useAuthStore } from '../../stores'
import api from '../../services/api'

const route = useRoute()
const scheduleStore = useScheduleStore()
const classStore = useClassStore()
const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')
const classId = parseInt(route.params.id)

// Reschedule dialog states
const rescheduleDialog = ref(false)
const submittingReschedule = ref(false)
const selectedRescheduleSlot = ref(null)
const isRequestTypeAdd = ref(false)
const rescheduleFormData = ref({
  scheduleId: null,
  newDayOfWeek: 2,
  newSession: 'Sang',
  newStartTime: '08:00',
  newEndTime: '10:00',
  reason: ''
})

const isRescheduleFormValid = computed(() => {
  return rescheduleFormData.value.newStartTime.trim().length > 0 &&
         rescheduleFormData.value.newEndTime.trim().length > 0 &&
         rescheduleFormData.value.newStartTime < rescheduleFormData.value.newEndTime &&
         rescheduleFormData.value.reason.trim().length > 0 &&
         (isRequestTypeAdd.value || selectedRescheduleSlot.value !== null || rescheduleFormData.value.scheduleId !== null)
})

function formatDayOfWeek(day) {
  const found = weekDays.find(d => d.value === day)
  return found ? found.label : day
}

function openRescheduleDialog(item) {
  isRequestTypeAdd.value = (item === null)
  selectedRescheduleSlot.value = item
  rescheduleFormData.value = {
    scheduleId: item ? item.scheduleId : (scheduleStore.schedules[0]?.scheduleId || null),
    newDayOfWeek: 2,
    newSession: 'Sang',
    newStartTime: '08:00',
    newEndTime: '10:00',
    reason: ''
  }
  rescheduleDialog.value = true
}

async function submitRescheduleRequest() {
  if (!isRescheduleFormValid.value) return
  submittingReschedule.value = true
  try {
    let targetStudentId = null
    if (authStore.isStudent) {
      const userRes = await api.get('/api/v1/students/by-user/' + authStore.currentUser.userId)
      targetStudentId = userRes.data?.studentId
    } else {
      try {
        const classStudRes = await api.get(`/api/v1/classes/${classId}/students`)
        const studentsList = classStudRes.data || []
        if (studentsList.length > 0) {
          targetStudentId = studentsList[0].studentId
        } else {
          const allStudRes = await api.get('/api/v1/students')
          targetStudentId = allStudRes.data?.items?.[0]?.studentId || 1
        }
      } catch (err) {
        targetStudentId = 1
      }
    }

    const proposedDayName = weekDays.find(d => d.value === rescheduleFormData.value.newDayOfWeek)?.label || ''
    const senderType = authStore.isTeacher ? `Giảng viên (${classInfo.value?.teacherName || 'GiaoVien'})` : `Học viên (${authStore.currentUser?.fullName || 'HocVien'})`
    
    let messageBody = ''
    if (isRequestTypeAdd.value) {
      messageBody = `[Yêu cầu thêm lịch học từ ${senderType}]
Lớp: ${classInfo.value?.className || ''}
Môn học: ${classInfo.value?.courseName || ''}
Lịch đề xuất thêm mới: ${proposedDayName}, Buổi ${getSessionLabel(rescheduleFormData.value.newSession)} (${rescheduleFormData.value.newStartTime} - ${rescheduleFormData.value.newEndTime})
Lý do: ${rescheduleFormData.value.reason}`
    } else {
      const selectedSlot = selectedRescheduleSlot.value || scheduleStore.schedules.find(s => s.scheduleId === rescheduleFormData.value.scheduleId)
      const dayOfWeekName = selectedSlot ? formatDayOfWeek(selectedSlot.dayOfWeek) : ''
      const slotDetails = selectedSlot ? `Thứ ${dayOfWeekName} (${selectedSlot.startTime} - ${selectedSlot.endTime})` : ''
      
      messageBody = `[Yêu cầu đổi lịch học từ ${senderType}]
Lớp: ${classInfo.value?.className || ''}
Môn học: ${classInfo.value?.courseName || ''}
Lịch hiện tại cần đổi: ${slotDetails}
Lịch đề xuất mới: ${proposedDayName}, Buổi ${getSessionLabel(rescheduleFormData.value.newSession)} (${rescheduleFormData.value.newStartTime} - ${rescheduleFormData.value.newEndTime})
Lý do: ${rescheduleFormData.value.reason}`
    }

    await api.post('/api/v1/support-messages', {
      studentId: targetStudentId,
      message: messageBody,
      fromClassId: classId,
      fromClassName: classInfo.value?.className,
      toClassId: null,
      toClassName: null
    })

    const typeLabel = isRequestTypeAdd.value ? 'thêm lịch học' : 'đổi lịch học'
    showSnackbar(`Đã gửi yêu cầu ${typeLabel} lên Admin thành công!`, 'success')
    rescheduleDialog.value = false
  } catch (err) {
    console.error('Error submitting reschedule request:', err)
    const typeLabel = isRequestTypeAdd.value ? 'thêm lịch học' : 'đổi lịch học'
    showSnackbar(`Có lỗi xảy ra khi gửi yêu cầu ${typeLabel}`, 'error')
  } finally {
    submittingReschedule.value = false
  }
}


const classInfo = ref(null)

const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteTarget = ref(null)

const formData = ref({
  dayOfWeek: 2,
  session: 'Sang',
  startTime: '08:00',
  endTime: '10:00',
})

const weekDays = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 0 },
]

const sessionOptions = [
  { title: '🌅 Sáng', value: 'Sang' },
  { title: '☀️ Chiều', value: 'Chieu' },
  { title: '🌙 Tối', value: 'Toi' },
]

const getCurrentWeekDates = () => {
  const currentDate = new Date()
  const day = currentDate.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday to get monday
  const monday = new Date(currentDate)
  monday.setDate(diff)
  
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dayStr = String(d.getDate()).padStart(2, '0')
    const monthStr = String(d.getMonth() + 1).padStart(2, '0')
    dates.push(`${dayStr}/${monthStr}`)
  }
  return dates
}

const weekDaysWithDates = computed(() => {
  const dates = getCurrentWeekDates()
  return [
    { label: 'THỨ 2', date: dates[0], value: 2 },
    { label: 'THỨ 3', date: dates[1], value: 3 },
    { label: 'THỨ 4', date: dates[2], value: 4 },
    { label: 'THỨ 5', date: dates[3], value: 5 },
    { label: 'THỨ 6', date: dates[4], value: 6 },
    { label: 'THỨ 7', date: dates[5], value: 7 },
    { label: 'CHỦ NHẬT', date: dates[6], value: 0 },
  ]
})

const sessions = [
  { label: 'SÁNG', subLabel: '(4 Tiết)', value: 'Sang' },
  { label: 'CHIỀU', subLabel: '(4 Tiết)', value: 'Chieu' },
  { label: 'TỐI', subLabel: '(4 Tiết)', value: 'Toi' },
]

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

const getPeriodsLabel = (session, startTime, endTime) => {
  if (!startTime || !endTime) return ''
  const startMin = timeToMinutes(startTime)
  const endMin = timeToMinutes(endTime)
  
  let startTiet = 1
  let endTiet = 5
  
  if (session === 'Sang') {
    if (startMin >= 9 * 60) startTiet = 3
    else if (startMin >= 8 * 60 + 15) startTiet = 2
    else startTiet = 1
    
    if (endMin <= 10 * 60) endTiet = 3
    else if (endMin <= 11 * 60) endTiet = 4
    else endTiet = 5
  } else if (session === 'Chieu') {
    if (startMin >= 15 * 60) startTiet = 8
    else if (startMin >= 14 * 60) startTiet = 7
    else startTiet = 6
    
    if (endMin <= 15 * 60 + 30) endTiet = 8
    else if (endMin <= 16 * 60 + 30) endTiet = 9
    else endTiet = 10
  } else if (session === 'Toi') {
    if (startMin >= 19 * 60) startTiet = 12
    else startTiet = 11
    
    if (endMin <= 19 * 60 + 45) endTiet = 12
    else endTiet = 13
  }
  return `Tiết: ${startTiet} - ${endTiet}`
}

const getSchedulesForCell = (dayValue, sessionValue) => {
  return scheduleStore.schedules.filter(s => s.dayOfWeek === dayValue && s.session === sessionValue)
}

const validationErrors = ref({
  startTime: '',
  endTime: '',
})

const isFormValid = computed(() => {
  return formData.value.startTime.trim().length > 0 &&
         formData.value.endTime.trim().length > 0 &&
         formData.value.startTime < formData.value.endTime
})

watch(() => formData.value.startTime, (val) => {
  validationErrors.value.startTime = val.trim().length === 0 ? 'Giờ bắt đầu không được để trống' : ''
  validateTimeRange()
})

watch(() => formData.value.endTime, (val) => {
  validationErrors.value.endTime = val.trim().length === 0 ? 'Giờ kết thúc không được để trống' : ''
  validateTimeRange()
})

function validateTimeRange() {
  if (formData.value.startTime && formData.value.endTime && formData.value.startTime >= formData.value.endTime) {
    validationErrors.value.endTime = 'Giờ kết thúc phải sau giờ bắt đầu'
  } else if (formData.value.endTime) {
    validationErrors.value.endTime = ''
  }
}

function hasSchedule(day) {
  return scheduleStore.schedules.some(s => s.dayOfWeek === day)
}

function getSchedulesByDay(day) {
  return scheduleStore.schedules.filter(s => s.dayOfWeek === day)
}

function getDayBgColor(day) {
  const colors = {
    0: 'bg-rose-500/10 text-rose-600',
    2: 'bg-primary-container/10 text-primary-container',
    3: 'bg-sky-500/10 text-sky-600',
    4: 'bg-emerald-500/10 text-emerald-600',
    5: 'bg-amber-500/10 text-amber-600',
    6: 'bg-purple-500/10 text-purple-600',
    7: 'bg-teal-500/10 text-teal-600'
  }
  return colors[day] || 'bg-primary-container/10 text-primary-container'
}

function getSessionLabel(session) {
  const map = { Sang: 'Sáng', Chieu: 'Chiều', Toi: 'Tối' }
  return map[session] || session
}

function getSessionIcon(session) {
  const map = { Sang: 'wb_sunny', Chieu: 'cloud_queue', Toi: 'dark_mode' }
  return map[session] || 'schedule'
}

function getSessionBgColor(session) {
  const map = {
    Sang: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    Chieu: 'bg-sky-500/10 text-sky-600 border border-sky-500/20',
    Toi: 'bg-primary-container/10 text-primary-container border border-primary-container/20'
  }
  return map[session] || 'bg-white/40 text-on-surface-variant'
}

function getStatusLabel(status) {
  const map = { Opened: 'Đang tuyển sinh', InProgress: 'Đang học', Completed: 'Hoàn thành', Cancelled: 'Đã hủy' }
  return map[status] || status
}

function getStatusBadgeClass(status) {
  const map = { Opened: 'status-opened', InProgress: 'status-inprogress', Completed: 'status-completed', Cancelled: 'status-cancelled' }
  return map[status] || 'bg-white/40 text-on-surface-variant border border-white/60'
}

function openCreateDialog() {
  isEdit.value = false
  validationErrors.value = { startTime: '', endTime: '' }
  formData.value = { dayOfWeek: 2, session: 'Sang', startTime: '08:00', endTime: '10:00' }
  dialog.value = true
}

function openEditDialog(item) {
  isEdit.value = true
  validationErrors.value = { startTime: '', endTime: '' }
  formData.value = {
    scheduleId: item.scheduleId,
    dayOfWeek: item.dayOfWeek,
    session: item.session,
    startTime: item.startTime,
    endTime: item.endTime,
  }
  dialog.value = true
}

async function saveForm() {
  if (!isFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      await scheduleStore.updateSchedule(classId, formData.value.scheduleId, formData.value)
      showSnackbar('Cập nhật lịch học thành công', 'success')
    } else {
      await scheduleStore.createSchedule(classId, formData.value)
      showSnackbar('Thêm lịch học thành công', 'success')
    }
    dialog.value = false
    await scheduleStore.fetchSchedules(classId)
  } catch (e) {
    showSnackbar('Có lỗi xảy ra khi lưu lịch học', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(item) {
  deleteTarget.value = item
  deleteDialog.value = true
}

async function doDelete() {
  deleting.value = true
  try {
    await scheduleStore.deleteSchedule(classId, deleteTarget.value.scheduleId)
    showSnackbar('Đã xóa lịch học thành công', 'success')
    deleteDialog.value = false
    await scheduleStore.fetchSchedules(classId)
  } catch (e) {
    showSnackbar('Lỗi khi xóa lịch học', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  try {
    classInfo.value = await classStore.getClass(classId)
    await scheduleStore.fetchSchedules(classId)
  } catch (e) {
    showSnackbar('Lỗi tải thông tin lịch học', 'error')
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
