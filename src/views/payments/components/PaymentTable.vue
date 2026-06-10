<template>
  <div class="space-y-6">
    <!-- Filters & Search -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative flex-1 w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          :value="filters.search"
          @input="$emit('update-filter', { key: 'search', value: $event.target.value })"
          class="w-full glass-input pl-10 pr-4 py-2.5 rounded-lg text-body-sm text-on-surface"
          placeholder="Tìm kiếm hóa đơn theo tên học viên..."
          type="text"
        />
      </div>
      <div class="relative w-full sm:w-64">
        <select
          :value="filters.status"
          @change="$emit('update-filter', { key: 'status', value: $event.target.value || null })"
          class="w-full glass-input appearance-none pl-4 pr-10 py-2.5 rounded-lg text-body-sm text-on-surface bg-transparent cursor-pointer"
        >
          <option :value="null">Tất cả trạng thái</option>
          <option value="ChuaTT">Chưa thanh toán</option>
          <option value="DangTT">Đang thanh toán</option>
          <option value="HoanTat">Đã hoàn tất</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </div>

    <!-- Invoices Data Table -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
      <div v-if="loading" class="p-12 space-y-4 animate-pulse">
        <div class="h-8 bg-surface-container-high rounded w-full"></div>
        <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 3" :key="i"></div>
      </div>

      <!-- Desktop Table (hidden on mobile) -->
      <div v-else-if="paymentsList.length > 0" class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-high">
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap">Mã phiếu</th>
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap">Học viên</th>
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap">Lớp / Môn học</th>
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap text-right">Học phí</th>
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap text-right">Đã đóng</th>
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap text-right">Còn thiếu</th>
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap">Hạn đóng</th>
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap">Trạng thái</th>
              <th class="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="font-body-sm text-body-sm">
            <tr
              v-for="p in paymentsList"
              :key="p.paymentId"
              class="border-t border-outline-variant/30 hover:bg-white/40 transition-colors group"
            >
              <td class="py-4 px-6 font-semibold text-primary-container">PAY-{{ String(p.paymentId).padStart(4, '0') }}</td>
              <td class="py-4 px-6 font-semibold text-on-surface">{{ p.studentName }}</td>
              <td class="py-4 px-6">
                <div class="font-semibold text-on-surface">{{ p.className }}</div>
                <div class="text-[11px] text-on-surface-variant truncate max-w-xs">{{ p.courseName }}</div>
              </td>
              <td class="py-4 px-6 text-right font-semibold text-on-surface">{{ formatCurrency(p.totalAmount) }}</td>
              <td class="py-4 px-6 text-right font-semibold text-emerald-600">{{ formatCurrency(p.paidAmount) }}</td>
              <td class="py-4 px-6 text-right font-semibold text-error">{{ formatCurrency(p.remainingAmount) }}</td>
              <td class="py-4 px-6 text-on-surface-variant">{{ formatDate(p.dueDate) }}</td>
              <td class="py-4 px-6">
                <span :class="['status-badge', getPaymentStatusBadgeClass(p.status)]">
                  {{ getPaymentStatusLabel(p.status) }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="$emit('open-history-modal', p)"
                    class="w-8 h-8 rounded-lg bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container flex items-center justify-center transition-colors cursor-pointer"
                    title="Xem lịch sử giao dịch"
                  >
                    <span class="material-symbols-outlined text-[18px]">history</span>
                  </button>
                  <button
                    v-if="p.status !== 'HoanTat'"
                    @click="$emit('open-manual-payment-modal', p)"
                    class="w-8 h-8 rounded-lg bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container flex items-center justify-center transition-colors cursor-pointer"
                    title="Ghi nhận thanh toán"
                  >
                    <span class="material-symbols-outlined text-[18px]">price_check</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card List (hidden on desktop) -->
      <div v-else-if="paymentsList.length > 0" class="md:hidden divide-y divide-outline-variant/20">
        <div
          v-for="p in paymentsList"
          :key="p.paymentId"
          class="p-4 space-y-3 hover:bg-white/40 transition-colors"
        >
          <div class="flex justify-between items-start">
            <span class="font-mono font-bold text-primary-container">PAY-{{ String(p.paymentId).padStart(4, '0') }}</span>
            <span :class="['status-badge', getPaymentStatusBadgeClass(p.status), 'text-[10px] font-bold']">
              {{ getPaymentStatusLabel(p.status) }}
            </span>
          </div>
          <div class="space-y-1">
            <div class="text-body-sm font-bold text-on-surface">Học viên: {{ p.studentName }}</div>
            <div class="text-body-sm text-on-surface">Lớp: {{ p.className }}</div>
            <div class="text-[11px] text-on-surface-variant/80">{{ p.courseName }}</div>
          </div>
          <div class="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/10 text-body-sm">
            <div>
              <div class="text-on-surface-variant text-[11px] font-medium">Học phí</div>
              <div class="font-bold text-primary-container">{{ formatCurrency(p.totalAmount) }}</div>
            </div>
            <div>
              <div class="text-on-surface-variant text-[11px] font-medium">Đã đóng</div>
              <div class="font-bold text-emerald-600">{{ formatCurrency(p.paidAmount) }}</div>
            </div>
            <div>
              <div class="text-on-surface-variant text-[11px] font-medium">Còn thiếu</div>
              <div class="font-bold text-error">{{ formatCurrency(p.remainingAmount) }}</div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-2">
            <span class="text-body-sm text-on-surface-variant">Hạn: {{ formatDate(p.dueDate) }}</span>
            <div class="flex items-center gap-2">
              <button
                @click="$emit('open-history-modal', p)"
                class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-on-tertiary-container flex items-center justify-center border border-white/40 shadow-sm transition-colors text-body-sm gap-1 font-semibold cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]">history</span>
                Giao dịch
              </button>
              <button
                v-if="p.status !== 'HoanTat'"
                @click="$emit('open-manual-payment-modal', p)"
                class="px-3 py-1.5 rounded-lg bg-on-tertiary-container text-white hover:bg-primary flex items-center justify-center transition-colors text-body-sm gap-1 font-semibold cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]">price_check</span>
                Thu tiền
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-outline/30 text-[64px] mb-4">receipt_long</span>
        <p class="text-body-lg text-on-surface-variant font-medium">Không tìm thấy hóa đơn học phí nào phù hợp</p>
      </div>

      <!-- Pagination Footer -->
      <div v-if="paymentsList.length > 0" class="p-4 border-t border-outline-variant/30 flex justify-between items-center text-body-sm text-on-surface-variant bg-surface/50">
        <span>Hiển thị {{ (pagination.page - 1) * pagination.pageSize + 1 }} - {{ Math.min(pagination.page * pagination.pageSize, totalPaymentsCount) }} trong số {{ totalPaymentsCount }} hóa đơn</span>
        <div class="flex items-center gap-2">
          <button
            @click="$emit('prev-page')"
            :disabled="pagination.page === 1"
            class="px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white border border-outline-variant/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <span class="px-3 font-semibold text-primary-container">Trang {{ pagination.page }} / {{ totalInvoicesPages }}</span>
          <button
            @click="$emit('next-page')"
            :disabled="pagination.page >= totalInvoicesPages"
            class="px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white border border-outline-variant/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filters: { type: Object, required: true },
  paymentsList: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  pagination: { type: Object, required: true },
  totalPaymentsCount: { type: Number, required: true },
  totalInvoicesPages: { type: Number, required: true }
})

defineEmits([
  'update-filter',
  'open-history-modal',
  'open-manual-payment-modal',
  'prev-page',
  'next-page'
])

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

function getPaymentStatusBadgeClass(status) {
  const map = { ChuaTT: 'status-cancelled', DangTT: 'status-inprogress', HoanTat: 'status-completed' }
  return map[status] || 'status-completed'
}

function getPaymentStatusLabel(status) {
  const map = { ChuaTT: 'Chưa thanh toán', DangTT: 'Đang đóng học phí', HoanTat: 'Đã hoàn thành' }
  return map[status] || status
}
</script>
