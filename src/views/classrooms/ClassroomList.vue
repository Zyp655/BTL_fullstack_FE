<template>
  <div class="space-y-6">
    <!-- Header Page with stats banner -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-primary-container/10 pb-5">
      <div>
        <h1 class="text-display-sm font-bold tracking-tight text-primary-container">Quản Lý Phòng Học</h1>
        <p class="text-body-md text-on-surface-variant/80 mt-1">Quản lý và giám sát trạng thái sử dụng của phòng học từ 301 đến 309.</p>
      </div>
      <div>
        <button
          @click="fetchClassrooms"
          :disabled="loading"
          class="flex items-center gap-2 bg-primary-container text-white hover:bg-primary-container/90 px-4 py-2 rounded-lg font-semibold text-body-sm shadow transition-all duration-200"
        >
          <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': loading }">refresh</span>
          Làm mới
        </button>
      </div>
    </div>

    <!-- Analytics Dashboard Cards -->
    <div v-if="!loading || classrooms.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Rooms Card -->
      <div class="bg-primary-container/[0.03] border border-primary-container/10 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <div class="text-body-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tổng số phòng</div>
          <div class="text-headline-md font-bold text-primary-container mt-1">{{ stats.total }}</div>
        </div>
        <div class="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
          <span class="material-symbols-outlined text-[28px]">meeting_room</span>
        </div>
      </div>

      <!-- Vacant Rooms Card -->
      <div class="bg-primary-container/[0.03] border border-primary-container/10 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <div class="text-body-xs font-semibold text-on-surface-variant uppercase tracking-wider">Đang trống</div>
          <div class="text-headline-md font-bold text-success mt-1">{{ stats.vacant }}</div>
        </div>
        <div class="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center text-success">
          <span class="material-symbols-outlined text-[28px]">check_circle</span>
        </div>
      </div>

      <!-- Occupied Rooms Card -->
      <div class="bg-primary-container/[0.03] border border-primary-container/10 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <div class="text-body-xs font-semibold text-on-surface-variant uppercase tracking-wider">Đang sử dụng</div>
          <div class="text-headline-md font-bold text-info mt-1">{{ stats.occupied }}</div>
        </div>
        <div class="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center text-info">
          <span class="material-symbols-outlined text-[28px]">play_circle</span>
        </div>
      </div>

      <!-- Maintenance Rooms Card -->
      <div class="bg-primary-container/[0.03] border border-primary-container/10 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <div class="text-body-xs font-semibold text-on-surface-variant uppercase tracking-wider">Bảo trì</div>
          <div class="text-headline-md font-bold text-error mt-1">{{ stats.maintenance }}</div>
        </div>
        <div class="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center text-error">
          <span class="material-symbols-outlined text-[28px]">build</span>
        </div>
      </div>
    </div>

    <!-- Filters and Search Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-primary-container/[0.02] border border-primary-container/10 p-4 rounded-xl shadow-sm">
      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filterOptions"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-4 py-1.5 rounded-lg text-body-sm font-semibold transition-all duration-200"
          :class="activeFilter === filter.value 
            ? 'bg-primary-container text-white shadow' 
            : 'bg-primary-container/[0.05] text-primary-container hover:bg-primary-container/10'"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Search Box -->
      <div class="relative w-full sm:w-72">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm phòng..."
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 rounded-lg pl-10 pr-4 py-2 text-body-sm text-primary-container placeholder:text-on-surface-variant/40 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && classrooms.length === 0" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="relative w-12 h-12">
        <div class="absolute w-12 h-12 rounded-full border-4 border-primary-container/10"></div>
        <div class="absolute w-12 h-12 rounded-full border-4 border-t-primary-container border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p class="text-body-sm text-on-surface-variant/70 font-medium">Đang tải danh sách phòng học...</p>
    </div>

    <!-- Classrooms Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="room in filteredClassrooms"
        :key="room.roomNumber"
        class="bg-surface border border-primary-container/10 hover:border-primary-container/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
      >
        <!-- Card Top Area -->
        <div class="p-5 space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary-container/[0.05] flex items-center justify-center text-primary-container border border-primary-container/10">
                <span class="material-symbols-outlined text-[22px]">meeting_room</span>
              </div>
              <div>
                <h3 class="text-headline-xs font-bold text-primary-container">Phòng {{ room.roomNumber }}</h3>
                <p class="text-body-xs text-on-surface-variant/60 font-medium">Khu giảng đường</p>
              </div>
            </div>

            <!-- Custom status badge -->
            <div>
              <span v-if="room.status === 'Maintenance'" class="flex items-center gap-1 bg-error/10 text-error border border-error/20 px-2.5 py-1 rounded-full text-[11px] font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                Bảo trì
              </span>
              <span v-else-if="room.status === 'Occupied'" class="flex items-center gap-1 bg-info/10 text-info border border-info/20 px-2.5 py-1 rounded-full text-[11px] font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-info animate-pulse"></span>
                Đang học
              </span>
              <span v-else class="flex items-center gap-1 bg-success/10 text-success border border-success/20 px-2.5 py-1 rounded-full text-[11px] font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                Đang trống
              </span>
            </div>
          </div>

          <!-- Class info if occupied -->
          <div v-if="room.status === 'Occupied'" class="bg-info/[0.03] border border-info/10 p-3.5 rounded-xl space-y-1.5">
            <div class="text-[11px] font-semibold text-info/80 uppercase tracking-wider">Lớp học hiện tại</div>
            <div class="text-body-sm font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-info">school</span>
              {{ room.currentClassName }}
            </div>
            <div class="text-[11px] text-on-surface-variant/70">
              Đang diễn ra ca học tại phòng này.
            </div>
          </div>

          <!-- Maintenance notes if under maintenance -->
          <div v-else-if="room.status === 'Maintenance'" class="bg-error/[0.03] border border-error/10 p-3.5 rounded-xl space-y-1">
            <div class="text-[11px] font-semibold text-error/80 uppercase tracking-wider">Lý do bảo trì</div>
            <p class="text-body-xs font-semibold text-on-surface-variant/90 italic">
              "{{ room.notes || 'Không có ghi chú cụ thể' }}"
            </p>
          </div>

          <!-- Vacant info -->
          <div v-else class="bg-success/[0.03] border border-success/10 p-3.5 rounded-xl">
            <div class="text-body-xs text-success/80 font-semibold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              Sẵn sàng sử dụng cho lớp học
            </div>
          </div>
        </div>

        <!-- Card Bottom Toggle Action Area -->
        <div class="bg-primary-container/[0.02] border-t border-primary-container/10 px-5 py-4 flex items-center justify-between">
          <span class="text-body-xs font-semibold text-on-surface-variant">Chế độ bảo trì</span>
          
          <!-- Switch Toggle Button -->
          <button
            @click="handleToggleMaintenance(room)"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="room.isMaintenance ? 'bg-error' : 'bg-outline-variant/60'"
          >
            <span
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="room.isMaintenance ? 'translate-x-5' : 'translate-x-0'"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty Results -->
    <div v-if="filteredClassrooms.length === 0 && !loading" class="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <span class="material-symbols-outlined text-[64px] text-on-surface-variant/40">meeting_room</span>
      <h3 class="text-headline-xs font-bold text-primary-container">Không tìm thấy phòng phù hợp</h3>
      <p class="text-body-sm text-on-surface-variant/60 max-w-sm">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
    </div>

    <!-- Maintenance Note Dialog Modal -->
    <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-primary-container/15 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal header -->
        <div class="bg-primary-container px-6 py-4 flex items-center justify-between border-b border-primary-container/10">
          <h3 class="text-body-lg font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">build</span>
            Cấu hình bảo trì phòng {{ modal.room?.roomNumber }}
          </h3>
          <button @click="closeModal" class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Modal body -->
        <div class="p-6 space-y-4">
          <p class="text-body-sm text-on-surface-variant/80">
            Bạn đang chuyển phòng <strong>{{ modal.room?.roomNumber }}</strong> sang trạng thái bảo trì. Lớp học và lịch học sẽ <strong>không thể</strong> sử dụng phòng này.
          </p>
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Ghi chú / Lý do bảo trì *</label>
            <textarea
              v-model="modal.notes"
              rows="3"
              placeholder="Nhập lý do bảo trì hoặc vấn đề kỹ thuật tại đây..."
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2.5 text-body-sm text-primary-container placeholder:text-on-surface-variant/40 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all resize-none"
            ></textarea>
            <p v-if="modal.error" class="text-error text-[11px] font-semibold mt-1">{{ modal.error }}</p>
          </div>
        </div>

        <!-- Modal actions -->
        <div class="bg-primary-container/[0.03] border-t border-primary-container/10 px-6 py-4 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="px-4 py-2 border border-primary-container/10 hover:bg-primary-container/[0.05] text-primary-container rounded-lg font-semibold text-body-sm transition-all duration-200"
          >
            Hủy
          </button>
          <button
            @click="confirmMaintenance"
            :disabled="updating"
            class="bg-error hover:bg-error/95 text-white px-5 py-2 rounded-lg font-semibold text-body-sm shadow transition-all duration-200 disabled:opacity-50"
          >
            {{ updating ? 'Đang cập nhật...' : 'Xác nhận bảo trì' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

// State
const classrooms = ref([])
const loading = ref(false)
const updating = ref(false)
const searchQuery = ref('')
const activeFilter = ref('all') // all, vacant, occupied, maintenance

const modal = ref({
  show: false,
  room: null,
  notes: '',
  error: ''
})

// Filter Options
const filterOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang trống', value: 'vacant' },
  { label: 'Đang học', value: 'occupied' },
  { label: 'Bảo trì', value: 'maintenance' }
]

// Fetch Classrooms
const fetchClassrooms = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/v1/classrooms')
    classrooms.value = response.data
  } catch (error) {
    console.error('Failed to fetch classrooms:', error)
  } finally {
    loading.value = false
  }
}

