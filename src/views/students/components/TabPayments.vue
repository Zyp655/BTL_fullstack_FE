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
            <div v-if="pay.status !== 'HoanTat'" class="text-body-sm text-on-surface-variant">Hạn chót đóng: <span class="font-semibold text-primary-container">{{ formatDate(pay.dueDate) }}</span></div>
            <div v-if="pay.status === 'HoanTat'" class="text-body-sm font-bold text-emerald-600">
              Hoàn tất
            </div>
            <div v-else class="text-body-sm text-on-surface-variant">
              Cần thanh toán: <span class="font-bold text-primary-container">{{ formatCurrency(pay.totalAmount) }}</span>
            </div>
            <div v-if="pay.status !== 'HoanTat' && pay.remainingAmount > 0" class="text-body-sm font-bold text-error">
              Còn nợ: {{ formatCurrency(pay.remainingAmount) }}
            </div>
          </div>
        </div>

        <!-- SePay Dynamic QR Payment for Students (Unpaid/Partially Paid) -->
        <!-- Payment Banner Inline -->
        <div v-if="!authStore.isAdmin && pay.status !== 'HoanTat'" class="p-5 border-b border-dashed border-outline-variant/30 bg-primary-container/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
            <div class="text-left">
              <h4 class="font-bold text-primary-container text-body-md">Thanh toán học phí trực tuyến tự động</h4>
              <p class="text-body-sm text-on-surface-variant">Hỗ trợ chuyển khoản quét mã VietQR tự động khớp và gạch nợ sau 10 giây qua SePay.</p>
            </div>
          </div>
          <button
            @click="openPaymentQr(pay)"
            class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-body-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
          >
            <span class="material-symbols-outlined text-[18px]">payment</span>
            Thanh toán ngay
          </button>
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
        <div class="p-4 border-t border-white/40 bg-primary-container/[0.01]">
          <button
            @click="openDetailModal(pay)"
            class="w-full flex items-center justify-between text-body-sm font-semibold text-primary-container hover:text-primary-container/80 transition-colors cursor-pointer py-1"
          >
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">history</span>
              Chi tiết đóng tiền
            </div>
            <div class="flex items-center gap-1 text-body-xs text-on-surface-variant font-normal">
              <span>Xem chi tiết</span>
              <span class="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog: Mã QR thanh toán học phí -->
  <teleport to="body">
    <div v-if="showQrModal && activePayment" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-2xl w-full overflow-hidden animate-scale-in flex flex-col">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between bg-primary-container/5">
          <h3 class="font-title-md text-[18px] font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[24px] text-amber-500 font-bold">account_balance</span>
            Thanh toán chuyển khoản học phí trực tuyến
          </h3>
          <button @click="closeQrModal" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 flex-grow flex flex-col">
          <div v-if="loadingCheckout" class="flex-grow flex flex-col items-center justify-center py-12 space-y-3">
            <div class="w-10 h-10 border-4 border-primary-container/30 border-t-primary-container rounded-full animate-spin"></div>
            <p class="text-body-xs font-bold text-primary-container">Đang kết nối cổng thanh toán...</p>
          </div>

          <div v-else-if="checkoutInfo" class="flex flex-col md:flex-row items-center gap-6 animate-fade-in">
            <!-- QR Section (Left) -->
            <div class="w-full md:w-auto shrink-0 flex flex-col items-center gap-3">
              <div class="relative bg-white p-3 rounded-2xl shadow-md border border-outline-variant/10 max-w-[240px] w-full min-h-[240px] flex items-center justify-center">
                <!-- QR Code image -->
                <img
                  v-if="!isExpired"
                  :src="checkoutInfo.qrUrl"
                  alt="Mã QR thanh toán"
                  class="w-full h-auto rounded-lg transition-opacity duration-300"
                />
                
                <!-- Expired overlay -->
                <div v-else class="w-[180px] h-[180px] flex flex-col items-center justify-center text-center gap-2 bg-error/[0.02] p-2 text-error">
                  <span class="material-symbols-outlined text-[40px] text-error/80 animate-pulse">timer_off</span>
                  <div class="text-body-xs font-bold">Mã QR hết hiệu lực</div>
                </div>
              </div>
              
              <!-- Countdown timer -->
              <div 
                v-if="!isExpired"
                class="px-3 py-1.5 rounded-full text-body-xs font-bold flex items-center gap-1.5"
                :class="timeLeft < 60 ? 'bg-error/10 text-error animate-pulse' : 'bg-amber-500/10 text-amber-700'"
              >
                <span class="material-symbols-outlined text-[14px]">schedule</span>
                Hết hạn sau: {{ formatTimeLeft }}
              </div>
              <button
                v-else
                @click="startTimer"
                class="px-4 py-1.5 rounded-lg bg-primary-container text-white font-semibold text-[11px] hover:bg-primary transition-all active:scale-95 cursor-pointer shadow-sm flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-[14px]">refresh</span>
                Tạo mã mới
              </button>
            </div>

            <!-- Details Section (Right) -->
            <div class="flex-1 space-y-4 w-full">
              <div class="p-3 bg-emerald-500/[0.05] rounded-xl border border-emerald-500/20 text-body-xs text-emerald-800 flex items-start gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-emerald-600 shrink-0 mt-0.5">info</span>
                <span>Vui lòng quét VietQR bằng ứng dụng ngân hàng. Cổng SePay sẽ tự động ghi nhận và kích hoạt lớp học sau khi giao dịch hoàn tất.</span>
              </div>

              <!-- Branded Details Fields -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm">
                <div class="p-3 bg-white/50 rounded-lg border border-outline-variant/10">
                  <span class="text-on-surface-variant block text-[11px] font-medium">Ngân hàng nhận</span>
                  <span class="font-bold text-primary-container">{{ checkoutInfo.bankName }}</span>
                </div>
                
                <div class="p-3 bg-white/50 rounded-lg border border-outline-variant/10 flex justify-between items-center">
                  <div>
                    <span class="text-on-surface-variant block text-[11px] font-medium">Số tài khoản nhận</span>
                    <span class="font-mono font-bold text-primary-container">{{ checkoutInfo.accountNo }}</span>
                  </div>
                  <button @click="copyToClipboard(checkoutInfo.accountNo)" class="text-on-tertiary-container hover:text-primary transition-colors cursor-pointer" title="Sao chép">
                    <span class="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>

                <div class="p-3 bg-white/50 rounded-lg border border-outline-variant/10 flex justify-between items-center">
                  <div>
                    <span class="text-on-surface-variant block text-[11px] font-medium">Số tiền cần nộp</span>
                    <span class="font-bold text-emerald-600">{{ formatCurrency(checkoutInfo.remainingAmount) }}</span>
                  </div>
                  <button @click="copyToClipboard(checkoutInfo.remainingAmount)" class="text-on-tertiary-container hover:text-primary transition-colors cursor-pointer" title="Sao chép">
                    <span class="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>

                <div class="p-3 bg-amber-500/[0.04] rounded-lg border border-amber-500/20 flex justify-between items-center">
                  <div>
                    <span class="text-amber-800 block text-[11px] font-bold">Nội dung chuyển khoản (bắt buộc)</span>
                    <span class="font-mono font-bold text-amber-700">{{ checkoutInfo.paymentCode }}</span>
                  </div>
                  <button @click="copyToClipboard(checkoutInfo.paymentCode)" class="text-amber-700 hover:text-amber-900 transition-colors cursor-pointer" title="Sao chép">
                    <span class="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>
              </div>


            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-white/40 flex justify-end gap-3 bg-white/20">
          <button
            @click="closeQrModal"
            class="px-5 py-2.5 rounded-lg bg-transparent text-on-surface-variant border border-outline-variant font-semibold text-[13px] hover:bg-surface-container transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button 
            @click="checkTransaction"
            :disabled="isChecking"
            class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="isChecking" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else class="material-symbols-outlined text-[16px]">sync</span>
            {{ isChecking ? 'Đang đối soát...' : 'Tôi đã chuyển khoản' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>

  <!-- Dialog: Chi tiết đóng tiền (Lịch sử giao dịch) -->
  <teleport to="body">
    <div v-if="showDetailModal && detailPayment" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 rounded-2xl shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-xl w-full overflow-hidden animate-scale-in flex flex-col">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-white/40 flex items-center justify-between bg-primary-container/5">
          <h3 class="font-title-md text-[18px] font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-[24px] text-amber-500 font-bold">history</span>
            Chi tiết đóng tiền
          </h3>
          <button @click="closeDetailModal" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 flex-grow flex flex-col space-y-4">
          <!-- Thông tin hóa đơn/lớp học -->
          <div class="p-4 bg-primary-container/5 rounded-xl border border-white/40 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-body-sm font-semibold text-primary-container">{{ detailPayment.className }}</span>
              <span :class="[getPaymentStatusClass(detailPayment.status), 'status-badge text-[10px] font-bold']">
                {{ getPaymentStatusLabel(detailPayment.status) }}
              </span>
            </div>
            <div class="text-body-sm text-on-surface-variant">Môn học: {{ detailPayment.courseName }}</div>
            <div class="text-body-sm text-on-surface-variant/70">Mã hóa đơn: <span class="font-mono font-bold">PAY{{ detailPayment.paymentId }}</span></div>
            <div class="border-t border-outline-variant/20 pt-2 grid grid-cols-2 gap-2 text-body-sm">
              <div>
                <span class="text-on-surface-variant/70 block text-[11px]">Tổng học phí:</span>
                <span class="font-bold text-primary-container">{{ formatCurrency(detailPayment.totalAmount) }}</span>
              </div>
              <div v-if="detailPayment.status !== 'HoanTat'">
                <span class="text-on-surface-variant/70 block text-[11px]">Còn nợ:</span>
                <span class="font-bold text-error">{{ formatCurrency(detailPayment.remainingAmount) }}</span>
              </div>
              <div v-else>
                <span class="text-on-surface-variant/70 block text-[11px]">Trạng thái:</span>
                <span class="font-bold text-emerald-600">Đã hoàn thành</span>
              </div>
            </div>
          </div>

          <!-- Lịch sử giao dịch -->
          <div class="flex-grow overflow-y-auto max-h-[300px] space-y-3">
            <h4 class="font-bold text-primary-container text-body-md">Lịch sử giao dịch</h4>
            <div v-if="detailPayment.transactions.length === 0" class="text-center py-6 text-body-sm text-on-surface-variant bg-white/50 rounded-lg border border-outline-variant/10">
              Chưa ghi nhận giao dịch thanh toán nào cho hóa đơn này.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="tx in detailPayment.transactions"
                :key="tx.transactionId"
                class="bg-white/50 backdrop-blur-[10px] p-3 rounded-lg border border-outline-variant/10 flex justify-between items-center text-body-sm"
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

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-white/40 flex justify-end bg-white/20">
          <button
            @click="closeDetailModal"
            class="px-5 py-2.5 rounded-lg bg-transparent text-on-surface-variant border border-outline-variant font-semibold text-[13px] hover:bg-surface-container transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { inject, ref, computed, onUnmounted, watch } from 'vue'
import { useAuthStore } from '../../../stores'
import api from '../../../services/api'

const authStore = useAuthStore()
const showSnackbar = inject('showSnackbar')

const selectedGateway = ref('SePay')
const checkoutInfo = ref(null)
const loadingCheckout = ref(false)

const isChecking = ref(false)
const showQrModal = ref(false)
const activePayment = ref(null)
const timeLeft = ref(600)
let timerInterval = null

const showDetailModal = ref(false)
const detailPayment = ref(null)

const openDetailModal = (payment) => {
  detailPayment.value = payment
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  detailPayment.value = null
}

const emit = defineEmits(['open-payment-modal', 'refresh-payments'])

const loadCheckoutInfo = async () => {
  if (!activePayment.value) return
  loadingCheckout.value = true
  try {
    const res = await api.get(`/api/v1/payments/${activePayment.value.paymentId}/checkout`, {
      params: { gateway: selectedGateway.value }
    })
    checkoutInfo.value = res.data
    startTimer()
  } catch (err) {
    console.error('Error fetching checkout info:', err)
    if (showSnackbar) {
      showSnackbar(err.response?.data?.message || 'Không thể tạo mã thanh toán.', 'error')
    }
  } finally {
    loadingCheckout.value = false
  }
}

watch(selectedGateway, () => {
  loadCheckoutInfo()
})

const startTimer = () => {
  clearInterval(timerInterval)
  timeLeft.value = 600
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

let pollInterval = null

const startPolling = () => {
  clearInterval(pollInterval)
  pollInterval = setInterval(() => {
    emit('refresh-payments')
  }, 4000)
}

const stopPolling = () => {
  clearInterval(pollInterval)
}

const openPaymentQr = (payment) => {
  activePayment.value = payment
  selectedGateway.value = 'SePay'
  showQrModal.value = true
  loadCheckoutInfo()
  startPolling()
}

const closeQrModal = () => {
  showQrModal.value = false
  activePayment.value = null
  checkoutInfo.value = null
  clearInterval(timerInterval)
  stopPolling()
}

const formatTimeLeft = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const isExpired = computed(() => timeLeft.value === 0)

onUnmounted(() => {
  clearInterval(timerInterval)
  clearInterval(pollInterval)
})

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

const props = defineProps({
  payments: { type: Array, required: true }
})

watch(() => props.payments, (newPayments) => {
  if (showQrModal.value && activePayment.value) {
    const updatedPayment = newPayments.find(p => p.paymentId === activePayment.value.paymentId)
    if (updatedPayment && updatedPayment.status === 'HoanTat') {
      closeQrModal()
      if (showSnackbar) {
        showSnackbar('Thanh toán học phí thành công! Lớp học đã được kích hoạt.', 'success')
      }
    }
  }
  if (showDetailModal.value && detailPayment.value) {
    const updatedPayment = newPayments.find(p => p.paymentId === detailPayment.value.paymentId)
    if (updatedPayment) {
      detailPayment.value = updatedPayment
    }
  }
}, { deep: true })

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
  const map = { TienMat: 'Tiền mặt', ChuyenKhoan: 'Chuyển khoản', TheTD: 'Thẻ tín dụng', ViDienTu: 'Ví điện tử' }
  return map[method] || method
}
</script>
