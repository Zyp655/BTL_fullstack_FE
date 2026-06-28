<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary-container">chat</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg text-primary-container tracking-tight">Yêu cầu hỗ trợ & Chuyển lớp</h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant mt-1">Tiếp nhận, phê duyệt yêu cầu chuyển lớp hoặc phản hồi từ học viên.</p>
        </div>
      </div>
    </section>

    <!-- Stats Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      <div v-for="stat in stats" :key="stat.label" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div :class="[stat.bgColor, stat.textColor, 'w-12 h-12 rounded-lg flex items-center justify-center shrink-0']">
          <span class="material-symbols-outlined">{{ stat.icon }}</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-label-caps font-label-caps text-on-surface-variant">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Filters and Searches -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      <!-- Search Input -->
      <div class="relative flex-1 w-full max-w-md">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          v-model="filters.search"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-10 py-2.5 text-body-sm text-primary focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/10 transition-all"
          placeholder="Tìm kiếm theo tên học viên..."
          type="text"
        />
        <button
          v-if="filters.search"
          @click="filters.search = ''"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <!-- Status Tabs -->
      <div class="flex space-x-1 p-1 bg-primary-container/[0.05] rounded-lg border border-primary-container/10 w-full md:w-auto overflow-x-auto">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="filters.status = tab.value"
          :class="[
            filters.status === tab.value
              ? 'bg-white text-primary-container shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-primary',
            'px-4 py-1.5 rounded-md text-[12px] transition-all whitespace-nowrap cursor-pointer'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </section>

    <!-- Support Requests List -->
    <section>
      <!-- Loading State -->
      <div v-if="loading" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-12 text-center flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-primary-container/30 border-t-primary-container rounded-full animate-spin mb-4"></div>
        <p class="text-body-sm font-semibold text-primary-container">Đang tải danh sách yêu cầu...</p>
      </div>

      <!-- Data List -->
      <div v-else-if="filteredMessages.length > 0" class="bg-white/70 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_8px_16px_rgba(0,31,63,0.03)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-primary-container/[0.05] border-b border-primary-container/10 text-primary-container font-semibold text-body-xs uppercase tracking-wider">
                <th class="py-4 px-6">Người gửi / Mã</th>
                <th class="py-4 px-4">Loại yêu cầu</th>
                <th class="py-4 px-4">Nội dung</th>
                <th class="py-4 px-4">Thời gian</th>
                <th class="py-4 px-4 text-center">Trạng thái</th>
                <th class="py-4 px-6 text-center w-[80px]">Chi tiết</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <template v-for="msg in filteredMessages" :key="msg.id">
                <!-- Main Row -->
                <tr 
                  @click="toggleMessageExpansion(msg.id)" 
                  class="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  :class="[
                    expandedMessageId === msg.id ? 'bg-slate-50/70' : '',
                    msg.status === 'Pending' ? 'border-l-2 border-l-amber-500' : 
                    msg.status === 'Resolved' ? 'border-l-2 border-l-emerald-500' : 'border-l-2 border-l-rose-500'
                  ]"
                >
                  <td class="py-4 px-6">
                    <div class="flex flex-col">
                      <span class="font-bold text-primary text-body-sm">{{ getRequesterName(msg) }}</span>
                      <span v-if="getRequesterRole(msg) === 'Giảng viên'" class="text-purple-600 text-[10px] font-semibold mt-0.5 flex items-center gap-0.5">
                        <span class="material-symbols-outlined text-[12px]">school</span>
                        Giảng viên
                      </span>
                      <span v-else class="text-primary-container text-[10px] font-medium mt-0.5">
                        Mã HV: HV-{{ String(msg.studentId).padStart(4, '0') }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <span v-if="getSupportTypeBadge(msg)" :class="[getSupportTypeBadge(msg).class, 'rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1 w-fit']">
                      <span class="material-symbols-outlined text-[13px]">
                        {{ getSupportTypeBadge(msg).label === 'Học phí' ? 'payments' :
                           getSupportTypeBadge(msg).label === 'Kỹ thuật' ? 'build' :
                           getSupportTypeBadge(msg).label === 'Ý kiến khác' ? 'campaign' :
                           getSupportTypeBadge(msg).label === 'Đổi lịch học' ? 'calendar_today' :
                           'swap_horiz' }}
                      </span>
                      {{ getSupportTypeBadge(msg).label }}
                    </span>
                  </td>
                  <td class="py-4 px-4 max-w-[280px]">
                    <div class="text-body-xs text-primary font-medium truncate" :title="getDisplayMessage(msg)">
                      {{ getDisplayMessage(msg) }}
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-1 text-body-xs text-on-surface-variant">
                      <span class="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{{ formatDateTime(msg.createdAt) }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-center">
                    <span :class="[getStatusClass(msg.status), 'status-badge text-[10px] font-bold']">
                      {{ getStatusLabel(msg.status) }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <span class="material-symbols-outlined text-primary-container/60 group-hover:text-primary transition-transform duration-300" :class="{'rotate-180': expandedMessageId === msg.id}">
                      keyboard_arrow_down
                    </span>
                  </td>
                </tr>

                <!-- Expanded Detail Row -->
                <tr v-if="expandedMessageId === msg.id" class="bg-slate-50/40">
                  <td colspan="6" class="p-6 border-t border-slate-100">
                    <div class="space-y-4 max-w-4xl mx-auto">
                      <!-- Message Body -->
                      <div class="space-y-1">
                        <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nội dung chi tiết yêu cầu</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-150 text-body-sm text-primary font-medium italic shadow-sm">
                          "{{ getDisplayMessage(msg) }}"
                        </div>
                      </div>

                      <!-- Transfer Class Detail Flow -->
                      <div v-if="msg.fromClassId && msg.toClassId" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-primary-container/5 p-4 rounded-xl border border-primary-container/10">
                        <div class="flex-1 min-w-0">
                          <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Lớp hiện tại</div>
                          <div class="font-semibold text-primary truncate" :title="msg.fromClassName">{{ msg.fromClassName }}</div>
                          <div class="text-body-xs text-on-surface-variant">ID: {{ msg.fromClassId }}</div>
                        </div>
                        <div class="flex items-center justify-center shrink-0 text-on-tertiary-container">
                          <span class="material-symbols-outlined text-[28px] rotate-90 sm:rotate-0">double_arrow</span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Lớp đăng ký chuyển</div>
                          <div class="font-semibold text-primary truncate" :title="msg.toClassName">{{ msg.toClassName }}</div>
                          <div class="text-body-xs text-on-surface-variant">ID: {{ msg.toClassId }}</div>
                        </div>
                      </div>

                      <!-- Rejection Reason (Admin Response) -->
                      <div v-if="msg.status === 'Rejected' && msg.adminResponse" class="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 text-body-sm text-error flex items-start gap-2">
                        <span class="material-symbols-outlined text-[18px] text-rose-600 mt-0.5 shrink-0">info</span>
                        <div>
                          <div class="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-0.5">Lý do từ chối</div>
                          <div class="font-medium text-rose-900">{{ msg.adminResponse }}</div>
                        </div>
                      </div>

                      <!-- Resolution Details (Admin Response / Change Details) -->
                      <div v-if="msg.status === 'Resolved'" class="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/15 text-body-sm text-emerald-800 space-y-2">
                        <div class="flex items-start gap-2">
                          <span class="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                          <div class="flex-1">
                            <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Chi tiết thay đổi / Kết quả xử lý</div>
                            
                            <!-- Class Transfer details -->
                            <div v-if="msg.fromClassId || msg.fromClassName" class="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg p-3 text-[12px] space-y-1 mt-1">
                              <div class="font-bold text-emerald-800 flex items-center gap-1">
                                <span class="material-symbols-outlined text-[15px]">swap_horiz</span>
                                Chi tiết chuyển lớp:
                              </div>
                              <div class="pl-4 font-semibold text-emerald-950">
                                • Từ lớp: <span class="text-slate-500">{{ msg.fromClassName || 'Chưa rõ' }}</span> <span v-if="msg.fromClassId">(ID: {{ msg.fromClassId }})</span>
                                <template v-if="msg.toClassName || msg.toClassId">
                                  <br/>
                                  • Sang lớp: <span class="text-emerald-700 font-bold">{{ msg.toClassName || 'Chưa rõ' }}</span> <span v-if="msg.toClassId">(ID: {{ msg.toClassId }})</span>
                                </template>
                                <template v-else>
                                  <br/>
                                  • Sang lớp: <span class="text-emerald-700 font-bold">Lớp thay thế (Đã cập nhật hệ thống)</span>
                                </template>
                              </div>
                            </div>

                            <!-- Reschedule Request details -->
                            <div v-else-if="parseRescheduleRequest(msg.message).isReschedule" class="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg p-3 text-[12px] space-y-1 mt-1">
                              <div class="font-bold text-emerald-800 flex items-center gap-1">
                                <span class="material-symbols-outlined text-[15px]">event_repeat</span>
                                Lịch thay đổi chi tiết:
                              </div>
                              <div class="pl-4 font-semibold text-emerald-950">
                                <div v-if="!parseRescheduleRequest(msg.message).isAddRequest">
                                  • Lịch cũ: <span class="text-slate-500 line-through">{{ parseRescheduleRequest(msg.message).currentSlot }}</span>
                                </div>
                                <div>
                                  • Lịch mới: <span class="text-emerald-700 font-bold">Thứ {{ formatDayOfWeek(parseRescheduleRequest(msg.message).proposedDay) }} ({{ parseRescheduleRequest(msg.message).proposedStartTime }} - {{ parseRescheduleRequest(msg.message).proposedEndTime }})</span>
                                </div>
                              </div>
                            </div>

                            <!-- General resolution label -->
                            <div v-else class="font-semibold text-emerald-900 mb-1">
                              Yêu cầu hỗ trợ đã được giải quyết hoàn tất.
                            </div>

                            <!-- Timetable interactive change log entries -->
                            <div v-if="parseAdminResponse(msg.adminResponse).logs.length > 0" class="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg p-3 text-[12px] space-y-1.5 mt-2">
                              <div class="font-bold text-emerald-800 flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-[15px]">settings_accessibility</span>
                                Nhật ký thay đổi hệ thống:
                              </div>
                              <ul class="list-disc pl-5 font-semibold text-emerald-950 space-y-1">
                                <li v-for="(log, idx) in parseAdminResponse(msg.adminResponse).logs" :key="idx">
                                  {{ log }}
                                </li>
                              </ul>
                            </div>
                            
                            <!-- Clean admin response text -->
                            <div v-if="parseAdminResponse(msg.adminResponse).text" class="text-body-xs text-emerald-800 bg-emerald-500/[0.04] p-2.5 rounded-lg border border-emerald-500/10 mt-2 italic font-semibold">
                              "{{ parseAdminResponse(msg.adminResponse).text }}"
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Bottom Action Buttons (for Pending) -->
                      <div v-if="msg.status === 'Pending'" class="flex justify-end gap-3 pt-3 border-t border-slate-250">
                        <button
                          @click.stop="rejectRequest(msg)"
                          :disabled="actioningId === msg.id"
                          class="px-4 py-2 rounded-lg border border-error/30 hover:bg-error/10 text-error font-semibold text-[13px] transition-colors flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <span class="material-symbols-outlined text-[18px]">close</span>
                          Từ chối
                        </button>
                        <button
                          v-if="msg.message && (msg.message.includes('[Yêu cầu đổi lịch học') || msg.message.includes('[Yêu cầu thêm lịch học'))"
                          @click.stop="openRescheduleApprovalModal(msg)"
                          :disabled="actioningId === msg.id"
                          class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary hover:shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <span class="material-symbols-outlined text-[18px]">done</span>
                          {{ msg.message.includes('[Yêu cầu thêm lịch học') ? 'Phê duyệt & Thêm lịch' : 'Phê duyệt & Đổi lịch' }}
                        </button>
                        <button
                          v-else-if="msg.fromClassId && msg.toClassId"
                          @click.stop="approveRequest(msg)"
                          :disabled="actioningId === msg.id"
                          class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary hover:shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <span v-if="actioningId === msg.id" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                          <span v-else class="material-symbols-outlined text-[18px]">done</span>
                          Phê duyệt &amp; Chuyển lớp
                        </button>
                        <button
                          v-else
                          @click.stop="openResolveModal(msg)"
                          :disabled="actioningId === msg.id"
                          class="px-4 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary hover:shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <span class="material-symbols-outlined text-[18px]">done</span>
                          Giải quyết yêu cầu
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-primary/30 text-[64px] mb-4">chat_bubble</span>
        <h3 class="font-title-md text-title-md font-bold text-primary mt-2">Không tìm thấy yêu cầu nào</h3>
        <p class="text-body-sm text-on-surface-variant mt-2">
          Hiện tại không có yêu cầu nào trùng khớp với bộ lọc của bạn.
        </p>
      </div>
    </section>

    <!-- Dialog: Admin chuyển lớp học cho học viên khi thiếu thông tin -->
    <teleport to="body">
      <div v-if="transferDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[20px] border border-white/40 shadow-2xl max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">sync_alt</span>
              Chuyển lớp &amp; Phê duyệt
            </h3>
            <button @click="transferDialog = false" class="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="bg-primary-container/5 p-4 rounded-xl border border-primary-container/10 text-body-sm space-y-1">
              <div>Học viên: <span class="font-bold text-primary-container">{{ transferStudentName }}</span></div>
              <div>Mã HV: <span class="font-semibold text-primary-container">HV-{{ String(transferStudentId).padStart(4, '0') }}</span></div>
            </div>

            <!-- Select Source Class (From Class) -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Lớp học hiện tại *</label>
              <div v-if="loadingEnrollments" class="flex items-center justify-center py-2 gap-2">
                <span class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></span>
                <span class="text-body-xs text-on-surface-variant">Đang tải danh sách lớp học...</span>
              </div>
              <div v-else-if="!transferFromClassId && studentEnrollments.length === 0" class="text-error text-body-sm font-semibold py-2">
                Học viên hiện tại không tham gia lớp học hoạt động nào.
              </div>
              <div v-else class="relative">
                <select
                  v-model="transferFromClassId"
                  :disabled="loadingEnrollments"
                  @change="handleFromClassChange"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option :value="null" disabled>-- Chọn lớp học nguồn --</option>
                  <option v-for="e in studentEnrollments" :key="e.classId" :value="e.classId">
                    {{ e.courseName || e.CourseName }} (Lớp: {{ e.className }})
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <!-- Select Target Class (To Class) -->
            <div class="space-y-1" v-if="transferFromClassId">
              <label class="text-body-sm font-semibold text-on-surface">Chọn lớp học thay thế *</label>
              <div v-if="loadingAlternativeClasses" class="flex items-center justify-center py-2 gap-2">
                <span class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></span>
                <span class="text-body-xs text-on-surface-variant">Đang tìm lớp học...</span>
              </div>
              <div v-else-if="alternativeClasses.length === 0" class="text-error text-body-sm font-semibold py-2">
                Không tìm thấy lớp học khác nào hoạt động cho khóa này.
              </div>
              <div v-else class="relative">
                <select
                  v-model="transferToClassId"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
              class="px-5 py-2.5 rounded-lg bg-transparent border border-outline-variant text-on-surface-variant font-semibold text-body-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="submitTransfer"
              :disabled="submittingTransfer || !transferFromClassId || !transferToClassId"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="submittingTransfer" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận &amp; Chuyển lớp
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Dialog: Admin nhập lý do từ chối -->
    <teleport to="body">
      <div v-if="rejectDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[20px] border border-white/40 shadow-2xl max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-title-md font-bold text-error flex items-center gap-2">
              <span class="material-symbols-outlined text-[24px]">cancel</span>
              Từ chối yêu cầu hỗ trợ
            </h3>
            <button @click="rejectDialog = false" class="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="bg-error/5 p-4 rounded-xl border border-error/10 text-body-sm space-y-1">
              <div>Người yêu cầu: <span class="font-bold text-primary-container">{{ rejectStudentName }}</span></div>
              <div>Yêu cầu: <span class="italic text-on-surface-variant">"{{ rejectMessageText }}"</span></div>
            </div>

            <!-- Input Rejection Reason -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Lý do từ chối *</label>
              <textarea
                v-model="rejectReason"
                rows="4"
                placeholder="Nhập lý do từ chối chi tiết..."
                class="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2.5 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="rejectDialog = false"
              class="px-5 py-2.5 rounded-lg bg-transparent border border-outline-variant text-on-surface-variant font-semibold text-body-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="submitReject"
              :disabled="submittingReject || !rejectReason.trim()"
              class="px-5 py-2.5 rounded-lg bg-error text-white font-semibold text-body-sm hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="submittingReject" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Admin Reschedule Approval Dialog Modal -->
    <teleport to="body">
      <div v-if="rescheduleApprovalDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full overflow-hidden animate-scale-in flex flex-col">
          <!-- Title -->
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">
                {{ isAddRequestState ? 'calendar_add_on' : 'edit_calendar' }}
              </span>
              {{ isAddRequestState ? 'Phê duyệt & Thêm lịch học' : 'Phê duyệt & Đổi lịch học' }}
            </h3>
            <button @click="rescheduleApprovalDialog = false" class="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4 text-left">
            <div class="bg-primary-container/5 p-4 rounded-xl border border-primary-container/10 text-body-sm space-y-1">
              <div class="flex items-center flex-wrap gap-2">
                <span>Yêu cầu từ:</span>
                <span class="font-bold text-primary-container">{{ rescheduleStudentName }}</span>
                <span v-if="rescheduleStudentRole === 'Giảng viên'" class="bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded-full px-2 py-0.5 text-[10px] font-semibold inline-flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">school</span>
                  Giảng viên
                </span>
              </div>
              <div v-if="rescheduleClassObj" class="flex items-center flex-wrap gap-2 text-xs text-slate-600 mt-1" style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
                <span class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 font-bold" style="background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 4px 10px; border-radius: 6px; font-weight: 700;">Lớp: {{ rescheduleClassObj.className }}</span>
                <span class="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 font-bold" style="background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 6px; font-weight: 700;">Môn: {{ rescheduleClassObj.courseName }}</span>
              </div>
              <div v-if="rescheduleReason" class="italic text-on-surface-variant mt-1">"{{ rescheduleReason }}"</div>
            </div>

            <!-- Select Schedule to Replace -->
            <div v-if="!isAddRequestState" class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Chọn buổi học muốn thay thế *</label>
              <div v-if="loadingRescheduleSchedules" class="flex items-center justify-center py-2 gap-2">
                <span class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></span>
                <span class="text-body-xs text-on-surface-variant">Đang tải lịch học của lớp...</span>
              </div>
              <div v-else-if="rescheduleSchedules.length === 0" class="text-error text-body-sm font-semibold py-2">
                Lớp học hiện tại không có buổi học cố định nào.
              </div>
              <div v-else class="relative">
                <select
                  v-model="selectedScheduleIdToReplace"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                >
                  <option :value="null" disabled>-- Chọn buổi học --</option>
                  <option v-for="s in rescheduleSchedules" :key="s.scheduleId" :value="s.scheduleId">
                    <span v-if="s.dayOfWeek !== 0">Thứ </span>{{ formatDayOfWeek(s.dayOfWeek) }}
                    <span v-if="getRescheduleDateLabel(s.dayOfWeek)"> ngày {{ getRescheduleDateLabel(s.dayOfWeek) }}</span>
                    ({{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }})
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <div v-if="!isAddRequestState" class="border-t border-dashed border-outline-variant/40 my-4"></div>

            <!-- Week Switcher inside Reschedule Modal -->
            <div class="flex items-center justify-between bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3 my-2">
              <span class="text-body-xs font-bold text-indigo-950 uppercase tracking-wide">Xem ngày áp dụng theo tuần:</span>
              <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm scale-90">
                <button @click="prevRescheduleWeek" class="px-2.5 py-1 hover:bg-slate-50 transition-colors flex items-center justify-center border-r border-slate-200 cursor-pointer">
                  <span class="material-symbols-outlined text-[16px] text-slate-600">chevron_left</span>
                </button>
                <div class="px-3 py-1 text-[11px] font-bold text-slate-700 bg-slate-50/50">
                  {{ formattedRescheduleWeekRange }}
                </div>
                <button @click="nextRescheduleWeek" class="px-2.5 py-1 hover:bg-slate-50 transition-colors flex items-center justify-center border-l border-slate-200 cursor-pointer">
                  <span class="material-symbols-outlined text-[16px] text-slate-600">chevron_right</span>
                </button>
              </div>
            </div>

            <div class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
              {{ isAddRequestState ? 'Chi tiết lịch học thêm mới:' : 'Cập nhật lịch học mới:' }}
            </div>

            <!-- Day of Week -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">
                {{ isAddRequestState ? 'Ngày học đề xuất *' : 'Ngày học mới *' }}
              </label>
              <div class="relative">
                <select
                  v-model="rescheduleProposedDay"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                >
                  <option :value="2">Thứ 2 (ngày {{ getRescheduleDateLabel(2) }})</option>
                  <option :value="3">Thứ 3 (ngày {{ getRescheduleDateLabel(3) }})</option>
                  <option :value="4">Thứ 4 (ngày {{ getRescheduleDateLabel(4) }})</option>
                  <option :value="5">Thứ 5 (ngày {{ getRescheduleDateLabel(5) }})</option>
                  <option :value="6">Thứ 6 (ngày {{ getRescheduleDateLabel(6) }})</option>
                  <option :value="7">Thứ 7 (ngày {{ getRescheduleDateLabel(7) }})</option>
                  <option :value="0">Chủ nhật (ngày {{ getRescheduleDateLabel(0) }})</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <!-- Session Options -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Buổi học *</label>
              <div class="relative">
                <select
                  v-model="rescheduleProposedSession"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="Sang">🌅 Sáng</option>
                  <option value="Chieu">☀️ Chiều</option>
                  <option value="Toi">🌙 Tối</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <!-- Start/End Time -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-on-surface">Giờ bắt đầu *</label>
                <input
                  v-model="rescheduleProposedStartTime"
                  type="time"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-on-surface">Giờ kết thúc *</label>
                <input
                  v-model="rescheduleProposedEndTime"
                  type="time"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <!-- Select Classroom -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Phòng học *</label>
              <div class="relative">
                <select
                  v-model="rescheduleProposedRoom"
                  class="w-full bg-white border border-outline-variant/60 rounded-lg appearance-none px-4 py-2.5 text-body-sm text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                >
                  <option :value="null" disabled>-- Chọn phòng học --</option>
                  <option 
                    v-for="r in availableRooms" 
                    :key="r.roomNumber" 
                    :value="r.roomNumber" 
                    :disabled="r.isMaintenance || isRoomOccupied(r.roomNumber, rescheduleProposedDay, rescheduleProposedStartTime, rescheduleProposedEndTime, rescheduleClassId)"
                  >
                    Phòng {{ r.roomNumber }}
                    <template v-if="r.isMaintenance"> (Bảo trì)</template>
                    <template v-else-if="isRoomOccupied(r.roomNumber, rescheduleProposedDay, rescheduleProposedStartTime, rescheduleProposedEndTime, rescheduleClassId)"> (Bận lịch lớp khác)</template>
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
              
              <!-- Room Conflict Warning -->
              <div v-if="rescheduleProposedRoom && isRoomOccupied(rescheduleProposedRoom, rescheduleProposedDay, rescheduleProposedStartTime, rescheduleProposedEndTime, rescheduleClassId)"
                   class="mt-1.5 text-red-600 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                <span class="material-symbols-outlined text-[15px] text-red-500">warning</span>
                <span>Phòng {{ rescheduleProposedRoom }} đang bận lịch học lớp khác vào khung giờ này!</span>
              </div>
            </div>

            <!-- Teacher Conflict Warning -->
            <div v-if="rescheduleClassObj && getTeacherConflictMessage(rescheduleClassObj.teacherId, rescheduleProposedDay, rescheduleProposedStartTime, rescheduleProposedEndTime, rescheduleClassId)" 
                 class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-start gap-2 mt-3 shadow-sm animate-pulse">
              <span class="material-symbols-outlined text-[16px] text-red-500 shrink-0 mt-0.5">warning</span>
              <span class="leading-relaxed">
                {{ getTeacherConflictMessage(rescheduleClassObj.teacherId, rescheduleProposedDay, rescheduleProposedStartTime, rescheduleProposedEndTime, rescheduleClassId) }}
              </span>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
            <button
              @click="rescheduleApprovalDialog = false"
              class="px-5 py-2.5 rounded-lg bg-transparent border border-outline-variant text-on-surface-variant font-semibold text-body-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="submitRescheduleApproval"
              :disabled="submittingRescheduleApproval || (!isAddRequestState && !selectedScheduleIdToReplace) || (rescheduleClassObj && getTeacherConflictMessage(rescheduleClassObj.teacherId, rescheduleProposedDay, rescheduleProposedStartTime, rescheduleProposedEndTime, rescheduleClassId)) || (rescheduleProposedRoom && isRoomOccupied(rescheduleProposedRoom, rescheduleProposedDay, rescheduleProposedStartTime, rescheduleProposedEndTime, rescheduleClassId))"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-body-sm hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span v-if="submittingRescheduleApproval" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Xác nhận &amp; {{ isAddRequestState ? 'Thêm lịch' : 'Đổi lịch' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Giant Interactive Timetable Dialog: Admin giải quyết yêu cầu -->
    <teleport to="body">
      <div v-if="resolveDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/95 backdrop-blur-[24px] border border-white/50 shadow-2xl max-w-[96vw] w-full h-[95vh] rounded-2xl overflow-hidden animate-scale-in flex flex-col" @dragover="handleGlobalDragOver">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between shrink-0 bg-primary-container/[0.02]">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[26px] text-primary">calendar_today</span>
              <div>
                <h3 class="font-headline-sm text-headline-sm font-bold text-primary-container">
                  Phân tích &amp; Giải quyết trùng lịch học: {{ resolveStudentName }}
                </h3>
                <p class="text-body-xs text-on-surface-variant mt-0.5">
                  Kéo thả để đổi lịch hoặc nhấp vào buổi học để chỉnh sửa thông tin chi tiết.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <!-- Week Navigation -->
              <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <button @click="prevWeek" class="px-3 py-1.5 hover:bg-slate-50 transition-colors flex items-center justify-center border-r border-slate-200 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px] text-slate-600">chevron_left</span>
                </button>
                <div class="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/50">
                  {{ weekLabel }}
                </div>
                <button @click="nextWeek" class="px-3 py-1.5 hover:bg-slate-50 transition-colors flex items-center justify-center border-l border-slate-200 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px] text-slate-600">chevron_right</span>
                </button>
              </div>

              <button @click="resolveDialog = false" class="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <!-- Modal Body Split Layout -->
          <div class="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
            <!-- Left Side: Huge Timetable Board -->
            <div class="flex-1 p-6 pb-24 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
              <!-- Student Request Summary Callout -->
              <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start animate-pulse-slow">
                <span class="material-symbols-outlined text-amber-600 mt-0.5">warning</span>
                <div>
                  <div class="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Yêu cầu từ {{ getRequesterRole({ message: resolveMessageText }) === 'Giảng viên' ? 'giảng viên' : 'học viên' }}:
                  </div>
                  <div class="text-body-sm font-semibold text-amber-950 mt-0.5">
                    "{{ getDisplayMessage({ message: resolveMessageText }) }}"
                  </div>
                </div>
              </div>

              <!-- Timetable Board Grid -->
              <div 
                class="border border-slate-200/80 rounded-xl overflow-x-auto shadow-sm bg-white min-w-[700px] custom-scrollbar"
                ref="timetableContainer"
              >
                <table class="w-full min-w-[1200px] border-collapse text-center table-fixed">
                  <thead>
                    <tr class="bg-[#1a7380] text-white">
                      <th class="py-3 px-2 font-bold text-xs border-r border-[#15626d] w-[12%]">BUỔI</th>
                      <th v-for="day in currentWeekDays" :key="day.value" class="py-3 px-2 font-bold text-xs border-r border-[#15626d]">
                        <div class="flex flex-col items-center gap-0.5">
                          <span>{{ day.label.toUpperCase() }}</span>
                          <span class="text-[10px] text-white/80 font-mono">{{ day.dateStr }}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="sess in sessions" 
                      :key="sess.value" 
                      class="border-b-4 border-slate-200 transition-colors"
                      :class="[
                        sess.value === 'Sang' ? 'bg-amber-500/[0.01]' :
                        sess.value === 'Chieu' ? 'bg-sky-500/[0.01]' : 'bg-indigo-500/[0.01]'
                      ]"
                    >
                      <!-- Row Header -->
                      <td 
                        class="py-6 px-2 border-r border-slate-200 font-bold text-xs align-middle text-center"
                        :class="[
                          sess.value === 'Sang' ? 'text-amber-700 bg-amber-500/5' :
                          sess.value === 'Chieu' ? 'text-sky-700 bg-sky-500/5' : 'text-indigo-700 bg-indigo-500/5'
                        ]"
                      >
                        <div class="flex flex-col items-center gap-1">
                          <span class="material-symbols-outlined text-[18px]">
                            {{ sess.value === 'Sang' ? 'wb_sunny' : sess.value === 'Chieu' ? 'light_mode' : 'dark_mode' }}
                          </span>
                          <div class="tracking-wider">{{ sess.label }}</div>
                          <div class="text-[9px] opacity-70 font-semibold">{{ sess.subLabel }}</div>
                        </div>
                      </td>
                      
                      <!-- Timetable Cells -->
                      <td 
                        v-for="day in currentWeekDays" 
                        :key="day.value"
                        class="p-2 border-r border-slate-250 align-middle min-h-[90px] transition-colors"
                        @dragover.prevent
                        @drop="handleDrop($event, day.value, sess.value)"
                        :class="{'bg-[#1a7380]/5': dragOverDay === day.value && dragOverSession === sess.value}"
                        @dragenter="dragOverDay = day.value; dragOverSession = sess.value"
                        @dragleave="dragOverDay = null; dragOverSession = null"
                      >
                        <div v-if="getResolveSchedulesForCell(day.value, sess.value, day.date).length > 0" class="space-y-2">
                          <div
                            v-for="s in getResolveSchedulesForCell(day.value, sess.value, day.date)"
                            :key="s.scheduleId"
                            draggable="true"
                            @dragstart="handleDragStart($event, s)"
                            @dragend="handleDragEnd"
                            @click="selectSlotForEdit(s)"
                            class="p-2.5 rounded-lg border text-center transition-all cursor-pointer relative active:scale-[0.98] group"
                            :class="[
                              hasConflict(s, day.date)
                                ? 'border-rose-400 bg-rose-50/80 text-rose-950 ring-2 ring-rose-500/10' + (s.classId === resolveFromClassId ? ' blink-conflict' : '')
                                : (s.classId === resolveFromClassId
                                    ? 'border-indigo-300 bg-indigo-50/70 text-indigo-950 target-pulse ring-2 ring-indigo-500/15'
                                    : 'border-slate-200 bg-slate-50 text-slate-700 opacity-80 hover:opacity-100')
                            ]"
                          >
                            <!-- Conflict warning badge -->
                            <div v-if="hasConflict(s, day.date)" class="text-rose-600 font-bold text-[10px] flex items-center justify-center gap-0.5 mb-1.5 uppercase tracking-wide">
                              <span class="material-symbols-outlined text-[12px] text-rose-600">warning</span>
                              Trùng lịch!
                            </div>
                            <!-- Target class badge when no conflict -->
                            <div v-else-if="s.classId === resolveFromClassId" class="text-indigo-600 font-bold text-[10px] flex items-center justify-center gap-0.5 mb-1.5 uppercase tracking-wide">
                              <span class="material-symbols-outlined text-[12px] text-indigo-600">calendar_today</span>
                              Cần xử lý
                            </div>
                            <!-- Course / Subject name -->
                            <div class="font-bold text-[13px] leading-tight text-primary-container truncate" :title="getCourseName(s.classId)">
                              {{ getCourseName(s.classId) }}
                            </div>
                            <!-- Class name -->
                            <div class="text-[10px] text-slate-500 font-semibold mt-1 truncate" :title="getClassName(s.classId)">
                              Lớp: {{ getClassName(s.classId) }}
                            </div>
                            <!-- Room -->
                            <div class="text-[10.5px] font-semibold mt-0.5 flex items-center justify-center gap-0.5 text-slate-500">
                              <span class="material-symbols-outlined text-[12px]">meeting_room</span>
                              {{ getClassRoom(s.classId) || 'N/A' }}
                            </div>
                            <!-- Period / Times -->
                            <div class="text-[10.5px] font-mono font-semibold mt-0.5 text-slate-500">
                              {{ s.startTime.substring(0, 5) }} - {{ s.endTime.substring(0, 5) }}
                            </div>

                            <!-- Drag Indicator Handle on Hover -->
                            <div class="absolute -top-1 -left-1 hidden group-hover:flex items-center justify-center bg-white border border-slate-200 rounded p-0.5 shadow-xs">
                              <span class="material-symbols-outlined text-[12px] text-slate-400 cursor-move">drag_indicator</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Right Side: Sidebar Editor Panel -->
            <div class="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-white/40 p-6 overflow-y-auto flex flex-col justify-between shrink-0 bg-white/50">
              <div class="space-y-5">
                <!-- Slot Editor -->
                <div v-if="selectedSlotEdit" class="space-y-4">
                  <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 class="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px]">edit_calendar</span>
                      Chỉnh sửa lịch &amp; môn học
                    </h4>
                    <button @click="selectedSlotEdit = null" class="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Đóng</button>
                  </div>

                  <!-- Slot Time Fields -->
                  <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
                    <div class="grid grid-cols-2 gap-2">
                      <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-600 uppercase">Thứ</label>
                        <select v-model="selectedSlotEdit.dayOfWeek" class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none">
                          <option v-for="d in weekDays" :key="d.value" :value="d.value">{{ d.label }}</option>
                        </select>
                      </div>
                      <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-600 uppercase">Buổi</label>
                        <select v-model="selectedSlotEdit.session" class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none">
                          <option v-for="opt in sessionOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
                        </select>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-600 uppercase">Bắt đầu</label>
                        <input v-model="selectedSlotEdit.startTime" type="time" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-600 uppercase">Kết thúc</label>
                        <input v-model="selectedSlotEdit.endTime" type="time" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none" />
                      </div>
                    </div>

                    <button @click="saveSlotSchedule" :disabled="savingSlotTime" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer">
                      <span v-if="savingSlotTime" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                      Lưu Lịch Học Buổi Này
                    </button>
                  </div>

                  <!-- Parent Class Fields -->
                  <div class="bg-primary-container/[0.02] border border-slate-200 p-4 rounded-xl space-y-3 text-left">
                    <h5 class="text-[11px] font-bold text-primary-container uppercase tracking-wide">Thông tin chi tiết môn học</h5>
                    
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-slate-500 uppercase">Tên lớp học</label>
                      <input v-model="selectedClassEdit.className" type="text" class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none" />
                    </div>

                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-slate-500 uppercase">Phòng học</label>
                      <select v-model="selectedClassEdit.room" class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none">
                        <option value="">Chưa xếp phòng</option>
                        <option v-for="r in availableRooms" :key="r.roomNumber" :value="r.roomNumber">
                          Phòng {{ r.roomNumber }}
                        </option>
                      </select>
                    </div>

                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-slate-500 uppercase">Giảng viên chính</label>
                      <select v-model="selectedClassEdit.teacherId" class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none">
                        <option :value="null">Chưa phân công</option>
                        <option v-for="t in teachers" :key="t.userId" :value="t.userId">
                          {{ t.fullName }}
                        </option>
                      </select>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Ngày bắt đầu</label>
                        <input v-model="selectedClassEdit.startDate" type="date" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Ngày kết thúc</label>
                        <input v-model="selectedClassEdit.endDate" type="date" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none" />
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-slate-500 uppercase">Sĩ số tối đa</label>
                      <input v-model.number="selectedClassEdit.maxStudents" type="number" class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none" />
                    </div>

                    <button @click="saveClassDetails" :disabled="savingClassDetails" class="w-full py-2 bg-primary-container hover:bg-primary text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer">
                      <span v-if="savingClassDetails" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                      Lưu Thông Tin Lớp Học
                    </button>
                  </div>
                </div>

                <!-- Empty Selection State Sidebar -->
                <div v-else class="bg-primary-container/[0.02] border border-primary-container/10 p-5 rounded-xl text-center space-y-2">
                  <span class="material-symbols-outlined text-[36px] text-primary/40">info</span>
                  <h4 class="text-xs font-bold text-primary-container">Xem chi tiết lịch &amp; môn học</h4>
                  <p class="text-[11px] text-on-surface-variant leading-relaxed">
                    Nhấp vào bất kỳ buổi học nào trên thời khóa biểu để xem thông tin chi tiết của ngày hôm đó, sửa giờ học, thay đổi giảng viên hoặc cập nhật phòng học.
                  </p>
                </div>

                <!-- Final Response / Resolve Input -->
                <div class="space-y-2 text-left pt-2 border-t border-slate-100">
                  <label class="text-body-sm font-bold text-slate-700">Phản hồi của Admin gửi Học viên (Tùy chọn)</label>
                  <textarea
                    v-model="resolveResponse"
                    rows="3"
                    placeholder="Nhập phản hồi kết quả giải quyết..."
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none transition-all"
                  ></textarea>
                </div>
              </div>

              <!-- Final Resolve Actions -->
              <div class="pt-4 flex gap-2">
                <button
                  @click="resolveDialog = false"
                  class="flex-1 py-2.5 rounded-lg border border-slate-200 text-on-surface-variant font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  @click="submitResolve"
                  :disabled="submittingResolve"
                  class="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                >
                  <span v-if="submittingResolve" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                  <span v-else class="material-symbols-outlined text-[15px]">task_alt</span>
                  Xác nhận giải quyết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue'
import api from '../../services/api'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useAuthStore } from '../../stores'