// Stats Computation
const stats = computed(() => {
  const total = classrooms.value.length
  const vacant = classrooms.value.filter(r => r.status === 'Vacant').length
  const occupied = classrooms.value.filter(r => r.status === 'Occupied').length
  const maintenance = classrooms.value.filter(r => r.status === 'Maintenance').length
  return { total, vacant, occupied, maintenance }
})

// Filtered Classrooms
const filteredClassrooms = computed(() => {
  let list = classrooms.value

  // Apply search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(r => r.roomNumber.toLowerCase().includes(query))
  }

  // Apply filter type
  if (activeFilter.value !== 'all') {
    const statusMap = {
      vacant: 'Vacant',
      occupied: 'Occupied',
      maintenance: 'Maintenance'
    }
    list = list.filter(r => r.status === statusMap[activeFilter.value])
  }

  // Sort by room number ascending
  return [...list].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
})

// Toggle Maintenance Action
const handleToggleMaintenance = async (room) => {
  if (room.isMaintenance) {
    // Turning maintenance OFF
    updating.value = true
    try {
      const response = await api.put(`/api/v1/classrooms/${room.roomNumber}/maintenance`, {
        isMaintenance: false,
        notes: ''
      })
      // Update room in local list
      const idx = classrooms.value.findIndex(r => r.roomNumber === room.roomNumber)
      if (idx !== -1) {
        classrooms.value[idx] = response.data
      }
    } catch (error) {
      console.error('Failed to update maintenance status:', error)
    } finally {
      updating.value = false
    }
  } else {
    // Turning maintenance ON -> require a note
    modal.value = {
      show: true,
      room: room,
      notes: '',
      error: ''
    }
  }
}

