<template>
  <div class="space-y-stack-lg animate-fade-in pb-16">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-sm">
          <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">manage_accounts</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg font-bold text-on-background tracking-tight">Quản lý tài khoản</h2>
          <p class="font-body-sm text-body-sm text-secondary mt-1">Quản lý, phân quyền và giám sát tất cả người dùng trong hệ thống.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openImportDialog"
          class="glass-button-secondary px-5 py-2.5 rounded-lg font-semibold text-[13px] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span class="material-symbols-outlined text-[18px]">publish</span>
          Nhập từ Excel
        </button>
        <button
          @click="openCreateDialog"
          class="bg-primary text-on-primary font-body-sm text-[13px] font-semibold px-5 py-2.5 rounded-lg shadow-sm shadow-primary/20 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Tạo tài khoản
        </button>
      </div>
    </section>

    <!-- Stats Cards Row -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      <div v-for="stat in stats" :key="stat.label" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div :class="[stat.bgColor, stat.textColor, 'w-12 h-12 rounded-lg flex items-center justify-center shrink-0']">
          <span class="material-symbols-outlined">{{ stat.icon }}</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-[12px] text-on-surface-variant font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Filters & Search Bar -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-sm shadow-primary/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="relative w-full md:w-80">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input
          v-model="filters.search"
          @input="debouncedFetch"
          class="w-full pl-10 pr-10 py-2.5 bg-primary-container/[0.05] border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-sm text-body-sm text-on-surface placeholder:text-outline transition-all"
          placeholder="Tìm theo tên, username..."
          type="text"
        />
        <button
          v-if="filters.search"
          @click="filters.search = ''; fetchData();"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center w-6 h-6 rounded-full hover:bg-primary-container/10"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div class="relative w-full sm:w-48">
          <select
            v-model="filters.role"
            @change="fetchData"
            class="w-full bg-primary-container/[0.05] border border-outline-variant/30 appearance-none pl-4 pr-10 py-2.5 rounded-lg font-body-sm text-body-sm text-on-surface bg-transparent cursor-pointer focus:outline-none focus:border-primary transition-colors"
          >
            <option :value="null">Tất cả vai trò</option>
            <option value="Admin">Quản trị viên (Admin)</option>
            <option value="GiaoVien">Giáo viên (Teacher)</option>
            <option value="HocVien">Học viên (Student)</option>
          </select>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
        </div>
        <div class="relative w-full sm:w-48">
          <select
            v-model="filters.isActive"
            @change="fetchData"
            class="w-full bg-primary-container/[0.05] border border-outline-variant/30 appearance-none pl-4 pr-10 py-2.5 rounded-lg font-body-sm text-body-sm text-on-surface bg-transparent cursor-pointer focus:outline-none focus:border-primary transition-colors"
          >
            <option :value="null">Tất cả trạng thái</option>
            <option :value="true">Hoạt động</option>
            <option :value="false">Đang khóa</option>
          </select>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
        </div>
      </div>
    </section>

    <!-- Data Table Card -->
    <div class="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-md shadow-primary/5 rounded-xl overflow-hidden flex flex-col relative">
      <div class="absolute inset-x-0 top-0 h-px bg-white/80 z-10 pointer-events-none"></div>
      
      <div class="overflow-x-auto">
        <div v-if="store.loading" class="p-12 space-y-4 animate-pulse">
          <div class="h-8 bg-surface-container-high rounded w-full"></div>
          <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 5" :key="i"></div>
        </div>

        <table v-else-if="store.users.length > 0" class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-outline-variant/20 bg-surface-container-low/50">
              <th class="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant w-16 text-center">STT</th>
              <th class="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">Tên đăng nhập</th>
              <th class="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">Họ tên</th>
              <th class="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">Email</th>
              <th class="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">SĐT</th>
              <th class="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant w-32">Vai trò</th>
              <th class="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant w-36">Trạng thái</th>
              <th class="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant w-24 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10 font-body-sm text-body-sm text-on-surface">
            <tr
              v-for="(user, index) in store.users"
              :key="user.userId"
              class="hover:bg-primary-fixed/5 transition-colors group"
            >
              <td class="py-3.5 px-4 text-center text-secondary">{{ (pagination.page - 1) * pagination.pageSize + index + 1 }}</td>
              <td class="py-3.5 px-4 font-mono font-semibold text-primary">@{{ user.username }}</td>
              <td class="py-3.5 px-4 font-bold">{{ user.fullName }}</td>
              <td class="py-3.5 px-4 text-secondary truncate max-w-[180px]" :title="user.email">{{ user.email || '—' }}</td>
              <td class="py-3.5 px-4 font-medium">{{ user.phone || '—' }}</td>
              <td class="py-3.5 px-4">
                <span :class="[getRoleBadgeClass(user.role), 'px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border']">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-1.5">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="[user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-error shadow-[0_0_8px_rgba(186,26,26,0.3)]']"
                  ></div>
                  <span :class="[user.isActive ? 'text-secondary' : 'text-error', 'text-[13px] font-semibold']">
                    {{ user.isActive ? 'Hoạt động' : 'Đang khóa' }}
                  </span>
                </div>
              </td>
              <td class="py-3.5 px-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openEditDialog(user)"
                    class="w-8 h-8 rounded-md bg-white/50 border border-outline-variant/20 flex items-center justify-center text-secondary hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    @click="toggleActive(user)"
                    :disabled="user.userId === authStore.currentUser?.userId"
                    :class="[
                      user.isActive ? 'text-emerald-600 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5' : 'text-error border-error/20 hover:border-error/50 hover:bg-error/5',
                      'w-8 h-8 rounded-md bg-white/50 border flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
                    ]"
                    :title="user.isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'"
                  >
                    <span class="material-symbols-outlined text-[18px]">
                      {{ user.isActive ? 'lock_open' : 'lock' }}
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-else class="p-12 text-center flex flex-col items-center justify-center bg-white/30">
          <span class="material-symbols-outlined text-primary-container/20 text-[64px] mb-4">group</span>
          <p class="text-body-lg text-on-surface-variant font-medium">Chưa tìm thấy người dùng nào</p>
        </div>
      </div>

      <!-- Pagination bottom bar -->
      <div v-if="store.users.length > 0" class="border-t border-outline-variant/20 p-4 bg-surface-container-lowest/30 flex items-center justify-between mt-auto">
        <span class="font-body-sm text-body-sm text-secondary">Hiển thị {{ (pagination.page - 1) * pagination.pageSize + 1 }} - {{ Math.min(pagination.page * pagination.pageSize, totalAccountsCount) }} của {{ totalAccountsCount }} tài khoản</span>
        <div class="flex items-center gap-1">
          <button
            @click="prevPage"
            :disabled="pagination.page === 1"
            class="w-8 h-8 rounded flex items-center justify-center text-secondary hover:bg-white/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span class="px-3 font-semibold text-primary text-sm">Trang {{ pagination.page }} / {{ totalUsersPages }}</span>
          <button
            @click="nextPage"
            :disabled="pagination.page >= totalUsersPages"
            class="w-8 h-8 rounded flex items-center justify-center text-secondary hover:bg-white/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal Dialog (Bento-style layout screen d9bc93786a1943f4835f3b66b947a2b1) -->
    <teleport to="body">
      <div v-if="dialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <!-- Glass Modal Container -->
        <div class="w-full max-w-2xl bg-white/95 backdrop-blur-[32px] border border-white/60 rounded-[20px] shadow-[0px_24px_48px_-12px_rgba(0,6,19,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] overflow-hidden flex flex-col transform scale-100 opacity-100 transition-all duration-300">
          <!-- Modal Header -->
          <div class="px-8 py-5 border-b border-outline-variant/20 flex justify-between items-center bg-gradient-to-b from-white/50 to-transparent">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'manage_accounts' : 'person_add' }}</span>
              </div>
              <h2 class="font-headline-lg-mobile text-[22px] text-on-surface font-bold tracking-tight">
                {{ isEdit ? 'Cập nhật tài khoản' : 'Đăng ký tài khoản mới' }}
              </h2>
            </div>
            <button @click="dialog = false" class="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:text-on-surface hover:bg-primary/5 transition-colors cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body (Bento Form Grid) -->
          <div class="p-8 overflow-y-auto max-h-[70vh]">
            <form class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" @submit.prevent>
              <!-- Họ tên (spans 2 columns) -->
              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="font-title-md text-[13px] text-on-surface-variant font-bold ml-1">Họ tên *</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] group-focus-within:text-on-tertiary-container transition-colors">badge</span>
                  <input
                    v-model="formData.fullName"
                    class="w-full bg-primary/[0.03] border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                    placeholder="Nhập họ và tên đầy đủ"
                    type="text"
                  />
                </div>
                <p v-if="validationErrors.fullName" class="text-error text-[11px] font-semibold mt-0.5 ml-1">{{ validationErrors.fullName }}</p>
              </div>

              <!-- Username (Read-only on edit) -->
              <div class="flex flex-col gap-1.5">
                <label class="font-title-md text-[13px] text-on-surface-variant font-bold ml-1">Username *</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] group-focus-within:text-on-tertiary-container transition-colors">alternate_email</span>
                  <input
                    v-model="formData.username"
                    :disabled="isEdit"
                    class="w-full bg-primary/[0.03] border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] disabled:bg-slate-100 disabled:opacity-75 disabled:cursor-not-allowed"
                    placeholder="Tên đăng nhập"
                    type="text"
                  />
                </div>
                <p v-if="validationErrors.username" class="text-error text-[11px] font-semibold mt-0.5 ml-1">{{ validationErrors.username }}</p>
              </div>

              <!-- Vai trò / Role -->
              <div class="flex flex-col gap-1.5">
                <label class="font-title-md text-[13px] text-on-surface-variant font-bold ml-1">Vai trò *</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] group-focus-within:text-on-tertiary-container transition-colors z-10">admin_panel_settings</span>
                  <select
                    v-model="formData.role"
                    class="w-full bg-primary/[0.03] border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-10 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] appearance-none cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="GiaoVien">Giáo viên</option>
                    <option value="HocVien">Học viên</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] pointer-events-none">expand_more</span>
                </div>
              </div>

              <!-- Email (spans 2 columns) -->
              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="font-title-md text-[13px] text-on-surface-variant font-bold ml-1">Email</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] group-focus-within:text-on-tertiary-container transition-colors">mail</span>
                  <input
                    v-model="formData.email"
                    class="w-full bg-primary/[0.03] border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                    placeholder="Địa chỉ email liên hệ"
                    type="email"
                  />
                </div>
                <p v-if="validationErrors.email" class="text-error text-[11px] font-semibold mt-0.5 ml-1">{{ validationErrors.email }}</p>
              </div>

              <!-- SĐT -->
              <div class="flex flex-col gap-1.5">
                <label class="font-title-md text-[13px] text-on-surface-variant font-bold ml-1">Số điện thoại</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] group-focus-within:text-on-tertiary-container transition-colors">call</span>
                  <input
                    v-model="formData.phone"
                    class="w-full bg-primary/[0.03] border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                    placeholder="Số điện thoại liên hệ"
                    type="text"
                  />
                </div>
              </div>

              <!-- Mật khẩu / Password -->
              <div class="flex flex-col gap-1.5">
                <label class="font-title-md text-[13px] text-on-surface-variant font-bold ml-1">
                  Mật khẩu {{ isEdit ? '(Để trống nếu giữ nguyên)' : '*' }}
                </label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] group-focus-within:text-on-tertiary-container transition-colors">key</span>
                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full bg-primary/[0.03] border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-10 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                    placeholder="Nhập mật khẩu tài khoản"
                  />
                  <button
                    @click="showPassword = !showPassword"
                    aria-label="Toggle password visibility"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-outline/60 hover:text-on-surface transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                    type="button"
                  >
                    <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
                  </button>
                </div>
                <p v-if="validationErrors.password" class="text-error text-[11px] font-semibold mt-0.5 ml-1">{{ validationErrors.password }}</p>
              </div>

              <!-- Lecturer profile additions: Specialization & Degree (only shown when role is GiaoVien) -->
              <template v-if="formData.role === 'GiaoVien'">
                <div class="flex flex-col gap-1.5 border-t border-outline-variant/20 pt-4 md:col-span-2 mt-2">
                  <h4 class="text-body-sm font-bold text-on-tertiary-container flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[18px]">workspace_premium</span>
                    Thông tin chuyên môn Giảng viên
                  </h4>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-title-md text-[13px] text-on-surface-variant font-bold ml-1">Chuyên môn giảng dạy</label>
                  <div class="relative group">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] group-focus-within:text-on-tertiary-container transition-colors">history_edu</span>
                    <input
                      v-model="formData.specialization"
                      class="w-full bg-primary/[0.03] border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                      placeholder="Ví dụ: Python, IELTS, React..."
                      type="text"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-title-md text-[13px] text-on-surface-variant font-bold ml-1">Học vị / Bằng cấp</label>
                  <div class="relative group">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-[20px] group-focus-within:text-on-tertiary-container transition-colors">assignment</span>
                    <input
                      v-model="formData.degree"
                      class="w-full bg-primary/[0.03] border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                      placeholder="Ví dụ: Thạc sĩ, Tiến sĩ..."
                      type="text"
                    />
                  </div>
                </div>
              </template>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="px-8 py-5 border-t border-outline-variant/20 bg-primary/[0.02] flex justify-end gap-3 items-center">
            <button
              @click="dialog = false"
              class="px-5 py-2.5 font-title-md text-[14px] font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
              type="button"
            >
              Hủy
            </button>
            <button
              @click="saveForm"
              :disabled="saving || !isFormValid"
              class="px-6 py-2.5 font-title-md text-[14px] font-semibold bg-on-tertiary-container text-white rounded-lg shadow-[0px_4px_12px_rgba(43,131,255,0.25)] hover:bg-[#1a70ea] transform hover:-translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              type="button"
            >
              <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
              {{ isEdit ? 'Cập nhật' : 'Tạo tài khoản' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Excel Import Modal drawer -->
    <teleport to="body">
      <div v-if="importDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-2xl w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
          <!-- Title -->
          <div class="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface/10">
            <h3 class="font-title-md text-[18px] font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">publish</span>
              Nhập tài khoản từ Excel / CSV
            </h3>
            <button @click="importDialog = false" :disabled="importing" class="text-on-surface-variant hover:text-primary cursor-pointer disabled:opacity-50">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            <!-- Setup Options -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary">Vai trò tài khoản mặc định *</label>
                <div class="relative">
                  <select
                    v-model="defaultImportRole"
                    :disabled="importing || importRows.length > 0"
                    class="w-full bg-primary-container/[0.05] border border-outline-variant/30 appearance-none px-4 py-2.5 rounded-lg text-body-sm text-primary bg-transparent cursor-pointer disabled:bg-slate-100/80 disabled:cursor-not-allowed focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="HocVien">Học viên (Student)</option>
                    <option value="GiaoVien">Giáo viên (Teacher)</option>
                    <option value="Admin">Quản trị viên (Admin)</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>
              
              <div class="flex items-end">
                <button
                  @click="downloadTemplate"
                  class="w-full py-2.5 rounded-lg border border-on-tertiary-container/30 text-on-tertiary-container bg-on-tertiary-container/5 font-semibold text-body-sm hover:bg-on-tertiary-container/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">download</span>
                  Tải file mẫu (.CSV)
                </button>
              </div>
            </div>

            <!-- Drag and Drop File Zone -->
            <div
              v-if="importRows.length === 0"
              @dragover.prevent="dragOver = true"
              @dragleave.prevent="dragOver = false"
              @drop.prevent="handleFileDrop"
              :class="[
                dragOver ? 'border-on-tertiary-container bg-on-tertiary-container/5' : 'border-outline-variant/50 bg-surface/30',
                'border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all min-h-[180px]'
              ]"
            >
              <span class="material-symbols-outlined text-[48px] text-on-tertiary-container/60 mb-2">upload_file</span>
              <p class="text-body-sm font-semibold text-primary">Kéo thả file Excel hoặc CSV tại đây</p>
              <p class="text-[12px] text-on-surface-variant/80 mt-1 mb-4">Hỗ trợ các file định dạng .xlsx, .xls, .csv</p>
              
              <label class="px-5 py-2 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors cursor-pointer active:scale-95 flex items-center gap-1">
                <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileSelect" />
                Chọn file từ thiết bị
              </label>
            </div>

            <!-- Parsed File Details -->
            <div v-else class="space-y-4">
              <div class="flex justify-between items-center bg-white/20 p-3 rounded-lg border border-outline-variant/20">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-emerald-600">description</span>
                  <span class="text-body-sm font-semibold text-primary truncate max-w-[250px]">{{ importFile?.name }}</span>
                  <span class="text-[11px] text-on-surface-variant/80">({{ importRows.length }} dòng)</span>
                </div>
                <button
                  v-if="!importing"
                  @click="importRows = []"
                  class="text-error hover:underline text-[12px] font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[16px]">delete</span>
                  Chọn file khác
                </button>
              </div>

              <!-- Upload progress bar -->
              <div v-if="importing || importProgress > 0" class="space-y-1.5">
                <div class="flex justify-between text-[11px] font-bold text-primary">
                  <span>Tiến trình tải lên:</span>
                  <span>{{ importProgress }}%</span>
                </div>
                <div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden border border-outline-variant/10">
                  <div class="bg-on-tertiary-container h-full rounded-full transition-all duration-300" :style="`width: ${importProgress}%`"></div>
                </div>
              </div>

              <!-- Preview Data Table -->
              <div class="border border-outline-variant/30 rounded-xl overflow-hidden shadow-inner max-h-[30vh] overflow-y-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-surface-container-high">
                      <th class="py-2.5 px-4 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Tên đăng nhập</th>
                      <th class="py-2.5 px-4 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Họ và tên</th>
                      <th class="py-2.5 px-4 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Email/SĐT</th>
                      <th class="py-2.5 px-4 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant/10 font-body-sm text-body-sm">
                    <tr v-for="(row, idx) in importRows" :key="idx" :class="[row.isValid ? '' : 'bg-red-50']">
                      <td class="py-2 px-4 font-mono">@{{ row.username }}</td>
                      <td class="py-2 px-4 font-semibold">{{ row.fullName }}</td>
                      <td class="py-2 px-4 text-secondary">
                        <div>{{ row.email || '—' }}</div>
                        <div class="text-[10px]">{{ row.phone || '—' }}</div>
                      </td>
                      <td class="py-2 px-4 text-right">
                        <span
                          v-if="row.uploadStatus === 'success'"
                          class="text-emerald-600 font-bold text-xs"
                        >Thành công</span>
                        <span
                          v-else-if="row.uploadStatus === 'error'"
                          class="text-error font-bold text-xs"
                          :title="row.feedback"
                        >Lỗi: {{ row.feedback }}</span>
                        <span
                          v-else-if="row.uploadStatus === 'uploading'"
                          class="text-on-tertiary-container animate-pulse text-xs font-bold"
                        >Đang lưu...</span>
                        <span
                          v-else
                          :class="[row.isValid ? 'text-secondary' : 'text-error font-semibold']"
                          class="text-xs"
                        >{{ row.status }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="px-6 py-4 border-t border-outline-variant/20 bg-surface/30 flex justify-end gap-3 items-center">
            <button
              @click="importDialog = false"
              :disabled="importing"
              class="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              @click="startImport"
              v-if="importRows.length > 0"
              :disabled="importing || importRows.filter(r => r.isValid && r.uploadStatus !== 'success').length === 0"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span v-if="importing" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Bắt đầu nhập ({{ importRows.filter(r => r.isValid && r.uploadStatus !== 'success').length }} dòng)
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useUserStore, useAuthStore, useStudentStore } from '../../stores'
import * as XLSX from 'xlsx'

const store = useUserStore()
const authStore = useAuthStore()
const studentStore = useStudentStore()
const showSnackbar = inject('showSnackbar')

const dialog = ref(false)
const showPassword = ref(false)
const isEdit = ref(false)
const saving = ref(false)

const formData = ref({
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  role: 'HocVien',
  specialization: '',
  degree: ''
})

const filters = ref({
  search: '',
  role: null,
  isActive: null
})

const pagination = ref({
  page: 1,
  pageSize: 10
})

const totalAccountsCount = ref(0)
const totalUsersPages = computed(() => Math.ceil(totalAccountsCount.value / pagination.value.pageSize) || 1)

const validationErrors = ref({
  username: '',
  password: '',
  fullName: '',
  email: ''
})

// Locally calculated statistics
const stats = computed(() => {
  const users = store.users || []
  return [
    {
      label: 'Tổng số tài khoản',
      value: totalAccountsCount.value,
      icon: 'manage_accounts',
      bgColor: 'bg-primary-container/10',
      textColor: 'text-primary-container'
    },
    {
      label: 'Đang hoạt động',
      value: users.filter(u => u.isActive).length,
      icon: 'check_circle',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-700'
    },
    {
      label: 'Đang khóa',
      value: users.filter(u => !u.isActive).length,
      icon: 'lock',
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-700'
    },
    {
      label: 'Giáo viên phụ trách',
      value: users.filter(u => u.role === 'GiaoVien').length,
      icon: 'person_4',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-700'
    }
  ]
})

// Validators
const isFormValid = computed(() => {
  const isUsernameOk = isEdit.value || (formData.value.username.trim().length >= 3)
  const isPasswordOk = isEdit.value || (formData.value.password && formData.value.password.length >= 6)
  const isNameOk = formData.value.fullName.trim().length > 0
  const isEmailOk = formData.value.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
  
  return isUsernameOk && isPasswordOk && isNameOk && isEmailOk
})

watch(() => formData.value.username, (val) => {
  if (!isEdit.value) {
    validationErrors.value.username = val.trim().length < 3 ? 'Tên đăng nhập phải có ít nhất 3 ký tự' : ''
  }
})

watch(() => formData.value.password, (val) => {
  if (!isEdit.value) {
    validationErrors.value.password = !val || val.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : ''
  }
})

watch(() => formData.value.fullName, (val) => {
  validationErrors.value.fullName = val.trim().length === 0 ? 'Họ tên không được để trống' : ''
})

watch(() => formData.value.email, (val) => {
  if (val !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    validationErrors.value.email = 'Email không đúng định dạng'
  } else {
    validationErrors.value.email = ''
  }
})

// Search debounce
let debounceTimer = null
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchData, 300)
}

