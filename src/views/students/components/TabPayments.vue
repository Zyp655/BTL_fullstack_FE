<template>
  <div class="space-y-4">
    <h3 class="font-title-md text-body-lg font-semibold text-primary-container flex items-center gap-2">
      <span class="material-symbols-outlined text-[20px] text-amber-500">receipt_long</span>
      Danh sách phiếu học phí & Lịch sử đóng học phí
    </h3>

    <div v-if="payments.length === 0" class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-8 text-center rounded-xl text-on-surface-variant">
      Bạn chưa có phiếu thu học phí nào trên hệ thống.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="pay in payments"
        :key="pay.paymentId"
        class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.05)]"
      >
        <!-- Header payment info -->
        <div class="bg-primary-container/5 px-5 py-4 border-b border-white/40 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-primary-container text-body-lg">{{ pay.className }}</span>
              <span :class="[getPaymentStatusClass(pay.status), 'status-badge text-[10px] font-bold']">
                {{ getPaymentStatusLabel(pay.status) }}
              </span>
              <button
                v-if="authStore.isAdmin && pay.status !== 'HoanTat'"
                @click="$emit('open-payment-modal', pay)"
                class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
              >
                <span class="material-symbols-outlined text-[15px]">add_card</span>
                Ghi nhận thanh toán
              </button>
            </div>
            <div class="text-body-sm text-on-surface-variant">Môn học: {{ pay.courseName }}</div>
            <div class="text-body-sm text-on-surface-variant/70">Mã hóa đơn: <span class="font-mono font-bold">PAY{{ pay.paymentId }}</span></div>
          </div>
          <div class="text-left sm:text-right space-y-0.5">
            <div class="text-body-sm text-on-surface-variant">Hạn chót đóng: <span class="font-semibold text-primary-container">{{ formatDate(pay.dueDate) }}</span></div>
            <div class="text-body-sm text-on-surface-variant">
              Cần thanh toán: <span class="font-bold text-primary-container">{{ formatCurrency(pay.totalAmount) }}</span>
            </div>
            <div v-if="pay.remainingAmount > 0" class="text-body-sm font-bold text-error">
              Còn nợ: {{ formatCurrency(pay.remainingAmount) }}
            </div>
          </div>
        </div>

        <!-- SePay Dynamic QR Payment for Students (Unpaid/Partially Paid) -->
        <div v-if="!authStore.isAdmin && pay.status !== 'HoanTat'" class="p-5 border-b border-dashed border-outline-variant/30 bg-amber-500/[0.02] flex flex-col md:flex-row items-center gap-6 animate-fade-in">
          <div class="w-full md:w-auto shrink-0 flex flex-col items-center gap-2">
            <!-- Dynamic QR Code using VietQR -->
            <div class="relative bg-white p-3 rounded-xl shadow-md border border-outline-variant/20 max-w-[180px]">
              <img 
                :src="`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${pay.remainingAmount}&addInfo=PAY${pay.paymentId}`" 
                alt="Quét mã VietQR" 
                class="w-full h-auto"
              />
            </div>
            <span class="text-[11px] text-on-surface-variant/70 font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-emerald-600 font-bold">qr_code_scanner</span>
              Quét QR để nhập tự động
            </span>
          </div>

          <div class="flex-1 space-y-3 w-full">
            <h4 class="font-title-sm text-body-md font-bold text-primary-container flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">account_balance</span>
              Thông tin chuyển khoản học phí tự động (SePay)
            </h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm">
              <div class="p-3 bg-white/40 rounded-lg border border-white/20">
                <span class="text-on-surface-variant block text-[11px]">Ngân hàng</span>
                <span class="font-bold text-primary-container">{{ BANK_NAME }}</span>
              </div>
              <div class="p-3 bg-white/40 rounded-lg border border-white/20 flex justify-between items-center">
                <div>
                  <span class="text-on-surface-variant block text-[11px]">Số tài khoản</span>
                  <span class="font-mono font-bold text-primary-container">{{ ACCOUNT_NO }}</span>
                </div>
                <button @click="copyToClipboard(ACCOUNT_NO)" class="text-on-tertiary-container hover:text-primary transition-colors cursor-pointer" title="Sao chép số tài khoản">
                  <span class="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
              <div class="p-3 bg-white/40 rounded-lg border border-white/20 flex justify-between items-center">
                <div>
                  <span class="text-on-surface-variant block text-[11px]">Số tiền cần nộp</span>
                  <span class="font-bold text-emerald-600">{{ formatCurrency(pay.remainingAmount) }}</span>
                </div>
                <button @click="copyToClipboard(pay.remainingAmount)" class="text-on-tertiary-container hover:text-primary transition-colors cursor-pointer" title="Sao chép số tiền">
                  <span class="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
              <div class="p-3 bg-amber-500/[0.05] rounded-lg border border-amber-500/20 flex justify-between items-center">
                <div>
                  <span class="text-amber-800 block text-[11px] font-semibold">Nội dung chuyển khoản (bắt buộc)</span>
                  <span class="font-mono font-bold text-amber-700">PAY{{ pay.paymentId }}</span>
                </div>
                <button @click="copyToClipboard('PAY' + pay.paymentId)" class="text-amber-700 hover:text-amber-900 transition-colors cursor-pointer" title="Sao chép nội dung">
                  <span class="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div class="p-2.5 bg-emerald-500/[0.05] rounded-lg border border-emerald-500/20 text-[11px] text-emerald-800 flex items-start gap-1.5 flex-1">
                <span class="material-symbols-outlined text-[15px] text-emerald-600 shrink-0">info</span>
                <span>Giao dịch sẽ được gạch nợ tự động sau khoảng 10 giây kể từ khi chuyển khoản thành công với đúng nội dung ở trên.</span>
              </div>
              <button 
                @click="checkTransaction"
                :disabled="isChecking"
                class="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-body-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <span v-if="isChecking" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span v-else class="material-symbols-outlined text-[18px]">sync</span>
                {{ isChecking ? 'Đang kiểm tra...' : 'Tôi đã chuyển khoản' }}
              </button>
            </div>
          </div>
        </div>

        <!-- SePay Payment Success Notification for Students (Completed) -->
        <div v-if="!authStore.isAdmin && pay.status === 'HoanTat'" class="p-5 border-b border-dashed border-emerald-500/30 bg-emerald-500/[0.02] flex items-center justify-between gap-4 animate-fade-in">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px] font-bold">check_circle</span>
            </div>
            <div>
              <h4 class="font-bold text-emerald-700 text-body-md">Thanh toán thành công!</h4>
              <p class="text-body-sm text-emerald-600/80">Cảm ơn bạn, học phí của lớp học này đã được ghi nhận hoàn tất tự động qua cổng SePay.</p>
            </div>
          </div>
          <span class="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-body-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
            Hoàn tất
          </span>
        </div>

        <!-- Transaction list for this payment -->
        <div class="p-4 space-y-2">
          <div class="text-body-sm font-semibold text-primary-container mb-2 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">history</span>
            Chi tiết đóng tiền
          </div>
          
          <div v-if="pay.transactions.length === 0" class="text-center py-4 text-body-sm text-on-surface-variant">
            Chưa ghi nhận giao dịch thanh toán nào cho hóa đơn này.
          </div>
          
          <div v-else class="space-y-2">
            <div
              v-for="tx in pay.transactions"
              :key="tx.transactionId"
              class="bg-white/50 backdrop-blur-[10px] p-3 rounded-lg border border-white/40 flex justify-between items-center text-body-sm"
            >
              <div class="space-y-0.5">
                <div class="font-bold text-primary-container">Số tiền: {{ formatCurrency(tx.amount) }}</div>
                <div class="text-on-surface-variant">Phương thức: {{ formatPaymentMethod(tx.paymentMethod) }}</div>
                <div class="text-on-surface-variant/80">Thời gian: {{ formatDateTime(tx.paidAt) }}</div>
                <div v-if="tx.note" class="text-on-surface-variant/70 italic">Ghi chú: {{ tx.note }}</div>
              </div>
              <div class="text-right text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Đã thu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useAuthStore } from '../../../stores'