const showSnackbar = inject('showSnackbar')

const loading = ref(true)
const messages = ref([])
const actioningId = ref(null)

const expandedMessageId = ref(null)
function toggleMessageExpansion(id) {
  if (expandedMessageId.value === id) {
    expandedMessageId.value = null
  } else {
    expandedMessageId.value = id
  }
}

// Schedule change request states
const rescheduleApprovalDialog = ref(false)
const rescheduleSchedules = ref([])
const loadingRescheduleSchedules = ref(false)
const selectedScheduleIdToReplace = ref(null)
const rescheduleProposedDay = ref(2)
const rescheduleProposedSession = ref('Sang')
const rescheduleProposedStartTime = ref('08:00')
const rescheduleProposedEndTime = ref('10:00')
const rescheduleReason = ref('')
const rescheduleClassId = ref(null)
const rescheduleMessageId = ref(null)
const rescheduleStudentName = ref('')
const rescheduleStudentRole = ref('Học viên')
const submittingRescheduleApproval = ref(false)
const isAddRequestState = ref(false)
const rescheduleClassObj = ref(null)
const rescheduleProposedRoom = ref(null)
const allSystemClasses = ref([])
const rescheduleMessageDate = ref(null)

// Tự động cập nhật giờ học khi đổi Buổi học (Sáng / Chiều / Tối)
watch(rescheduleProposedSession, (newVal) => {
  if (newVal === 'Sang') {
    rescheduleProposedStartTime.value = '08:00'
    rescheduleProposedEndTime.value = '10:00'
  } else if (newVal === 'Chieu') {
    rescheduleProposedStartTime.value = '14:00'
    rescheduleProposedEndTime.value = '16:00'
  } else if (newVal === 'Toi') {
    rescheduleProposedStartTime.value = '18:00'
    rescheduleProposedEndTime.value = '20:00'
  }
})