async function fetchData() {
  try {
    await store.fetchUsers({
      search: filters.value.search || undefined,
      role: filters.value.role || undefined,
      isActive: filters.value.isActive ?? undefined,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    // Also update total count
    totalAccountsCount.value = store.totalCount || store.users.length
  } catch (e) {
    showSnackbar('Lỗi tải danh sách tài khoản', 'error')
  }
}

function prevPage() {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchData()
  }
}

function nextPage() {
  if (pagination.value.page < totalUsersPages.value) {
    pagination.value.page++
    fetchData()
  }
}

// Dialog Actions
function openCreateDialog() {
  isEdit.value = false
  showPassword.value = false
  validationErrors.value = { username: '', password: '', fullName: '', email: '' }
  formData.value = {
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'HocVien',
    specialization: '',
    degree: ''
  }
  dialog.value = true
}

function openEditDialog(user) {
  isEdit.value = true
  showPassword.value = false
  validationErrors.value = { username: '', password: '', fullName: '', email: '' }
  formData.value = {
    userId: user.userId,
    username: user.username,
    password: '',
    fullName: user.fullName,
    email: user.email || '',
    phone: user.phone || '',
    role: user.role,
    specialization: user.specialization || '',
    degree: user.degree || ''
  }
  dialog.value = true
}

async function saveForm() {
  if (!isFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      const payload = {
        fullName: formData.value.fullName,
        email: formData.value.email || null,
        phone: formData.value.phone || null,
        role: formData.value.role,
        specialization: formData.value.role === 'GiaoVien' ? (formData.value.specialization || null) : null,
        degree: formData.value.role === 'GiaoVien' ? (formData.value.degree || null) : null
      }
      if (formData.value.password) {
        payload.password = formData.value.password
      }
      await store.updateUser(formData.value.userId, payload)
      showSnackbar('Cập nhật tài khoản thành công', 'success')
    } else {
      const created = await store.createUser({
        username: formData.value.username,
        password: formData.value.password,
        fullName: formData.value.fullName,
        email: formData.value.email || null,
        phone: formData.value.phone || null,
        role: formData.value.role,
        specialization: formData.value.role === 'GiaoVien' ? (formData.value.specialization || null) : null,
        degree: formData.value.role === 'GiaoVien' ? (formData.value.degree || null) : null
      })

      // If HocVien created, auto enroll in student service
      if (formData.value.role === 'HocVien') {
        try {
          await studentStore.createStudent({
            userId: created.userId,
            fullName: created.fullName,
            dateOfBirth: new Date().toISOString(),
            gender: 'Nam',
            phone: created.phone || null,
            email: created.email || null,
            address: ''
          })
        } catch (studentErr) {
          console.error('Error auto-creating student profile:', studentErr)
        }
      }
      showSnackbar('Tạo tài khoản mới thành công', 'success')
    }
    dialog.value = false
    fetchData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Có lỗi xảy ra khi lưu tài khoản', 'error')
  } finally {
    saving.value = false
  }
}

