<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900 text-white font-sans">
    <!-- Ambient Background Blobs -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div :class="[themeClass.blob1, 'absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-35 transition-all duration-700']"></div>
      <div :class="[themeClass.blob2, 'absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-35 transition-all duration-700']"></div>
    </div>

    <!-- Main Card -->
    <div class="w-full max-w-[500px] bg-slate-800/80 backdrop-blur-[24px] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 relative flex flex-col min-h-[550px]">
      
      <!-- Brand Header -->
      <div :class="[themeClass.headerBg, 'px-6 py-5 flex items-center justify-between text-white border-b border-white/10 transition-colors duration-500']">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-[28px] animate-pulse">payment</span>
          <div>
            <h1 class="font-bold text-[18px] tracking-wide">{{ gatewayName }} Payment Gate</h1>
            <p class="text-[11px] opacity-85 uppercase tracking-wider font-semibold">Cổng thanh toán giả lập</p>
          </div>
        </div>
        <div class="px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold border border-white/20">
          Sandbox
        </div>
      </div>

      <div class="p-6 flex-grow flex flex-col justify-between">
        
        <!-- Loading State -->
        <div v-if="loading" class="flex-grow flex flex-col items-center justify-center py-12 space-y-4">
          <div class="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
          <p class="text-slate-400 text-body-sm font-semibold">Đang tải hóa đơn thanh toán...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex-grow flex flex-col items-center justify-center text-center py-12 space-y-4">
          <span class="material-symbols-outlined text-red-500 text-[64px]">error_med</span>
          <div>
            <h3 class="font-bold text-lg text-white">Giao dịch không hợp lệ</h3>
            <p class="text-slate-400 text-body-sm mt-1">{{ error }}</p>
          </div>
          <button 
            @click="goBack" 
            class="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold text-body-sm transition-colors cursor-pointer"
          >
            Quay lại cổng học tập
          </button>
        </div>

        <!-- Main Invoice Content -->
        <div v-else class="flex-grow flex flex-col justify-between space-y-6">
          
          <!-- Success State -->
          <div v-if="success" class="flex-grow flex flex-col items-center justify-center text-center py-8 space-y-4 animate-scale-in">
            <div class="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span class="material-symbols-outlined text-[48px] font-bold">check</span>
            </div>
            <div>
              <h2 class="font-bold text-2xl text-emerald-400">Thanh Toán Thành Công!</h2>
              <p class="text-slate-300 text-body-sm mt-2">Hóa đơn <strong class="font-mono text-white">{{ invoice.paymentCode }}</strong> đã được khớp nợ tự động.</p>
              <p class="text-slate-400 text-body-xs mt-6 flex items-center justify-center gap-1">
                <span class="animate-spin w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full"></span>
                Tự động quay lại sau {{ countdown }} giây...
              </p>
            </div>
          </div>

          <!-- Checkout Screen Details -->
          <div v-else class="space-y-6 flex-grow flex flex-col justify-between">
            
            <!-- Invoice Details Card -->
            <div class="bg-slate-900/50 p-4 rounded-xl border border-white/5 space-y-3">
              <div class="flex justify-between items-center text-body-sm border-b border-white/5 pb-2">
                <span class="text-slate-400">Lớp học</span>
                <span class="font-semibold text-white text-right">{{ invoice.className }}</span>
              </div>
              <div class="flex justify-between items-center text-body-sm border-b border-white/5 pb-2">
                <span class="text-slate-400">Môn học</span>
                <span class="font-semibold text-white text-right text-slate-300">{{ invoice.courseName }}</span>
              </div>
              <div class="flex justify-between items-center text-body-sm border-b border-white/5 pb-2">
                <span class="text-slate-400">Mã thanh toán</span>
                <span class="font-mono font-bold text-amber-400">{{ invoice.paymentCode }}</span>
              </div>
              <div class="flex justify-between items-center pt-1">
                <span class="text-slate-400 text-body-sm font-semibold">Số tiền cần đóng</span>
                <span class="text-2xl font-black text-emerald-400">{{ formatCurrency(invoice.remainingAmount) }}</span>
              </div>
            </div>

            <!-- QR Section -->
            <div class="flex flex-col items-center space-y-3 py-2">
              <div class="p-3 bg-white rounded-xl shadow-lg border border-white/10 max-w-[200px] aspect-square flex items-center justify-center">
                <img 
                  :src="invoice.qrUrl" 
                  alt="QR Code" 
                  class="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
              <p class="text-slate-400 text-body-xs text-center max-w-xs leading-relaxed">
                Mở ứng dụng {{ gatewayName }} quét mã QR để lấy thông tin tài khoản nhận tiền và số tiền tự động.
              </p>
            </div>

            <!-- Simulation Controls -->
            <div class="space-y-3 pt-4 border-t border-white/5">
              <button 
                @click="simulatePayment" 
                :disabled="submitting"
                :class="[themeClass.btnBg, 'w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer']"
              >
                <span v-if="submitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else class="material-symbols-outlined text-[20px]">check_circle</span>
                XÁC NHẬN THANH TOÁN (GIẢ LẬP GATEWAY)
              </button>
              
              <button 
                @click="goBack" 
                class="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2.5 px-4 rounded-xl text-body-sm transition-colors cursor-pointer"
              >
                Hủy và quay lại
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const submitting = ref(false)
const success = ref(false)
const error = ref(null)
const invoice = ref(null)
const countdown = ref(3)
let countdownInterval = null