function parseRescheduleRequest(message) {
  const result = {
    isReschedule: false,
    isAddRequest: false,
    className: '',
    courseName: '',
    currentSlot: '',
    proposedDay: 2,
    proposedSession: 'Sang',
    proposedStartTime: '08:00',
    proposedEndTime: '10:00',
    reason: ''
  }
  
  if (!message) return result
  
  if (message.includes('[Yêu cầu đổi lịch học') || message.includes('[Yêu cầu thêm lịch học')) {
    result.isReschedule = true
    if (message.includes('[Yêu cầu thêm lịch học')) {
      result.isAddRequest = true
    }
    const lines = message.split('\n')
    for (const line of lines) {
      if (line.startsWith('Lớp:')) {
        result.className = line.replace('Lớp:', '').trim()
      } else if (line.startsWith('Môn học:')) {
        result.courseName = line.replace('Môn học:', '').trim()
      } else if (line.startsWith('Lịch hiện tại cần đổi:')) {
        result.currentSlot = line.replace('Lịch hiện tại cần đổi:', '').trim()
      } else if (line.startsWith('Lịch đề xuất mới:') || line.startsWith('Lịch đề xuất thêm mới:')) {
        const details = line.replace('Lịch đề xuất mới:', '').replace('Lịch đề xuất thêm mới:', '').trim()
        // Extract proposed day
        if (details.toLowerCase().includes('chủ nhật')) {
          result.proposedDay = 0
        } else {
          const dayMatch = details.match(/Thứ\s+(\d)/i)
          if (dayMatch) {
            result.proposedDay = parseInt(dayMatch[1])
          }
        }
        
        // Extract session
        if (details.includes('Buổi Sáng') || details.toLowerCase().includes('buổi sáng')) result.proposedSession = 'Sang'
        else if (details.includes('Buổi Chiều') || details.toLowerCase().includes('buổi chiều')) result.proposedSession = 'Chieu'
        else if (details.includes('Buổi Tối') || details.toLowerCase().includes('buổi tối')) result.proposedSession = 'Toi'
        
        // Extract start/end times
        const timeMatch = details.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/)
        if (timeMatch) {
          result.proposedStartTime = timeMatch[1]
          result.proposedEndTime = timeMatch[2]
        }
      } else if (line.startsWith('Lý do:')) {
        result.reason = line.replace('Lý do:', '').trim()
      }
    }
  }
  return result
}