async function toggleActive(user) {
  try {
    const res = await store.toggleUserActive(user.userId)
    showSnackbar(res.message, 'success')
    fetchData()
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Không thể thay đổi trạng thái tài khoản', 'error')
  }
}

// ----------------------------------------------------
// EXCEL BATCH IMPORT LOGIC
// ----------------------------------------------------
const importDialog = ref(false)
const importFile = ref(null)
const importRows = ref([])
const importing = ref(false)
const importProgress = ref(0)
const defaultImportRole = ref('HocVien')
const dragOver = ref(false)

function openImportDialog() {
  importFile.value = null
  importRows.value = []
  importing.value = false
  importProgress.value = 0
  defaultImportRole.value = 'HocVien'
  importDialog.value = true
}

const handleFileDrop = (e) => {
  dragOver.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const processFile = (file) => {
  importFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      if (json.length === 0) {
        showSnackbar('File Excel rỗng', 'error')
        return
      }

      // Read headers (first row)
      const headers = json[0].map(h => String(h || '').trim().toLowerCase())
      
      const usernameIdx = headers.findIndex(h => h.includes('tên đăng nhập') || h.includes('username') || h.includes('tai khoan') || h.includes('tài khoản'))
      const passwordIdx = headers.findIndex(h => h.includes('mật khẩu') || h.includes('password') || h.includes('mat khau'))
      const fullNameIdx = headers.findIndex(h => h.includes('họ và tên') || h.includes('fullname') || h.includes('ho ten') || h.includes('họ tên') || h.includes('tên'))
      const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('thư điện tử'))
      const phoneIdx = headers.findIndex(h => h.includes('số điện thoại') || h.includes('phone') || h.includes('sđt') || h.includes('sdt'))

      if (usernameIdx === -1 || fullNameIdx === -1) {
        showSnackbar('File Excel thiếu các cột bắt buộc: Tên đăng nhập, Họ và tên', 'error')
        return
      }

      const rows = []
      for (let i = 1; i < json.length; i++) {
        const row = json[i]
        if (!row || row.length === 0) continue

        const username = row[usernameIdx] ? String(row[usernameIdx]).trim() : ''
        const password = (passwordIdx !== -1 && row[passwordIdx]) ? String(row[passwordIdx]).trim() : '123456'
        const fullName = row[fullNameIdx] ? String(row[fullNameIdx]).trim() : ''
        const email = (emailIdx !== -1 && row[emailIdx]) ? String(row[emailIdx]).trim() : ''
        const phone = (phoneIdx !== -1 && row[phoneIdx]) ? String(row[phoneIdx]).trim() : ''

        if (!username && !fullName) continue

        let isValid = true
        let errorMsg = ''

        if (!username) {
          errorMsg = 'Thiếu tên đăng nhập'
          isValid = false
        } else if (username.length < 3) {
          errorMsg = 'Tên đăng nhập tối thiểu 3 ký tự'
          isValid = false
        }

        if (isValid && !fullName) {
          errorMsg = 'Thiếu họ và tên'
          isValid = false
        }

        if (isValid && password && password.length < 6) {
          errorMsg = 'Mật khẩu tối thiểu 6 ký tự'
          isValid = false
        }

        rows.push({
          username,
          password,
          fullName,
          email,
          phone,
          status: errorMsg || 'Sẵn sàng',
          isValid,
          uploadStatus: 'pending',
          feedback: ''
        })
      }

      importRows.value = rows
      if (rows.length === 0) {
        showSnackbar('Không tìm thấy dòng dữ liệu nào hợp lệ', 'warning')
      } else {
        showSnackbar(`Đọc thành công ${rows.length} dòng dữ liệu`, 'success')
      }
    } catch (err) {
      console.error(err)
      showSnackbar('Lỗi đọc file Excel. Vui lòng kiểm tra lại định dạng.', 'error')
    }
  }
  reader.readAsArrayBuffer(file)
}