// Modal Actions
const closeModal = () => {
  modal.value.show = false
  modal.value.room = null
  modal.value.notes = ''
  modal.value.error = ''
}

const confirmMaintenance = async () => {
  if (!modal.value.notes.trim()) {
    modal.value.error = 'Vui lòng nhập lý do bảo trì.'
    return
  }

  updating.value = true
  modal.value.error = ''
  try {
    const response = await api.put(`/api/v1/classrooms/${modal.value.room.roomNumber}/maintenance`, {
      isMaintenance: true,
      notes: modal.value.notes.trim()
    })

    const idx = classrooms.value.findIndex(r => r.roomNumber === modal.value.room.roomNumber)
    if (idx !== -1) {
      classrooms.value[idx] = response.data
    }
    closeModal()
  } catch (error) {
    console.error('Failed to update maintenance status:', error)
    modal.value.error = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.'
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  fetchClassrooms()
})
</script>

<style scoped>
/* Glassmorphism adjustments */
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
.bg-info\/10 {
  background-color: rgba(2, 132, 199, 0.1);
}
.bg-info\/\[0\.03\] {
  background-color: rgba(2, 132, 199, 0.03);
}
.border-info\/10 {
  border-color: rgba(2, 132, 199, 0.1);
}
.text-success {
  color: #16a34a;
}
.bg-success\/10 {
  background-color: rgba(22, 163, 74, 0.1);
}
.border-success\/20 {
  border-color: rgba(22, 163, 74, 0.2);
}
.bg-success\/\[0\.03\] {
  background-color: rgba(22, 163, 74, 0.03);
}
.border-success\/10 {
  border-color: rgba(22, 163, 74, 0.1);
}
.text-error {
  color: #dc2626;
}
.bg-error\/10 {
  background-color: rgba(220, 38, 38, 0.1);
}
.border-error\/20 {
  border-color: rgba(220, 38, 38, 0.2);
}
.bg-error\/\[0\.03\] {
  background-color: rgba(220, 38, 38, 0.03);
}
.border-error\/10 {
  border-color: rgba(220, 38, 38, 0.1);
}
.bg-error {
  background-color: #dc2626;
}
</style>