function getRequesterName(msg) {
  if (msg.message) {
    const match = msg.message.match(/\[Yêu cầu\s+.*?\s+từ\s+([^\]]+)\]/)
    if (match && match[1]) {
      const sender = match[1] // e.g. "Giảng viên (Lê Thị Hoa)" or "Học viên (Phạm Văn Dũng)"
      const nameMatch = sender.match(/\(([^)]+)\)/)
      if (nameMatch && nameMatch[1]) {
        return nameMatch[1] // "Lê Thị Hoa" or "Phạm Văn Dũng"
      }
      return sender
    }
    const oldTeacherMatch = msg.message.match(/\(Gửi bởi Giảng viên:\s*([^)]+)\)/)
    if (oldTeacherMatch && oldTeacherMatch[1]) {
      return oldTeacherMatch[1]
    }
  }
  return msg.studentName
}

function getRequesterRole(msg) {
  if (msg.message) {
    const match = msg.message.match(/\[Yêu cầu\s+.*?\s+từ\s+([^\]]+)\]/)
    if (match && match[1]) {
      const sender = match[1] // e.g. "Giảng viên (Lê Thị Hoa)" or "Học viên (Phạm Văn Dũng)"
      if (sender.startsWith('Giảng viên')) {
        return 'Giảng viên'
      }
      if (sender.startsWith('Học viên')) {
        return 'Học viên'
      }
    }
    if (msg.message.includes('(Gửi bởi Giảng viên:')) {
      return 'Giảng viên'
    }
  }
  return 'Học viên'
}

function isDateRangeOverlapping(start1, end1, start2, end2) {
  if (!start1 || !end1 || !start2 || !end2) return true
  const s1 = new Date(start1).setHours(0,0,0,0)
  const e1 = new Date(end1).setHours(0,0,0,0)
  const s2 = new Date(start2).setHours(0,0,0,0)
  const e2 = new Date(end2).setHours(0,0,0,0)
  return !(s1 > e2 || s2 > e1)
}

function getRescheduleTargetDate(dayOfWeek) {
  if (!rescheduleMessageDate.value) return null
  const baseDate = new Date(rescheduleMessageDate.value)
  const jsDay = baseDate.getDay()
  const monday = new Date(baseDate)
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay
  monday.setDate(baseDate.getDate() + diffToMonday)
  
  const dayVal = parseInt(dayOfWeek)
  const offset = dayVal === 0 ? 6 : dayVal - 2
  const targetDate = new Date(monday)
  targetDate.setDate(monday.getDate() + offset)
  targetDate.setHours(0,0,0,0)
  return targetDate
}

function getTeacherConflictMessage(teacherId, dayOfWeek, startTime, endTime, excludeClassId) {
  if (!teacherId || !startTime || !endTime) return null
  const propStart = timeToMinutes(startTime)
  const propEnd = timeToMinutes(endTime)
  const targetExcludeId = excludeClassId && typeof excludeClassId === 'object' && 'value' in excludeClassId ? excludeClassId.value : excludeClassId
  const currentTeacherName = rescheduleClassObj.value?.teacherName
  const targetDate = getRescheduleTargetDate(dayOfWeek)
  const compareDay = parseInt(dayOfWeek)
  
  for (const c of allSystemClasses.value) {
    if (c.classId === targetExcludeId) continue
    if (c.status !== 'Opened' && c.status !== 'InProgress') continue
    if (c.teacherId !== teacherId && c.teacherId2 !== teacherId) continue
    
    // Tránh xung đột do trùng lặp ID trong dữ liệu mẫu (Seeded duplicates) bằng cách so khớp tên giảng viên
    if (currentTeacherName && c.teacherName !== currentTeacherName && c.teacherName2 !== currentTeacherName) continue
    
    // Chỉ tính xung đột nếu ngày học cụ thể của buổi học được đề xuất nằm trong thời gian hoạt động của lớp c
    if (targetDate && c.startDate && c.endDate) {
      const start = new Date(c.startDate)
      const end = new Date(c.endDate)
      start.setHours(0,0,0,0)
      end.setHours(0,0,0,0)
      if (targetDate < start || targetDate > end) continue
    }
    
    // Chỉ tính xung đột nếu hai lớp có khoảng thời gian vận hành (StartDate -> EndDate) giao thoa nhau
    if (!isDateRangeOverlapping(rescheduleClassObj.value?.startDate, rescheduleClassObj.value?.endDate, c.startDate, c.endDate)) continue
    
    if (c.schedules) {
      for (const s of c.schedules) {
        if (parseInt(s.dayOfWeek) === compareDay) {
          const sStart = timeToMinutes(s.startTime)
          const sEnd = timeToMinutes(s.endTime)
          if (propStart < sEnd && sStart < propEnd) {
            return `Giảng viên đã có lịch dạy ở lớp ${c.className} (${s.startTime.substring(0,5)} - ${s.endTime.substring(0,5)})`
          }
        }
      }
    }
  }
  return null
}

