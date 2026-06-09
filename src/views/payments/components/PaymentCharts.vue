<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
    <!-- Monthly Revenue Trend Chart -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter lg:col-span-2 flex flex-col justify-between min-h-[350px] transition-all duration-300 hover:shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
            <span class="material-symbols-outlined text-on-tertiary-container">monitoring</span>
            Doanh thu theo tháng
          </h3>
          <p class="text-body-sm text-on-surface-variant">Sự tăng trưởng doanh thu trong năm hiện tại</p>
        </div>
        <!-- Year selection dropdown -->
        <div class="relative w-32">
          <select
            :value="selectedYear"
            @change="$emit('year-changed', Number($event.target.value))"
            class="w-full glass-input appearance-none pl-3 pr-8 py-1.5 rounded-lg text-body-sm text-primary-container bg-transparent cursor-pointer"
          >
            <option v-for="y in availableYears" :key="y" :value="y">Năm {{ y }}</option>
          </select>
          <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
        </div>
      </div>
      <div class="relative flex-1 w-full h-64">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg z-10">
          <span class="animate-spin w-8 h-8 border-4 border-on-tertiary-container border-t-transparent rounded-full"></span>
        </div>
        <canvas ref="revenueChartRef"></canvas>
      </div>
    </div>

    <!-- Course Revenue Contribution Chart -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-xl p-gutter flex flex-col justify-between min-h-[350px] transition-all duration-300 hover:shadow-lg">
      <div>
        <h3 class="font-title-md text-title-md font-bold text-primary-container flex items-center gap-2">
          <span class="material-symbols-outlined text-emerald-600">pie_chart</span>
          Cơ cấu theo khóa học
        </h3>
        <p class="text-body-sm text-on-surface-variant">Tỷ lệ doanh thu và công nợ nợ đọng của từng khóa học</p>
      </div>
      <div class="relative flex-1 w-full h-64 mt-4">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg z-10">
          <span class="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></span>
        </div>
        <canvas ref="courseChartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  monthlyValues: { type: Array, required: true },
  coursesList: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  selectedYear: { type: Number, required: true },
  availableYears: { type: Array, required: true }
})

defineEmits(['year-changed'])

const revenueChartRef = ref(null)
const courseChartRef = ref(null)

let revenueChartInstance = null
let courseChartInstance = null

onMounted(() => {
  renderCharts()
})

onUnmounted(() => {
  destroyCharts()
})

watch(() => props.monthlyValues, () => {
  renderCharts()
}, { deep: true })

watch(() => props.coursesList, () => {
  renderCharts()
}, { deep: true })

function destroyCharts() {
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
    revenueChartInstance = null
  }
  if (courseChartInstance) {
    courseChartInstance.destroy()
    courseChartInstance = null
  }
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 đ'
  return amount.toLocaleString('vi-VN') + ' đ'
}

function renderCharts() {
  destroyCharts()
  renderRevenueChart()
  renderCourseChart()
}

function renderRevenueChart() {
  if (!revenueChartRef.value) return

  const ctx = revenueChartRef.value.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 250)
  gradient.addColorStop(0, 'rgba(43, 131, 255, 0.35)')
  gradient.addColorStop(1, 'rgba(43, 131, 255, 0.0)')

  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      datasets: [
        {
          label: 'Doanh thu',
          data: props.monthlyValues,
          borderColor: '#2b83ff',
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2b83ff',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              return ` Doanh thu: ${formatCurrency(context.raw)}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'rgba(15, 23, 42, 0.6)',
            font: {
              family: 'Inter, sans-serif',
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(15, 23, 42, 0.08)'
          },
          ticks: {
            color: 'rgba(15, 23, 42, 0.6)',
            font: {
              family: 'Inter, sans-serif',
              size: 11
            },
            callback: (value) => {
              if (value >= 1000000) return (value / 1000000) + 'M ₫'
              if (value >= 1000) return (value / 1000) + 'k ₫'
              return value + ' ₫'
            }
          }
        }
      }
    }
  })
}

function renderCourseChart() {
  if (!courseChartRef.value) return

  // Filter out courses with 0 revenue to keep chart clean
  const activeCourses = props.coursesList.filter(c => c.revenue > 0)
  const displayCourses = activeCourses.length > 0 ? activeCourses : props.coursesList

  const labels = displayCourses.map(c => c.name)
  const revenueData = displayCourses.map(c => c.revenue)

  const backgroundColors = [
    '#2b83ff', // Primary blue
    '#10b981', // Emerald green
    '#8b5cf6', // Purple
    '#f59e0b', // Amber/orange
    '#f43f5e', // Rose red
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#14b8a6'  // Teal
  ]

  const ctx = courseChartRef.value.getContext('2d')
  courseChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: revenueData,
          backgroundColor: backgroundColors.slice(0, displayCourses.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(15, 23, 42, 0.8)',
            font: {
              family: 'Inter, sans-serif',
              size: 10
            },
            boxWidth: 8,
            padding: 8
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const val = context.raw
              const percentage = total > 0 ? Math.round((val / total) * 100) : 0
              return ` Doanh thu: ${formatCurrency(val)} (${percentage}%)`
            }
          }
        }
      },
      cutout: '60%'
    }
  })
}
</script>