const paymentId = computed(() => route.query.id ? parseInt(route.query.id, 10) : null)
const gateway = computed(() => route.query.gateway || 'SePay')

const gatewayName = computed(() => {
  const map = { MoMo: 'MoMo Wallet', VNPAY: 'VNPAY-QR', PayOS: 'PayOS VietQR', SePay: 'SePay VietQR' }
  return map[gateway.value] || gateway.value
})

const themeClass = computed(() => {
  const g = gateway.value.toLowerCase()
  if (g === 'momo') {
    return {
      headerBg: 'bg-pink-700',
      btnBg: 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/20',
      blob1: 'bg-pink-500',
      blob2: 'bg-rose-500'
    }
  } else if (g === 'vnpay') {
    return {
      headerBg: 'bg-blue-800',
      btnBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
      blob1: 'bg-blue-500',
      blob2: 'bg-sky-500'
    }
  } else if (g === 'payos') {
    return {
      headerBg: 'bg-indigo-700',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
      blob1: 'bg-indigo-500',
      blob2: 'bg-violet-500'
    }
  }
  // SePay Default
  return {
    headerBg: 'bg-slate-700',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
    blob1: 'bg-emerald-500',
    blob2: 'bg-teal-500'
  }
})

async function fetchInvoiceInfo() {
  if (!paymentId.value) {
    error.value = 'Mã hóa đơn thanh toán không hợp lệ.'
    loading.value = false
    return
  }

  try {
    const res = await api.get(`/api/v1/payments/${paymentId.value}/checkout`, {
      params: { gateway: gateway.value }
    })
    invoice.value = res.data
  } catch (err) {
    console.error('Error fetching checkout info:', err)
    error.value = err.response?.data?.message || 'Không tìm thấy hóa đơn học phí hoặc hóa đơn đã hoàn tất.'
  } finally {
    loading.value = false
  }
}

async function simulatePayment() {
  submitting.value = true
  try {
    const g = gateway.value.toLowerCase()
    let endpoint = ''
    let payload = {}

    if (g === 'payos') {
      endpoint = '/api/v1/payments/callback/payos'
      payload = {
        orderCode: invoice.value.paymentCode,
        amount: invoice.value.remainingAmount,
        description: 'Simulated PayOS Payment Success'
      }
      await api.post(endpoint, payload)
    } 
    else if (g === 'momo') {
      endpoint = '/api/v1/payments/callback/momo'
      payload = {
        orderId: invoice.value.paymentCode,
        amount: invoice.value.remainingAmount,
        transId: Math.floor(Math.random() * 9000000000) + 1000000000,
        resultCode: 0
      }
      await api.post(endpoint, payload)
    } 
    else if (g === 'vnpay') {
      endpoint = '/api/v1/payments/callback/vnpay'
      // Send raw GET parameters just like VNPAY does
      const amountParam = invoice.value.remainingAmount * 100
      await api.get(endpoint, {
        params: {
          vnp_TxnRef: invoice.value.paymentCode,
          vnp_Amount: amountParam,
          vnp_ResponseCode: '00'
        }
      })
    } 
    else {
      // Sepay Simulation
      endpoint = '/api/v1/payments/callback/sepay'
      payload = {
        gateway: 'Simulated MBBank',
        transactionDate: new Date().toISOString(),
        accountNumber: '0366265607',
        amountIn: invoice.value.remainingAmount,
        amountOut: 0,
        code: invoice.value.paymentCode,
        transactionContent: `Simulated SePay callback PAY${invoice.value.paymentId}`,
        referenceNumber: 'REF-' + Date.now()
      }
      await api.post(endpoint, payload)
    }

    success.value = true
    startCountdown()
  } catch (err) {
    console.error('Error simulating payment:', err)
    alert('Simulated Webhook Callback Failed: ' + (err.response?.data?.message || err.message))
  } finally {
    submitting.value = false
  }
}

function startCountdown() {
  countdownInterval = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--
    } else {
      clearInterval(countdownInterval)
      goBack()
    }
  }, 1000)
}

function goBack() {
  router.push('/student-portal?tab=payments')
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}

onMounted(() => {
  fetchInvoiceInfo()
})

onUnmounted(() => {
  clearInterval(countdownInterval)
})
</script>

<style scoped>
.glass-panel {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