function isRoomOccupied(roomNumber, dayOfWeek, startTime, endTime, excludeClassId) {
  if (!roomNumber || !startTime || !endTime) return false
  const propStart = timeToMinutes(startTime)
  const propEnd = timeToMinutes(endTime)
  const targetExcludeId = excludeClassId && typeof excludeClassId === 'object' && 'value' in excludeClassId ? excludeClassId.value : excludeClassId
  const targetDate = getRescheduleTargetDate(dayOfWeek)
  const compareDay = parseInt(dayOfWeek)
  
  for (const c of allSystemClasses.value) {
    if (c.classId === targetExcludeId) continue
    if (c.status !== 'Opened' && c.status !== 'InProgress') continue
    if (c.room !== roomNumber) continue
    
    // Chỉ tính trùng phòng nếu ngày học cụ thể của buổi học được đề xuất nằm trong thời gian hoạt động của lớp c
    if (targetDate && c.startDate && c.endDate) {
      const start = new Date(c.startDate)
      const end = new Date(c.endDate)
      start.setHours(0,0,0,0)
      end.setHours(0,0,0,0)
      if (targetDate < start || targetDate > end) continue
    }
    
    // Chỉ tính trùng phòng nếu hai lớp có khoảng thời gian vận hành (StartDate -> EndDate) giao thoa nhau
    if (!isDateRangeOverlapping(rescheduleClassObj.value?.startDate, rescheduleClassObj.value?.endDate, c.startDate, c.endDate)) continue
    
    if (c.schedules) {
      for (const s of c.schedules) {
        if (parseInt(s.dayOfWeek) === compareDay) {
          const sStart = timeToMinutes(s.startTime)
          const sEnd = timeToMinutes(s.endTime)
          if (propStart < sEnd && sStart < propEnd) {
            return true
          }
        }
      }
    }
  }
  return false
}

async function fetchAllSystemClasses() {
  try {
    const res = await api.get('/api/v1/classes', { params: { pageSize: 250 } })
    allSystemClasses.value = res.data?.items || res.data || []
  } catch (err) {
    console.error('Error fetching all system classes:', err)
  }
}

const formattedRescheduleWeekRange = computed(() => {
  if (!rescheduleMessageDate.value) return ''
  const baseDate = new Date(rescheduleMessageDate.value)
  const jsDay = baseDate.getDay()
  const monday = new Date(baseDate)
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay
  monday.setDate(baseDate.getDate() + diffToMonday)
  
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  
  const formatNum = (num) => String(num).padStart(2, '0')
  return `${formatNum(monday.getDate())}/${formatNum(monday.getMonth() + 1)} - ${formatNum(sunday.getDate())}/${formatNum(sunday.getMonth() + 1)}/${sunday.getFullYear()}`
})

function prevRescheduleWeek() {
  if (!rescheduleMessageDate.value) return
  const d = new Date(rescheduleMessageDate.value)
  d.setDate(d.getDate() - 7)
  rescheduleMessageDate.value = d
}

function nextRescheduleWeek() {
  if (!rescheduleMessageDate.value) return
  const d = new Date(rescheduleMessageDate.value)
  d.setDate(d.getDate() + 7)
  rescheduleMessageDate.value = d
}

function getRescheduleDateLabel(dayOfWeek) {
  if (!rescheduleMessageDate.value) return ''
  const baseDate = new Date(rescheduleMessageDate.value)
  const jsDay = baseDate.getDay()
  const monday = new Date(baseDate)
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay
  monday.setDate(baseDate.getDate() + diffToMonday)
  
  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 2
  const targetDate = new Date(monday)
  targetDate.setDate(monday.getDate() + offset)
  
  const formatNum = (num) => String(num).padStart(2, '0')
  return `${formatNum(targetDate.getDate())}/${formatNum(targetDate.getMonth() + 1)}`
}

async function openRescheduleApprovalModal(msg) {
  const parsed = parseRescheduleRequest(msg.message)
  rescheduleMessageId.value = msg.id
  rescheduleStudentName.value = getRequesterName(msg)
  rescheduleStudentRole.value = getRequesterRole(msg)
  rescheduleReason.value = parsed.reason
  rescheduleProposedDay.value = parsed.proposedDay
  rescheduleProposedSession.value = parsed.proposedSession
  rescheduleProposedStartTime.value = parsed.proposedStartTime
  rescheduleProposedEndTime.value = parsed.proposedEndTime
  selectedScheduleIdToReplace.value = null
  rescheduleSchedules.value = []
  isAddRequestState.value = parsed.isAddRequest
  
  rescheduleMessageDate.value = msg.createdAt ? new Date(msg.createdAt) : new Date()
  rescheduleClassObj.value = null
  rescheduleProposedRoom.value = null
  rescheduleApprovalDialog.value = true
  
  // Load classroom occupancy data
  await fetchAllSystemClasses()

  rescheduleClassId.value = msg.fromClassId
  if (!rescheduleClassId.value && parsed.className) {
    const foundClass = allSystemClasses.value.find(c => c.className === parsed.className)
    if (foundClass) {
      rescheduleClassId.value = foundClass.classId
    }
  }
  
  if (rescheduleClassId.value) {
    loadingRescheduleSchedules.value = true
    try {
      const classRes = await api.get(`/api/v1/classes/${rescheduleClassId.value}`)
      rescheduleClassObj.value = classRes.data
      rescheduleProposedRoom.value = classRes.data?.room || null
      
      if (!parsed.isAddRequest) {
        const res = await api.get(`/api/v1/classes/${rescheduleClassId.value}/schedules`)
        rescheduleSchedules.value = res.data || []
        
        // Auto-select a slot matching parsed.currentSlot if possible
        if (rescheduleSchedules.value.length > 0) {
          const matchingSlot = rescheduleSchedules.value.find(s => {
            const formatted = `Thứ ${formatDayOfWeek(s.dayOfWeek)} (${s.startTime} - ${s.endTime})`.toLowerCase()
            return formatted.includes(parsed.currentSlot.toLowerCase())
          })
          selectedScheduleIdToReplace.value = matchingSlot ? matchingSlot.scheduleId : rescheduleSchedules.value[0].scheduleId
        }
      }
    } catch (e) {
      console.error('Lỗi khi tải lịch học hiện tại:', e)
      showSnackbar('Không thể tải lịch học của lớp này', 'error')
    } finally {
      loadingRescheduleSchedules.value = false
    }
  }
}

async function submitRescheduleApproval() {
  if ((!isAddRequestState.value && !selectedScheduleIdToReplace.value) || !rescheduleClassId.value || !rescheduleMessageId.value) return
  submittingRescheduleApproval.value = true
  try {
    let logText = ''
    const targetRoom = rescheduleProposedRoom.value
    const originalRoom = rescheduleClassObj.value?.room

    // 1. Tạm thời đưa phòng học về null để tránh xung đột lịch vòng lặp (vừa đổi giờ, vừa đổi phòng)
    if (rescheduleClassObj.value) {
      rescheduleClassObj.value.room = null
      rescheduleClassObj.value.id = rescheduleClassId.value
      await api.put(`/api/v1/classes/${rescheduleClassId.value}`, rescheduleClassObj.value)
    }

    // 2. Tiến hành cập nhật/thêm lịch học mới
    if (isAddRequestState.value) {
      await api.post(`/api/v1/classes/${rescheduleClassId.value}/schedules`, {
        dayOfWeek: rescheduleProposedDay.value,
        session: rescheduleProposedSession.value,
        startTime: rescheduleProposedStartTime.value,
        endTime: rescheduleProposedEndTime.value
      })
      logText = `Thêm lịch học mới cho lớp: Thứ ${formatDayOfWeek(rescheduleProposedDay.value)} (${rescheduleProposedStartTime.value} - ${rescheduleProposedEndTime.value})`
    } else {
      await api.put(`/api/v1/classes/${rescheduleClassId.value}/schedules/${selectedScheduleIdToReplace.value}`, {
        dayOfWeek: rescheduleProposedDay.value,
        session: rescheduleProposedSession.value,
        startTime: rescheduleProposedStartTime.value,
        endTime: rescheduleProposedEndTime.value
      })
      const matchingSlot = rescheduleSchedules.value.find(s => s.scheduleId === selectedScheduleIdToReplace.value)
      const oldSlotText = matchingSlot ? `Thứ ${formatDayOfWeek(matchingSlot.dayOfWeek)} (${matchingSlot.startTime.substring(0,5)} - ${matchingSlot.endTime.substring(0,5)})` : 'Chưa rõ'
      logText = `Đổi lịch học từ [${oldSlotText}] sang [Thứ ${formatDayOfWeek(rescheduleProposedDay.value)} (${rescheduleProposedStartTime.value} - ${rescheduleProposedEndTime.value})]`
    }

    // 3. Gán phòng học mới (đã được kiểm tra trống ở khung giờ mới)
    if (rescheduleClassObj.value && targetRoom) {
      rescheduleClassObj.value.room = targetRoom
      await api.put(`/api/v1/classes/${rescheduleClassId.value}`, rescheduleClassObj.value)
      if (originalRoom !== targetRoom) {
        logText += ` (Đồng thời đổi phòng từ "${originalRoom || 'Chưa xếp'}" sang "Phòng ${targetRoom}")`
      }
    }
    
    // 4. Resolve the support request in StudentService with log
    await api.post(`/api/v1/support-messages/${rescheduleMessageId.value}/resolve`, {
      adminResponse: `[Nhật ký thay đổi]\n• ${logText}`
    })
    
    const successText = isAddRequestState.value ? 'Phê duyệt và thêm lịch học thành công!' : 'Phê duyệt và đổi lịch học thành công!'
    showSnackbar(successText, 'success')
    rescheduleApprovalDialog.value = false
    await fetchMessages()
  } catch (e) {
    console.error('Lỗi khi phê duyệt đổi lịch:', e)
    const errText = isAddRequestState.value ? 'Có lỗi xảy ra khi phê duyệt thêm lịch' : 'Có lỗi xảy ra khi phê duyệt đổi lịch'
    let errorMsg = errText
    if (e.response?.data) {
      if (typeof e.response.data === 'string') {
        errorMsg = e.response.data
      } else {
        errorMsg = e.response.data.detail || e.response.data.message || e.response.data.title || errText
      }
    }
    showSnackbar(errorMsg, 'error')
  } finally {
    submittingRescheduleApproval.value = false
  }
}

// Admin Transfer Dialog State
const transferDialog = ref(false)
const transferStudentId = ref(null)
const transferStudentName = ref('')
const transferFromClassId = ref(null)
const transferToClassId = ref(null)
const transferActiveMessageId = ref(null)
const studentEnrollments = ref([])
const loadingEnrollments = ref(false)
const alternativeClasses = ref([])
const loadingAlternativeClasses = ref(false)
const selectedAlternativeClassSchedules = ref([])
const submittingTransfer = ref(false)
const selectedCourseId = ref(null)

// Admin Reject Dialog State
const rejectDialog = ref(false)
const rejectStudentName = ref('')
const rejectMessageText = ref('')
const rejectReason = ref('')
const rejectActiveMessageId = ref(null)
const submittingReject = ref(false)

// Admin Resolve Dialog State
const resolveDialog = ref(false)
const resolveStudentName = ref('')
const resolveMessageText = ref('')
const resolveResponse = ref('')
const resolveActiveMessageId = ref(null)
const submittingResolve = ref(false)

// Timetable variables
const resolveFromClassId = ref(null)
const resolveToClassId = ref(null)
const timetableSchedules = ref([])
const timetableClasses = ref({})
const loadingTimetable = ref(false)