const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')

// Cấu hình thông tin tài khoản nhận tiền SePay từ file môi trường .env
const BANK_ID = import.meta.env.VITE_BANK_ID || 'MB'
const BANK_NAME = import.meta.env.VITE_BANK_NAME || 'MBBank (Ngân hàng Quân Đội)'
const ACCOUNT_NO = import.meta.env.VITE_ACCOUNT_NO || '0356075607'
const ACCOUNT_NAME = import.meta.env.VITE_ACCOUNT_NAME || 'NGUYEN DINH MINH HIEU'

const isChecking = ref(false)

const emit = defineEmits(['open-payment-modal', 'refresh-payments'])

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    if (showSnackbar) {
      showSnackbar('Đã sao chép vào bộ nhớ tạm!', 'success')
    }
  }).catch(err => {
    console.error('Lỗi sao chép:', err)
  })
}

function checkTransaction() {
  isChecking.value = true
  emit('refresh-payments')
  
  setTimeout(() => {
    isChecking.value = false
    if (showSnackbar) {
      showSnackbar('Đã làm mới thông tin thanh toán từ hệ thống!', 'success')
    }
  }, 2000)
}

defineProps({
  payments: { type: Array, required: true }
})

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleString('vi-VN')
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}

function getPaymentStatusClass(status) {
  const map = { ChuaTT: 'status-cancelled', DangTT: 'status-inprogress', HoanTat: 'status-completed' }
  return map[status] || 'status-completed'
}

function getPaymentStatusLabel(status) {
  const map = { ChuaTT: 'Chưa thanh toán', DangTT: 'Đang đóng học phí', HoanTat: 'Đã hoàn thành' }
  return map[status] || status
}

function formatPaymentMethod(method) {
  const map = { TienMat: 'Tiền mặt', ChuyenKhoan: 'Chuyển khoản', TheTD: 'Thẻ tín dụng' }
  return map[method] || method
}
</script>