const startImport = async () => {
  const validRows = importRows.value.filter(r => r.isValid)
  if (validRows.length === 0) {
    showSnackbar('Không có dòng nào hợp lệ để nhập', 'error')
    return
  }

  importing.value = true
  importProgress.value = 0
  let completed = 0

  for (let i = 0; i < importRows.value.length; i++) {
    const row = importRows.value[i]
    if (!row.isValid) continue

    row.uploadStatus = 'uploading'
    row.status = 'Đang xử lý...'

    try {
      const createdUser = await store.createUser({
        username: row.username,
        password: row.password,
        fullName: row.fullName,
        email: row.email || null,
        phone: row.phone || null,
        role: defaultImportRole.value
      })
      
      if (defaultImportRole.value === 'HocVien') {
        try {
          await studentStore.createStudent({
            userId: createdUser.userId,
            fullName: createdUser.fullName,
            dateOfBirth: new Date().toISOString(),
            gender: 'Nam',
            phone: createdUser.phone || null,
            email: createdUser.email || null,
            address: ''
          })
        } catch (studentErr) {
          console.error('Error auto-creating student profile on import:', studentErr)
        }
      }
      row.uploadStatus = 'success'
      row.status = 'Thành công'
      row.feedback = ''
    } catch (err) {
      row.uploadStatus = 'error'
      row.status = 'Thất bại'
      row.feedback = err.response?.data?.message || 'Lỗi hệ thống'
    }

    completed++
    importProgress.value = Math.round((completed / validRows.length) * 100)
  }

  importing.value = false
  showSnackbar(`Đã hoàn thành nhập dữ liệu!`, 'success')
  fetchData()
}

