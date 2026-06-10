<template>
  <div class="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-gutter pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
    <div class="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 xl:p-gutter flex items-center gap-3 sm:gap-4 snap-start">
      <div class="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-[24px]">payments</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="font-bold text-lg sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl text-primary-container truncate" :title="formatCurrency(dashboardStats.totalRevenue)">
          {{ formatCurrency(dashboardStats.totalRevenue) }}
        </div>
        <div class="text-body-sm text-on-surface-variant font-medium truncate">Doanh thu đã thu</div>
      </div>
    </div>

    <div class="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 xl:p-gutter flex items-center gap-3 sm:gap-4 snap-start">
      <div class="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-[24px]">money_off</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="font-bold text-lg sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl text-primary-container truncate" :title="formatCurrency(dashboardStats.totalDebt)">
          {{ formatCurrency(dashboardStats.totalDebt) }}
        </div>
        <div class="text-body-sm text-on-surface-variant font-medium truncate">Tổng công nợ còn thiếu</div>
      </div>
    </div>

    <div class="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 xl:p-gutter flex items-center gap-3 sm:gap-4 snap-start">
      <div class="w-12 h-12 rounded-full bg-on-tertiary-container/10 text-on-tertiary-container flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-[24px]">description</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="font-bold text-lg sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl text-primary-container truncate" :title="dashboardStats.totalPayments">
          {{ dashboardStats.totalPayments }}
        </div>
        <div class="text-body-sm text-on-surface-variant font-medium truncate">Tổng số hóa đơn phát hành</div>
      </div>
    </div>

    <div class="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 xl:p-gutter flex items-center gap-3 sm:gap-4 snap-start">
      <div class="w-12 h-12 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-[24px]">percent</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="font-bold text-lg sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl text-primary-container truncate" :title="paymentCompletionRate + '%'">
          {{ paymentCompletionRate }}%
        </div>
        <div class="text-body-sm text-on-surface-variant font-medium truncate">Tỷ lệ thanh toán hoàn tất</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dashboardStats: { type: Object, required: true },
  paymentCompletionRate: { type: Number, required: true }
})

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}
</script>
