<template>
  <teleport to="body">
    <div v-if="show" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-2xl max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
        <div class="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-on-tertiary-container">price_check</span>
            Ghi nhận thanh toán thủ công
          </h3>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-primary-container transition-colors cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="bg-surface/60 p-4 rounded-xl border border-outline-variant/20 text-body-sm space-y-2">
            <div>Hóa đơn: <strong class="text-primary-container">PAY-{{ String(payment?.paymentId).padStart(4,'0') }}</strong></div>
            <div>Học viên: <span class="font-semibold text-on-surface">{{ payment?.studentName }}</span></div>
            <div>Học phí: <span class="font-semibold text-on-surface">{{ formatCurrency(payment?.totalAmount) }}</span></div>
            <div class="flex justify-between border-t border-outline-variant/20 pt-2 text-[13px]">
              <span>Đã đóng: <strong class="text-emerald-600">{{ formatCurrency(payment?.paidAmount) }}</strong></span>
              <span>Còn thiếu: <strong class="text-error">{{ formatCurrency(payment?.remainingAmount) }}</strong></span>
            </div>
          </div>

          <!-- Transaction Form -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Amount to Pay (Enforced 100% full payment) -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Số tiền thanh toán (VND)</label>
              <div class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-on-surface font-bold bg-surface/30 border border-outline-variant/20 select-none flex items-center justify-between">
                <span>{{ formatCurrency(payment?.remainingAmount) }}</span>
                <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">Thanh toán 100%</span>
              </div>
            </div>
            
            <!-- Method select -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Phương thức thanh toán *</label>
              <div class="relative">
                <select
                  v-model="transactionForm.paymentMethod"
                  class="w-full glass-input appearance-none px-4 py-2.5 rounded-lg text-body-sm text-on-surface bg-transparent cursor-pointer"
                >
                  <option value="TienMat">Tiền mặt</option>
                  <option value="ChuyenKhoan">Chuyển khoản ngân hàng</option>
                  <option value="TheTD">Thẻ tín dụng</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <!-- Notes -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-on-surface">Ghi chú giao dịch</label>
              <input
                v-model="transactionForm.note"
                type="text"
                class="w-full glass-input px-4 py-2.5 rounded-lg text-body-sm text-on-surface"
                placeholder="Ví dụ: Đóng học phí đợt 1"
              />
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface/30">
          <button
            @click="$emit('close')"
            class="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            @click="submitManualPayment"
            :disabled="submitting || !transactionForm.amount || transactionForm.amount <= 0"
            class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer animate-press"
          >
            <span v-if="submitting" class="animate-spin w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full"></span>
            Ghi nhận đóng tiền
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import api from '../../../services/api'

const props = defineProps({
  show: { type: Boolean, required: true },
  payment: { type: Object, default: null }
})

const emit = defineEmits(['close', 'success'])
const showSnackbar = inject('showSnackbar')

const submitting = ref(false)
const transactionForm = ref({
  amount: '',
  paymentMethod: 'TienMat',
  note: ''
})

watch(() => props.show, (newVal) => {
  if (newVal && props.payment) {
    transactionForm.value = {
      amount: props.payment.remainingAmount,
      paymentMethod: 'TienMat',
      note: `Thu học phí lớp ${props.payment.className}`
    }
  }
})

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}

async function submitManualPayment() {
  if (!props.payment) return
  submitting.value = true
  try {
    const id = props.payment.paymentId
    await api.post(`/api/v1/payments/${id}/transactions`, {
      amount: Number(transactionForm.value.amount),
      paymentMethod: transactionForm.value.paymentMethod,
      note: transactionForm.value.note || null
    })
    
    showSnackbar('Ghi nhận giao dịch đóng tiền thành công', 'success')
    emit('success')
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Lỗi ghi nhận giao dịch', 'error')
  } finally {
    submitting.value = false
  }
}
</script>
