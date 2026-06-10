<template>
  <div class="space-y-stack-lg animate-fade-in">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="font-headline-lg text-headline-lg text-primary-container flex items-center gap-3">
          <span class="material-symbols-outlined text-[32px]">manage_accounts</span>
          Quản lý tài khoản
        </h2>
        <p class="font-body-lg text-on-surface-variant mt-1">Quản lý và cấp tài khoản cho người dùng, giáo viên và học viên.</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openImportDialog"
          class="px-5 py-3 rounded-lg border border-white/60 text-primary-container font-semibold text-[14px] hover:bg-white/40 shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">publish</span>
          Nhập từ Excel
        </button>
        <button
          @click="openCreateDialog"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-semibold text-[14px] shadow-sm hover:bg-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[20px]">person_add</span>
          Thêm tài khoản
        </button>
      </div>
    </section>

    <!-- Stats Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      <div v-for="stat in stats" :key="stat.label" class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div :class="[stat.bgColor, stat.textColor, 'w-12 h-12 rounded-lg flex items-center justify-center shrink-0']">
          <span class="material-symbols-outlined">{{ stat.icon }}</span>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary-container">{{ stat.value }}</div>
          <div class="text-[12px] text-on-surface-variant font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] p-4 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative flex-1 w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          v-model="filters.search"
          @input="debouncedFetch"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 pl-10 pr-4 py-2.5 rounded-lg text-body-sm text-primary-container focus:outline-none focus:border-primary-container/30 transition-colors"
          placeholder="Tìm kiếm theo tên hoặc tài khoản..."
          type="text"
        />
      </div>
      <div class="relative w-full sm:w-48">
        <select
          v-model="filters.role"
          @change="fetchData"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 appearance-none pl-4 pr-10 py-2.5 rounded-lg text-body-sm text-primary-container bg-transparent cursor-pointer focus:outline-none focus:border-primary-container/30 transition-colors"
        >
          <option :value="null">Tất cả vai trò</option>
          <option value="Admin">Quản trị viên</option>
          <option value="GiaoVien">Giáo viên</option>
          <option value="HocVien">Học viên</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
      <div class="relative w-full sm:w-48">
        <select
          v-model="filters.isActive"
          @change="fetchData"
          class="w-full bg-primary-container/[0.05] border border-primary-container/10 appearance-none pl-4 pr-10 py-2.5 rounded-lg text-body-sm text-primary-container bg-transparent cursor-pointer focus:outline-none focus:border-primary-container/30 transition-colors"
        >
          <option :value="null">Tất cả trạng thái</option>
          <option :value="true">Hoạt động</option>
          <option :value="false">Đang khóa</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </section>

    <!-- User Table Section -->
    <section class="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.05)] overflow-hidden">
      <!-- Loading skeleton -->
      <div v-if="store.loading" class="p-12 space-y-4 animate-pulse">
        <div class="h-8 bg-surface-container-high rounded w-full"></div>
        <div class="h-12 bg-surface-container-high rounded w-full" v-for="i in 5" :key="i"></div>
      </div>

      <!-- Data Table -->
      <div v-else-if="store.users.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-high">
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Người dùng</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Tài khoản</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Vai trò</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Email</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Điện thoại</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap">Trạng thái</th>
              <th class="py-4 px-6 text-label-caps font-label-caps text-on-surface-variant uppercase whitespace-nowrap text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="font-body-sm text-body-sm">
            <tr
              v-for="user in store.users"
              :key="user.userId"
              class="border-t border-white/40 hover:bg-white/30 transition-colors group cursor-pointer"
              @click="openEditDialog(user)"
            >
              <!-- User name -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div :class="[getRoleBgClass(user.role), 'w-9 h-9 rounded-lg flex items-center justify-center shrink-0']">
                    <span class="material-symbols-outlined text-[18px]">{{ getRoleIcon(user.role) }}</span>
                  </div>
                  <span class="font-semibold text-primary-container">{{ user.fullName }}</span>
                </div>
              </td>
              <!-- Username -->
              <td class="py-4 px-6 font-mono text-on-surface-variant font-semibold text-[13px]">@{{ user.username }}</td>
              <!-- Role badge -->
              <td class="py-4 px-6">
                <span :class="[getRoleBadgeClass(user.role), 'px-2.5 py-1 rounded-full text-[11px] font-bold border']">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <!-- Email -->
              <td class="py-4 px-6 text-on-surface-variant truncate max-w-[200px]" :title="user.email">{{ user.email || '—' }}</td>
              <!-- Phone -->
              <td class="py-4 px-6 font-semibold text-primary-container">{{ user.phone || '—' }}</td>
              <!-- Status -->
              <td class="py-4 px-6">
                <span :class="[user.isActive ? 'text-emerald-600' : 'text-error']" class="flex items-center gap-1.5 font-semibold text-[13px]">
                  <span :class="[user.isActive ? 'bg-emerald-500' : 'bg-error', 'w-1.5 h-1.5 rounded-full']"></span>
                  {{ user.isActive ? 'Hoạt động' : 'Vô hiệu hóa' }}
                </span>
              </td>
              <!-- Actions -->
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="openEditDialog(user)"
                    class="w-8.5 h-8.5 rounded-lg bg-on-tertiary-container/10 hover:bg-on-tertiary-container/20 text-on-tertiary-container flex items-center justify-center transition-colors cursor-pointer"
                    title="Sửa thông tin"
                  >
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    @click.stop="toggleActive(user)"
                    :disabled="user.userId === authStore.currentUser?.userId"
                    :class="[
                      user.isActive ? 'text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-error bg-error/10 hover:bg-error/20',
                      'w-8.5 h-8.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
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
      </div>

      <!-- Empty state -->
      <div v-else class="p-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-primary-container/30 text-[64px] mb-4">group</span>
        <p class="text-body-lg text-on-surface-variant font-medium">Chưa tìm thấy người dùng nào</p>
        <button @click="openCreateDialog" class="mt-4 px-6 py-2 bg-on-tertiary-container/10 text-on-tertiary-container border border-on-tertiary-container/20 rounded-lg font-semibold hover:bg-on-tertiary-container/20 transition-all cursor-pointer">
          Thêm tài khoản mới
        </button>
      </div>
    </section>

    <!-- Create/Edit Modal -->
    <!-- Create/Edit Modal -->
    <teleport to="body">
      <div v-if="dialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-md w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
          <!-- Title -->
          <div class="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface/10">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">{{ isEdit ? 'manage_accounts' : 'person_add' }}</span>
              {{ isEdit ? 'Cập nhật tài khoản' : 'Đăng ký tài khoản mới' }}
            </h3>
            <button @click="dialog = false" class="text-on-surface-variant hover:text-primary-container cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Form Body -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            <!-- Username (Readonly on edit) -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Tên đăng nhập (Username) *</label>
              <input
                v-model="formData.username"
                type="text"
                :disabled="isEdit"
                class="w-full bg-white border border-outline-variant/60 px-4 py-2.5 rounded-lg text-body-sm text-primary-container disabled:bg-slate-100/85 disabled:text-on-surface-variant/60 disabled:cursor-not-allowed focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                placeholder="Nhập tên đăng nhập"
              />
              <p v-if="validationErrors.username" class="text-error text-[11px] font-semibold">{{ validationErrors.username }}</p>
            </div>

            <!-- Password (Required on create, optional on edit) -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">
                Mật khẩu {{ isEdit ? '(Để trống nếu không đổi)' : '*' }}
              </label>
              <input
                v-model="formData.password"
                type="password"
                class="w-full bg-white border border-outline-variant/60 px-4 py-2.5 rounded-lg text-body-sm text-primary-container focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                placeholder="Nhập mật khẩu truy cập"
              />
              <p v-if="validationErrors.password" class="text-error text-[11px] font-semibold">{{ validationErrors.password }}</p>
            </div>

            <!-- Full Name -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Họ và tên *</label>
              <input
                v-model="formData.fullName"
                type="text"
                class="w-full bg-white border border-outline-variant/60 px-4 py-2.5 rounded-lg text-body-sm text-primary-container focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                placeholder="Nhập họ và tên người dùng"
              />
              <p v-if="validationErrors.fullName" class="text-error text-[11px] font-semibold">{{ validationErrors.fullName }}</p>
            </div>

            <!-- Contact info -->
            <div class="space-y-4">
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary-container">Email</label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full bg-white border border-outline-variant/60 px-4 py-2.5 rounded-lg text-body-sm text-primary-container focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                  placeholder="example@gmail.com"
                />
              </div>
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary-container">Số điện thoại</label>
                <input
                  v-model="formData.phone"
                  type="text"
                  class="w-full bg-white border border-outline-variant/60 px-4 py-2.5 rounded-lg text-body-sm text-primary-container focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                  placeholder="0912..."
                />
              </div>
            </div>

            <!-- Role selection -->
            <div class="space-y-1">
              <label class="text-body-sm font-semibold text-primary-container">Vai trò (Role) *</label>
              <div class="relative">
                <select
                  v-model="formData.role"
                  class="w-full bg-white border border-outline-variant/60 appearance-none px-4 py-2.5 rounded-lg text-body-sm text-primary-container bg-transparent cursor-pointer focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                >
                  <option value="Admin">Quản trị viên (Admin)</option>
                  <option value="GiaoVien">Giáo viên (Teacher)</option>
                  <option value="HocVien">Học viên (Student)</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface/30">
            <button
              @click="dialog = false"
              class="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              @click="saveForm"
              :disabled="saving || !isFormValid"
              class="px-5 py-2.5 rounded-lg bg-primary-container text-white font-semibold text-[13px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Excel Import Modal -->
    <teleport to="body">
      <div v-if="importDialog" class="fixed inset-0 glass-backdrop z-[9999] flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-[24px] border border-white/50 shadow-[0_20px_40px_rgba(0,31,63,0.12)] max-w-2xl w-full rounded-2xl overflow-hidden animate-scale-in flex flex-col">
          <!-- Title -->
          <div class="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface/10">
            <h3 class="font-title-md text-[18px] font-bold text-primary-container flex items-center gap-2">
              <span class="material-symbols-outlined text-on-tertiary-container">publish</span>
              Nhập tài khoản từ Excel / CSV
            </h3>
            <button @click="importDialog = false" :disabled="importing" class="text-on-surface-variant hover:text-primary-container cursor-pointer disabled:opacity-50">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            <!-- Setup Options -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-body-sm font-semibold text-primary-container">Vai trò tài khoản mặc định *</label>
                <div class="relative">
                  <select
                    v-model="defaultImportRole"
                    :disabled="importing || importRows.length > 0"
                    class="w-full bg-white border border-outline-variant/60 appearance-none px-4 py-2.5 rounded-lg text-body-sm text-primary-container bg-transparent cursor-pointer disabled:bg-slate-100/80 disabled:text-on-surface-variant/60 disabled:cursor-not-allowed focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15 transition-all"
                  >
                    <option value="HocVien">Học viên (Student)</option>
                    <option value="GiaoVien">Giáo viên (Teacher)</option>
                    <option value="Admin">Quản trị viên (Admin)</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
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
              <span class="material-symbols-outlined text-[48px] text-on-tertiary-container/60 mb-2">excel</span>
              <p class="text-body-sm font-semibold text-primary-container">Kéo thả file Excel hoặc CSV tại đây</p>
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
                  <span class="text-body-sm font-semibold text-primary-container truncate max-w-[250px]">{{ importFile?.name }}</span>
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
                <div class="flex justify-between text-[11px] font-bold text-primary-container">
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
                  <tbody class="font-body-sm text-[12px]">
                    <tr
                      v-for="(row, idx) in importRows"
                      :key="idx"
                      class="border-t border-outline-variant/10 hover:bg-white/20 transition-colors"
                    >
                      <td class="py-2 px-4 font-semibold text-primary-container font-mono">{{ row.username || '—' }}</td>
                      <td class="py-2 px-4 text-primary-container">{{ row.fullName || '—' }}</td>
                      <td class="py-2 px-4 text-on-surface-variant text-[11px]">
                        <div>{{ row.email || '—' }}</div>
                        <div class="font-semibold">{{ row.phone }}</div>
                      </td>
                      <td class="py-2 px-4 text-right">
                        <span
                          v-if="row.uploadStatus === 'success'"
                          class="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20"
                        >
                          Thành công
                        </span>
                        <span
                          v-else-if="row.uploadStatus === 'error'"
                          class="text-error bg-error/10 px-2 py-0.5 rounded text-[10px] font-bold border border-error/20"
                          :title="row.feedback"
                        >
                          Lỗi
                        </span>
                        <span
                          v-else-if="row.uploadStatus === 'uploading'"
                          class="text-on-tertiary-container bg-on-tertiary-container/10 px-2 py-0.5 rounded text-[10px] font-bold border border-on-tertiary-container/20 animate-pulse"
                        >
                          Đang tạo...
                        </span>
                        <span
                          v-else
                          :class="[
                            row.isValid ? 'text-slate-600 bg-slate-500/10 border-slate-500/20' : 'text-error bg-error/10 border-error/20',
                            'px-2 py-0.5 rounded text-[10px] font-bold border'
                          ]"
                        >
                          {{ row.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface/30">
            <button
              @click="importDialog = false"
              :disabled="importing"
              class="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-[13px] hover:bg-white/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              Đóng
            </button>
            <button
              v-if="importRows.length > 0"
              @click="startImport"
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
const isEdit = ref(false)
const saving = ref(false)

const formData = ref({
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  role: 'HocVien',
})

const filters = ref({
  search: '',
  role: null,
  isActive: null,
})

const validationErrors = ref({
  username: '',
  password: '',
  fullName: '',
})

// Validate inputs
const isFormValid = computed(() => {
  const isUsernameOk = formData.value.username.trim().length >= 3
  const isFullNameOk = formData.value.fullName.trim().length > 0
  const isPasswordOk = isEdit.value ? true : (formData.value.password && formData.value.password.length >= 6)
  return isUsernameOk && isFullNameOk && isPasswordOk
})

watch(() => formData.value.username, (val) => {
  validationErrors.value.username = val.trim().length < 3 ? 'Tên đăng nhập phải có ít nhất 3 ký tự' : ''
})

watch(() => formData.value.password, (val) => {
  if (isEdit.value) {
    validationErrors.value.password = (val && val.length < 6) ? 'Mật khẩu phải có ít nhất 6 ký tự' : ''
  } else {
    validationErrors.value.password = (!val || val.length < 6) ? 'Mật khẩu là bắt buộc và phải có ít nhất 6 ký tự' : ''
  }
})

watch(() => formData.value.fullName, (val) => {
  validationErrors.value.fullName = val.trim().length === 0 ? 'Họ và tên không được để trống' : ''
})

// Compute statistics
const stats = computed(() => [
  {
    label: 'Tổng người dùng',
    value: store.userStats?.totalCount || store.totalCount,
    icon: 'group',
    bgColor: 'bg-primary-container/10',
    textColor: 'text-primary-container'
  },
  {
    label: 'Quản trị viên',
    value: store.userStats?.adminCount ?? store.users.filter(u => u.role === 'Admin').length,
    icon: 'admin_panel_settings',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600'
  },
  {
    label: 'Giáo viên',
    value: store.userStats?.teacherCount ?? store.users.filter(u => u.role === 'GiaoVien').length,
    icon: 'cognition',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600'
  },
  {
    label: 'Học viên',
    value: store.userStats?.studentCount ?? store.users.filter(u => u.role === 'HocVien').length,
    icon: 'translate',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-600'
  },
])

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchData, 300)
}

