<template>
  <teleport to="body">
    <div v-if="show" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
      <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-2xl max-w-2xl w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
        <div class="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-on-tertiary-container">history</span>
            Lịch sử giao dịch: PAY-{{ String(payment?.paymentId).padStart(4,'0') }}
          </h3>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-primary-container transition-colors cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          <div v-if="loading" class="text-center py-8">
            <span class="animate-spin inline-block w-8 h-8 border-4 border-on-tertiary-container border-t-transparent rounded-full"></span>
            <p class="mt-2 text-body-sm text-on-surface-variant">Đang tải lịch sử giao dịch...</p>
          </div>
          
          <div v-else-if="transactionHistory.length > 0" class="space-y-3">
            <div
              v-for="t in transactionHistory"
              :key="t.transactionId"
              class="bg-white/50 backdrop-blur-[10px] border border-white/30 shadow-sm p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-lg text-emerald-600">+{{ formatCurrency(t.amount) }}</span>
                  <span class="px-2 py-0.5 rounded bg-surface border border-outline-variant/20 text-[10px] font-semibold uppercase text-on-surface">
                    {{ getMethodLabel(t.paymentMethod) }}
                  </span>
                </div>
                <div class="text-[11px] text-on-surface-variant mt-1">Giao dịch: {{ formatDate(t.paidAt) }} | Người duyệt: {{ t.receivedByName || 'Hệ thống' }}</div>
                <div class="text-body-sm text-on-surface mt-1.5 italic" v-if="t.note">
                  "{{ t.note }}"
                </div>
              </div>
              <span class="text-[10px] font-mono text-on-surface-variant bg-surface/60 px-2 py-1 rounded">
                TX-{{ String(t.transactionId).padStart(4, '0') }}
              </span>
            </div>
          </div>

          <div v-else class="text-center py-12 bg-surface/30 rounded-xl border border-outline-variant/20">
            <span class="material-symbols-outlined text-outline/30 text-[48px] mb-2">payments</span>
            <p class="text-body-sm text-on-surface-variant font-medium">Chưa có giao dịch đóng học phí nào cho phiếu này.</p>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end bg-surface/30">
          <button
            @click="$emit('close')"
            class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors cursor-pointer"
          >
            Đóng
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

defineEmits(['close'])

const showSnackbar = inject('showSnackbar')
const transactionHistory = ref([])
const loading = ref(false)

watch(() => props.show, async (newVal) => {
  if (newVal && props.payment) {
    await fetchHistory()
  }
})

async function fetchHistory() {
  if (!props.payment) return
  loading.value = true
  try {
    const id = props.payment.paymentId
    const { data } = await api.get(`/api/v1/payments/${id}/transactions`)
    transactionHistory.value = data || []
  } catch (e) {
    showSnackbar('Lỗi tải lịch sử giao dịch', 'error')
  } finally {
    loading.value = false
  }
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

function getMethodLabel(method) {
  const map = { TienMat: 'Tiền mặt', ChuyenKhoan: 'Chuyển khoản', TheTD: 'Thẻ tín dụng' }
  return map[method] || method
}
</script>
