<template>
  <div class="space-y-6">
    <!-- Header Page -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-primary-container/10 pb-5">
      <div>
        <h1 class="text-display-sm font-bold tracking-tight text-primary-container">
          {{ authStore.isAdmin ? 'Quản Lý Lương Giảng Viên' : 'Phiếu Lương Của Tôi' }}
        </h1>
        <p class="text-body-md text-on-surface-variant/80 mt-1">
          {{ authStore.isAdmin ? 'Quản lý cấu hình hợp đồng và lập bảng tính lương tháng cho giảng viên.' : 'Xem lịch sử thanh toán lương và các phiếu lương chi tiết hàng tháng.' }}
        </p>
      </div>

      <!-- Quick Stats if Teacher -->
      <div v-if="!authStore.isAdmin && slips.length > 0" class="flex gap-4">
        <div class="bg-primary-container/[0.03] border border-primary-container/10 rounded-xl px-4 py-2 text-center shadow-sm">
          <div class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Lương nhận gần nhất</div>
          <div class="text-body-md font-bold text-success mt-0.5">{{ formatCurrency(slips[0].totalAmount) }}</div>
        </div>
        <div class="bg-primary-container/[0.03] border border-primary-container/10 rounded-xl px-4 py-2 text-center shadow-sm">
          <div class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Trạng thái</div>
          <div class="text-body-sm font-bold text-primary-container mt-0.5">{{ slips[0].status === 'Paid' ? 'Đã chi trả' : 'Đang xử lý' }}</div>
        </div>
      </div>
    </div>

    <!-- Admin View: Tabs System -->
    <div v-if="authStore.isAdmin" class="space-y-6">
      <!-- Tabs Selector & Search Input -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-primary-container/15 pb-2 sm:pb-0 gap-3">
        <div class="flex flex-wrap">
          <button
            @click="activeTab = 'payroll'"
            class="px-6 py-3 border-b-2 font-bold text-body-sm transition-all duration-200"
            :class="activeTab === 'payroll' 
              ? 'border-primary-container text-primary-container' 
              : 'border-transparent text-on-surface-variant/70 hover:text-primary-container'"
          >
            Tính Toán Lương Tháng
          </button>
          <button
            @click="activeTab = 'configs'"
            class="px-6 py-3 border-b-2 font-bold text-body-sm transition-all duration-200"
            :class="activeTab === 'configs' 
              ? 'border-primary-container text-primary-container' 
              : 'border-transparent text-on-surface-variant/70 hover:text-primary-container'"
          >
            Cấu Hợp Đồng Lương
          </button>
        </div>

        <!-- Single Optimized Search Box -->
        <div class="relative w-full sm:w-72 mb-2 sm:mb-0 sm:mr-2">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary-container/60 text-[18px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="activeTab === 'payroll' ? 'Tìm giảng viên...' : 'Tìm theo tên, tài khoản...'"
            class="w-full pl-9 pr-8 py-2 text-body-sm bg-primary-container/[0.03] border border-primary-container/10 rounded-lg focus:outline-none focus:border-primary-container/30 text-primary-container font-semibold placeholder-primary-container/40"
          />
          <!-- Clear Button -->
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary-container flex items-center justify-center cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: CALCULATE PAYROLL -->
      <div v-if="activeTab === 'payroll'" class="space-y-6">
        <!-- Month Year Picker and Calculate trigger -->
        <div class="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 bg-primary-container/[0.02] border border-primary-container/10 p-4 rounded-xl shadow-sm">
          <div class="flex flex-wrap items-center gap-3">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-primary-container uppercase">Chọn tháng</label>
              <select
                v-model="payrollDate.month"
                class="bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm text-primary-container focus:outline-none"
              >
                <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-primary-container uppercase">Chọn năm</label>
              <select
                v-model="payrollDate.year"
                class="bg-primary-container/[0.05] border border-primary-container/10 rounded-lg px-3 py-2 text-body-sm text-primary-container focus:outline-none"
              >
                <option v-for="y in [2025, 2026, 2027]" :key="y" :value="y">Năm {{ y }}</option>
              </select>
            </div>
            <button
              @click="loadPayrollSlips"
              class="bg-primary-container/10 hover:bg-primary-container/25 text-primary-container px-4 py-2 rounded-lg font-semibold text-body-sm transition-all duration-200 self-end"
            >
              Xem bảng lương
            </button>
          </div>

          <button
            @click="calculatePayroll"
            :disabled="calculating"
            class="flex items-center gap-2 bg-primary-container text-white hover:bg-primary-container/90 px-5 py-2.5 rounded-lg font-bold text-body-sm shadow transition-all duration-200"
          >
            <span class="material-symbols-outlined text-[18px]">calculate</span>
            {{ calculating ? 'Đang tính toán...' : 'Tính lương tháng này' }}
          </button>
        </div>

        <!-- Payroll Slips Table -->
        <div class="bg-white/70 backdrop-blur-[15px] border border-primary-container/10 rounded-xl overflow-hidden shadow-sm">
          <div v-if="loadingSlips" class="p-12 space-y-4 animate-pulse">
            <div class="h-6 bg-primary-container/10 rounded w-1/3"></div>
            <div class="h-10 bg-primary-container/5 rounded"></div>
            <div class="h-10 bg-primary-container/5 rounded"></div>
          </div>

          <div v-else-if="slips.length > 0" class="overflow-x-auto">
            <table v-if="filteredSlips.length > 0" class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-primary-container/[0.05] text-primary-container font-bold text-body-sm border-b border-primary-container/10">
                  <th class="py-4 px-6">Giảng viên</th>
                  <th class="py-4 px-6 text-center">Số buổi dạy</th>
                  <th class="py-4 px-6 text-center">Sĩ số t.gia (lượt)</th>
                  <th class="py-4 px-6 text-right">Lương cứng</th>
                  <th class="py-4 px-6 text-right">Lương buổi</th>
                  <th class="py-4 px-6 text-right">Phụ cấp sĩ số</th>
                  <th class="py-4 px-6 text-right">Thưởng/Phạt</th>
                  <th class="py-4 px-6 text-right">Tổng thực lĩnh</th>
                  <th class="py-4 px-6 text-center">Trạng thái</th>
                  <th class="py-4 px-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody class="text-body-sm text-on-surface">
                <tr
                  v-for="s in filteredSlips"
                  :key="s.salarySlipId"
                  class="border-t border-primary-container/5 hover:bg-primary-container/[0.02] transition-colors"
                >
                  <td class="py-4 px-6 font-semibold">{{ s.teacherName }}</td>
                  <td class="py-4 px-6 text-center">{{ s.sessionsTaught }}</td>
                  <td class="py-4 px-6 text-center">{{ s.totalStudentSessions }}</td>
                  <td class="py-4 px-6 text-right">{{ formatCurrency(s.baseSalary) }}</td>
                  <td class="py-4 px-6 text-right">{{ formatCurrency(s.sessionsTaught * s.ratePerSession) }}</td>
                  <td class="py-4 px-6 text-right">{{ formatCurrency(s.totalStudentSessions * s.studentAllowanceRate) }}</td>
                  <td class="py-4 px-6 text-right text-success" :class="{ 'text-error': s.deductions > s.bonus }">
                    <span v-if="s.bonus > 0">+{{ formatCurrency(s.bonus) }}</span>
                    <span v-if="s.deductions > 0" class="block text-error">-{{ formatCurrency(s.deductions) }}</span>
                    <span v-if="s.bonus === 0 && s.deductions === 0">0 đ</span>
                  </td>
                  <td class="py-4 px-6 text-right font-bold text-primary-container">{{ formatCurrency(s.totalAmount) }}</td>
                  <td class="py-4 px-6 text-center">
                    <span
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold border"
                      :class="getSlipStatusClass(s.status)"
                    >
                      {{ getSlipStatusLabel(s.status) }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <button
                      @click="openSlipModal(s)"
                      class="bg-primary-container/[0.05] hover:bg-primary-container/10 border border-primary-container/10 text-primary-container px-3 py-1.5 rounded-lg text-body-xs font-semibold shadow-sm transition-all duration-150"
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Empty search result -->
            <div v-else class="p-12 text-center flex flex-col items-center justify-center space-y-2 bg-white/70">
              <span class="material-symbols-outlined text-[40px] text-on-surface-variant/40">search_off</span>
              <h4 class="text-body-md font-bold text-primary-container">Không tìm thấy giảng viên "{{ searchQuery }}"</h4>
              <p class="text-body-xs text-on-surface-variant/60">Vui lòng thử lại với tên khác.</p>
            </div>
          </div>

          <div v-else class="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <span class="material-symbols-outlined text-[48px] text-on-surface-variant/40">receipt_long</span>
            <h4 class="text-body-lg font-bold text-primary-container">Chưa có dữ liệu lương tháng {{ payrollDate.month }}/{{ payrollDate.year }}</h4>
            <p class="text-body-sm text-on-surface-variant/60 max-w-sm">Hãy nhấn nút "Tính lương tháng này" để tự động khởi tạo bảng tính lương dựa trên dữ liệu chuyên cần.</p>
          </div>
        </div>
      </div>

      <!-- TAB 2: EDIT SALARY CONTRACTS -->
      <div v-if="activeTab === 'configs'" class="space-y-6">
        <div class="bg-white/70 backdrop-blur-[15px] border border-primary-container/10 rounded-xl overflow-hidden shadow-sm">
          <table v-if="filteredConfigs.length > 0" class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-primary-container/[0.05] text-primary-container font-bold text-body-sm border-b border-primary-container/10">
                <th class="py-4 px-6">Giảng viên</th>
                <th class="py-4 px-6">Tài khoản</th>
                <th class="py-4 px-6 text-right">Lương cứng tháng</th>
                <th class="py-4 px-6 text-right">Lương theo buổi dạy</th>
                <th class="py-4 px-6 text-right">Phụ cấp/học viên/buổi</th>
                <th class="py-4 px-6">Ghi chú hợp đồng</th>
                <th class="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="text-body-sm text-on-surface">
              <tr
                v-for="cfg in filteredConfigs"
                :key="cfg.userId"
                class="border-t border-primary-container/5 hover:bg-primary-container/[0.02] transition-colors"
              >
                <td class="py-4 px-6 font-semibold">{{ cfg.fullName }}</td>
                <td class="py-4 px-6 text-on-surface-variant">@{{ cfg.username }}</td>
                <td class="py-4 px-6 text-right font-medium text-primary-container">{{ formatCurrency(cfg.baseSalary) }}</td>
                <td class="py-4 px-6 text-right font-medium">{{ formatCurrency(cfg.ratePerSession) }}</td>
                <td class="py-4 px-6 text-right font-medium text-success">{{ formatCurrency(cfg.studentAllowanceRate) }}</td>
                <td class="py-4 px-6 max-w-xs truncate italic text-on-surface-variant/80">{{ cfg.notes || 'Không có ghi chú' }}</td>
                <td class="py-4 px-6 text-center">
                  <button
                    @click="openConfigModal(cfg)"
                    class="bg-primary-container/[0.05] hover:bg-primary-container/10 border border-primary-container/10 text-primary-container px-3.5 py-1.5 rounded-lg text-body-xs font-semibold shadow-sm transition-all duration-150"
                  >
                    Thiết lập
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Empty search result for configs -->
          <div v-else class="p-12 text-center flex flex-col items-center justify-center space-y-2 bg-white/70">
            <span class="material-symbols-outlined text-[40px] text-on-surface-variant/40">search_off</span>
            <h4 class="text-body-md font-bold text-primary-container">Không tìm thấy giảng viên nào khớp với "{{ searchQuery }}"</h4>
            <p class="text-body-xs text-on-surface-variant/60">Vui lòng kiểm tra lại từ khóa.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Teacher View: Personal Slip List -->
    <div v-else class="space-y-6">
      <div v-if="loadingSlips" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div v-for="i in 2" :key="i" class="h-44 bg-primary-container/5 rounded-2xl"></div>
      </div>

      <div v-else-if="slips.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="s in slips"
          :key="s.salarySlipId"
          class="bg-surface border border-primary-container/10 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <!-- Slip Top -->
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-headline-xs font-bold text-primary-container">Phiếu Lương</h3>
                <p class="text-body-xs text-on-surface-variant/70 font-semibold">Tháng {{ s.month }} năm {{ s.year }}</p>
              </div>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                :class="getSlipStatusClass(s.status)"
              >
                {{ getSlipStatusLabel(s.status) }}
              </span>
            </div>

            <!-- Breakdown -->
            <div class="divide-y divide-primary-container/10 border-t border-b border-primary-container/10 py-2 space-y-1.5 text-body-xs text-on-surface-variant/90">
              <div class="flex justify-between">
                <span>Số buổi dạy (tiết):</span>
                <span class="font-semibold text-primary-container">{{ s.sessionsTaught }} buổi</span>
              </div>
              <div class="flex justify-between">
                <span>Lượt HS tham dự:</span>
                <span class="font-semibold text-primary-container">{{ s.totalStudentSessions }} lượt</span>
              </div>
              <div class="flex justify-between pt-1.5">
                <span>Lương cứng cố định:</span>
                <span class="font-semibold">{{ formatCurrency(s.baseSalary) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Lương theo buổi dạy:</span>
                <span class="font-semibold">{{ formatCurrency(s.sessionsTaught * s.ratePerSession) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Phụ cấp sĩ số:</span>
                <span class="font-semibold text-success">{{ formatCurrency(s.totalStudentSessions * s.studentAllowanceRate) }}</span>
              </div>
              <div v-if="s.bonus > 0" class="flex justify-between">
                <span>Thưởng thêm:</span>
                <span class="font-semibold text-success">+{{ formatCurrency(s.bonus) }}</span>
              </div>
              <div v-if="s.deductions > 0" class="flex justify-between">
                <span>Khấu trừ/Phạt:</span>
                <span class="font-semibold text-error">-{{ formatCurrency(s.deductions) }}</span>
              </div>
            </div>

            <!-- Bank Account section -->
            <div class="pt-2.5 border-t border-primary-container/10 space-y-1">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Tài khoản nhận lương</span>
              
              <!-- Selected/Saved Bank Account for Approved/Paid -->
              <div v-if="s.status !== 'Pending' && s.status !== 'Rejected'" class="text-body-xs font-semibold text-primary-container flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-emerald-500">account_balance</span>
                <span>{{ s.bankAccount || 'Chưa cấu hình tài khoản' }}</span>
              </div>
              
              <!-- Select Dropdown for Pending/Rejected -->
              <div v-else-if="getUserBankAccounts().length > 0">
                <select
                  v-model="selectedBankAccounts[s.salarySlipId]"
                  class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-2.5 py-1.5 text-body-xs text-primary-container font-semibold focus:outline-none focus:border-primary-container/30 cursor-pointer"
                >
                  <option
                    v-for="a in getUserBankAccounts()"
                    :key="a.id"
                    :value="`${a.bankName} - ${a.accountNumber} (${a.accountHolder})`"
                  >
                    {{ a.bankName }} - {{ a.accountNumber }} ({{ a.accountHolder }})
                  </option>
                </select>
              </div>
              <div v-else class="text-[10px] text-error font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">warning</span>
                Chưa có tài khoản ngân hàng. Hãy cấu hình ở trang Cá nhân!
              </div>
            </div>
          </div>

          <!-- Slip Bottom -->
          <div class="pt-2 flex justify-between items-center border-t border-dashed border-primary-container/10">
            <div>
              <div class="text-[10px] text-on-surface-variant uppercase tracking-wider">Tổng thực lĩnh</div>
              <div class="text-headline-xs font-bold text-primary-container mt-0.5">{{ formatCurrency(s.totalAmount) }}</div>
            </div>
            <div class="text-right text-[10px] text-on-surface-variant/60 font-medium italic">
              <span v-if="s.paidAt">Chi trả ngày: {{ formatDate(s.paidAt) }}</span>
              <span v-else>Dự kiến thanh toán</span>
            </div>
          </div>

          <!-- Action Buttons for Teacher if Pending or Rejected -->
          <div v-if="s.status === 'Pending' || s.status === 'Rejected'" class="pt-3 border-t border-dashed border-primary-container/10 flex gap-2">
            <button
              @click="handleAcceptSlip(s)"
              class="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-body-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
            >
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              Chấp nhận
            </button>
            <button
              @click="openFeedbackModal(s)"
              class="flex-1 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-body-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
            >
              <span class="material-symbols-outlined text-[16px]">cancel</span>
              Không đồng ý
            </button>
          </div>

          <div v-else-if="s.status === 'Approved'" class="pt-2 text-right text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
            <span class="material-symbols-outlined text-[16px]">check_circle</span>
            Đã xác nhận chính xác
          </div>

          <div v-if="s.status === 'Rejected'" class="pt-2 text-left text-[11px] text-rose-600 font-medium bg-rose-50 border border-rose-100 p-2 rounded-lg mt-1 space-y-0.5">
            <div class="font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">info</span>
              Đã báo cáo không hợp lý
            </div>
            <div class="italic text-[10px] text-on-surface-variant/80 truncate" :title="s.notes">Lý do: {{ s.notes }}</div>
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white/70 border border-primary-container/10 rounded-2xl">
        <span class="material-symbols-outlined text-[48px] text-on-surface-variant/40">receipt_long</span>
        <h4 class="text-body-lg font-bold text-primary-container">Chưa có phiếu lương nào</h4>
        <p class="text-body-sm text-on-surface-variant/60 max-w-sm">Hiện tại hệ thống chưa phát hành phiếu lương nào cho tài khoản của bạn.</p>
      </div>
    </div>

    <!-- DIALOG MODAL 1: EDIT CONFIG -->
    <div v-if="configModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-primary-container/15 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="bg-primary-container px-6 py-4 flex items-center justify-between border-b border-primary-container/10">
          <h3 class="text-body-lg font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">co_present</span>
            Hợp đồng lương: {{ configModal.teacher?.fullName }}
          </h3>
          <button @click="closeConfigModal" class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Lương cứng tháng (VND)</label>
            <input
              v-model.number="configModal.form.baseSalary"
              type="number"
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2 text-body-sm text-primary-container"
            />
          </div>
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Đơn giá / buổi học (VND)</label>
            <input
              v-model.number="configModal.form.ratePerSession"
              type="number"
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2 text-body-sm text-primary-container"
            />
          </div>
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Phụ cấp / học viên / buổi (VND)</label>
            <input
              v-model.number="configModal.form.studentAllowanceRate"
              type="number"
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2 text-body-sm text-primary-container"
            />
          </div>
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Ghi chú hợp đồng</label>
            <textarea
              v-model="configModal.form.notes"
              rows="3"
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2 text-body-sm text-primary-container resize-none"
              placeholder="Nhập ghi chú hoặc điều khoản hợp đồng..."
            ></textarea>
          </div>
          <p v-if="configModal.error" class="text-error text-[11px] font-semibold">{{ configModal.error }}</p>
        </div>

        <div class="bg-primary-container/[0.03] border-t border-primary-container/10 px-6 py-4 flex justify-end gap-3">
          <button
            @click="closeConfigModal"
            class="px-4 py-2 border border-primary-container/10 hover:bg-primary-container/[0.05] text-primary-container rounded-lg font-semibold text-body-sm transition-all duration-200"
          >
            Hủy
          </button>
          <button
            @click="saveConfig"
            :disabled="savingConfig"
            class="bg-primary-container hover:bg-primary-container/90 text-white px-5 py-2 rounded-lg font-semibold text-body-sm shadow transition-all duration-200 disabled:opacity-50"
          >
            {{ savingConfig ? 'Đang lưu...' : 'Lưu hợp đồng' }}
          </button>
        </div>
      </div>
    </div>

    <!-- DIALOG MODAL 2: EDIT SALARY SLIP STATUS / BONUS -->
    <div v-if="slipModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-primary-container/15 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="bg-primary-container px-6 py-4 flex items-center justify-between border-b border-primary-container/10">
          <h3 class="text-body-lg font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">payments</span>
            Phê duyệt lương: {{ slipModal.slip?.teacherName }}
          </h3>
          <button @click="closeSlipModal" class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- Summary statistics -->
          <div class="bg-primary-container/[0.03] border border-primary-container/10 p-3.5 rounded-xl text-body-xs text-on-surface-variant/90 space-y-1">
            <div class="flex justify-between">
              <span>Lương tính toán (A):</span>
              <span class="font-bold text-primary-container">{{ formatCurrency(slipModal.slip?.calculatedSalary) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Thực nhận dự kiến:</span>
              <span class="font-extrabold text-success text-body-sm">{{ formatCurrency(slipModal.slip?.calculatedSalary + (slipModal.form.bonus || 0) - (slipModal.form.deductions || 0)) }}</span>
            </div>
            <div class="flex justify-between pt-1.5 border-t border-primary-container/10 mt-1.5">
              <span>Tài khoản nhận lương:</span>
              <span class="font-bold text-primary-container truncate max-w-[200px]" :title="slipModal.slip?.bankAccount">
                {{ slipModal.slip?.bankAccount || 'Chưa cấu hình tài khoản' }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Khoản thưởng thêm (+)</label>
              <input
                v-model.number="slipModal.form.bonus"
                type="number"
                class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2 text-body-sm text-primary-container"
              />
            </div>
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Khấu trừ / Phạt (-)</label>
              <input
                v-model.number="slipModal.form.deductions"
                type="number"
                class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2 text-body-sm text-primary-container"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Trạng thái phê duyệt</label>
            <select
              v-model="slipModal.form.status"
              :disabled="slipModal.slip?.status === 'Paid'"
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2.5 text-body-sm text-primary-container focus:outline-none"
            >
              <option value="Pending">Chờ phê duyệt (Pending)</option>
              <option value="Approved">Đã duyệt (Approved)</option>
              <option value="Paid">Đã chi trả (Paid)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Ghi chú thanh toán</label>
            <textarea
              v-model="slipModal.form.notes"
              rows="2"
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2 text-body-sm text-primary-container resize-none"
              placeholder="Nhập ghi chú khen thưởng hoặc trừ lương..."
            ></textarea>
          </div>
          <p v-if="slipModal.error" class="text-error text-[11px] font-semibold">{{ slipModal.error }}</p>
        </div>

        <div class="bg-primary-container/[0.03] border-t border-primary-container/10 px-6 py-4 flex justify-end gap-3">
          <button
            @click="closeSlipModal"
            class="px-4 py-2 border border-primary-container/10 hover:bg-primary-container/[0.05] text-primary-container rounded-lg font-semibold text-body-sm transition-all duration-200"
          >
            Hủy
          </button>
          <button
            @click="saveSlipStatus"
            :disabled="savingSlip"
            class="bg-primary-container hover:bg-primary-container/90 text-white px-5 py-2 rounded-lg font-semibold text-body-sm shadow transition-all duration-200 disabled:opacity-50"
          >
            {{ savingSlip ? 'Đang lưu...' : 'Xác nhận phê duyệt' }}
          </button>
        </div>
      </div>
    </div>

    <!-- DIALOG MODAL 3: TEACHER SLIP FEEDBACK (DISPUTE REASON) -->
    <div v-if="feedbackModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-primary-container/15 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="bg-rose-600 px-6 py-4 flex items-center justify-between border-b border-primary-container/10">
          <h3 class="text-body-lg font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">warning</span>
            Báo cáo phiếu lương không hợp lý
          </h3>
          <button @click="closeFeedbackModal" class="text-white/80 hover:text-white flex items-center justify-center">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Lý do không hợp lý *</label>
            <textarea
              v-model="feedbackModal.feedback"
              rows="4"
              required
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2.5 text-body-sm text-primary-container resize-none focus:outline-none focus:border-rose-500"
              placeholder="Vui lòng giải thích chi tiết tại sao bảng tính lương này chưa hợp lý (Ví dụ: sai số buổi dạy, thiếu phụ cấp...)"
            ></textarea>
          </div>
          <p v-if="feedbackModal.error" class="text-error text-[11px] font-semibold">{{ feedbackModal.error }}</p>
        </div>

        <div class="bg-primary-container/[0.03] border-t border-primary-container/10 px-6 py-4 flex justify-end gap-3">
          <button
            @click="closeFeedbackModal"
            class="px-4 py-2 border border-primary-container/10 hover:bg-primary-container/[0.05] text-primary-container rounded-lg font-semibold text-body-sm transition-all duration-200"
          >
            Hủy
          </button>
          <button
            @click="submitDeclineSlip"
            :disabled="submittingFeedback || !feedbackModal.feedback.trim()"
            class="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg font-semibold text-body-sm shadow transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <span v-if="submittingFeedback" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            Gửi yêu cầu điều chỉnh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useAuthStore } from '../../stores'
import api from '../../services/api'

const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')
const activeTab = ref('payroll') // payroll, configs
const loadingSlips = ref(false)
const loadingConfigs = ref(false)
const calculating = ref(false)
const savingConfig = ref(false)
const savingSlip = ref(false)

const slips = ref([])
const configs = ref([])

const searchQuery = ref('')

// Clear search query when switching tabs
watch(activeTab, () => {
  searchQuery.value = ''
})

const filteredSlips = computed(() => {
  if (!searchQuery.value) return slips.value
  const query = searchQuery.value.toLowerCase().trim()
  return slips.value.filter(s => 
    s.teacherName?.toLowerCase().includes(query)
  )
})

const filteredConfigs = computed(() => {
  if (!searchQuery.value) return configs.value
  const query = searchQuery.value.toLowerCase().trim()
  return configs.value.filter(cfg => 
    cfg.fullName?.toLowerCase().includes(query) ||
    cfg.username?.toLowerCase().includes(query)
  )
})

const payrollDate = ref({
  month: new Date().getMonth() || 12, // Default to last month
  year: new Date().getFullYear()
})

const configModal = ref({
  show: false,
  teacher: null,
  form: {
    baseSalary: 0,
    ratePerSession: 300000,
    studentAllowanceRate: 0,
    notes: ''
  },
  error: ''
})

const slipModal = ref({
  show: false,
  slip: null,
  form: {
    status: 'Pending',
    bonus: 0,
    deductions: 0,
    notes: ''
  },
  error: ''
})

// Load Slips Data
const loadPayrollSlips = async () => {
  loadingSlips.value = true
  try {
    const response = await api.get('/api/v1/teachers/salary/slips', {
      params: {
        month: payrollDate.value.month,
        year: payrollDate.value.year
      }
    })
    slips.value = response.data || []
  } catch (error) {
    console.error('Error loading slips:', error)
  } finally {
    loadingSlips.value = false
  }
}

// Load Configs Data (Admin)
const loadSalaryConfigs = async () => {
  if (!authStore.isAdmin) return
  loadingConfigs.value = true
  try {
    const response = await api.get('/api/v1/teachers/salary/configs')
    configs.value = response.data || []
  } catch (error) {
    console.error('Error loading configs:', error)
  } finally {
    loadingConfigs.value = false
  }
}

// Trigger Calculate Monthly Payroll (Admin)
const calculatePayroll = async () => {
  calculating.value = true
  try {
    const response = await api.post('/api/v1/teachers/salary/slips/calculate', {
      month: payrollDate.value.month,
      year: payrollDate.value.year
    })
    slips.value = response.data || []
    showSnackbar(`Đã tính toán xong bảng lương tháng ${payrollDate.value.month}/${payrollDate.value.year} cho tất cả giảng viên!`, 'success')
  } catch (error) {
    console.error('Error calculating payroll:', error)
    showSnackbar(error.response?.data?.message || 'Lỗi khi tính toán bảng lương.', 'error')
  } finally {
    calculating.value = false
  }
}

// Config Modal Helpers
const openConfigModal = (cfg) => {
  configModal.value = {
    show: true,
    teacher: cfg,
    form: {
      baseSalary: cfg.baseSalary,
      ratePerSession: cfg.ratePerSession,
      studentAllowanceRate: cfg.studentAllowanceRate,
      notes: cfg.notes || ''
    },
    error: ''
  }
}

const closeConfigModal = () => {
  configModal.value.show = false
  configModal.value.teacher = null
  configModal.value.error = ''
}

const saveConfig = async () => {
  savingConfig.value = true
  configModal.value.error = ''
  try {
    const response = await api.put(`/api/v1/teachers/salary/configs/${configModal.value.teacher.userId}`, configModal.value.form)
    
    // Update locally
    const idx = configs.value.findIndex(c => c.userId === configModal.value.teacher.userId)
    if (idx !== -1) {
      configs.value[idx] = response.data
    }
    closeConfigModal()
  } catch (error) {
    console.error('Error saving config:', error)
    configModal.value.error = error.response?.data?.message || 'Có lỗi xảy ra khi lưu cấu hình.'
  } finally {
    savingConfig.value = false
  }
}

// Slip Modal Helpers
const openSlipModal = (slip) => {
  slipModal.value = {
    show: true,
    slip: slip,
    form: {
      status: slip.status,
      bonus: slip.bonus,
      deductions: slip.deductions,
      notes: slip.notes || ''
    },
    error: ''
  }
}

const closeSlipModal = () => {
  slipModal.value.show = false
  slipModal.value.slip = null
  slipModal.value.error = ''
}

const saveSlipStatus = async () => {
  savingSlip.value = true
  slipModal.value.error = ''
  try {
    const response = await api.put(`/api/v1/teachers/salary/slips/${slipModal.value.slip.salarySlipId}/status`, slipModal.value.form)
    
    // Update locally
    const idx = slips.value.findIndex(s => s.salarySlipId === slipModal.value.slip.salarySlipId)
    if (idx !== -1) {
      slips.value[idx] = response.data
    }
    closeSlipModal()
  } catch (error) {
    console.error('Error saving slip status:', error)
    slipModal.value.error = error.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt.'
  } finally {
    savingSlip.value = false
  }
}

// Teacher slip accept/decline feedback and bank account selection
const selectedBankAccounts = ref({})

const getUserBankAccounts = () => {
  const accountStr = authStore.currentUser?.bankAccount
  if (!accountStr) return []
  try {
    const parsed = JSON.parse(accountStr)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

const initializeBankSelections = () => {
  slips.value.forEach(s => {
    if (s.bankAccount) {
      selectedBankAccounts.value[s.salarySlipId] = s.bankAccount
    } else {
      const userAccounts = getUserBankAccounts()
      const defaultAcc = userAccounts.find(a => a.isDefault) || userAccounts[0]
      if (defaultAcc) {
        selectedBankAccounts.value[s.salarySlipId] = `${defaultAcc.bankName} - ${defaultAcc.accountNumber} (${defaultAcc.accountHolder})`
      } else {
        selectedBankAccounts.value[s.salarySlipId] = ''
      }
    }
  })
}

// Watch slips to initialize selections for Teacher view
watch(slips, () => {
  if (!authStore.isAdmin) {
    initializeBankSelections()
  }
}, { deep: true, immediate: true })

const feedbackModal = ref({
  show: false,
  slipId: null,
  feedback: '',
  error: ''
})
const submittingFeedback = ref(false)

const openFeedbackModal = (slip) => {
  feedbackModal.value = {
    show: true,
    slipId: slip.salarySlipId,
    feedback: '',
    error: ''
  }
}

const closeFeedbackModal = () => {
  feedbackModal.value.show = false
  feedbackModal.value.slipId = null
  feedbackModal.value.error = ''
}

const confirmSlip = async (slipId, accepted, feedbackText = '', bankAccountVal = '') => {
  try {
    const { data } = await api.put(`/api/v1/teachers/salary/slips/${slipId}/feedback`, {
      accepted,
      feedback: feedbackText,
      bankAccount: bankAccountVal
    })
    
    // Update local slip status
    const idx = slips.value.findIndex(s => s.salarySlipId === slipId)
    if (idx !== -1) {
      slips.value[idx] = data
    }
    
    showSnackbar(accepted ? 'Đã chấp nhận phiếu lương thành công!' : 'Đã gửi báo cáo không hợp lý đến Admin thành công!', 'success')
    return true
  } catch (error) {
    console.error('Error confirming slip:', error)
    showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận phiếu lương.', 'error')
    return false
  }
}

const handleAcceptSlip = (slip) => {
  const chosenAccount = selectedBankAccounts.value[slip.salarySlipId]
  if (!chosenAccount) {
    showSnackbar('Vui lòng thêm tài khoản ngân hàng trong trang Cá nhân trước khi chấp nhận phiếu lương!', 'warning')
    return
  }
  confirmSlip(slip.salarySlipId, true, '', chosenAccount)
}

const submitDeclineSlip = async () => {
  if (!feedbackModal.value.feedback.trim()) {
    feedbackModal.value.error = 'Vui lòng nhập lý do không hợp lý.'
    return
  }
  
  submittingFeedback.value = true
  feedbackModal.value.error = ''
  
  const success = await confirmSlip(
    feedbackModal.value.slipId,
    false,
    feedbackModal.value.feedback,
    selectedBankAccounts.value[feedbackModal.value.slipId]
  )
  
  submittingFeedback.value = false
  if (success) {
    closeFeedbackModal()
  }
}

// Utility Helpers
const formatCurrency = (val) => {
  if (val === undefined || val === null) return '0 đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

const getSlipStatusClass = (status) => {
  const map = {
    Pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    Approved: 'bg-info/10 text-info border-info/20',
    Paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  }
  return map[status] || 'bg-white/40 text-on-surface border-white/60'
}

const getSlipStatusLabel = (status) => {
  const map = {
    Pending: 'Chờ duyệt',
    Approved: 'Đã phê duyệt',
    Paid: 'Đã thanh toán',
    Rejected: 'Không hợp lý'
  }
  return map[status] || status
}

onMounted(async () => {
  if (!authStore.isAdmin) {
    try {
      await authStore.fetchProfile()
    } catch (e) {
      console.error('Error fetching profile:', e)
    }
  }
  // Correctly adjust payroll calculation default date to last month
  const now = new Date()
  let targetMonth = now.getMonth() // 0-indexed, so 6 (July) -> 6 (June) which represents last month
  let targetYear = now.getFullYear()
  if (targetMonth === 0) {
    targetMonth = 12
    targetYear -= 1
  }
  payrollDate.value = { month: targetMonth, year: targetYear }

  loadPayrollSlips()
  loadSalaryConfigs()
})
</script>

<style scoped>
.bg-surface {
  background-color: var(--color-surface, rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(10px);
}
.text-info {
  color: #0284c7;
}
.bg-info\/10 {
  background-color: rgba(2, 132, 199, 0.1);
}
.border-info\/20 {
  border-color: rgba(2, 132, 199, 0.2);
}
.text-success {
  color: #16a34a;
}
.text-error {
  color: #dc2626;
}
</style>