async function fetchData() {
  try {
    store.fetchUserStats() // Load role counts in background
    await store.fetchUsers({
      search: filters.value.search || undefined,
      role: filters.value.role || undefined,
      isActive: filters.value.isActive ?? undefined,
      page: 1,
      pageSize: 1000,
    })
  } catch (e) {
    showSnackbar('Lỗi tải dữ liệu người dùng', 'error')
  }
}

function openCreateDialog() {
  isEdit.value = false
  validationErrors.value = { username: '', password: '', fullName: '' }
  formData.value = {
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'HocVien',
  }
  dialog.value = true
}

function openEditDialog(user) {
  isEdit.value = true
  validationErrors.value = { username: '', password: '', fullName: '' }
  formData.value = {
    userId: user.userId,
    username: user.username,
    password: '', // blank by default on edit
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }
  dialog.value = true
}

async function saveForm() {
  if (!isFormValid.value) return
  saving.value = true
  try {
    if (isEdit.value) {
      // Create payload without password if blank
      const payload = { ...formData.value }
      if (!payload.password) {
        delete payload.password
      }
      await store.updateUser(formData.value.userId, payload)
      showSnackbar('Cập nhật tài khoản thành công', 'success')
    } else {
      const createdUser = await store.createUser(formData.value)
      if (formData.value.role === 'HocVien') {
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
          console.error('Error auto-creating student profile:', studentErr)
          showSnackbar('Đăng ký tài khoản thành công nhưng không thể tự động tạo hồ sơ học viên.', 'warning')
        }
      }
      showSnackbar('Đăng ký tài khoản thành công', 'success')
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
    const data = await store.toggleUserActive(user.userId)
    showSnackbar(data.message, 'success')
  } catch (e) {
    showSnackbar(e.response?.data?.message || 'Không thể thay đổi trạng thái tài khoản', 'error')
  }
}

function getRoleIcon(role) {
  const map = { Admin: 'admin_panel_settings', GiaoVien: 'cognition', HocVien: 'translate' }
  return map[role] || 'person'
}

function getRoleBgClass(role) {
  const map = { Admin: 'bg-purple-500/10 text-purple-600', GiaoVien: 'bg-amber-500/10 text-amber-600', HocVien: 'bg-sky-500/10 text-sky-600' }
  return map[role] || 'bg-primary-container/10 text-primary-container'
}

function getRoleLabel(role) {
  const map = { Admin: 'Quản trị', GiaoVien: 'Giáo viên', HocVien: 'Học viên' }
  return map[role] || role
}

function getRoleBadgeClass(role) {
  const map = { Admin: 'status-completed', GiaoVien: 'status-inprogress', HocVien: 'status-opened' }
  return map[role] || 'status-completed'
}

// Excel Import logic
const importDialog = ref(false)
const importFile = ref(null)
const importRows = ref([])
const importing = ref(false)
const importProgress = ref(0)
const defaultImportRole = ref('HocVien')
const dragOver = ref(false)

const openImportDialog = () => {
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
        showSnackbar('File Excel trống', 'error')
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

        let status = 'Sẵn sàng'
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

onMounted(fetchData)
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