const downloadTemplate = () => {
  const headers = ['Tên đăng nhập', 'Mật khẩu', 'Họ và tên', 'Email', 'Số điện thoại']
  const sampleData = [
    ['hocvien_nguyena', '123456', 'Nguyễn Văn A', 'nguyenvana@gmail.com', '0912345678'],
    ['giao_vien_tranb', '654321', 'Trần Thị B', 'tranthib@gmail.com', '0987654321']
  ]
  
  const content = [headers, ...sampleData].map(row => row.join(',')).join('\n')
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'Template_Import_TaiKhoan.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Role helpers
function getRoleLabel(role) {
  const map = { Admin: 'Quản trị viên', GiaoVien: 'Giáo viên', HocVien: 'Học viên' }
  return map[role] || role
}

function getRoleBadgeClass(role) {
  const map = {
    Admin: 'bg-primary-container text-on-primary-container border-primary-container/20',
    GiaoVien: 'bg-purple-100 text-purple-800 border-purple-200',
    HocVien: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim/20'
  }
  return map[role] || 'bg-slate-100 text-slate-800 border-slate-200'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
.glass-input {
  background: rgba(0, 31, 63, 0.05);
  border: 1px solid rgba(0, 31, 63, 0.1);
  transition: all 0.3s ease;
}
.glass-input:focus {
  border-color: #2b83ff;
  box-shadow: 0 0 0 2px rgba(43, 131, 255, 0.2);
}
</style>