const teachers = ref([])
const availableRooms = ref([])

const draggedSchedule = ref(null)
const dragOverDay = ref(null)
const dragOverSession = ref(null)

const timetableContainer = ref(null)
const isDragging = ref(false)

const selectedSlotEdit = ref(null)
const selectedClassEdit = ref(null)
const savingSlotTime = ref(false)
const savingClassDetails = ref(false)

const sessionChangesLog = ref([])

function parseAdminResponse(response) {
  if (!response) return { text: '', logs: [] }
  if (response.includes('[Nhật ký thay đổi]')) {
    const parts = response.split('[Nhật ký thay đổi]')
    const text = parts[0].trim()
    const logs = parts[1].trim().split('\n').map(line => line.replace(/^•\s*/, '').trim()).filter(Boolean)
    return { text, logs }
  }
  return { text: response, logs: [] }
}

const weekDays = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 0 },
]

const currentWeekDate = ref(new Date())

const currentWeekDays = computed(() => {
  const curr = new Date(currentWeekDate.value)
  const day = curr.getDay()
  const diff = curr.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(curr.setDate(diff))
  
  return weekDays.map((wd, idx) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + idx)
    return {
      ...wd,
      date: d,
      dateStr: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
    }
  })
})

const weekLabel = computed(() => {
  if (currentWeekDays.value.length === 0) return ''
  const start = currentWeekDays.value[0].date
  const end = currentWeekDays.value[6].date
  const d1 = `${String(start.getDate()).padStart(2,'0')}/${String(start.getMonth()+1).padStart(2,'0')}`
  const d2 = `${String(end.getDate()).padStart(2,'0')}/${String(end.getMonth()+1).padStart(2,'0')}`
  return `${d1} - ${d2}`
})

function prevWeek() {
  const d = new Date(currentWeekDate.value)
  d.setDate(d.getDate() - 7)
  currentWeekDate.value = d
}

function nextWeek() {
  const d = new Date(currentWeekDate.value)
  d.setDate(d.getDate() + 7)
  currentWeekDate.value = d
}

const sessionOptions = [
  { title: '🌅 Sáng', value: 'Sang' },
  { title: '☀️ Chiều', value: 'Chieu' },
  { title: '🌙 Tối', value: 'Toi' },
]

const sessions = [
  { label: 'SÁNG', subLabel: '(4 Tiết)', value: 'Sang' },
  { label: 'CHIỀU', subLabel: '(4 Tiết)', value: 'Chieu' },
  { label: 'TỐI', subLabel: '(4 Tiết)', value: 'Toi' },
]

const filters = ref({
  search: '',
  status: 'All'
})

const statusTabs = [
  { label: 'Tất cả', value: 'All' },
  { label: 'Chờ duyệt', value: 'Pending' },
  { label: 'Đã phê duyệt', value: 'Resolved' },
  { label: 'Đã từ chối', value: 'Rejected' }
]

const stats = computed(() => {
  return [
    {
      label: 'Tổng yêu cầu',
      value: messages.value.length,
      icon: 'forum',
      bgColor: 'bg-primary-container/10',
      textColor: 'text-primary-container'
    },
    {
      label: 'Chờ xử lý',
      value: messages.value.filter(m => m.status === 'Pending').length,
      icon: 'pending_actions',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600'
    },
    {
      label: 'Đã phê duyệt',
      value: messages.value.filter(m => m.status === 'Resolved').length,
      icon: 'done_all',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600'
    },
    {
      label: 'Đã từ chối',
      value: messages.value.filter(m => m.status === 'Rejected').length,
      icon: 'cancel',
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-600'
    }
  ]
})

const filteredMessages = computed(() => {
  let list = messages.value

  // Status Filter
  if (filters.value.status !== 'All') {
    list = list.filter(m => m.status === filters.value.status)
  }

  // Search filter (by studentName, requesterName, or message)
  const q = filters.value.search.trim().toLowerCase()
  if (q) {
    list = list.filter(m => 
      getRequesterName(m).toLowerCase().includes(q) || 
      m.studentName.toLowerCase().includes(q) || 
      (m.message && m.message.toLowerCase().includes(q))
    )
  }

  return list
})

async function fetchMessages() {
  loading.value = true
  try {
    const res = await api.get('/api/v1/support-messages')
    messages.value = res.data || []
  } catch (e) {
    console.error('Error fetching support messages:', e)
    showSnackbar('Lỗi tải danh sách yêu cầu hỗ trợ', 'error')
  } finally {
    loading.value = false
  }
}

async function approveRequest(msg) {
  if (msg.fromClassId && msg.toClassId) {
    actioningId.value = msg.id
    try {
      // Call transfer API to actually move the student to the new class
      await api.post('/api/v1/enrollments/transfer', {
        studentId: msg.studentId,
        fromClassId: msg.fromClassId,
        toClassId: msg.toClassId
      })

      // Resolve support request with logged details
      await api.post(`/api/v1/support-messages/${msg.id}/resolve`, {
        adminResponse: `[Nhật ký thay đổi]\n• Đã chuyển học viên sang lớp ${msg.toClassName}`
      })
      showSnackbar(`Đã phê duyệt và chuyển lớp thành công cho học viên ${msg.studentName}!`, 'success')
      await fetchMessages()
    } catch (e) {
      console.error(e)
      showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt', 'error')
    } finally {
      actioningId.value = null
    }
  } else {
    openAdminTransferModal(msg)
  }
}

async function openAdminTransferModal(msg) {
  transferActiveMessageId.value = msg.id
  transferStudentId.value = msg.studentId
  transferStudentName.value = msg.studentName
  transferFromClassId.value = msg.fromClassId || null
  transferToClassId.value = msg.toClassId || null
  studentEnrollments.value = []
  alternativeClasses.value = []
  selectedAlternativeClassSchedules.value = []
  selectedCourseId.value = null
  
  transferDialog.value = true
  
  if (msg.fromClassId) {
    loadingEnrollments.value = true
    try {
      const classRes = await api.get(`/api/v1/classes/${msg.fromClassId}`)
      const cls = classRes.data
      if (cls) {
        studentEnrollments.value = [{
          classId: cls.classId,
          className: cls.className,
          courseName: cls.courseName,
          CourseName: cls.courseName,
          courseId: cls.courseId
        }]
        selectedCourseId.value = cls.courseId
        await fetchAlternativeClasses(cls.courseId, msg.fromClassId)
      }
    } catch (e) {
      console.error(e)
      showSnackbar('Lỗi khi tải thông tin lớp học hiện tại', 'error')
    } finally {
      loadingEnrollments.value = false
    }
  } else {
    loadingEnrollments.value = true
    try {
      const res = await api.get(`/api/v1/students/${msg.studentId}/enrollments`)
      studentEnrollments.value = (res.data || []).filter(e => e.classId > 0 && (e.status === 'Active' || e.status === 'DangHoc'))
    } catch (e) {
      console.error(e)
      showSnackbar('Lỗi khi tải danh sách lớp học của học viên', 'error')
    } finally {
      loadingEnrollments.value = false
    }
  }
}

async function fetchAlternativeClasses(courseId, fromClassId) {
  loadingAlternativeClasses.value = true
  try {
    const res = await api.get('/api/v1/classes', {
      params: { courseId: courseId, pageSize: 100 }
    })
    alternativeClasses.value = (res.data?.items || []).filter(
      c => c.classId !== fromClassId && (c.status === 'Opened' || c.status === 'InProgress')
    )
  } catch (e) {
    console.error(e)
    showSnackbar('Lỗi tải danh sách lớp học thay thế', 'error')
  } finally {
    loadingAlternativeClasses.value = false
  }
}

async function handleFromClassChange() {
  transferToClassId.value = null
  selectedAlternativeClassSchedules.value = []
  alternativeClasses.value = []
  
  if (!transferFromClassId.value) {
    selectedCourseId.value = null
    return
  }
  
  const chosenEnrollment = studentEnrollments.value.find(e => e.classId === transferFromClassId.value)
  const courseId = chosenEnrollment ? (chosenEnrollment.courseId || chosenEnrollment.CourseId) : null
  
  if (courseId) {
    selectedCourseId.value = courseId
    await fetchAlternativeClasses(courseId, transferFromClassId.value)
  } else {
    loadingAlternativeClasses.value = true
    try {
      const classRes = await api.get(`/api/v1/classes/${transferFromClassId.value}`)
      const cId = classRes.data?.courseId
      selectedCourseId.value = cId
      if (cId) {
        await fetchAlternativeClasses(cId, transferFromClassId.value)
      }
    } catch (e) {
      console.error(e)
      showSnackbar('Lỗi tải thông tin lớp học', 'error')
    } finally {
      loadingAlternativeClasses.value = false
    }
  }
}

