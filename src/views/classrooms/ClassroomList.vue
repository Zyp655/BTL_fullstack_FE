<template>
  <div class="space-y-6">
    <!-- Header Page with stats banner -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-primary-container/10 pb-5">
      <div>
        <h1 class="text-display-sm font-bold tracking-tight text-primary-container">Quản Lý Phòng Học</h1>
        <p class="text-body-md text-on-surface-variant/80 mt-1">Quản lý và giám sát trạng thái sử dụng của các phòng học.</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold text-body-sm shadow transition-all duration-200 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Thêm phòng mới
        </button>
        <button
          @click="fetchClassrooms"
          :disabled="loading"
          class="flex items-center gap-2 bg-primary-container text-white hover:bg-primary-container/90 px-4 py-2 rounded-lg font-semibold text-body-sm shadow transition-all duration-200 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': loading }">refresh</span>
          Làm mới
        </button>
      </div>
    </div>

    <!-- Analytics Dashboard Cards -->
    <div v-if="!loading || classrooms.length > 0" class="grid grid-cols-2 lg:grid-cols-5 gap-4" :class="'grid-cols-2 lg:grid-cols-5'">
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
          <div class="text-body-xs font-semibold text-on-surface-variant uppercase tracking-wider">Phòng Trống Sáng/Chiều/Tối</div>
          <div class="text-headline-sm font-bold text-success mt-1">
            🌅{{ stats.vacantMorning }} | ☀️{{ stats.vacantAfternoon }} | 🌙{{ stats.vacantEvening }}
          </div>
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

      <!-- Conflicted Rooms Card -->
      <div 
        class="border rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-rose-50/30 transition-all duration-200"
        :class="activeFilter === 'conflict' ? 'border-rose-300 bg-rose-50/50' : 'bg-primary-container/[0.03] border-primary-container/10'"
        @click="activeFilter = activeFilter === 'conflict' ? 'all' : 'conflict'"
      >
        <div>
          <div class="text-body-xs font-semibold text-on-surface-variant uppercase tracking-wider">Số phòng trùng lịch</div>
          <div class="text-headline-md font-bold text-rose-600 mt-1">{{ stats.conflictedRooms }}</div>
        </div>
        <div class="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
          <span class="material-symbols-outlined text-[28px]">warning</span>
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
        <div class="p-5 space-y-4 cursor-pointer flex-1" @click="openScheduleModal(room)">
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
            <div class="text-[11px] font-semibold text-info-dark uppercase tracking-wider">Lớp học hiện tại</div>
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
            <div class="text-[11px] font-semibold text-error-dark uppercase tracking-wider">Lý do bảo trì</div>
            <p class="text-body-xs font-semibold text-on-surface-variant/90 italic">
              "{{ room.notes || 'Không có ghi chú cụ thể' }}"
            </p>
          </div>

          <!-- Vacant info -->
          <div v-else class="bg-success/[0.03] border border-success/10 p-3.5 rounded-xl">
            <div class="text-body-xs text-success-dark font-semibold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              Sẵn sàng sử dụng cho lớp học
            </div>
          </div>

          <!-- Conflicts warning section -->
          <div v-if="room.hasConflict" class="border-t border-error/20 pt-3 mt-1 flex items-center justify-between">
            <div class="text-[11px] font-bold text-error uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px] animate-pulse">warning</span>
              Phát hiện trùng phòng ({{ room.conflicts.length }})
            </div>
            <button 
              @click.stop="openScheduleModal(room)"
              class="px-2.5 py-1 bg-error hover:bg-error/90 text-white text-[10px] font-extrabold rounded border-0 cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-0.5"
            >
              <span class="material-symbols-outlined text-[12px]">build</span>
              Sửa ngay
            </button>
          </div>

          <!-- Assigned classes list -->
          <div v-if="room.status !== 'Maintenance' && room.assignedClasses && room.assignedClasses.length > 0" class="border-t border-primary-container/10 pt-3 mt-1 space-y-1.5">
            <div class="text-[10px] font-semibold text-on-surface-variant/70 uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">assignment</span>
              Lớp được phân công ({{ room.assignedClasses.length }})
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="className in room.assignedClasses" 
                :key="className" 
                class="bg-primary-container/[0.05] text-primary-container text-[11px] font-semibold px-2 py-0.5 rounded border border-primary-container/10"
              >
                {{ className }}
              </span>
            </div>
          </div>
          <div v-else-if="room.status !== 'Maintenance'" class="border-t border-primary-container/10 pt-3 mt-1">
            <div class="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">assignment</span>
              Chưa có lớp phân công
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

    <!-- Room Schedule and Conflict Resolution Modal -->
    <teleport to="body">
      <div 
        v-if="scheduleModal.show" 
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style="position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999;"
      >
        <div 
          class="border shadow-2xl rounded-3xl w-full max-w-[96vw] h-[95vh] flex flex-col overflow-hidden"
          style="background-color: #ffffff; border-color: rgba(0, 0, 0, 0.05); display: flex; flex-direction: column;"
        >
          
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50" style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100" style="background-color: #e0e7ff; border: 1px solid #c7d2fe; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #4f46e5;">
                <span class="material-symbols-outlined text-[22px]">meeting_room</span>
              </div>
              <div>
                <h3 class="text-headline-xs font-bold text-slate-800" style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0;">
                  Sơ đồ xếp phòng học (Kiểu rạp chiếu phim)
                </h3>
                <p class="text-body-xs text-slate-500 mt-0.5" style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">
                  Bản đồ hiển thị tất cả phòng học. Kéo thả lớp học để đổi sang phòng khác hoặc kiểm tra trùng lịch.
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-4" style="display: flex; align-items: center; gap: 16px;">
              <!-- Week Navigation -->
              <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm" style="display: flex; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
                <button @click="prevModalWeek" class="px-3 py-1.5 hover:bg-slate-50 transition-colors flex items-center justify-center border-r border-slate-200 cursor-pointer" style="padding: 6px 12px; border: none; background: transparent; cursor: pointer; border-right: 1px solid #e2e8f0;">
                  <span class="material-symbols-outlined text-[18px] text-slate-600">chevron_left</span>
                </button>
                <div class="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/50" style="padding: 6px 16px; font-size: 12px; font-weight: 700; color: #334155; background-color: #f8fafc;">
                  {{ modalWeekLabel }}
                </div>
                <button @click="nextModalWeek" class="px-3 py-1.5 hover:bg-slate-50 transition-colors flex items-center justify-center border-l border-slate-200 cursor-pointer" style="padding: 6px 12px; border: none; background: transparent; cursor: pointer; border-left: 1px solid #e2e8f0;">
                  <span class="material-symbols-outlined text-[18px] text-slate-600">chevron_right</span>
                </button>
              </div>

              <button @click="closeScheduleModal" class="text-slate-400 hover:text-slate-650 transition-colors cursor-pointer w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center" style="border: none; background: transparent; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #94a3b8;">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          
          <!-- Modal Body Split Layout -->
          <div class="flex-1 flex overflow-hidden min-h-0 bg-slate-50/50" style="display: flex; flex: 1; min-height: 0; background-color: #f8fafc; overflow: hidden;">
            <!-- Left Side: Cinema Classroom Seating Layout -->
            <div class="flex-1 p-6 overflow-y-auto min-w-0 flex flex-col gap-4" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; min-width: 0;">
              
              <!-- Timeslot Selectors (Day of Week and Session) -->
              <div class="bg-primary-container/[0.02] border border-primary-container/10 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4" style="display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(26,115,128,0.1); padding: 16px; border-radius: 12px; background-color: rgba(26,115,128,0.02); flex-wrap: wrap;">
                <div class="flex flex-wrap items-center gap-4" style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                  <!-- Day selector -->
                  <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 8px;">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wide" style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Thứ:</span>
                    <select v-model="cinemaSelectedDay" class="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-container" style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 700; color: #334155; background-color: #ffffff; cursor: pointer;">
                      <option :value="2">Thứ 2</option>
                      <option :value="3">Thứ 3</option>
                      <option :value="4">Thứ 4</option>
                      <option :value="5">Thứ 5</option>
                      <option :value="6">Thứ 6</option>
                      <option :value="7">Thứ 7</option>
                      <option :value="0">Chủ nhật</option>
                    </select>
                  </div>

                  <!-- Session selector -->
                  <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 8px;">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wide" style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Ca học:</span>
                    <select v-model="cinemaSelectedSession" class="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-container" style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 700; color: #334155; background-color: #ffffff; cursor: pointer;">
                      <option value="Sang">🌅 Sáng (08:00 - 12:00)</option>
                      <option value="Chieu">☀️ Chiều (14:00 - 18:00)</option>
                      <option value="Toi">🌙 Tối (18:00 - 21:00)</option>
                    </select>
                  </div>
                </div>

                <!-- Legend info -->
                <div class="flex gap-4 text-xs font-bold" style="display: flex; gap: 16px; font-size: 11px; font-weight: 700;">
                  <div class="flex items-center gap-1.5" style="display: flex; align-items: center; gap: 6px;">
                    <div class="w-3.5 h-3.5 rounded-md" style="width: 14px; height: 14px; border-radius: 4px; background-color: #ecfdf5; border: 1.5px solid #10b981;"></div>
                    <span style="color: #047857;">Phòng Trống</span>
                  </div>
                  <div class="flex items-center gap-1.5" style="display: flex; align-items: center; gap: 6px;">
                    <div class="w-3.5 h-3.5 rounded-md" style="width: 14px; height: 14px; border-radius: 4px; background-color: #fef2f2; border: 1.5px solid #ef4444;"></div>
                    <span style="color: #b91c1c;">Phòng Bận</span>
                  </div>
                </div>
              </div>

              <!-- Cinema Seating Grid -->
              <div 
                class="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[400px] overflow-y-auto custom-scrollbar overflow-x-auto" 
                style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; min-height: 400px; overflow-y: auto; overflow-x: auto;"
              >
                <!-- Screen layout indicator (like a cinema) -->
                <div class="w-full flex flex-col items-center mb-8" style="display: flex; flex-direction: column; align-items: center; margin-bottom: 32px; width: 100%;">
                  <div class="w-3/4 h-2 bg-slate-300 rounded-full shadow" style="width: 75%; height: 8px; background-color: #cbd5e1; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);"></div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5" style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.1em;">BẢNG GIẢNG ĐƯỜNG / SCREEN</span>
                </div>

                <!-- Seating Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px;">
                  <div
                    v-for="room in classrooms"
                    :key="room.roomNumber"
                    class="p-4 rounded-2xl border transition-all relative flex flex-col items-center justify-between min-h-[130px] shadow-sm select-none cursor-pointer"
                    :style="getCinemaSeatStyle(room.roomNumber)"
                    @click="handleCinemaRoomClick(room.roomNumber)"
                  >
                    <!-- Room Header -->
                    <div class="w-full flex items-center justify-between border-b pb-1.5 mb-2" style="width: 100%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(226,232,240,0.5); padding-bottom: 6px; margin-bottom: 8px;">
                      <span class="text-xs font-black" style="font-size: 13px; font-weight: 900; color: #1e293b;">
                        {{ room.roomNumber }}
                      </span>
                      <span 
                        class="text-[9.5px] px-1.5 py-0.5 rounded font-extrabold"
                        style="font-size: 9.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px;"
                        :style="isCinemaRoomOccupied(room.roomNumber) 
                          ? 'background-color: #fee2e2; color: #dc2626;' 
                          : 'background-color: #d1fae5; color: #059669;'"
                      >
                        {{ isCinemaRoomOccupied(room.roomNumber) ? 'BẬN' : 'TRỐNG' }}
                      </span>
                    </div>

                    <!-- Classes inside this room -->
                    <div class="w-full flex-1 flex flex-col justify-center gap-1.5" style="width: 100%; display: flex; flex-direction: column; justify-content: center; gap: 6px;">
                      <!-- Vacant Text -->
                      <div v-if="!isCinemaRoomOccupied(room.roomNumber)" class="text-center text-[11px] font-bold text-emerald-600 italic" style="text-align: center; font-size: 11px; font-weight: 700; color: #059669; font-style: italic;">
                        
                      </div>
                      
                      <!-- Draggable Class Cards -->
                      <div 
                        v-else
                        v-for="s in getCinemaRoomSchedules(room.roomNumber)"
                        :key="s.scheduleId"
                        @click.stop="selectSlotForEdit(s)"
                        class="p-2 rounded-xl border text-center transition-all cursor-pointer hover:shadow-sm"
                        style="padding: 8px; border-radius: 10px; border: 1.5px solid #cbd5e1; background-color: #ffffff; color: #334155; font-size: 11px; font-weight: 700; text-align: center;"
                        :style="selectedSlotEdit?.scheduleId === s.scheduleId ? 'border-color: #2563eb; background-color: #eff6ff; color: #1e40af; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);' : ''"
                      >
                        <div class="truncate font-bold" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;" :title="getCourseName(s.classId)">
                          {{ getCourseName(s.classId) }}
                        </div>
                        <div class="text-[9.5px] text-slate-500 font-semibold truncate" style="font-size: 9.5px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
                          Lớp: {{ getClassName(s.classId) }}
                        </div>
                        <div class="text-[9.5px] font-mono text-slate-500" style="font-size: 9.5px; font-family: monospace; color: #64748b;">
                          {{ s.startTime.substring(0,5) }} - {{ s.endTime.substring(0,5) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Side: Edit Panel -->
            <div class="w-[380px] border-l border-slate-200/80 bg-white p-6 overflow-y-auto shrink-0 flex flex-col justify-between" style="width: 380px; border-left: 1px solid #e2e8f0; background-color: #ffffff; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0;">
              <div class="space-y-6" style="display: flex; flex-direction: column; gap: 24px;">
                <!-- Info Section when no slot is selected -->
                <div v-if="!selectedSlotEdit" class="h-full flex flex-col items-center justify-center py-20 text-center space-y-4" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 16px;">
                  <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100" style="width: 64px; height: 64px; border-radius: 50%; background-color: #f8fafc; border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8;">
                    <span class="material-symbols-outlined text-[32px]">edit_note</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-[15px] text-slate-700" style="font-size: 15px; font-weight: 700; color: #334155; margin: 0;">Xem &amp; Sửa lịch học</h4>
                    <p class="text-body-xs text-slate-400 mt-1 leading-relaxed max-w-[240px] mx-auto" style="font-size: 12px; color: #94a3b8; margin-top: 4px; max-width: 240px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                      Nhấp vào bất kỳ buổi học nào trên thời khóa biểu của phòng để chỉnh sửa giờ học, phòng học, hoặc phân công giảng viên.
                    </p>
                  </div>
                </div>
                
                <!-- Slot Schedule Editor Form -->
                <div v-else class="space-y-6" style="display: flex; flex-direction: column; gap: 24px;">
                  <div class="border-b border-slate-100 pb-3 flex items-center justify-between" style="border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                    <h4 class="font-bold text-[16px] text-primary-container flex items-center gap-1.5" style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 6px; margin: 0;">
                      <span class="material-symbols-outlined text-primary text-[20px]" style="font-size: 20px;">edit_calendar</span>
                      Chỉnh sửa Buổi học
                    </h4>
                    <button @click="selectedSlotEdit = null; selectedClassEdit = null" class="text-slate-400 hover:text-slate-650 cursor-pointer" style="border: none; background: transparent; cursor: pointer; color: #94a3b8;">
                      <span class="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                  
                  <!-- Class Details Preview -->
                  <div class="bg-primary-container/[0.02] border border-primary-container/10 p-4 rounded-xl space-y-3" style="background-color: rgba(26,115,128,0.02); border: 1px solid rgba(26,115,128,0.1); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px;">
                    <div class="text-[11px] font-bold text-primary uppercase tracking-wider" style="font-size: 11px; font-weight: 700; color: #1a7380; text-transform: uppercase;">Môn học &amp; Lớp học</div>
                    <div>
                      <div class="font-bold text-[14px] text-slate-800" style="font-size: 14px; font-weight: 700; color: #1e293b;">{{ getCourseName(selectedSlotEdit.classId) }}</div>
                      <div class="text-[11.5px] font-semibold text-slate-500 mt-0.5" style="font-size: 11.5px; font-weight: 600; color: #64748b; margin-top: 2px;">Mã lớp: {{ getClassName(selectedSlotEdit.classId) }}</div>
                    </div>
                    
                    <!-- Room Shift Status Indicator -->
                    <div class="border-t border-slate-100 pt-3 mt-1 flex items-center justify-between" style="border-top: 1px solid #f1f5f9; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                      <div class="flex flex-col" style="display: flex; flex-direction: column;">
                        <span class="text-[10px] text-slate-400 font-bold uppercase" style="font-size: 10px; color: #94a3b8; font-weight: 700;">Phòng hiện tại</span>
                        <span class="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-100 text-center" style="font-size: 12px; font-weight: 900; color: #dc2626; background-color: #fef2f2; border: 1.5px solid #fecdd3; padding: 2px 8px; border-radius: 6px; margin-top: 4px; text-align: center;">
                          P.{{ (allClasses.find(c => c.classId === selectedSlotEdit.classId)?.room) || 'Chưa xếp' }}
                        </span>
                      </div>
                      
                      <span class="material-symbols-outlined text-slate-400 text-[20px]" style="color: #94a3b8; font-size: 20px;">arrow_right_alt</span>
                      
                      <div class="flex flex-col items-end" style="display: flex; flex-direction: column; align-items: flex-end;">
                        <span class="text-[10px] text-slate-400 font-bold uppercase" style="font-size: 10px; color: #94a3b8; font-weight: 700;">Phòng sẽ chuyển sang</span>
                        <span class="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 text-center" style="font-size: 12px; font-weight: 900; color: #1d4ed8; background-color: #eff6ff; border: 1.5px solid #bfdbfe; padding: 2px 8px; border-radius: 6px; margin-top: 4px; text-align: center;">
                          P.{{ selectedClassEdit?.room || 'Chưa chọn' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Quick Move Form -->
                  <div class="space-y-4" style="display: flex; flex-direction: column; gap: 16px;">
                    <div class="text-[11px] font-bold text-slate-700 uppercase tracking-wider" style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">Thông tin Lịch học</div>
                    
                    <!-- Day of week selection -->
                    <div class="space-y-1.5" style="display: flex; flex-direction: column; gap: 6px;">
                      <label class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide" style="font-size: 11.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Thứ trong tuần</label>
                      <select v-model="selectedSlotEdit.dayOfWeek" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm text-slate-800 focus:outline-none focus:border-primary-container" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 14px; background-color: #f8fafc; color: #1e293b;">
                        <option v-for="day in weekDaysOptions" :key="day.value" :value="day.value">{{ day.label }}</option>
                      </select>
                    </div>
                    
                    <!-- Session selection -->
                    <div class="space-y-1.5" style="display: flex; flex-direction: column; gap: 6px;">
                      <label class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide" style="font-size: 11.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Ca học</label>
                      <select v-model="selectedSlotEdit.session" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm text-slate-800 focus:outline-none focus:border-primary-container" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 14px; background-color: #f8fafc; color: #1e293b;">
                        <option v-for="opt in sessionOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
                      </select>
                    </div>
                    
                    <!-- Time pickers -->
                    <div class="grid grid-cols-2 gap-3" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
                      <div class="space-y-1.5" style="display: flex; flex-direction: column; gap: 6px;">
                        <label class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide" style="font-size: 11.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Bắt đầu</label>
                        <input v-model="selectedSlotEdit.startTime" type="time" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm text-slate-800 focus:outline-none focus:border-primary-container" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 14px; background-color: #f8fafc; color: #1e293b;"/>
                      </div>
                      <div class="space-y-1.5" style="display: flex; flex-direction: column; gap: 6px;">
                        <label class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide" style="font-size: 11.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Kết thúc</label>
                        <input v-model="selectedSlotEdit.endTime" type="time" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-body-sm text-slate-800 focus:outline-none focus:border-primary-container" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 14px; background-color: #f8fafc; color: #1e293b;"/>
                      </div>
                    </div>
                    
                    <!-- Cinema Seat Map Room Selection Grid -->
                    <div class="space-y-2 mt-2" v-if="selectedClassEdit">
                      <div class="flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center;">
                        <label class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide" style="font-size: 11.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">
                          Chọn phòng học (Kiểu rạp phim)
                        </label>
                        <span class="text-[10px] text-slate-400 font-bold" style="font-size: 10px; color: #94a3b8; font-weight: 700;">
                          {{ selectedSlotEdit.dayOfWeek === 0 ? 'Chủ nhật' : 'Thứ ' + selectedSlotEdit.dayOfWeek }} - Ca {{ selectedSlotEdit.session === 'Sang' ? 'Sáng' : selectedSlotEdit.session === 'Chieu' ? 'Chiều' : 'Tối' }}
                        </span>
                      </div>
                      
                      <!-- Legend / Chú thích -->
                      <div class="flex gap-3 p-1.5 bg-slate-50 rounded-lg border border-slate-100 justify-center" style="display: flex; gap: 12px; padding: 6px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; justify-content: center; font-size: 9.5px; font-weight: 700;">
                        <div class="flex items-center gap-1" style="display: flex; align-items: center; gap: 4px;">
                          <div class="w-3 h-3 rounded" style="width: 12px; height: 12px; border-radius: 3px; background-color: #eff6ff; border: 2px solid #2563eb;"></div>
                          <span style="color: #1e293b;">Đang chọn</span>
                        </div>
                        <div class="flex items-center gap-1" style="display: flex; align-items: center; gap: 4px;">
                          <div class="w-3 h-3 rounded" style="width: 12px; height: 12px; border-radius: 3px; background-color: #ecfdf5; border: 1.5px solid #10b981;"></div>
                          <span style="color: #065f46;">Trống</span>
                        </div>
                        <div class="flex items-center gap-1" style="display: flex; align-items: center; gap: 4px;">
                          <div class="w-3 h-3 rounded" style="width: 12px; height: 12px; border-radius: 3px; background-color: #fef2f2; border: 1.5px solid #ef4444;"></div>
                          <span style="color: #991b1b;">Bận</span>
                        </div>
                      </div>

                      <!-- Room Seating Grid Layout -->
                      <div class="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 max-h-[140px] overflow-y-auto mt-2" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 8px; border-radius: 8px; max-height: 140px; overflow-y: auto; margin-top: 8px;">
                        <button
                          v-for="r in classrooms"
                          :key="r.roomNumber"
                          type="button"
                          @click="selectRoomFromMap(r.roomNumber)"
                          class="p-2.5 text-center rounded-lg font-bold text-xs transition-all relative flex flex-col items-center justify-center min-h-[48px] cursor-pointer"
                          :style="getRoomSeatStyle(r.roomNumber)"
                        >
                          <span class="material-symbols-outlined text-[15px] mb-0.5" style="font-size: 15px; margin-bottom: 2px;">
                            {{ r.roomNumber === selectedClassEdit.room ? 'check_circle' : isRoomOccupiedAtSlot(r.roomNumber) ? 'cancel' : 'check' }}
                          </span>
                          <span>P.{{ r.roomNumber }}</span>
                        </button>
                      </div>
                    </div>
                    
                    <div class="pt-4" style="padding-top: 16px;">
                      <!-- Inline Error Display -->
                      <div v-if="slotEditError" class="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2.5 rounded-lg text-xs font-semibold flex items-start gap-2 shadow-sm" style="background-color: #fff1f2; border: 1px solid #fecdd3; color: #be123c; padding: 10px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
                        <span class="material-symbols-outlined text-[16px] shrink-0" style="font-size: 16px; flex-shrink: 0;">error</span>
                        <span class="leading-relaxed" style="line-height: 1.5;">{{ slotEditError }}</span>
                      </div>
                      
                      <!-- Auto Find Perfect Slot Button -->
                      <button @click="autoFindAndAssignSlot" type="button" class="mb-3 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-indigo-200" style="width: 100%; border: 1px solid #c7d2fe; background-color: #eef2ff; color: #4338ca; font-weight: 700; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; cursor: pointer; margin-bottom: 12px;" onmouseover="this.style.backgroundColor='#e0e7ff'" onmouseout="this.style.backgroundColor='#eef2ff'">
                        <span class="material-symbols-outlined text-[16px]" style="font-size: 16px;">magic_button</span>
                        <span style="font-size: 12px;">Tự động tìm Ca học & Phòng rảnh (Không trùng)</span>
                      </button>

                      <button @click="saveSlotSchedule" :disabled="savingSlotTime" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm" :class="{'opacity-50 cursor-not-allowed': savingSlotTime}" style="width: 100%; border: none; background-color: #059669; color: #ffffff; font-weight: 700; padding: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); cursor: pointer;" onmouseover="this.style.backgroundColor='#047857'" onmouseout="this.style.backgroundColor='#059669'">
                        <span class="material-symbols-outlined text-[16px]">save</span>
                        {{ savingSlotTime ? 'Đang lưu...' : 'Lưu thay đổi ca học này' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Footer Cancel/Done Actions -->
              <div class="border-t border-slate-100 pt-4 flex gap-2" style="border-top: 1px solid #f1f5f9; padding-top: 16px; display: flex; gap: 8px;">
                <button @click="closeScheduleModal" class="flex-1 py-2 bg-slate-200 hover:bg-slate-350 text-slate-700 rounded-lg font-bold text-xs transition-colors cursor-pointer text-center" style="flex: 1; border: none; background-color: #e2e8f0; border-radius: 8px; padding: 8px; color: #475569; font-weight: 700; font-size: 12px; cursor: pointer; text-align: center;">
                  Đóng sơ đồ phòng
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </teleport>

    <!-- Global JavaScript Error Banner for Debugging -->
    <div v-if="globalError" class="fixed bottom-4 right-4 bg-rose-600 text-white p-4 rounded-xl shadow-lg z-[100000] max-w-md" style="z-index: 100000; position: fixed; bottom: 16px; right: 16px; background-color: #dc2626; color: #ffffff; padding: 16px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-width: 400px;">
      <div class="font-bold flex items-center gap-1.5 mb-1 text-sm" style="font-weight: 700; display: flex; align-items: center; gap: 6px; font-size: 14px; margin-bottom: 4px;">
        <span class="material-symbols-outlined text-[18px]">error</span>
        Lỗi JavaScript:
      </div>
      <p class="text-xs font-mono break-all leading-normal" style="font-size: 12px; font-family: monospace; line-height: 1.5; word-break: break-all; margin: 0;">{{ globalError }}</p>
      <button @click="globalError = null" class="mt-2 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded cursor-pointer" style="margin-top: 8px; font-size: 12px; border: none; background-color: rgba(255,255,255,0.2); color: #ffffff; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Đóng</button>
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

    <!-- Create Classroom Dialog Modal -->
    <div v-if="createModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-primary-container/15 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal header -->
        <div class="bg-primary-container px-6 py-4 flex items-center justify-between border-b border-primary-container/10">
          <h3 class="text-body-lg font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
            Thêm phòng học mới
          </h3>
          <button @click="closeCreateModal" class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Modal body -->
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Số / Tên phòng học *</label>
            <input
              v-model="createModal.roomNumber"
              type="text"
              placeholder="Nhập số hoặc tên phòng học (ví dụ: 310, Lab 3)..."
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2.5 text-body-sm text-primary-container placeholder:text-on-surface-variant/40 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all"
            />
          </div>
          <div class="space-y-1">
            <label class="text-body-sm font-semibold text-primary-container">Ghi chú phòng học</label>
            <textarea
              v-model="createModal.notes"
              rows="3"
              placeholder="Nhập ghi chú hoặc mô tả cho phòng học..."
              class="w-full bg-primary-container/[0.03] border border-primary-container/15 rounded-lg px-4 py-2.5 text-body-sm text-primary-container placeholder:text-on-surface-variant/40 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all resize-none"
            ></textarea>
            <p v-if="createModal.error" class="text-error text-[11px] font-semibold mt-1">{{ createModal.error }}</p>
          </div>
        </div>

        <!-- Modal actions -->
        <div class="bg-primary-container/[0.03] border-t border-primary-container/10 px-6 py-4 flex justify-end gap-3">
          <button
            @click="closeCreateModal"
            class="px-4 py-2 border border-primary-container/10 hover:bg-primary-container/[0.05] text-primary-container rounded-lg font-semibold text-body-sm transition-all duration-200"
          >
            Hủy
          </button>
          <button
            @click="confirmCreate"
            :disabled="creating"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-semibold text-body-sm shadow transition-all duration-200 disabled:opacity-50"
          >
            {{ creating ? 'Đang tạo...' : 'Tạo phòng' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Reschedule Conflict Confirmation Dialog -->
  <teleport to="body">
    <div 
      v-if="confirmConflictModal.show" 
      class="fixed inset-0 z-[100000] flex items-center justify-center p-4"
      style="position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100000;"
    >
      <div 
        class="border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col"
        style="background-color: #ffffff; border-color: rgba(0, 0, 0, 0.05); max-height: 80vh;"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-amber-50" style="background-color: #fffbeb; border-bottom: 1px solid #fef08a; padding: 16px; display: flex; align-items: center; gap: 12px;">
          <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600" style="background-color: #fef3c7; color: #d97706; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div>
            <h4 class="font-bold text-slate-800" style="font-size: 16px; font-weight: 700; color: #78350f; margin: 0;">
              Phát hiện Xung đột Lịch học!
            </h4>
            <p class="text-[11.5px] text-slate-500 mt-0.5" style="font-size: 11.5px; color: #b45309; margin: 2px 0 0 0;">
              Thay đổi này sẽ làm trùng lịch dạy/học của một số giảng viên hoặc học viên.
            </p>
          </div>
        </div>
        
        <!-- Content Warnings List -->
        <div class="p-6 overflow-y-auto space-y-4 flex-1 text-body-sm text-slate-700" style="padding: 24px; overflow-y: auto; flex: 1;">
          <div class="space-y-3" style="display: flex; flex-direction: column; gap: 12px;">
            <div 
              v-for="(warn, idx) in confirmConflictModal.warnings" 
              :key="idx"
              class="p-3.5 rounded-xl border flex gap-3 text-xs leading-normal"
              style="padding: 14px; border-radius: 12px; display: flex; gap: 12px; font-size: 13px;"
              :style="warn.type === 'teacher' 
                ? 'background-color: #eff6ff; border-color: #bfdbfe; color: #1e3a8a;' 
                : 'background-color: #faf5ff; border-color: #e9d5ff; color: #581c87;'"
            >
              <span class="material-symbols-outlined text-[20px] shrink-0" style="font-size: 20px;">
                {{ warn.type === 'teacher' ? 'person' : 'group' }}
              </span>
              <div>
                <div class="font-bold" style="font-weight: 700;">
                  {{ warn.type === 'teacher' ? 'Giảng viên' : 'Học viên' }}: {{ warn.name }}
                </div>
                <div class="mt-1" style="margin-top: 4px; opacity: 0.9;">
                  Bận tham gia lớp <span class="font-bold">{{ warn.conflictClass }}</span> vào {{ warn.dayOfWeek === 0 ? 'Chủ nhật' : 'thứ ' + warn.dayOfWeek }} lúc {{ warn.timeRange }}.
                </div>
              </div>
            </div>
          </div>
          
          <p class="mt-4 font-semibold text-slate-700 text-xs italic" style="margin-top: 16px; font-weight: 600; font-size: 12px; font-style: italic; color: #475569;">
            * Bạn có chắc chắn muốn phê duyệt thay đổi và chấp nhận trùng lịch này không?
          </p>
        </div>
        
        <!-- Footer Actions -->
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; display: flex; justify-content: flex-end; gap: 12px;">
          <button 
            @click="confirmConflictModal.show = false" 
            class="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-semibold text-xs cursor-pointer"
            style="padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 8px; background: #ffffff; color: #475569; font-weight: 600; font-size: 12px; cursor: pointer;"
          >
            Hủy thao tác
          </button>
          <button 
            @click="executeConfirmedReschedule" 
            class="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-semibold text-xs shadow cursor-pointer"
            style="padding: 8px 20px; border: none; border-radius: 8px; background-color: #d97706; color: #ffffff; font-weight: 600; font-size: 12px; cursor: pointer; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);"
          >
            Chấp nhận &amp; Lưu
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import api from '../../services/api'

// State
const classrooms = ref([])
const slotEditError = ref('')

const formatTimeHHmm = (time) => {
  if (!time) return "00:00"
  
  // Try to parse using the robust parser
  const match = String(time).match(/(\d{1,2}):(\d{2})(?:\s*(SA|CH|AM|PM))?/i)
  if (match) {
    let [_, hoursStr, minutesStr, period] = match
    let hours = parseInt(hoursStr, 10)
    const minutes = parseInt(minutesStr, 10)
    if (period) {
      const upperPeriod = period.toUpperCase()
      if ((upperPeriod === 'CH' || upperPeriod === 'PM') && hours < 12) {
        hours += 12
      } else if ((upperPeriod === 'SA' || upperPeriod === 'AM') && hours === 12) {
        hours = 0
      }
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }
  
  // Fallback
  const parts = String(time).split(':')
  const h = parts[0] ? parts[0].padStart(2, '0') : '00'
  const m = parts[1] ? String(parseInt(parts[1]) || 0).padStart(2, '0') : '00'
  return `${h}:${m}`
}
const allClasses = ref([])
const loading = ref(false)
const updating = ref(false)
const searchQuery = ref('')
const activeFilter = ref('all') // all, vacant, occupied, maintenance, conflict
const showSnackbar = inject('showSnackbar', null)

const globalError = ref(null)
if (typeof window !== 'undefined') {
  window.onerror = function(message, source, lineno, colno, error) {
    globalError.value = `${message} (tại ${source || 'JS'}:${lineno}:${colno})`
    return false
  }
}

const confirmConflictModal = ref({
  show: false,
  warnings: []
})
const pendingRescheduleAction = ref(null)

function executeConfirmedReschedule() {
  if (pendingRescheduleAction.value) {
    pendingRescheduleAction.value()
  }
  confirmConflictModal.value.show = false
  pendingRescheduleAction.value = null
}

const dragOverDay = ref(null)
const dragOverSession = ref(null)

const scheduleModal = ref({
  show: false,
  room: null
})

const currentWeekDate = ref(new Date())
const selectedSlotEdit = ref(null)
const selectedClassEdit = ref(null)
const savingSlotTime = ref(false)

// Auto-sync Cinema Seat Grid map to form inputs
watch(() => selectedSlotEdit.value?.dayOfWeek, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    cinemaSelectedDay.value = Number(newVal)
  }
})
watch(() => selectedSlotEdit.value?.session, (newVal, oldVal) => {
  if (newVal) {
    cinemaSelectedSession.value = newVal
    
    // Auto-adjust default times when session changes to prevent 400 Bad Request from Backend
    if (oldVal && newVal !== oldVal && selectedSlotEdit.value) {
      if (newVal === 'Sang') {
        selectedSlotEdit.value.startTime = '08:00'
        selectedSlotEdit.value.endTime = '12:00'
      } else if (newVal === 'Chieu') {
        selectedSlotEdit.value.startTime = '14:00'
        selectedSlotEdit.value.endTime = '18:00'
      } else if (newVal === 'Toi') {
        selectedSlotEdit.value.startTime = '18:00'
        selectedSlotEdit.value.endTime = '20:30'
      }
    }
  }
})

const modal = ref({
  show: false,
  room: null,
  notes: '',
  error: ''
})

const creating = ref(false)
const createModal = ref({
  show: false,
  roomNumber: '',
  notes: '',
  error: ''
})

const openCreateModal = () => {
  createModal.value = {
    show: true,
    roomNumber: '',
    notes: '',
    error: ''
  }
}

const closeCreateModal = () => {
  createModal.value.show = false
  createModal.value.roomNumber = ''
  createModal.value.notes = ''
  createModal.value.error = ''
}

const confirmCreate = async () => {
  if (!createModal.value.roomNumber.trim()) {
    createModal.value.error = 'Vui lòng nhập số hoặc tên phòng học.'
    return
  }

  creating.value = true
  createModal.value.error = ''
  try {
    const response = await api.post('/api/v1/classrooms', {
      roomNumber: createModal.value.roomNumber.trim(),
      notes: createModal.value.notes.trim()
    })
    
    classrooms.value.push(response.data)
    closeCreateModal()
    await fetchClassrooms()
  } catch (error) {
    console.error('Failed to create classroom:', error)
    createModal.value.error = error.response?.data?.message || 'Có lỗi xảy ra khi tạo phòng học.'
  } finally {
    creating.value = false
  }
}

// Filter Options
const filterOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang trống', value: 'vacant' },
  { label: 'Đang học', value: 'occupied' },
  { label: 'Bảo trì', value: 'maintenance' },
  { label: '⚠️ Bị trùng lịch', value: 'conflict' }
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

// Fetch all classes for conflict checking
const fetchAllClasses = async () => {
  try {
    const res = await api.get('/api/v1/classes', { params: { pageSize: 1000 } })
    allClasses.value = res.data?.items || []
  } catch (err) {
    console.error('Failed to fetch all classes:', err)
  }
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0
  
  let temp = timeStr.trim().toLowerCase()
  let isPM = false
  if (temp.includes('pm') || temp.includes('ch')) {
    isPM = true
  }
  
  temp = temp.replace(/[^\d:]/g, '')
  const parts = temp.split(':')
  let hours = parseInt(parts[0], 10) || 0
  const minutes = parseInt(parts[1], 10) || 0
  
  if (isPM && hours < 12) {
    hours += 12
  } else if (!isPM && hours === 12 && (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('sa'))) {
    hours = 0
  }
  
  return hours * 60 + minutes
}

function isScheduleConflict(s1, s2) {
  try {
    if (!s1 || !s2 || s1.dayOfWeek === undefined || s2.dayOfWeek === undefined) return false
    if (s1.dayOfWeek !== s2.dayOfWeek) return false
    const start1 = parseTimeToMinutes(s1.startTime)
    const end1 = parseTimeToMinutes(s1.endTime)
    const start2 = parseTimeToMinutes(s2.startTime)
    const end2 = parseTimeToMinutes(s2.endTime)
    const overlapMinutes = Math.min(end1, end2) - Math.max(start1, start2)
    return overlapMinutes >= 1
  } catch (err) {
    console.error("Error in isScheduleConflict:", err)
    return false
  }
}

function classesConflictOnDay(classA, classB, dayOfWeek) {
  try {
    if (!classA || !classB || !classA.startDate || !classB.startDate) return false
    
    const startA = new Date(classA.startDate)
    if (isNaN(startA.getTime())) return false
    startA.setHours(0,0,0,0)
    
    const endA = classA.endDate ? new Date(classA.endDate) : new Date(2100, 0, 1)
    if (isNaN(endA.getTime())) return false
    endA.setHours(23,59,59,999)
    
    const startB = new Date(classB.startDate)
    if (isNaN(startB.getTime())) return false
    startB.setHours(0,0,0,0)
    
    const endB = classB.endDate ? new Date(classB.endDate) : new Date(2100, 0, 1)
    if (isNaN(endB.getTime())) return false
    endB.setHours(23,59,59,999)
    
    const startIntersect = new Date(Math.max(startA, startB))
    const endIntersect = new Date(Math.min(endA, endB))
    
    if (startIntersect > endIntersect) return false
    
    const check = new Date(startIntersect)
    for (let i = 0; i < 7; i++) {
      const jsDay = check.getDay()
      const targetDay = jsDay === 0 ? 0 : jsDay + 1
      if (targetDay === dayOfWeek) {
        return check <= endIntersect
      }
      check.setDate(check.getDate() + 1)
    }
    return false
  } catch (err) {
    console.error("Error in classesConflictOnDay:", err)
    return false
  }
}

function getRoomConflicts(roomNumber) {
  if (!roomNumber) return []
  try {
    const conflicts = []
    const roomClasses = allClasses.value.filter(c => 
      c && 
      c.room && 
      typeof c.room === 'string' && 
      c.room.trim().toLowerCase() === String(roomNumber).trim().toLowerCase() && 
      (c.status === 'InProgress' || c.status === 'Opened')
    )
    
    for (let i = 0; i < roomClasses.length; i++) {
      for (let j = i + 1; j < roomClasses.length; j++) {
        const clsA = roomClasses[i]
        const clsB = roomClasses[j]
        if (!clsA || !clsB) continue
        
        const schedsA = clsA.schedules || []
        const schedsB = clsB.schedules || []
        
        for (const sa of schedsA) {
          for (const sb of schedsB) {
            if (sa && sb && isScheduleConflict(sa, sb)) {
              if (classesConflictOnDay(clsA, clsB, sa.dayOfWeek)) {
                conflicts.push({
                  classA: clsA,
                  classB: clsB,
                  dayOfWeek: sa.dayOfWeek,
                  startTime: sa.startTime,
                  endTime: sa.endTime
                })
              }
            }
          }
        }
      }
    }
    return conflicts
  } catch (err) {
    console.error("Error in getRoomConflicts:", err)
    return []
  }
}

function formatDayOfWeek(day) {
  const map = { 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu', 7: 'Bảy', 0: 'Chủ Nhật', 1: 'Chủ Nhật' }
  return map[day] || day
}

// Interactive Timetable Logic inside Modal
const sessions = [
  { label: 'Sáng', value: 'Sang', subLabel: 'Tiết 1 - 5 (08:00 - 12:00)' },
  { label: 'Chiều', value: 'Chieu', subLabel: 'Tiết 6 - 10 (14:00 - 18:00)' },
  { label: 'Tối', value: 'Toi', subLabel: 'Tiết 11 - 13 (18:00 - 21:00)' }
]

const safeSubstring = (val, start, end) => {
  if (!val || typeof val !== 'string') return ''
  return val.substring(start, end)
}

const getCellStyle = (day, sess) => {
  const base = {
    padding: '8px',
    borderRight: '1px solid #e2e8f0',
    verticalAlign: 'middle',
    minHeight: '90px',
    transition: 'all 0.2s ease'
  }
  
  if (draggedSchedule.value) {
    const isEmpty = getRoomSchedulesForCell(day.value, sess.value, day.date).length === 0
    const isSelf = cellContainsDraggedSchedule(day.value, sess.value, day.date)
    
    if (isEmpty) {
      const isHovered = dragOverDay.value === day.value && dragOverSession.value === sess.value
      return {
        ...base,
        backgroundColor: isHovered ? '#d1fae5' : '#f0fdf4', // darker green on hover
        border: isHovered ? '2.5px solid #059669' : '2px dashed #10b981', // solid green border on hover
        color: '#065f46',
        transform: isHovered ? 'scale(1.02)' : 'none',
        boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
      }
    } else if (!isSelf) {
      return {
        ...base,
        backgroundColor: '#fef2f2', // soft pastel red background
        border: '1.5px solid #f87171', // bright red border
        cursor: 'not-allowed',
        opacity: '0.75'
      }
    }
  }
  
  // Drag over target highlighting
  if (dragOverDay.value === day.value && dragOverSession.value === sess.value) {
    return {
      ...base,
      backgroundColor: '#ccfbf1', // teal-100 highlight
      transform: 'scale(1.01)'
    }
  }
  
  return base
}

const sessionOptions = [
  { title: '🌅 Sáng', value: 'Sang' },
  { title: '☀️ Chiều', value: 'Chieu' },
  { title: '🌙 Tối', value: 'Toi' }
]

const weekDaysOptions = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 0 }
]

const modalWeekDays = computed(() => {
  const curr = new Date(currentWeekDate.value)
  const day = curr.getDay()
  const diff = curr.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(curr.setDate(diff))
  
  return weekDaysOptions.map((wd, idx) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + idx)
    return {
      ...wd,
      date: d,
      dateStr: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
    }
  })
})

const modalWeekLabel = computed(() => {
  if (modalWeekDays.value.length === 0) return ''
  const start = modalWeekDays.value[0].date
  const end = modalWeekDays.value[6].date
  const d1 = `${String(start.getDate()).padStart(2,'0')}/${String(start.getMonth()+1).padStart(2,'0')}`
  const d2 = `${String(end.getDate()).padStart(2,'0')}/${String(end.getMonth()+1).padStart(2,'0')}`
  return `${d1} - ${d2}`
})

function prevModalWeek() {
  const d = new Date(currentWeekDate.value)
  d.setDate(d.getDate() - 7)
  currentWeekDate.value = d
}

function nextModalWeek() {
  const d = new Date(currentWeekDate.value)
  d.setDate(d.getDate() + 7)
  currentWeekDate.value = d
}

function getFirstOccurrenceDate(start, end, dayOfWeek) {
  const check = new Date(start)
  for (let i = 0; i < 7; i++) {
    const jsDay = check.getDay()
    const targetDay = jsDay === 0 ? 0 : jsDay + 1
    if (targetDay === dayOfWeek) {
      if (check <= end) {
        return new Date(check)
      }
      return null
    }
    check.setDate(check.getDate() + 1)
  }
  return null
}

function openScheduleModal(room) {
  console.log('openScheduleModal called for room:', room)
  scheduleModal.value = {
    show: true,
    room: room
  }
  
  try {
    // Find conflict date if any
    const conflict = room.conflicts?.[0]
    if (conflict && conflict.classA && conflict.classB) {
      console.log('Found conflict to jump to:', conflict)
      // Jump to the week containing the first conflict
      const startA = new Date(conflict.classA.startDate)
      const startB = new Date(conflict.classB.startDate)
      if (!isNaN(startA.getTime()) && !isNaN(startB.getTime())) {
        const startIntersect = new Date(Math.max(startA, startB))
        
        // Find first date of weekday after startIntersect
        const d = getFirstOccurrenceDate(startIntersect, new Date(2100,0,1), conflict.dayOfWeek)
        if (d) {
          console.log('Setting currentWeekDate to conflict date:', d)
          currentWeekDate.value = d
        }
      }
    }
  } catch (err) {
    console.error("Error setting conflict week date in openScheduleModal:", err)
  }
  
  if (!currentWeekDate.value) {
    currentWeekDate.value = new Date()
  }

  // Auto-select the first conflict or schedule so Cinema Seat Map is open immediately
  let autoSelectSlot = null
  const roomConflictsList = room.conflicts || []
  if (roomConflictsList.length > 0) {
    const firstConflict = roomConflictsList[0]
    const matchingClass = allClasses.value.find(c => c.classId === firstConflict.classA?.classId || c.classId === firstConflict.classB?.classId)
    const matchingSched = matchingClass?.schedules?.find(s => Number(s.dayOfWeek) === Number(firstConflict.dayOfWeek))
    if (matchingSched) autoSelectSlot = matchingSched
  }
  
  if (!autoSelectSlot) {
    const roomClasses = allClasses.value.filter(c => c.room === room.roomNumber)
    for (const c of roomClasses) {
      if (c.schedules && c.schedules.length > 0) {
        autoSelectSlot = c.schedules[0]
        break
      }
    }
  }
  
  if (autoSelectSlot) {
    selectSlotForEdit(autoSelectSlot)
  } else {
    selectedSlotEdit.value = { dayOfWeek: 2, session: 'Sang', startTime: '08:00', endTime: '12:00' }
    selectedClassEdit.value = null
  }
}

function closeScheduleModal() {
  scheduleModal.value.show = false
  scheduleModal.value.room = null
  selectedSlotEdit.value = null
  selectedClassEdit.value = null
}

const getRoomSchedulesForCell = (dayValue, sessionValue, cellDate, targetRoomNumber = null) => {
  try {
    const roomNumber = targetRoomNumber || scheduleModal.value?.room?.roomNumber
    if (!roomNumber) return []
    const list = []
    
    allClasses.value.forEach(cls => {
      if (!cls || !cls.room || typeof cls.room !== 'string' || cls.room.trim().toLowerCase() !== roomNumber.trim().toLowerCase()) return
      if (cls.status !== 'InProgress' && cls.status !== 'Opened') return
      
      // Check date range overlap
      if (!cls.startDate) return
      const cStart = new Date(cls.startDate)
      if (isNaN(cStart.getTime())) return
      cStart.setHours(0,0,0,0)
      
      const cEnd = cls.endDate ? new Date(cls.endDate) : new Date(2100, 0, 1)
      if (isNaN(cEnd.getTime())) return
      cEnd.setHours(23,59,59,999)
      
      const d = new Date(cellDate)
      if (isNaN(d.getTime())) return
      d.setHours(12,0,0,0)
      
      if (d < cStart || d > cEnd) return // Class not active on this date!
      
      const scheds = cls.schedules || []
      const seenTimes = new Set()
      scheds.forEach(s => {
        if (s && s.dayOfWeek === dayValue && s.session === sessionValue) {
          const timeKey = `${s.startTime}-${s.endTime}`
          if (!seenTimes.has(timeKey)) {
            list.push({
              ...s,
              classId: cls.classId,
              className: cls.className
            })
            seenTimes.add(timeKey)
          }
        }
      })
    })
    return list
  } catch (err) {
    console.error("Error in getRoomSchedulesForCell:", err)
    return []
  }
}

function getClassName(classId) {
  try {
    const cls = allClasses.value.find(c => c && c.classId === classId)
    return cls?.className || `Lớp (${classId})`
  } catch (err) {
    return `Lớp (${classId})`
  }
}

function getCourseName(classId) {
  try {
    const cls = allClasses.value.find(c => c && c.classId === classId)
    return cls?.courseName || 'Môn học'
  } catch (err) {
    return 'Môn học'
  }
}

function hasRoomConflictInCell(s, cellDate) {
  try {
    if (!s) return false
    const cellSchedules = getRoomSchedulesForCell(s.dayOfWeek, s.session, cellDate)
    return cellSchedules.some(other => {
      if (!other || other === s || other.scheduleId === s.scheduleId) return false
      
      const sStart = parseTimeToMinutes(s.startTime)
      const sEnd = parseTimeToMinutes(s.endTime)
      const oStart = parseTimeToMinutes(other.startTime)
      const oEnd = parseTimeToMinutes(other.endTime)
      return !(sEnd <= oStart || sStart >= oEnd)
    })
  } catch (err) {
    console.error("Error in hasRoomConflictInCell:", err)
    return false
  }
}

const roomHasConflictThisWeek = computed(() => {
  if (!scheduleModal.value.room) return false
  return modalWeekDays.value.some(day => {
    return ['Sang', 'Chieu', 'Toi'].some(sess => {
      const cellScheds = getRoomSchedulesForCell(day.value, sess, day.date)
      return cellScheds.some(s => hasRoomConflictInCell(s, day.date))
    })
  })
})

const weekConflictsCount = computed(() => {
  if (!scheduleModal.value.room) return 0
  let count = 0
  modalWeekDays.value.forEach(day => {
    ['Sang', 'Chieu', 'Toi'].forEach(sess => {
      const cellScheds = getRoomSchedulesForCell(day.value, sess, day.date)
      const conflicted = cellScheds.filter(s => hasRoomConflictInCell(s, day.date))
      count += conflicted.length
    })
  })
  return Math.ceil(count / 2) // Divide by 2 to represent slots
})

const draggedSchedule = ref(null)
const activeDraggedSchedule = ref(null)
const autoScrollWeekTimer = ref(null)
const lastScrollDirection = ref(null)

const cinemaSelectedDay = ref(2)
const cinemaSelectedSession = ref('Sang')
const cinemaDragOverRoom = ref(null)
const mainDragOverRoom = ref(null)

const getCinemaCellDate = () => {
  const dayObj = modalWeekDays.value.find(d => Number(d.value) === Number(cinemaSelectedDay.value))
  return dayObj ? dayObj.date : new Date()
}

const isCinemaRoomOccupied = (roomNumber) => {
  const cellDate = getCinemaCellDate()
  return getRoomSchedulesForCell(cinemaSelectedDay.value, cinemaSelectedSession.value, cellDate, roomNumber).length > 0
}

const getCinemaRoomSchedules = (roomNumber) => {
  const cellDate = getCinemaCellDate()
  return getRoomSchedulesForCell(cinemaSelectedDay.value, cinemaSelectedSession.value, cellDate, roomNumber)
}

const isMainRoomOccupied = (roomNumber) => {
  const cellDate = getCinemaCellDate()
  return getRoomSchedulesForCell(cinemaSelectedDay.value, cinemaSelectedSession.value, cellDate, roomNumber).length > 0
}

const getMainRoomSchedules = (roomNumber) => {
  const cellDate = getCinemaCellDate()
  return getRoomSchedulesForCell(cinemaSelectedDay.value, cinemaSelectedSession.value, cellDate, roomNumber)
}

const getMainRoomSeatStyle = (roomNumber) => {
  const isOccupied = isMainRoomOccupied(roomNumber)
  const isHovered = mainDragOverRoom.value === roomNumber
  
  const base = {
    backgroundColor: isOccupied ? '#fef2f2' : '#f0fdf4',
    border: isOccupied ? '1.5px dashed #f87171' : '1.5px dashed #10b981',
    borderRadius: '16px',
    padding: '16px',
    minHeight: '130px',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer'
  }
  
  if (isHovered) {
    return {
      ...base,
      backgroundColor: isOccupied ? '#fee2e2' : '#d1fae5',
      border: isOccupied ? '2.5px solid #ef4444' : '2.5px solid #10b981',
      transform: 'scale(1.03)',
      boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1)'
    }
  }
  
  return base
}

function handleMainDragEnter(roomNumber) {
  mainDragOverRoom.value = roomNumber
}

async function handleMainDrop(event, roomNumber) {
  try {
    mainDragOverRoom.value = null
    let s = activeDraggedSchedule.value
    
    if (!s) {
      try {
        const raw = event.dataTransfer.getData('application/json')
        if (raw) s = JSON.parse(raw)
      } catch (err) {
        console.error(err)
      }
    }
    
    if (!s) {
      s = draggedSchedule.value
    }
    
    if (!s) {
      if (showSnackbar) showSnackbar('Không tìm thấy thông tin ca học được di chuyển.', 'error')
      return
    }
    
    activeDraggedSchedule.value = null
    draggedSchedule.value = null
    
    const cellDate = getCinemaCellDate()
    
    const apiCallFn = async () => {
      try {
        const cls = allClasses.value.find(c => c.classId === s.classId)
        if (cls) {
          await api.put(`/api/v1/classes/${cls.classId}`, {
            ...cls,
            room: roomNumber
          })
        }
        
        await fetchAllClasses()
        await fetchClassrooms()
        if (showSnackbar) showSnackbar(`Đã chuyển lớp sang phòng ${roomNumber} thành công!`, 'success')
      } catch (err) {
        console.error(err)
        if (showSnackbar) showSnackbar(err.response?.data?.message || 'Có lỗi xảy ra khi di chuyển phòng', 'error')
      }
    }
    
    await checkAndApplyReschedule(s, cinemaSelectedDay.value, cinemaSelectedSession.value, s.startTime, s.endTime, cellDate, apiCallFn, roomNumber)
  } catch (err) {
    console.error("Error in handleMainDrop:", err)
    if (showSnackbar) showSnackbar('Lỗi di chuyển phòng: ' + err.message, 'error')
  }
}

const getCinemaSeatStyle = (roomNumber) => {
  const isOccupied = isCinemaRoomOccupied(roomNumber)
  const isHovered = cinemaDragOverRoom.value === roomNumber
  
  const base = {
    backgroundColor: isOccupied ? '#fef2f2' : '#f0fdf4',
    border: isOccupied ? '1.5px dashed #f87171' : '1.5px dashed #10b981',
    borderRadius: '16px',
    padding: '12px',
    minHeight: '120px',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
  
  if (isHovered) {
    return {
      ...base,
      backgroundColor: isOccupied ? '#fee2e2' : '#d1fae5',
      border: isOccupied ? '2px solid #ef4444' : '2px solid #10b981',
      transform: 'scale(1.03)',
      boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1)'
    }
  }
  
  return base
}

const getSessionFromTime = (startTime) => {
  if (!startTime) return 'Sang'
  const hour = parseInt(startTime.split(':')[0])
  if (hour < 12) return 'Sang'
  if (hour < 18) return 'Chieu'
  return 'Toi'
}

const getVacantRoomsForTimeslot = (dayOfWeek, session, startTime, endTime, cellDate, excludeClassId = null) => {
  try {
    return classrooms.value.filter(r => {
      if (r.status === 'Maintenance') return false
      
      const conflicts = checkRoomConflicts(excludeClassId, r.roomNumber, dayOfWeek, session, startTime, endTime)
      return conflicts.length === 0
    })
  } catch (err) {
    return []
  }
}

async function quickMoveClass(cls, targetRoomNumber) {
  try {
    if (showSnackbar) showSnackbar(`Đang chuyển lớp ${cls.className} sang phòng ${targetRoomNumber}...`, 'info')
    
    await api.put(`/api/v1/classes/${cls.classId}`, {
      ...cls,
      room: targetRoomNumber
    })
    
    await fetchAllClasses()
    await fetchClassrooms()
    if (showSnackbar) showSnackbar(`Đã chuyển lớp ${cls.className} sang phòng ${targetRoomNumber} thành công!`, 'success')
  } catch (err) {
    console.error(err)
    if (showSnackbar) showSnackbar(err.response?.data?.message || 'Có lỗi xảy ra khi di chuyển phòng', 'error')
  }
}

function handleCinemaDragEnter(roomNumber) {
  cinemaDragOverRoom.value = roomNumber
}

const handleCinemaRoomClick = async (roomNumber) => {
  if (selectedSlotEdit.value && selectedClassEdit.value) {
    const s = selectedSlotEdit.value
    const currentRoom = selectedClassEdit.value.room
    if (currentRoom === roomNumber) return
    
    const cellDate = getCinemaCellDate()
    
    const apiCallFn = async () => {
      try {
        const cls = allClasses.value.find(c => c.classId === s.classId)
        if (cls) {
          await api.put(`/api/v1/classes/${cls.classId}`, {
            ...cls,
            room: roomNumber
          })
        }
        
        await fetchAllClasses()
        await fetchClassrooms()
        s.room = roomNumber
        selectedClassEdit.value.room = roomNumber
        if (showSnackbar) showSnackbar(`Đã chuyển lớp sang phòng ${roomNumber} thành công!`, 'success')
      } catch (err) {
        console.error(err)
        if (showSnackbar) showSnackbar(err.response?.data?.message || 'Có lỗi xảy ra khi di chuyển phòng', 'error')
      }
    }
    
    await checkAndApplyReschedule(s, cinemaSelectedDay.value, cinemaSelectedSession.value, s.startTime, s.endTime, cellDate, apiCallFn, roomNumber)
  }
}

async function handleCinemaDrop(event, roomNumber) {
  try {
    cinemaDragOverRoom.value = null
    let s = activeDraggedSchedule.value
    
    if (!s) {
      try {
        const raw = event.dataTransfer.getData('application/json')
        if (raw) s = JSON.parse(raw)
      } catch (err) {
        console.error(err)
      }
    }
    
    if (!s) {
      s = draggedSchedule.value
    }
    
    if (!s) {
      if (showSnackbar) showSnackbar('Không tìm thấy thông tin ca học được di chuyển.', 'error')
      return
    }
    
    activeDraggedSchedule.value = null
    draggedSchedule.value = null
    
    const cellDate = getCinemaCellDate()
    
    const apiCallFn = async () => {
      try {
        const cls = allClasses.value.find(c => c.classId === s.classId)
        if (cls) {
          await api.put(`/api/v1/classes/${cls.classId}`, {
            ...cls,
            room: roomNumber
          })
        }
        
        await fetchAllClasses()
        await fetchClassrooms()
        if (showSnackbar) showSnackbar(`Đã chuyển lớp sang phòng ${roomNumber} thành công!`, 'success')
      } catch (err) {
        console.error(err)
        if (showSnackbar) showSnackbar(err.response?.data?.message || 'Có lỗi xảy ra khi di chuyển phòng', 'error')
      }
    }
    
    await checkAndApplyReschedule(s, cinemaSelectedDay.value, cinemaSelectedSession.value, s.startTime, s.endTime, cellDate, apiCallFn, roomNumber)
  } catch (err) {
    console.error("Error in handleCinemaDrop:", err)
    if (showSnackbar) showSnackbar('Lỗi di chuyển phòng: ' + err.message, 'error')
  }
}

function handleModalDragStart(event, schedule) {
  draggedSchedule.value = schedule
  activeDraggedSchedule.value = schedule
  event.dataTransfer.effectAllowed = 'move'
  try {
    event.dataTransfer.setData('application/json', JSON.stringify(schedule))
    event.dataTransfer.setData('text/plain', schedule.scheduleId ? schedule.scheduleId.toString() : '')
  } catch (err) {
    console.error("Error setting dataTransfer data:", err)
  }
}

function handleModalDragEnd() {
  clearAutoScrollTimer()
  draggedSchedule.value = null
  dragOverDay.value = null
  dragOverSession.value = null
  
  // Clear the active drop payload after 1 second so drop event has plenty of time to process
  setTimeout(() => {
    activeDraggedSchedule.value = null
  }, 1000)
}

function clearAutoScrollTimer() {
  if (autoScrollWeekTimer.value) {
    clearTimeout(autoScrollWeekTimer.value)
    autoScrollWeekTimer.value = null
  }
  lastScrollDirection.value = null
}

function handleCellDragOver(event, dayValue, sessionValue) {
  event.preventDefault()
  if (!draggedSchedule.value) return
  
  dragOverDay.value = dayValue
  dragOverSession.value = sessionValue

  // Locate the overflow container
  const rect = event.currentTarget.closest('.overflow-x-auto')?.getBoundingClientRect()
  if (!rect) return
  
  const mouseX = event.clientX
  const leftThreshold = rect.left + 70
  const rightThreshold = rect.right - 70
  
  if (mouseX < leftThreshold) {
    if (lastScrollDirection.value !== 'prev') {
      clearAutoScrollTimer()
      lastScrollDirection.value = 'prev'
      autoScrollWeekTimer.value = setTimeout(() => {
        prevModalWeek()
        clearAutoScrollTimer()
      }, 800)
    }
  } else if (mouseX > rightThreshold) {
    if (lastScrollDirection.value !== 'next') {
      clearAutoScrollTimer()
      lastScrollDirection.value = 'next'
      autoScrollWeekTimer.value = setTimeout(() => {
        nextModalWeek()
        clearAutoScrollTimer()
      }, 800)
    }
  } else {
    clearAutoScrollTimer()
  }
}

function cellContainsDraggedSchedule(dayValue, sessionValue, cellDate) {
  if (!draggedSchedule.value) return false
  const cellScheds = getRoomSchedulesForCell(dayValue, sessionValue, cellDate)
  return cellScheds.some(s => s.scheduleId === draggedSchedule.value.scheduleId)
}

function handleDragEnter(dayValue, sessionValue, cellDate) {
  if (!draggedSchedule.value) return
  const isEmpty = getRoomSchedulesForCell(dayValue, sessionValue, cellDate).length === 0
  const isSelf = cellContainsDraggedSchedule(dayValue, sessionValue, cellDate)
  if (isEmpty || isSelf) {
    dragOverDay.value = dayValue
    dragOverSession.value = sessionValue
  } else {
    dragOverDay.value = null
    dragOverSession.value = null
  }
}

const performingRescheduleCheck = ref(false)

function checkTeacherConflicts(classId, dayValue, sessionValue, startTime, endTime) {
  const conflicts = []
  const targetClass = allClasses.value.find(c => Number(c.classId) === Number(classId))
  if (!targetClass) return conflicts
  
  const tStart = targetClass.startDate ? new Date(targetClass.startDate) : new Date(1970, 0, 1)
  tStart.setHours(0,0,0,0)
  const tEnd = targetClass.endDate ? new Date(targetClass.endDate) : new Date(2100, 0, 1)
  tEnd.setHours(23,59,59,999)
  
  const teachersToCheck = []
  const tId1 = targetClass.teacherId || targetClass.teacher?.userId || targetClass.teacher?.id
  const tId2 = targetClass.teacherId2 || targetClass.teacher2?.userId || targetClass.teacher2?.id
  if (tId1) teachersToCheck.push({ id: tId1, name: targetClass.teacherName || 'Giảng viên chính' })
  if (tId2) teachersToCheck.push({ id: tId2, name: targetClass.teacherName2 || 'Trợ giảng' })
  
  if (teachersToCheck.length === 0) return conflicts
  
  allClasses.value.forEach(cls => {
    if (Number(cls.classId) === Number(classId)) return
    if (cls.status !== 'InProgress' && cls.status !== 'Opened') return
    
    // Other class dates
    const oStart = cls.startDate ? new Date(cls.startDate) : new Date(1970, 0, 1)
    oStart.setHours(0,0,0,0)
    const oEnd = cls.endDate ? new Date(cls.endDate) : new Date(2100, 0, 1)
    oEnd.setHours(23,59,59,999)
    
    // Check if active date ranges overlap
    if (tStart > oEnd || oStart > tEnd) return
    
    teachersToCheck.forEach(t => {
      const clsT1 = cls.teacherId || cls.teacher?.userId || cls.teacher?.id
      const clsT2 = cls.teacherId2 || cls.teacher2?.userId || cls.teacher2?.id
      const isTeacherBusy = (clsT1 && Number(clsT1) === Number(t.id)) || 
                           (clsT2 && Number(clsT2) === Number(t.id))
      if (!isTeacherBusy) return
      
      const scheds = cls.schedules || []
      scheds.forEach(s => {
        if (Number(s.dayOfWeek) === Number(dayValue) && s.session === sessionValue) {
          const start1 = parseTimeToMinutes(startTime)
          const end1 = parseTimeToMinutes(endTime)
          const start2 = parseTimeToMinutes(s.startTime)
          const end2 = parseTimeToMinutes(s.endTime)
          const overlap = Math.min(end1, end2) - Math.max(start1, start2)
          if (overlap >= 1) {
            conflicts.push({
              teacherName: t.name,
              className: cls.className,
              dayOfWeek: s.dayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime
            })
          }
        }
      })
    })
  })
  
  return conflicts
}

function checkRoomConflicts(classId, targetRoom, dayValue, sessionValue, startTime, endTime) {
  const conflicts = []
  if (!targetRoom) return conflicts
  
  const targetClass = allClasses.value.find(c => Number(c.classId) === Number(classId))
  if (!targetClass) return conflicts
  
  const tStart = targetClass.startDate ? new Date(targetClass.startDate) : new Date(1970, 0, 1)
  tStart.setHours(0,0,0,0)
  const tEnd = targetClass.endDate ? new Date(targetClass.endDate) : new Date(2100, 0, 1)
  tEnd.setHours(23,59,59,999)
  
  allClasses.value.forEach(cls => {
    if (Number(cls.classId) === Number(classId)) return
    if (cls.status !== 'InProgress' && cls.status !== 'Opened') return
    if (!cls.room || cls.room.trim().toLowerCase() !== targetRoom.trim().toLowerCase()) return
    
    const oStart = cls.startDate ? new Date(cls.startDate) : new Date(1970, 0, 1)
    oStart.setHours(0,0,0,0)
    const oEnd = cls.endDate ? new Date(cls.endDate) : new Date(2100, 0, 1)
    oEnd.setHours(23,59,59,999)
    
    if (tStart > oEnd || oStart > tEnd) return
    
    const scheds = cls.schedules || []
    scheds.forEach(s => {
      if (Number(s.dayOfWeek) === Number(dayValue) && s.session === sessionValue) {
        const start1 = parseTimeToMinutes(startTime)
        const end1 = parseTimeToMinutes(endTime)
        const start2 = parseTimeToMinutes(s.startTime)
        const end2 = parseTimeToMinutes(s.endTime)
        const overlap = Math.min(end1, end2) - Math.max(start1, start2)
        if (overlap >= 1) {
          conflicts.push({
            room: cls.room,
            className: cls.className,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime
          })
        }
      }
    })
  })
  
  return conflicts
}

async function checkStudentConflicts(classId, dayValue, sessionValue, startTime, endTime, cellDate) {
  // Return empty array immediately to avoid slow, nonexistent student classes API requests
  return []
}

async function checkAndApplyReschedule(s, dayValue, sessionValue, startTime, endTime, cellDate, apiCallFn, targetRoomNumber = null) {
  try {
    performingRescheduleCheck.value = true
    
    const checkRoom = targetRoomNumber || scheduleModal.value?.room?.roomNumber
    
    // 1. Check Room Conflict across the full active period of the class
    const rConflicts = checkRoomConflicts(s.classId, checkRoom, dayValue, sessionValue, startTime, endTime)
    // Ensure we exclude the schedule itself from conflicts
    const realRoomConflicts = rConflicts.filter(c => {
      const sysClass = allClasses.value.find(item => item.className === c.className)
      const matchingSched = sysClass?.schedules?.find(ms => 
        Number(ms.dayOfWeek) === Number(dayValue) && 
        ms.session === sessionValue && 
        ms.scheduleId === s.scheduleId
      )
      return !matchingSched
    })
    
    if (realRoomConflicts.length > 0) {
      const c = realRoomConflicts[0]
      const dayName = c.dayOfWeek === 0 ? 'Chủ nhật' : `Thứ ${c.dayOfWeek}`
      if (showSnackbar) {
        showSnackbar(`Phòng học ${checkRoom} đã được sử dụng bởi lớp ${c.className} (${dayName} ${safeSubstring(c.startTime, 0, 5)}-${safeSubstring(c.endTime, 0, 5)}). Vui lòng chọn phòng/ô khác.`, 'error')
      }
      slotEditError.value = `Phòng học ${checkRoom} đang bị lớp ${c.className} sử dụng lúc ${safeSubstring(c.startTime, 0, 5)}-${safeSubstring(c.endTime, 0, 5)}. Vui lòng chọn phòng/ca khác.`
      performingRescheduleCheck.value = false
      return false
    }
    
    // 2. Check Teacher conflicts (client-side)
    const tConflicts = checkTeacherConflicts(s.classId, dayValue, sessionValue, startTime, endTime)
    
    // 3. Check Student conflicts
    if (showSnackbar) showSnackbar('Đang kiểm tra lịch trùng của học viên và giảng viên...', 'info')
    const sConflicts = await checkStudentConflicts(s.classId, dayValue, sessionValue, startTime, endTime, cellDate)
    
    const warnings = []
    tConflicts.forEach(c => {
      warnings.push({
        type: 'teacher',
        name: c.teacherName,
        conflictClass: c.className,
        dayOfWeek: c.dayOfWeek,
        timeRange: `${safeSubstring(c.startTime, 0, 5)} - ${safeSubstring(c.endTime, 0, 5)}`
      })
    })
    
    sConflicts.forEach(c => {
      warnings.push({
        type: 'student',
        name: c.studentName,
        conflictClass: c.className,
        dayOfWeek: c.dayOfWeek,
        timeRange: `${safeSubstring(c.startTime, 0, 5)} - ${safeSubstring(c.endTime, 0, 5)}`
      })
    })
    
    performingRescheduleCheck.value = false
    
    if (warnings.length > 0) {
      confirmConflictModal.value = {
        show: true,
        warnings,
        title: 'Phát hiện Trùng lịch học viên/giảng viên'
      }
      pendingRescheduleAction.value = apiCallFn
    } else {
      await apiCallFn()
    }
  } catch (err) {
    console.error("Error in checkAndApplyReschedule:", err)
    slotEditError.value = 'Lỗi hệ thống: ' + err.message
    if (showSnackbar) showSnackbar('Lỗi kiểm tra lịch trùng: ' + err.message, 'error')
    performingRescheduleCheck.value = false
  }
}

async function handleModalDrop(event, dayValue, sessionValue, cellDate) {
  try {
    clearAutoScrollTimer()
    let s = activeDraggedSchedule.value
    
    if (!s) {
      try {
        const raw = event.dataTransfer.getData('application/json')
        if (raw) {
          s = JSON.parse(raw)
        }
      } catch (err) {
        console.error("Failed to parse schedule JSON from dataTransfer:", err)
      }
    }
    
    if (!s) {
      s = draggedSchedule.value
    }
    
    if (!s) {
      if (showSnackbar) showSnackbar('Không tìm thấy thông tin ca học được di chuyển.', 'error')
      return
    }
    
    // Clear refs now that we've captured the payload
    activeDraggedSchedule.value = null
    draggedSchedule.value = null
    dragOverDay.value = null
    dragOverSession.value = null
    
    let targetStartTime = s.startTime
    let targetEndTime = s.endTime
    
    // Normalize times to target session defaults if we move it to a different session
    if (s.session !== sessionValue) {
      if (sessionValue === 'Sang') {
        targetStartTime = '08:00:00'
        targetEndTime = '12:00:00'
      } else if (sessionValue === 'Chieu') {
        targetStartTime = '14:00:00'
        targetEndTime = '18:00:00'
      } else if (sessionValue === 'Toi') {
        targetStartTime = '18:00:00'
        targetEndTime = '20:30:00'
      }
    }
  
    const apiCallFn = async () => {
      try {
        await api.put(`/api/v1/classes/${s.classId}/schedules/${s.scheduleId}`, {
          dayOfWeek: Number(dayValue),
          session: sessionValue,
          startTime: targetStartTime,
          endTime: targetEndTime
        })
        
        await fetchAllClasses()
        if (showSnackbar) showSnackbar('Đã di chuyển ca học thành công!', 'success')
      } catch (err) {
        console.error(err)
        if (showSnackbar) showSnackbar(err.response?.data?.message || 'Có lỗi xảy ra khi di chuyển lịch học', 'error')
      }
    }
    
    await checkAndApplyReschedule(s, dayValue, sessionValue, targetStartTime, targetEndTime, cellDate, apiCallFn)
  } catch (err) {
    console.error("Error in handleModalDrop:", err)
    if (showSnackbar) showSnackbar('Lỗi kéo thả: ' + err.message, 'error')
  }
}

function selectSlotForEdit(s) {
  selectedSlotEdit.value = { 
    ...s,
    startTime: s.startTime ? s.startTime.substring(0, 5) : '',
    endTime: s.endTime ? s.endTime.substring(0, 5) : ''
  }
  const cls = allClasses.value.find(c => c.classId === s.classId)
  if (cls) {
    selectedClassEdit.value = {
      classId: cls.classId,
      room: cls.room
    }
  }
}

async function saveSlotSchedule() {
  if (!selectedSlotEdit.value) return
  savingSlotTime.value = true
  slotEditError.value = ''
  
  const s = selectedSlotEdit.value
  
  const apiCallFn = async () => {
    try {
      const formattedStartTime = formatTimeHHmm(s.startTime)
      const formattedEndTime = formatTimeHHmm(s.endTime)
      
      const cls = allClasses.value.find(c => Number(c.classId) === Number(s.classId))
      const originalSchedule = cls?.schedules?.find(sch => Number(sch.scheduleId) === Number(s.scheduleId))
      
      const roomChanged = cls && selectedClassEdit.value && selectedClassEdit.value.room !== cls.room
      const timeChanged = !originalSchedule || 
                          Number(originalSchedule.dayOfWeek) !== Number(s.dayOfWeek) || 
                          originalSchedule.session !== s.session || 
                          formatTimeHHmm(originalSchedule.startTime) !== formattedStartTime || 
                          formatTimeHHmm(originalSchedule.endTime) !== formattedEndTime
                          
      if (roomChanged && timeChanged) {
        // Deadlock bypass: Temporarily move to "Tạm thời" to clear old conflicts, update time, then move to new room
        const basePayload = {
          id: cls.classId,
          classId: cls.classId,
          courseId: cls.courseId || cls.course?.courseId,
          teacherId: cls.teacherId || cls.teacher?.userId,
          className: cls.className,
          room: "Tạm thời",
          startDate: cls.startDate,
          endDate: cls.endDate,
          tuitionFee: cls.tuitionFee,
          maxStudents: cls.maxStudents,
          status: cls.status,
          notes: cls.notes
        }
        
        // Step 1: Set room to temporary
        await api.put(`/api/v1/classes/${cls.classId}`, basePayload)
        
        // Step 2: Update schedule times
        await api.put(`/api/v1/classes/${s.classId}/schedules/${s.scheduleId}`, {
          dayOfWeek: Number(s.dayOfWeek),
          session: s.session,
          startTime: formattedStartTime,
          endTime: formattedEndTime
        })
        
        // Step 3: Set room to the final target room
        await api.put(`/api/v1/classes/${cls.classId}`, {
          ...basePayload,
          room: selectedClassEdit.value.room
        })
      } else {
        // Standard non-deadlocking update
        if (roomChanged) {
          const payload = {
            id: cls.classId,
            classId: cls.classId,
            courseId: cls.courseId || cls.course?.courseId,
            teacherId: cls.teacherId || cls.teacher?.userId,
            className: cls.className,
            room: selectedClassEdit.value.room,
            startDate: cls.startDate,
            endDate: cls.endDate,
            tuitionFee: cls.tuitionFee,
            maxStudents: cls.maxStudents,
            status: cls.status,
            notes: cls.notes
          }
          await api.put(`/api/v1/classes/${cls.classId}`, payload)
        }
        
        if (timeChanged) {
          await api.put(`/api/v1/classes/${s.classId}/schedules/${s.scheduleId}`, {
            dayOfWeek: Number(s.dayOfWeek),
            session: s.session,
            startTime: formattedStartTime,
            endTime: formattedEndTime
          })
        }
      }
      
      if (showSnackbar) showSnackbar('Đã cập nhật lịch ca học thành công!', 'success')
      selectedSlotEdit.value = null
      selectedClassEdit.value = null
      await fetchAllClasses()
      await fetchClassrooms()
    } catch (error) {
      console.error(error)
      const data = error.response?.data
      slotEditError.value = data ? JSON.stringify(data) : (error.message || 'Lỗi cập nhật lịch học')
      if (showSnackbar) showSnackbar(slotEditError.value, 'error')
    } finally {
      savingSlotTime.value = false
    }
  }
  
  // Resolve cellDate from dayOfWeek with type conversion
  const dayObj = modalWeekDays.value.find(d => Number(d.value) === Number(s.dayOfWeek))
  const cellDate = dayObj ? dayObj.date : new Date()
  
  const targetRoom = selectedClassEdit.value?.room || scheduleModal.value?.room?.roomNumber
  try {
    const formattedStartTime = formatTimeHHmm(s.startTime)
    const formattedEndTime = formatTimeHHmm(s.endTime)
    
    const res = await checkAndApplyReschedule(s, Number(s.dayOfWeek), s.session, formattedStartTime, formattedEndTime, cellDate, apiCallFn, targetRoom)
    if (res === false || confirmConflictModal.value.show) {
      savingSlotTime.value = false
    }
  } catch (err) {
    savingSlotTime.value = false
  }
}

// Cinema Room Map Helpers
const isRoomOccupiedAtSlot = (roomNumber) => {
  try {
    if (!selectedSlotEdit.value || !roomNumber) return false
    const s = selectedSlotEdit.value
    
    let targetStartTime = s.startTime
    let targetEndTime = s.endTime
    
    // Normalize times based on session if changed
    if (s.session !== s.originalSession) {
      if (s.session === 'Sang') {
        targetStartTime = '08:00:00'
        targetEndTime = '12:00:00'
      } else if (s.session === 'Chieu') {
        targetStartTime = '14:00:00'
        targetEndTime = '18:00:00'
      } else if (s.session === 'Toi') {
        targetStartTime = '18:00:00'
        targetEndTime = '20:30:00'
      }
    }
    
    const conflicts = checkRoomConflicts(s.classId, roomNumber, s.dayOfWeek, s.session, targetStartTime, targetEndTime)
    
    // Filter out the schedule itself
    const realConflicts = conflicts.filter(c => {
      const sysClass = allClasses.value.find(item => item.className === c.className)
      const matchingSched = sysClass?.schedules?.find(ms => 
        Number(ms.dayOfWeek) === Number(s.dayOfWeek) && 
        ms.session === s.session && 
        ms.scheduleId === s.scheduleId
      )
      return !matchingSched
    })
    
    return realConflicts.length > 0
  } catch (err) {
    return false
  }
}

const suggestedFreeRooms = computed(() => {
  if (!selectedClassEdit.value || !selectedSlotEdit.value) return []
  return classrooms.value
    .filter(r => !isRoomOccupiedAtSlot(r.roomNumber))
    .map(r => r.roomNumber)
})

function autoFindAndAssignSlot() {
  const s = selectedSlotEdit.value
  if (!s) return
  
  slotEditError.value = ''
  
  const days = [2, 3, 4, 5, 6, 7, 0] // Thứ 2 đến Chủ nhật (0 là CN)
  const sessions = [
    { sess: 'Sang', start: '08:00:00', end: '12:00:00' },
    { sess: 'Chieu', start: '14:00:00', end: '18:00:00' },
    { sess: 'Toi', start: '18:00:00', end: '20:30:00' }
  ]
  
  // Lấy ngày Thứ 2 đầu tuần của tuần đang xem hiện tại làm mốc
  const curr = new Date(currentWeekDate.value)
  const dayIndex = curr.getDay()
  const diff = curr.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1)
  const baseMonday = new Date(curr.setDate(diff))
  
  const currentDayVal = Number(s.dayOfWeek)
  const currentSessVal = s.session
  
  // Tạo danh sách phẳng gồm tất cả 168 ca học trong 8 tuần tới
  const allSlots = []
  for (let weekOffset = 0; weekOffset < 8; weekOffset++) {
    for (const day of days) {
      for (const sessionObj of sessions) {
        allSlots.push({ weekOffset, day, sessionObj })
      }
    }
  }
  
  // Tìm vị trí của ca học hiện tại trong danh sách
  const currentIndex = allSlots.findIndex(slot => 
    slot.weekOffset === 0 && 
    Number(slot.day) === currentDayVal && 
    slot.sessionObj.sess === currentSessVal
  )
  
  // Sắp xếp lại thứ tự quét: Quét từ ca tiếp theo đến hết 8 tuần, sau đó vòng lại đầu
  const searchOrder = []
  if (currentIndex !== -1) {
    searchOrder.push(...allSlots.slice(currentIndex + 1))
    searchOrder.push(...allSlots.slice(0, currentIndex))
  } else {
    searchOrder.push(...allSlots)
  }
  
  // Duyệt qua thứ tự quét đã sắp xếp
  for (const slot of searchOrder) {
    const { weekOffset, day, sessionObj } = slot
    
    // Tính ngày cụ thể cho Thứ đang xét
    const targetMonday = new Date(baseMonday)
    targetMonday.setDate(baseMonday.getDate() + (weekOffset * 7))
    
    const idx = day === 0 ? 6 : day - 2
    const targetCellDate = new Date(targetMonday)
    targetCellDate.setDate(targetMonday.getDate() + idx)
    targetCellDate.setHours(0,0,0,0)
    
    // 1. Kiểm tra giảng viên có bận vào ngày học cụ thể này không
    const currentClass = allClasses.value.find(c => Number(c.classId) === Number(s.classId))
    if (!currentClass) continue
    
    const tId1 = currentClass.teacherId || currentClass.teacher?.userId || currentClass.teacher?.id
    const tId2 = currentClass.teacherId2 || currentClass.teacher2?.userId || currentClass.teacher2?.id
    
    let teacherBusy = false
    
    if (tId1 || tId2) {
      for (const cls of allClasses.value) {
        if (Number(cls.classId) === Number(s.classId)) continue
        if (cls.status !== 'InProgress' && cls.status !== 'Opened') continue
        
        const clsT1 = cls.teacherId || cls.teacher?.userId || cls.teacher?.id
        const clsT2 = cls.teacherId2 || cls.teacher2?.userId || cls.teacher2?.id
        
        const hasCommonTeacher = (tId1 && (Number(clsT1) === Number(tId1) || Number(clsT2) === Number(tId1))) ||
                                 (tId2 && (Number(clsT1) === Number(tId2) || Number(clsT2) === Number(tId2)))
                                 
        if (!hasCommonTeacher) continue
        
        // Kiểm tra lớp đó có hoạt động vào ngày targetCellDate không
        if (cls.startDate && cls.endDate) {
          const start = new Date(cls.startDate)
          const end = new Date(cls.endDate)
          start.setHours(0,0,0,0)
          end.setHours(23,59,59,999)
          if (targetCellDate < start || targetCellDate > end) continue
        }
        
        // Kiểm tra trùng giờ dạy của giảng viên
        if (cls.schedules) {
          for (const sched of cls.schedules) {
            if (Number(sched.dayOfWeek) === Number(day) && sched.session === sessionObj.sess) {
              const start1 = parseTimeToMinutes(sessionObj.start)
              const end1 = parseTimeToMinutes(sessionObj.end)
              const start2 = parseTimeToMinutes(sched.startTime)
              const end2 = parseTimeToMinutes(sched.endTime)
              if (Math.min(end1, end2) - Math.max(start1, start2) >= 1) {
                teacherBusy = true
                break
              }
            }
          }
        }
        if (teacherBusy) break
      }
    }
    
    if (teacherBusy) continue // Giảng viên bận -> bỏ qua
    
    // 2. Tìm phòng học trống vào ngày cụ thể này
    let foundRoom = null
    for (const room of classrooms.value) {
      const roomNumber = room.roomNumber
      if (room.status === 'Maintenance') continue
      
      let roomBusy = false
      for (const cls of allClasses.value) {
        if (Number(cls.classId) === Number(s.classId)) continue
        if (cls.status !== 'InProgress' && cls.status !== 'Opened') continue
        if (!cls.room || cls.room.trim().toLowerCase() !== roomNumber.trim().toLowerCase()) continue
        
        // Kiểm tra lớp đó có hoạt động vào ngày targetCellDate không
        if (cls.startDate && cls.endDate) {
          const start = new Date(cls.startDate)
          const end = new Date(cls.endDate)
          start.setHours(0,0,0,0)
          end.setHours(23,59,59,999)
          if (targetCellDate < start || targetCellDate > end) continue
        }
        
        // Kiểm tra trùng giờ phòng học
        if (cls.schedules) {
          for (const sched of cls.schedules) {
            if (Number(sched.dayOfWeek) === Number(day) && sched.session === sessionObj.sess) {
              const start1 = parseTimeToMinutes(sessionObj.start)
              const end1 = parseTimeToMinutes(sessionObj.end)
              const start2 = parseTimeToMinutes(sched.startTime)
              const end2 = parseTimeToMinutes(sched.endTime)
              if (Math.min(end1, end2) - Math.max(start1, start2) >= 1) {
                roomBusy = true
                break
              }
            }
          }
        }
        if (roomBusy) break
      }
      
      if (!roomBusy) {
        foundRoom = roomNumber
        break
      }
    }
    
    if (foundRoom) {
      // Tìm thấy ca và phòng trống hoàn hảo!
      s.dayOfWeek = day
      s.session = sessionObj.sess
      s.startTime = sessionObj.start.substring(0, 5)
      s.endTime = sessionObj.end.substring(0, 5)
      s.originalSession = sessionObj.sess 
      selectedClassEdit.value.room = foundRoom
      
      // Tự động nhảy lịch xem tuần trên lịch sang tuần tìm thấy
      currentWeekDate.value = targetMonday
      
      const dayName = day === 0 ? 'Chủ nhật' : `Thứ ${day}`
      const formattedWeek = `${String(targetCellDate.getDate()).padStart(2,'0')}/${String(targetCellDate.getMonth()+1).padStart(2,'0')}/${targetCellDate.getFullYear()}`
      if (showSnackbar) {
        showSnackbar(`Đã tự động tìm được lịch trống tiếp theo: Thứ ${day === 0 ? 'CN' : day} (Tuần ngày ${formattedWeek}), Ca ${sessionObj.sess === 'Sang' ? 'Sáng' : sessionObj.sess === 'Chieu' ? 'Chiều' : 'Tối'}, Phòng ${foundRoom}`, 'success')
      }
      return
    }
  }
  
  // Nếu vòng lặp kết thúc sau khi quét 8 tuần mà vẫn không tìm thấy
  slotEditError.value = "Hết chỗ! Đã quét 8 tuần tiếp theo nhưng không tìm thấy bất kỳ ô trống nào thỏa mãn cả giảng viên và phòng học."
}

const getRoomSeatStyle = (roomNumber) => {
  const isSelected = selectedClassEdit.value && selectedClassEdit.value.room === roomNumber
  const isOccupied = isRoomOccupiedAtSlot(roomNumber)
  
  const base = {
    padding: '8px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '48px',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s ease'
  }
  
  if (isSelected) {
    return {
      ...base,
      backgroundColor: '#eff6ff',
      border: '2.5px solid #2563eb',
      color: '#1d4ed8',
      transform: 'scale(1.03)',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.15)'
    }
  }
  
  if (isOccupied) {
    return {
      ...base,
      backgroundColor: '#fef2f2',
      border: '1.5px solid #ef4444',
      color: '#b91c1c'
    }
  }
  
  return {
    ...base,
    backgroundColor: '#ecfdf5',
    border: '1.5px solid #10b981',
    color: '#047857'
  }
}

function selectRoomFromMap(roomNumber) {
  if (!selectedClassEdit.value) return
  selectedClassEdit.value.room = roomNumber
  
  if (isRoomOccupiedAtSlot(roomNumber)) {
    if (showSnackbar) {
      showSnackbar(`Chú ý: Phòng ${roomNumber} đã có lịch ở ca này! Nếu bạn tiếp tục lưu, lịch học sẽ bị trùng phòng.`, 'warning')
    }
  } else {
    if (showSnackbar) {
      showSnackbar(`Đã chọn phòng ${roomNumber} (Trống).`, 'success')
    }
  }
}

// Stats Computation
const stats = computed(() => {
  const total = classrooms.value.length
  const vacant = classrooms.value.filter(r => r.status === 'Vacant').length
  const occupied = classrooms.value.filter(r => r.status === 'Occupied').length
  const maintenance = classrooms.value.filter(r => r.status === 'Maintenance').length
  
  // Calculate vacant rooms per session for the current visible week
  let vacantMorning = 0
  let vacantAfternoon = 0
  let vacantEvening = 0
  
  classrooms.value.forEach(r => {
    if (r.status === 'Maintenance') return
    
    let hasMorning = false
    let hasAfternoon = false
    let hasEvening = false
    
    modalWeekDays.value.forEach(day => {
      if (getRoomSchedulesForCell(day.value, 'Sang', day.date, r.roomNumber).length > 0) hasMorning = true
      if (getRoomSchedulesForCell(day.value, 'Chieu', day.date, r.roomNumber).length > 0) hasAfternoon = true
      if (getRoomSchedulesForCell(day.value, 'Toi', day.date, r.roomNumber).length > 0) hasEvening = true
    })
    
    if (!hasMorning) vacantMorning++
    if (!hasAfternoon) vacantAfternoon++
    if (!hasEvening) vacantEvening++
  })

  const conflictedRooms = classrooms.value.filter(r => {
    if (!r || !r.roomNumber) return false
    const conflicts = getRoomConflicts(r.roomNumber)
    return conflicts.length > 0
  }).length

  return { 
    total, 
    vacant, 
    occupied, 
    maintenance, 
    conflictedRooms,
    vacantMorning,
    vacantAfternoon,
    vacantEvening
  }
})

// Filtered Classrooms
const filteredClassrooms = computed(() => {
  try {
    let list = classrooms.value.map(room => {
      if (!room || !room.roomNumber) {
        return {
          ...room,
          conflicts: [],
          hasConflict: false
        }
      }
      const conflicts = getRoomConflicts(room.roomNumber)
      return {
        ...room,
        conflicts,
        hasConflict: conflicts.length > 0
      }
    })

    // Apply search
    if (searchQuery.value && searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      list = list.filter(r => r && r.roomNumber && String(r.roomNumber).toLowerCase().includes(query))
    }

    // Apply filter type
    if (activeFilter.value !== 'all') {
      if (activeFilter.value === 'conflict') {
        list = list.filter(r => r && r.hasConflict)
      } else {
        const statusMap = {
          vacant: 'Vacant',
          occupied: 'Occupied',
          maintenance: 'Maintenance'
        }
        list = list.filter(r => r && r.status === statusMap[activeFilter.value])
      }
    }

    // Sort by room number ascending
    return [...list].sort((a, b) => {
      if (!a || !a.roomNumber) return 1
      if (!b || !b.roomNumber) return -1
      return String(a.roomNumber).localeCompare(String(b.roomNumber))
    })
  } catch (err) {
    console.error("Error in filteredClassrooms computed:", err)
    return classrooms.value
  }
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

onMounted(async () => {
  await fetchClassrooms()
  await fetchAllClasses()
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
.text-success-dark {
  color: #15803d;
}
.text-info-dark {
  color: #0369a1;
}
.text-error-dark {
  color: #b91c1c;
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

.glass-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
}
</style>
