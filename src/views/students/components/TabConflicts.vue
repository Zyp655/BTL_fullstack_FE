<template>
  <div class="space-y-4 animate-fade-in">
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-6 space-y-4">
      <div class="flex items-center gap-3 text-error border-b border-white/40 pb-3">
        <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">warning</span>
        <h3 class="font-title-md text-body-lg font-bold text-primary-container">
          Cảnh báo trùng lịch học của học viên
        </h3>
      </div>

      <div v-if="currentConflicts.length === 0" class="text-center py-8 text-on-surface-variant font-medium">
        Tuyệt vời! Hiện tại bạn không có lịch học nào bị trùng nhau.
      </div>

      <div v-else class="space-y-4">
        <p class="text-body-sm text-on-surface-variant">
          Hệ thống phát hiện lịch học của các lớp dưới đây đang bị trùng chéo lịch với nhau. Bạn có thể gửi yêu cầu hỗ trợ đổi lớp trực tiếp đến Admin bằng cách nhấn nút <strong>Đổi lớp</strong> tương ứng bên cạnh.
        </p>

        <div class="space-y-3">
          <div
            v-for="(conf, idx) in currentConflicts"
            :key="idx"
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-error/5 border border-error/15 rounded-xl hover:bg-error/10 transition-colors"
          >
            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2 text-body-md font-semibold text-primary-container">
                <span class="w-1.5 h-1.5 rounded-full bg-error shrink-0"></span>
                <span>Lớp <strong class="text-primary-container">{{ conf.classA.className }}</strong> và lớp <strong class="text-primary-container">{{ conf.classB.className }}</strong></span>
              </div>
              <div class="text-body-sm text-on-surface-variant flex items-center gap-1.5 pl-3.5">
                <span class="material-symbols-outlined text-[16px] text-error">schedule</span>
                <span>Trùng lịch vào: <strong>Thứ {{ formatDayOfWeek(conf.sessionA.dayOfWeek) }} ({{ conf.sessionA.startTime.substring(0,5) }} - {{ conf.sessionA.endTime.substring(0,5) }})</strong></span>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <button
                @click="$emit('open-support-conflict', { targetClass: conf.classA, conflictClass: conf.classB })"
                class="px-3.5 py-2 rounded-lg bg-error hover:bg-error/95 text-white font-semibold text-[13px] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm shadow-error/10"
              >
                <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                Đổi lớp {{ conf.classA.className }}
              </button>
              <button
                @click="$emit('open-support-conflict', { targetClass: conf.classB, conflictClass: conf.classA })"
                class="px-3.5 py-2 rounded-lg bg-error hover:bg-error/95 text-white font-semibold text-[13px] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm shadow-error/10"
              >
                <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                Đổi lớp {{ conf.classB.className }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentConflicts: { type: Array, required: true }
})

defineEmits(['open-support-conflict'])

function formatDayOfWeek(day) {
  const map = { 1: 'Chủ Nhật', 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu', 7: 'Bảy' }
  return map[day] || day
}
</script>