watch(transferToClassId, async (newClassId) => {
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
  if (!transferFromClassId.value || !transferToClassId.value || !transferStudentId.value || !transferActiveMessageId.value) return
  submittingTransfer.value = true
  try {
    await api.post('/api/v1/enrollments/transfer', {
      studentId: transferStudentId.value,
      fromClassId: transferFromClassId.value,
      toClassId: transferToClassId.value
    })
    
    const targetClass = alternativeClasses.value.find(c => c.classId === transferToClassId.value)
    const targetClassName = targetClass ? targetClass.className : `Lớp ID: ${transferToClassId.value}`
    
    await api.post(`/api/v1/support-messages/${transferActiveMessageId.value}/resolve`, {
      adminResponse: `[Nhật ký thay đổi]\n• Đã chuyển học viên sang lớp ${targetClassName}`
    })
    
    showSnackbar('Phê duyệt và chuyển lớp thành công cho học viên!', 'success')
    transferDialog.value = false
    await fetchMessages()
  } catch (e) {
    console.error(e)
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt & chuyển lớp', 'error')
  } finally {
    submittingTransfer.value = false
  }
}

function formatDayOfWeek(day) {
  const map = { 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 0: 'Chủ Nhật' }
  return map[day] || day
}

function rejectRequest(msg) {
  rejectActiveMessageId.value = msg.id
  rejectStudentName.value = getRequesterName(msg)
  rejectMessageText.value = msg.message
  rejectReason.value = ''
  rejectDialog.value = true
}

async function submitReject() {
  if (!rejectActiveMessageId.value || !rejectReason.value.trim()) return
  submittingReject.value = true
  try {
    await api.post(`/api/v1/support-messages/${rejectActiveMessageId.value}/reject`, {
      adminResponse: rejectReason.value.trim()
    })
    showSnackbar(`Đã từ chối yêu cầu của ${rejectStudentName.value}`, 'success')
    rejectDialog.value = false
    await fetchMessages()
  } catch (e) {
    console.error(e)
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi từ chối', 'error')
  } finally {
    submittingReject.value = false
  }
}

async function loadTimetableSchedules() {
  loadingTimetable.value = true
  const list = []
  try {
    // 1. Fetch fromClass schedules if available
    if (resolveFromClassId.value) {
      try {
        const classRes = await api.get(`/api/v1/classes/${resolveFromClassId.value}`)
        timetableClasses.value[resolveFromClassId.value] = classRes.data
        
        const schedRes = await api.get(`/api/v1/classes/${resolveFromClassId.value}/schedules`)
        const schedules = (schedRes.data || []).map(s => ({ ...s, isTarget: true, classId: resolveFromClassId.value }))
        list.push(...schedules)
      } catch (err) {
        console.error('Error loading resolveFromClass:', err)
      }
    }
    
    // 2. Fetch toClass schedules if available
    if (resolveToClassId.value && resolveToClassId.value !== resolveFromClassId.value) {
      try {
        const classRes = await api.get(`/api/v1/classes/${resolveToClassId.value}`)
        timetableClasses.value[resolveToClassId.value] = classRes.data
        
        const schedRes = await api.get(`/api/v1/classes/${resolveToClassId.value}/schedules`)
        const schedules = (schedRes.data || []).map(s => ({ ...s, isTarget: false, classId: resolveToClassId.value }))
        list.push(...schedules)
      } catch (err) {
        console.error('Error loading resolveToClass:', err)
      }
    }
    
    // 3. Fetch other student enrollments or teacher classes to check for conflict
    const activeMsg = messages.value.find(m => m.id === resolveActiveMessageId.value)
    if (activeMsg) {
      const isTeacherMsg = getRequesterRole(activeMsg) === 'Giảng viên'
      if (isTeacherMsg) {
        // Fetch teacher's schedules to check for teacher conflict
        const targetClass = timetableClasses.value[resolveFromClassId.value]
        const teacherId = targetClass?.teacherId || targetClass?.TeacherId
        if (teacherId) {
          try {
            const classesRes = await api.get('/api/v1/classes', { params: { teacherId: teacherId, pageSize: 100 } })
            // API might return { items: [...] } or list directly
            const rawClasses = classesRes.data?.items || classesRes.data || []
            const teacherClasses = rawClasses.filter(
              c => c.classId !== resolveFromClassId.value && 
                   c.classId !== resolveToClassId.value && 
                   (c.status === 'Opened' || c.status === 'InProgress')
            )
            
            for (const c of teacherClasses) {
              try {
                timetableClasses.value[c.classId] = c
                const schedRes = await api.get(`/api/v1/classes/${c.classId}/schedules`)
                const schedules = (schedRes.data || []).map(s => ({ ...s, isTarget: false, classId: c.classId }))
                list.push(...schedules)
              } catch (err) {
                console.error(`Error loading teacher class ${c.classId} schedules:`, err)
              }
            }
          } catch (err) {
            console.error('Error loading teacher classes:', err)
          }
        }
      } else if (activeMsg.studentId) {
        // Original logic for student enrollments
        try {
          const enrollmentsRes = await api.get(`/api/v1/students/${activeMsg.studentId}/enrollments`)
          const activeEnrollments = (enrollmentsRes.data || []).filter(
            e => e.classId && 
                 e.classId !== resolveFromClassId.value && 
                 e.classId !== resolveToClassId.value && 
                 (e.status === 'Active' || e.status === 'DangHoc')
          )
          
          for (const e of activeEnrollments) {
            try {
              const classRes = await api.get(`/api/v1/classes/${e.classId}`)
              timetableClasses.value[e.classId] = classRes.data
              
              const schedRes = await api.get(`/api/v1/classes/${e.classId}/schedules`)
              const schedules = (schedRes.data || []).map(s => ({ ...s, isTarget: false, classId: e.classId }))
              list.push(...schedules)
            } catch (err) {
              console.error(`Error loading enrollment class ${e.classId}:`, err)
            }
          }
        } catch (err) {
          console.error('Error loading student enrollments:', err)
        }
      }
    }
    
    timetableSchedules.value = list
  } catch (err) {
    console.error('Error loading timetable data:', err)
  } finally {
    loadingTimetable.value = false
  }
}

function getClassName(classId) {
  return timetableClasses.value[classId]?.className || `Lớp học (${classId})`
}

function getCourseName(classId) {
  return timetableClasses.value[classId]?.courseName || timetableClasses.value[classId]?.CourseName || 'Môn học'
}

function getClassRoom(classId) {
  return timetableClasses.value[classId]?.room || ''
}

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0
  const parts = timeStr.split(':')
  if (parts.length < 2) return 0
  const h = parseInt(parts[0])
  const m = parseInt(parts[1])
  return h * 60 + m
}

function hasConflict(s, cellDate) {
  return timetableSchedules.value.some(other => {
    if (other === s) return false
    if (other.dayOfWeek !== s.dayOfWeek || other.session !== s.session) return false
    
    // Check strict time overlap
    const sStart = timeToMinutes(s.startTime)
    const sEnd = timeToMinutes(s.endTime)
    const oStart = timeToMinutes(other.startTime)
    const oEnd = timeToMinutes(other.endTime)
    
    if (sEnd <= oStart || sStart >= oEnd) return false
    
    // Check date overlap for other class
    const otherCls = timetableClasses.value[other.classId]
    if (otherCls) {
      const cStart = new Date(otherCls.startDate)
      cStart.setHours(0,0,0,0)
      const cEnd = otherCls.endDate ? new Date(otherCls.endDate) : new Date(2100, 0, 1)
      cEnd.setHours(23,59,59,999)
      const d = new Date(cellDate)
      d.setHours(12,0,0,0)
      if (d < cStart || d > cEnd) return false
    }
    
    return true
  })
}

function getResolveSchedulesForCell(dayValue, sessionValue, cellDate) {
  return timetableSchedules.value.filter(s => {
    if (s.dayOfWeek !== dayValue || s.session !== sessionValue) return false
    
    const cls = timetableClasses.value[s.classId]
    if (!cls) return true
    
    const cStart = new Date(cls.startDate)
    cStart.setHours(0,0,0,0)
    const cEnd = cls.endDate ? new Date(cls.endDate) : new Date(2100, 0, 1)
    cEnd.setHours(23,59,59,999)
    
    const d = new Date(cellDate)
    d.setHours(12,0,0,0)
    
    return d >= cStart && d <= cEnd
  })
}

let scrollAnimationId = null
const mousePos = { x: 0, y: 0 }
let lastWeekFlip = 0

function startScrollLoop() {
  if (scrollAnimationId) return
  
  function loop() {
    if (!isDragging.value) {
      cancelAnimationFrame(scrollAnimationId)
      scrollAnimationId = null
      return
    }
    
    if (timetableContainer.value) {
      const container = timetableContainer.value
      const rect = container.getBoundingClientRect()
      const edgeThresholdX = 120
      const scrollSpeed = 15
      const now = Date.now()
      
      if (mousePos.x - rect.left < edgeThresholdX) {
        container.scrollLeft -= scrollSpeed
        if (container.scrollLeft <= 0 && now - lastWeekFlip > 800) {
          prevWeek()
          lastWeekFlip = now
        }
      }
      else if (rect.right - mousePos.x < edgeThresholdX) {
        container.scrollLeft += scrollSpeed
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10 && now - lastWeekFlip > 800) {
          nextWeek()
          lastWeekFlip = now
        }
      }
    }
    scrollAnimationId = requestAnimationFrame(loop)
  }
  scrollAnimationId = requestAnimationFrame(loop)
}

function handleGlobalDragOver(event) {
  if (!isDragging.value) return
  mousePos.x = event.clientX
  mousePos.y = event.clientY
}

function handleDragStart(event, schedule) {
  if (resolveFromClassId.value && schedule.classId !== resolveFromClassId.value) {
    event.preventDefault()
    return
  }
  draggedSchedule.value = schedule
  isDragging.value = true
  startScrollLoop()
  event.dataTransfer.effectAllowed = 'move'
}

function handleDragEnd() {
  draggedSchedule.value = null
  dragOverDay.value = null
  dragOverSession.value = null
  isDragging.value = false
}

async function handleDrop(event, dayValue, sessionValue) {
  event.preventDefault()
  if (!draggedSchedule.value) return
  
  const schedule = draggedSchedule.value
  const origDay = schedule.dayOfWeek
  const origSession = schedule.session
  const origStartTime = schedule.startTime
  const origEndTime = schedule.endTime
  
  if (origDay === dayValue && origSession === sessionValue) return
  
  schedule.dayOfWeek = dayValue
  schedule.session = sessionValue
  
  if (sessionValue === 'Sang') {
    schedule.startTime = '08:00'
    schedule.endTime = '10:00'
  } else if (sessionValue === 'Chieu') {
    schedule.startTime = '14:00'
    schedule.endTime = '16:00'
  } else if (sessionValue === 'Toi') {
    schedule.startTime = '18:00'
    schedule.endTime = '20:00'
  }

  try {
    await api.put(`/api/v1/classes/${schedule.classId}/schedules/${schedule.scheduleId}`, {
      dayOfWeek: schedule.dayOfWeek,
      session: schedule.session,
      startTime: schedule.startTime,
      endTime: schedule.endTime
    })
    showSnackbar('Đã chuyển lịch học thành công!', 'success')
    
    const logMsg = `Đổi lịch học lớp ${getClassName(schedule.classId)} từ Thứ ${formatDayOfWeek(origDay)} (${origStartTime.substring(0,5)}-${origEndTime.substring(0,5)}) sang Thứ ${formatDayOfWeek(dayValue)} (${schedule.startTime}-${schedule.endTime})`
    sessionChangesLog.value.push(logMsg)

    await loadTimetableSchedules()
  } catch (error) {
    // Revert state on failure
    schedule.dayOfWeek = origDay
    schedule.session = origSession
    schedule.startTime = origStartTime
    schedule.endTime = origEndTime
    
    console.error('Lỗi di chuyển lịch học:', error)
    showSnackbar(error.response?.data?.message || 'Không thể lưu thay đổi di chuyển lịch', 'error')
    await loadTimetableSchedules()
  } finally {
    draggedSchedule.value = null
    dragOverDay.value = null
    dragOverSession.value = null
  }
}

function selectSlotForEdit(s) {
  selectedSlotEdit.value = { ...s }
  const cls = timetableClasses.value[s.classId] || {}
  selectedClassEdit.value = {
    classId: cls.classId,
    courseId: cls.courseId,
    className: cls.className,
    teacherId: cls.teacherId || null,
    teacherName: cls.teacherName || '',
    room: cls.room || '',
    maxStudents: cls.maxStudents || 30,
    startDate: cls.startDate ? cls.startDate.split('T')[0] : '',
    endDate: cls.endDate ? cls.endDate.split('T')[0] : '',
  }
}

async function saveSlotSchedule() {
  if (!selectedSlotEdit.value) return
  savingSlotTime.value = true
  try {
    const s = selectedSlotEdit.value
    const originalSlot = timetableSchedules.value.find(item => item.scheduleId === s.scheduleId)
    
    await api.put(`/api/v1/classes/${s.classId}/schedules/${s.scheduleId}`, {
      dayOfWeek: s.dayOfWeek,
      session: s.session,
      startTime: s.startTime,
      endTime: s.endTime
    })
    showSnackbar('Đã cập nhật giờ học buổi này!', 'success')
    
    if (originalSlot) {
      const isChanged = originalSlot.dayOfWeek !== s.dayOfWeek ||
                        originalSlot.session !== s.session ||
                        originalSlot.startTime !== s.startTime ||
                        originalSlot.endTime !== s.endTime
      if (isChanged) {
        const logMsg = `Đổi giờ học lớp ${getClassName(s.classId)} từ Thứ ${formatDayOfWeek(originalSlot.dayOfWeek)} (${originalSlot.startTime.substring(0,5)}-${originalSlot.endTime.substring(0,5)}) sang Thứ ${formatDayOfWeek(s.dayOfWeek)} (${s.startTime}-${s.endTime})`
        sessionChangesLog.value.push(logMsg)
      }
    }

    await loadTimetableSchedules()
    const updated = timetableSchedules.value.find(item => item.scheduleId === s.scheduleId)
    if (updated) {
      selectedSlotEdit.value = { ...updated }
    }
  } catch (error) {
    console.error(error)
    showSnackbar(error.response?.data?.message || 'Lỗi cập nhật lịch học', 'error')
  } finally {
    savingSlotTime.value = false
  }
}

async function saveClassDetails() {
  if (!selectedClassEdit.value) return
  savingClassDetails.value = true
  try {
    const cls = selectedClassEdit.value
    const selectedTeacher = teachers.value.find(t => t.userId === cls.teacherId)
    cls.teacherName = selectedTeacher ? selectedTeacher.fullName : ''
    
    const origClass = timetableClasses.value[cls.classId] || {}
    
    cls.id = cls.classId // Đồng bộ trường id cho backend binding (UpdateClassCommand)
    await api.put(`/api/v1/classes/${cls.classId}`, cls)
    showSnackbar('Đã cập nhật thông tin lớp học!', 'success')
    
    if (origClass.room !== cls.room) {
      sessionChangesLog.value.push(`Đổi phòng học lớp ${cls.className} từ "${origClass.room || 'N/A'}" sang "${cls.room || 'N/A'}"`)
    }
    if (origClass.teacherId !== cls.teacherId) {
      sessionChangesLog.value.push(`Đổi giảng viên lớp ${cls.className} từ "${origClass.teacherName || 'Chưa phân công'}" sang "${cls.teacherName || 'Chưa phân công'}"`)
    }
    if (origClass.className !== cls.className) {
      sessionChangesLog.value.push(`Đổi tên lớp từ "${origClass.className}" sang "${cls.className}"`)
    }

    timetableClasses.value[cls.classId] = { ...cls }
    await loadTimetableSchedules()
  } catch (error) {
    console.error(error)
    showSnackbar(error.response?.data?.message || 'Lỗi cập nhật thông tin lớp học', 'error')
  } finally {
    savingClassDetails.value = false
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

async function fetchClassrooms() {
  try {
    const response = await api.get('/api/v1/classrooms')
    availableRooms.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch classrooms:', error)
  }
}

async function openResolveModal(msg) {
  resolveActiveMessageId.value = msg.id
  resolveStudentName.value = getRequesterName(msg)
  resolveMessageText.value = msg.message
  resolveResponse.value = ''
  resolveFromClassId.value = msg.fromClassId || null
  resolveToClassId.value = msg.toClassId || null
  selectedSlotEdit.value = null
  selectedClassEdit.value = null
  timetableSchedules.value = []
  sessionChangesLog.value = []
  
  resolveDialog.value = true
  await loadTimetableSchedules()
  
  // Nhảy lịch tuần trực tiếp đến tuần mà yêu cầu hỗ trợ được gửi (msg.createdAt)
  if (msg.createdAt) {
    const d = new Date(msg.createdAt)
    if (!isNaN(d.getTime())) {
      currentWeekDate.value = d
    } else {
      currentWeekDate.value = new Date()
    }
  } else {
    currentWeekDate.value = new Date()
  }
}

function getFirstOccurrenceDate(start, end, dayOfWeek) {
  const check = new Date(start)
  for (let i = 0; i < 7; i++) {
    const jsDay = check.getDay()
    const targetDay = jsDay === 0 ? 0 : jsDay + 1
    if (targetDay === dayOfWeek) {
      if (check <= end) {
        return new Date(check)
      }
      return null
    }
    check.setDate(check.getDate() + 1)
  }
  return null
}

function findConflictDate(targetClassId) {
  const todayMs = new Date().getTime()
  // First pass: prioritize conflicts involving the target class (the class being requested for transfer/reschedule)
  if (targetClassId) {
    for (const s of timetableSchedules.value) {
      if (s.classId !== targetClassId) continue
      
      for (const other of timetableSchedules.value) {
        if (other === s) continue
        if (other.dayOfWeek !== s.dayOfWeek || other.session !== s.session) continue
        
        // Time overlap check
        const sStart = timeToMinutes(s.startTime)
        const sEnd = timeToMinutes(s.endTime)
        const oStart = timeToMinutes(other.startTime)
        const oEnd = timeToMinutes(other.endTime)
        if (sEnd <= oStart || sStart >= oEnd) continue
        
        // Date overlap check
        const clsS = timetableClasses.value[s.classId]
        const clsO = timetableClasses.value[other.classId]
        if (clsS && clsO) {
          const sStartD = new Date(clsS.startDate)
          const sEndD = clsS.endDate ? new Date(clsS.endDate) : new Date(2100, 0, 1)
          const oStartD = new Date(clsO.startDate)
          const oEndD = clsO.endDate ? new Date(clsO.endDate) : new Date(2100, 0, 1)
          
          // Find intersection starting from today onwards to prevent jumping to the past
          const startIntersect = new Date(Math.max(sStartD.getTime(), oStartD.getTime(), todayMs))
          const endIntersect = new Date(Math.min(sEndD.getTime(), oEndD.getTime()))
          
          if (startIntersect <= endIntersect) {
            const actualDate = getFirstOccurrenceDate(startIntersect, endIntersect, s.dayOfWeek)
            if (actualDate) return actualDate
          }
        }
      }
    }
  }

  // Second pass: fallback to any general conflict
  for (const s of timetableSchedules.value) {
    for (const other of timetableSchedules.value) {
      if (other === s) continue
      if (other.dayOfWeek !== s.dayOfWeek || other.session !== s.session) continue
      
      // Time overlap check
      const sStart = timeToMinutes(s.startTime)
      const sEnd = timeToMinutes(s.endTime)
      const oStart = timeToMinutes(other.startTime)
      const oEnd = timeToMinutes(other.endTime)
      if (sEnd <= oStart || sStart >= oEnd) continue
      
      // Date overlap check
      const clsS = timetableClasses.value[s.classId]
      const clsO = timetableClasses.value[other.classId]
      if (clsS && clsO) {
        const sStartD = new Date(clsS.startDate)
        const sEndD = clsS.endDate ? new Date(clsS.endDate) : new Date(2100, 0, 1)
        const oStartD = new Date(clsO.startDate)
        const oEndD = clsO.endDate ? new Date(clsO.endDate) : new Date(2100, 0, 1)
        
        // Find intersection starting from today onwards to prevent jumping to the past
        const startIntersect = new Date(Math.max(sStartD.getTime(), oStartD.getTime(), todayMs))
        const endIntersect = new Date(Math.min(sEndD.getTime(), oEndD.getTime()))
        
        if (startIntersect <= endIntersect) {
          const actualDate = getFirstOccurrenceDate(startIntersect, endIntersect, s.dayOfWeek)
          if (actualDate) return actualDate
        }
      }
    }
  }
  return null
}

async function submitResolve() {
  if (!resolveActiveMessageId.value) return
  submittingResolve.value = true
  try {
    // Auto-save schedule slot edits if any are active
    if (selectedSlotEdit.value) {
      await saveSlotSchedule()
    }
    // Auto-save class details edits if any are active
    if (selectedClassEdit.value) {
      await saveClassDetails()
    }

    let finalResponse = resolveResponse.value.trim()
    if (sessionChangesLog.value.length > 0) {
      const logPrefix = `[Nhật ký thay đổi]\n` + sessionChangesLog.value.map(line => `• ${line}`).join('\n')
      finalResponse = finalResponse ? `${finalResponse}\n\n${logPrefix}` : logPrefix
    }

    await api.post(`/api/v1/support-messages/${resolveActiveMessageId.value}/resolve`, {
      adminResponse: finalResponse || null
    })
    showSnackbar(`Đã giải quyết và lưu mọi thay đổi thành công!`, 'success')
    resolveDialog.value = false
    await fetchMessages()
  } catch (e) {
    console.error(e)
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi giải quyết yêu cầu', 'error')
  } finally {
    submittingResolve.value = false
  }
}

function getSupportTypeBadge(msg) {
  if (!msg.message) return null
  if (msg.message.includes('[Hỏi đáp học phí') || msg.message.includes('[Học phí')) {
    return { label: 'Học phí', class: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' }
  }
  if (msg.message.includes('[Hỗ trợ kỹ thuật') || msg.message.includes('[Kỹ thuật')) {
    return { label: 'Kỹ thuật', class: 'bg-blue-500/10 text-blue-600 border border-blue-500/20' }
  }
  if (msg.message.includes('[Ý kiến khác') || msg.message.includes('[Ý kiến đóng góp') || msg.message.includes('[Ý kiến')) {
    return { label: 'Ý kiến khác', class: 'bg-purple-500/10 text-purple-600 border border-purple-500/20' }
  }
  if (msg.message.includes('[Yêu cầu đổi lịch học') || msg.message.includes('[Yêu cầu thêm lịch học') || msg.message.includes('[Yêu cầu đổi lịch dạy') || msg.message.includes('[Yêu cầu hỗ trợ')) {
    return { label: 'Đổi lịch học', class: 'bg-amber-500/10 text-amber-600 border border-amber-500/20' }
  }
  if (msg.fromClassId) {
    return { label: 'Chuyển lớp', class: 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20' }
  }
  return { label: 'Hỗ trợ', class: 'bg-slate-500/10 text-slate-600 border border-slate-500/20' }
}

function getDisplayMessage(msg) {
  if (!msg.message) return ''
  return msg.message
    .replace(/^\[Hỏi đáp học phí.*?\]\s*/, '')
    .replace(/^\[Hỗ trợ kỹ thuật.*?\]\s*/, '')
    .replace(/^\[Ý kiến khác.*?\]\s*/, '')
    .replace(/^\[Ý kiến đóng góp.*?\]\s*/, '')
    .replace(/^\[Yêu cầu đổi lịch học.*?\]\s*/, '')
    .replace(/^\[Yêu cầu thêm lịch học.*?\]\s*/, '')
    .replace(/^\[Yêu cầu đổi lịch dạy.*?\]\s*/, '')
    .replace(/^\[Yêu cầu hỗ trợ.*?\]\s*/, '')
    .replace(/^\(Gửi bởi Giảng viên:\s*[^)]+\)\s*-\s*/, '')
}

function getStatusClass(status) {
  const map = {
    Pending: 'status-inprogress', // yellow badge
    Resolved: 'status-completed', // green badge
    Rejected: 'status-cancelled'   // red badge
  }
  return map[status] || 'status-inprogress'
}

function getStatusLabel(status) {
  const map = {
    Pending: 'Chờ duyệt',
    Resolved: 'Đã duyệt',
    Rejected: 'Đã từ chối'
  }
  return map[status] || status
}

function formatDateTime(dateStr) {
  if (!dateStr) return ''
  let normalizedStr = dateStr
  if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
    normalizedStr = dateStr + 'Z'
  }
  const date = new Date(normalizedStr)
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const authStore = useAuthStore()
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
    
  signalrConnection.on('SupportMessageCreated', async (msg) => {
    try {
      showSnackbar(`Học viên ${msg.studentName} vừa gửi yêu cầu hỗ trợ mới!`, 'info')
      await fetchMessages()
    } catch (err) {
      console.error('Error handling WebSocket message creation:', err)
    }
  })
  
  signalrConnection.start()
    .then(() => console.log('Admin connected to SupportHub WebSocket!'))
    .catch(err => console.error('Error starting SupportHub connection:', err))
}

onUnmounted(() => {
  if (signalrConnection) {
    signalrConnection.stop()
    signalrConnection = null
  }
})

onMounted(async () => {
  await fetchMessages()
  setupSignalR()
  await fetchTeachers()
  await fetchClassrooms()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes blinkConflict {
  0% {
    box-shadow: 0 0 0 0px rgba(99, 102, 241, 0.4);
    background-color: rgba(238, 242, 255, 0.9);
    border-color: rgba(129, 140, 248, 0.8);
  }
  100% {
    box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);
    background-color: rgba(224, 231, 255, 0.95);
    border-color: rgba(99, 102, 241, 1);
  }
}
.blink-conflict {
  animation: blinkConflict 1s infinite alternate;
}

@keyframes pulseSlow {
  0% { opacity: 0.9; }
  100% { opacity: 1; }
}
@keyframes targetPulse {
  0% {
    box-shadow: 0 0 0 0px rgba(99, 102, 241, 0.2);
    border-color: rgba(129, 140, 248, 0.6);
  }
  100% {
    box-shadow: 0 0 0 6px rgba(99, 102, 241, 0);
    border-color: rgba(99, 102, 241, 0.8);
  }
}
.target-pulse {
  animation: targetPulse 1.5s infinite alternate;
}
</style>


